import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'

const products = [
  {
    id: 1,
    title: 'Ceramic Mug',
    description: 'A sturdy mug.',
    price: 9.99,
    thumbnail: 'https://example.com/mug.png',
  },
  {
    id: 2,
    title: 'Canvas Tote',
    description: 'A useful bag.',
    price: 16,
    thumbnail: 'https://example.com/tote.png',
  },
]

function mockProducts(items = products) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ products: items }),
  }))
}

async function openShop(user) {
  await user.click(screen.getByRole('link', { name: 'Explore the shop' }))
  await screen.findByRole('heading', { name: 'Ceramic Mug' })
}

beforeEach(() => {
  window.history.replaceState({}, '', '/')
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('shopping flow', () => {
  it('shows a loading state until products arrive', async () => {
    let resolveRequest
    vi.stubGlobal('fetch', vi.fn(() => new Promise((resolve) => { resolveRequest = resolve })))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Explore the shop' }))

    expect(screen.getByText('Loading products…')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Ceramic Mug' })).not.toBeInTheDocument()
    resolveRequest({ ok: true, json: async () => ({ products }) })
    expect(await screen.findByRole('heading', { name: 'Ceramic Mug' })).toBeInTheDocument()
    expect(screen.queryByText('Loading products…')).not.toBeInTheDocument()
  })

  it('shows the home page and loads products when a shopper opens the shop', async () => {
    mockProducts()
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find your next favorite thing.' })).toBeInTheDocument()
    await openShop(user)

    expect(screen.getByRole('heading', { name: 'Shop' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Canvas Tote' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Ceramic Mug' })).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products', expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it('adds a chosen quantity and updates the cart count and total as quantities change', async () => {
    mockProducts()
    const user = userEvent.setup()
    render(<App />)
    await openShop(user)

    const mugCard = screen.getByRole('heading', { name: 'Ceramic Mug' }).closest('article')
    const quantity = within(mugCard).getByRole('spinbutton', { name: 'Quantity' })
    await user.click(within(mugCard).getByRole('button', { name: 'Decrease Ceramic Mug quantity' }))
    expect(quantity).toHaveValue(1)
    await user.click(within(mugCard).getByRole('button', { name: 'Increase Ceramic Mug quantity' }))
    expect(quantity).toHaveValue(2)
    await user.clear(quantity)
    await user.type(quantity, '3')
    await user.click(within(mugCard).getByRole('button', { name: 'Add to Cart' }))

    const cartLink = within(screen.getByRole('navigation')).getByRole('link', { name: /Cart/ })
    expect(cartLink).toHaveTextContent('3')
    await user.click(cartLink)

    expect(screen.getByRole('heading', { name: 'Your cart' })).toBeInTheDocument()
    expect(screen.getByText('Total: $29.97')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Increase Ceramic Mug quantity' }))
    expect(screen.getByText('Total: $39.96')).toBeInTheDocument()
    expect(cartLink).toHaveTextContent('4')
    await user.click(screen.getByRole('button', { name: 'Decrease Ceramic Mug quantity' }))
    expect(screen.getByText('Total: $29.97')).toBeInTheDocument()
    expect(cartLink).toHaveTextContent('3')
    await user.click(screen.getByRole('button', { name: 'Remove Ceramic Mug' }))
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
    expect(cartLink).not.toHaveTextContent('3')
  })

  it('combines repeated additions and removes an item when its quantity reaches zero', async () => {
    mockProducts()
    const user = userEvent.setup()
    render(<App />)
    await openShop(user)

    const mugCard = screen.getByRole('heading', { name: 'Ceramic Mug' }).closest('article')
    await user.click(within(mugCard).getByRole('button', { name: 'Add to Cart' }))
    await user.click(within(mugCard).getByRole('button', { name: 'Add to Cart' }))
    await user.click(within(screen.getByRole('navigation')).getByRole('link', { name: /Cart/ }))

    expect(screen.getByText('Total: $19.98')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Decrease Ceramic Mug quantity' }))
    await user.click(screen.getByRole('button', { name: 'Decrease Ceramic Mug quantity' }))
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument()
  })

  it('keeps other products in the cart when one product is removed', async () => {
    mockProducts()
    const user = userEvent.setup()
    render(<App />)
    await openShop(user)

    for (const name of ['Ceramic Mug', 'Canvas Tote']) {
      const card = screen.getByRole('heading', { name }).closest('article')
      await user.click(within(card).getByRole('button', { name: 'Add to Cart' }))
    }
    const cartLink = within(screen.getByRole('navigation')).getByRole('link', { name: /Cart/ })
    expect(cartLink).toHaveTextContent('2')
    await user.click(cartLink)
    expect(screen.getByText('Total: $25.99')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Remove / }).map((button) => button.textContent.trim())).toEqual(['Remove', 'Remove'])

    await user.click(screen.getByRole('button', { name: 'Remove Ceramic Mug' }))
    expect(screen.queryByText('Ceramic Mug')).not.toBeInTheDocument()
    expect(screen.getByText('Canvas Tote')).toBeInTheDocument()
    expect(screen.getByText('Total: $16.00')).toBeInTheDocument()
    expect(cartLink).toHaveTextContent('1')
  })

  it('does not add an empty, zero, or fractional quantity', async () => {
    mockProducts()
    const user = userEvent.setup()
    render(<App />)
    await openShop(user)

    const mugCard = screen.getByRole('heading', { name: 'Ceramic Mug' }).closest('article')
    const quantity = within(mugCard).getByRole('spinbutton', { name: 'Quantity' })
    const addButton = within(mugCard).getByRole('button', { name: 'Add to Cart' })
    const cartLink = within(screen.getByRole('navigation')).getByRole('link', { name: /Cart/ })

    for (const invalidValue of ['', '0', '1.5']) {
      await user.clear(quantity)
      if (invalidValue) await user.type(quantity, invalidValue)
      await user.click(addButton)
      expect(cartLink).not.toHaveTextContent(/[0-9]/)
    }
  })

  it('keeps cart contents when visiting another page', async () => {
    mockProducts()
    const user = userEvent.setup()
    render(<App />)
    await openShop(user)
    const mugCard = screen.getByRole('heading', { name: 'Ceramic Mug' }).closest('article')
    await user.click(within(mugCard).getByRole('button', { name: 'Add to Cart' }))

    const navigation = screen.getByRole('navigation')
    await user.click(within(navigation).getByRole('link', { name: 'Home' }))
    await user.click(within(navigation).getByRole('link', { name: /Cart/ }))
    expect(screen.getByText('Total: $9.99')).toBeInTheDocument()
  })

  it('shows an error and retries when the product request fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ products }) })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Explore the shop' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Products could not be loaded.')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { name: 'Ceramic Mug' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('shows an empty state when the API has no products', async () => {
    mockProducts([])
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Explore the shop' }))

    expect(await screen.findByText('No products are available right now.')).toBeInTheDocument()
  })

  it('shows an error for a malformed product response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ products: null }),
    }))
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Explore the shop' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Products could not be loaded.')
  })

  it('does not crash when a product in the response is incomplete', async () => {
    mockProducts([null])
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Explore the shop' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Products could not be loaded.')
  })
})

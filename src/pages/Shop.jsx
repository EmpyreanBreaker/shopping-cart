import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'

function Shop({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestVersion, setRequestVersion] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      try {
        const response = await fetch('https://dummyjson.com/products', {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Request failed: ${response.status}`)

        const data = await response.json()
        if (!Array.isArray(data.products)) throw new Error('Invalid product data')

        setProducts(data.products)
        setError('')
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError('Products could not be loaded. Please try again.')
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [requestVersion])

  function retry() {
    setLoading(true)
    setError('')
    setRequestVersion((version) => version + 1)
  }

  function handleAdd(product, quantity) {
    onAddToCart(product, quantity)
    setMessage(`Added ${quantity} ${product.title}${quantity === 1 ? '' : 's'} to your cart.`)
  }

  return (
    <section className="shop-page">
      <h1>Shop</h1>
      <p>Choose a quantity, then add your favorites to your cart.</p>
      <p className="cart-message" role="status">{message}</p>
      {loading && <p role="status">Loading products…</p>}
      {!loading && error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" className="retry-button" onClick={retry}>Try again</button>
        </div>
      )}
      {!loading && !error && (products.length === 0 ? (
        <p>No products are available right now.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
        </div>
      ))}
    </section>
  )
}

export default Shop

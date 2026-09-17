import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import products from '../data/products.js'

function Shop({ onAddToCart }) {
  const [message, setMessage] = useState('')

  function handleAdd(product, quantity) {
    onAddToCart(product, quantity)
    setMessage(`Added ${quantity} ${product.title}${quantity === 1 ? '' : 's'} to your cart.`)
  }

  return (
    <section className="shop-page">
      <h1>Shop</h1>
      <p>Choose a quantity, then add your favorites to your cart.</p>
      <p className="cart-message" role="status">{message}</p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </div>
    </section>
  )
}

export default Shop

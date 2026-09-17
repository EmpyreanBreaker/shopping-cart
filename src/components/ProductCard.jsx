import { useState } from 'react'

function ProductCard({ product, onAdd }) {
  const [quantity, setQuantity] = useState('1')
  const parsedQuantity = Number(quantity)
  const validQuantity = Number.isSafeInteger(parsedQuantity) && parsedQuantity >= 1

  function adjustQuantity(change) {
    setQuantity(String(validQuantity ? Math.max(1, parsedQuantity + change) : 1))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validQuantity) return
    onAdd(product, parsedQuantity)
  }

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
      </div>
      <div className="product-details">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor={`quantity-${product.id}`}>Quantity</label>
        <div className="quantity-controls">
          <button type="button" aria-label={`Decrease ${product.title} quantity`} onClick={() => adjustQuantity(-1)}>−</button>
          <input
            id={`quantity-${product.id}`}
            type="number"
            min="1"
            step="1"
            required
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <button type="button" aria-label={`Increase ${product.title} quantity`} onClick={() => adjustQuantity(1)}>+</button>
        </div>
        <button className="add-button" type="submit">Add to Cart</button>
      </form>
    </article>
  )
}

export default ProductCard

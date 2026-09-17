import { Link } from 'react-router-dom'

function Cart({ items, onChangeQuantity, onRemove }) {
  return (
    <section className="cart-page">
      <h1>Your cart</h1>
      {items.length === 0 ? (
        <div className="empty-cart">
          <span aria-hidden="true">◌</span>
          <p>Your cart is empty.</p>
          <Link className="button-link" to="/shop">Browse the shop <span aria-hidden="true">↗</span></Link>
        </div>
      ) : (
        <ul className="cart-list">
          {items.map(({ product, quantity }) => (
            <li key={product.id}>
              <div className="cart-item-details">
                <strong>{product.title}</strong>
                <span>${product.price.toFixed(2)} each</span>
              </div>
              <div className="cart-quantity" aria-label={`${product.title} quantity`}>
                <button
                  type="button"
                  aria-label={`Decrease ${product.title} quantity`}
                  onClick={() => onChangeQuantity(product.id, -1)}
                >−</button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${product.title} quantity`}
                  onClick={() => onChangeQuantity(product.id, 1)}
                >+</button>
              </div>
              <span className="cart-item-total">${(product.price * quantity).toFixed(2)}</span>
              <button
                type="button"
                className="remove-button"
                aria-label={`Remove ${product.title}`}
                onClick={() => onRemove(product.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {items.length > 0 && (
        <p className="cart-total">
          Total: ${items.reduce((total, { product, quantity }) => total + product.price * quantity, 0).toFixed(2)}
        </p>
      )}
    </section>
  )
}

export default Cart

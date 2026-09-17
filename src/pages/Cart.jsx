function Cart({ items, onRemove }) {
  return (
    <section>
      <h1>Your cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-list">
          {items.map(({ product, quantity }) => (
            <li key={product.id}>
              <span>{product.title}</span>
              <span>Quantity: {quantity}</span>
              <button type="button" className="remove-button" onClick={() => onRemove(product.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Cart

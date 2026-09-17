import { NavLink } from 'react-router-dom'

function Header({ cartCount }) {
  return (
    <header className="site-header">
      <NavLink className="site-title" to="/">Shopping Cart</NavLink>
      <nav aria-label="Main navigation">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart">
          Cart {cartCount > 0 && <span className="cart-count" aria-label={`${cartCount} items in cart`}>{cartCount}</span>}
        </NavLink>
      </nav>
    </header>
  )
}

export default Header

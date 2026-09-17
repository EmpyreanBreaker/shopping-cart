import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cart.jsx'

function App() {
  const [cart, setCart] = useState({})
  const cartCount = Object.values(cart).reduce((total, item) => total + item.quantity, 0)

  function addToCart(product, quantity) {
    setCart((currentCart) => ({
      ...currentCart,
      [product.id]: {
        product,
        quantity: (currentCart[product.id]?.quantity ?? 0) + quantity,
      },
    }))
  }

  function removeFromCart(productId) {
    setCart((currentCart) => {
      const updatedCart = { ...currentCart }
      delete updatedCart[productId]
      return updatedCart
    })
  }

  function changeCartQuantity(productId, change) {
    setCart((currentCart) => {
      const item = currentCart[productId]
      if (!item) return currentCart

      const quantity = item.quantity + change
      const updatedCart = { ...currentCart }
      if (quantity <= 0) {
        delete updatedCart[productId]
      } else {
        updatedCart[productId] = { ...item, quantity }
      }
      return updatedCart
    })
  }

  return (
    <BrowserRouter>
      <Header cartCount={cartCount} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
          <Route path="/cart" element={
            <Cart
              items={Object.values(cart)}
              onChangeQuantity={changeCartQuantity}
              onRemove={removeFromCart}
            />
          } />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

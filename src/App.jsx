import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Cart from './pages/Cart.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

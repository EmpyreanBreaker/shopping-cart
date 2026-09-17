import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="home-hero">
      <div>
        <p className="eyebrow">A little shop for everyday things</p>
        <h1>Find your next favorite thing.</h1>
        <p className="home-intro">
          Browse a small collection of useful goods, pick what you love,
          and add it to your cart.
        </p>
        <Link className="button-link" to="/shop">Explore the shop</Link>
      </div>
      <div className="home-art" aria-hidden="true">
        <span>☕</span><span>📓</span><span>🪴</span>
      </div>
    </section>
  )
}

export default Home

import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="home-hero">
      <div className="hero-copy">
        <p className="eyebrow">A little shop for everyday things</p>
        <h1>Find your next <em>favorite thing.</em></h1>
        <p className="home-intro">
          Browse a small collection of useful goods, pick what you love,
          and add it to your cart.
        </p>
        <Link className="button-link" to="/shop">Explore the shop <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  )
}

export default Home

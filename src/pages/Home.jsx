import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
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
        <div className="home-art" aria-hidden="true">
          <span>☕</span><span>📓</span><span>🪴</span>
        </div>
      </section>
      <section className="home-highlights" aria-label="Why shop with us">
        <div><span aria-hidden="true">✦</span><h2>Discover</h2><p>Explore a little bit of everything.</p></div>
        <div><span aria-hidden="true">◌</span><h2>Choose</h2><p>Pick the right amount for you.</p></div>
        <div><span aria-hidden="true">↗</span><h2>Enjoy</h2><p>Keep your favorites together in one cart.</p></div>
      </section>
    </>
  )
}

export default Home

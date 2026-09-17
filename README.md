# Shopping Cart

A React shopping cart project based on [The Odin Project assignment](https://www.theodinproject.com/lessons/node-path-react-new-shopping-cart).

## Structure

- `src/App.jsx` defines the Home, Shop, and Cart routes.
- `src/components/Header.jsx` holds the navigation shown on every page.
- `src/pages/` holds one component per page.
- `src/components/ProductCard.jsx` handles product details, quantity selection, and adding items.
- The shop fetches products from [DummyJSON](https://dummyjson.com/docs/products).
- Cart state lives above the routes in `App.jsx` so the shop and cart can share it.

## Development

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

The React Testing Library suite covers browsing products, cart quantity changes, and API loading outcomes.

## Deploy to Netlify

Set the build command to `npm run build` and the publish directory to `dist`. The `public/_redirects` rule sends direct visits to `/shop` and `/cart` through the React app.

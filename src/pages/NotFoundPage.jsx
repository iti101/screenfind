import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="page page--center">
      <h1>Page not found</h1>
      <Link className="button" to="/">
        Back home
      </Link>
    </section>
  )
}

export default NotFoundPage

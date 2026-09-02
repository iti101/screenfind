import Navbar from '../components/Navbar.jsx'
import HeroSect from './HeroSect.jsx'
import SearchSect from './SearchSect.jsx'
import ContactSect from './ContactSect.jsx'
import './landingPage.css'

function LandingPage() {
  return (
    <main className="landing-page">
      <Navbar />
      <HeroSect />
      <SearchSect />
      <ContactSect />
    </main>
  )
}

export default LandingPage

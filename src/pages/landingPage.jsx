import HeroSect from './HeroSect.jsx'
import ContentSect from './ContentSect.jsx'
import ContactSect from './ContactSect.jsx'
import './landingPage.css'

function LandingPage() {
  return (
    <main className="landing-page">
      <HeroSect />
      <ContentSect />
      <ContactSect />
    </main>
  )
}

export default LandingPage

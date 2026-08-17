import Section from './Section'
import './landingPage.css'

const SECTIONS = [
    { id: 'hero', label: 'Home', variant: 'hero' },
    { id: 'content', label: 'Features', variant: 'content' },
    { id: 'contact', label: 'Contact', variant: 'contact' },
]

function LandingPage() {
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="scroll-container">
            <nav className="dot-nav" aria-label="Section navigation">
                {SECTIONS.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        className="dot"
                        aria-label={label}
                        onClick={() => scrollTo(id)}
                    />
                ))}
            </nav>

            {SECTIONS.map(({ id, label, variant }) => (
                <Section key={id} id={id} title={label} variant={variant} />
            ))}
        </div>
    )
}

export default LandingPage

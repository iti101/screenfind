import './HeroSect.css'
import './ContentSect.css'
import './ContactSect.css'

function Section({ id, title, variant }) {
    return (
        <section id={id} className={`${variant}-section`}>
            <h1>{title}</h1>
        </section>
    )
}

export default Section

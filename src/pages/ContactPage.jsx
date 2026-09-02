import './ContactPage.css'

function ContactPage() {
  return (
    <section className="contact-page">
      <h1 className="contact-page__title">Contact</h1>
      <p className="contact-page__text">
        Questions about ScreenFind? Reach out at{' '}
        <a href="mailto:hello@screenfind.nl">hello@screenfind.nl</a>.
      </p>
    </section>
  )
}

export default ContactPage

function StatusMessage({ children, variant = 'default', role }) {
  const className =
    variant === 'error'
      ? 'status-message status-message--error'
      : 'status-message'

  return (
    <p className={className} role={role} aria-live="polite">
      {children}
    </p>
  )
}

export default StatusMessage

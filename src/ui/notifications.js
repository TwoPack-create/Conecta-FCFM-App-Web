const NOTIFICATION_DURATION = 3200;

export const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification status--${type}`;
  notification.textContent = message;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '80px',
    right: '16px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: '500',
    zIndex: '3000',
    transform: 'translateX(120%)',
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    maxWidth: '320px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    opacity: '0'
  });

  const palette = {
    success: 'var(--color-success, #1f9254)',
    error: 'var(--color-error, #c0152f)',
    warning: 'var(--color-warning, #e68161)',
    info: 'var(--color-info, #21808d)'
  };

  notification.style.backgroundColor = palette[type] || palette.info;

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
    notification.style.opacity = '1';
  });

  setTimeout(() => {
    notification.style.transform = 'translateX(120%)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 320);
  }, NOTIFICATION_DURATION);
};

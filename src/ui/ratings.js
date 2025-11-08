import { rateCompletedTrip } from '../state/app-state.js';
import { showNotification } from './notifications.js';

export const initializeRatings = () => {
  document.addEventListener('click', handleStarClick);
};

const handleStarClick = event => {
  const star = event.target.closest('.star');
  if (!star) return;

  const container = star.closest('.star-rating');
  if (!container) return;

  const ratingValue = parseInt(star.getAttribute('data-rating'), 10);
  const tripId = container.getAttribute('data-trip-id');
  if (!ratingValue || !tripId) {
    return;
  }

  const stars = Array.from(container.querySelectorAll('.star'));
  stars.forEach(item => item.classList.remove('active'));
  stars
    .filter(item => parseInt(item.getAttribute('data-rating'), 10) <= ratingValue)
    .forEach(item => item.classList.add('active'));

  rateCompletedTrip(tripId, ratingValue);
  showNotification(
    `Calificacion registrada: ${ratingValue} estrella${ratingValue > 1 ? 's' : ''}.`,
    'success'
  );
};

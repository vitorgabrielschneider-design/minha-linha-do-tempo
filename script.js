const filterButtons = document.querySelectorAll('.filter-button');
const timelineEvents = [...document.querySelectorAll('.timeline-event')];
const countNumber = document.querySelector('.count-number');
const countLabel = document.querySelector('.count-label');
const emptyState = document.querySelector('.empty-state');

function filterTimeline(category) {
  const matchingEvents = timelineEvents.filter(
    (event) => category === 'all' || event.dataset.category === category,
  );
  const lastVisibleEvent = matchingEvents.at(-1);

  timelineEvents.forEach((event) => {
    const isVisible = matchingEvents.includes(event);
    event.classList.toggle('is-hidden', !isVisible);
    event.classList.toggle('is-last-visible', isVisible && event === lastVisibleEvent);
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  const count = matchingEvents.length;
  countNumber.textContent = String(count);
  countLabel.textContent = count === 1 ? 'momento' : 'momentos';
  emptyState.hidden = count !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterTimeline(button.dataset.filter));
});

filterTimeline('all');

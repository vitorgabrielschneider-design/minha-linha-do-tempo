const filterButtons = document.querySelectorAll('.filter-button');
const timelineItems = document.querySelectorAll('.timeline-item');
const eventCount = document.querySelector('.event-count');

function filterTimeline(category) {
  let visibleEvents = 0;

  timelineItems.forEach((item) => {
    const shouldShow = category === 'all' || item.dataset.category === category;
    item.classList.toggle('is-hidden', !shouldShow);
    if (shouldShow) visibleEvents += 1;
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  eventCount.innerHTML = `<strong>${visibleEvents}</strong> ${visibleEvents === 1 ? 'momento' : 'momentos'}`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterTimeline(button.dataset.filter));
});

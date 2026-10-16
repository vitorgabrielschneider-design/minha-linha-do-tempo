const filterButtons = [...document.querySelectorAll('.filter-button')];
const timelineEntries = [...document.querySelectorAll('.timeline-entry')];
const countNumber = document.querySelector('.count-number');
const countLabel = document.querySelector('.count-label');
const emptyState = document.querySelector('.empty-state');

function setEntryOpen(entry, isOpen) {
  const detail = entry.querySelector('.memory-detail');
  const orbButton = entry.querySelector('.memory-orb');
  const detailButton = entry.querySelector('.detail-button');

  detail.hidden = !isOpen;
  orbButton.setAttribute('aria-expanded', String(isOpen));
  detailButton.setAttribute('aria-expanded', String(isOpen));
  detailButton.querySelector('span:first-child').textContent = isOpen
    ? 'Recolher este ponto'
    : 'Explorar este ponto';
  entry.classList.toggle('is-open', isOpen);
  entry.classList.toggle('is-selected', isOpen);
}

function toggleEntry(entry) {
  const shouldOpen = !entry.classList.contains('is-open');

  timelineEntries.forEach((item) => setEntryOpen(item, false));
  if (shouldOpen) setEntryOpen(entry, true);
}

function filterTimeline(category) {
  const visibleEntries = timelineEntries.filter(
    (entry) => category === 'all' || entry.dataset.category === category,
  );
  const lastVisibleEntry = visibleEntries.at(-1);

  timelineEntries.forEach((entry) => {
    const isVisible = visibleEntries.includes(entry);
    entry.classList.toggle('is-hidden', !isVisible);
    entry.classList.toggle('is-last-visible', isVisible && entry === lastVisibleEntry);
    if (!isVisible) setEntryOpen(entry, false);
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  countNumber.textContent = String(visibleEntries.length);
  countLabel.textContent = visibleEntries.length === 1 ? 'marco' : 'marcos';
  emptyState.hidden = visibleEntries.length !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterTimeline(button.dataset.filter));
});

timelineEntries.forEach((entry) => {
  entry.querySelectorAll('.memory-orb, .detail-button').forEach((button) => {
    button.addEventListener('click', () => toggleEntry(entry));
  });
});

filterTimeline('all');

const STORAGE_KEY = 'minha-historia-em-orbita:marcos:v1';
const MAX_IMPORT_SIZE = 1024 * 1024;
const MAX_MILESTONES = 200;

const PHASES = {
  past: { label: 'Passado', emptyDate: 'DATA A PREENCHER', order: 0 },
  present: { label: 'Presente', emptyDate: 'AGORA', order: 1 },
  future: { label: 'Futuro', emptyDate: 'PREVISÃO', order: 2 },
};

const STARTER_MILESTONES = [
  {
    id: 'example-past-achievement',
    period: 'past',
    date: '',
    title: 'Uma conquista que celebro',
    description: 'Exemplo editável: registre aqui algo que você já conquistou — um projeto, um aprendizado ou uma vitória importante para você.',
    isExample: true,
  },
  {
    id: 'example-past-memory',
    period: 'past',
    date: '',
    title: 'Um momento que me marcou',
    description: 'Exemplo editável: conte sobre uma experiência que ajudou a formar quem você é. Troque este texto por uma lembrança sua.',
    isExample: true,
  },
  {
    id: 'example-present',
    period: 'present',
    date: '',
    title: 'O que estou construindo agora',
    description: 'Exemplo editável: escreva sobre o que você está vivendo, aprendendo ou desenvolvendo neste momento.',
    isExample: true,
  },
  {
    id: 'example-future',
    period: 'future',
    date: '',
    title: 'Uma conquista que quero alcançar',
    description: 'Exemplo editável: adicione um objetivo ou sonho que gostaria de realizar. Você pode incluir uma data prevista.',
    isExample: true,
  },
];

const filterButtons = [...document.querySelectorAll('.filter-button')];
const tabButtons = [...document.querySelectorAll('.nav-tab')];
const tabPanels = [...document.querySelectorAll('.page-panel')];
const timelineList = document.querySelector('.timeline-list');
const countNumber = document.querySelector('.count-number');
const countLabel = document.querySelector('.count-label');
const emptyState = document.querySelector('.empty-state');
const formToggle = document.querySelector('#form-toggle');
const formWrap = document.querySelector('#editor-form-wrap');
const form = document.querySelector('#milestone-form');
const formStatus = document.querySelector('#timeline-status');
const saveButton = document.querySelector('#save-button');
const cancelEditButton = document.querySelector('#cancel-edit');
const importFile = document.querySelector('#import-json-file');

let activeFilter = 'all';
let milestones = loadMilestones();

function copyStarterMilestones() {
  return STARTER_MILESTONES.map((milestone) => ({ ...milestone }));
}

function isValidMilestone(item) {
  return Boolean(
    item &&
    typeof item === 'object' &&
    Object.hasOwn(PHASES, item.period) &&
    typeof item.title === 'string' &&
    item.title.trim() &&
    typeof item.description === 'string' &&
    item.description.trim(),
  );
}

function loadMilestones() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      const starter = copyStarterMilestones();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(starter));
      return starter;
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(isValidMilestone)) {
      return copyStarterMilestones();
    }
    return parsed.map((item) => ({
      id: String(item.id || createId()),
      period: item.period,
      date: String(item.date || '').trim().slice(0, 40),
      title: item.title.trim().slice(0, 100),
      description: item.description.trim().slice(0, 2000),
      isExample: Boolean(item.isExample),
    }));
  } catch {
    return copyStarterMilestones();
  }
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `marco-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveMilestones() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(milestones));
    return true;
  } catch {
    announce('Não foi possível salvar neste navegador. Seus dados continuam nesta página; exporte um JSON para não perdê-los.', true);
    return false;
  }
}

function announce(message, isError = false) {
  formStatus.textContent = message;
  formStatus.classList.toggle('is-error', isError);
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function dateSortValue(value) {
  const date = value.trim();
  let match = date.match(/^(\d{4})$/);
  if (match) return Number(`${match[1]}0101`);

  match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) return Number(`${match[1]}${match[2]}${match[3]}`);

  match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) return Number(`${match[3]}${match[2]}${match[1]}`);

  return Number.POSITIVE_INFINITY;
}

function orderedMilestones() {
  return milestones
    .map((milestone, index) => ({ milestone, index }))
    .sort((left, right) => {
      const phaseDifference = PHASES[left.milestone.period].order - PHASES[right.milestone.period].order;
      if (phaseDifference !== 0) return phaseDifference;
      const dateDifference = dateSortValue(left.milestone.date) - dateSortValue(right.milestone.date);
      return Number.isNaN(dateDifference) || dateDifference === 0 ? left.index - right.index : dateDifference;
    })
    .map(({ milestone }) => milestone);
}

function displayDate(milestone) {
  if (!milestone.date) return PHASES[milestone.period].emptyDate;
  return milestone.date;
}

function activateTab(name, { focusTab = false, scroll = true } = {}) {
  const selectedTab = tabButtons.find((button) => button.dataset.tab === name);
  if (!selectedTab) return;

  tabButtons.forEach((button) => {
    const isSelected = button === selectedTab;
    button.setAttribute('aria-selected', String(isSelected));
    button.tabIndex = isSelected ? 0 : -1;
    button.classList.toggle('is-active', isSelected);
  });

  tabPanels.forEach((panel) => {
    const isSelected = panel.id === selectedTab.getAttribute('aria-controls');
    panel.hidden = !isSelected;
    panel.classList.toggle('is-active', isSelected);
  });

  if (focusTab) selectedTab.focus();
  if (scroll) {
    const panel = document.getElementById(selectedTab.getAttribute('aria-controls'));
    const destinations = {
      principal: '.hero',
      timeline: '.timeline-section',
      login: '.login-section',
    };
    const destination = panel?.querySelector(destinations[name]);
    destination?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function openNewMilestone() {
  activateTab('timeline', { scroll: false });
  form.reset();
  document.querySelector('#milestone-id').value = '';
  saveButton.textContent = 'Salvar marco';
  cancelEditButton.hidden = true;
  openEditor();
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.querySelector('#milestone-title').focus();
}

function setEntryOpen(entry, isOpen) {
  const detail = entry.querySelector('.memory-detail');
  const orbButton = entry.querySelector('.memory-orb');
  const detailButton = entry.querySelector('.detail-button');

  detail.hidden = !isOpen;
  orbButton.setAttribute('aria-expanded', String(isOpen));
  detailButton.setAttribute('aria-expanded', String(isOpen));
  detailButton.querySelector('.detail-label-button').textContent = isOpen
    ? 'Recolher detalhes'
    : 'Revelar detalhes';
  entry.classList.toggle('is-open', isOpen);
  entry.classList.toggle('is-selected', isOpen);
}

function toggleEntry(entry) {
  const shouldOpen = !entry.classList.contains('is-open');
  timelineList.querySelectorAll('.timeline-entry.is-open').forEach((openEntry) => setEntryOpen(openEntry, false));
  if (shouldOpen) setEntryOpen(entry, true);
}

function makeActionButton(className, label, handler) {
  const button = createElement('button', className, label);
  button.type = 'button';
  button.addEventListener('click', handler);
  return button;
}

function createTimelineEntry(milestone, index) {
  const entry = createElement('li', `timeline-entry ${index % 2 === 0 ? 'side-left' : 'side-right'}`);
  entry.dataset.period = milestone.period;
  entry.dataset.id = milestone.id;
  entry.classList.toggle('is-example', milestone.isExample);

  const connector = createElement('span', 'event-connector');
  connector.setAttribute('aria-hidden', 'true');
  entry.append(connector);

  const card = createElement('article', 'memory-card');
  const meta = createElement('div', 'event-meta');
  const kind = createElement('span', 'event-kind');
  const kindDot = createElement('span', 'kind-dot');
  kindDot.setAttribute('aria-hidden', 'true');
  kind.append(kindDot, document.createTextNode(` ${PHASES[milestone.period].label.toUpperCase()}`));
  if (milestone.isExample) kind.append(document.createTextNode(' · EXEMPLO EDITÁVEL'));

  const date = createElement('span', 'event-date', displayDate(milestone));
  meta.append(kind, date);
  card.append(meta, createElement('h3', '', milestone.title));

  const detailId = `memory-detail-${index + 1}`;
  const detail = createElement('div', 'memory-detail');
  detail.id = detailId;
  detail.hidden = true;
  detail.append(
    createElement('p', 'detail-label', 'DETALHES DO MARCO'),
    createElement('p', 'memory-detail-text', milestone.description),
  );
  if (milestone.isExample) {
    detail.append(createElement('p', 'example-hint', 'Substitua este exemplo por uma informação sua usando “Editar”.'));
  }
  card.append(detail);

  const cardActions = createElement('div', 'card-actions');
  const revealButton = createElement('button', 'detail-button');
  revealButton.type = 'button';
  revealButton.setAttribute('aria-controls', detailId);
  revealButton.setAttribute('aria-expanded', 'false');
  revealButton.append(
    createElement('span', 'detail-label-button', 'Revelar detalhes'),
    createElement('span', 'detail-arrow', '↗'),
  );
  revealButton.querySelector('.detail-arrow').setAttribute('aria-hidden', 'true');
  revealButton.addEventListener('click', () => toggleEntry(entry));
  cardActions.append(revealButton);

  const editButton = makeActionButton('edit-button', 'Editar', () => startEditing(milestone.id));
  editButton.setAttribute('aria-label', `Editar marco: ${milestone.title}`);
  const deleteButton = makeActionButton('delete-button', 'Excluir', () => deleteMilestone(milestone.id));
  deleteButton.setAttribute('aria-label', `Excluir marco: ${milestone.title}`);
  cardActions.append(editButton, deleteButton);
  card.append(cardActions);
  entry.append(card);

  const orb = createElement('button', `memory-orb orb-${milestone.period}`);
  orb.type = 'button';
  orb.setAttribute('aria-label', `Revelar detalhes: ${PHASES[milestone.period].label.toLowerCase()} — ${milestone.title}`);
  orb.setAttribute('aria-controls', detailId);
  orb.setAttribute('aria-expanded', 'false');
  orb.append(createElement('span', 'orb-number', String(index + 1).padStart(2, '0')));
  const sheen = createElement('span', 'orb-sheen');
  sheen.setAttribute('aria-hidden', 'true');
  orb.append(sheen);
  orb.addEventListener('click', () => toggleEntry(entry));
  entry.append(orb);

  return entry;
}

function renderTimeline() {
  const ordered = orderedMilestones();
  const visible = ordered.filter((milestone) => activeFilter === 'all' || milestone.period === activeFilter);
  const visibleLastId = visible.at(-1)?.id;
  timelineList.replaceChildren();

  ordered.forEach((milestone, index) => {
    const entry = createTimelineEntry(milestone, index);
    const isVisible = activeFilter === 'all' || milestone.period === activeFilter;
    entry.classList.toggle('is-hidden', !isVisible);
    entry.classList.toggle('is-last-visible', isVisible && milestone.id === visibleLastId);
    timelineList.append(entry);
  });

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  countNumber.textContent = String(visible.length);
  countLabel.textContent = visible.length === 1 ? 'marco' : 'marcos';
  emptyState.hidden = visible.length !== 0;

  Object.keys(PHASES).forEach((period) => {
    const periodCount = milestones.filter((milestone) => milestone.period === period).length;
    const summaryCount = document.querySelector(`[data-period-count="${period}"]`);
    const summaryCard = document.querySelector(`[data-period-shortcut="${period}"]`);
    if (summaryCount) summaryCount.textContent = String(periodCount);
    if (summaryCard) summaryCard.setAttribute('aria-label', `Ver ${periodCount} ${periodCount === 1 ? 'marco' : 'marcos'} do ${PHASES[period].label}`);
  });
}

function openEditor() {
  formWrap.hidden = false;
  formToggle.setAttribute('aria-expanded', 'true');
  formToggle.classList.add('is-active');
}

function closeEditor({ focusToggle = false, announceCancel = false } = {}) {
  form.reset();
  document.querySelector('#milestone-id').value = '';
  saveButton.textContent = 'Salvar marco';
  cancelEditButton.hidden = true;
  formWrap.hidden = true;
  formToggle.setAttribute('aria-expanded', 'false');
  formToggle.classList.remove('is-active');
  if (announceCancel) announce('Edição cancelada.');
  if (focusToggle) formToggle.focus();
}

function startEditing(id) {
  const milestone = milestones.find((item) => item.id === id);
  if (!milestone) return;

  openEditor();
  document.querySelector('#milestone-id').value = milestone.id;
  document.querySelector('#milestone-period').value = milestone.period;
  document.querySelector('#milestone-date').value = milestone.date;
  document.querySelector('#milestone-title').value = milestone.title;
  document.querySelector('#milestone-description').value = milestone.description;
  saveButton.textContent = 'Salvar alterações';
  cancelEditButton.hidden = false;
  announce(`Editando “${milestone.title}”.`);
  document.querySelector('#milestone-title').focus();
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function deleteMilestone(id) {
  const milestone = milestones.find((item) => item.id === id);
  if (!milestone) return;
  const confirmed = window.confirm(`Excluir “${milestone.title}” da sua linha do tempo? Esta ação não pode ser desfeita.`);
  if (!confirmed) return;

  if (document.querySelector('#milestone-id').value === id) closeEditor();
  milestones = milestones.filter((item) => item.id !== id);
  saveMilestones();
  renderTimeline();
  announce('Marco excluído.');
}

function submitMilestone(event) {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const existingId = String(formData.get('id') || '');
  const milestone = {
    id: existingId || createId(),
    period: String(formData.get('period')),
    date: String(formData.get('date') || '').trim(),
    title: String(formData.get('title') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    isExample: false,
  };
  if (!isValidMilestone(milestone)) {
    announce('Confira o momento, o título e a descrição antes de salvar.', true);
    return;
  }

  if (existingId) {
    milestones = milestones.map((item) => item.id === existingId ? milestone : item);
  } else {
    milestones.push(milestone);
  }

  const wasSaved = saveMilestones();
  activeFilter = 'all';
  renderTimeline();
  closeEditor();
  announce(wasSaved ? 'Marco salvo na sua linha do tempo.' : 'Marco atualizado nesta página. Exporte um JSON para guardar os dados.');
}

function exportJSON() {
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    milestones,
  };
  const file = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const download = createElement('a');
  download.href = url;
  download.download = 'minha-linha-do-tempo.json';
  document.body.append(download);
  download.click();
  download.remove();
  URL.revokeObjectURL(url);
  announce('Arquivo JSON exportado. Guarde-o em um local seguro.');
}

function normalizeImportedMilestones(data) {
  const source = Array.isArray(data) ? data : data?.milestones;
  if (!Array.isArray(source)) throw new Error('O arquivo precisa conter uma lista “milestones”.');
  if (source.length > MAX_MILESTONES) throw new Error(`O arquivo pode conter no máximo ${MAX_MILESTONES} marcos.`);

  return source.map((item, index) => {
    if (!item || typeof item !== 'object' || !Object.hasOwn(PHASES, item.period)) {
      throw new Error(`O marco ${index + 1} não tem um momento válido.`);
    }
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const description = typeof item.description === 'string' ? item.description.trim() : '';
    const date = typeof item.date === 'string' ? item.date.trim() : '';
    if (!title || !description || title.length > 100 || description.length > 2000 || date.length > 40) {
      throw new Error(`Confira título, descrição e data do marco ${index + 1}.`);
    }
    return {
      id: createId(),
      period: item.period,
      date,
      title,
      description,
      isExample: false,
    };
  });
}

async function importJSON() {
  const file = importFile.files?.[0];
  if (!file) return;
  importFile.value = '';

  if (file.size > MAX_IMPORT_SIZE) {
    announce('O arquivo é muito grande. Escolha um JSON de até 1 MB.', true);
    return;
  }

  try {
    const parsed = JSON.parse(await file.text());
    const imported = normalizeImportedMilestones(parsed);
    const confirmed = window.confirm(
      `Este arquivo contém ${imported.length} marco(s) e substituirá os dados atuais neste navegador. Deseja continuar?`,
    );
    if (!confirmed) {
      announce('Importação cancelada; seus marcos atuais foram mantidos.');
      return;
    }

    milestones = imported;
    const wasSaved = saveMilestones();
    activeFilter = 'all';
    renderTimeline();
    closeEditor();
    announce(wasSaved ? 'Linha do tempo importada com sucesso.' : 'Arquivo importado nesta página. Exporte novamente para guardar os dados.');
  } catch (error) {
    announce(`Não foi possível importar o arquivo: ${error.message}`, true);
  }
}

tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
  button.addEventListener('keydown', (event) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
    else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabButtons.length - 1;
    else return;

    event.preventDefault();
    activateTab(tabButtons[nextIndex].dataset.tab, { focusTab: true });
  });
});

document.querySelectorAll('[data-switch-tab]').forEach((button) => {
  button.addEventListener('click', () => activateTab(button.dataset.switchTab));
});

document.querySelectorAll('[data-period-shortcut]').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.periodShortcut;
    activateTab('timeline');
    renderTimeline();
  });
});

document.querySelectorAll('[data-open-editor]').forEach((button) => {
  button.addEventListener('click', openNewMilestone);
});

document.querySelectorAll('[data-home-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    activateTab('principal');
  });
});

document.querySelector('#visual-login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#login-feedback').textContent =
    'Demonstração visual: nenhum login foi realizado. Nenhum dado foi salvo ou enviado.';
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    renderTimeline();
  });
});

formToggle.addEventListener('click', () => {
  const isOpen = formToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) closeEditor();
  else {
    form.reset();
    document.querySelector('#milestone-id').value = '';
    saveButton.textContent = 'Salvar marco';
    cancelEditButton.hidden = true;
    openEditor();
    document.querySelector('#milestone-title').focus();
  }
});

document.querySelector('#close-editor').addEventListener('click', () => closeEditor({ focusToggle: true }));
document.querySelector('#empty-add').addEventListener('click', () => {
  openEditor();
  document.querySelector('#milestone-title').focus();
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
cancelEditButton.addEventListener('click', () => closeEditor({ focusToggle: true, announceCancel: true }));
form.addEventListener('submit', submitMilestone);
document.querySelector('#export-json').addEventListener('click', exportJSON);
document.querySelector('#import-json-button').addEventListener('click', () => importFile.click());
importFile.addEventListener('change', importJSON);

renderTimeline();
activateTab('principal', { scroll: false });

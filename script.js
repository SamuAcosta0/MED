const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });
}

const modalTriggers = document.querySelectorAll('[data-open-modal]');
const modalClosers = document.querySelectorAll('[data-close-modal]');

modalTriggers.forEach((trigger) => {
  const target = trigger.getAttribute('data-open-modal');
  const modal = document.getElementById(`${target}-modal`);
  if (!modal) return;
  trigger.addEventListener('click', () => {
    modal.classList.add('active');
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener('click', () => {
    const modal = closer.closest('.modal-overlay');
    if (modal) modal.classList.remove('active');
  });
});

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('active');
  }
});

const roleToggle = document.querySelector('[data-role-toggle]');
if (roleToggle) {
  const roleButtons = roleToggle.querySelectorAll('button');
  const roleSections = document.querySelectorAll('[data-role-section]');
  roleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      roleButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      const role = button.getAttribute('data-role');
      roleSections.forEach((section) => {
        section.hidden = section.getAttribute('data-role-section') !== role;
      });
    });
  });
}

const loginForm = document.querySelector('[data-login-form]');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email');
    const isDoctor = email && email.value.includes('doctor');
    window.location.href = isDoctor ? 'doctor.html' : 'patient.html';
  });
}

const registerForm = document.querySelector('[data-register-form]');
if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const activeRole = document.querySelector('[data-role-toggle] .active');
    const role = activeRole ? activeRole.getAttribute('data-role') : 'patient';
    window.location.href = role === 'doctor' ? 'doctor.html' : 'patient.html';
  });
}

const panelNav = document.querySelector('[data-panel-nav]');
if (panelNav) {
  const buttons = panelNav.querySelectorAll('button');
  const panels = document.querySelectorAll('[data-panel]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-panel-target');
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
      });
    });
  });
}

const searchForm = document.querySelector('[data-search-form]');
const searchAlert = document.querySelector('[data-search-alert]');
if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const specialty = document.getElementById('search-specialty');
    const location = document.getElementById('search-location');
    const hasValue = (specialty && specialty.value.trim()) || (location && location.value.trim());
    if (!hasValue) {
      if (searchAlert) searchAlert.classList.add('visible');
      return;
    }
    if (searchAlert) searchAlert.classList.remove('visible');
  });
}

const filterBar = document.querySelector('[data-filter-bar]');
const clearFilters = document.querySelector('[data-clear-filters]');
if (filterBar && clearFilters) {
  filterBar.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    chip.classList.toggle('active');
    const activeChips = filterBar.querySelectorAll('.chip.active');
    clearFilters.classList.toggle('visible', activeChips.length > 0);
  });

  clearFilters.addEventListener('click', () => {
    filterBar.querySelectorAll('.chip.active').forEach((chip) => chip.classList.remove('active'));
    clearFilters.classList.remove('visible');
  });
}

const mapToggles = document.querySelectorAll('[data-map-toggle]');
const mapPanel = document.querySelector('[data-map-panel]');
mapToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    if (!mapPanel) return;
    mapPanel.classList.toggle('collapsed');
  });
});

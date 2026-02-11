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

const searchForms = document.querySelectorAll('[data-search-form]');
searchForms.forEach((form) => {
  const alert = form.parentElement?.querySelector('[data-search-alert]');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const specialty = form.querySelector('input[type=\"text\"]');
    const location = form.querySelectorAll('input[type=\"text\"]')[1];
    const hasValue = (specialty && specialty.value.trim()) || (location && location.value.trim());
    if (!hasValue) {
      if (alert) alert.classList.add('visible');
      return;
    }
    if (alert) alert.classList.remove('visible');
  });
});

const filterToggles = document.querySelectorAll('[data-filter-toggle]');
const filterPanels = document.querySelectorAll('[data-filter-panel]');
filterToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const scopedPanel = toggle.closest('.patient-panel')?.querySelector('[data-filter-panel]');
    if (scopedPanel) {
      scopedPanel.classList.toggle('active');
      return;
    }
    filterPanels.forEach((panel) => panel.classList.toggle('active'));
  });
});

const clearButtons = document.querySelectorAll('[data-clear-filters]');
clearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('[data-filter-panel]');
    if (!panel) return;
    panel.querySelectorAll('input[type=\"checkbox\"]').forEach((box) => {
      box.checked = false;
    });
  });
});

const mapToggles = document.querySelectorAll('[data-map-toggle]');
mapToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const scopedMap = toggle.closest('.patient-panel, .search-layout, .results, body')?.querySelector('[data-map-panel]');
    const mapPanel = scopedMap || document.querySelector('[data-map-panel]');
    if (!mapPanel) return;
    mapPanel.classList.toggle('collapsed');
  });
});

const patientNav = document.querySelector('[data-patient-nav]');
const patientPanels = document.querySelectorAll('[data-patient-panel]');
const switchPatientPanel = (target) => {
  if (!target || !patientPanels.length) return;
  patientPanels.forEach((panel) => {
    panel.classList.toggle('active', panel.getAttribute('data-patient-panel') === target);
  });
  if (patientNav) {
    patientNav.querySelectorAll('[data-patient-target]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-patient-target') === target);
    });
  }
};

if (patientNav) {
  patientNav.querySelectorAll('[data-patient-target]').forEach((button) => {
    button.addEventListener('click', () => {
      switchPatientPanel(button.getAttribute('data-patient-target'));
    });
  });
}

document.querySelectorAll('.profile-menu [data-patient-target]').forEach((button) => {
  button.addEventListener('click', () => {
    switchPatientPanel(button.getAttribute('data-patient-target'));
  });
});

const patientSwitchers = document.querySelectorAll('[data-patient-switch]');
patientSwitchers.forEach((switcher) => {
  switcher.addEventListener('click', () => {
    const target = switcher.getAttribute('data-patient-switch');
    const button = document.querySelector(`[data-patient-target=\"${target}\"]`);
    if (button) button.click();
  });
});

const profileToggle = document.querySelector('[data-profile-toggle]');
const profileMenu = document.querySelector('[data-profile-menu]');
if (profileToggle && profileMenu) {
  profileToggle.addEventListener('click', () => {
    profileMenu.classList.toggle('show');
  });
  document.addEventListener('click', (event) => {
    if (!profileMenu.contains(event.target) && !profileToggle.contains(event.target)) {
      profileMenu.classList.remove('show');
    }
  });
  profileMenu.querySelectorAll('button, a').forEach((item) => {
    item.addEventListener('click', () => {
      profileMenu.classList.remove('show');
    });
  });
}

const languageButtons = document.querySelectorAll('[data-lang]');
const translatables = document.querySelectorAll('[data-i18n-es]');
const placeholders = document.querySelectorAll('[data-i18n-placeholder-es]');
const setLanguage = (lang) => {
  translatables.forEach((el) => {
    const text = lang === 'en' ? el.dataset.i18nEn : el.dataset.i18nEs;
    if (text) el.textContent = text;
  });
  placeholders.forEach((el) => {
    const text =
      lang === 'en' ? el.dataset.i18nPlaceholderEn : el.dataset.i18nPlaceholderEs;
    if (text) el.setAttribute('placeholder', text);
  });
  languageButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
};

if (languageButtons.length) {
  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
  setLanguage('es');
}

/* 
 * Gregos - Unified Portal Logic
 * Integrated from Codex design for Flask structure.
 */

// --- Mobile Navigation ---
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle && navbar) {
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
  });
}

// --- Modal System ---
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

// --- Auth Role Toggle (used in Register) ---
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

// --- Patient Portal Navigation (Single Page Layout) ---
const patientNav = document.querySelector('[data-patient-nav]');
if (patientNav) {
  const navButtons = patientNav.querySelectorAll('[data-patient-target]');
  const panels = document.querySelectorAll('[data-patient-panel]');

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-patient-target');

      // Update buttons
      navButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Update panels
      panels.forEach((panel) => {
        if (panel.getAttribute('data-patient-panel') === target) {
          panel.classList.add('active');
          panel.style.display = 'block'; // Ensure visibility
        } else {
          panel.classList.remove('active');
          panel.style.display = 'none';
        }
      });

      // Special case for search: ensure map and filters are reset if needed
      if (target === 'search') {
        // initMap() or similar if using real maps
      }
    });
  });

  // Activate initial panel (usually home)
  const initialBtn = patientNav.querySelector('.nav-link.active') || navButtons[0];
  if (initialBtn) initialBtn.click();
}

// Internal switchers (e.g., "Find Doctors" button in dashboard jumping to search tab)
const patientSwitchers = document.querySelectorAll('[data-patient-switch]');
patientSwitchers.forEach((switcher) => {
  switcher.addEventListener('click', () => {
    const target = switcher.getAttribute('data-patient-switch');
    const button = document.querySelector(`[data-patient-target="${target}"]`);
    if (button) button.click();
  });
});

// --- Search Filters & Panels ---
const filterToggles = document.querySelectorAll('[data-filter-toggle]');
const filterPanels = document.querySelectorAll('[data-filter-panel]');
filterToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    filterPanels.forEach((panel) => panel.classList.toggle('active'));
  });
});

const clearButtons = document.querySelectorAll('[data-clear-filters]');
clearButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('[data-filter-panel]');
    if (!panel) return;
    panel.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.checked = false;
    });
  });
});

// Search alert for empty queries
const searchForms = document.querySelectorAll('[data-search-form]');
searchForms.forEach((form) => {
  const alert = form.parentElement?.querySelector('[data-search-alert]');
  form.addEventListener('submit', (event) => {
    // If we want real search, we shouldn't preventDefault unless it's AJAX
    const specialty = form.querySelector('input[name="specialty"]') || form.querySelector('input[placeholder*="Especialidad"]');
    const location = form.querySelector('input[name="location"]') || form.querySelector('input[placeholder*="Ubicación"]');

    if (!specialty?.value.trim() && !location?.value.trim()) {
      event.preventDefault();
      if (alert) alert.classList.add('visible');
    } else {
      if (alert) alert.classList.remove('visible');
      // Let the form submit to Flask /search
    }
  });
});

// --- Profile Dropdown ---
const profileToggle = document.querySelector('[data-profile-toggle]');
const profileMenu = document.querySelector('[data-profile-menu]');
if (profileToggle && profileMenu) {
  profileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('active');
    profileMenu.classList.toggle('show'); // compatibility with CSS variations
  });

  document.addEventListener('click', (event) => {
    if (!profileMenu.contains(event.target) && !profileToggle.contains(event.target)) {
      profileMenu.classList.remove('active');
      profileMenu.classList.remove('show');
    }
  });
}

// --- Internationalization (i18n) ---
const languageButtons = document.querySelectorAll('[data-lang]');
const translatables = document.querySelectorAll('[data-i18n-es]');

const setLanguage = (lang) => {
  // Translate text content
  translatables.forEach((el) => {
    const text = lang === 'en' ? el.dataset.i18nEn : el.dataset.i18nEs;
    if (text) el.textContent = text;
  });

  // Translate placeholders (search for both variants)
  const placeholders = document.querySelectorAll('[data-i18n-placeholder-es]');
  placeholders.forEach((el) => {
    const text = lang === 'en' ? el.dataset.i18nPlaceholderEn : el.dataset.i18nPlaceholderEs;
    if (text) el.setAttribute('placeholder', text);
  });

  // Update button states
  languageButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Store preference
  localStorage.setItem('gregos_lang', lang);
};

if (languageButtons.length) {
  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });

  // Init language from storage or default to ES
  const savedLang = localStorage.getItem('gregos_lang') || 'es';
  setLanguage(savedLang);
}


// --- Gregos Specific: 14-Day Calendar interactions ---
document.addEventListener('click', (e) => {
  if (e.target.closest('.day-slot:not(.disabled)')) {
    const slot = e.target.closest('.day-slot');
    const allSlots = slot.parentElement.querySelectorAll('.day-slot');
    allSlots.forEach(s => s.classList.remove('active'));
    slot.classList.add('active');

    // Optional: Update some hidden input with selected date
    console.log('Selected date slot:', slot.dataset.date);
  }
});

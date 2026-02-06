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

// Click outside disabled for data safety
/* document.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal-overlay')) {
    event.target.classList.remove('active');
  }
}); */

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

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');

    // Skip if href is just "#"
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});


/* --- Gregos Features --- */

// Cursor Shadow
const cursor = document.getElementById('cursor-shadow');
if (cursor) {
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// Validation Logic
function setupValidation(inputId, listId, rules) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  if (!input || !list) return;

  input.addEventListener('input', () => {
    const val = input.value;
    rules.forEach(rule => {
      const li = list.querySelector(`[data-rule="${rule.name}"]`);
      if (!li) return;

      const isValid = rule.check(val);
      if (isValid) {
        li.classList.add('valid');
        li.classList.remove('invalid');
      } else {
        li.classList.remove('valid');
        if (val.length > 0) li.classList.add('invalid');
        else li.classList.remove('invalid');
      }
    });
  });
}

// Login
setupValidation('login-email', 'login-email-requirements', [
  { name: 'email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
]);

// Register
setupValidation('reg-email', 'reg-email-requirements', [
  { name: 'email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
]);

setupValidation('reg-password', 'reg-password-requirements', [
  { name: 'length', check: v => v.length >= 8 },
  { name: 'number', check: v => /\d/.test(v) },
  { name: 'special', check: v => /[@$!%*?&]/.test(v) }
]);

/* --- Search & Filter Logic (Codex Update) --- */
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
    console.log("Buscando...");
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
    console.log("Mapa alternado");
  });
});

/* --- Day Slots & Time Modal (Complete Search Implementation) --- */

// Generate mock availability data for next 14 days
function generateAvailability(doctorId, days = 14) {
  const availability = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Random availability (60% chance of having slots)
    const hasSlots = Math.random() > 0.4;
    const slotCount = hasSlots ? Math.floor(Math.random() * 50) + 5 : 0;

    availability.push({
      date: date,
      dayName: date.toLocaleDateString('es', { weekday: 'short' }),
      dayNum: date.getDate(),
      monthName: date.toLocaleDateString('es', { month: 'short' }),
      slots: slotCount
    });
  }

  return availability;
}

// Render day slots in doctor card
function renderDaySlots(doctorId, container, showAll = false) {
  const availability = generateAvailability(doctorId, 14);
  const slotsToShow = showAll ? availability : availability.slice(0, 7);

  container.innerHTML = '';

  slotsToShow.forEach((day, index) => {
    const button = document.createElement('button');
    button.className = `day-slot ${day.slots > 0 ? 'available' : ''}`;
    button.disabled = day.slots === 0;
    button.dataset.doctorId = doctorId;
    button.dataset.date = day.date.toISOString().split('T')[0];
    button.dataset.slots = day.slots;

    // Reference design format
    button.innerHTML = `
      <div class="slot-day">${day.dayName.toUpperCase().substring(0, 3)}</div>
      <div class="slot-date">Feb ${day.dayNum}</div>
      <div class="slot-count">${day.slots > 0 ? day.slots : 'No'}<br>${day.slots > 0 ? 'appts' : 'appts'}</div>
    `;

    if (day.slots > 0) {
      button.addEventListener('click', () => openTimeModal(doctorId, day));
    }

    container.appendChild(button);
  });
}

// Initialize all day slot grids on page (14-day grid for reference design)
document.querySelectorAll('.calendar-grid-14').forEach(grid => {
  const doctorId = grid.dataset.doctorId;
  renderDaySlots(doctorId, grid, true); // Always show all 14 days
});

// Legacy 7-day grids (if any remain)
document.querySelectorAll('.day-slot-grid').forEach(grid => {
  const doctorId = grid.dataset.doctorId;
  renderDaySlots(doctorId, grid, false);
});

// "Ver más fechas" button logic
document.querySelectorAll('.show-more-days').forEach(button => {
  button.addEventListener('click', (e) => {
    const doctorId = e.currentTarget.dataset.doctorId;
    const grid = document.querySelector(`.day-slot-grid[data-doctor-id="${doctorId}"]`);
    const isExpanded = button.dataset.expanded === 'true';

    renderDaySlots(doctorId, grid, !isExpanded);
    button.dataset.expanded = !isExpanded;
    button.innerHTML = `
      <i class="fa-solid fa-calendar-days"></i>
      ${isExpanded ? 'Ver más fechas' : 'Ver menos'}
    `;
  });
});

// Time Modal Logic
let currentTimeModal = null;
let selectedTime = null;

function openTimeModal(doctorId, dayData) {
  // Create modal if it doesn't exist
  if (!currentTimeModal) {
    createTimeModal();
  }

  const modal = currentTimeModal;
  const overlay = modal.parentElement;

  // Update modal content
  const doctorName = getDoctorName(doctorId);
  const dateStr = dayData.date.toLocaleDateString('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  modal.querySelector('.time-modal-title').textContent = `Reservar con ${doctorName}`;
  modal.querySelector('.time-modal-date').textContent = dateStr;

  // Generate time slots
  const timeSlotsContainer = modal.querySelector('.time-slots-grid');
  timeSlotsContainer.innerHTML = '';
  selectedTime = null;

  const times = generateTimeSlots(dayData.slots);
  times.forEach(time => {
    const button = document.createElement('button');
    button.className = 'time-slot';
    button.textContent = time;
    button.dataset.time = time;

    button.addEventListener('click', () => {
      modal.querySelectorAll('.time-slot').forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedTime = time;
      modal.querySelector('.confirm-time-btn').disabled = false;
    });

    timeSlotsContainer.appendChild(button);
  });

  // Show modal
  overlay.dataset.doctorId = doctorId;
  overlay.dataset.date = dayData.date.toISOString().split('T')[0];
  overlay.classList.add('active');
}

function closeTimeModal() {
  if (currentTimeModal) {
    currentTimeModal.parentElement.classList.remove('active');
    selectedTime = null;
  }
}

function confirmTimeSelection() {
  if (!selectedTime || !currentTimeModal) return;

  const overlay = currentTimeModal.parentElement;
  const doctorId = overlay.dataset.doctorId;
  const date = overlay.dataset.date;

  // Redirect to booking page with params
  window.location.href = `/booking/${doctorId}?date=${date}&time=${selectedTime}`;
}

function createTimeModal() {
  const overlay = document.createElement('div');
  overlay.className = 'time-modal-overlay';

  overlay.innerHTML = `
    <div class="time-modal">
      <div class="time-modal-header">
        <div>
          <h3 class="time-modal-title">Seleccionar horario</h3>
          <p class="time-modal-date text-sec text-sm"></p>
        </div>
        <button class="time-modal-close" aria-label="Cerrar">&times;</button>
      </div>
      <div class="time-modal-body">
        <p class="text-sm text-sec mb-2">Seleccioná un horario disponible:</p>
        <div class="time-slots-grid"></div>
      </div>
      <div class="time-modal-footer">
        <button class="secondary-btn" onclick="closeTimeModal()">Cancelar</button>
        <button class="primary-btn confirm-time-btn" disabled onclick="confirmTimeSelection()">Confirmar</button>
      </div>
    </div>
  `;

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeTimeModal();
    }
  });

  // Close button
  overlay.querySelector('.time-modal-close').addEventListener('click', closeTimeModal);

  document.body.appendChild(overlay);
  currentTimeModal = overlay.querySelector('.time-modal');
}

// Helper functions
function generateTimeSlots(count) {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  const interval = 30; // minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      if (slots.length >= Math.min(count, 18)) break;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }
    if (slots.length >= Math.min(count, 18)) break;
  }

  return slots;
}

function getDoctorName(doctorId) {
  // In production, fetch from backend
  return `Dr. ${doctorId}`;
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// Make functions globally accessible
window.closeTimeModal = closeTimeModal;
window.confirmTimeSelection = confirmTimeSelection;

/* --- Autocomplete Implementation --- */

const SPECIALTIES = [
  'Cardiología',
  'Pediatría',
  'Dermatología',
  'Ginecología',
  'Traumatología',
  'Oftalmología',
  'Otorrinolaringología',
  'Neurología',
  'Psiquiatría',
  'Medicina General',
  'Endocrinología',
  'Gastroenterología',
  'Urología',
  'Reumatología'
];

const LOCATIONS = [
  'Montevideo, Uruguay',
  'Buenos Aires, Argentina',
  'Santiago, Chile',
  'Lima, Perú',
  'Bogotá, Colombia',
  'Ciudad de México, México',
  'São Paulo, Brasil',
  'Córdoba, Argentina',
  'Rosario, Argentina',
  'Valparaíso, Chile'
];

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize autocomplete for all inputs
function initAutocomplete(input, data, dropdownId) {
  const dropdown = document.getElementById(dropdownId);

  const showSuggestions = debounce((query) => {
    if (!query || query.length < 2) {
      dropdown.classList.remove('active');
      return;
    }

    const filtered = data.filter(item =>
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    if (filtered.length === 0) {
      dropdown.classList.remove('active');
      return;
    }

    dropdown.innerHTML = filtered.map(item => `
      <div class="autocomplete-item" data-value="${item}">
        <i class="fa-solid fa-${dropdownId === 'specialty-dropdown' ? 'stethoscope' : 'location-dot'}"></i>
        ${item}
      </div>
    `).join('');

    // Add click handlers
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        input.value = item.dataset.value;
        dropdown.classList.remove('active');
        input.focus();
      });
    });

    dropdown.classList.add('active');
  }, 300);

  input.addEventListener('input', (e) => {
    showSuggestions(e.target.value);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      dropdown.classList.remove('active');
    }, 200);
  });

  input.addEventListener('focus', (e) => {
    if (e.target.value.length >= 2) {
      showSuggestions(e.target.value);
    }
  });
}

// Initialize both autocompletes
const specialtyInput = document.getElementById('search-specialty');
const locationInput = document.getElementById('search-location');

if (specialtyInput) {
  initAutocomplete(specialtyInput, SPECIALTIES, 'specialty-dropdown');
}

if (locationInput) {
  initAutocomplete(locationInput, LOCATIONS, 'location-dropdown');
}

/* --- Advanced Filters Modal --- */

const advancedFiltersOverlay = document.getElementById('advanced-filters-overlay');
const moreFiltersChip = document.querySelector('[data-filter="more"]');

function openAdvancedFilters() {
  if (advancedFiltersOverlay) {
    advancedFiltersOverlay.classList.add('active');
  }
}

function closeAdvancedFilters() {
  if (advancedFiltersOverlay) {
    advancedFiltersOverlay.classList.remove('active');
  }
}

function resetAdvancedFilters() {
  // Uncheck all checkboxes except default language
  advancedFiltersOverlay.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = (cb.name === 'lang' && cb.value === 'es');
  });

  // Reset distance slider
  const distanceRange = document.getElementById('distance-range');
  if (distanceRange) {
    distanceRange.value = 25;
    document.getElementById('distance-value').textContent = '25 km';
  }

  console.log('Filtros reiniciados');
}

function applyAdvancedFilters() {
  // Collect selected filters
  const filters = {
    languages: [],
    availability: [],
    distance: document.getElementById('distance-range').value,
    insurance: []
  };

  advancedFiltersOverlay.querySelectorAll('input[name="lang"]:checked').forEach(cb => {
    filters.languages.push(cb.value);
  });

  advancedFiltersOverlay.querySelectorAll('input[name="availability"]:checked').forEach(cb => {
    filters.availability.push(cb.value);
  });

  advancedFiltersOverlay.querySelectorAll('input[name="insurance"]:checked').forEach(cb => {
    filters.insurance.push(cb.value);
  });

  console.log('Filtros aplicados:', filters);
  // In production: trigger results update based on filters

  closeAdvancedFilters();
}

// Event listeners
if (moreFiltersChip) {
  moreFiltersChip.addEventListener('click', openAdvancedFilters);
}

if (advancedFiltersOverlay) {
  // Close on overlay click
  advancedFiltersOverlay.addEventListener('click', (e) => {
    if (e.target === advancedFiltersOverlay) {
      closeAdvancedFilters();
    }
  });

  // Close button
  const closeBtn = advancedFiltersOverlay.querySelector('[data-close-filters]');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAdvancedFilters);
  }

  // Reset button
  const resetBtn = advancedFiltersOverlay.querySelector('[data-reset-filters]');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetAdvancedFilters);
  }

  // Apply button
  const applyBtn = advancedFiltersOverlay.querySelector('[data-apply-filters]');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyAdvancedFilters);
  }

  // Distance slider
  const distanceRange = document.getElementById('distance-range');
  if (distanceRange) {
    distanceRange.addEventListener('input', (e) => {
      const value = e.target.value;
      document.getElementById('distance-value').textContent = value === '50' ? '50+ km' : `${value} km`;
    });
  }
}

/* --- Profile Dropdown Toggle --- */

const profileBtn = document.querySelector('[data-profile-toggle]');
const profileMenu = document.querySelector('[data-profile-menu]');

if (profileBtn && profileMenu) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('active');
    profileBtn.classList.toggle('active');
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
      profileMenu.classList.remove('active');
      profileBtn.classList.remove('active');
    }
  });

  // Close on menu item click
  profileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      profileMenu.classList.remove('active');
      profileBtn.classList.remove('active');
    });
  });
}

/* --- Header Search Autocomplete --- */

const headerSpecialtyInput = document.getElementById('header-search-specialty');
const headerLocationInput = document.getElementById('header-search-location');

if (headerSpecialtyInput) {
  initAutocomplete(headerSpecialtyInput, SPECIALTIES, 'header-specialty-dropdown');
}

if (headerLocationInput) {
  initAutocomplete(headerLocationInput, LOCATIONS, 'header-location-dropdown');
}

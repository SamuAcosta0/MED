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

const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
  navbar.classList.toggle('open');
});

window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.scrollY.toString());
});

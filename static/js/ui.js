/* UI Interactions */

(() => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 8);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Mobile Menu Toggle (Placeholder)
    const menuBtn = document.querySelector('.menu-toggle');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            console.log('Toggle menu');
        });
    }
})();

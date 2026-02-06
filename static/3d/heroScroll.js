/**
 * SCROLL NARRATIVE - GSAP SCROLLTRIGGER INTEGRATION
 * 3 Beats: Buscá → Reservá → Consultá
 */

function initHeroScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const heroSection = document.querySelector('.hero-section-3d');
    if (!heroSection) return;

    // === BEAT 1: "Buscá" (0-35%) ===
    gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '35% top',
            scrub: 1,
            onUpdate: (self) => {
                if (window.hero3D) {
                    window.hero3D.updateScroll(self.progress * 0.35);
                    window.hero3D.updateLighting(self.progress * 0.3);
                }
            }
        }
    })
        .to('.hero-3d-object', {
            rotation: 3,
            duration: 1
        }, 0);

    // Reveal Beat 1 content
    ScrollTrigger.create({
        trigger: '#beat-1',
        start: 'top 80%',
        onEnter: () => {
            document.querySelectorAll('#beat-1 .hero-beat').forEach(el => {
                el.classList.add('revealed');
            });
            document.querySelector('#beat-1 .hero-title-mask')?.classList.add('revealed');
        }
    });

    // === BEAT 2: "Reservá" (35-70%) ===
    gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: '35% top',
            end: '70% top',
            scrub: 1,
            onUpdate: (self) => {
                if (window.hero3D) {
                    const progress = 0.35 + (self.progress * 0.35);
                    window.hero3D.updateScroll(progress);
                }
            }
        }
    });

    // Reveal Beat 2 content
    ScrollTrigger.create({
        trigger: '#beat-2',
        start: 'top 80%',
        onEnter: () => {
            document.querySelectorAll('#beat-2 .hero-beat').forEach(el => {
                el.classList.add('revealed');
            });
            document.querySelector('#beat-2 .hero-title-mask')?.classList.add('revealed');
        }
    });

    // === BEAT 3: "Consultá" (70-100%) ===
    gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: '70% top',
            end: 'bottom top',
            scrub: 1,
            onUpdate: (self) => {
                if (window.hero3D) {
                    const progress = 0.70 + (self.progress * 0.3);
                    window.hero3D.updateScroll(progress);
                    window.hero3D.updateLighting(-self.progress * 0.2);
                }
            }
        }
    })
        .to('.hero-3d-object', {
            rotation: -2,
            duration: 1
        }, 0);

    // Reveal Beat 3 content
    ScrollTrigger.create({
        trigger: '#beat-3',
        start: 'top 80%',
        onEnter: () => {
            document.querySelectorAll('#beat-3 .hero-beat').forEach(el => {
                el.classList.add('revealed');
            });
            document.querySelector('#beat-3 .hero-title-mask')?.classList.add('revealed');
        }
    });

    // === FEATURE PREVIEW CARD PARALLAX ===
    const featureCards = document.querySelectorAll('.feature-preview-card');
    featureCards.forEach(card => {
        gsap.to(card, {
            y: -30,
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// Initialize after DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initHeroScroll, 100);
    });
} else {
    setTimeout(initHeroScroll, 100);
}

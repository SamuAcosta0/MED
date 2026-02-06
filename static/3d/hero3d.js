/**
 * PREMIUM 3D HERO - THREE.JS SCENE
 * Clinical aesthetic with translucent biomorphic object
 */

class Hero3D {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.object = null;
        this.lights = {};
        this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
        this.time = 0;
        this.isVisible = true;
        this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        if (this.isReduced) return;

        this.container = document.getElementById('hero-canvas-container');
        this.canvas = document.getElementById('hero-canvas');

        if (!this.container || !this.canvas) return;

        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupObject();
        this.setupEventListeners();
        this.animate();

        // Mark as loaded
        this.canvas.classList.add('loaded');
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xF7F8FA, 10, 20);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.z = 6;
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });

        // Clamp pixel ratio for performance
        const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    setupLights() {
        // Ambient fill (soft clinical)
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        // Key light (cool blue)
        const keyLight = new THREE.DirectionalLight(0x1E40FF, 1.2);
        keyLight.position.set(5, 5, 5);
        this.scene.add(keyLight);
        this.lights.key = keyLight;

        // Rim light (cyan accent)
        const rimLight = new THREE.PointLight(0x22D3EE, 1.5, 10);
        rimLight.position.set(-3, 2, -2);
        this.scene.add(rimLight);
        this.lights.rim = rimLight;

        // Fill light (neutral)
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
        fillLight.position.set(-5, -3, 5);
        this.scene.add(fillLight);
    }

    setupObject() {
        // Biomorphic object: smooth torus knot
        const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32, 2, 3);

        // Premium translucent material
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xEAF0FF,
            metalness: 0.1,
            roughness: 0.2,
            transmission: 0.7,
            thickness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            ior: 1.45,
            reflectivity: 0.5,
            envMapIntensity: 1.0
        });

        this.object = new THREE.Mesh(geometry, material);
        this.object.rotation.x = 0.3;
        this.object.rotation.y = 0.4;
        this.scene.add(this.object);
    }

    setupEventListeners() {
        // Mouse parallax
        window.addEventListener('mousemove', (e) => {
            this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.3;
            this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 0.3;
        }, { passive: true });

        // Resize
        window.addEventListener('resize', () => this.onResize(), { passive: true });

        // Visibility
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        if (!this.isVisible) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.time += 0.005;

        // Ultra-slow base rotation
        if (this.object) {
            this.object.rotation.x += 0.002;
            this.object.rotation.y += 0.003;

            // Vertical float
            this.object.position.y = Math.sin(this.time) * 0.08;

            // Smooth mouse parallax (max 12px displacement)
            this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
            this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
            this.camera.position.x = this.mouse.x * 0.5;
            this.camera.position.y = this.mouse.y * 0.5;
            this.camera.lookAt(this.scene.position);
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    // Public API for scroll interactions
    updateScroll(progress) {
        if (!this.object) return;

        // Subtle rotation based on scroll
        const angle = progress * Math.PI * 0.2;
        this.object.rotation.z = angle;

        // Shift position slightly
        this.object.position.x = Math.sin(progress * Math.PI) * 0.3;
    }

    updateLighting(intensity) {
        if (this.lights.rim) {
            this.lights.rim.intensity = 1.5 + intensity * 0.5;
        }
    }
}

// Initialize when DOM is ready and user scrolls near hero
let hero3DInstance = null;

function initHero3D() {
    if (hero3DInstance || window.matchMedia('(max-width: 768px)').matches) return;

    hero3DInstance = new Hero3D();

    // Expose to global for scroll integration
    window.hero3D = hero3DInstance;
}

// Lazy load with IntersectionObserver
if ('IntersectionObserver' in window && typeof THREE !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initHero3D();
                observer.disconnect();
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero-section-3d');
    if (heroSection) {
        observer.observe(heroSection);
    }
} else {
    // Fallback: load after a short delay
    setTimeout(initHero3D, 500);
}

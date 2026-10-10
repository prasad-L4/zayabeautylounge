import { preloadImages } from './utils.js';
import { Slideshow } from './slideshow.js';

if (document.querySelector('.skew-slider-wrap')) {
    document.addEventListener("DOMContentLoaded", () => {
        const slidesContainer = document.querySelector('.skew-slider-wrap');
        const slideshow = new Slideshow(slidesContainer);

        const prevBtn = document.querySelector('.skew-slider-prev');
        const nextBtn = document.querySelector('.skew-slider-next');
        const heroBtns = document.querySelectorAll('.hero-thumb .hero-btn');
        const slideNumber = document.querySelector('.slides-numbers .active');

        let totalSlides = document.querySelectorAll('.skew-slider-item').length;

        // 🖼️ Preload all slide images
        preloadImages('.slide__img').then(() => document.body.classList.remove('loading'));

        // 🌀 Scroll / touch navigation
        Observer.create({
            type: 'wheel,touch,pointer',
            onDown: () => slideshow.prev(),
            onUp: () => slideshow.next(),
            wheelSpeed: -1,
            tolerance: 10
        });

        // 🔹 Callback for slide change
        slideshow.onChange = (index) => {
            // Update tabs
            heroBtns.forEach(btn => btn.classList.remove('active'));
            if (heroBtns[index]) heroBtns[index].classList.add('active');

            // Update slide number
            if (slideNumber) slideNumber.textContent = index + 1;
        };

        // 👆 Tab click events
        heroBtns.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                const diff = i - slideshow.current; // Calculate direction
                if (diff === 0) return;
                slideshow.navigate(diff > 0 ? 1 : -1); // Single step navigation
            });
        });

        // ⬅️➡️ Button navigation
        if (prevBtn) prevBtn.addEventListener('click', () => slideshow.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => slideshow.next());

        // 🔥 Initialize first active tab
        // heroBtns[0]?.classList.add('active');
        slideNumber.textContent = 1;
    });
}

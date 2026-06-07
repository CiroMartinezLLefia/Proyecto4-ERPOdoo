document.addEventListener('DOMContentLoaded', () => {
    
    /* ----------------------------------------------------
       1. INTERACTIVE LIGHTBOX SYSTEM
    ------------------------------------------------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    // Gather all screenshots data
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    const gallery = [];
    
    imageWrappers.forEach((wrapper, index) => {
        const img = wrapper.querySelector('.step-image');
        const title = wrapper.closest('.step-card').querySelector('h2').textContent;
        
        gallery.push({
            src: img.src,
            alt: img.alt,
            title: title
        });
        
        // Open lightbox on click
        wrapper.addEventListener('click', () => {
            openLightbox(index);
        });
    });
    
    let currentIndex = 0;
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    }
    
    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = ''; // Unlock background scroll
    }
    
    function updateLightboxContent() {
        const item = gallery[currentIndex];
        // Fade transition simulation
        lightboxImg.style.transform = 'scale(0.95)';
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt;
            lightboxCaption.textContent = `${item.title} - ${item.alt}`;
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 150);
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % gallery.length;
        updateLightboxContent();
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        updateLightboxContent();
    }
    
    // Event Listeners for Lightbox
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });
    
    // Close lightbox clicking on backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });
    
    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });


    /* ----------------------------------------------------
       2. SCROLL SPY / INTERSECTION OBSERVER
    ------------------------------------------------------- */
    const steps = document.querySelectorAll('.step-card');
    const trackerLinks = document.querySelectorAll('.tracker-step-link');
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '-25% 0px -45% 0px', // Trigger trigger point when step is in the middle of viewport
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stepNum = entry.target.getAttribute('data-step');
                
                // Remove active class from all links
                trackerLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-step') === stepNum) {
                        link.classList.add('active');
                        
                        // If tracker-steps container is scrollable (mobile), auto-scroll it
                        const container = document.querySelector('.tracker-steps');
                        if (window.innerWidth <= 1024 && container) {
                            const linkOffsetLeft = link.offsetLeft;
                            const linkWidth = link.offsetWidth;
                            const containerWidth = container.offsetWidth;
                            container.scrollTo({
                                left: linkOffsetLeft - (containerWidth / 2) + (linkWidth / 2),
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            }
        });
    }, observerOptions);
    
    steps.forEach(step => observer.observe(step));
    
    // Smooth scroll navigation trigger for sidebar links (with offset adjustments)
    trackerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = window.innerWidth <= 1024 ? 90 : 30;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});

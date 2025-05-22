// Placeholder for future JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Wyeth Photography website loaded successfully!');

    const navLinks = document.querySelectorAll('header nav ul li a');
    const sections = document.querySelectorAll('main > section');

    // Smooth scroll for anchor links in the navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash !== "") {
                // e.preventDefault(); // scroll-behavior:smooth in CSS handles this for same-page anchors
                const hash = this.hash;
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    // Optional: if CSS smooth scroll isn't sufficient or for more control
                    // window.scrollTo({
                    //     top: targetElement.offsetTop - 50, // Adjust offset if you have a fixed header
                    //     behavior: 'smooth'
                    // });
                }
            }
        });
    });

    // IntersectionObserver for scroll spy
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.5 // Triggers when 50% of the section is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const intersectingSectionId = entry.target.id;
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${intersectingSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Set initial active link on page load (e.g. if there's a hash in URL or for the top section)
    // This can be refined, for now, if no hash, it defaults to first section if it's visible
    let initialSectionVisible = false;
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) { // Check if section top is in upper half of viewport
             navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
            initialSectionVisible = true;
            return;
        }
    });

    // Fallback to #home if no other section is immediately active on load
    if (!initialSectionVisible) {
        const homeLink = document.querySelector('header nav ul li a[href="#home"]');
        if (homeLink) {
            navLinks.forEach(link => link.classList.remove('active'));
            homeLink.classList.add('active');
        }
    }

    // Lightbox Functionality
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item img');
    let currentImageIndex;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxModal.style.display = 'block';
        updateLightboxImage();
    }

    function closeLightbox() {
        lightboxModal.style.display = 'none';
    }

    function updateLightboxImage() {
        const currentItem = galleryItems[currentImageIndex];
        lightboxImg.src = currentItem.src;
        // Try to get caption from the overlay text sibling of the image's parent
        const overlayTextElement = currentItem.nextElementSibling.querySelector('.overlay-text');
        lightboxCaption.innerHTML = overlayTextElement ? overlayTextElement.textContent : currentItem.alt;
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);

    // Close lightbox when clicking outside the image
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) { // Check if the click is on the modal background itself
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxModal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeLightbox();
            }
            if (e.key === 'ArrowRight') {
                showNextImage();
            }
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

});

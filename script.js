document.addEventListener('DOMContentLoaded', () => {
    // 1. ELEMENTS & INITIAL SETUP
    const yearSpan = document.getElementById('year');
    const introOverlay = document.getElementById('intro-overlay');
    const appContainer = document.getElementById('app-container');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm ? contactForm.querySelector('.btn-submit') : null;
    const logoBtn = document.getElementById('logo-btn');

    // Set Year Immediately
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. REUSABLE TRANSITION FUNCTION
    function runIntroSequence() {
        // Reset visibility for the restart effect
        appContainer.classList.add('hidden');
        appContainer.classList.remove('visible');
        introOverlay.style.display = 'flex';
        introOverlay.style.opacity = '1';

        // Timing reduced to half speed
        setTimeout(() => {
            introOverlay.style.opacity = '0';
            setTimeout(() => {
                introOverlay.style.display = 'none';
                appContainer.classList.remove('hidden');
                appContainer.classList.add('visible');
            }, 400); 
        }, 1250);
    }

    // --- TRIGGER ON PAGE LOAD ---
    runIntroSequence();

    // 3. LOGO CLICK (Restart Transition)
    if (logoBtn) {
        logoBtn.addEventListener('click', () => {
            // First switch to about section (if switchTab function exists)
            if (typeof switchTab === "function") switchTab('about');
            // Then trigger the visual restart
            runIntroSequence();
        });
    }

    // 4. CONTACT FORM LOGIC
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.innerText = "SENDING...";
            submitBtn.style.opacity = "0.5";
            submitBtn.disabled = true;

            const data = new FormData(contactForm);
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    submitBtn.innerText = "THANK YOU!";
                    contactForm.reset();
                } else {
                    throw new Error();
                }
            } catch (err) {
                submitBtn.innerText = "ERROR";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
            }
        });
    }
    // --- 2. Navigation Helper Functions ---
    const navButtons = document.querySelectorAll('.nav-link');
    const footerLinks = document.querySelectorAll('.nav-link-footer');
    const sections = document.querySelectorAll('.page-section');

    function switchTab(targetId) {
        // Update Nav UI
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.target === targetId) btn.classList.add('active');
        });

        // Show Section
        sections.forEach(sec => sec.classList.remove('active-section'));
        document.getElementById(targetId).classList.add('active-section');
        
        // Scroll to top of container
        window.scrollTo(0,0);
    }

    // Top Nav Click
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.id === 'theme-toggle') return;
            switchTab(btn.dataset.target);
        });
    });

    // Footer Nav Click
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.target);
        });
    });

    // Logo Click (Home/About)
    runIntroSequence();
    // --- 2. Navigation & Logo ---
    // Update the logo-btn listener to trigger the intro
    document.getElementById('logo-btn').addEventListener('click', () => {
        switchTab('about'); // Ensure it resets to 'about' section
        runIntroSequence(); // Trigger the visual transition
    });

    // --- 3. Service -> Portfolio Link Logic ---
    const serviceLinks = document.querySelectorAll('.service-link');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const resetBtn = document.getElementById('reset-filter');

    serviceLinks.forEach(link => {
        link.addEventListener('click', () => {
            const filterValue = link.getAttribute('data-filter');
            
            // 1. Switch to Portfolio Tab
            switchTab('portfolio');

            // 2. Filter Items
            filterGallery(filterValue);
        });
    });

    function filterGallery(category) {
        let hasMatches = false;
        
        galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                hasMatches = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/Hide Reset Button
        if(category !== 'all') {
            resetBtn.classList.add('show');
            resetBtn.textContent = "Show All";
        } else {
            resetBtn.classList.remove('show');
        }
    }

    resetBtn.addEventListener('click', () => {
        filterGallery('all');
    });


    // --- 4. Lightbox (Modal) Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const bgImage = item.querySelector('.img-box').style.backgroundImage;
            const title = item.querySelector('span').innerText;
            
            // Extract URL from 'url("...")' string
            const url = bgImage.slice(5, -2);
            
            lightbox.classList.add('active');
            lightboxImg.src = url;
            captionText.innerText = title;
        });
    });

    // Close logic
    closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // --- 5. Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀' : '☾';
    });
});
// Mobile Menu Toggle logic
document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    let isMenuOpen = false;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            if (isMenuOpen) {
                mobileMenu.classList.remove('hidden-menu');
                mobileMenu.classList.add('visible-menu');
            } else {
                mobileMenu.classList.remove('visible-menu');
                mobileMenu.classList.add('hidden-menu');
            }
        });

        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                isMenuOpen = false;
                mobileMenu.classList.remove('visible-menu');
                mobileMenu.classList.add('hidden-menu');
            });
        });
    }

    // --- REUSABLE INTERACTIVITY LOGIC ---
    function setupInteractiveSection(containerId, itemClass, defaultIndex = 0) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = Array.from(container.querySelectorAll(`.${itemClass}`));
        if (items.length === 0) return;

        // Active State Classes (Orange Glow + Scale)
        const activeClasses = [
            'border-primary',
            'border-2',
            'shadow-[0_20px_60px_-15px_rgba(255,106,0,0.3)]',
            'scale-105',
            'z-10',
            'bg-white'
        ];

        // Inactive State Classes
        const inactiveClasses = [
            'border-border',
            'border',
            'shadow-sm',
            'scale-100',
            'z-0',
            'bg-surface'
        ];

        function setActiveItem(activeIndex) {
            items.forEach((item, index) => {
                const btn = item.querySelector('.card-btn');

                if (index === activeIndex) {
                    // Activate Item
                    item.classList.remove(...inactiveClasses);
                    // Ensure bg-surface is removed before adding bg-white
                    item.classList.remove('bg-surface');
                    item.classList.add(...activeClasses);

                    // Activate Button (if exists)
                    if (btn) {
                        btn.classList.remove('bg-surface', 'text-secondary', 'border-border');
                        btn.classList.add('bg-primary', 'text-white', 'border-primary', 'shadow-md');
                    }
                } else {
                    // Deactivate Item
                    item.classList.remove(...activeClasses);
                    item.classList.add(...inactiveClasses);

                    // Deactivate Button (if exists)
                    if (btn) {
                        btn.classList.remove('bg-primary', 'text-white', 'border-primary', 'shadow-md');
                        btn.classList.add('bg-surface', 'text-secondary', 'border-border');
                    }
                }
            });
        }

        // Initialize Default
        setActiveItem(defaultIndex);

        // Hover Listeners
        items.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                setActiveItem(index);
            });
        });

        // Reset on Leave
        container.addEventListener('mouseleave', () => {
            setActiveItem(defaultIndex);
        });
    }

    // --- Initialize Pricing Section ---
    // 3 Cards, Default Middle (Index 1)
    setupInteractiveSection('pricing-container', 'pricing-card', 1);

    // --- Initialize Services Section ---
    // 4 Cards, Default First (Index 0)
    setupInteractiveSection('services-container', 'service-card', 0);

    // --- HOW IT WORKS PROGRESS LINE ---
    function initHowItWorks() {
        const grid = document.getElementById('how-it-works-grid');
        if (!grid) return;

        const steps = Array.from(grid.querySelectorAll('.step-item'));
        if (steps.length === 0) return;

        // Create Lines
        // Container for lines (Absolute behind z-0)
        let lineContainer = document.getElementById('hiw-line-container');
        if (!lineContainer) {
            lineContainer = document.createElement('div');
            lineContainer.id = 'hiw-line-container';
            lineContainer.className = 'absolute top-0 left-0 w-full h-full pointer-events-none z-0';
            grid.appendChild(lineContainer); // Append to grid (relative)
        }

        const bgLine = document.createElement('div');
        bgLine.className = 'absolute bg-gray-200 transition-all duration-300 transform -translate-y-1/2';
        lineContainer.appendChild(bgLine);

        const progressLine = document.createElement('div');
        progressLine.className = 'absolute bg-primary transition-all duration-300 ease-out transform -translate-y-1/2';
        progressLine.style.height = '0px';
        progressLine.style.width = '0px';
        lineContainer.appendChild(progressLine);

        // Active State Styles
        const activeTextClass = 'text-primary';
        const inactiveTextClass = 'text-gray-400';
        const activeTitleClass = 'text-secondary';
        const inactiveTitleClass = 'text-gray-400';
        const activeShadow = 'shadow-[0_0_15px_rgba(255,106,0,0.4)]';

        function updateState(activeIndex) {
            // Get positions
            const containerRect = grid.getBoundingClientRect();
            const circles = steps.map(s => s.querySelector('.step-circle').getBoundingClientRect());

            // Check orientation based on grid layout (if Step 2 is to the right of Step 1)
            // Desktop: Horizontal, Mobile: Vertical
            // Use centers to be safer
            const c0 = { x: circles[0].left + circles[0].width / 2, y: circles[0].top + circles[0].height / 2 };
            const c1 = { x: circles[1].left + circles[1].width / 2, y: circles[1].top + circles[1].height / 2 };
            const isHorizontal = Math.abs(c1.x - c0.x) > Math.abs(c1.y - c0.y);

            // Coordinates relative to container
            const getCenter = (rect) => ({
                x: rect.left + rect.width / 2 - containerRect.left,
                y: rect.top + rect.height / 2 - containerRect.top
            });

            const start = getCenter(circles[0]);
            const end = getCenter(circles[circles.length - 1]);
            const activePos = getCenter(circles[activeIndex]);

            // Styles
            const lineThickness = 4;
            // No offset needed if we use transform translate logic or consistent positioning
            // Using logic from replace call but slightly refined for alignment

            if (isHorizontal) {
                // Horizontal Line
                // Position: Center of Circle 1 to Center of Circle 3
                // remove -translate-y-1/2 from class if setting top directly, but usually easier to center vertically on top

                bgLine.style.left = `${start.x}px`;
                bgLine.style.top = `${start.y}px`; // Centered via class
                bgLine.style.width = `${end.x - start.x}px`;
                bgLine.style.height = `${lineThickness}px`;

                // Progress
                progressLine.style.left = `${start.x}px`;
                progressLine.style.top = `${start.y}px`;
                progressLine.style.height = `${lineThickness}px`;
                progressLine.style.width = `${Math.max(0, activePos.x - start.x)}px`;

            } else {
                // Vertical Line
                // Need to remove -translate-y-1/2 class for vertical? Or override transform.
                // Actually translate-y-1/2 is bad for vertical.
                // Let's reset transform
                bgLine.style.transform = 'translateX(-50%)';
                progressLine.style.transform = 'translateX(-50%)';

                bgLine.style.left = `${start.x}px`;
                bgLine.style.top = `${start.y}px`;
                bgLine.style.width = `${lineThickness}px`;
                bgLine.style.height = `${end.y - start.y}px`;

                // Progress
                progressLine.style.left = `${start.x}px`;
                progressLine.style.top = `${start.y}px`;
                progressLine.style.width = `${lineThickness}px`;
                progressLine.style.height = `${Math.max(0, activePos.y - start.y)}px`;
            }

            // Update Steps
            steps.forEach((step, index) => {
                const circle = step.querySelector('.step-circle');
                const title = step.querySelector('.step-title');

                if (index <= activeIndex) {
                    circle.classList.remove(inactiveTextClass);
                    circle.classList.add(activeTextClass, activeShadow);

                    title.classList.remove(inactiveTitleClass);
                    title.classList.add(activeTitleClass);
                } else {
                    circle.classList.add(inactiveTextClass);
                    circle.classList.remove(activeTextClass, activeShadow);

                    title.classList.add(inactiveTitleClass);
                    title.classList.remove(activeTitleClass);
                }
            });
        }

        // Initial Update
        setTimeout(() => updateState(0), 100);
        window.addEventListener('resize', () => {
            updateState(currentActiveIndex);
        });

        let currentActiveIndex = 0;

        // Desktop Hover
        steps.forEach((step, index) => {
            step.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 768) {
                    currentActiveIndex = index;
                    updateState(index);
                }
            });
        });

        grid.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 768) {
                currentActiveIndex = 0;
                updateState(0);
            }
        });

        // Mobile Scroll (Intersection Observer)
        const observer = new IntersectionObserver((entries) => {
            if (window.innerWidth < 768) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.dataset.step) - 1;
                        currentActiveIndex = index;
                        updateState(index);
                    }
                });
            }
        }, { threshold: 0.6 });

        steps.forEach(step => observer.observe(step));
    }

    // Init
    initHowItWorks();
});

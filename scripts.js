document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#sidebar a');
    const pages = document.querySelectorAll('.page-content');

    // lazy-initialized Chart instances
    let portfolioChart = null;
    let assetAllocationChart = null;

    function initPortfolioChart() {
        if (portfolioChart) {
            portfolioChart.resize();
            portfolioChart.update();
            return;
        }
        const canvas = document.getElementById('portfolioChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Portfolio Value',
                    data: [20000, 21000, 20500, 22000, 23000, 22500, 24000],
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 400 },
                scales: { y: { beginAtZero: false } },
                plugins: { legend: { display: true } }
            }
        });
    }

    function initAssetAllocationChart() {
        if (assetAllocationChart) {
            assetAllocationChart.resize();
            assetAllocationChart.update();
            return;
        }
        const canvas = document.getElementById('assetAllocationChart');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        assetAllocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Tech Stocks', 'Crypto', 'Real Estate'],
                datasets: [{
                    data: [15000, 5000, 5000],
                    backgroundColor: ['#007bff', '#17a2b8', '#28a745'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 400 },
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // simple debounce utility
    function debounce(fn, wait = 200) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // Resize handler (debounced) to avoid expensive repeated redraws
    const handleResize = debounce(() => {
        if (portfolioChart) {
            try { portfolioChart.resize(); portfolioChart.update(); } catch (e) { /* ignore */ }
        }
        if (assetAllocationChart) {
            try { assetAllocationChart.resize(); assetAllocationChart.update(); } catch (e) { /* ignore */ }
        }
    }, 200);

    window.addEventListener('resize', handleResize);

    // Ensure aria-hidden and aria-current reflect UI state
    function setVisibility(targetId) {
        pages.forEach(page => {
            const isVisible = (page.id === targetId);
            page.classList.toggle('d-none', !isVisible);
            page.setAttribute('aria-hidden', (!isVisible).toString());
        });

        navLinks.forEach(link => {
            const isActive = (link.getAttribute('data-target') === targetId);
            if (isActive) {
                link.parentElement.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.parentElement.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('data-target');

            // update visibility and accessibility attributes
            setVisibility(targetId);

            // Ensure charts initialize/rescale after visibility change (on next frame)
            requestAnimationFrame(() => {
                if (targetId === 'dashboard') initPortfolioChart();
                if (targetId === 'investments') initAssetAllocationChart();

                // force resize/update in case container size changed during transition
                handleResize();
            });
        });
    });

    // Initialize ARIA states and visible page on load
    (function initState() {
        // Determine initially visible page (any without d-none)
        let visiblePage = null;
        pages.forEach(page => {
            if (!page.classList.contains('d-none')) visiblePage = page.id;
        });
        if (!visiblePage) visiblePage = pages[0] && pages[0].id;

        setVisibility(visiblePage);

        // initialize charts for the visible page
        if (visiblePage === 'dashboard') initPortfolioChart();
        if (visiblePage === 'investments') initAssetAllocationChart();

        // small deferred resize to handle any initial layout quirks
        requestAnimationFrame(() => handleResize());
    })();
});

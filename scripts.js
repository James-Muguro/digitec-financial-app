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
                animation: {
                    duration: 400
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                plugins: {
                    legend: { display: true }
                }
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
                animation: {
                    duration: 400
                },
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const currentActive = document.querySelector('#sidebar .active');
            if (currentActive) currentActive.classList.remove('active');
            this.parentElement.classList.add('active');

            const targetId = this.getAttribute('data-target');

            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.remove('d-none');
                } else {
                    page.classList.add('d-none');
                }
            });

            // Ensure charts initialize/rescale after visibility change
            requestAnimationFrame(() => {
                if (targetId === 'dashboard') initPortfolioChart();
                if (targetId === 'investments') initAssetAllocationChart();
            });
        });
    });

    // Initialize visible charts on load
    initPortfolioChart();
});

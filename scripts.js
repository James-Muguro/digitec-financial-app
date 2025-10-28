document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#sidebar a');
    const pages = document.querySelectorAll('.page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector('#sidebar .active').classList.remove('active');
            this.parentElement.classList.add('active');

            const targetId = this.getAttribute('data-target');

            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.remove('d-none');
                } else {
                    page.classList.add('d-none');
                }
            });
        });
    });

    // Chart.js Portfolio Chart
    const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
    const portfolioChart = new Chart(portfolioCtx, {
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
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // Asset Allocation Chart
    const assetCtx = document.getElementById('assetAllocationChart').getContext('2d');
    const assetAllocationChart = new Chart(assetCtx, {
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
        }
    });
});

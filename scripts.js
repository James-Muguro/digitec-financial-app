document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('#sidebar a');
    const pages = document.querySelectorAll('.page-content');

    // lazy-initialized Chart instances
    let portfolioChart = null;
    let assetAllocationChart = null;
    const STORAGE_KEY = 'digitec:lastPage';
    
    // Mock API endpoint for payments
    const mockPaymentAPI = {
        send: async (data) => {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                return {
                    success: true,
                    id: 'tx_' + Math.random().toString(36).substr(2, 9),
                    ...data
                };
            }
            throw new Error('Payment failed. Please try again.');
        }
    };

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

    // Ensure aria-hidden, aria-current reflect UI state and manage focus/announcements
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

        // Persist the currently visible page
        try { localStorage.setItem(STORAGE_KEY, targetId); } catch (e) { /* ignore */ }

        // Announce to assistive tech and move focus to the main heading of the visible page
        const announcer = document.getElementById('a11y-announcer');
        const visiblePage = document.getElementById(targetId);
        if (announcer && visiblePage) {
            const titleEl = visiblePage.querySelector('h2');
            const titleText = titleEl ? titleEl.textContent.trim() : targetId;
            announcer.textContent = `${titleText} page opened`;

            // make sure heading is focusable then focus it for keyboard/screen-reader users
            if (titleEl) {
                titleEl.setAttribute('tabindex', '-1');
                titleEl.focus({ preventScroll: true });
            }
        }
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

        // support keyboard activation (Enter / Space) for links
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // CSV Export functionality
    function exportTableToCSV(tableId, filename) {
        const table = document.getElementById(tableId);
        if (!table) return;

        // Get headers
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => 
            headers.push(th.textContent.trim())
        );

        // Get data rows
        const rows = [];
        table.querySelectorAll('tbody tr').forEach(tr => {
            const row = [];
            tr.querySelectorAll('td').forEach(td => {
                // Clean up badge text if present
                const badge = td.querySelector('.badge');
                row.push(badge ? badge.textContent.trim() : td.textContent.trim());
            });
            rows.push(row);
        });

        // Combine and format as CSV
        const csv = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
            return;
        }
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Handle payment form submission
    const paymentForm = document.querySelector('#payments form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);
            
            // Disable form while processing
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="material-icons spin">refresh</span> Sending...';
            
            try {
                const data = {
                    recipient: formData.get('recipient'),
                    amount: parseFloat(formData.get('amount')),
                    note: formData.get('note')
                };
                
                const result = await mockPaymentAPI.send(data);
                
                // Show success message
                const alert = document.createElement('div');
                alert.className = 'alert alert-success mt-3';
                alert.role = 'alert';
                alert.innerHTML = `Payment sent successfully! Transaction ID: ${result.id}`;
                paymentForm.appendChild(alert);
                
                // Reset form
                this.reset();
                setTimeout(() => alert.remove(), 5000);
                
            } catch (error) {
                // Show error message
                const alert = document.createElement('div');
                alert.className = 'alert alert-danger mt-3';
                alert.role = 'alert';
                alert.textContent = error.message;
                paymentForm.appendChild(alert);
                setTimeout(() => alert.remove(), 5000);
            } finally {
                // Re-enable form
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send';
            }
        });
    }

    // Wire up CSV export button
    const exportBtn = document.getElementById('exportCSV');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            exportTableToCSV('transactionsTable', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        });
    }

    // Initialize ARIA states and visible page on load
    (function initState() {
        // Determine initially visible page (any without d-none)
        let visiblePage = null;
        pages.forEach(page => {
            if (!page.classList.contains('d-none')) visiblePage = page.id;
        });

        // If a page was persisted, prefer that one (if it exists)
        try {
            const persisted = localStorage.getItem(STORAGE_KEY);
            if (persisted && document.getElementById(persisted)) visiblePage = persisted;
        } catch (e) { /* ignore */ }

        if (!visiblePage) visiblePage = pages[0] && pages[0].id;

        setVisibility(visiblePage);

        // initialize charts for the visible page
        if (visiblePage === 'dashboard') initPortfolioChart();
        if (visiblePage === 'investments') initAssetAllocationChart();

        // small deferred resize to handle any initial layout quirks
        requestAnimationFrame(() => handleResize());
    })();
});

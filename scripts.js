// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    request: this.request.value
  };

  fetch('/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
    .then(response => response.text())
    .then(data => {
      showToast(data);
      this.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      showToast('An error occurred while submitting your request.');
    });
});

// Dark mode toggle with persistence
const toggleButton = document.getElementById('toggleDarkMode');
const isDark = localStorage.getItem('darkMode') === 'true';

if (isDark) {
  document.body.classList.add('dark-mode');
  toggleButton.textContent = '🌙';
} else {
  toggleButton.textContent = '☀️';
}

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const darkModeEnabled = document.body.classList.contains('dark-mode');
  toggleButton.textContent = darkModeEnabled ? '🌙' : '☀️';
  localStorage.setItem('darkMode', darkModeEnabled);
});

// Toast notification with animation
function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// Scroll animations
const animatedElements = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.15
});

animatedElements.forEach(el => observer.observe(el));

document.getElementById('contactForm').addEventListener('submit', function(e) {
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

// Dark mode toggle
const toggleButton = document.getElementById('toggleDarkMode');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleButton.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});

// Toast notification
function showToast(message) {
  let toast = document.createElement('div');
  toast.className = 'toast show';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('show');
    document.body.removeChild(toast);
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
  threshold: 0.1
});

animatedElements.forEach(el => observer.observe(el));

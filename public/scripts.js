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
    alert(data);
    this.reset();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while submitting your request.');
  });
});

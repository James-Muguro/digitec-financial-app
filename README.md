<div align="center">
  <a href="https://github.com/James-Muguro/digitec-financial-app">
    <img src="https://img.shields.io/github/stars/James-Muguro/digitec-financial-app.svg?style=for-the-badge" alt="Stars">
    <img src="https://img.shields.io/github/forks/James-Muguro/digitec-financial-app.svg?style=for-the-badge" alt="Forks">
    <img src="https://img.shields.io/github/issues/James-Muguro/digitec-financial-app.svg?style=for-the-badge" alt="Issues">
    <img src="https://img.shields.io/github/license/James-Muguro/digitec-financial-app.svg?style=for-the-badge" alt="License">
  </a>
</div>

# Digitec Financial App

A modern, accessible financial dashboard for managing accounts, investments, and payments. Built with vanilla JavaScript and Chart.js.

## Features

### Dashboard

- Total balance, investments, and liabilities overview
- Interactive portfolio performance chart
- Responsive layout with mobile support

### Wallets

- View multiple account balances
- Quick transfer and details access
- Card-based interface for easy scanning

### Investments

- Dynamic asset allocation doughnut chart
- Detailed holdings breakdown
- Real-time portfolio visualization

### Payments

- User-friendly payment form
- Simulated API integration (90% success rate)
- Success/error feedback with loading states
- Form validation and error handling

### Transaction History

- Sortable transaction table
- Status indicators with color coding
- CSV export functionality
- Detailed transaction information

## Technical Features

### Accessibility

- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Live announcements for dynamic content
- Skip links and proper heading structure

### User Experience

- Page state persistence using localStorage
- Lazy-loaded charts (only initialize when visible)
- Responsive sidebar with mobile optimization
- Optimistic UI updates for better feedback
- Debounced chart resizing for performance

## Technology Stack

- HTML5 & CSS3
- Vanilla JavaScript (ES6+)
- Bootstrap 5.3
- Chart.js for data visualization
- Material Icons

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/James-Muguro/digitec-financial-app.git
cd digitec-financial-app
```

2. Serve locally (optional):

```bash
# Using Python
python3 -m http.server 8000

# Or using Node.js
npx http-server
```

3. Access the app:

- Using local server: visit `http://localhost:8000`
- Direct access: open `index.html` in your browser

## Project Structure

```
digitec-financial-app/
├── index.html      # Main application markup
├── styles.css      # Custom styles and Bootstrap overrides
├── scripts.js      # Application logic and chart initialization
├── README.md       # This documentation
└── LICENSE         # MIT License
```

## Development Notes

### Charts
- Portfolio chart uses line type with area fill
- Asset allocation uses doughnut chart
- Both charts are responsive and resize with window
- Charts initialize lazily when their page becomes visible

### Navigation
- Keyboard accessible (Enter/Space to activate)
- Proper ARIA attributes for screen readers
- Focus management between pages
- State persistence across sessions

### Forms & Data
- Mock payment API with simulated network delay
- CSV export using Blob API
- Form validation and error handling
- Optimistic UI updates

## Browser Support

Tested and works in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: Feature description'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Project Link: [https://github.com/James-Muguro/digitec-financial-app](https://github.com/James-Muguro/digitec-financial-app)

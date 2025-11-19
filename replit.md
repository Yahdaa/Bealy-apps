# Overview

Veraxa is a web-based application showcase platform that displays mobile apps with a focus on iOS-style design. The application features a modal-based interface for presenting app details and includes notification functionality for user engagement. It's designed as a simple, static website with interactive elements for app discovery and user notifications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Technology Stack**: Pure HTML, CSS, and JavaScript without frameworks
- **Design Pattern**: Component-based modals and popups for user interactions
- **Styling Approach**: CSS3 with modern features including gradients, animations, and responsive design
- **UI/UX**: iOS-inspired design language with rounded corners, smooth animations, and card-based layouts

## Core Components
- **App Display System**: Card-based layout for showcasing applications with hover effects and gradient backgrounds
- **Modal System**: Fullscreen modal overlays for detailed app information display
- **Notification System**: Popup notifications with animated bell icons for user feedback
- **Responsive Design**: Mobile-first approach with viewport optimization

## JavaScript Architecture
- **Event-Driven**: DOM manipulation and event listeners for user interactions
- **Modular Functions**: Separate functions for modal creation, notifications, and app display
- **Dynamic Content**: Programmatic creation of DOM elements for modals and popups

## Styling Strategy
- **CSS Reset**: Universal box-sizing and margin/padding reset
- **Animation Library**: Integration with Animate.css for enhanced visual effects
- **Custom Animations**: CSS transitions and transforms for hover states and interactions
- **Color Scheme**: Gradient-based design with vibrant colors (pink to orange themes)

# External Dependencies

## Third-Party Services
- **Google AdSense**: Monetization through display advertising (client ID: ca-pub-4653147807800151)
- **Firebase**: Real-time database integration for potential data storage and user management
- **Font Awesome**: Icon library for UI elements and interactive buttons
- **Animate.css**: CSS animation library from CDN for enhanced visual effects

## CDN Resources
- **Firebase SDK**: Version 9.22.0 compatibility mode for database functionality
- **Animate.css**: Version 4.1.1 for pre-built animations
- **Font Awesome Kit**: External icon library integration

## Browser Dependencies
- **Modern Web Standards**: CSS3, ES6+ JavaScript features
- **Responsive Design**: Viewport meta tag and mobile optimization
- **Font Stack**: System fonts with fallbacks (-apple-system, BlinkMacSystemFont, Segoe UI)
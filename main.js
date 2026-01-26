// Global Initialization Script
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Lenis on load
  window.initLenis();
  
  // Add active class to current nav link
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.barba-link');
  
  links.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.includes(linkPath.replace('.html', ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Initialize current page
  window.initCurrentPage();
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is hidden
    if (window.lenis) {
      window.lenis.stop();
    }
  } else {
    // Page is visible
    if (window.lenis) {
      window.lenis.start();
    }
  }
});

// Handle before page unload (for cleanup)
window.addEventListener('beforeunload', function() {
  // Clean up skills page if active
  if (window.location.pathname.includes('skills') && window.cleanupSkillsPage) {
    window.cleanupSkillsPage();
  }
});
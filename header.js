document.addEventListener('DOMContentLoaded', function() {
    // Get all nav items that have dropdowns
const navItems = document.querySelectorAll('.header-section li');

navItems.forEach(item => {
  const link = item.querySelector('a');
  const dropdown = item.querySelector('ul');

  if (!dropdown) return; // Skip items without dropdown

  // Hide dropdown initially
  dropdown.style.display = 'none';

  // Toggle dropdown on click
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default link behavior

    // Close all other dropdowns
    navItems.forEach(otherItem => {
      if (otherItem !== item) {
        const otherDropdown = otherItem.querySelector('ul');
        if (otherDropdown) otherDropdown.style.display = 'none';
      }
    });

    // Toggle current dropdown
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'block';
    } else {
      dropdown.style.display = 'none';
    }
  });
});

// Close dropdowns if clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.header-section li')) {
    navItems.forEach(item => {
      const dropdown = item.querySelector('ul');
      if (dropdown) dropdown.style.display = 'none';
    });
  }
});

});
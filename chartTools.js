// Utility to toggle dropdowns
  function toggleDropdown(buttonId, dropdownId) {
    const btn = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.absolute').forEach(d => {
        if (d !== dropdown) d.classList.add('hidden');
      });
      dropdown.classList.toggle('hidden');
    });
  }

  toggleDropdown("dropdown-drawings-btn", "dropdown-drawings");
  toggleDropdown("dropdown-indicators-btn", "dropdown-indicators");
  toggleDropdown("dropdown-timeframes-btn", "dropdown-timeframes");
  toggleDropdown("dropdown-charttypes-btn", "dropdown-charttypes");

  // Close on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.absolute').forEach(d => d.classList.add('hidden'));
  });
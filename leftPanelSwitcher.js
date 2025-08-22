document.addEventListener("DOMContentLoaded", () => {
  function switchLeftPanel(panelId) {
    const panelSections = document.querySelectorAll(".panel-section");
    panelSections.forEach(section => section.classList.remove("active"));

    const targetPanel = document.querySelector(`#${panelId}Content`);
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  }

  const leftSidebar = document.querySelector(".left-panel");
  const mainContent = document.getElementById("mainContent");

  document.querySelectorAll(".sidebar-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const isActive = icon.classList.contains("active");

      if (isActive) {
        // Single-click toggle: hide/show sidebar
        leftSidebar.classList.toggle("hidden");
        mainContent.classList.toggle("expanded");
        return; // do not switch panel
      }

      // Clicking a different icon: switch panel
      document.querySelectorAll(".sidebar-icon").forEach(i => i.classList.remove("active"));
      icon.classList.add("active");
      switchLeftPanel(icon.dataset.panel);

      // Ensure sidebar is visible
      if (leftSidebar.classList.contains("hidden")) {
        leftSidebar.classList.remove("hidden");
        mainContent.classList.remove("expanded");
      }
    });
  });
});

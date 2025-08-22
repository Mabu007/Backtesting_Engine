const sidebar = document.getElementById("sidebar");
const mainChart = document.getElementById("mainChartContainer");

function toggleSidebar() {
  sidebar.classList.toggle("collapsed"); // Or your toggle logic
  // Trigger chart resize (some chart libs need this)
  if (window.myChart) { 
    window.myChart.resize(); // e.g., ECharts
  }
}

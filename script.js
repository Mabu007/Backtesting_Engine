document.addEventListener('DOMContentLoaded', () => {
    
    // === DOM Elements ===
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const chartTabsContainer = document.getElementById('chartTabsContainer');
    const bottomPanel = document.getElementById('bottomPanel');

    let isResizing = false;
    let chartCounter = 0;
    let activeChartId = `chart-${chartCounter}`;

    // === Sidebar Functionality ===
    sidebarToggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        mainContent.classList.toggle('w-full');
    });

    // Initial tab for the first chart
    const initialTab = document.createElement('div');
    initialTab.className = 'chart-tab active';
    initialTab.dataset.chartId = `chart-0`;
    initialTab.textContent = 'Main Chart';
    chartTabsContainer.appendChild(initialTab);

    // === Bottom Panel Resizing Functionality ===
    let state = 1; // 0: closed, 1: half-height, 2: full-height
    const MIN_PANEL_HEIGHT = 200; // Minimum height in pixels for the panel

    const resizePanel = (e) => {
        const mainContentRect = mainContent.getBoundingClientRect();
        let newHeight = mainContentRect.bottom - e.clientY;
        
        if (newHeight > mainContentRect.height - 100) {
            newHeight = mainContentRect.height;
        } else if (newHeight < MIN_PANEL_HEIGHT) {
            newHeight = MIN_PANEL_HEIGHT;
        }
        
        bottomPanel.style.height = `${newHeight}px`;
        bottomPanel.classList.remove('closed', 'maximized');
        state = 1; // Always reset to half-height when manually resizing
    };

});


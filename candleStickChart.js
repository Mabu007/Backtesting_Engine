// Use an IIFE to avoid polluting global scope
(function() {
    const csvPath = 'chart/binance_1m_january.csv';
    const chartDom = document.getElementById('chart-10');
    const myChart = echarts.init(chartDom, null, { renderer: 'canvas' });

    // Helper: resize chart after any layout change
    const resizeChart = () => {
        if (myChart) myChart.resize();
    };

    // Listen for window resize
    window.addEventListener('resize', resizeChart);

    // Sidebar toggle handling (assumes your sidebar toggle button is #sidebar-toggle-btn)
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const leftSidebar = document.getElementById('leftSidebar');

    sidebarToggleBtn.addEventListener('click', () => {
        leftSidebar.classList.toggle('collapsed');

        // Trigger chart resize after transition
        setTimeout(() => {
            if (window.chartInstance) window.chartInstance.resize();
        }, 310); // match CSS transition duration
    });



    // Load CSV data
    Papa.parse(csvPath, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data.filter(d => d.date);

            const chartData = data.map(d => [
                `${d.date} ${d.time}`,
                d.open,
                d.close,
                d.low,
                d.high
            ]);

            const option = {
                backgroundColor: '#111827', // dark background
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' }
                },
                grid: {
                    left: '5%',
                    right: '2%',
                    top: '2%',
                    bottom: '12%'
                },
                xAxis: {
                    type: 'category',
                    data: chartData.map(item => item[0]),
                    axisLine: { lineStyle: { color: '#374151' } },
                    axisLabel: { color: '#9ca3af' },
                    splitLine: { show: false }
                },
                yAxis: {
                    position: 'left',
                    scale: true,
                    axisLine: { lineStyle: { color: '#374151' } },
                    axisLabel: { color: '#9ca3af' },
                    splitLine: { lineStyle: { color: '#1f2937' } }
                },
                dataZoom: [
                    { type: 'inside', xAxisIndex: [0], start: 90, end: 100 },
                    { type: 'slider', xAxisIndex: [0], start: 90, end: 100,
                      backgroundColor: '#1f2937', borderColor: '#374151', textStyle: { color: '#9ca3af' } }
                ],
                series: [
                    {
                        name: 'Price',
                        type: 'candlestick',
                        data: chartData.map(item => item.slice(1)),
                        itemStyle: {
                            color: '#ef4444', // red for down
                            color0: '#10b981', // green for up
                            borderColor: '#ef4444',
                            borderColor0: '#10b981'
                        }
                    }
                ]
            };

            myChart.setOption(option);


            // Fire custom event for date-time navigator
            document.dispatchEvent(new CustomEvent("chart-ready", {
            detail: { chart: myChart, data: chartData }
            }));


            // Initial resize to ensure it fills all space
            resizeChart();

            // Store globally if needed elsewhere
            window.chartInstance = myChart;
        }
    });
})();

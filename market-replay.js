(function () {
  let myChart = null;
  let chartData = [];
  let replayIndex = 0;
  let replayTimer = null;
  let replaySpeed = 1000; // interval between candles

  let totalVisible = 50;   // default viewport size
  const leftEmpty = 12;    // right empty space
  const minVisible = 10;   // minimum zoom in
  let maxVisible = 1000;   // maximum zoom out, will dynamically clamp to data length

  let viewportStart = 0;
  let viewportEnd = 0;

  function initMarketReplay(chart, data) {
    myChart = chart;
    chartData = data;
    maxVisible = chartData.length; // max zoom is full data

    const enableCheckbox = document.getElementById("marketReplayEnable");
    const btnRewind = document.getElementById("replayRewind");
    const btnPlayPause = document.getElementById("replayPlayPause");
    const btnForward = document.getElementById("replayForward");
    const playIcon = document.getElementById("replayPlayIcon");
    const speedSelect = document.getElementById("replaySpeed");
    const goBtn = document.getElementById("goToDateTime");
    const dateInput = document.getElementById("chartDate");
    const timeInput = document.getElementById("chartTime");
    const showAllBtn = document.getElementById("showAllCandles");

    const zoomOutBtn = document.getElementById("zoomOut");
    const zoomInBtn = document.getElementById("zoomIn");

    // Toggle replay mode
    enableCheckbox.addEventListener("change", () => {
      if (enableCheckbox.checked) {
        replayIndex = 0;
        if (dateInput.value && timeInput.value) {
          const target = chartData.findIndex(
            d => d[0] === `${dateInput.value} ${timeInput.value}`
          );
          replayIndex = target !== -1 ? target : 0;
        }
        updateReplayChart();
      } else {
        stopReplay();
        myChart.setOption({
          series: [{ data: chartData.map(d => d.slice(1)) }],
          xAxis: { data: chartData.map(d => d[0]) }
        });
      }
    });

    // Go button
    goBtn.addEventListener("click", () => {
      if (!enableCheckbox.checked) return;
      const dateTimeString = `${dateInput.value} ${timeInput.value}`;
      const target = chartData.findIndex(d => d[0] === dateTimeString);
      if (target !== -1) {
        replayIndex = target;
        updateReplayChart();
      }
    });

    // Rewind / forward
    btnRewind.addEventListener("click", () => {
      if (!enableCheckbox.checked) return;
      replayIndex = Math.max(0, replayIndex - 1);
      updateReplayChart();
    });
    btnForward.addEventListener("click", () => {
      if (!enableCheckbox.checked) return;
      replayIndex = Math.min(chartData.length - 1, replayIndex + 1);
      updateReplayChart();
    });

    // Play / pause
    btnPlayPause.addEventListener("click", () => {
      if (!enableCheckbox.checked) return;
      if (replayTimer) stopReplay();
      else startReplay();
      playIcon.classList.toggle("fa-play");
      playIcon.classList.toggle("fa-pause");
    });

    // Speed select
    speedSelect.addEventListener("change", () => {
      replaySpeed = parseInt(speedSelect.value);
      if (replayTimer) {
        stopReplay();
        startReplay();
      }
    });

    // Show all revealed candles
    if (showAllBtn) {
      showAllBtn.addEventListener("click", () => {
        viewportStart = 0;
        viewportEnd = replayIndex;
        updateChartWithViewport();
      });
    }

    // Smooth zoom buttons
    zoomOutBtn.addEventListener("click", () => {
      totalVisible = Math.min(maxVisible, totalVisible * 1.2);
      updateReplayChart();
    });
    zoomInBtn.addEventListener("click", () => {
      totalVisible = Math.max(minVisible, totalVisible / 1.2);
      updateReplayChart();
    });

    // Keyboard controls
    document.addEventListener("keydown", e => {
      const visibleCandlesOnLeft = Math.floor(totalVisible - leftEmpty);

      // Panning
      if (e.key === "ArrowLeft") {
        viewportStart = Math.max(0, viewportStart - 1);
        viewportEnd = viewportStart + visibleCandlesOnLeft - 1;
        updateChartWithViewport();
      } else if (e.key === "ArrowRight") {
        viewportEnd = Math.min(replayIndex, viewportEnd + 1);
        viewportStart = viewportEnd - visibleCandlesOnLeft + 1;
        updateChartWithViewport();
      }

      // Zooming
      else if (e.key === "+" || e.key === "=") {
        totalVisible = Math.max(minVisible, totalVisible / 1.2);
        updateReplayChart();
      } else if (e.key === "-" || e.key === "_") {
        totalVisible = Math.min(maxVisible, totalVisible * 1.2);
        updateReplayChart();
      }
    });
  }

  function updateReplayChart() {
    const visibleCandlesOnLeft = Math.floor(totalVisible - leftEmpty);
    viewportEnd = Math.min(replayIndex, chartData.length - 1);
    viewportStart = Math.max(0, viewportEnd - visibleCandlesOnLeft + 1);
    updateChartWithViewport();
  }

  function updateChartWithViewport(animationProgress = 1) {
    const slicedData = [];
    const visibleCandlesOnLeft = Math.floor(totalVisible - leftEmpty);

    for (let i = 0; i < Math.floor(totalVisible); i++) {
      if (i < visibleCandlesOnLeft) {
        const dataIndex = viewportStart + i;
        if (dataIndex >= 0 && dataIndex < chartData.length) {
          if (dataIndex === replayIndex && animationProgress < 1) {
            const prev = chartData[dataIndex - 1] || [null, null, null, null, null];
            const current = chartData[dataIndex];
            const interpolated = current.map((v, idx) =>
              v !== null && prev[idx] !== null ? prev[idx] + (v - prev[idx]) * animationProgress : v
            );
            slicedData.push(interpolated);
          } else {
            slicedData.push(chartData[dataIndex]);
          }
        } else slicedData.push([null, null, null, null, null]);
      } else slicedData.push([null, null, null, null, null]); // right empty
    }

    myChart.setOption({
      series: [{ data: slicedData.map(d => d.slice(1)) }],
      xAxis: { data: slicedData.map(d => d[0] || "") }
    });
  }

  function startReplay() {
    function step() {
      if (replayIndex >= chartData.length) {
        stopReplay();
        return;
      }

      const startTime = performance.now();
      const duration = replaySpeed;

      function animate(time) {
        const progress = Math.min(1, (time - startTime) / duration);
        updateChartWithViewport(progress);
        if (progress < 1) requestAnimationFrame(animate);
        else {
          replayIndex++;
          updateReplayChart();
          if (replayTimer) replayTimer = requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(animate);
    }

    replayTimer = requestAnimationFrame(step);
  }

  function stopReplay() {
    if (replayTimer) cancelAnimationFrame(replayTimer);
    replayTimer = null;
  }

  document.addEventListener("chart-ready", e => {
    const { chart, data } = e.detail;
    initMarketReplay(chart, data);
  });
})();

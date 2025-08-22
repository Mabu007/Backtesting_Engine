// datetime-navigator.js
(function () {
  let chartData = []; // we’ll overwrite this with parsed data later
  let myChart = null;

  // 🔹 Attach to window.chartInstance once it’s created
  function initDateTimeNavigator(chart, data) {
    myChart = chart;
    chartData = data;

    const goBtn = document.getElementById("goToDateTime");
    const dateInput = document.getElementById("chartDate");
    const timeInput = document.getElementById("chartTime");

    if (!goBtn || !dateInput || !timeInput) {
      console.warn("DateTime navigator elements not found in DOM.");
      return;
    }

    goBtn.addEventListener("click", () => {
      const date = dateInput.value;
      const time = timeInput.value;

      if (!date || !time) {
        alert("Please select both date and time.");
        return;
      }

      const dateTimeString = `${date} ${time}`;
      const target = chartData.findIndex(
        (d) => d[0] === dateTimeString
      );

      if (target === -1) {
        alert("No matching data for that date & time.");
        return;
      }

      // 🔹 Focus chart around the found index
      const total = chartData.length;
      const windowSize = 100; // how many candles to show
      const start = Math.max(0, (target - windowSize / 2) / total * 100);
      const end = Math.min(100, (target + windowSize / 2) / total * 100);

      myChart.dispatchAction({
        type: "dataZoom",
        start: start,
        end: end
      });
    });
  }

  // 🔹 Hook into your CSV loader when chart is ready
  document.addEventListener("chart-ready", (e) => {
    const { chart, data } = e.detail;
    initDateTimeNavigator(chart, data);
  });
})();

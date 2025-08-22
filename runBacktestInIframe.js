function runBacktestInIframe(code, csvLinks = []) {
  // Remove old iframe if it exists
  const oldIframe = document.getElementById('sandboxIframe');
  if (oldIframe) oldIframe.remove();

  // Create new iframe
  const iframe = document.createElement('iframe');
  iframe.id = 'sandboxIframe';
  iframe.sandbox = 'allow-scripts';
  iframe.style.display = 'none'; // hidden
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  // Build a script to inject into iframe
  const scriptContent = `
    // Override console.log to pass messages to parent
    console.log = (...args) => {
      parent.postMessage({ type: 'log', data: args.join(' ') }, '*');
    };

    console.error = (...args) => {
      parent.postMessage({ type: 'error', data: args.join(' ') }, '*');
    };

    // Include your compiler logic (conditionsToCode) if needed
    ${window.conditionsToCode.toString()}

    // Inject the generated code
    ${code}

    // Helper to fetch CSVs
    async function fetchCSV(url) {
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.split('\\n').filter(l => l.trim() !== '');
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        let obj = {};
        headers.forEach((h, i) => obj[h.trim()] = isNaN(values[i]) ? values[i].trim() : parseFloat(values[i]));
        return obj;
      });
      return data;
    }

    async function loadAndRunBacktest() {
      let allData = [];
      for (const url of ${JSON.stringify(csvLinks)}) {
        const csvData = await fetchCSV(url);
        allData = allData.concat(csvData);
      }
      if (typeof runBacktest === 'function') {
        runBacktest(allData);
      }
    }

    loadAndRunBacktest();
  `;

  const script = iframeDoc.createElement('script');
  script.textContent = scriptContent;
  iframeDoc.body.appendChild(script);
}


// Listen for messages from the iframe
window.addEventListener('message', (event) => {
  if (event.data.type === 'log') {
    const metricsTab = document.getElementById('metricsContent');
    const logEl = document.createElement('div');
    logEl.className = 'text-white text-sm';
    logEl.textContent = event.data.data;
    metricsTab.appendChild(logEl);
  }
  if (event.data.type === 'error') {
    const problemsList = document.getElementById('problemsList');
    const li = document.createElement('li');
    li.textContent = event.data.data;
    problemsList.appendChild(li);
  }
});

//backtestConfig.js

function setupBacktestConfigModal() {
  const modal = document.getElementById('backtestConfigModal');
  const runBacktestBtn = document.getElementById('run-backtest-btn');
  const cancelBtn = document.getElementById('cancelBacktestConfig');
  const form = document.getElementById('backtestConfigForm');

  // Open modal when user clicks the run button
  runBacktestBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Close modal when user clicks cancel
  cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const config = {
      tradeType: form.tradeType.value,
      amountPerTrade: parseFloat(form.amountPerTrade.value),
      accountBalance: parseFloat(form.accountBalance.value),
      slippage: parseFloat(form.slippage.value),
      stopLoss: parseFloat(form.stopLoss.value),
      takeProfit: parseFloat(form.takeProfit.value),
      startDate: form.startDate.value,
      endDate: form.endDate.value
    };

    
    const entryConditions = []; // filled elsewhere
    const exitConditions = [];  // filled elsewhere
     
    updateConditionsArrays();
    const code = window.conditionsToCode(window.entryConditions, window.exitConditions, config);
    
   
console.log("Entry Conditions Raw:", window.entryConditions);
console.log("Exit Conditions Raw:", window.exitConditions);
     // Close modal
    modal.classList.add('hidden');

    // Log the generated code for debugging
    console.log('Generated Code:', code);

    // Example Google Drive CSV links (must be shared publicly)
    const csvLinks = [
      'https://drive.google.com/uc?export=download&id=FILE_ID_1',
      'https://drive.google.com/uc?export=download&id=FILE_ID_2'
    ];

    // Run the backtest in sandboxed iframe
    runBacktestInIframe(code, csvLinks);

   
  });

  return form;
}

// Attach to window for global access
window.setupBacktestConfigModal = setupBacktestConfigModal;

// Initialize modal setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setupBacktestConfigModal();
});

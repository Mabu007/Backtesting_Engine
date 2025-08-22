// DOM Operations for Organising Conditions
document.addEventListener('DOMContentLoaded', () => {

    const entryRulesContainer = document.getElementById('entry-rules-container');
    const exitRulesContainer = document.getElementById('exit-rules-container');
    const addEntryBtn = document.getElementById('add-entry-group-btn');
    const addExitBtn = document.getElementById('add-exit-group-btn');
    const mainChartContainer = document.getElementById('mainChartContainer');

    //Dicionary storing all possible trading conditions
    const conditionOptions = {
        'Session & Time Conditions': { label: 'Market is in', subOptions: { session: ['Asian Session', 'London Session', 'New York Session'], time: ['During Market Open', 'During Market Close'] } },
        'market-direction': { label: 'Market Direction', subOptions: { direction: ['is Uptrending', 'is Downtrending'] } },
        'market-momentum': { label: 'Market Momentum', subOptions: { momentum: ['is increasing', 'is decreasing'], speed: ['Slowly', 'Moderately'] } },
        'market-structure': { label: 'Price', subOptions: { type: ['has broken above', 'has broken below'], level: ['Higher High', 'Higher Low'] } },
        'candle-state': { label: 'Candle forms', subOptions: { state: ['Strong Bullish Candle', 'Strong Bear Candle'] } },
        'volume-states': { label: 'Volume', subOptions: { state: ['is Increasing', 'is Decreasing', 'is High', 'is Low'] } },
        'market-psychology': { label: 'Market Psychology', subOptions: { state: ['is Accumulation', 'is Distribution'] } },
        'patterns': { label: 'Patterns forms', subOptions: { state: ['Flag', 'Pennant', 'Head & Shoulders'] } },
        'indicators': { label: 'Indicator Compare to Value', subOptions: { indicator: ['RSI', 'MACD', 'Bollinger Bands'], action: ['Crosses Above', 'Crosses Below'], target: ['20', '50', '80'] } },
        'indicators-2': { label: 'Indicator Compare to Indicator', subOptions: { 'main-indicator': ['RSI', 'MACD'], action: ['Crosses Above', 'Crosses Below'], 'secondary-indicator': ['RSI', 'MACD'] } }
    };

    // Where we put the condition groups HTML elements
    // This is a DOM Function to render the condition groups HTML Elements
    const addConditionGroup = (containerId) => {
        //Find the container
        const container = document.getElementById(containerId);

        //Create a new group container (div)
        // const means JS object (HTML JS Object DOM Element)
        const groupDiv = document.createElement('div');
        // Style the group container (div.style)
        // then you style that JS Object (Style the DOM Element)
        groupDiv.className = 'bg-gray-600 p-3 rounded-lg shadow-inner border border-gray-500 mb-2';

        // Create the AND label DOM Element (JS HTML Object)
        const andLabel = document.createElement('p');
        // Style the AND label
        // then you style that JS Object (Style the DOM Element)
        andLabel.className = 'text-gray-300 font-semibold mb-2 text-center';
        // Set the text content of the AND label
        andLabel.textContent = 'AND';

        // Create the conditions container
        const conditionsDiv = document.createElement('div');
        // Style the conditions container
        conditionsDiv.className = 'space-y-2';

        // Create a button 
        const addConditionBtn = document.createElement('button');
        // Style the button
        addConditionBtn.className = 'w-full px-2 py-1 mt-2 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600';
        // Set the button text (+ Add Condition)
        addConditionBtn.textContent = '+ Add Condition';

        // Create a button
        const removeGroupBtn = document.createElement('button');
        // Style the button
        removeGroupBtn.className = 'w-full px-2 py-1 mt-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600';
        // Set the button text (Remove Group)
        removeGroupBtn.textContent = 'Remove Group';

        // Put everything inside the group
        groupDiv.append(andLabel, conditionsDiv, addConditionBtn, removeGroupBtn);
        // Put the group into the container
        container.appendChild(groupDiv);

        // When removeGroupBtn is clicked, remove the groupDiv
        removeGroupBtn.onclick = () => groupDiv.remove();
        // When addConditionBtn is clicked, add a new condition
        // Its running the addCondition function
        addConditionBtn.onclick = () => addCondition(conditionsDiv);
        // Call addCondition to add the first condition
        addCondition(conditionsDiv);
    };

    // Function to add a condition row
    // Responsible for creating one condition row (dropdowns + sub-options + remove button)
    const addCondition = (container) => {
        // Create a wrapper/container for the row
        const conditionRow = document.createElement('div');
        // Style the condition row
        conditionRow.className = 'flex flex-col space-y-2 p-2 bg-gray-700 rounded-md';

        // Create the first select element (dropdown)
        const mainSelect = document.createElement('select');
        // Style the select element (dropdown)
        mainSelect.className = 'p-1 rounded bg-gray-500 text-white text-xs w-full';

        // Create a option element
        const defaultOption = document.createElement('option');
        // Make the option element empty
        defaultOption.value = "";
        // Add text to the option element
        defaultOption.textContent = "Select Condition";
        // Add the option to main select element (dropdowns)
        mainSelect.appendChild(defaultOption);
        // Loop over conditionOptions to populate the main select dropdown
        for (const key in conditionOptions) {
            // Create an option for each condition
            const option = document.createElement('option');
            // Set the value of the option
            option.value = key;
            // Set the text content of the option
            option.textContent = conditionOptions[key].label;
            // Add the option to the main select element (dropdown)
            // Initial main select element (dropdowns)
            mainSelect.appendChild(option);
        }

        // Create a container for sub-options
        // Just a container to hold the sub-options
        const subOptionsContainer = document.createElement('div');
        // Style the sub-options container
        subOptionsContainer.className = 'flex flex-col space-y-2';

        // When the main select changes, update the sub-options
        mainSelect.onchange = () => {
            // clear out any old sub-options
            subOptionsContainer.innerHTML = '';
            // Get the selected key from the main select
            // This is the key of the selected condition
            const selectedKey = mainSelect.value;
            if (selectedKey) {
                // Get the sub-options for the selected condition
                const subOptions = conditionOptions[selectedKey].subOptions;
                // Loop over the sub-options and create selects for each
                // This is where we create the sub-options dropdowns
                for (const subKey in subOptions) {
                    // Create a new select element for sub-options
                    const subSelect = document.createElement('select');
                    // Style the sub-select element
                    subSelect.className = 'p-1 rounded bg-gray-500 text-white text-xs w-full';
                    // Create a default option for the sub-select
                    subOptions[subKey].forEach(optionText => {
                        // Create an option element for each sub-option
                        const option = document.createElement('option');
                        // Add text to each element
                        option.textContent = optionText;
                        // Add the option to the sub-select
                        subSelect.appendChild(option);
                    });
                    // Add the sub-select to the sub-options container
                    subOptionsContainer.appendChild(subSelect);
                }
            }
        };

        // Create a button to remove the condition row
        const removeConditionBtn = document.createElement('button');
        // Style the remove button
        removeConditionBtn.className = 'text-red-400 text-sm hover:text-red-500 mt-2 text-right';
        // Set the text content of the remove button
        removeConditionBtn.textContent = 'x';
        // When the remove button is clicked, remove the condition row
        removeConditionBtn.onclick = () => conditionRow.remove();

        // Append the main select, sub-options container, and remove button to the condition row
        conditionRow.append(mainSelect, subOptionsContainer, removeConditionBtn);
        // Append the condition row to the container
        container.appendChild(conditionRow);
    };

    // When the run backtest button is clicked, log the conditions (Entry Btn)
    addEntryBtn.addEventListener('click', () => addConditionGroup('entry-rules-container'));
    // When the run backtest button is clicked, log the conditions (Exit Btn)
    addExitBtn.addEventListener('click', () => addConditionGroup('exit-rules-container'));
    
    // Call the addConditionGroup function to initialize the containers
    addConditionGroup('entry-rules-container');
    addConditionGroup('exit-rules-container');

});

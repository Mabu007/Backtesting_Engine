// conditionsReader.js
function getConditionsFromDOM(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Container #${containerId} not found`);
        return [];
    }

    const groups = Array.from(container.children);

    const parsedGroups = groups.map(group => {
        // Match ANY row with a select in it
        const conditionRows = Array.from(group.querySelectorAll('select'))
            .reduce((rows, sel) => {
                const row = sel.closest('.condition-row') || sel.closest('div');
                if (row && !rows.includes(row)) rows.push(row);
                return rows;
            }, []);

        const conditions = conditionRows.map(row => {
            const selects = Array.from(row.querySelectorAll('select'));
            return {
                type: selects[0]?.dataset.type?.trim() || '',
                subOptionKey: selects[1]?.dataset.key?.trim() || '',
                subOptionValue: selects[1]?.value?.trim() || '',
                level: selects[2]?.value?.trim() || ''
            };
        }).filter(cond => cond.type && (cond.subOptionKey || cond.subOptionValue || cond.level));

        return conditions.length > 0 ? conditions : null;
    }).filter(Boolean);

    if (parsedGroups.length === 0) {
        console.warn(`No conditions found in #${containerId}`);
    }

    return parsedGroups;
}


// Fill the global arrays with the DOM selections in nested format
function updateConditionsArrays() {
    window.entryConditions = getConditionsFromDOM('entry-rules-container');
    window.exitConditions = getConditionsFromDOM('exit-rules-container');
}

// Attach to window so it can be called before running the backtest
window.updateConditionsArrays = updateConditionsArrays;

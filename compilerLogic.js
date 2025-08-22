// CompilerLogic.js
function conditionsToCode(entryConditions, exitConditions, config) {

  // Ensure we only keep non-empty groups with at least one valid condition
  function cleanGroups(groups) {
    return (groups || [])
      .filter(Array.isArray) // Must be an array
      .map(group => group.filter(cond => cond && cond.type && (cond.subOptionKey || cond.subOptionValue)))
      .filter(group => group.length > 0); // Only keep groups with at least one valid condition
  }

  const safeEntryConditions = cleanGroups(entryConditions);
  const safeExitConditions = cleanGroups(exitConditions);

  // Convert condition groups to code
  function convertGroupToCode(group) {
  const codeParts = group.map(cond => {
    // Skip if no type OR no actual value to compare
    if (!cond.type || (!cond.subOptionKey && !cond.subOptionValue && !cond.level)) {
      return null;
    }

    switch (cond.type) {
      case 'Session & Time Conditions':
        if (cond.subOptionKey === 'session' && cond.subOptionValue) {
          return `isMarketSession('${cond.subOptionValue}')`;
        }
        if (cond.subOptionKey === 'time' && cond.subOptionValue) {
          return `isMarketTime('${cond.subOptionValue}')`;
        }
        return null;

      case 'market-direction':
        return cond.subOptionValue ? `marketDirection() === '${cond.subOptionValue}'` : null;

      case 'market-momentum':
        return cond.subOptionValue ? `marketMomentum() === '${cond.subOptionValue}'` : null;

      case 'market-structure':
        return (cond.subOptionValue && cond.level) 
          ? `price ${cond.subOptionValue} level('${cond.level}')` 
          : null;

      case 'candle-state':
        return cond.subOptionValue ? `candleState() === '${cond.subOptionValue}'` : null;

      case 'volume-states':
        return cond.subOptionValue ? `volumeState() === '${cond.subOptionValue}'` : null;

      case 'market-psychology':
        return cond.subOptionValue ? `marketPsychology() === '${cond.subOptionValue}'` : null;

      case 'patterns':
        return cond.subOptionValue ? `patternDetected('${cond.subOptionValue}')` : null;

      case 'indicators':
        return (cond.indicator && cond.action && cond.target) 
          ? `${cond.indicator} ${cond.action} ${cond.target}` 
          : null;

      case 'indicators-2':
        return (cond['main-indicator'] && cond.action && cond['secondary-indicator']) 
          ? `${cond['main-indicator']} ${cond.action} ${cond['secondary-indicator']}` 
          : null;

      default:
        return null;
    }
  }).filter(Boolean); // Remove null or invalid conditions

  // If no valid conditions, skip the group
  return codeParts.length > 0 ? `(${codeParts.join(' && ')})` : null;
  }


  // Join groups with OR logic, skip nulls
  const entryCode = safeEntryConditions.map(convertGroupToCode).filter(Boolean).join(' || ') || 'false';
  const exitCode = safeExitConditions.map(convertGroupToCode).filter(Boolean).join(' || ') || 'false';

  // Final generated code
  let code = `
    // Backtest Configuration (config)
    const tradeType = '${config.tradeType}';
    const amountPerTrade = ${config.amountPerTrade};
    const accountBalance = ${config.accountBalance};
    // Risk Management
    const slippage = ${config.slippage};
    const stopLoss = ${config.stopLoss};
    const takeProfit = ${config.takeProfit};
    // Timeframe
    const startDate = '${config.startDate}';
    const endDate = '${config.endDate}';

    // Entry Condition
    function shouldEnterTrade() {
      return ${entryCode};
    }

    // Exit Condition
    function shouldExitTrade() {
      return ${exitCode};
    }

    // Backtest main loop
    function runBacktest(data) {
      for (const bar of data) {
        if (shouldEnterTrade()) {
          console.log('Enter trade', tradeType, amountPerTrade);
        }
        if (shouldExitTrade()) {
          console.log('Exit trade');
        }
      }
    }
  `;

  return code;
}

window.conditionsToCode = conditionsToCode;

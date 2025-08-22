function simpleSMA(data, period) {
  const result = [];
  for (let i = 0; i <= data.length - period; i++) {
    const window = data.slice(i, i + period);
    const avg = window.reduce((a, b) => a + b, 0) / period;
    result.push(avg);
  }
  return result;
}

const closes = [100, 102, 101, 103, 105];
console.log(simpleSMA(closes, 3)); // [101, 102, 103]

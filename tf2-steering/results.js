/** Values transcribed from Tables 1 and 2 in sec/4_experiments.tex. */
export const RESULTS = {
  simulation: {
    label: 'Simulation', source: 'Table 1 · UniVTAC', metric: 'Success rate',
    tasks: ['Lift Bottle', 'Pull Out Key', 'Lift Can', 'Put Bottle', 'Insert Hole', 'Insert Tube'],
    rows: [
      {name: 'ACT*', values: [71, 46, 29, 31, 24, 56, 42.8]},
      {name: 'VITaL*', values: [72, 47, 8, 32, 25, 34, 36.3]},
      {name: 'FTP-1', values: [88, 14, 68, 74, 26, 76, 57.7]},
      {name: 'π₀.₅', values: [94, 36, 74, 6, 56, 68, 55.7]},
      {name: 'π₀.₅ + tactile', values: [96, 38, 68, 14, 48, 72, 56]},
      {name: 'TF²-Steering', values: [98, 34, 60, 44, 94, 80, 68.3], ours: true}
    ],
    note: '* ACT and VITaL results are reported by UniVTAC. Averages and task values reproduce Table 1 as displayed.'
  },
  real: {
    label: 'Real world', source: 'Table 2 · Real-world manipulation', metric: 'Progress success rate',
    tasks: ['Fruit on Plate', 'Close Zipper', 'Wipe Whiteboard', 'Twist Cap', 'Split Cups', 'Dropper Transfer'],
    rows: [
      {name: 'ViTacFormer', values: [12.5, 4, 2, 9, 7, 2, 6.1]},
      {name: 'π₀.₅', values: [60, 18, 36, 26, 62, 39, 40.2]},
      {name: 'π₀.₅ + tactile', values: [58, 12, 39, 22, 57, 23, 35.2]},
      {name: 'T-Rex', values: [72.5, 56, 61, 58, 87, 40, 62.4]},
      {name: 'FTP-1', values: [75, 36, 55, 40, 64, 46, 52.7]},
      {name: 'TF²-Steering', values: [70, 60, 76, 67, 90, 66, 71.5], ours: true}
    ],
    note: '20 trials per task. Progress success rate includes partial task completion. Averages and task values reproduce Table 2 as displayed.'
  }
};

export function initResults(container) {
  if (!container) return;
  container.classList.add('results-module');
  let mode = 'simulation';
  let selected = 6;
  let shown = false;
  container.innerHTML = `
    <div class="results-toolbar">
      <div class="results-switch" role="group" aria-label="Evaluation setting">
        <button type="button" data-mode="simulation" aria-pressed="true">Simulation</button>
        <button type="button" data-mode="real" aria-pressed="false">Real world</button>
      </div>
      <label class="results-select-label">View <select aria-label="Task or macro-average"></select></label>
    </div>
    <div class="results-panel">
      <div class="results-summary" aria-live="polite" aria-atomic="true"></div>
      <div class="results-chart" role="img"></div>
      <div class="results-legend"><span><i></i> Evaluated baselines</span><span><i class="ours"></i> TF²-Steering (ours)</span></div>
    </div>
    <p class="results-footnote"></p>
    <details class="results-data"><summary>Explore the source data <span aria-hidden="true">+</span></summary><div class="results-table-scroll" tabindex="0" role="region" aria-label="Results table, scroll horizontally for all tasks"></div></details>`;
  const select = container.querySelector('select');
  const chart = container.querySelector('.results-chart');
  const summary = container.querySelector('.results-summary');
  const tableWrap = container.querySelector('.results-table-scroll');

  function draw() {
    const data = RESULTS[mode];
    const ours = data.rows.at(-1).values[selected];
    const baseline = Math.max(...data.rows.slice(0, -1).map(row => row.values[selected]));
    const delta = Math.round((ours - baseline) * 10) / 10;
    const comparison = delta > 0 ? `${delta.toFixed(1)} pp above the strongest baseline` : delta < 0 ? `${Math.abs(delta).toFixed(1)} pp below the strongest baseline` : 'Matches the strongest baseline';
    const scope = selected === 6 ? 'Macro-average · 6 tasks' : data.tasks[selected];
    summary.innerHTML = `<div><p class="results-source">${data.source}</p><div class="results-big">${ours.toFixed(1)}<span>%</span></div><p class="results-metric">${data.metric} <span>↑</span></p></div><div class="results-context"><p>${scope}</p><strong>${comparison}</strong><span>TF²-Steering · differences from displayed table values</span></div>`;
    chart.setAttribute('aria-label', `${data.label}: ${data.metric}, ${scope}. ${data.rows.map(row => `${row.name}: ${row.values[selected].toFixed(1)} percent`).join('; ')}. Scale 0 to 100 percent.`);
    chart.innerHTML = `<div class="results-grid" aria-hidden="true">${[100, 75, 50, 25, 0].map(value => `<div style="--grid-position:${100 - value}%"><span>${value}</span></div>`).join('')}</div><div class="results-bars" aria-hidden="true">${data.rows.map((row, i) => `<div class="results-column ${row.ours ? 'is-ours' : ''}" style="--value:${row.values[selected]};--bar-order:${i}"><div class="results-bar-space"><div class="results-bar"><b>${row.values[selected].toFixed(1)}</b></div></div><div class="results-bar-label">${row.name}${row.ours ? '<small>OURS</small>' : ''}</div></div>`).join('')}</div>`;
    container.querySelector('.results-footnote').textContent = data.note;
    tableWrap.innerHTML = `<table><caption>${data.source}. ${data.metric} (% ↑).</caption><thead><tr><th scope="col">Method</th>${data.tasks.map(task => `<th scope="col">${task}</th>`).join('')}<th scope="col">Avg.</th></tr></thead><tbody>${data.rows.map(row => `<tr${row.ours ? ' class="is-ours"' : ''}><th scope="row">${row.name}${row.ours ? ' (ours)' : ''}</th>${row.values.map(value => `<td>${value.toFixed(1)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    // Changing a view creates fresh columns; the class transition reveals their true heights.
    if (shown) requestAnimationFrame(() => requestAnimationFrame(() => chart.classList.add('is-shown')));
  }
  function updateMode() {
    const data = RESULTS[mode];
    select.innerHTML = `<option value="6">All tasks · average</option>${data.tasks.map((task, i) => `<option value="${i}">${task}</option>`).join('')}`;
    select.value = String(selected);
    container.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    chart.classList.remove('is-shown');
    draw();
  }
  container.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    if (mode === button.dataset.mode) return;
    mode = button.dataset.mode;
    selected = 6;
    updateMode();
  }));
  select.addEventListener('change', () => {
    selected = Number(select.value);
    chart.classList.remove('is-shown');
    draw();
  });
  updateMode();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        shown = true;
        chart.classList.add('is-shown');
        observer.disconnect();
      }
    }, {threshold: .16});
    observer.observe(chart);
  } else {
    shown = true;
    chart.classList.add('is-shown');
  }
}

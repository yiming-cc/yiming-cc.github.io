(() => {
  const root = document.getElementById('dataset-content');
  if (!root) return;

  // Figure 3 reports rounded percentages of all QA pairs in every view.
  const views = {
    annotation: {
      title: 'Annotation',
      note: 'Grounded reasoning traces are included for questions that call for spatial reasoning.',
      rows: [
        ['With grounded CoT', 79, '#18798a'],
        ['Without CoT', 21, '#aa9a7b']
      ]
    },
    source: {
      title: 'Scene source',
      note: 'The QA pairs are drawn from three indoor scene datasets.',
      rows: [
        ['ScanNet++', 72, '#18798a'],
        ['ScanNet', 22, '#849eaf'],
        ['ARKitScenes', 6, '#c49a61']
      ]
    },
    task: {
      title: 'Task type',
      note: 'The first five tasks have grounded reasoning traces. Appearance order, object count and room size use direct answers.',
      rows: [
        ['Relative distance', 48.3, '#18798a'],
        ['Relative direction', 15.6, '#3d96a2'],
        ['Absolute distance', 9.8, '#64acb6'],
        ['Object size', 3.8, '#73a39a'],
        ['Route planning', 1.5, '#a7c6be'],
        ['Appearance order', 16.2, '#a68c65'],
        ['Object count', 2.6, '#c2a77e'],
        ['Room size', 2.2, '#d9c3a4']
      ]
    }
  };
  root.innerHTML = `
    <p class="gcot-intro">GCoT pairs spatial questions with the 3D boxes of the objects they refer to. For tasks that need several reasoning steps, the annotation connects those boxes to the answer.</p>
    <figure class="gcot-figure">
      <div class="gcot-head">
        <h3>Dataset composition</h3>
        <div class="gcot-switch" role="group" aria-label="Dataset breakdown">
          ${Object.entries(views).map(([key, view]) => `<button type="button" data-view="${key}" aria-pressed="false">${view.title}</button>`).join('')}
        </div>
      </div>
      <div class="gcot-chart">
        <div class="gcot-ring">
          <svg viewBox="0 0 200 200" aria-hidden="true"></svg>
          <div class="gcot-center" aria-hidden="true">
            <strong>156k</strong><span>QA pairs</span>
          </div>
        </div>
        <div>
          <p class="gcot-notice"></p>
          <ul class="gcot-legend" aria-label="Shares of all QA pairs"></ul>
        </div>
      </div>
      <figcaption>Shares of all QA pairs, as reported in <a href="https://arxiv.org/html/2510.13800v2#S4.F3">Figure 3</a>.</figcaption>
    </figure>
    <div class="gcot-build">
      <h3>How GCoT is built</h3>
      <ol>
        <li><span>01</span><h4>Prepare the scenes</h4><p>Align each scene’s coordinates, extract object boxes and sample 50 RGB frames to record when objects appear.</p></li>
        <li><span>02</span><h4>Generate spatial QA</h4><p>Use scene and frame metadata to generate questions and answers from templates. Keep the object boxes used in each question.</p></li>
        <li><span>03</span><h4>Write grounded traces</h4><p>Give GPT-4o the QA pair, relevant boxes and a labeled bird’s-eye view. It writes a reasoning trace that uses the boxes to reach the answer.</p></li>
      </ol>
      <a class="gcot-reference" href="https://arxiv.org/html/2510.13800v2#A1">Construction details in Appendix A ↗</a>
    </div>`;

  const ring = root.querySelector('svg');
  const label = root.querySelector('.gcot-center strong');
  const caption = root.querySelector('.gcot-center span');
  const legend = root.querySelector('.gcot-legend');
  const switches = [...root.querySelectorAll('[data-view]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function draw(viewKey, animate) {
    const view = views[viewKey];
    switches.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === viewKey)));
    root.querySelector('.gcot-notice').textContent = view.note;
    label.textContent = '156k';
    caption.textContent = 'QA pairs';

    let offset = 0;
    ring.innerHTML = view.rows.map(([, share, color]) => {
      const arc = `<circle cx="100" cy="100" r="80" pathLength="100" fill="none" stroke="${color}" stroke-width="19" stroke-dasharray="${share - 0.65} ${100 - share + 0.65}" stroke-dashoffset="${-offset}" transform="rotate(-90 100 100)" />`;
      offset += share;
      return arc;
    }).join('');
    legend.innerHTML = view.rows.map(([name, share, color]) => `<li><span class="gcot-swatch" style="background:${color}"></span><span>${name}</span><b>${share}%</b></li>`).join('');

    const circles = [...ring.children];
    if (animate && !reducedMotion.matches) {
      circles.forEach((circle, index) => {
        if (circle.animate) {
          circle.animate([{ strokeDasharray: '0 100' }, { strokeDasharray: circle.getAttribute('stroke-dasharray') }],
            { duration: 580, delay: index * 45, easing: 'ease-out', fill: 'backwards' });
        }
      });
    }
    function highlight(index) {
      const row = view.rows[index];
      label.textContent = row ? row[1] + '%' : '156k';
      caption.textContent = row ? row[0] : 'QA pairs';
      circles.forEach((circle, i) => circle.classList.toggle('gcot-muted', Boolean(row) && i !== index));
      [...legend.children].forEach((item, i) => item.classList.toggle('gcot-selected', i === index));
    }
    [...legend.children].forEach((item, i) => {
      [item, circles[i]].forEach(element => {
        element.addEventListener('pointerenter', () => highlight(i));
        element.addEventListener('pointerleave', () => highlight(-1));
      });
    });
  }

  let hasEntered = false;
  switches.forEach(button => button.addEventListener('click', () => {
    hasEntered = true;
    draw(button.dataset.view, true);
  }));
  draw('annotation', false);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      if (!hasEntered) draw('annotation', true);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(root.querySelector('.gcot-chart'));
  }
})();

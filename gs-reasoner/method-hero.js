/* An illustrative scene in meters. The boxes and displayed coordinates use the same geometry. */
(() => {
  const root = document.getElementById('method-hero');
  if (!root) return;

  // Axonometric projection. Positive z is up in the world frame.
  function project([x, y, z]) {
    return [172 + 70 * x - 43 * y, 152 + 22 * x + 26 * y - 77 * z];
  }
  function points(vertices) {
    return vertices.map(vertex => project(vertex).join(',')).join(' ');
  }
  function line(a, b, attributes = '') {
    return `<line x1="${project(a)[0]}" y1="${project(a)[1]}" x2="${project(b)[0]}" y2="${project(b)[1]}" ${attributes}/>`;
  }
  function block([x, y, z], [w, d, h], colors) {
    const A = [x,y,z+h], B = [x+w,y,z+h], C = [x+w,y+d,z+h], D = [x,y+d,z+h];
    const b = [x+w,y,z], c = [x+w,y+d,z], e = [x,y+d,z];
    return `<g stroke="#fcfaf4" stroke-width="1" stroke-linejoin="round">
      <polygon fill="${colors[1]}" points="${points([B,C,c,b])}"/>
      <polygon fill="${colors[2]}" points="${points([D,C,c,e])}"/>
      <polygon fill="${colors[0]}" points="${points([A,B,C,D])}"/></g>`;
  }
  function wireBox([x,y,z], [w,d,h], color) {
    const bottom = [[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z]];
    const top = bottom.map(([a,b,c]) => [a,b,c+h]);
    return `<g fill="none" stroke="${color}" stroke-width="1.7" stroke-linejoin="round">
      <polygon points="${points(top)}"/><polygon points="${points(bottom)}"/>${bottom.map((p,i)=>line(p,top[i])).join('')}</g>`;
  }
  const chairColor = ['#bcd9d3','#85aaa4','#99b9b2'];
  const cabColor = ['#efd5a8','#ceb083','#dcbf8f'];
  let chair = '';
  [[.55,1.55],[1.06,1.55],[.55,2.06],[1.06,2.06]].forEach(([x,y]) => {
    chair += block([x,y,0],[.09,.09,.42],chairColor);
  });
  chair += block([.55,1.55,.41],[.60,.60,.08],chairColor);
  chair += block([.55,1.55,.49],[.60,.09,.41],chairColor);
  const cabinet = block([2.4,.25,0],[1.0,.70,1.60],cabColor) +
    line([2.9,.95,.05],[2.9,.95,1.55],'stroke="#a68759" stroke-width="1.2"') +
    line([2.76,.96,.85],[2.76,.96,1.00],'stroke="#705c43" stroke-width="2.6" stroke-linecap="round"') +
    line([3.04,.96,.85],[3.04,.96,1.00],'stroke="#705c43" stroke-width="2.6" stroke-linecap="round"');
  let grid = '';
  for (let x=0; x<=4; x+=.5) grid += line([x,0,0],[x,3,0]);
  for (let y=0; y<=3; y+=.5) grid += line([0,y,0],[4,y,0]);
  const scene = `<svg viewBox="20 42 488 298" role="img" aria-labelledby="gsh-scene-title">
    <title id="gsh-scene-title">A chair and cabinet in a shared metric frame. The model grounds the chair at 0.90 m tall and the cabinet at 1.60 m tall.</title>
    <defs><radialGradient id="gsh-floor"><stop stop-color="#f1efe7"/><stop offset="1" stop-color="#f7f6f1"/></radialGradient></defs>
    <polygon points="${points([[0,0,0],[4,0,0],[4,3,0],[0,3,0]])}" fill="url(#gsh-floor)" stroke="#d9e1db"/>
    <g stroke="#dde3dc" stroke-width=".8">${grid}</g>
    <g>${cabinet}${chair}</g>
    <g class="gsh-samples" fill="#397c73">${[[.65,1.64,.65],[.8,1.64,.72],[.94,1.64,.81],[.7,1.82,.49],[.96,1.93,.49],[2.64,.95,1.25],[2.85,.95,1.12],[3.2,.95,.61],[3.12,.62,1.6]].map(p => { const [x,y]=project(p); return `<circle cx="${x}" cy="${y}" r="2.6"/>`; }).join('')}</g>
    <g class="gsh-bounds">${wireBox([.55,1.55,0],[.6,.6,.9],'#217e78')}${wireBox([2.4,.25,0],[1,.7,1.6],'#b27c32')}</g>
    <g class="gsh-labels" fill="#266d68"><text x="54" y="175">Chair</text><path d="M86 172 L112 172 L138 196" fill="none" stroke="#4f938b"/></g>
    <g class="gsh-labels" fill="#976d2d"><text x="407" y="83">Cabinet</text><path d="M403 88 L394 94 L378 112" fill="none" stroke="#b49359"/></g>
    <g class="gsh-heights"><text x="54" y="194" fill="#266d68">0.90 m</text><text x="407" y="106" fill="#976d2d">1.60 m</text></g>
    <g stroke="#869c99" stroke-width="1.2" fill="none">${line([0,3,0],[.32,3,0])}${line([0,3,0],[0,2.7,0])}${line([0,3,0],[0,3,.32])}</g>
    <text x="33" y="202" class="gsh-axis">Z</text><text x="65" y="243" class="gsh-axis">X</text><text x="56" y="222" class="gsh-axis">Y</text>
  </svg>`;
  const steps = [
    ['Encode', 'Fuse patch features', 'One path pools geometry using patch semantics; the other samples geometry at the patch center. Both feed a single hybrid token per patch.'],
    ['Ground', 'Generate 3D boxes', 'The vision-language model writes the two opposite corners of each object’s box, coordinate by coordinate, in the same world frame.'],
    ['Reason', 'Compare the heights', 'The same model uses each box’s vertical extent to compare the objects and answer the question.']
  ];
  root.innerHTML = `<div class="gsh-head"><span class="gsh-kicker">Grounded reasoning</span><span class="gsh-example">Illustrative example</span></div>
    <div class="gsh-question">How much taller is the cabinet than the chair?</div>
    <p class="gsh-takeaway">The vision-language model generates its own 3D boxes, then uses them to answer the spatial question.</p>
    <div class="gsh-body"><div class="gsh-scene">${scene}<div class="gsh-scene-note">World coordinate frame <span>·</span> meters</div></div>
    <div class="gsh-trace"><div class="gsh-kicker">Inside GS-Reasoner</div>
    ${steps.map(([label,title,desc],i)=>`<div class="gsh-step" data-step="${i}"><button type="button" aria-label="Show step ${i+1}: ${title}"><span class="gsh-num">0${i+1}</span>${title}</button><div class="gsh-description">${desc}</div></div>`).join('')}
    <div class="gsh-readout"></div></div></div>
    <div class="gsh-foot"><span class="gsh-state"></span><button type="button" class="gsh-play"></button></div>`;
  const readouts = [
    'Patch semantics + 3D position + geometry',
    '<b>Chair</b> (.55, 1.55, 0) → (1.15, 2.15, .90)<br><b>Cabinet</b> (2.40, .25, 0) → (3.40, .95, 1.60)',
    '1.60 m − 0.90 m = <strong>0.70 m taller</strong>'
  ];
  const buttons = [...root.querySelectorAll('.gsh-step button')];
  const play = root.querySelector('.gsh-play');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = reduced.matches ? 2 : 0;
  let playing = !reduced.matches;
  let timer;
  let inView = true;
  function render() {
    root.dataset.phase = index;
    root.dataset.playing = playing;
    buttons.forEach((b,i) => b.setAttribute('aria-pressed', String(i===index)));
    root.querySelector('.gsh-readout').innerHTML = readouts[index];
    root.querySelector('.gsh-state').textContent = `0${index+1} / 03   ·   ${steps[index][0]}`;
    play.textContent = playing ? 'Ⅱ  Pause' : '▷  Play';
    play.setAttribute('aria-label', playing ? 'Pause method animation' : 'Play method animation');
    clearTimeout(timer);
    if (playing && inView && !document.hidden) timer = setTimeout(() => { index=(index+1)%3; render(); }, 4700);
  }
  buttons.forEach((b,i) => b.addEventListener('click', () => { playing=false; index=i; render(); }));
  play.addEventListener('click', () => { playing=!playing; render(); });
  reduced.addEventListener('change', () => { playing=!reduced.matches; if (!playing) index=2; render(); });
  document.addEventListener('visibilitychange', render);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView=entries[0].isIntersecting; render(); }).observe(root);
  render();
})();

/** Schematic based on sec/3_method.tex: chunk-level priors and forecast–feedback feature fusion. */
export function initMethod(container) {
  container.innerHTML = `
  <div class="method-demo" data-enabled="true">
    <div class="md-toolbar"><span class="md-live"><i></i> THE REFINEMENT LOOP</span><div class="md-controls"><button class="md-toggle" type="button" role="switch" aria-checked="true"><span class="md-switch"></span>Tactile refinement</button><button class="md-pause" type="button" aria-label="Pause method animation">Pause <span aria-hidden="true">Ⅱ</span></button></div></div>
    <div class="md-diagram-wrap">
    <svg class="md-diagram" viewBox="0 0 1060 355" role="img" aria-labelledby="md-diagram-title md-diagram-desc">
      <title id="md-diagram-title">Four modules, one action-generation process</title>
      <desc id="md-diagram-desc">Both world models run once per action chunk. Their priors remain fixed across all feedback updates. The tactile expert integrates predicted and real-time tactile features through separate subexperts with independent sigmoid weights. It receives the same noised action and flow timestep as the action expert, and outputs delta velocity during every flow-matching iteration of regeneration. Only unexecuted actions are used. The original base path remains independently available.</desc>
      <defs><marker id="md-arrow-teal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#0F8195"/></marker><marker id="md-arrow-gold" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#B48124"/></marker><marker id="md-arrow-gray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#a4a7ae"/></marker></defs>
      <text x="36" y="24" class="md-lane">BASE ACTION GENERATION</text><text x="1024" y="24" text-anchor="end" class="md-note">Independently usable without touch</text>
      <path class="md-wire md-base-wire" d="M246 88H343M560 88H774M818 88H875" marker-end="url(#md-arrow-teal)"/>
      <g class="md-module md-video"><rect x="36" y="48" width="210" height="80" rx="18"/><text x="58" y="81" class="md-module-title">Video world model</text><text x="58" y="106" class="md-module-sub">Visual prior · fixed per chunk</text></g>
      <g class="md-module md-action"><rect x="344" y="48" width="216" height="80" rx="18"/><text x="366" y="81" class="md-module-title">Action expert</text><text x="366" y="106" class="md-module-sub">Base flow-matching velocity</text></g>
      <text x="651" y="75" text-anchor="middle" class="md-velocity-label">v<tspan baseline-shift="sub" font-size="10">base</tspan></text>
      <circle cx="796" cy="88" r="22" class="md-sum"/><path d="M787 88H805M796 79V97" stroke="#52656a" stroke-width="1.8"/>
      <g class="md-output"><rect x="878" y="48" width="146" height="80" rx="18"/><text x="951" y="81" text-anchor="middle" class="md-module-title">Regenerated actions</text><text x="951" y="106" text-anchor="middle" class="md-module-sub">Execute next k steps</text></g>
      <g class="md-tactile-path">
        <path class="md-wire" d="M141 128V204" stroke="#b3a5cd" marker-end="url(#md-arrow-gray)"/><text x="153" y="167" class="md-small">Visual features</text>
        <text x="36" y="193" class="md-lane">TACTILE REFINEMENT</text>
        <g class="md-module md-forecast"><rect x="36" y="208" width="210" height="84" rx="18"/><text x="58" y="240" class="md-module-title">Tactile world model</text><text x="58" y="265" class="md-module-sub">One forward pass per chunk</text></g>
        <text x="36" y="330" class="md-small">Initial tactile observation</text><path class="md-wire" d="M141 313V295" marker-end="url(#md-arrow-gray)"/>
        <path class="md-wire md-pred-wire" d="M246 250H291" stroke="#E0583F" marker-end="url(#md-arrow-gray)"/>
        <g class="md-cache"><rect x="294" y="216" width="146" height="68" rx="14"/><text x="367" y="243" text-anchor="middle" class="md-module-title">Predicted features</text><text x="367" y="267" text-anchor="middle" class="md-small">Fixed for the whole chunk</text></g>
        <g class="md-feedback"><rect x="294" y="302" width="146" height="40" rx="12"/><text x="367" y="327" text-anchor="middle" class="md-module-title">Real-time features</text></g>
        <path class="md-wire md-fusion-wire" d="M440 250H487M440 322H461Q474 322 474 309V293Q474 280 487 280" stroke="#b48124" marker-end="url(#md-arrow-gold)"/>
        <path class="md-wire md-context-wire" d="M548 128V166Q548 178 560 178H603Q615 178 615 190V205" marker-end="url(#md-arrow-gray)"/><text x="626" y="168" class="md-small">Action context · stop-gradient</text>
        <g class="md-module md-expert"><rect x="490" y="208" width="235" height="110" rx="18"/><text x="512" y="232" class="md-module-title">Tactile expert</text><rect class="md-subexpert" x="506" y="240" width="203" height="25" rx="7"/><text x="517" y="257" class="md-branch-label">Predicted-tactile subexpert · σ<tspan baseline-shift="sub" font-size="8">p</tspan></text><rect class="md-subexpert" x="506" y="270" width="203" height="25" rx="7"/><text x="517" y="287" class="md-branch-label">Real-tactile subexpert · σ<tspan baseline-shift="sub" font-size="8">r</tspan></text><text x="512" y="309" class="md-small">Independent weighting · feature fusion</text></g>
        <path class="md-wire md-delta-wire" d="M725 250H776Q796 250 796 230V113" stroke="#B48124" marker-end="url(#md-arrow-gold)"/>
        <text x="814" y="190" class="md-delta-label">Δv</text><text x="814" y="210" class="md-small">Local velocity correction</text>
        <text x="490" y="341" class="md-small">Same noised action &amp; flow timestep s</text>
        <circle class="md-packet md-pred-packet" r="4.5" fill="#E0583F"/><circle class="md-packet md-fusion-packet" r="4.5" fill="#B48124"/><circle class="md-packet md-delta-packet" r="4.5" fill="#B48124"/>
      </g>
      <circle class="md-packet md-base-packet" r="4" fill="#0F8195"/>
    </svg>
    </div>
    <div class="md-mobile-diagram" role="img" aria-label="World priors are generated once and fixed per chunk. Separate predicted-tactile and real-tactile subexperts are weighted independently with sigmoid and fused in the tactile expert, which adds delta velocity during each flow-matching iteration."><div class="md-mobile-base"><span>Video world model<br>Once per chunk</span><b>↓</b><span>Action expert · v<sub>base</sub></span><b>↓</b><strong class="md-mobile-sum">v<sub>base</sub> + Δv → next block</strong></div><div class="md-mobile-tactile"><span>Tactile world model<br>Once per chunk</span><b>↓</b><span>Fixed predicted features<br>+ fresh tactile features</span><b>↓</b><span>Tactile expert<br>Two subexperts · sigmoid fusion</span><b>↓</b><strong>Δv · local correction</strong></div></div>
    <div class="md-bottom">
      <div class="md-flow-panel"><div class="md-panel-label"><span>INSIDE FLOW MATCHING</span><span class="md-iteration">s = 0.00</span></div><svg class="md-flow" viewBox="0 0 460 176" role="img" aria-label="Illustrative velocity-field steering: local delta velocity changes the generated action"><defs><marker id="md-flow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#B48124"/></marker></defs><g class="md-field"></g><path class="md-base-trajectory" d="M30 132C133 153 233 37 420 68"/><path class="md-corrected-trajectory"/><g class="md-delta-vectors"></g><circle class="md-flow-particle" r="5"/><text x="26" y="169" class="md-small">Noise</text><text x="420" y="169" text-anchor="end" class="md-small">Action</text></svg><div class="md-flow-legend"><span><i class="md-teal"></i>Base velocity</span><span class="md-corrected-legend"><i class="md-gold"></i>With Δv</span><span class="md-schematic">Schematic</span></div></div>
      <div class="md-timeline-panel"><div class="md-panel-label"><span>ONE FORECAST · REPEATED FEEDBACK UPDATES</span></div><p class="md-phase-title">Predict once for the chunk.</p><p class="md-phase-copy">Both world models run once. Their visual and tactile priors stay fixed for the entire action chunk.</p><p class="md-prior-status">World priors · generated once per chunk</p><div class="md-blocks">${[0,1,2,3].map((i)=>`<div class="md-block" data-block="${i}"><div>${[0,1,2,3].map(()=>'<i></i>').join('')}</div><span>${i*4+1}–${i*4+4}</span></div>`).join('')}</div><div class="md-timeline-footer"><span>Example: H = 16 · k = 4</span><button type="button" class="md-replay">Replay ↺</button></div></div>
    </div>
    <div class="md-footnote">World priors remain fixed across every update. After each k-step block, the experts regenerate actions using fresh tactile feedback; executed steps are discarded. The block length k is adjustable.</div>
  </div>`;
  const root = container.querySelector('.method-demo');
  const $ = s => root.querySelector(s);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = true, paused = reduced.matches, visible = true, elapsed = 0, lastTime = 0;
  const duration = 22000;
  const stages = [
    {end:2500, kind:'predict', block:0, title:'Predict once for the chunk.', copy:'Both world models run once. Use the tactile world model’s final-layer features as the tactile prior, without decoding a predicted image.'},
    {end:5500, kind:'execute', block:0, title:'Execute steps 1–4.', copy:'Execute the first k-step block and receive fresh tactile feedback. The visual and tactile world priors remain fixed.'},
    {end:7500, kind:'refine', block:1, title:'Fuse features. Steer velocity.', copy:'Separate predicted- and real-tactile subexperts are weighted independently with sigmoid. The tactile expert adds Δv in every flow-matching iteration.'},
    {end:10500, kind:'execute', block:1, title:'Execute steps 5–8.', copy:'Discard the already executed actions. Execute the next block from the regenerated sequence, with the same fixed world priors.'},
    {end:12500, kind:'refine', block:2, title:'Fresh feedback. The same priors.', copy:'Fuse the latest tactile features with the chunk’s unchanged predicted features. Regenerate actions with Δv throughout flow matching.'},
    {end:15500, kind:'execute', block:2, title:'Execute steps 9–12.', copy:'Only unexecuted actions are used. Both world models remain idle while the high-frequency experts update the action sequence.'},
    {end:17500, kind:'refine', block:3, title:'Refine the remaining actions.', copy:'Independent sigmoid weights modulate the two tactile branches; they do not have to sum to one. Their fused features guide Δv.'},
    {end:20500, kind:'execute', block:3, title:'Execute steps 13–16.', copy:'Execute the last block of this illustrative chunk. The visual and tactile world priors have stayed fixed through all three feedback updates.'},
    {end:22000, kind:'complete', block:4, title:'Chunk complete. Plan again.', copy:'The next action chunk begins with a new low-frequency world-model inference. The block length k controls the refinement frequency.'}
  ];
  const field = $('.md-field');
  for (let y=30;y<146;y+=28) for(let x=35;x<435;x+=28) {
    const a=Math.sin(x/100+y/80)*.45-.2;
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d',`M${x-4} ${y-3*a}l10 ${6*a}m-4 ${-3-2*a}l4 ${3+2*a}l-4 ${3-2*a}`);field.appendChild(p);
  }
  const point=(t, strength=0)=>{
    const u=1-t;
    return {x:u*u*u*30+3*u*u*t*133+3*u*t*t*233+t*t*t*420,y:u*u*u*132+3*u*u*t*153+3*u*t*t*37+t*t*t*68-strength*48*Math.pow(t,1.55)};
  };
  const curve = strength => Array.from({length:81},(_,i)=>{const p=point(i/80,strength);return `${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`;}).join(' ');
  function packet(selector,pathSelector,p,show){const dot=$(selector),path=$(pathSelector);dot.style.opacity=show?'1':'0';if(show){const a=path.getPointAtLength(path.getTotalLength()*p);dot.setAttribute('cx',a.x);dot.setAttribute('cy',a.y);}}
  let previousPhase=-1;
  function render(){
    const chunkTime=elapsed%duration;
    const phase=stages.findIndex(stage=>chunkTime<stage.end);
    const stage=stages[phase];
    const start=phase?stages[phase-1].end:0;
    const local=(chunkTime-start)/(stage.end-start);
    const refining=enabled&&stage.kind==='refine';
    const flowS=stage.kind==='refine'||stage.kind==='predict'?local:1;
    const hasRefined=enabled&&stage.block>0;
    const correction=refining?.7+.2*Math.sin(local*Math.PI):hasRefined?.7:0;
    $('.md-corrected-trajectory').setAttribute('d',curve(correction));
    $('.md-corrected-trajectory').style.opacity=refining||hasRefined?'1':'0';
    const p=point(flowS,correction);
    $('.md-flow-particle').setAttribute('cx',p.x);$('.md-flow-particle').setAttribute('cy',p.y);
    $('.md-flow-particle').setAttribute('fill',correction?'#B48124':'#0F8195');
    $('.md-iteration').textContent=`s = ${flowS.toFixed(2)}`;
    $('.md-delta-vectors').innerHTML=refining?[.32,.52,.72,.9].map(t=>{const b=point(t),c=point(t,correction);return `<path d="M${b.x} ${b.y}L${c.x} ${c.y}" marker-end="url(#md-flow-arrow)" opacity="${correction}"/>`;}).join(''):'';
    packet('.md-base-packet','.md-base-wire',(elapsed%2400)/2400,stage.kind==='predict'||stage.kind==='refine');
    packet('.md-pred-packet','.md-pred-wire',local,enabled&&stage.kind==='predict');
    packet('.md-fusion-packet','.md-fusion-wire',local,refining);
    packet('.md-delta-packet','.md-delta-wire',(local*2)%1,refining);
    if(phase!==previousPhase){
      previousPhase=phase;root.dataset.phase=stage.kind;
      $('.md-phase-title').textContent=enabled?stage.title:'The base policy stands on its own.';
      $('.md-phase-copy').textContent=enabled?stage.copy:'The video world model and action expert generate base actions independently. The tactile path is inactive.';
    }
    $('.md-prior-status').textContent=!enabled?'Base action generation · tactile path inactive':stage.kind==='predict'?'World priors · one forward pass':'World priors · fixed for this entire chunk';
    root.querySelectorAll('.md-block').forEach((block,i)=>{
      block.classList.toggle('md-block-executed',i<stage.block);
      block.classList.toggle('md-block-active',i===stage.block);
      block.querySelectorAll('i').forEach((step,j)=>step.classList.toggle('md-step-done',i<stage.block||(i===stage.block&&stage.kind==='execute'&&local>=(j+1)/4)));
    });
  }
  function animate(time){if(lastTime&&!paused&&visible&&!document.hidden)elapsed+=Math.min(time-lastTime,60);lastTime=time;if(visible)render();requestAnimationFrame(animate);}
  function setPaused(value){paused=value;$('.md-pause').innerHTML=paused?'Play <span aria-hidden="true">▷</span>':'Pause <span aria-hidden="true">Ⅱ</span>';$('.md-pause').setAttribute('aria-label',paused?'Play method animation':'Pause method animation');root.classList.toggle('md-paused',paused);}
  $('.md-pause').addEventListener('click',()=>setPaused(!paused));
  $('.md-replay').addEventListener('click',()=>{elapsed=0;previousPhase=-1;render();if(!reduced.matches)setPaused(false);});
  $('.md-toggle').addEventListener('click',()=>{enabled=!enabled;root.dataset.enabled=String(enabled);$('.md-mobile-sum').innerHTML=enabled?'v<sub>base</sub> + Δv → next block':'v<sub>base</sub> → next block';$('.md-toggle').setAttribute('aria-checked',String(enabled));previousPhase=-1;render();});
  reduced.addEventListener('change', e=>setPaused(e.matches));
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.05});observer.observe(root);
  if(reduced.matches)elapsed=6500;
  setPaused(paused);render();requestAnimationFrame(animate);
  return {setPaused};
}

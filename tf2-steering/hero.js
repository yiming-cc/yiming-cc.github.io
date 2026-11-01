/** A conceptual 2D projection of flow-matching action generation, not rollout data. */
export function initHero(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setPaused() {}, destroy() {} };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, paused = false, visible = true, frame = 0, elapsed = 0, last = 0;
  const C = { teal: '#0F8195', gold: '#C08A12', coral: '#E0583F', purple: '#988BBA', ink: '#40535B' };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => { t = clamp(t); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function point(t, refinement = 0, lane = 0) {
    const spread = Math.sin(Math.PI * t) * lane;
    return {
      x: width * (.13 + .72 * t),
      y: height * (.77 + .032 * Math.sin(t * Math.PI * 1.8) - .03 * t - .108 * ease((t - .28) / .72) * refinement) + spread
    };
  }
  function arrow(x, y, dx, dy, color, opacity, weight = 1, head = 4) {
    ctx.save(); ctx.globalAlpha = opacity; ctx.strokeStyle = color; ctx.lineWidth = weight;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy); ctx.stroke();
    const a = Math.atan2(dy, dx);
    ctx.beginPath(); ctx.moveTo(x + dx - head * Math.cos(a - .48), y + dy - head * Math.sin(a - .48));
    ctx.lineTo(x + dx, y + dy);
    ctx.lineTo(x + dx - head * Math.cos(a + .48), y + dy - head * Math.sin(a + .48)); ctx.stroke(); ctx.restore();
  }
  function line(refinement, lane, opacity, color, to = 1, weight = 1) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = weight; ctx.globalAlpha = opacity;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const p = point(i / 120 * to, refinement, lane);
      if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke(); ctx.restore();
  }
  function label(text, x, y, color, align = 'left', size = 11) {
    ctx.save(); ctx.font = `500 ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text, x, y); ctx.restore();
  }
  function glow(x, y, r, color) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x-r, y-r, r*2, r*2);
  }
  function draw() {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const mobile = width < 640;
    const time = reduce.matches ? 7.7 : elapsed % 12;
    const progress = clamp((time - .65) / 8.8);
    const steering = ease((time - 3.3) / 3.8);
    const fade = time > 10.9 ? 1 - ease((time - 10.9) / 1.1) : ease(time / .55);
    const active = progress > .30;
    glow(width * .18, height * .72, width * .39, 'rgba(152,139,186,.105)');
    glow(width * .76, height * .72, width * .3, 'rgba(224,88,63,.065)');
    glow(width * .57, height * .9, width * .3, 'rgba(15,129,149,.05)');

    // A quiet vector field frames the typography and the active flow trajectory.
    const sx = mobile ? 28 : 43, sy = 36;
    for (let y = height * .56; y < height * .95; y += sy) {
      for (let x = 18; x < width; x += sx) {
        const t = clamp((x / width - .13) / .72);
        const p = point(t, steering);
        const near = Math.exp(-Math.pow((y-p.y)/(height*.12), 2));
        const edge = Math.sin(Math.PI * clamp(x/width));
        const slope = -.1 + .18 * Math.cos(t * Math.PI * 1.8) - steering * .46 * Math.sin(Math.PI * t);
        const wave = Math.sin(x / 170 + y / 110 + time * .25) * .035;
        const dy = (slope + wave) * 13 - (y-p.y)*.018;
        const deltaRegion = ease((t - .30) / .45) * near * steering;
        arrow(x, y, 11 + near * 5, dy, deltaRegion > .5 ? C.gold : C.teal, (.065 + near * .14) * edge, .8, 2.7);
      }
    }
    // Faint individual flow lines give the visualization depth without random noise.
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      line(0, i * (mobile ? 7 : 10), .025 + .025 * (1 - Math.abs(i) / 6), C.teal);
      line(steering, i * (mobile ? 7 : 10), .018, C.gold);
    }
    ctx.save(); ctx.setLineDash([3, 6]); line(0, 0, .28, C.teal, 1, 1.4); ctx.restore();
    line(1, 0, .09, C.gold, 1, 1.5);

    // The unrefined action expert is always a complete, independent base path.
    const baseEnd = point(1, 0), refinedEnd = point(1, 1), start = point(0);
    ctx.strokeStyle = 'rgba(15,129,149,.35)'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(baseEnd.x, baseEnd.y, 5, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(192,138,18,.35)';
    ctx.beginPath(); ctx.arc(refinedEnd.x, refinedEnd.y, 6, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = C.teal; ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(start.x, start.y, 3.5, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
    label(mobile ? 'Noise' : 'Initial action noise', start.x, start.y + 29, '#84939A', mobile ? 'left' : 'center', mobile ? 10 : 11);
    label('Base action', baseEnd.x + (mobile ? 0 : 14), baseEnd.y + (mobile ? 24 : 4), '#54858E', mobile ? 'right' : 'left', mobile ? 10 : 11);
    label('Refined action', refinedEnd.x + (mobile ? 0 : 14), refinedEnd.y + (mobile ? -16 : 4), '#9E7E39', mobile ? 'right' : 'left', mobile ? 10 : 11);

    ctx.save(); ctx.globalAlpha = fade;
    // Incremental correction vectors appear locally along the denoising path.
    for (let i = 0; i < 5; i++) {
      const t = .38 + i * .105;
      const born = ease((progress - t) * 14);
      if (born <= 0) continue;
      const p = point(t, steering);
      const strength = (10 + i * 2.4) * steering * born;
      arrow(p.x - 5, p.y + strength * .5, 7, -strength, C.gold, .65 * born * fade, 1.2, 3.5);
    }
    line(0, 0, .46 * fade, C.teal, progress, 2.2);
    if (steering > 0) {
      ctx.shadowColor = 'rgba(192,138,18,.13)'; ctx.shadowBlur = 12;
      line(steering, 0, .95 * fade, C.gold, progress, 2.4);
      ctx.shadowBlur = 0;
    }
    for (let i = 0; i < 18; i++) {
      const t = progress - i * .0035;
      if (t < 0) continue;
      const p = point(t, steering);
      ctx.globalAlpha = fade * (1 - i / 18) * .45;
      ctx.fillStyle = active ? C.gold : C.teal; ctx.beginPath(); ctx.arc(p.x, p.y, mix(4, 1, i/18), 0, Math.PI*2); ctx.fill();
    }
    const head = point(progress, steering);
    ctx.globalAlpha = fade;
    const halo = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 22);
    halo.addColorStop(0, active ? 'rgba(192,138,18,.16)' : 'rgba(15,129,149,.16)'); halo.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = halo; ctx.fillRect(head.x-22,head.y-22,44,44);
    ctx.fillStyle = active ? C.gold : C.teal; ctx.beginPath(); ctx.arc(head.x,head.y,4.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(head.x,head.y,1.7,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // Compact native type beneath the title, above the illustrated action space.
    const captionY = height * .595;
    if (!mobile) {
      label('FLOW-MATCHING VELOCITY', width * .13, captionY, '#7C969D', 'left', 10);
      label('v refined  =  v base  +  Δv tactile', width * .85, captionY, '#6F7D82', 'right', 12);
    }
    const legendY = height * .89;
    const center = width * .5;
    ctx.strokeStyle = C.teal; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(center-(mobile?105:143),legendY-4); ctx.lineTo(center-(mobile?89:122),legendY-4); ctx.stroke();
    label('Base velocity',center-(mobile?82:114),legendY,'#68848B','left',mobile?10:11);
    ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.moveTo(center+(mobile?4:17),legendY-4); ctx.lineTo(center+(mobile?20:38),legendY-4); ctx.stroke();
    label('Tactile refinement',center+(mobile?27:46),legendY,'#92805A','left',mobile?10:11);
    // All progress refers to illustrative flow time, not physical execution time.
    const barY = height*.925, barW = mobile ? 100 : 130, left = center-barW/2;
    ctx.fillStyle = 'rgba(15,129,149,.08)'; ctx.fillRect(left,barY,barW,2);
    ctx.fillStyle = 'rgba(15,129,149,.42)'; ctx.fillRect(left,barY,barW*progress,2);
    label('τ = '+progress.toFixed(2),left-12,barY+4,'#9AA7AA','right',9);
    label('1.00',left+barW+10,barY+4,'#9AA7AA','left',9);
  }
  function tick(now) {
    if (last && !paused && visible && !document.hidden && !reduce.matches) elapsed += Math.min((now-last)/1000,.05);
    last = now;
    if (visible && !document.hidden && !paused && !reduce.matches) draw();
    frame = requestAnimationFrame(tick);
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  const intersection = new IntersectionObserver(entries=> { visible=entries[0].isIntersecting; if (visible) draw(); }); intersection.observe(canvas);
  const changed = () => draw(); reduce.addEventListener('change',changed);
  resize(); frame=requestAnimationFrame(tick);
  return {
    setPaused(value) { paused=Boolean(value); draw(); },
    destroy() { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); reduce.removeEventListener('change',changed); }
  };
}

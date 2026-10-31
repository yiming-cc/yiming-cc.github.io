import { initHero } from './hero.js';

const animation = initHero(document.querySelector('#hero-canvas'));
const button = document.querySelector('#hero-pause');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;

function updateMotion() {
  animation.setPaused(paused);
  button.innerHTML = paused ? '▷ <span>Play motion</span>' : 'Ⅱ <span>Pause motion</span>';
  button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
  button.setAttribute('aria-pressed', String(paused));
}

button.addEventListener('click', () => {
  paused = !paused;
  updateMotion();
});
reducedMotion.addEventListener('change', event => {
  paused = event.matches;
  updateMotion();
});
updateMotion();

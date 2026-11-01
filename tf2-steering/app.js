import { initHero } from './hero.js?v=20261101-full';
import { initMethod } from './method.js?v=20261101-full';
import { initResults } from './results.js?v=20261101-full';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const tasks = [
  {name:'Fruit on Plate',file:'put_fruit_2',description:'Place and release with care.'},
  {name:'Close Zipper',file:'close_zipper_2',description:'Grasp the slider. Guide the motion.'},
  {name:'Wipe Whiteboard',file:'wipe_whiteboard_1',description:'Maintain contact across the surface.'},
  {name:'Twist Cap',file:'twist_cap',description:'Coordinate contact and rotation.'},
  {name:'Split Cups',file:'split_cups',description:'Separate with controlled interaction.'},
  {name:'Dropper Transfer',file:'liquid_transfer',description:'Regulate pressure. Transfer the liquid.'},
];
const grid = document.querySelector('#task-grid');
grid.innerHTML = tasks.map((task,i)=>`<article class="task-card reveal"><div class="task-media"><video muted loop playsinline preload="none" poster="assets/${task.file}.jpg" data-src="assets/${task.file}.mp4" aria-label="${task.name} real-world rollout"></video><button class="task-expand" data-task="${i}" aria-label="Play ${task.name} video">↗</button></div><div class="task-caption"><h3>${task.name}</h3><span>0${i+1}</span></div><p class="task-description">${task.description}</p></article>`).join('');

const hero=initHero(document.querySelector('#hero-canvas'));
let heroPaused=reducedMotion.matches;
const heroButton=document.querySelector('#hero-pause');
function syncHeroButton(){heroButton.innerHTML=heroPaused?'▷ <span>Play motion</span>':'Ⅱ <span>Pause motion</span>';heroButton.setAttribute('aria-label',heroPaused?'Play hero animation':'Pause hero animation');}
syncHeroButton();
heroButton.addEventListener('click',()=>{heroPaused=!heroPaused;hero.setPaused(heroPaused);syncHeroButton();});
reducedMotion.addEventListener('change',e=>{heroPaused=e.matches;hero.setPaused(heroPaused);syncHeroButton();});
initMethod(document.querySelector('#method-demo'));
initResults(document.querySelector('#results-charts'));

const dialog=document.querySelector('#video-dialog');
const dialogVideo=document.querySelector('#dialog-video');
let returnFocus;
grid.addEventListener('click',e=>{
  const button=e.target.closest('[data-task]');if(!button)return;
  const task=tasks[Number(button.dataset.task)];returnFocus=button;
  document.querySelector('#dialog-title').textContent=task.name;
  document.querySelector('#dialog-caption').textContent='Real-world policy rollout · 1.5× playback speed · no audio';
  dialogVideo.src=`assets/${task.file}.mp4`;dialog.showModal();dialogVideo.play().catch(()=>{});
});
function closeVideo(){dialog.close();}
document.querySelector('#close-dialog').addEventListener('click',closeVideo);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeVideo();}});
dialog.addEventListener('close',()=>{dialogVideo.pause();dialogVideo.removeAttribute('src');dialogVideo.load();returnFocus?.focus();});

const videoObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
  target.dataset.visible=String(isIntersecting);
  if(isIntersecting&&!reducedMotion.matches&&!document.hidden){if(!target.src)target.src=target.dataset.src;target.play().catch(()=>{});}else target.pause();
}),{threshold:.15});
grid.querySelectorAll('video').forEach(video=>videoObserver.observe(video));
document.addEventListener('visibilitychange',()=>grid.querySelectorAll('video').forEach(video=>{if(document.hidden)video.pause();else if(video.dataset.visible==='true'&&!reducedMotion.matches)video.play().catch(()=>{});}));
reducedMotion.addEventListener('change',()=>grid.querySelectorAll('video').forEach(video=>{if(reducedMotion.matches)video.pause();else if(video.dataset.visible==='true'){if(!video.src)video.src=video.dataset.src;video.play().catch(()=>{});}}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.05,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
document.body.classList.add('js-ready');

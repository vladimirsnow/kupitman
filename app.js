const photos = [
 {id:'portrait', file:'photo_2026-11-25_02-41-18.jpg', title:'Без лишних слов',alt:'Портрет Василия с заклеенным ртом'},
 {id:'slope', file:'photo_2026-11-25_02-40-51.jpg',title:'Туда, где снег',alt:'Вечерний горный склон'},
 {id:'basket', file:'photo_2026-11-25_02-41-13.jpg',title:'Выше кольца',alt:'Василий в прыжке у баскетбольного кольца'},
 {id:'gym', file:'photo_2026-11-25_02-40-17.jpg',title:'После тренировки',alt:'Василий в зале'},
 {id:'wild', file:'photo_2026-11-25_02-41-07.jpg',title:'Без контекста',alt:'Шуточное фото в парике с чемоданом фишек'}
];
const dialog = document.querySelector('.lightbox');
let photoIndex=0; let opener;
function showPhoto(index){
 photoIndex=(index+photos.length)%photos.length;
 const p=photos[photoIndex],img=document.querySelector('#lightbox-image');
 img.src='./'+p.file; img.alt=p.alt;
 document.querySelector('#lightbox-count').textContent=String(photoIndex+1).padStart(2,'0')+' / 05';
 document.querySelector('#lightbox-caption').textContent=p.title;
}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{
 opener=button;showPhoto(photos.findIndex(p=>p.id===button.dataset.photo));
 dialog.showModal();document.body.style.overflow='hidden';
}));
function closePhoto(){document.body.style.overflow='';dialog.close()}
document.querySelector('#lightbox-close').addEventListener('click',closePhoto);
dialog.addEventListener('cancel',e=>{e.preventDefault();closePhoto()});
document.querySelector('#lightbox-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
document.querySelector('#lightbox-next').addEventListener('click',()=>showPhoto(photoIndex+1));
dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus({preventScroll:true})});
dialog.addEventListener('click',e=>{if(e.target===dialog)closePhoto()});
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1)}if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1)}});
let startX=0;dialog.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});
dialog.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-startX;if(Math.abs(d)>65)showPhoto(photoIndex+(d<0?1:-1))},{passive:true});
const strip=document.querySelector('.film-strip');
for(const [id,direction] of [['film-prev',-1],['film-next',1]])document.getElementById(id).addEventListener('click',()=>strip.scrollBy({left:direction*Math.min(strip.clientWidth*.7,460),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 gsap.matchMedia().add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.hero h1',{y:30,opacity:0,duration:.8,ease:'power3.out'});
  gsap.from('.hero-portrait',{clipPath:'inset(100% 0% 0% 0%)',duration:1,ease:'power3.inOut',delay:.1});
  gsap.from('.hero-side',{opacity:0,duration:.9,stagger:.1,ease:'power3.out',delay:.25});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
  gsap.fromTo('.winter-image',{yPercent:-7},{yPercent:10,ease:'none',scrollTrigger:{trigger:'.winter',start:'top bottom',end:'bottom top',scrub:1}});
  gsap.from('.winter h2',{y:50,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.winter-content',start:'top 80%',once:true}});
  gsap.to('.big-asterisk',{rotation:160,ease:'none',scrollTrigger:{trigger:'.motion-heading',start:'top bottom',end:'bottom top',scrub:1}});
 });
 window.addEventListener('load',()=>ScrollTrigger.refresh());
}

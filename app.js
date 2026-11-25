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

const preview = document.querySelector('.screen-open');
const previewImage = preview.querySelector('img');
const caption = document.querySelector('.gallery-screen figcaption');
const choices = document.querySelectorAll('[data-select]');

choices.forEach(button => {
  button.addEventListener('click', () => {
    const photo = photos.find(item => item.id === button.dataset.select);
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    preview.dataset.photo = photo.id;
    preview.setAttribute('aria-label', 'Открыть оригинал: ' + photo.title);
    previewImage.src = './assets/' + photo.id + '.webp';
    previewImage.alt = photo.alt;
    caption.textContent = photo.title;
  });
});

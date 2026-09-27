const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-nav');
menuButton.addEventListener('click', () => {const open = menuButton.getAttribute('aria-expanded') !== 'true';menuButton.setAttribute('aria-expanded', String(open));menuButton.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');menu.hidden = !open;});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {menu.hidden = true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Apri il menu');}));
const dogData = JSON.parse(document.querySelector('#dog-data').textContent);
const dialog = document.querySelector('#dog-dialog');
let activeDog = null;
let lastTrigger = null;
const dateFormat = new Intl.DateTimeFormat('it-IT', {day:'numeric',month:'long',year:'numeric'});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const size = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  let count = 0;
  document.querySelectorAll('.dog-card').forEach(card => {card.hidden = size !== 'all' && card.dataset.size !== size;if(!card.hidden)count++;});
  document.querySelector('#result-count').textContent = count === 1 ? '1 storia da conoscere' : `${count} storie da conoscere`;
}));
document.querySelectorAll('[data-dog]').forEach(link => link.addEventListener('click', event => {
  if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
  event.preventDefault();
  activeDog = dogData.find(dog => dog.id === link.dataset.dog);
  lastTrigger = link;
  const d = activeDog;
  document.querySelector('#dialog-title').textContent = d.name;
  document.querySelector('#dialog-tag').textContent = d.tag;
  document.querySelector('#dialog-meta').textContent = `${d.sex[0].toUpperCase()+d.sex.slice(1)} · ${d.size.includes('taglia') ? d.size : 'Taglia '+d.size} · Latina`;
  document.querySelector('#dialog-image').src = `assets/${d.id}.jpg`;
  document.querySelector('#dialog-image').alt = `${d.name}, fotografia originale dell’associazione`;
  document.querySelector('#dialog-story').textContent = d.story;
  document.querySelector('#dialog-compat').textContent = d.compat;
  document.querySelector('#dialog-needs').textContent = d.needs;
  document.querySelector('#dialog-date').textContent = `Annuncio del ${dateFormat.format(new Date(d.date+'T12:00:00'))}. Età indicata allora: ${d.age}. Età e situazione attuale da aggiornare con i volontari.`;
  document.querySelector('#dialog-source').href = d.source;
  document.querySelector('#dialog-contact').href = `https://wa.me/39${d.phone}?text=${encodeURIComponent(`Ciao, ho letto la storia di ${d.name}. Cerca ancora casa? Vorrei avere informazioni e presentarmi.`)}`;
  dialog.showModal();
  document.body.classList.add('body-dialog-open');
  dialog.scrollTop=0;
}));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('body-dialog-open');lastTrigger?.focus({preventScroll:true});});
let toastTimer;
function toast(text){const element=document.querySelector('.toast');element.textContent=text;element.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.classList.remove('show'),4000);}
document.querySelector('#share-dog').addEventListener('click',async()=>{
  if(!activeDog)return;
  const data={title:`La storia di ${activeDog.name} — Amici del Cane di Latina`,text:`Conosci ${activeDog.name}. Verifica con i volontari la disponibilità per l’adozione.`,url:activeDog.source};
  try{
    if(navigator.share){await navigator.share(data);}
    else if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(activeDog.source);toast('Link all’annuncio copiato. Ora puoi condividerlo.');}
    else{window.open(`https://wa.me/?text=${encodeURIComponent(data.text+' '+data.url)}`,'_blank','noopener');}
  }catch(error){if(error.name!=='AbortError')toast('Non è stato possibile condividere. Usa il link “Annuncio originale”.');}
});

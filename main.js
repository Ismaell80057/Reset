const today=()=>new Date().toISOString().slice(0,10);
function esc(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}

const state={theme:'dark'};
const views=[
  {id:'dashboard',label:'Dashboard'},
  {id:'r3',label:'3R'},
  {id:'journal',label:'Journal'},
  {id:'habits',label:'Habitudes'},
  {id:'tasks',label:'Tâches'},
  {id:'contract',label:'Contrat'},
  {id:'halt',label:'HALT'},
  {id:'data',label:'Données'}
];
function applyTheme(){document.documentElement.setAttribute('data-theme',state.theme);}
function toggleTheme(){state.theme=state.theme==='light'?'dark':'light';applyTheme();}
function buildNav(){
  const nav=document.getElementById('nav');
  if(!nav){console.error('nav introuvable');return;}
  nav.innerHTML='';
  views.forEach(v=>{
    const btn=document.createElement('button');
    btn.textContent=v.label;btn.dataset.view=v.id;nav.appendChild(btn);
  });
}
function showView(id){
  const target=document.getElementById(id);
  if(!target){console.error('Vue introuvable:',id);return;}
  document.querySelectorAll('#app .view').forEach(v=>v.classList.add('hidden'));
  target.classList.remove('hidden');
}
function doLogin(){
  const u=document.getElementById('lu').value.trim();
  const p=document.getElementById('lp').value;
  if(u==='Ismael' && p==='Bymemu48.'){
    document.getElementById('login').style.display='none';
    const app=document.getElementById('app');
    app.classList.remove('hidden');
    if(typeof buildNav==='function') buildNav(); else console.error('buildNav manquante');
    if(typeof showView==='function') showView('dashboard'); else console.error('showView manquante');
  }else{
    document.getElementById('lockMsg').textContent='Identifiants incorrects.';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  const loginBtn=document.getElementById('loginBtn');
  if(loginBtn) loginBtn.addEventListener('click',doLogin); else console.error('loginBtn introuvable');
  const themeBtn=document.getElementById('themeBtn');
  if(themeBtn) themeBtn.addEventListener('click',toggleTheme); else console.error('themeBtn introuvable');
  const nav=document.getElementById('nav');
  if(nav) nav.addEventListener('click',e=>{
    const btn=e.target.closest('button[data-view]');
    if(btn){
      if(typeof showView==='function'){
        try{showView(btn.dataset.view);}catch(err){console.error(err);}
      }else{
        console.error('showView manquante');
      }
    }
  }); else console.error('nav introuvable');
  applyTheme();
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }
});

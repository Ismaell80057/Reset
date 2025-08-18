const today=()=>new Date().toISOString().slice(0,10);
function esc(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}

const state={theme:'dark'};
const views=['Dashboard','3R','Journal','Habitudes','Tâches','Contrat','HALT','Données'];
function applyTheme(){document.documentElement.setAttribute('data-theme',state.theme);}
function toggleTheme(){state.theme=state.theme==='light'?'dark':'light';applyTheme();}
function buildNav(){
  const nav=document.getElementById('nav');
  nav.innerHTML='';
  views.forEach(v=>{
    const btn=document.createElement('button');
    btn.textContent=v;btn.dataset.view=v;nav.appendChild(btn);
  });
}
function showView(name){
  const app=document.getElementById('app');
  app.innerHTML='<h2>'+esc(name)+'</h2>';
}
function doLogin(){
  const u=document.getElementById('lu').value.trim();
  const p=document.getElementById('lp').value;
  if(u==='Ismael' && p==='Bymemu48.'){
    document.getElementById('login').style.display='none';
    const app=document.getElementById('app');
    app.classList.remove('hidden');
    buildNav();
    showView('Dashboard');
  }else{
    document.getElementById('lockMsg').textContent='Identifiants incorrects.';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('loginBtn').addEventListener('click',doLogin);
  document.getElementById('themeBtn').addEventListener('click',toggleTheme);
  document.getElementById('nav').addEventListener('click',e=>{
    const btn=e.target.closest('button[data-view]');
    if(btn)showView(btn.dataset.view);
  });
  applyTheme();
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }
});

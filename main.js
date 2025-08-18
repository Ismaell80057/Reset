const today=()=>new Date().toISOString().slice(0,10);
function esc(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}

const state={theme:'dark'};
function applyTheme(){document.documentElement.setAttribute('data-theme',state.theme);}
function toggleTheme(){state.theme=state.theme==='light'?'dark':'light';applyTheme();}
function doLogin(){
  const u=document.getElementById('lu').value.trim();
  const p=document.getElementById('lp').value;
  if(u==='Ismael' && p==='Bymemu48.'){
    document.getElementById('login').style.display='none';
    document.getElementById('app').classList.remove('hidden');
  }else{
    document.getElementById('lockMsg').textContent='Identifiants incorrects.';
  }
}

document.getElementById('loginBtn').addEventListener('click',doLogin);
document.getElementById('themeBtn').addEventListener('click',toggleTheme);
applyTheme();

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').catch(console.error);
}

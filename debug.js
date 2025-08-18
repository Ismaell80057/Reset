(function(){
  const logEl=document.getElementById('log');
  const orig={log:console.log,warn:console.warn,error:console.error};
  ['log','warn','error'].forEach(k=>{
    console[k]=(...args)=>{
      orig[k](...args);
      const d=document.createElement('div');
      d.textContent='['+k.toUpperCase()+'] '+args.map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ');
      d.className=k==='error'?'bad':(k==='warn'?'warn':'');
      logEl.appendChild(d);
    };
  });
})();
window.addEventListener('error',e=>console.error('Erreur script:',e.message));
window.addEventListener('unhandledrejection',e=>console.error('Rejet non géré:',e.reason));
function esc(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function set(elId,status,msg){const el=document.getElementById(elId);el.textContent=msg;el.className=status;}

document.getElementById('ua').textContent=navigator.userAgent;
(async()=>{
  try{const r=await fetch('manifest.webmanifest');set('mani',r.ok?'ok':'bad',r.ok?'manifest chargé':'manifest introuvable');}
  catch(e){set('mani','bad','erreur de chargement');}
})();
(async()=>{
  if('serviceWorker' in navigator){
    const regs=await navigator.serviceWorker.getRegistrations();
    set('sw',regs.length?'ok':'warn',regs.length?regs.length+' SW enregistré(s)':'aucun SW');
  }else{set('sw','bad','non supporté');}
})();
try{
  const testKey='__rst__'+Math.random();
  localStorage.setItem(testKey,'1');localStorage.removeItem(testKey);
  const size=Object.keys(localStorage).reduce((n,k)=>n+(localStorage[k]?.length||0),0);
  set('ls','ok','ok ('+size+' chars stockés)');
}catch(e){set('ls','bad','indisponible: '+e);}
(async()=>{
  if(!('caches' in window)){set('caches','warn','API Cache non dispo');return;}
  const keys=await caches.keys();set('caches',keys.length?'ok':'warn',keys.length?keys.join(', '):'vide');
})();

document.getElementById('btnResetSW').addEventListener('click', resetSW);
document.getElementById('btnClearLS').addEventListener('click', clearLS);
document.getElementById('btnRunAll').addEventListener('click', runAll);

async function resetSW(){
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
    console.log('Service worker et caches réinitialisés');
    alert('OK. Recharge maintenant la page principale.');
  }catch(e){
    console.error('Erreur lors du reset SW',e);
    alert('Erreur lors du reset: '+e.message);
  }
}
function clearLS(){
  try{
    Object.keys(localStorage).filter(k=>k.toLowerCase().includes('reset')).forEach(k=>localStorage.removeItem(k));
    console.log('LocalStorage RESET vidé.');
    alert('LocalStorage RESET vidé.');
  }catch(e){
    console.error('Erreur clearLS',e);
    alert('Erreur lors du vidage du LocalStorage.');
  }
}
async function testLoginFlow(){const okLogin=typeof doLogin==='function'||typeof window.doLogin==='function';return okLogin?['ok','méthode login présente (manuel)']:['warn','méthode login non trouvée (ouvrir index.html)'];}
async function testHALT(){try{const r=await fetch('index.html');const tx=await r.text();const hasHALT=tx.includes('HALT')&&(tx.includes('hHungry')||tx.includes('HALT</h2>'));return hasHALT?['ok','HALT présent dans index.html']:['bad','HALT introuvable'];}catch(e){return ['bad','lecture index.html impossible'];}}
async function testExportImport(){try{const blob=new Blob([JSON.stringify({test:true})],{type:'application/json'});return ['ok','Export JSON possible (simulé)'];}catch(e){return ['bad','Blob JSON non supporté'];}}
async function testSW(){if(!('serviceWorker' in navigator))return ['warn','SW non supporté'];try{const regs=await navigator.serviceWorker.getRegistrations();return regs.length?['ok','SW enregistré']:['warn','aucun SW'];}catch(e){return ['bad','erreur SW'];}}
async function runAll(){const out=document.getElementById('out');out.textContent='';const rows=[['1) Login: ',await testLoginFlow()],['2) HALT: ',await testHALT()],['3) Export/Import: ',await testExportImport()],['4) Service Worker: ',await testSW()]];rows.forEach(([label,[status,msg]])=>{const d=document.createElement('div');d.appendChild(document.createTextNode(label));const span=document.createElement('span');span.className=status;span.textContent=(status==='ok'?'✅ ':status==='bad'?'❌ ':'⚠️ ')+msg;d.appendChild(span);out.appendChild(d);});const end=document.createElement('div');end.className='muted';end.textContent='— Termine en vérifiant manuellement Journal/Habitudes/Tâches.';out.appendChild(end);}

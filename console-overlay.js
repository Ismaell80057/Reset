// Console overlay (?debug=1)
(function(){
  try{
    const url = new URL(location.href);
    if(url.searchParams.get('debug')!=='1') return;
    const pane = document.createElement('div');
    pane.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:45%;overflow:auto;background:rgba(0,0,0,.8);color:#e9f0f7;font:12px/1.4 monospace;padding:8px;z-index:99999;border-top:1px solid #243040';
    pane.innerHTML = '<b>DEBUG CONSOLE</b> <button id="dbgClear" style="float:right">clear</button><div id="dbgOut"></div>';
    document.body.appendChild(pane);
    const out = pane.querySelector('#dbgOut');
    pane.querySelector('#dbgClear').onclick = ()=> out.innerHTML='';
    const orig = { log:console.log, warn:console.warn, error:console.error };
    ['log','warn','error'].forEach(k=>{
      console[k] = (...args)=>{
        orig[k](...args);
        const d=document.createElement('div');
        d.textContent = '['+k.toUpperCase()+'] '+args.map(a=> typeof a==='object'? JSON.stringify(a): String(a)).join(' ');
        d.style.color = k==='error' ? '#ff6b6b' : (k==='warn' ? '#ffd166' : '#cfe6ff');
        out.appendChild(d);
      };
    });
    window.addEventListener('error', e=>{
      const d=document.createElement('div'); d.textContent='[ERROR] '+(e.message||e.toString()); d.style.color='#ff6b6b'; out.appendChild(d);
    });
    console.log('Overlay debug activé.');
  }catch(e){}
})();

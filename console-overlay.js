// Console overlay (?debug=1)
(function(){
  try{
    const url=new URL(location.href);
    if(url.searchParams.get('debug')!=='1') return;
    const pane=document.createElement('div');
    pane.className='console-overlay';
    const title=document.createElement('b');
    title.textContent='DEBUG CONSOLE';
    const clearBtn=document.createElement('button');
    clearBtn.id='dbgClear';
    clearBtn.className='dbgClear';
    clearBtn.textContent='clear';
    const out=document.createElement('div');
    out.id='dbgOut';
    pane.append(title,clearBtn,out);
    document.body.appendChild(pane);
    clearBtn.addEventListener('click',()=>{out.textContent='';});
    const orig={log:console.log,warn:console.warn,error:console.error};
    ['log','warn','error'].forEach(k=>{
      console[k]=(...args)=>{
        orig[k](...args);
        const d=document.createElement('div');
        d.textContent='['+k.toUpperCase()+'] '+args.map(a=>typeof a==='object'?JSON.stringify(a):String(a)).join(' ');
        d.className='log-'+k;
        out.appendChild(d);
      };
    });
    window.addEventListener('error',e=>{
      const d=document.createElement('div');
      d.textContent='[ERROR] '+(e.message||e.toString());
      d.className='log-error';
      out.appendChild(d);
    });
    console.log('Overlay debug activé.');
  }catch(e){}
})();

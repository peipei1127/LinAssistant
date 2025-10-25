// 外链脚本（避免某些环境拦截 inline script）
const el=(id)=>document.getElementById(id);
const qsa=(sel)=>[...document.querySelectorAll(sel)];
const SKEY='lin_assist_state_v1';

function load(){let s=localStorage.getItem(SKEY);if(s) return JSON.parse(s);s={msgs:[]};localStorage.setItem(SKEY,JSON.stringify(s));return s;}
function save(s){localStorage.setItem(SKEY,JSON.stringify(s));}
let state=load();

function addMsg(t,who='a'){const wrap=el('msgs');const item=document.createElement('div');item.className='msg '+who;const b=document.createElement('div');b.className='bubble';b.textContent=t;item.appendChild(b);wrap.appendChild(item);wrap.scrollTop=wrap.scrollHeight;state.msgs.push({t:Date.now(),who,text:t});save(state);}

function openPanel(){el('panel').style.display='flex';}
function closePanel(){el('panel').style.display='none';}

// 就绪标记
(function(){ el('ready').textContent = 'READY ✓'; })();

// handlers
el('fab').addEventListener('click', ()=>{ openPanel(); addMsg('你终于点我了。','a'); });
el('fab').addEventListener('touchend', (e)=>{ e.preventDefault(); openPanel(); addMsg('你摸我了。','a'); }, {passive:false});
el('send').addEventListener('click', ()=>{ const v=el('text').value.trim(); if(!v) return; addMsg(v,'b'); addMsg('我在。','a'); el('text').value=''; });
qsa('.quick .pill').forEach(x=>x.addEventListener('click', ()=>{ addMsg(x.dataset.q,'b'); addMsg('嗯。','a'); }));

// 简单导出导入
el('btnExport').addEventListener('click',()=>{const data=new Blob([localStorage.getItem(SKEY)||'{}'],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download='lin-assist-state.json';a.click();URL.revokeObjectURL(a.href);});
el('importFile').addEventListener('change', async (e)=>{ const f=e.target.files[0]; if(!f) return; const txt=await f.text(); localStorage.setItem(SKEY, txt); location.reload(); });
el('btnPin').addEventListener('click',()=>{ alert('iPhone：Safari→分享→添加到主屏幕；Android：Chrome→菜单→添加到主屏幕。'); });

// 注册 SW（缓存名加版本号以强更）
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=assist-ext1')); }

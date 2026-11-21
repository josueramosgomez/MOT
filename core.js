/* Sustituye al servidor app.py: responde a las mismas llamadas /api/* dentro del navegador
   y sincroniza banco + historial con Google Drive. */
(()=>{
const LET='ABCD',Z={},SES=new Map(),Err=m=>new Error(m),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CFG0={bloques:{COM:{nombre:"Materias comunes",temas:"COM-01..COM-12",preguntas_examen:25},A:{nombre:"A) Administracion geografica",temas:"ESP-01..ESP-06",preguntas_examen:6},B:{nombre:"B) Geodesia y Geofisica",temas:"ESP-07..ESP-29",preguntas_examen:23},C:{nombre:"C) Geoinformacion / Observacion y Topografia",temas:"ESP-30..ESP-51",preguntas_examen:23},D:{nombre:"D) Cartografia y TIG",temas:"ESP-52..ESP-74",preguntas_examen:23}},examen:{opciones:4,penalizacion_por_error:0.3333333,puntos_maximos:20,puntos_aprobado:10,minutos:180}};
let tok=null;
// ---------- almacenamiento local (IndexedDB)
const DB=new Promise((ok,ko)=>{const r=indexedDB.open('quiz',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=ko});
const kget=async k=>{const d=await DB;return new Promise(ok=>{const q=d.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>ok(q.result)})};
const kset=async(k,v)=>{const d=await DB;return new Promise(ok=>{const t=d.transaction('kv','readwrite');t.objectStore('kv').put(v,k);t.oncomplete=ok})};
const guardar=()=>Promise.all(['set','banco','config','mine','otros','dirty'].map(k=>kset(k,Z[k])));
// ---------- utilidades (mismas reglas que app.py)
const norm=t=>String(t).normalize('NFKD').replace(/[^\x00-\x7f]/g,'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const codTema=t=>{t=String(t).trim().toUpperCase().replace(/_/g,'-').replace(/ /g,'-');const m=t.match(/^(COM|ESP)?-?(\d{1,2})$/);return m?`${m[1]||'ESP'}-${String(+m[2]).padStart(2,'0')}`:t};
const rango=txt=>{const[a,b]=txt.split('..').map(codTema),p=a.split('-')[0],r=[];for(let n=+a.slice(-2);n<=+b.slice(-2);n++)r.push(`${p}-${String(n).padStart(2,'0')}`);return r};
const normC=c=>{if(Number.isInteger(c)&&c>=1&&c<=4)return c-1;c=String(c).trim().toUpperCase();if(c&&LET.includes(c))return LET.indexOf(c);if(c&&'1234'.includes(c))return +c-1;throw Err(`'correcta' debe ser A-D (o 1-4), no ${c}`)};
const idP=async(t,e)=>t+'-'+[...new Uint8Array(await crypto.subtle.digest('SHA-1',new TextEncoder().encode(norm(e))))].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,8);
const cmp=(a,b)=>a<b?-1:a>b?1:0;
async function recargar(){const pr=[],av=[],vistas={},mapa={};
 for(const[b,d]of Object.entries(Z.config.bloques))for(const t of rango(d.temas))mapa[t]=b;
 for(const f of Object.keys(Z.banco).sort()){let datos;try{datos=JSON.parse(Z.banco[f])}catch(e){av.push(`${f}: JSON no valido (${e.message})`);continue}
  let def={},lista=datos;if(!Array.isArray(datos)){def={...datos};delete def.preguntas;lista=datos.preguntas||[]}
  for(const[k,p0]of lista.entries()){const donde=`${f} #${k+1}`,p={...def,...p0};if(p.activa===false)continue;
   try{const tema=codTema(p.tema),ops=p.opciones;
    if(!ops||ops.length!=4||new Set(ops.map(o=>String(o).trim().toLowerCase().replace(/\s+/g,' '))).size!=4)throw Err('necesita 4 opciones distintas');
    if(!String(p.enunciado||'').trim())throw Err('enunciado vacio');
    const cor=normC(p.correcta);if(!mapa[tema])throw Err('tema desconocido '+tema);
    const id=p.id||await idP(tema,p.enunciado);if(vistas[id]){av.push(`${donde}: duplicada de ${vistas[id]} (se ignora)`);continue}vistas[id]=donde;
    pr.push({id,tema,bloque:mapa[tema],pagina:p.pagina,enunciado:String(p.enunciado).trim(),opciones:ops.map(o=>String(o).trim()),correcta:cor,explicacion:p.explicacion||''})
   }catch(e){av.push(`${donde}: ${e.message}`)}}}
 Z.pregs=pr;Z.avisos=av;Z.mapa=mapa}
// ---------- historial: unión de los ficheros de todos los dispositivos
const hists=()=>[Z.mine,...Object.values(Z.otros)];
const sesionesTodas=()=>{const m=new Map();hists().forEach(h=>(h.sesiones||[]).forEach(s=>m.set(s.id||s.fecha+'|'+s.tipo,s)));return[...m.values()].sort((a,b)=>cmp(a.fecha,b.fecha))};
function histPreg(){const h={};hists().forEach(x=>{for(const[id,v]of Object.entries(x.base||{}))if(!h[id]||v.aciertos+v.fallos>h[id].aciertos+h[id].fallos)h[id]={...v}});
 const det={};for(const s of sesionesTodas())for(const d of s.detalle||[]){if(d.marca==null)continue;const x=det[d.id]??={aciertos:0,fallos:0,ultimo:null};if(d.marca===d.cor){x.aciertos++;x.ultimo='acierto'}else{x.fallos++;x.ultimo='fallo'}}
 return{...h,...det}}
// ---------- selección
function elegir(pool,n,h){const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
 if(n>=pool.length)return sh([...pool]);const w=p=>{const x=h[p.id];return !x?2:x.ultimo=='fallo'?3:x.ultimo=='acierto'?.7:1.5},rest=[...pool],res=[];
 while(res.length<n&&rest.length){let r=Math.random()*rest.reduce((s,p)=>s+w(p),0),i=0;for(;i<rest.length-1;i++){r-=w(rest[i]);if(r<=0)break}res.push(rest.splice(i,1)[0])}return res}
const prep=p=>{const o=[0,1,2,3].sort(()=>Math.random()-.5);return{...p,ops:o.map(i=>p.opciones[i]),cor:o.indexOf(p.correcta)}};
// ---------- API (mismos formatos que app.py)
function aInfo(){const cont={},h=histPreg();Z.pregs.forEach(p=>cont[p.tema]=(cont[p.tema]||0)+1);const bloques={};
 for(const[b,d]of Object.entries(Z.config.bloques))bloques[b]={...d,n:Z.pregs.filter(p=>p.bloque==b).length};
 return{total:Z.pregs.length,bloques,examen:Z.config.examen,avisos:Z.avisos,temas:Object.entries(Z.mapa).sort((x,y)=>cmp(x[0],y[0])).map(([t,b])=>({t,bloque:b,n:cont[t]||0})),falladas:Z.pregs.filter(p=>h[p.id]?.ultimo=='fallo').length}}
function aStart(b){const h=histPreg(),cfg=Z.config,tipo=b.tipo;let modo=b.modo||'estudio',titulo,lista=[],limite=null;const n=parseInt(b.n)||20;
 if(tipo=='simulacro'){modo='examen';titulo='Simulacro oficial';limite=cfg.examen.minutos*60;for(const[blq,d]of Object.entries(cfg.bloques))lista.push(...elegir(Z.pregs.filter(p=>p.bloque==blq),d.preguntas_examen,h))}
 else{let pool;if(tipo=='aleatorio'){pool=Z.pregs;titulo='Aleatorias'}else if(tipo=='falladas'){pool=Z.pregs.filter(p=>h[p.id]?.ultimo=='fallo');titulo='Falladas'}
  else{const sel=new Set((b.seleccion||[]).map(codTema));pool=Z.pregs.filter(p=>sel.has(p.tema));titulo=sel.size>0&&sel.size<=3?'Tema '+[...sel].sort().join(', '):sel.size+' temas'}
  lista=elegir(pool,n>0?n:pool.length,h)}
 if(!lista.length)throw Err('No hay preguntas para esa seleccion.');
 const qs=lista.map(prep),sid=crypto.randomUUID();SES.set(sid,{titulo,modo,qs,t0:Date.now()});
 return{sid,titulo,modo,limite,qs:qs.map(q=>({id:q.id,tema:q.tema,pagina:q.pagina,enunciado:q.enunciado,ops:q.ops}))}}
function aAnswer(b){const s=SES.get(b.sid);if(!s)throw Err('Sesion no encontrada');const q=s.qs[+b.i];return{cor:q.cor,explicacion:q.explicacion}}
function resumen(s,i){const ex=Z.config.examen,n=s.aciertos+s.errores+s.blancos;return{i,fecha:s.fecha,tipo:s.tipo,modo:s.modo,n,aciertos:s.aciertos,errores:s.errores,blancos:s.blancos,minutos:s.minutos,nota:s.nota,pct:n?Math.round(1000*s.aciertos/n)/10:0,apto:s.nota>=ex.puntos_aprobado,detalle:!!(s.detalle&&s.detalle.length)}}
async function aFinish(b){const s=SES.get(b.sid);if(!s)throw Err('Sesion no encontrada');SES.delete(b.sid);const ex=Z.config.examen,rr=b.respuestas||[],k=Math.min(s.qs.length,rr.length),rs=s.qs.slice(0,k).map((p,i)=>[p,rr[i]]);
 const ac=rs.filter(([p,m])=>m!=null&&m==p.cor).length,er=rs.filter(([p,m])=>m!=null&&m!=p.cor).length,bl=rs.filter(([p,m])=>m==null).length,n=rs.length||1;
 const nota=+(Math.max(0,ac-er*ex.penalizacion_por_error)*ex.puntos_maximos/n).toFixed(2);
 const detalle=rs.map(([p,m])=>({id:p.id,tema:p.tema,pagina:p.pagina,enunciado:p.enunciado,ops:p.ops,cor:p.cor,marca:m??null,expl:p.explicacion}));
 const ses={id:crypto.randomUUID(),fecha:new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,19),tipo:s.titulo,modo:s.modo,aciertos:ac,errores:er,blancos:bl,nota,minutos:+((Date.now()-s.t0)/6e4).toFixed(1),detalle};
 Z.mine.sesiones.push(ses);await guardar();
 const por={};for(const[p,m]of rs){const d=por[p.tema]??={tema:p.tema,ac:0,er:0,bl:0};d[m==null?'bl':m==p.cor?'ac':'er']++}
 if(tok)sync().catch(()=>{});
 return{sesion:resumen(ses,sesionesTodas().indexOf(ses)),detalle,por_tema:Object.values(por).sort((x,y)=>cmp(x.tema,y.tema))}}
const aSesiones=()=>sesionesTodas().map((s,i)=>resumen(s,i));
function aSesion(i){const l=sesionesTodas();if(!(i>=0&&i<l.length))throw Err('Intento no encontrado');return{sesion:resumen(l[i],i),detalle:l[i].detalle||[]}}
function aStats(){const h=histPreg(),tabla=[],bl={};
 for(const[b,d]of Object.entries(Z.config.bloques))bl[b]={bloque:b,nombre:d.nombre,n:0,vistas:0,ac:0,fa:0};
 for(const[t,b]of Object.entries(Z.mapa).sort((x,y)=>cmp(x[0],y[0]))){let ac=0,fa=0,vistas=0;const ps=Z.pregs.filter(p=>p.tema==t);
  for(const p of ps){const x=h[p.id];if(x){ac+=x.aciertos;fa+=x.fallos;vistas++}}
  tabla.push({tema:t,bloque:b,n:ps.length,vistas,ac,fa,pct:ac+fa?Math.round(100*ac/(ac+fa)):null});const r=bl[b];r.n+=ps.length;r.vistas+=vistas;r.ac+=ac;r.fa+=fa}
 for(const r of Object.values(bl))r.pct=r.ac+r.fa?Math.round(100*r.ac/(r.ac+r.fa)):null;
 const ses=aSesiones(),dias=new Set(ses.map(s=>s.fecha.slice(0,10))),f=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
 let racha=0,d=new Date();if(!dias.has(f(d)))d=new Date(d-864e5);while(dias.has(f(d))){racha++;d=new Date(d-864e5)}
 const tot=ses.reduce((a,s)=>a+s.n,0),tac=ses.reduce((a,s)=>a+s.aciertos,0),ul=ses.slice(-5).map(s=>s.nota),hv=Object.values(h);
 return{por_tema:tabla,por_bloque:Object.values(bl),sesiones:ses,racha,pct_global:tot?Math.round(1000*tac/tot)/10:null,nota_media5:ul.length?+(ul.reduce((a,b)=>a+b,0)/ul.length).toFixed(2):null,dominadas:hv.filter(x=>x.ultimo=='acierto').length,falladas:hv.filter(x=>x.ultimo=='fallo').length}}
window.api=async(p,b)=>{await ready;const[ruta,qs]=p.split('?'),q=new URLSearchParams(qs||'');
 const fn={info:aInfo,stats:aStats,sesiones:aSesiones,sesion:()=>aSesion(+(q.get('i')??-1)),start:()=>aStart(b||{}),answer:()=>aAnswer(b||{}),finish:()=>aFinish(b||{})}[ruta];
 if(!fn)throw Err('No encontrado');return JSON.parse(JSON.stringify(await fn()))};
// ---------- Google Drive
const gsi=()=>window.google?.accounts?Promise.resolve():new Promise((ok,ko)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=ok;s.onerror=()=>ko(Err('Sin conexion'));document.head.appendChild(s)});
const D='https://www.googleapis.com/drive/v3/files';
const dapi=async(u,o={})=>{const r=await fetch(u,{...o,headers:{Authorization:'Bearer '+tok,...(o.headers||{})}});if(!r.ok)throw Err('Drive '+r.status);return o.raw?r:r.json()};
async function carpeta(){const r=await dapi(`${D}?q=${encodeURIComponent("name='QuizTopografia' and mimeType='application/vnd.google-apps.folder' and trashed=false")}&fields=files(id)`);
 return r.files[0]?.id||(await dapi(D,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'QuizTopografia',mimeType:'application/vnd.google-apps.folder'})})).id}
async function subir(fid,name,text,lst){const ex=lst.find(f=>f.name==name),fd=new FormData();fd.append('metadata',new Blob([JSON.stringify({name,...(ex?{}:{parents:[fid]})})],{type:'application/json'}));fd.append('file',new Blob([text],{type:'application/json'}));
 await dapi(`https://www.googleapis.com/upload/drive/v3/files${ex?'/'+ex.id:''}?uploadType=multipart`,{method:ex?'PATCH':'POST',body:fd})}
async function sync(){if(!tok){if(!Z.set.clientId)throw Err('Falta el ID de cliente de Google');await gsi();
  await new Promise((ok,ko)=>google.accounts.oauth2.initTokenClient({client_id:Z.set.clientId,scope:'https://www.googleapis.com/auth/drive.file',callback:r=>r.access_token?(tok=r.access_token,ok()):ko(Err(r.error||'Acceso denegado'))}).requestAccessToken())}
 try{const fid=await carpeta(),lst=(await dapi(`${D}?q=${encodeURIComponent(`'${fid}' in parents and trashed=false`)}&fields=files(id,name)&pageSize=1000`)).files,mio='hist-'+Z.set.dev+'.json';
  for(const f of lst){if(f.name==mio||Z.dirty[f.name])continue;const t=await(await dapi(`${D}/${f.id}?alt=media`,{raw:1})).text();
   if(f.name.startsWith('banco-'))Z.banco[f.name.slice(6)]=t;else if(f.name=='config.json')Z.config=JSON.parse(t);else if(/^hist-.*\.json$/.test(f.name))Z.otros[f.name]=JSON.parse(t)}
  for(const n of Object.keys(Z.dirty))await subir(fid,n,n=='config.json'?JSON.stringify(Z.config):Z.banco[n.slice(6)],lst);
  await subir(fid,mio,JSON.stringify(Z.mine),lst);Z.dirty={};await recargar();await guardar()}
 catch(e){if(/Drive 401/.test(e.message))tok=null;throw e}}
async function importar(files){const m=[];for(const f of files){const t=await f.text();let j;try{j=JSON.parse(t)}catch{m.push(f.name+': JSON no valido');continue}
 if(j&&!Array.isArray(j)&&(Array.isArray(j.sesiones)||(j.preguntas&&!Array.isArray(j.preguntas)))){const ids=new Set(Z.mine.sesiones.map(s=>s.id));
  for(const s of j.sesiones||[]){s.id=s.id||'old-'+s.fecha+'|'+s.tipo;if(!ids.has(s.id)){ids.add(s.id);Z.mine.sesiones.push(s)}}
  for(const[id,v]of Object.entries(j.preguntas||{}))Z.mine.base[id]=v;m.push(f.name+': historial importado')}
 else if(j&&j.bloques&&j.examen){Z.config=j;Z.dirty['config.json']=1;m.push(f.name+': configuracion')}
 else{Z.banco[f.name]=t;Z.dirty['banco-'+f.name]=1;m.push(f.name+': banco')}}
 await recargar();await guardar();return m.join('\n')}
// ---------- pantalla «Sincronizar» (usa las clases de tu index.html)
const inp='width:100%;padding:9px 12px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit';
window.vSync=()=>`<h1>Sincronizar</h1><p class="sub">Banco e historial compartidos entre tus dispositivos mediante Google Drive.</p>
<div class="grid g2"><div class="card"><h2>Google Drive</h2>
<p class="sub" style="margin-bottom:10px">Se guarda en la carpeta «QuizTopografia» de tu Drive. Cada dispositivo escribe solo su propio historial y lee el de los demás.</p>
<div class="kl" style="margin-bottom:4px">ID de cliente de Google</div>
<input style="${inp}" value="${esc(Z.set.clientId||'')}" placeholder="xxxx.apps.googleusercontent.com" onchange="QZ.cid(this.value)">
<div class="row mt"><button class="btn pri" onclick="QZ.sync()">Conectar y sincronizar</button></div>
<p class="sub mt" id="qzm" style="white-space:pre-wrap;margin-bottom:0">${esc(Z.msg||'')}</p></div>
<div class="card"><h2>Importar archivos</h2>
<p class="sub" style="margin-bottom:10px">Ficheros del banco (.json), config.json e historial.json de la versión de Windows. Puedes elegir varios a la vez.</p>
<input type="file" multiple accept=".json,application/json" onchange="QZ.imp(this.files)">
<p class="sub mt" style="margin-bottom:0">Banco local: ${Object.keys(Z.banco).length} archivos, ${Z.pregs.length} preguntas · Intentos: ${sesionesTodas().length} · Dispositivo: ${Z.set.dev}</p></div></div>`;
window.QZ={vacio:()=>!Z.pregs.length,cid:v=>{Z.set.clientId=v.trim();guardar()},
 async sync(){const m=document.getElementById('qzm');if(m)m.textContent='Sincronizando…';try{await sync();Z.msg=`Listo: ${Z.pregs.length} preguntas y ${sesionesTodas().length} intentos en total.`}catch(e){Z.msg='Error: '+e.message}window.go('sync')},
 async imp(files){Z.msg=(await importar(files))+'\nPulsa «Conectar y sincronizar» para subirlo a Drive.';window.go('sync')}};
// ---------- arranque
const ready=(async()=>{Z.set=await kget('set')||{dev:Math.random().toString(36).slice(2,8)};Z.banco=await kget('banco')||{};Z.config=await kget('config')||CFG0;
 Z.mine=await kget('mine')||{dev:Z.set.dev,sesiones:[],base:{}};Z.otros=await kget('otros')||{};Z.dirty=await kget('dirty')||{};Z.msg='';
 await guardar();await recargar()})();
window.QZ.ready=ready;
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
})();

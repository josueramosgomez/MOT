/* Modo «Estudiar» v2 — misiones cortas por parte:
   🎯 Calienta → 📖 Aprende (píldoras) → 🧠 Recuerda → 🃏 Tarjetas → 🏆 Reto
   + chuleta del tema, ⚡ relámpago, XP / racha / meta diaria, temporizador de foco.
   Formato de estudio v2 (y compatible con v1). Sincroniza por Drive a través de core.js. */
(()=>{
const DAY=864e5,MIN=6e4,Z=()=>QZ.Z,$$=s=>document.querySelector(s),cmp=(a,b)=>a<b?-1:a>b?1:0;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const hoy0=()=>new Date().setHours(0,0,0,0);
const fdia=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
let ST={v:'home'},FOCO=null;

/* ============ estilos ============ */
const css=document.createElement('style');css.textContent=`
.es{font-size:var(--fs,17px)}.es .card{margin-bottom:14px}
.es h1{font-size:26px}.es .sub{margin-bottom:16px}
.es mark{background:#fde68a;color:#422006;border-radius:3px;padding:0 3px}
body.dk .es mark{background:#a16207;color:#fff7d6}
.kt{color:#0f766e;background:#0f766e18;border-radius:5px;padding:0 5px;font-weight:700;white-space:nowrap}
body.dk .kt{color:#5eead4;background:#2dd4bf22}
.al{color:#dc2626;font-weight:800}body.dk .al{color:#f87171}
.mx{overflow-x:auto;overflow-y:hidden;padding:2px 0}.mx .katex-display{margin:.3em 0}
code.tx{font-size:.9em;background:var(--bg);border-radius:4px;padding:0 4px}
/* cajas de colores */
.bx{border-left:5px solid var(--c);background:color-mix(in srgb,var(--c) 9%,transparent);padding:12px 16px;border-radius:10px;margin:14px 0;line-height:1.6}
.bx>.bh{display:block;font-weight:800;color:var(--c);font-size:.8em;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.bx.paraque{--c:#7c3aed}.bx.idea{--c:#0d9488}.bx.truco{--c:#d97706}.bx.ojo{--c:#dc2626}.bx.recuerda{--c:#2563eb}
.bx.mnemo{--c:#db2777}.bx.amplia{--c:#64748b}.bx.ejemplo{--c:#16a34a}
body.dk .bx.paraque{--c:#a78bfa}body.dk .bx.recuerda{--c:#60a5fa}body.dk .bx.mnemo{--c:#f472b6}body.dk .bx.amplia{--c:#94a3b8}
.bx.mnemo{font-size:1.06em}.bx.mnemo b{color:#db2777}
p.t{margin:.75em 0;line-height:1.65}
/* fórmula */
.fm{border:2px solid #0d948855;border-radius:12px;padding:10px 14px;margin:14px 0;background:var(--card)}
.fm .fn{float:right;font-size:12px;font-weight:700;color:var(--mut);background:var(--bg);border-radius:6px;padding:1px 7px;margin-left:8px}
.fm .fl{font-size:.88em;color:var(--mut);border-top:1px dashed var(--bd);margin-top:6px;padding-top:6px}
.fm .fl b{color:var(--tx)}
/* figura */
.fg{display:grid;grid-template-columns:minmax(0,300px) 1fr;gap:16px;align-items:start;margin:14px 0}
.fg .im{background:#fff;border-radius:10px;border:1px solid var(--bd);padding:6px;cursor:zoom-in}.fg img{width:100%;display:block}
.fg .pc{font-size:12px;color:var(--mut);margin-top:4px}.fg .lx{line-height:1.6}
@media(max-width:700px){.fg{grid-template-columns:1fr}}
.zoom{position:fixed;inset:0;background:#000c;z-index:20;display:grid;place-items:center;padding:20px;cursor:zoom-out}.zoom img{max-width:100%;max-height:100%;background:#fff;border-radius:8px}
/* tablas y listas */
.es table.tb{margin:12px 0;font-size:.92em}.es table.tb th{font-size:.8em}.es table.tb td{padding:8px 10px;vertical-align:top}
.es table.tb tr:nth-child(even) td{background:var(--bg)}
.ps{counter-reset:p;list-style:none;padding:0;margin:12px 0}.ps li{counter-increment:p;position:relative;padding:8px 12px 8px 46px;margin:6px 0;border:1px solid var(--bd);border-radius:10px;background:var(--card)}
.ps li:before{content:counter(p);position:absolute;left:10px;top:7px;width:26px;height:26px;border-radius:50%;background:#0d9488;color:#fff;display:grid;place-items:center;font-weight:800;font-size:13px}
.vs{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.vs>div{border:2px solid var(--c);border-radius:12px;padding:10px 14px}
.vs>div>b:first-child{display:block;color:var(--c);margin-bottom:4px}@media(max-width:600px){.vs{grid-template-columns:1fr}}
/* mini comprobación */
.ck{border:2px dashed #7c3aed88;border-radius:12px;padding:12px 16px;margin:16px 0}.ck>.bh{font-weight:800;color:#7c3aed;font-size:.8em;text-transform:uppercase;letter-spacing:.05em}
.ck .row{margin-top:8px}.ck .btn{min-width:90px}.ck .btn.okk{background:var(--goodbg);border-color:var(--good);color:var(--good)}.ck .btn.koo{background:var(--badbg);border-color:var(--bad);color:var(--bad)}
.ck .rs{margin-top:8px;font-size:.92em}
.ck .btn:disabled{opacity:1;cursor:default}.ck .btn:disabled:not(.okk):not(.koo){opacity:.5}
.es table.tb th{text-transform:none;letter-spacing:0}
/* stepper y progreso */
.stp{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 16px}.stp button{border:1px solid var(--bd);background:var(--card);border-radius:999px;padding:5px 12px;font-size:13px;font-weight:700;color:var(--mut)}
.stp button.on{background:#7c3aed;border-color:#7c3aed;color:#fff}.stp button.ok{color:var(--good);border-color:var(--good)}
.dots{display:flex;gap:5px;margin:4px 0 12px}.dots i{flex:1;height:6px;border-radius:9px;background:var(--bd)}.dots i.on{background:#7c3aed}.dots i.ok{background:#a78bfa}
.eb{display:flex;height:8px;border-radius:4px;overflow:hidden;background:var(--bd);margin:6px 0 2px}.eb i{display:block}
.xpb{height:10px;border-radius:9px;background:var(--bd);overflow:hidden}.xpb i{display:block;height:100%;background:linear-gradient(90deg,#7c3aed,#db2777)}
/* teoría + práctica */
.tpr{display:flex;align-items:center;gap:8px;margin:8px 0 2px;font-size:.88em;flex-wrap:wrap}.tpr .bar{min-width:90px;height:9px}.tpr .sep{width:6px}.tpr small{color:var(--mut)}.ani{flex:none;display:block}
.tpr.big{font-size:1em}.tpr.big .bar{height:12px}
.modo{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:4px 0 14px}.modo button{padding:16px;border-radius:14px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 9%,var(--card));color:var(--tx);text-align:left;cursor:pointer}
.modo button b{display:block;font-size:1.08em;color:var(--c)}.modo button small{color:var(--mut)}@media(max-width:600px){.modo{grid-template-columns:1fr}}
.lnk{background:none;border:0;color:var(--mut);text-decoration:underline;cursor:pointer;font-size:13px;padding:4px}
/* planning */
.meses{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:18px}.meta{border:2px solid #7c3aed55;background:linear-gradient(135deg,#7c3aed0d,#14b8a60d)}.meta input[type=date]{font-size:16px;padding:6px 8px}.chips{display:flex;gap:6px;flex-wrap:wrap}.adel{margin-top:8px}.adel summary{cursor:pointer;padding:6px 0}.mes h3{margin:0 0 8px;font-size:15px}.mes h3::first-letter{text-transform:uppercase}
.cal{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.cal .dh{font-size:11px;font-weight:800;color:var(--mut);text-align:center}
.cd{min-height:48px;border-radius:8px;border:1px solid var(--bd);background:var(--card);padding:3px;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;color:var(--tx);font:inherit}
.cd b{font-size:13px}.cd small{font-size:10px;line-height:1.1;color:var(--mut)}.cd small.fe{color:#dc2626;font-weight:700}
.cd.on{background:#7c3aed14;border-color:#7c3aed88}.cd.off{background:var(--bg);border-style:dashed}.cd.fu{opacity:.35;cursor:default}.cd.hoy{outline:2px solid #f59e0b;outline-offset:1px}
/* home */
.hero2{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:14px}
.hero2 .card{margin:0;padding:14px 16px}.hero2 .big2{font-size:28px;font-weight:800;line-height:1.1}
.mis li{list-style:none;display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--bd)}.mis{padding:0;margin:0}
.mis li .st{width:26px;height:26px;border-radius:50%;border:2px solid var(--bd);display:grid;place-items:center;flex:none;font-weight:800}
.mis li.ok .st{background:var(--good);border-color:var(--good);color:#fff}.mis li.ok .tx2{text-decoration:line-through;color:var(--mut)}
.pd{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;font-size:11px;font-weight:800;margin-right:3px;border:2px solid var(--bd);color:var(--mut)}
.pd.ok{background:var(--good);border-color:var(--good);color:#fff}.pd.mid{border-color:#d97706;color:#d97706}
/* ruta del tema */
.ruta{position:relative;padding-left:34px}.ruta:before{content:'';position:absolute;left:14px;top:10px;bottom:10px;width:3px;background:var(--bd);border-radius:3px}
.ruta .card{position:relative}.ruta .nd{position:absolute;left:-31px;top:18px;width:28px;height:28px;border-radius:50%;background:var(--card);border:3px solid var(--bd);display:grid;place-items:center;font-weight:800;font-size:13px}
.ruta .nd.ok{background:var(--good);border-color:var(--good);color:#fff}.ruta .nd.mid{border-color:#d97706;color:#d97706}
.star{color:#f59e0b;font-weight:800}
.frase{font-size:1.15em;font-weight:700;line-height:1.45;border-left:5px solid #7c3aed;padding:6px 14px;margin:8px 0 14px}
/* tarjetas */
.ec{min-height:180px;font-size:1.12em;line-height:1.6;padding:24px 22px}.ec hr{border:0;border-top:1px dashed var(--bd);margin:16px 0}
.cz{background:#d9770622;color:#b45309;border-radius:4px;padding:0 6px;font-weight:700}.cz2{color:#0f766e;background:#0f766e1c;border-radius:4px;padding:0 4px;font-weight:800}
.ty{display:inline-block;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;border-radius:6px;padding:2px 8px;background:var(--bg);color:var(--mut);margin-bottom:10px}
.gr{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.gr button{padding:12px 2px;font-size:14px;line-height:1.25}
.es textarea{width:100%;min-height:150px;padding:10px 12px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit}
.es input[type=date],.es input[type=number],.es select{padding:7px 9px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit}
.cl li{list-style:none;display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--bd)}.cl{padding:0}
.cl li .tg{display:flex;gap:4px;flex:none}.cl li .tg button{width:38px;height:32px;border-radius:8px;border:1px solid var(--bd);background:var(--card);font-weight:800}
.cl li .tg button.y{background:var(--good);color:#fff;border-color:var(--good)}.cl li .tg button.n{background:var(--bad);color:#fff;border-color:var(--bad)}
.bigbtn{width:100%;padding:15px;font-size:1.02em}
/* relámpago */
.rel{font-size:1.25em;font-weight:700;line-height:1.5;min-height:140px;display:grid;place-items:center;text-align:center;padding:24px}
.rel.fl-ok{animation:fok .45s}.rel.fl-ko{animation:fko .45s}
@keyframes fok{0%{background:var(--goodbg)}100%{background:var(--card)}}@keyframes fko{0%{background:var(--badbg)}100%{background:var(--card)}}
.vfb{display:grid;grid-template-columns:1fr 1fr;gap:10px}.vfb button{padding:18px;font-size:20px;font-weight:800;border-radius:14px}
/* celebración */
.conf{position:fixed;inset:0;pointer-events:none;z-index:30;overflow:hidden}.conf i{position:absolute;top:-40px;font-style:normal;font-size:26px;animation:cae linear forwards}
@keyframes cae{to{transform:translateY(110vh) rotate(540deg)}}
.foco{position:fixed;right:16px;top:14px;z-index:15;background:#7c3aed;color:#fff;border-radius:999px;padding:6px 14px;font-weight:800;box-shadow:var(--sh);cursor:pointer;font-variant-numeric:tabular-nums}
.foco.des{background:#16a34a}@media(max-width:980px){.foco{top:auto;bottom:calc(76px + env(safe-area-inset-bottom))}}
.pill{display:inline-block;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;background:var(--bg);color:var(--mut);margin:0 4px 4px 0}
.nv{display:inline-block;vertical-align:middle;border-radius:999px;padding:1px 9px;font-size:12px;font-weight:800;margin:0 6px 2px 0;white-space:nowrap;letter-spacing:0;text-transform:none}
.nv.memoria{background:#f59e0b2e;color:#b45309;border:1px solid #f59e0b88}.nv.reconocer{background:#2563eb1c;color:#1d4ed8;border:1px solid #2563eb66}.nv.idea{background:#64748b1c;color:#475569;border:1px solid #64748b55}
body.dk .nv.memoria{color:#fcd34d}body.dk .nv.reconocer{color:#93c5fd}body.dk .nv.idea{color:#cbd5e1}
.fm.memoria{border-color:#f59e0bbb;box-shadow:0 0 0 3px #f59e0b1a}.fm.idea{border-style:dashed;border-color:#64748b66}
.cl li .nv{margin-top:2px}
.pill.vi{background:#7c3aed1f;color:#7c3aed}.pill.am{background:#f59e0b22;color:#b45309}.pill.gn{background:var(--goodbg);color:var(--good)}
`;
document.head.appendChild(css);

/* ============ KaTeX (carga perezosa, funciona sin conexión gracias al service worker) ============ */
let kx=0;const MAC={'\\sen':'\\operatorname{sen}','\\tg':'\\operatorname{tg}','\\arctg':'\\operatorname{arctg}','\\cotg':'\\operatorname{cotg}'};
function katexOn(){if(window.katex||kx)return;kx=1;const l=document.createElement('link');l.rel='stylesheet';l.href='katex/katex.min.css';document.head.appendChild(l);
 const s=document.createElement('script');s.src='katex/katex.min.js';s.onload=()=>{if(typeof S!=='undefined'&&S.view==='estudio'&&typeof render=='function')render()};document.head.appendChild(s)}
const mat=(tex,disp)=>{if(window.katex){try{return(disp?'<div class=mx>':'')+katex.renderToString(tex,{displayMode:disp,throwOnError:false,strict:false,macros:{...MAC}})+(disp?'</div>':'')}catch{}}
 return disp?`<div class=mx><code class=tx>${esc(tex)}</code></div>`:`<code class=tx>${esc(tex)}</code>`};

/* ============ texto enriquecido ============
   **negrita**  ==subrayado fosforito==  [[concepto clave]]  !!dato o trampa en rojo!!  $fórmula$  $$fórmula aparte$$ */
const marks=t=>esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/==(.+?)==/g,'<mark>$1</mark>').replace(/\[\[(.+?)\]\]/g,'<span class=kt>$1</span>').replace(/!!(.+?)!!/g,'<span class=al>$1</span>').replace(/\n/g,'<br>');
function rt(s){const M=[];s=String(s??'').replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g,(_,a,b)=>{M.push(mat(a??b,a!=null));return'\u0001'+(M.length-1)+'\u0002'});
 return marks(s).replace(/\u0001(\d+)\u0002/g,(_,i)=>M[i])}
const cloze=(s,show)=>String(s??'').split(/\{\{(.+?)\}\}/).map((x,i)=>i%2?(show?`<span class=cz2>${rt(x)}</span>`:'<span class=cz>[ … ]</span>'):rt(x)).join('');
/* ============ niveles de fórmula: ⭐ memoria · 👁 reconocer · 💡 idea ============ */
const nvN=v=>{v=String(v||'').toLowerCase();return v.includes('⭐')||v.startsWith('mem')?'memoria':v.startsWith('rec')?'reconocer':v.startsWith('idea')?'idea':''};
const NV={memoria:'⭐ De memoria',reconocer:'👁 Reconocer',idea:'💡 Solo la idea'},NVR={memoria:0,reconocer:1,idea:2,'':1};
const nvB=v=>{v=nvN(v);return v?`<span class="nv ${v}" title="${v=='memoria'?'Hay que saberla escribir o reconocer al instante':v=='reconocer'?'Basta con saber su forma y comprobarla con un caso límite':'Basta con saber qué hace y de qué depende'}">${NV[v]}</span>`:''};
const clv=c=>c&&typeof c=='object'?{x:c.x??c.t??'',nivel:nvN(c.nivel)}:{x:c,nivel:''};
const FMEM=.8;/* las tarjetas ⭐ vuelven antes: intervalos al 80 % */
const esMem=c=>nvN(c?.nivel)=='memoria';
const pregMem=q=>/Nivel:\s*⭐/.test(q?.explicacion||'');
const plain=s=>String(s??'').replace(/\$\$?([^$]+)\$\$?/g,'$1').replace(/\*\*|==|\[\[|\]\]|!!|\{\{|\}\}/g,'');

/* ============ contenido ============ */
const CAJA={paraque:'🎯 Para qué',idea:'💡 La idea',truco:'🪄 Truco',ojo:'⚠️ Ojo en el examen',recuerda:'📌 Para recordar',mnemo:'🧠 Regla para memorizar',amplia:'➕ Ampliación · ha salido en el examen y no viene en los apuntes',ejemplo:'🔢 Ejemplo con números'};
let CACHE={sig:'',T:[],ign:new Set(),NC:{}};
const esV2=j=>(j.partes||[]).some(p=>Array.isArray(p.pildoras));
function temario(){const est=Z().est||{},sig=Object.entries(est).map(([k,v])=>k+v.length).join('|');if(sig===CACHE.sig)return CACHE.T;const T={};
 const js=Object.entries(est).map(([f,t])=>{try{return[f,JSON.parse(t)]}catch{return null}}).filter(x=>x&&Array.isArray(x[1].partes));
 const nuevos=new Set(js.filter(([f,j])=>esV2(j)).map(([f,j])=>String(j.tema||f).toUpperCase())),ign=new Set();
 for(const[f,j]of js){if(!esV2(j)&&nuevos.has(String(j.tema||f).toUpperCase())){ign.add(f);continue}
  const k=String(j.tema||f).toUpperCase(),o=T[k]??={tema:k,titulo:j.titulo||'',frase:j.frase||'',esfuerzo:j.esfuerzo||'',partes:[]};
  for(const c of['titulo','frase','esfuerzo'])if(j[c]&&!o[c])o[c]=j[c];
  j.partes.forEach((p,pi)=>{const pid=String(p.id??pi+1).replace(/[^\w.-]/g,'_');let pil=p.pildoras;
   if(!Array.isArray(pil)){const b=[];[].concat(p.texto||[]).forEach(x=>b.push({t:'p',x}));
    if(p.entender)b.push({t:'caja',tipo:'idea',x:p.entender});if(p.mnemo)b.push({t:'caja',tipo:'mnemo',x:p.mnemo});pil=[{titulo:p.titulo||'',bloques:b}]}
   o.partes.push({id:pid,tema:k,titulo:p.titulo||'Parte '+(pi+1),pagina:[].concat(p.pagina??[]),examen:+p.examen||0,estrella:!!p.estrella,paraque:p.paraque||'',
    gancho:p.gancho||null,pildoras:pil,claves:(p.claves||[]).map(clv),reto:p.reto||[],
    cards:(p.tarjetas||[]).map((x,i)=>({...x,nivel:nvN(x.nivel),cid:`${k}:${pid}:${x.id??i}`,tema:k,parte:pid})).filter(c=>c.c||(c.q&&c.a)||c.vf)})})}
 const NC={};for(const t of Object.values(T))for(const p of t.partes)for(const c of p.cards)if(c.nivel)NC[c.cid]=c.nivel;
 CACHE={sig,T:Object.values(T).sort((a,b)=>cmp(a.tema,b.tema)),ign,NC};return CACHE.T}
const tema=t=>temario().find(x=>x.tema==t),part=(t,p)=>tema(t)?.partes.find(x=>x.id==p);

/* ============ configuración, registro y repetición espaciada ============ */
const revs=()=>[Z().rev,...Object.values(Z().revOtros||{})];
const cfgs=()=>revs().map(r=>r.cfg).filter(x=>x&&x.ts).sort((a,b)=>b.ts-a.ts)[0]||{};
const exam=()=>{const c=cfgs();return c.examen?new Date(c.examen+'T23:59:59').getTime():0};
const notas=()=>{const n={};revs().forEach(r=>{for(const[k,v]of Object.entries(r.notas||{}))if(!n[k]||v.t>n[k].t)n[k]=v});return n};
const logs=()=>{const l=[];revs().forEach(r=>l.push(...(r.log||[])));return l.sort((a,b)=>a.t-b.t)};
const apunta=e=>{Z().rev.log.push({t:Date.now(),...e});QZ.guardar()};
const nuevo=t=>({ease:2.5,ivl:0,due:0,reps:0,lap:0,first:t});
function paso(s,t,g,f=1){const ex=exam();
 if(!s.reps){if(g==1)s.due=t+MIN;else if(g==2)s.due=t+6*MIN;else{s.reps=1;s.ivl=g==3?1:f<1?3:4;s.due=t+s.ivl*DAY}}
 else if(g==1){s.lap++;s.ease=Math.max(1.3,s.ease-.2);s.ivl=1;s.due=t+10*MIN}
 else{const k=g==2?1.2:g==3?s.ease:s.ease*1.3;if(g==2)s.ease=Math.max(1.3,s.ease-.15);if(g==4)s.ease+=.15;s.ivl=Math.max(s.ivl+1,Math.round(s.ivl*k*f));s.due=t+s.ivl*DAY}
 if(ex>t&&s.reps){const mx=Math.max(1,Math.floor((ex-t)/DAY/2));if(s.ivl>mx){s.ivl=mx;s.due=t+mx*DAY}}return s}
/* todo el estado se reconstruye desde el registro (así se fusionan los dispositivos sin conflictos) */
const fac=cid=>(temario(),CACHE.NC[cid]=='memoria'?FMEM:1);
let EC={k:'',v:null};
function estado(tmax){const L0=logs(),ck=(tmax||0)+'|'+L0.length+'|'+(L0.at(-1)?.t||0);if(EC.k==ck)return EC.v;const E={},act={},fin={},reto={},xpd={},pl={},plx={},leido={},borra={},dov={},vid={};let xp=0,best=0;const h0=hoy0(),dias=new Set();
 for(const e of L0){if(tmax&&e.t>=tmax)continue;const d=fdia(e.t);let g=0;
  if(e.c){E[e.c]=paso(E[e.c]??nuevo(e.t),e.t,e.g,fac(e.c));E[e.c].g=e.g;g=e.g>1?3:1}
  else if(e.pl){(pl[e.pl]??={})[e.k]=e.t;const s=(plx[e.pl]??=new Set());if(!s.has(e.k)){s.add(e.k);g=2}}
  else if(e.leido){leido[e.leido]=e.t}else if(e.borra){borra[e.borra]=e.t}
  else if(e.dia){dov[e.dia]=!!e.on}else if(e.vid){vid[e.vid]=!!e.ok;if(e.ok)g=5}
  else if(e.a){act[e.a]=act[e.a]||e.t}
  else if(e.fin){if(!fin[e.fin])g=30;fin[e.fin]=e.t}
  else if(e.x){(reto[e.x]??={})[e.q]=e.ok;g=e.ok?10:2}
  else if(e.rel!=null){g=e.rel;best=Math.max(best,e.rel)}
  if(g){xp+=g;xpd[d]=(xpd[d]||0)+g;dias.add(d)}}
 for(const h of[Z().mine,...Object.values(Z().otros||{})])for(const s of h?.sesiones||[])if(s.fecha)dias.add(fdia(new Date(s.fecha)));
 let racha=0,dd=Date.now();if(!dias.has(fdia(dd)))dd-=DAY;while(dias.has(fdia(dd))){racha++;dd-=DAY}
 EC={k:ck,v:{E,act,fin,reto,xp,hoy:xpd[fdia(Date.now())]||0,racha,best,h0,pl,leido,borra,dov,vid}};return EC.v}
const nivel=xp=>{let n=1,need=60,acc=0;while(xp>=acc+need){acc+=need;n++;need=Math.round(need*1.25)}return{n,de:xp-acc,need}};
const lab=(s,t)=>{const d=s.due-t;return d<36e5?Math.max(1,Math.round(d/MIN))+' min':d<DAY?Math.round(d/36e5)+' h':Math.round(d/DAY)+' d'};
const hint=(c,g)=>{const t=Date.now(),e=ST.E[c.cid];return lab(paso(e?{...e}:nuevo(t),t,g,esMem(c)?FMEM:1),t)};
const niv=s=>!s?0:s.ivl>=21?2:1;
const bar=(cs,E)=>{const n=[0,0,0];cs.forEach(c=>n[niv(E[c.cid])]++);const t=cs.length||1;
 return`<div class=eb><i style="width:${100*n[2]/t}%;background:#16a34a"></i><i style="width:${100*n[1]/t}%;background:#f59e0b"></i></div><small style="color:var(--mut)">${n[2]} dominadas · ${n[1]} aprendiendo · ${n[0]} nuevas</small>`};
/* TEORÍA (Calienta + Aprende): se gana leyendo las píldoras o marcando como leído el tema o la parte. «Borrar avance» la pone a cero.
   PRÁCTICA (Recuerda + Tarjetas + Reto): una parte cuenta solo al completarla entera; el color sale de los resultados. */
const tk=P=>P.tema+':'+P.id;
const corte=(P,S0)=>Math.max(S0.borra[P.tema]||0,S0.borra[tk(P)]||0);
const marcada=(P,S0)=>Math.max(S0.leido[P.tema]||0,S0.leido[tk(P)]||0)>corte(P,S0);
function teoP(P,S0){const k=tk(P),b=corte(P,S0);if(marcada(P,S0))return 1;
 return Math.min(1,Object.values(S0.pl[k]||{}).filter(t=>t>b).length/(P.pildoras.length||1))}
const visto=(P,S0,i)=>(S0.pl[tk(P)]?.[i]||0)>corte(P,S0);
function pracP(P,S0){const k=tk(P),rv=Object.values(S0.reto[k]||{}),cs=P.cards.filter(c=>S0.E[c.cid]),good=cs.filter(c=>S0.E[c.cid].g>=3).length;
 return{done:S0.fin[k]?1:0,ok:good+rv.filter(Boolean).length,n:cs.length+rv.length}}
function resT(t,S0){let te=0,pr=0,ok=0,n=0;for(const p of t.partes){te+=teoP(p,S0);const x=pracP(p,S0);pr+=x.done;ok+=x.ok;n+=x.n}const N=t.partes.length||1;return{teo:te/N,prac:pr/N,cal:n?ok/n:null,ok,n}}
/* aro que se llena en sentido horario; gris sin resultados, de rojo a verde según el % de aciertos */
const colCal=c=>c==null?'#94a3b8':`hsl(${Math.round(Math.max(0,Math.min(1,(c-.4)/.5))*125)},72%,42%)`;
function anillo(p,cal,sz=30,tit=''){const L=2*Math.PI*14,c=colCal(cal);p=Math.max(0,Math.min(1,p||0));
 return`<svg class=ani width=${sz} height=${sz} viewBox="0 0 36 36" role=img aria-label="${esc(tit)}"><title>${esc(tit)}</title><circle cx=18 cy=18 r=14 fill=none stroke="var(--bd)" stroke-width=5 />${p>0?`<circle cx=18 cy=18 r=14 fill=none stroke="${c}" stroke-width=5 ${p<1?'stroke-linecap=round':''} stroke-dasharray="${(L*p).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 18 18)"/>`:''}</svg>`}
const titAni=r=>`Práctica completada: ${Math.round(100*r.prac)}%${r.cal==null?'':` · aciertos ${Math.round(100*r.cal)}%`}`;
const linea=(r,big)=>`<div class="tpr${big?' big':''}"><span>📖 Teoría</span><div class=bar style="flex:1"><i style="width:${100*r.teo}%;background:#7c3aed"></i></div><b>${Math.round(100*r.teo)}%</b>
 <span class=sep></span>${anillo(r.prac,r.cal,big?34:28,titAni(r))}<small>🧠 Práctica ${Math.round(100*r.prac)}%${r.cal==null?'':` · <span style="color:${colCal(r.cal)};font-weight:700">${Math.round(100*r.cal)}% aciertos</span>`}</small></div>`;
const estP=(p,S0)=>{const t=teoP(p,S0);return t>=1?'ok':t>0||S0.act[tk(p)]?'mid':''};
const save=()=>QZ.guardar(),R=()=>{window.go('estudio')},RR=()=>{if(typeof render=='function')render()};
function pendientes(S0){const cs=temario().flatMap(t=>t.partes.flatMap(p=>p.cards)),now=Date.now(),lim=cfgs().nuevas??10,
 nh=Object.values(S0.E).filter(s=>s.first>=S0.h0).length,due=cs.filter(c=>S0.E[c.cid]&&S0.E[c.cid].due<=now),
 nw=cs.filter(c=>!S0.E[c.cid]&&S0.act[c.tema+':'+c.parte]).sort((a,b)=>esMem(b)-esMem(a)).slice(0,Math.max(0,lim-nh));return{due,nw}}
function siguiente(S0){for(const t of temario())for(const p of t.partes)if(teoP(p,S0)<1)return p;return null}
function sigPra(S0){for(const t of temario())for(const p of t.partes)if(teoP(p,S0)>=1&&!S0.fin[tk(p)])return p;return null}

/* ============ efectos ============ */
function confeti(){const d=document.createElement('div');d.className='conf';const em=['🎉','⭐','✨','🧠','🏆','💜','📐'];
 for(let i=0;i<40;i++){const e=document.createElement('i');e.textContent=em[i%em.length];e.style.left=Math.random()*100+'%';e.style.animationDuration=1.6+Math.random()*1.6+'s';e.style.animationDelay=Math.random()*.5+'s';d.appendChild(e)}
 document.body.appendChild(d);setTimeout(()=>d.remove(),3800)}
const tst=t=>{if(typeof toast=='function')toast(t)};
function focoTick(){const el=$$('#foco');if(!FOCO){el&&el.remove();return}let e=el;if(!e){e=document.createElement('div');e.id='foco';e.className='foco';e.onclick=()=>{if(confirm('¿Parar el temporizador?')){FOCO=null;focoTick()}};document.body.appendChild(e)}
 const r=Math.max(0,FOCO.fin-Date.now()),m=Math.floor(r/MIN),s=Math.floor(r%MIN/1e3);e.className='foco'+(FOCO.des?' des':'');e.textContent=(FOCO.des?'☕ Descanso ':'🍅 Foco ')+m+':'+String(s).padStart(2,'0');
 if(r<=0){if(!FOCO.des){FOCO={des:1,fin:Date.now()+5*MIN};tst('¡Bloque de foco terminado! Descansa 5 minutos: levántate, bebe agua.');navigator.vibrate?.(300)}else{FOCO=null;tst('Descanso terminado. ¿Otro bloque?');navigator.vibrate?.(200)}}
 if(FOCO)setTimeout(focoTick,1000);else e.remove()}

/* ============ bloques de contenido ============ */
function bloque(b,i){const x=b.x;switch(b.t){
 case'p':return`<p class=t>${rt(x)}</p>`;
 case'caja':return`<div class="bx ${esc(b.tipo||'idea')}"><span class=bh>${esc(b.titulo||CAJA[b.tipo]||'')}</span>${rt(x)}</div>`;
 case'formula':return`<div class="fm ${nvN(b.nivel)}">${b.n?`<span class=fn>(${esc(b.n)})</span>`:''}${nvB(b.nivel)}${b.nombre?`<b>${rt(b.nombre)}</b>`:''}${mat(b.tex,true)}${b.lee?`<div class=fl><b>Cómo leerla:</b> ${rt(b.lee)}</div>`:''}</div>`;
 case'fig':return`<div class=fg><div><div class=im onclick="EST.zoom(this)">${String(b.img||'').startsWith('data:')||/\.(png|jpe?g|webp|svg)$/i.test(b.img||'')?`<img src="${esc(b.img)}" alt="${esc(plain(b.pie))}">`:`<div style="padding:30px 10px;color:#666;text-align:center">${esc(b.img||'Figura')}</div>`}</div><div class=pc>${rt(b.pie||'')}</div></div><div class=lx>${rt(b.lee||'')}</div></div>`;
 case'tabla':return`<div style="overflow-x:auto"><table class=tb><thead><tr>${(b.cab||[]).map(c=>`<th>${rt(c)}</th>`).join('')}</tr></thead><tbody>${(b.filas||[]).map(f=>`<tr>${f.map(c=>`<td>${rt(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 case'lista':return`<ul>${(b.items||[]).map(c=>`<li style="margin:6px 0">${rt(c)}</li>`).join('')}</ul>`;
 case'pasos':return`<ol class=ps>${(b.items||[]).map(c=>`<li>${rt(c)}</li>`).join('')}</ol>`;
 case'vs':return`<div class=vs>${(b.cols||[]).map((c,j)=>`<div style="--c:${['#2563eb','#db2777','#16a34a'][j%3]}"><b>${rt(c.t)}</b>${rt(c.x)}</div>`).join('')}</div>`;
 case'check':return check(b,'b'+i);
 default:return x?`<p class=t>${rt(x)}</p>`:''}}
/* mini-comprobación interactiva: V/F u opciones */
function check(b,key){const r=ST.ck?.[key],vf=b.vf!=null,ops=vf?['Verdadero','Falso']:b.ops||[],cor=vf?(b.ok?0:1):(typeof b.cor=='string'?'ABCD'.indexOf(b.cor):+b.cor||0);
 return`<div class=ck><span class=bh>✋ Comprueba en 5 segundos</span><div style="margin-top:4px;font-weight:600">${rt(vf?b.vf:b.q)}</div>
 <div class=row>${ops.map((o,j)=>`<button class="btn ${r==null?'':j==cor?'okk':j==r?'koo':''}" ${r==null?`onclick="EST.chk('${key}',${j})"`:'disabled'}>${rt(o)}</button>`).join('')}</div>
 ${r!=null?`<div class=rs><b class="${r==cor?'good':'bad'}">${r==cor?'¡Bien!':'Casi.'}</b> ${rt(b.por||'')}</div>`:''}</div>`}

/* ============ vistas ============ */
function home(){katexOn();const T=temario(),S0=estado(),{due,nw}=pendientes(S0),pend=due.length+nw.length,c=cfgs(),ex=exam(),now=Date.now(),L=nivel(S0.xp),meta=c.meta||60,
 sig=siguiente(S0),cs=T.flatMap(t=>t.partes.flatMap(p=>p.cards)),relHoy=logs().some(e=>e.rel!=null&&e.t>=S0.h0),
 parteHoy=logs().some(e=>(e.pl||e.leido)&&e.t>=S0.h0),praHoy=logs().some(e=>(e.fin||e.x)&&e.t>=S0.h0),sp2=sigPra(S0),pm=Math.min(1,S0.hoy/meta);
 const ring=`<svg viewBox="0 0 36 36" width="54" height="54" style="float:right"><circle cx=18 cy=18 r=15.5 fill=none stroke="var(--bd)" stroke-width=4 /><circle cx=18 cy=18 r=15.5 fill=none stroke="${pm>=1?'#16a34a':'#7c3aed'}" stroke-width=4 stroke-linecap=round stroke-dasharray="${97.4*pm} 97.4" transform="rotate(-90 18 18)"/></svg>`;
 return`<div class=es><h1>Estudiar</h1><p class=sub>📖 <b>Teoría</b> para leer y entender · 🧠 <b>Práctica interactiva</b> para memorizar y comprobarlo. Poco cada día, sin saltarse días.</p>
<div class=hero2>
 <div class=card><small>Examen</small><div class=big2>${ex>now?Math.ceil((ex-now)/DAY)+' días':'—'}</div><small style="color:var(--mut)">${ex>now?'los repasos se ajustan a la fecha':'pon la fecha en Ajustes ↓'}</small></div>
 <div class=card><small>Racha</small><div class=big2>🔥 ${S0.racha}</div><small style="color:var(--mut)">${S0.racha?'días seguidos':'empieza hoy'}</small></div>
 <div class=card>${ring}<small>Meta de hoy</small><div class=big2>${S0.hoy}<small style="font-size:14px;color:var(--mut)"> / ${meta} XP</small></div><small style="color:var(--mut)">${pm>=1?'¡cumplida! 🎉':'≈ '+Math.max(1,Math.round((meta-S0.hoy)/6))+' min más'}</small></div>
 <div class=card><small>Nivel ${L.n}</small><div class=big2>${S0.xp} XP</div><div class=xpb style="margin-top:6px"><i style="width:${100*L.de/L.need}%"></i></div><small style="color:var(--mut)">${L.need-L.de} XP para el nivel ${L.n+1}</small></div>
</div>
<div class=card><div class=row><h2 style="margin:0">🗺️ Misión de hoy</h2><span class=sp></span><button class=btn onclick="EST.plan()">📅 Ver calendario</button></div>
<div style="margin:12px 0 16px">${planHoy()}</div><div class=row style="margin-bottom:4px"><b>🧠 Además, para fijarlo</b></div><ul class=mis>
 <li class="${pend?'':'ok'}"><span class=st>${pend?1:'✓'}</span><span class=tx2 style="flex:1"><b>Repasa tus tarjetas</b><br><small style="color:var(--mut)">${pend?`${due.length} repasos + ${nw.length} nuevas · ~${Math.max(1,Math.round(pend/5))} min`:'nada pendiente ahora mismo'}</small></span>${pend?`<button class="btn pri" onclick="EST.cola(15)">Repasar</button>`:''}</li>
 <li class="${parteHoy?'ok':''}"><span class=st>${parteHoy?'✓':2}</span><span class=tx2 style="flex:1"><b>${sig?`📖 Teoría: ${esc(sig.tema)} · ${esc(sig.titulo)}`:'Toda la teoría leída'}</b><br><small style="color:var(--mut)">${sig?`${sig.pildoras.length} píldoras${sig.estrella?' · <span class=star>★ muy preguntado</span>':''}`:'¡bien! sigue con la práctica'}</small></span>${sig?`<button class="btn ${pend?'':'pri'}" onclick="EST.parte('${sig.tema}','${sig.id}','teo')">Leer</button>`:''}</li>
 ${sp2?`<li class="${praHoy?'ok':''}"><span class=st>${praHoy?'✓':'+'}</span><span class=tx2 style="flex:1"><b>🧠 Práctica: ${esc(sp2.tema)} · ${esc(sp2.titulo)}</b><br><small style="color:var(--mut)">recuerda, tarjetas y reto · ya has leído su teoría</small></span><button class=btn onclick="EST.parte('${sp2.tema}','${sp2.id}','pra')">Practicar</button></li>`:''}
 <li class="${relHoy?'ok':''}"><span class=st>${relHoy?'✓':3}</span><span class=tx2 style="flex:1"><b>⚡ Relámpago de 60 segundos</b><br><small style="color:var(--mut)">verdadero o falso a toda velocidad${S0.best?` · récord ${S0.best}`:''}</small></span><button class=btn onclick="EST.relampago()">Jugar</button></li>
</ul></div>
${T.length?T.map(t=>{const r=resT(t,S0);
 return`<div class=card><div class=row><b style="font-size:1.05em">${esc(t.tema)}</b><span>${esc(t.titulo)}</span><span class=sp></span><span class="pill ${r.teo>=1?'gn':'vi'}">${t.partes.filter(p=>teoP(p,S0)>=1).length}/${t.partes.length} partes leídas</span></div>
 <div style="margin:10px 0 2px">${t.partes.map((p,i)=>`<span class="pd ${estP(p,S0)}" title="${esc(p.titulo)}">${estP(p,S0)=='ok'?'✓':i+1}</span>`).join('')}</div>${linea(r)}
 <div class=row style="margin-top:10px"><button class="btn pri" onclick="EST.tema('${t.tema}')">Abrir tema</button><button class=btn onclick="EST.chuleta('${t.tema}')">📋 Chuleta</button><button class=btn onclick="EST.todo('${t.tema}')">🔁 Repasar todo</button></div></div>`}).join('')
 :'<div class=card><b>Aún no hay temas de estudio.</b><p class=sub>Importa los archivos de estudio (.json) desde «Sincronizar».</p></div>'}
<details class=card><summary style="cursor:pointer;font-weight:700">⚙️ Ajustes</summary><div class=row style="margin-top:12px;gap:14px">
 <label>Fecha de examen <input type=date id=ex value="${esc(c.examen||'')}" onchange="EST.cfg()"></label>
 <label>Tarjetas nuevas al día <input type=number id=nu min=0 max=60 value="${c.nuevas??10}" style="width:70px" onchange="EST.cfg()"></label>
 <label>Meta diaria (XP) <input type=number id=me min=10 max=500 step=10 value="${meta}" style="width:80px" onchange="EST.cfg()"></label>
 <label>Letra <select id=fs onchange="EST.cfg()">${[['15','Pequeña'],['17','Normal'],['19','Grande'],['21','Muy grande']].map(([v,n])=>`<option value=${v} ${String(c.fs||17)==v?'selected':''}>${n}</option>`).join('')}</select></label></div>
 <p class=sub style="margin:10px 0 0">${cs.length} tarjetas en total. Con fecha de examen, ningún repaso se programa más allá de la mitad del tiempo que queda.</p>
 ${archivos()}
 <div class=row style="margin-top:8px"><button class=btn onclick="EST.foco(15)">🍅 Bloque de foco 15 min</button><button class=btn onclick="EST.foco(25)">🍅 25 min</button></div></details></div>`}

function vTema(){katexOn();const t=tema(ST.t);if(!t)return home();const S0=estado(),tot=t.partes.reduce((a,p)=>a+p.examen,0);
 return`<div class=es><p><button class=btn onclick="EST.home()">◀ Estudiar</button></p><h1>${esc(t.tema)} · ${esc(t.titulo)}</h1>
 ${t.frase?`<div class=frase>${rt(t.frase)}</div>`:''}${t.esfuerzo?`<div class="bx truco"><span class=bh>🎯 Dónde poner el esfuerzo</span>${rt(t.esfuerzo)}</div>`:''}
 <div class=card>${linea(resT(t,S0),1)}
  <div class=modo style="margin-top:14px"><button style="--c:#7c3aed" onclick="EST.teo('${t.tema}')"><b>📖 Teoría</b><small>Calienta y aprende, píldora a píldora. Cuenta solo con leerla.</small></button>
  <button style="--c:#0d9488" onclick="EST.pra('${t.tema}')"><b>🧠 Práctica interactiva</b><small>Recuerda, tarjetas y reto. Cada parte cuenta al completarla entera.</small></button></div>
  <div class=row>${resT(t,S0).teo<1?`<button class=btn onclick="EST.leido('${t.tema}')">✓ Marcar tema como leído</button>`:''}${resT(t,S0).teo>0?`<button class=btn onclick="EST.borraL('${t.tema}')">↺ Borrar avance de lectura</button>`:''}<span class=sp></span><button class=btn onclick="EST.chuleta('${t.tema}')">📋 Chuleta</button><button class=btn onclick="EST.todo('${t.tema}')">🔁 Repasar todas las tarjetas</button></div>
  <p class=sub style="margin:8px 0 0;font-size:12px">«Marcar como leído» es para cuando lo lees en papel. «Borrar avance» solo quita la lectura; la práctica no se toca.</p></div>
 <div class=ruta>${t.partes.map((p,i)=>{const e=estP(p,S0),rr=S0.reto[t.tema+':'+p.id]||{},ok=Object.values(rr).filter(Boolean).length,n=Object.keys(rr).length,tp=teoP(p,S0),pp=pracP(p,S0),cal=pp.n?pp.ok/pp.n:null;
  return`<div class=card><span class="nd ${e}">${e=='ok'?'✓':i+1}</span><div class=row><b>${esc(p.titulo)}</b>${p.estrella?'<span class=star>★</span>':''}</div>
  <div style="margin:6px 0">${p.examen?`<span class="pill am">📝 ${p.examen} de ${tot} preguntas de examen</span>`:''}${p.pagina.length?`<span class=pill>pág. ${p.pagina.join('–')}</span>`:''}<span class=pill>${p.pildoras.length} píldoras</span>${n?`<span class="pill ${ok==n?'gn':''}">🏆 reto ${ok}/${n}</span>`:''}</div>
  ${p.paraque?`<div style="color:var(--mut);font-size:.92em">${rt(p.paraque)}</div>`:''}
  <div class=tpr><span>📖</span><div class=bar style="flex:1"><i style="width:${100*tp}%;background:#7c3aed"></i></div><b>${tp>=1?'leída':Math.round(100*tp)+'%'}</b><span class=sep></span>${anillo(pp.done,cal,26,pp.done?'Práctica completada':'Práctica pendiente')}<small>${pp.done?'práctica hecha':'práctica pendiente'}${cal==null?'':` · <span style="color:${colCal(cal)};font-weight:700">${Math.round(100*cal)}%</span>`}</small></div>
  <div class=row style="margin-top:10px"><button class="btn ${tp<1?'pri':''}" onclick="EST.parte('${t.tema}','${p.id}','teo')">📖 Teoría</button><button class="btn ${tp>=1&&!pp.done?'pri':''}" onclick="EST.parte('${t.tema}','${p.id}','pra')">🧠 Práctica interactiva</button>${p.cards.some(c=>S0.E[c.cid])?`<button class=btn onclick="EST.rep('${t.tema}','${p.id}')">🃏 Repasar tarjetas</button>`:''}<button class=btn onclick="EST.reto('${t.tema}','${p.id}')">🏆 Reto</button>
  <span class=sp></span>${tp<1?`<button class=lnk onclick="EST.leido('${tk(p)}')">✓ marcar leída</button>`:`<button class=lnk onclick="EST.borraL('${tk(p)}')">↺ borrar lectura</button>`}</div></div>`}).join('')}</div></div>`}

const PASOS=[['🎯','Calienta'],['📖','Aprende'],['🧠','Recuerda'],['🃏','Tarjetas'],['🏆','Reto']];
function verPl(P){const S0=estado();if(!visto(P,S0,ST.k))apunta({pl:tk(P),k:ST.k})}
function vParte(){katexOn();const P=part(ST.t,ST.p);if(!P)return home();const s=ST.s,k=ST.t+':'+ST.p;
 const hd=`<div class=es><div class=row><button class=btn onclick="EST.tema('${ST.t}')">◀ ${esc(ST.t)}</button><span class=sp></span>${FOCO?'':`<button class=btn onclick="EST.foco(15)">🍅 Foco 15'</button>`}</div>
 <h1 style="margin-top:12px">${esc(P.titulo)} ${P.estrella?'<span class=star>★</span>':''}</h1>
 <div class=row style="margin:-4px 0 4px"><span class="pill ${s<=1||s==5?'vi':'gn'}" style="font-size:13px">${s<=1||s==5?'📖 Teoría':'🧠 Práctica interactiva'}</span></div>
 <div class=stp>${PASOS.map(([e,n],i)=>[i,e,n]).filter(([i])=>s<=1||s==5?i<=1:i>=2).map(([i,e,n])=>`<button class="${i==s?'on':i<s||s==5?'ok':''}" onclick="EST.s(${i})">${e} ${n}${i==1&&s==1?` ${ST.k+1}/${P.pildoras.length}`:''}</button>`).join('')}</div>`;
 if(s==5){const T=tema(ST.t),i=T.partes.findIndex(p=>p.id==ST.p),nx=T.partes[i+1];
  return hd+`<div class=card style="text-align:center"><div style="font-size:50px">📖✓</div><h2 style="font-size:1.35em">Teoría de esta parte leída</h2><p class=t>Ya cuenta en tu avance de teoría. Cuando quieras, fíjala con la práctica interactiva: recuerda, tarjetas y reto.</p></div>
  <div class=row><button class=btn onclick="EST.tema('${ST.t}')">◀ Volver al tema</button><span class=sp></span>${nx?`<button class=btn onclick="EST.parte('${ST.t}','${nx.id}','teo')">📖 Siguiente parte: ${esc(nx.titulo)}</button>`:''}<button class="btn pri" onclick="EST.s(2)">🧠 Hacer la práctica ahora</button></div></div>`}
 if(s==0){const g=P.gancho;if(!g)return hd+`${P.paraque?`<div class="bx paraque"><span class=bh>${CAJA.paraque}</span>${rt(P.paraque)}</div>`:''}<button class="btn pri bigbtn" onclick="EST.s(1)">Empezar a aprender →</button></div>`;
  return hd+`${P.paraque?`<div class="bx paraque"><span class=bh>${CAJA.paraque}</span>${rt(P.paraque)}</div>`:''}
  <div class=card><p class=sub style="margin:0 0 6px">Antes de leer, <b>apuesta</b>. No cuenta para nada, pero intentar adivinar hace que lo que leas después se te quede mucho mejor.</p>${check(g,'g')}</div>
  <button class="btn pri bigbtn" onclick="EST.s(1)">${ST.ck?.g!=null?'Ahora sí: a aprender →':'Saltar y aprender →'}</button></div>`}
 if(s==1){const n=P.pildoras.length,pl=P.pildoras[ST.k]||P.pildoras[0];verPl(P);
  return hd+`<div class=dots>${P.pildoras.map((_,i)=>`<i class="${i==ST.k?'on':i<ST.k?'ok':''}"></i>`).join('')}</div>
  <div class=card><small style="color:#7c3aed;font-weight:800">PÍLDORA ${ST.k+1} DE ${n} · ≈ 1–2 min</small><h2 style="margin:4px 0 8px;font-size:1.25em">${rt(pl.titulo)}</h2>${(pl.bloques||[]).map((b,i)=>bloque(b,ST.k+'_'+i)).join('')}</div>
  <div class=row><button class=btn ${ST.k?'':'disabled'} onclick="EST.pk(-1)">◀ Anterior</button><span class=sp></span>${ST.k<n-1?`<button class="btn pri" onclick="EST.pk(1)">Siguiente píldora ▶</button>`:`<button class="btn pri" onclick="EST.s(5)">✓ Teoría terminada</button>`}</div>
  <p class=kbd><kbd>←</kbd><kbd>→</kbd> moverse entre píldoras</p></div>`}
 if(s==2){const nt=notas()[k]?.x||'';
  if(!ST.cmp)return hd+`<div class=card><p class=t style="margin-top:0"><b>Sin mirar</b>, escribe o di en voz alta todo lo que recuerdes de esta parte, como si se lo explicaras a alguien. Fórmulas incluidas. El esfuerzo de recordar es lo que graba.</p><textarea id=nt placeholder="Lo que recuerdo…">${esc(nt)}</textarea></div><button class="btn pri bigbtn" onclick="EST.comp()">Comparar con las claves →</button></div>`;
  const cl=P.claves,ok=Object.values(ST.cmp).filter(v=>v==1).length,dec=Object.keys(ST.cmp).length;
  return hd+`<div class=card><h2>¿Lo dijiste? Marca cada clave</h2><ul class=cl>${cl.map((x,i)=>`<li><span class=tg><button class="${ST.cmp[i]==1?'y':''}" onclick="EST.cl(${i},1)">✓</button><button class="${ST.cmp[i]==0?'n':''}" onclick="EST.cl(${i},0)">✗</button></span><span>${nvB(x.nivel)}${rt(x.x)}</span></li>`).join('')}</ul>
  ${dec==cl.length&&cl.length?`<div class="bx ${ok/cl.length>=.7?'ejemplo':'truco'}"><span class=bh>${ok}/${cl.length} claves</span>${ok/cl.length>=.7?'¡Muy bien! Las tarjetas terminarán de fijarlo.':'Normal en la primera vuelta. Relee las que marcaste con ✗ (botón de abajo) o pasa a las tarjetas: están hechas para eso.'}</div>`:''}
  ${nt?`<details><summary style="cursor:pointer;color:var(--mut)">Lo que escribiste</summary><p class=t>${esc(nt).replace(/\n/g,'<br>')}</p></details>`:''}</div>
  <div class=row><button class=btn onclick="EST.parte('${ST.t}','${ST.p}','teo')">📖 Releer la teoría</button><span class=sp></span><button class="btn pri" onclick="EST.s(3)">Pasar a las tarjetas (${P.cards.length}) ▶</button></div></div>`}
 if(s==3){const S0=estado(),now=Date.now(),pc=P.cards.filter(c=>!S0.E[c.cid]||S0.E[c.cid].due<=now);
  return hd+`<div class=card><h2>🃏 Tarjetas de esta parte</h2>${bar(P.cards,S0.E)}<p class=t>${pc.length?`Tienes <b>${pc.length}</b> tarjetas para ahora. Responde mentalmente y luego valora con sinceridad: la app decide cuándo volver a enseñártelas.`:'Todas las tarjetas de esta parte están al día. ¡Bien!'}</p></div>
  <div class=row><span class=sp></span>${pc.length?`<button class="btn pri" onclick="EST.tarj()">Empezar tarjetas ▶</button>`:''}<button class="btn ${pc.length?'':'pri'}" onclick="EST.s(4)">Ir al reto 🏆</button></div></div>`}
 return hd+vReto(P)}

/* ---------- reto: preguntas tipo examen del banco ---------- */
function preguntasReto(P){const pr=Z().pregs||[],ids=new Set(P.reto);let l=pr.filter(q=>ids.has(q.id));
 /* si el banco se ha editado y faltan ids, se completa con preguntas del tema en las mismas páginas */
 if(l.length<5&&P.pagina.length)l=l.concat(pr.filter(q=>!ids.has(q.id)&&q.tema==P.tema&&P.pagina.includes(+q.pagina)));
 if(!l.length)l=pr.filter(q=>q.tema==P.tema);
 const S0=estado(),r=S0.reto[P.tema+':'+P.id]||{};l=shuf([...l]).sort((a,b)=>((r[a.id]===true)-(r[b.id]===true))||(pregMem(b)-pregMem(a)));
 return l.slice(0,5).map(q=>{const o=shuf([0,1,2,3]);return{...q,ops:o.map(i=>q.opciones[i]),cor:o.indexOf(q.correcta)}})}
function vReto(P){if(!ST.R){ST.R={qs:preguntasReto(P),i:0,m:[],t0:Date.now()}}const R0=ST.R;
 if(!R0.qs.length)return`<div class=card><h2>🏆 Reto</h2><p class=t>Todavía no hay preguntas de <b>${esc(P.tema)}</b> en tu banco. Importa el banco del tema (${esc(P.tema)}.json) desde «Sincronizar» y el reto se activará solo.</p></div><button class="btn pri bigbtn" onclick="EST.terminar()">Marcar la parte como completada ✓</button></div>`;
 if(R0.i>=R0.qs.length){const ok=R0.m.filter((m,i)=>m==R0.qs[i].cor).length,n=R0.qs.length;
  return`<div class=card style="text-align:center"><div style="font-size:54px">${ok==n?'🏆':ok>=n*.6?'🎯':'💪'}</div><h2 style="font-size:1.4em">${ok}/${n} en el reto</h2>
  <p class=t>${ok==n?'¡Perfecto! Esta parte está lista para el examen.':ok>=n*.6?'¡Muy bien! Las que has fallado ya están en «Mis falladas» para el test.':'Esta parte necesita otra vuelta. Las falladas ya están en «Mis falladas», y las tarjetas volverán pronto.'}</p>
  <p class=sub>+${ok*10+(n-ok)*2} XP${estado().fin[P.tema+':'+P.id]?'':' · +30 XP por completar la parte'}</p></div>
  <div class=row><button class=btn onclick="EST.s(1)">📖 Repasar las píldoras</button><span class=sp></span><button class="btn pri" onclick="EST.terminar()">Completar y seguir ▶</button></div></div>`}
 const q=R0.qs[R0.i],m=R0.m[R0.i],L='ABCD';
 return`<div class=card><div class=row><span class=badge>Pregunta ${R0.i+1} de ${R0.qs.length}</span><span class=badge>${esc(q.tema)}${q.pagina?' · pág. '+esc(q.pagina):''}</span></div>
 <div class=qtext>${esc(q.enunciado)}</div>${q.ops.map((o,j)=>`<button class="opt ${m==null?'':j==q.cor?'ok':j==m?'ko':'dim'}" ${m==null?`onclick="EST.rr(${j})"`:'disabled'}><span class=l>${L[j]}</span><span>${esc(o)}</span></button>`).join('')}
 ${m!=null&&q.explicacion?`<div class=expl>💡 ${esc(q.explicacion)}</div>`:''}
 ${m!=null?`<div class=row style="margin-top:14px"><span class=sp></span><button class="btn pri" onclick="EST.rn()">${R0.i<R0.qs.length-1?'Siguiente ▶':'Ver resultado ▶'}</button></div>`:''}</div></div>`}
function guardaReto(P){const R0=ST.R;if(!R0||R0.ok)return;R0.ok=1;const ex=Z().config.examen,n=R0.qs.length;if(!n)return;
 const det=R0.qs.map((q,i)=>({id:q.id,tema:q.tema,pagina:q.pagina,enunciado:q.enunciado,ops:q.ops,cor:q.cor,marca:R0.m[i]??null,expl:q.explicacion}));
 const ac=det.filter(d=>d.marca===d.cor).length,er=det.filter(d=>d.marca!=null&&d.marca!==d.cor).length;
 Z().mine.sesiones.push({id:crypto.randomUUID(),fecha:new Date(Date.now()-new Date().getTimezoneOffset()*MIN).toISOString().slice(0,19),tipo:`Reto ${P.tema} · ${plain(P.titulo)}`,reto:true,modo:'estudio',
  aciertos:ac,errores:er,blancos:n-ac-er,nota:+(Math.max(0,ac-er*ex.penalizacion_por_error)*ex.puntos_maximos/n).toFixed(2),minutos:+((Date.now()-R0.t0)/MIN).toFixed(1),detalle:det});
 save();QZ.bg()}

/* ---------- sesión de tarjetas ---------- */
const memPri=l=>l.sort((a,b)=>esMem(b)-esMem(a));/* orden estable: dentro de cada grupo se mantiene el barajado */
function cola(n){const S0=estado(),{due,nw}=pendientes(S0);return[...memPri(shuf(due)),...nw].slice(0,n)}
function empieza(q,vuelta){if(!q.length)return tst('No hay tarjetas pendientes.');katexOn();ST={v:'ses',q,i:0,m:false,r:null,E:estado().E,t0:Date.now(),g:[0,0,0,0,0],vuelta,n:q.length};R()}
function vSes(){const q=ST.q;
 if(ST.i>=q.length){const n=ST.g.reduce((a,b)=>a+b,0),ok=ST.g[2]+ST.g[3]+ST.g[4];
  return`<div class=es><div class=card style="text-align:center"><div style="font-size:50px">${ok/(n||1)>=.8?'🌟':'✅'}</div><h1>¡Sesión completada!</h1><p class=big style="margin:0">${n} repasos · ${n?Math.round(100*ok/n):0}% bien · ${Math.max(1,Math.round((Date.now()-ST.t0)/MIN))} min · +${ST.g[1]+3*ok} XP</p>
  <p class=sub style="margin:6px 0 0">Otra vez: ${ST.g[1]} · Difícil: ${ST.g[2]} · Bien: ${ST.g[3]} · Fácil: ${ST.g[4]}</p></div>
  <div class=row>${ST.vuelta?`<button class="btn pri" onclick="EST.vuelta()">Seguir con la misión ▶</button>`:`<button class="btn pri" onclick="EST.cola(15)">Otra tanda</button>`}<button class=btn onclick="EST.home()">Volver</button></div></div>`}
 const c=q[ST.i],P=part(c.tema,c.parte),col=['','#dc2626','#d97706','#0f766e','#2563eb'],nom=['','Otra vez','Difícil','Bien','Fácil'],ty=c.vf!=null?'Verdadero o falso':c.c?'Completa el hueco':'Pregunta';
 let body;if(c.vf!=null){const ok=c.ok?0:1;body=rt(c.vf)+(ST.m?`<hr><b class="${ST.r==ok?'good':'bad'}">${c.ok?'VERDADERO':'FALSO'}</b>${ST.r!=null?(ST.r==ok?' · ¡acertaste!':' · fallaste'):''}${c.por?'<br>'+rt(c.por):''}`:'')}
 else if(c.c)body=cloze(c.c,ST.m);else body=rt(c.q)+(ST.m?'<hr>'+rt(c.a):'');
 const sug=c.vf!=null&&ST.m&&ST.r!=null?(ST.r==(c.ok?0:1)?3:1):0;
 return`<div class=es><div class=row style="justify-content:space-between"><b>${ST.i+1}/${q.length}</b><small style="color:var(--mut)">${esc(c.tema)} · ${esc(plain(P?.titulo||''))}</small><button class=btn onclick="${ST.vuelta?'EST.vuelta()':'EST.home()'}">Salir</button></div>
 <div class=eb><i style="width:${100*ST.i/q.length}%;background:#7c3aed"></i></div>
 <div class="card ec"><span class=ty>${ty}</span> ${nvB(c.nivel)}<br>${body}${!ST.m&&c.pista?`<details style="margin-top:12px;font-size:.85em"><summary style="cursor:pointer;color:var(--mut)">💭 Pista</summary>${rt(c.pista)}</details>`:''}</div>
 ${ST.m?`<div class=gr>${[1,2,3,4].map(g=>`<button class=btn style="border-color:${col[g]};${g==sug?`background:${col[g]}22;`:''}" onclick="EST.g(${g})"><b>${nom[g]}</b><br><small>${hint(c,g)}</small></button>`).join('')}</div><p class=kbd><kbd>1</kbd>–<kbd>4</kbd> valorar</p>`
 :c.vf!=null?`<div class=vfb><button class="btn" style="border-color:var(--good);color:var(--good)" onclick="EST.vf(0)">✓ Verdadero</button><button class="btn" style="border-color:var(--bad);color:var(--bad)" onclick="EST.vf(1)">✗ Falso</button></div><p class=kbd><kbd>V</kbd> / <kbd>F</kbd></p>`
 :`<button class="btn pri bigbtn" onclick="EST.m()">Mostrar respuesta</button><p class=kbd><kbd>Espacio</kbd> mostrar</p>`}</div>`}

/* ---------- archivos de estudio cargados (para borrar los antiguos) ---------- */
function archivos(){temario();const est=Z().est||{},ks=Object.keys(est).sort();if(!ks.length)return'';
 return`<h2 style="margin:16px 0 6px">📂 Archivos de estudio cargados</h2><p class=sub style="margin:0 0 8px">Al borrar uno se quita de este dispositivo y, al sincronizar, también de Drive y de tus otros dispositivos. El progreso de sus tarjetas se pierde.</p>
 <table class=tb><tbody>${ks.map(n=>{let j={};try{j=JSON.parse(est[n])}catch{}const v2=(j.partes||[]).some(p=>p.pildoras);
  return`<tr><td><b>${esc(j.tema||'?')}</b> ${esc(j.titulo||'')}<br><small style="color:var(--mut)">${esc(n)} · ${(j.partes||[]).length} partes</small></td><td><span class="pill ${v2?'gn':'am'}">${v2?'formato nuevo':CACHE.ign.has(n)?'antiguo · no se usa (hay uno nuevo)':'formato antiguo'}</span></td><td style="text-align:right"><button class=btn onclick="EST.borra(${esc(JSON.stringify(n))})">🗑 Borrar</button></td></tr>`}).join('')}</tbody></table>`}

/* ---------- chuleta del tema ---------- */
function vChul(){katexOn();const t=tema(ST.t);if(!t)return home();
 const fb=b=>`<div class="fm ${nvN(b.nivel)}" style="margin:8px 0">${b.n?`<span class=fn>(${esc(b.n)})</span>`:''}${nvB(b.nivel)}${b.nombre?`<b>${rt(b.nombre)}</b>`:''}${mat(b.tex,true)}</div>`;
 const bl=p=>p.pildoras.flatMap(x=>x.bloques||[]);
 /* ⭐ arriba del todo: fórmulas y claves de memoria de todas las partes */
 const mem=t.partes.map(p=>({p,f:bl(p).filter(b=>b.t=='formula'&&nvN(b.nivel)=='memoria'),c:p.claves.filter(c=>c.nivel=='memoria')})).filter(x=>x.f.length||x.c.length);
 return`<div class=es><p><button class=btn onclick="EST.tema('${t.tema}')">◀ ${esc(t.tema)}</button></p><h1>📋 Chuleta · ${esc(t.tema)}</h1><p class=sub>Todo lo memorizable del tema en una pantalla: fórmulas, claves, trucos y trampas. Ideal para el último repaso.</p>
 ${mem.length?`<div class=card style="border:2px solid #f59e0b99"><h2>⭐ Fórmulas de memoria</h2><p class=sub style="margin:0 0 6px">Lo que hay que saber escribir o reconocer al instante. Si solo te da tiempo a repasar una cosa, que sea esto.</p>
  ${mem.map(({p,f,c})=>`<h3 style="margin:12px 0 4px;font-size:1em;color:var(--mut)">${esc(p.titulo)}</h3>${f.map(fb).join('')}${c.length?`<ul>${c.map(x=>`<li style="margin:5px 0">${rt(x.x)}</li>`).join('')}</ul>`:''}`).join('')}
  <p class=sub style="margin:10px 0 0">${nvB('reconocer')} basta con saber su forma · ${nvB('idea')} basta con saber qué hace</p></div>`:''}
 ${t.partes.map(p=>{const bs=bl(p),f=bs.filter(b=>b.t=='formula').sort((a,b)=>NVR[nvN(a.nivel)]-NVR[nvN(b.nivel)]),c=bs.filter(b=>b.t=='caja'&&['ojo','truco','mnemo','recuerda','amplia'].includes(b.tipo));
  return`<div class=card><h2>${esc(p.titulo)} ${p.estrella?'<span class=star>★</span>':''}</h2>${p.claves.length?`<ul>${p.claves.map(x=>`<li style="margin:5px 0">${nvB(x.nivel)}${rt(x.x)}</li>`).join('')}</ul>`:''}
  ${f.map(fb).join('')}${c.map(b=>bloque(b,0)).join('')}</div>`}).join('')}</div>`}

/* ---------- relámpago: 60 s de verdadero/falso ---------- */
function poolRel(){const S0=estado(),T=temario(),l=[];let ps=T.flatMap(t=>t.partes);const vis=ps.filter(p=>S0.act[p.tema+':'+p.id]);if(vis.length)ps=vis;
 for(const p of ps){p.cards.filter(c=>c.vf!=null).forEach(c=>l.push({s:c.vf,ok:!!c.ok,por:c.por,tema:p.tema}));
  p.pildoras.flatMap(x=>x.bloques||[]).filter(b=>b.t=='check'&&b.vf!=null).forEach(b=>l.push({s:b.vf,ok:!!b.ok,por:b.por,tema:p.tema}))}return shuf(l)}
function vRel(){const G=ST.G;katexOn();if(!G.l.length)return`<div class=es><h1>⚡ Relámpago</h1><div class=card>No hay afirmaciones de verdadero/falso todavía. Estudia alguna parte primero.</div><button class=btn onclick="EST.home()">Volver</button></div>`;
 const rest=Math.max(0,G.fin-Date.now());
 if(G.done||rest<=0){if(!G.done){G.done=1;apunta({rel:G.p})}const best=estado().best;
  return`<div class=es><div class=card style="text-align:center"><div style="font-size:54px">⚡</div><h1>${G.p} puntos</h1><p class=sub>${G.ok} aciertos · ${G.ko} fallos · mejor racha ×${G.mx}${G.p>=best&&G.p?' · <b class=good>¡nuevo récord!</b>':' · récord '+best}</p></div>
  ${G.mal.length?`<div class=card><h2>Repasa estas</h2>${G.mal.map(x=>`<div style="padding:8px 0;border-bottom:1px solid var(--bd)">${rt(x.s)} → <b class=${x.ok?'good':'bad'}>${x.ok?'VERDADERO':'FALSO'}</b>${x.por?`<br><small>${rt(x.por)}</small>`:''}</div>`).join('')}</div>`:''}
  <div class=row><button class="btn pri" onclick="EST.relampago()">Otra vez</button><button class=btn onclick="EST.home()">Volver</button></div></div>`}
 const it=G.l[G.i%G.l.length];
 return`<div class=es><div class=row><b id=rlt style="font-size:22px;font-variant-numeric:tabular-nums">⏱ ${Math.ceil(rest/1e3)} s</b><span class=sp></span><b>${G.p} pts</b><span class="pill vi">racha ×${Math.min(4,1+Math.floor(G.r/3))}</span></div>
 <div class=eb><i style="width:${100*rest/6e4}%;background:${rest<15e3?'#dc2626':'#7c3aed'}"></i></div>
 <div class="card rel ${G.fx||''}">${rt(it.s)}</div><div class=vfb><button class=btn style="border-color:var(--good);color:var(--good)" onclick="EST.rv(1)">✓ Verdadero</button><button class=btn style="border-color:var(--bad);color:var(--bad)" onclick="EST.rv(0)">✗ Falso</button></div>
 <p class=kbd><kbd>V</kbd>/<kbd>←</kbd> verdadero · <kbd>F</kbd>/<kbd>→</kbd> falso</p></div>`}
let relT=null;function relTick(){clearTimeout(relT);if(ST.v!='rel'||ST.G.done)return;const el=$$('#rlt');if(Date.now()>=ST.G.fin){RR();return}
 if(el)el.textContent='⏱ '+Math.ceil((ST.G.fin-Date.now())/1e3)+' s';const b=$$('.es .eb i');if(b)b.style.width=100*(ST.G.fin-Date.now())/6e4+'%';relT=setTimeout(relTick,250)}

/* ===================== PLANNING (hasta la fecha tope) =====================
   - Días de estudio: lunes a viernes sin festivos de la Comunidad de Madrid; cada día se puede activar o desactivar.
   - Cada mañana se recalcula con lo que llevas hecho: lo pendiente se reparte entre los días de estudio que quedan.
   - Durante el día el plan de hoy no cambia (se calcula con tu avance a las 00:00).
   - Tema hecho = teoría al 100 % en la app o marcado como leído. Vídeos: trozos de ≤ 75 min, cada uno con su check. */
const FEST={'2026-12-07':'Día de la Constitución (trasladado)','2026-12-08':'Inmaculada Concepción','2026-12-25':'Navidad','2027-01-01':'Año Nuevo','2027-01-06':'Reyes'};
const TIT={'COM-01':'La Constitución Española de 1978','COM-02':'La Unión Europea: tratados constitutivos y sistema institucional','COM-03':'La Administración General del Estado: organización y funcionamiento','COM-04':'Las Comunidades Autónomas: Estatutos de Autonomía y organización institucional','COM-05':'Las fuentes del derecho administrativo: concepto y clases','COM-06':'El acto administrativo: concepto, elementos y clases','COM-07':'Nulidad y anulabilidad de los actos administrativos','COM-08':'Procedimientos administrativos especiales y sus fases','COM-09':'Los contratos del sector público','COM-10':'Régimen jurídico del empleo público en las Administraciones públicas','COM-11':'Protección de datos, transparencia y gobierno abierto','COM-12':'Políticas de igualdad efectiva de mujeres y hombres',
'ESP-01':'Funciones y estructura orgánica de la DG del Instituto Geográfico Nacional','ESP-02':'La Ley de Ordenación de la Cartografía (Ley 7/1986) y la LISIGE (Ley 14/2010)','ESP-03':'El Sistema Cartográfico Nacional','ESP-04':'La Ley Reguladora de Bases del Régimen Local (Ley 7/1985)','ESP-05':'Las leyes sobre reutilización de la información del sector público','ESP-06':'La Ley de Señales Geodésicas y Geofísicas',
'ESP-07':'Sistemas de referencia y tiempo','ESP-08':'El campo de la gravedad','ESP-09':'El geoide: definición','ESP-10':'El modelo geodésico terrestre','ESP-11':'Cotas geopotenciales y altitudes','ESP-12':'Observaciones de la gravedad','ESP-13':'VLBI, SLR y DORIS','ESP-14':'Sistemas GNSS','ESP-15':'Observables GNSS','ESP-16':'Fuentes de error en GNSS','ESP-17':'Sistemas de corrección diferencial en GNSS','ESP-18':'Métodos de transformación entre sistemas geodésicos de referencia','ESP-19':'Redes geodésicas: tipos, diseño y observación','ESP-20':'Compensación de una red geodésica','ESP-21':'Estructura interna de la Tierra: corteza, manto, núcleo','ESP-22':'Tectónica de placas','ESP-23':'Parámetros focales de un terremoto','ESP-24':'Métodos de localización de un terremoto','ESP-25':'Instrumentación sísmica','ESP-26':'El fenómeno volcánico: geodinámica','ESP-27':'Sismicidad volcánica','ESP-28':'El campo magnético terrestre','ESP-29':'Observación del campo magnético terrestre',
'ESP-30':'Visión estereoscópica: fundamentos y sistemas','ESP-31':'Cálculo y georreferenciación de trayectorias de vuelos','ESP-32':'Adquisición de imágenes con sensores aerotransportados','ESP-33':'Orientación relativa y absoluta de pares fotogramétricos','ESP-34':'Procesamiento de imágenes aéreas y producción de ortoimágenes','ESP-35':'Fundamentos de la tecnología LiDAR','ESP-36':'Procesamiento de datos LiDAR aerotransportados','ESP-37':'Productos derivados de una nube de puntos LiDAR','ESP-38':'Datos de imagen, LiDAR y teledetección para Gemelos Digitales','ESP-39':'Fundamentos físicos de la Teledetección','ESP-40':'Corrección geométrica de imágenes de satélite','ESP-41':'Teledetección por Radar','ESP-42':'Clasificación automática de imágenes multiespectrales','ESP-43':'Programa europeo Copernicus de Observación de la Tierra','ESP-44':'Información de ocupación del suelo (SIOSE)','ESP-45':'Ocupación del suelo en Europa y en el mundo','ESP-46':'Errores y su clasificación','ESP-47':'Medida de ángulos y distancias: instrumentos y errores','ESP-48':'Métodos topográficos clásicos: triangulación, intersecciones y poligonación','ESP-49':'Métodos topográficos clásicos: nivelación','ESP-50':'Levantamientos topográficos con GNSS','ESP-51':'Líneas límite jurisdiccionales de términos municipales',
'ESP-52':'Proyecciones conformes','ESP-53':'Proyecciones equidistantes y equivalentes','ESP-54':'Proyecciones cilíndricas y pseudocilíndricas','ESP-55':'Proyecciones cónicas y pseudocónicas','ESP-56':'Definición de cartografía y mapas','ESP-57':'Generalización cartográfica','ESP-58':'Información Geográfica de Referencia y Datos de Alto Valor','ESP-59':'Producción de Bases de Datos de Información Geográfica','ESP-60':'Bases de Datos de Información Geográfica del IGN','ESP-61':'El Mapa Topográfico Nacional 1:25 000 y 1:50 000','ESP-62':'Cartografía derivada del IGN','ESP-63':'Cartografía temática','ESP-64':'Sistemas de Información Geográfica','ESP-65':'El modelo vectorial','ESP-66':'El modelo espacial ráster','ESP-67':'Modelado de datos (UML)','ESP-68':'Infraestructuras de Datos Espaciales','ESP-69':'Servicios de visualización INSPIRE (WMS, WMTS)','ESP-70':'Servicios de localización INSPIRE (CSW)','ESP-71':'Servicios de descarga INSPIRE (WFS, ATOM, WCS)','ESP-72':'Normativa europea en materia de metadatos','ESP-73':'Bases de datos espaciales','ESP-74':'Lenguajes y herramientas para redes globales',
'ANE-01':'Anexo 1','ANE-02':'Anexo 2','ANE-03':'Anexo 3'};
const BLQ=t=>t.startsWith('COM')?'COM':t.startsWith('ANE')?'ANE':(+t.slice(4)<=6?'A':+t.slice(4)<=29?'B':+t.slice(4)<=51?'C':'D');
const VID=[['A','Instituciones de la Unión Europea',11],['A','Fuentes del Derecho de la Unión Europea',18],
['B','Fundamentos de cálculo: gradiente, rotacional y divergencia',10],['B','Geodesia. Temas comunes parte I',119],['B','Sistemas de altitudes',32],['B','Fundamentos de sistemas GNSS – parte I',101],['B','Fundamentos de sistemas GNSS – parte II',173],['B','Métodos de posicionamiento GNSS',47],['B','Técnicas de geodesia espacial',37],['B','Sistemas ITRS y ETRS89. Marcos de referencia asociados',70],['B','Geofísica. Temas comunes parte I',121],['B','Tipos de márgenes de placas con animaciones',20],['B','Sismogramas simples. Conceptos básicos',2],['B','Sismicidad volcánica',6],['B','Geofísica. Temas comunes parte II',83],['B','Sismómetros, redes sísmicas e interpretación de sismogramas',84],['B','Conferencia del IGN sobre la erupción de La Palma (2021)',74],['B','Geomagnetismo IGN',4],['B','Geomagnetismo (en inglés)',3],
['C','Fundamentos sensor LiDAR',6],['C','Modelos 3D: nubes LiDAR frente a fotogrametría (DIM)',5],['C','LiDAR, MDEs y teledetección',125],['C','Métodos de resampling en teledetección',11],['C','Ocupación del suelo, teoría de errores y cartografía temática',109],['C','Media aritmética y desviación típica de una serie',5],['C','Media, moda y mediana',6],['C','Medición directa',7],['C','Mediciones indirectas',12],
['D','Cartografía matemática – parte común',108],['D','Modelado UML',50],['D','Operadores SIG',72],['D','Infraestructuras de Datos Espaciales (IDE)',13],['D','INSPIRE, LISIGE y OGC',28],['D','Metadatos y GeoDCAT',23]];
const hm=m=>{m=Math.round(m);return Math.floor(m/60)+':'+String(m%60).padStart(2,'0')};
const hmL=m=>{m=Math.round(m);const h=Math.floor(m/60),r=m%60;return h?(r?`${h} h ${r} min`:`${h} h`):`${r} min`};
const VCH=VID.flatMap((v,i)=>{const n=Math.ceil(v[2]/75),L=v[2]/n;return Array.from({length:n},(_,k)=>({id:`v${i}_${k}`,vi:i,b:v[0],tit:v[1],k,n,a:Math.round(k*L),z:Math.round((k+1)*L),min:Math.round((k+1)*L)-Math.round(k*L)}))});
const ymd=d=>{d=new Date(d);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const fLarga=s=>new Date(s+'T12:00').toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'});
const pcfg=()=>{const c=cfgs();return{fin:c.pfin||'2027-01-29',h:+c.ph||5.5,orden:String(c.porden||'B C D A COM ANE').toUpperCase().split(/[\s,;]+/).filter(Boolean)}};
const diaOn=(s,dov)=>{if(s in dov)return dov[s];const w=new Date(s+'T12:00').getDay();return w>0&&w<6&&!FEST[s]};
/* avance de un tema: teoría de la app (o marcado leído); sin archivo de estudio, solo «leído» */
function teoTema(t,S0){const T=tema(t);if(T)return resT(T,S0).teo;return(S0.leido[t]||0)>(S0.borra[t]||0)?1:0}
function ordenItems(){const o=pcfg().orden,todos=Object.keys(TIT),bs=[...o,...['B','C','D','A','COM','ANE'].filter(b=>!o.includes(b))],out=[];
 for(const b of [...new Set(bs)]){const ts=todos.filter(t=>BLQ(t)==b),vs=VCH.filter(c=>c.b==b),m=vs.length,n=ts.length;
  if(!n){vs.forEach(c=>out.push({k:'v',c,b}));continue}
  /* cada trozo de vídeo va detrás del tema que le toca, repartidos de forma uniforme por el bloque */
  const pos=vs.map((_,j)=>Math.min(n-1,Math.floor((j+1)*n/(m+1))));
  ts.forEach((t,i)=>{out.push({k:'t',t,b});vs.forEach((c,j)=>{if(pos[j]==i)out.push({k:'v',c,b})})})}
 return out}
let PC={k:'',v:null};
function plan(){const pc=pcfg(),h0=hoy0(),S0=estado(h0),S=estado(),hoy=ymd(h0),k=[h0,logs().length,JSON.stringify(pc),Object.keys(Z().est||{}).length].join('|');
 if(PC.k==k)return PC.v;
 const dias=[];for(let d=new Date(hoy+'T12:00');ymd(d)<=pc.fin;d.setDate(d.getDate()+1)){const s=ymd(d);if(diaOn(s,S.dov))dias.push(s)}
 const cap=pc.h*60,its=ordenItems().map(x=>x.k=='t'?{...x,r:1-teoTema(x.t,S0)}:{...x,r:S0.vid[x.c.id]?0:1}).filter(x=>x.r>0.001);
 const remT=its.filter(x=>x.k=='t').reduce((a,x)=>a+x.r,0),remV=its.filter(x=>x.k=='v').reduce((a,x)=>a+x.c.min,0),nd=Math.max(1,dias.length);
 /* tiempo por tema FIJO (tu jornada con el plan de referencia: 40 días del 30/11 al 29/01). Así, si adelantas, la carga diaria baja; si acercas la fecha límite, sube */
 const T=Math.max(45,Math.min(240,(cap*40-VID.reduce((a,v)=>a+v[2],0))/Object.keys(TIT).length));
 its.forEach(x=>x.w=x.k=='t'?x.r*T:x.c.min);
 const L=its.reduce((a,x)=>a+x.w,0),B=L/nd,dia=dias.map(()=>[]);let cum=0;
 /* cada tarea va al día que le toca por trabajo acumulado: el reparto queda equilibrado y no se amontona nada al final */
 for(const x of its){const d=Math.min(nd-1,Math.floor((cum+x.w/2)/B));if(dias.length)dia[d].push(x);cum+=x.w}
 PC={k,v:{dias,dia,T,B,L,cap,remT,remV,hoy,hoyOn:dias[0]==hoy,S0}};return PC.v}
const hechoIt=(x,S)=>x.k=='t'?teoTema(x.t,S)>=.999:!!S.vid[x.c.id];
function liIt(x,S,peq){const ok=hechoIt(x,S);
 if(x.k=='t'){const T=tema(x.t),tp=teoTema(x.t,S);
  return`<li class="${ok?'ok':''}"><span class=st>${ok?'✓':'📖'}</span><span class=tx2 style="flex:1"><b style="color:${({A:'#2563eb',B:'#0d9488',C:'#ea580c',D:'#db2777',COM:'#7c3aed'})[x.b]||'inherit'}">${esc(x.t)}</b> <b>${esc(TIT[x.t]||'')}</b><br><small style="color:var(--mut)">${x.r<.999?`te quedaba el ${Math.round(100*x.r)} % · `:''}≈ ${hmL(x.w)}${!ok&&tp>0&&tp<1?` · llevas ${Math.round(100*tp)} %`:''}${T?'':' · aún no está en la app: márcalo al leerlo'}</small></span>
  ${peq?'':T&&!ok?`<button class="btn pri" onclick="EST.teo('${x.t}')">Leer</button>`:''}<button class=btn onclick="EST.pleido('${x.t}')">${ok?'↺':'✓ Leído'}</button></li>`}
 const c=x.c;return`<li class="${ok?'ok':''}"><span class=st>${ok?'✓':'🎬'}</span><span class=tx2 style="flex:1"><b>${esc(c.tit)}</b><br><small style="color:var(--mut)">vídeo bloque ${c.b} · ${c.n>1?`parte ${c.k+1} de ${c.n}: del ${hm(c.a)} al ${hm(c.z)} (${hmL(c.min)})`:hmL(c.min)}</small></span><button class=btn onclick="EST.pvid('${c.id}',${ok?0:1})">${ok?'↺':'✓ Visto'}</button></li>`}
/* bloque «Planning de hoy» para la misión de hoy y el Panel */
function planHoy(peq){const P=plan(),S=estado();if(!P.dias.length)return`<p class=sub>No quedan días de estudio hasta la fecha tope (${esc(pcfg().fin)}). <a href="#" onclick="EST.plan();return false">Cámbiala</a>.</p>`;
 if(!P.hoyOn){const sig=P.dia[0]||[];return`<div class="bx idea" style="margin-top:0"><span class=bh>📅 Hoy no es día de estudio${FEST[P.hoy]?' · '+esc(FEST[P.hoy]):''}</span>Descansa sin culpa. Si te apetece adelantar, esto es lo del ${esc(fLarga(P.dias[0]))}; lo que hagas hoy se descuenta del planning mañana.</div>
  <ul class=mis>${sig.map(x=>liIt(x,S,peq)).join('')}</ul>`}
 const hoy=P.dia[0],n=hoy.filter(x=>hechoIt(x,S)).length,todo=n==hoy.length,
  ade=P.dia.slice(1).flat().filter(x=>hechoIt(x,S)),adw=ade.reduce((a,x)=>a+x.w,0),pc=pcfg();
 return`<div class=row style="margin-bottom:4px"><b>📅 Planning de hoy</b><span class=sp></span><span class="pill ${todo?'gn':'vi'}">${n}/${hoy.length} hecho · ≈ ${hmL(hoy.reduce((a,x)=>a+x.w,0))}</span></div>
 <p class=sub style="margin:0 0 6px">🎯 Todo leído y visto para el <b>${esc(fLarga(pc.fin))}</b> · <a href="#" style="color:#7c3aed;font-weight:600" onclick="EST.plan();return false">cambiar fecha</a></p>
 <ul class=mis>${hoy.map(x=>liIt(x,S,peq)).join('')}</ul>
 ${adw?`<div class="bx ejemplo"><span class=bh>🚀 Has adelantado ≈ ${hmL(adw)}</span>Mañana se recalcula y los próximos días van más ligeros.</div>`:''}
 ${todo&&P.dia[1]?`<details class=adel ${adw?'open':''}><summary><b>➕ ¡Hoy completado! ¿Adelantas lo del ${esc(fLarga(P.dias[1]))}?</b></summary><ul class=mis>${P.dia[1].map(x=>liIt(x,S,peq)).join('')}</ul></details>`:''}`}
function vPlan(){const P=plan(),S=estado(),pc=pcfg(),carga=P.dias.length?P.L/P.dias.length:0,dur=P.remV,tot=VID.reduce((a,v)=>a+v[2],0);
 const meses=[],ini=new Date(ymd(Date.now())+'T12:00'),fin=new Date(pc.fin+'T12:00');
 for(let m=new Date(ini.getFullYear(),ini.getMonth(),1);m<=fin;m.setMonth(m.getMonth()+1))meses.push(new Date(m));
 const idx={};P.dias.forEach((s,i)=>idx[s]=i);
 const cal=meses.map(m=>{const y=m.getFullYear(),mo=m.getMonth(),first=(new Date(y,mo,1).getDay()+6)%7,nd=new Date(y,mo+1,0).getDate();let c='';
  for(let i=0;i<first;i++)c+='<i></i>';
  for(let d=1;d<=nd;d++){const s=ymd(new Date(y,mo,d,12)),fuera=s<ymd(Date.now())||s>pc.fin,on=diaOn(s,S.dov),it=idx[s]!=null?P.dia[idx[s]]:[],nt=it.filter(x=>x.k=='t').length,nv=it.filter(x=>x.k=='v').length;
   c+=`<button class="cd ${fuera?'fu':on?'on':'off'} ${s==P.hoy?'hoy':''}" ${fuera?'disabled':`onclick="EST.pdia('${s}')"`} title="${esc(FEST[s]||'')}${fuera?'':on?' · día de estudio (pulsa para librarlo)':' · libre (pulsa para estudiar)'}"><b>${d}</b>${FEST[s]?'<small class=fe>festivo</small>':''}${it.length?`<small>${nt?nt+'📖':''}${nv?' '+nv+'🎬':''}</small>`:''}</button>`}
  return`<div class=mes><h3>${m.toLocaleDateString('es-ES',{month:'long',year:'numeric'})}</h3><div class=cal>${['L','M','X','J','V','S','D'].map(x=>`<span class=dh>${x}</span>`).join('')}${c}</div></div>`}).join('');
 return`<div class=es><p><button class=btn onclick="EST.home()">◀ Estudiar</button></p><h1>📅 Planning hasta el ${esc(fLarga(pc.fin))}</h1>
 <p class=sub>Cada mañana se recalcula con lo que llevas: si adelantas, los días siguientes se aligeran; si un día no llegas, lo pendiente se reparte entre los que quedan.</p>
 <div class="card meta"><div class=row style="gap:14px;align-items:center">
  <div><b>🎯 Fecha límite</b><br><small style="color:var(--mut)">para tener todo leído y visto</small></div>
  <input type=date id=pfin value="${esc(pc.fin)}" min="${ymd(Date.now())}" onchange="EST.pcfg()">
  <span class=chips>${[['2027-01-15','15 ene'],['2027-01-22','22 ene'],['2027-01-29','29 ene'],['2027-02-05','5 feb']].map(([v,t])=>`<button class="btn ${v==pc.fin?'pri':''}" onclick="EST.pfin('${v}')">${t}</button>`).join('')}</span>
  <label style="margin-left:auto">Horas al día <input type=number id=ph min=1 max=12 step=.5 value="${pc.h}" style="width:70px" onchange="EST.pcfg()"></label></div>
  <p class=sub style="margin:8px 0 0">Al cambiarla se reparte todo lo pendiente entre los días de estudio que quedan hasta esa fecha. Y si un día haces de más, lo que adelantes se quita de los días siguientes.</p></div>
 <div class=hero2>
  <div class=card><small>Días de estudio que quedan</small><div class=big2>${P.dias.length}</div><small style="color:var(--mut)">${P.hoyOn?'contando hoy':'a partir del '+esc(P.dias[0]?fLarga(P.dias[0]):'—')}</small></div>
  <div class=card><small>Temas por leer</small><div class=big2>${(Math.round(P.remT*10)/10).toString().replace('.',',')}</div><small style="color:var(--mut)">de ${Object.keys(TIT).length} (86 temas + 3 anexos)</small></div>
  <div class=card><small>Vídeo pendiente</small><div class=big2>${hm(dur)}</div><small style="color:var(--mut)">de ${hm(tot)} en total</small></div>
  <div class=card><small>Carga por día</small><div class=big2 style="color:${carga>P.cap*1.05?'#dc2626':'#16a34a'}">${hmL(carga)}</div><small style="color:var(--mut)">tu jornada: ${hmL(P.cap)} · ≈ ${hmL(P.T)} por tema</small></div>
 </div>
 ${carga>P.cap*1.05?`<div class="bx ojo"><span class=bh>Vas justo</span>Con los días que quedan necesitarías unas ${hmL(carga)} al día. Activa algún día libre en el calendario, sube tus horas o mueve la fecha límite.</div>`:''}
 <div class=card><h2>Calendario <small style="font-weight:500;color:var(--mut)">· pulsa un día para estudiarlo o librarlo</small></h2><div class=meses>${cal}</div>
  <div class=legend><span><b style="background:#7c3aed22;border:1px solid #7c3aed"></b>día de estudio</span><span><b style="background:var(--bg);border:1px dashed var(--bd)"></b>libre</span><span><b style="border:2px solid #f59e0b"></b>hoy</span><span>📖 temas · 🎬 vídeos</span></div></div>
 <div class=card><h2>Día a día</h2>${P.dias.map((s,i)=>`<details ${i<3?'open':''} style="border-top:1px solid var(--bd);padding:8px 0"><summary style="cursor:pointer"><b>${s==P.hoy?'Hoy · ':''}${esc(fLarga(s))}</b> <small style="color:var(--mut)">· ${P.dia[i].length} tareas · ≈ ${hmL(P.dia[i].reduce((a,x)=>a+x.w,0))}</small></summary><ul class=mis>${P.dia[i].map(x=>liIt(x,S,1)).join('')}</ul></details>`).join('')||'<p class=sub>Nada pendiente. ¡Todo leído y visto!</p>'}</div>
 <details class=card><summary style="cursor:pointer;font-weight:700">⚙️ Ajustes del planning</summary><div class=row style="margin-top:12px;gap:14px">
  <label>Orden de bloques <input id=porden value="${esc(pc.orden.join(' '))}" style="width:200px" onchange="EST.pcfg()"></label></div>
  <p class=sub style="margin:8px 0 0">Bloques: B, C, D, A, COM (comunes) y ANE (anexos). Festivos de la Comunidad de Madrid ya marcados: 7 y 8 de diciembre, 25 de diciembre, 1 y 6 de enero.</p></details></div>`}

/* ============ API pública ============ */
window.vEstudio=()=>{if(!(QZ.Z&&QZ.Z.rev))return'<p class=sub>Cargando…</p>';const h=({home,tema:vTema,parte:vParte,ses:vSes,chul:vChul,rel:vRel,plan:vPlan}[ST.v]||home)();
 if(ST.v=='rel')setTimeout(relTick);return`<div style="--fs:${cfgs().fs||17}px">${h}</div>`};
window.EST={
 home(){ST={v:'home'};R()},tema(t){ST={v:'tema',t};R()},chuleta(t){ST={v:'chul',t};R()},
 parte(t,p,m='teo'){const k=t+':'+p,pos=Z().rev.pos?.[k],P=part(t,p),S0=estado(),kk=Math.min(pos?.k??0,(P?.pildoras.length||1)-1);
  ST={v:'parte',t,p,s:m=='pra'?2:(P?.gancho&&!kk&&teoP(P,S0)==0?0:1),k:kk,ck:{},cmp:null};if(!S0.act[k])apunta({a:k});R()},
 s(n){ST.s=n;ST.cmp=n==2?ST.cmp:null;if(n==4)ST.R=null;(Z().rev.pos??={})[ST.t+':'+ST.p]={k:ST.k};save();R()},
 teo(t){const S0=estado(),T=tema(t),p=T.partes.find(p=>teoP(p,S0)<1)||T.partes[0];EST.parte(t,p.id,'teo')},
 pra(t){const S0=estado(),T=tema(t),p=T.partes.find(p=>!S0.fin[tk(p)])||T.partes[0];EST.parte(t,p.id,'pra')},
 leido(key){const tm=!key.includes(':'),q=tm?'¿Marcar todo el tema '+key+' como leído?':'¿Marcar esta parte como leída?';if(!confirm(q+' Contará como teoría leída al 100 %.'))return;apunta({leido:key});tst(tm?'Tema marcado como leído 📖✓':'Parte marcada como leída');RR()},
 borraL(key){const tm=!key.includes(':');if(!confirm(tm?`¿Borrar el avance de lectura de ${key}? La práctica (tarjetas, retos) no se toca.`:'¿Borrar la lectura de esta parte? La práctica no se toca.'))return;
  apunta({borra:key});const pos=Z().rev.pos||{};for(const k of Object.keys(pos))if(k==key||k.startsWith(key+':'))delete pos[k];save();tst('Avance de lectura borrado');RR()},
 anillo,
 plan(){ST={v:'plan'};R()},
 pleido(t){const S=estado();if(teoTema(t,S)>=.999){if(!confirm(`¿Quitar ${t} como leído? Solo se borra la lectura; la práctica no se toca.`))return;apunta({borra:t});const pos=Z().rev.pos||{};for(const k of Object.keys(pos))if(k.startsWith(t+':'))delete pos[k];save()}else{apunta({leido:t});tst(t+' leído 📖✓')}RR()},
 pvid(id,ok){apunta({vid:id,ok:!!ok});if(ok)tst('Vídeo visto 🎬✓');RR()},
 pdia(s){const S=estado(),on=diaOn(s,S.dov);apunta({dia:s,on:!on});tst(on?'Día libre: el planning se reparte en los demás':'Día de estudio añadido');RR()},
 pcfg(){let f=$$('#pfin').value;const h=+$$('#ph').value;if(f&&f<ymd(Date.now())){tst('La fecha límite no puede ser anterior a hoy');f=pcfg().fin}Z().rev.cfg={...cfgs(),pfin:f||'2027-01-29',ph:h>0?h:5.5,porden:$$('#porden').value,ts:Date.now()};save();RR()},
 pfin(f){$$('#pfin').value=f;EST.pcfg()},
 pk(d){const P=part(ST.t,ST.p);ST.k=Math.max(0,Math.min(P.pildoras.length-1,ST.k+d));(Z().rev.pos??={})[ST.t+':'+ST.p]={s:1,k:ST.k};save();R()},
 chk(key,j){(ST.ck??={})[key]=j;RR()},
 comp(){const a=$$('#nt');if(a){(Z().rev.notas??={})[ST.t+':'+ST.p]={x:a.value,t:Date.now()};save()}ST.cmp={};RR()},
 cl(i,v){ST.cmp[i]=v;RR()},
 tarj(){const S0=estado(),now=Date.now(),P=part(ST.t,ST.p);empieza(memPri(P.cards.filter(c=>!S0.E[c.cid]||S0.E[c.cid].due<=now)),{v:'parte',t:ST.t,p:ST.p,s:4,k:ST.k})},
 rep(t,p){const S0=estado(),now=Date.now();empieza(memPri(shuf(part(t,p).cards.filter(c=>S0.E[c.cid]&&S0.E[c.cid].due<=now))),{v:'tema',t})},
 todo(t){empieza(shuf(tema(t).partes.flatMap(p=>p.cards)),{v:'tema',t})},
 reto(t,p){ST={v:'parte',t,p,s:4,k:0,ck:{},cmp:null,R:null};R()},
 rr(j){const R0=ST.R,q=R0.qs[R0.i];R0.m[R0.i]=j;apunta({x:ST.t+':'+ST.p,q:q.id,ok:j==q.cor});RR()},
 rn(){const R0=ST.R;R0.i++;if(R0.i>=R0.qs.length){guardaReto(part(ST.t,ST.p));const ok=R0.m.filter((m,i)=>m==R0.qs[i].cor).length;if(ok>=R0.qs.length*.6)confeti()}RR();scrollTo(0,0)},
 terminar(){const k=ST.t+':'+ST.p,t=ST.t;if(!estado().fin[k]){apunta({fin:k});confeti()}save();
  const T=tema(t),S0=estado(),todo=T.partes.every(p=>S0.fin[tk(p)]);tst(todo?'¡Práctica del tema completada! 🏆':'¡Práctica de la parte completada! +30 XP');EST.tema(t)},
 vuelta(){const v=ST.vuelta;if(!v)return EST.home();ST={...v,ck:{},cmp:null,R:null};R()},
 cola(n){empieza(cola(n))},m(){ST.m=true;RR()},vf(j){ST.r=j;ST.m=true;RR()},
 g(g){const c=ST.q[ST.i],t=Date.now();Z().rev.log.push({t,c:c.cid,g});ST.E[c.cid]=paso(ST.E[c.cid]?{...ST.E[c.cid]}:nuevo(t),t,g,esMem(c)?FMEM:1);ST.g[g]++;save();
  if(g==1)ST.q.splice(Math.min(ST.q.length,ST.i+5),0,c);ST.i++;ST.m=false;ST.r=null;if(ST.i>=ST.q.length){QZ.bg();if(ST.g[1]<ST.n/3)confeti()}RR()},
 relampago(){ST={v:'rel',G:{l:poolRel(),i:0,p:0,r:0,mx:0,ok:0,ko:0,mal:[],fin:Date.now()+6e4}};R()},
 rv(v){const G=ST.G;if(G.done||Date.now()>=G.fin)return RR();const it=G.l[G.i%G.l.length],ok=(v==1)==it.ok;
  if(ok){G.r++;G.ok++;G.p+=Math.min(4,1+Math.floor((G.r-1)/3));G.mx=Math.max(G.mx,G.r)}else{G.r=0;G.ko++;if(!G.mal.includes(it))G.mal.push(it)}
  G.fx=ok?'fl-ok':'fl-ko';G.i++;RR()},
 foco(m){FOCO={fin:Date.now()+m*MIN};focoTick();tst(`🍅 ${m} minutos de foco. Móvil lejos, una sola cosa.`);RR()},
 confeti,
 async borra(n){if(!confirm('¿Borrar «'+n+'» de todos tus dispositivos? Se pierde el progreso de sus tarjetas.'))return;await QZ.borrarEst(n);CACHE.sig='';tst('Borrado. Pulsa «Conectar y sincronizar» para quitarlo también de Drive.');RR()},
 zoom(el){const i=el.querySelector('img');if(!i)return;const d=document.createElement('div');d.className='zoom';d.innerHTML=`<img src="${i.src}">`;d.onclick=()=>d.remove();document.body.appendChild(d)},
 cfg(){Z().rev.cfg={...cfgs(),examen:$$('#ex').value,nuevas:Math.max(0,+$$('#nu').value||0),meta:Math.max(10,+$$('#me').value||60),fs:+$$('#fs').value||17,ts:Date.now()};save();RR()},
 /* tarjeta-resumen para el Panel */
 /* progreso de estudio por tema, para el Panel: parte completada = 1, empezada = ½ */
 /* para el Panel: pct = teoría (0–100), prac = práctica completada (0–100), ok/n = aciertos de práctica */
 progreso(){if(!(QZ.Z&&QZ.Z.rev))return{};const S0=estado(),o={};for(const t of temario()){const r=resT(t,S0);
  o[t.tema]={partes:t.partes.length,pct:Math.round(100*r.teo),prac:Math.round(100*r.prac),cal:r.cal,ok:r.ok,n:r.n}}return o},
 resumen(){if(!(QZ.Z&&QZ.Z.rev))return'';const T=temario();if(!T.length)return'';const S0=estado(),{due,nw}=pendientes(S0),sig=siguiente(S0),ex=exam(),now=Date.now();
  return`<div class="card mt" style="border:2px solid #7c3aed55"><div class=row><h2 style="margin:0">🧠 Misión de hoy</h2><span class=sp></span><span class=badge>🔥 ${S0.racha} ${S0.racha==1?'día':'días'}</span><span class=badge>${S0.hoy}/${cfgs().meta||60} XP hoy</span>${ex>now?`<span class=badge>${Math.ceil((ex-now)/DAY)} días para el examen</span>`:''}</div>
  <div style="margin:12px 0 4px">${planHoy(1)}</div>
  <p style="margin:10px 0">${due.length+nw.length?`<b>${due.length+nw.length}</b> ${due.length+nw.length==1?'tarjeta pendiente':'tarjetas pendientes'}`:'Tarjetas al día'}${sig?` · teoría siguiente: <b>${esc(sig.tema)} · ${esc(sig.titulo)}</b>`:''}</p><button class="btn pri" onclick="go('estudio')">Empezar a estudiar ▶</button></div>`}};
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select')||e.ctrlKey||e.metaKey)return;const k=e.key.toLowerCase();
 if(typeof S!=='undefined'&&S.view!=='estudio')return;
 if(ST.v=='ses'&&ST.i<ST.q.length){const c=ST.q[ST.i];
  if(!ST.m&&c.vf!=null&&(k=='v'||k=='f')){EST.vf(k=='v'?0:1)}else if(!ST.m&&c.vf==null&&(k==' '||k=='enter')){e.preventDefault();EST.m()}else if(ST.m&&'1234'.includes(k)&&k)EST.g(+k)}
 else if(ST.v=='parte'&&ST.s==1){if(k=='arrowright'){const P=part(ST.t,ST.p);ST.k<P.pildoras.length-1?EST.pk(1):EST.s(5)}else if(k=='arrowleft')EST.pk(-1)}
 else if(ST.v=='rel'&&!ST.G.done){if(k=='v'||k=='arrowleft')EST.rv(1);else if(k=='f'||k=='arrowright')EST.rv(0)}});
})();

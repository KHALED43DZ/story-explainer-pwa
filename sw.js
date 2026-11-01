const V="story-explainer-v2.1";
const SHELL=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);if(r.method!=="GET")return;
  if(u.origin===location.origin){
    // الصفحة: الشبكة أولًا لتصل التحديثات، ثم النسخة المحفوظة دون إنترنت
    if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put("index.html",c));return x}).catch(()=>caches.match("index.html")));return}
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x})));return}
  // خط Cairo: يُحفظ بعد أول تحميل ليعمل دون إنترنت
  if(u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(h=>{const n=fetch(r).then(x=>{c.put(r,x.clone());return x}).catch(()=>h);return h||n})))}
  // طلبات Gemini وغيرها تمرّ مباشرة ولا تُخزَّن
});

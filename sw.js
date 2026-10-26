const C='kk-v7',F=['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url),same=u.origin==location.origin;
  const ok=same||/(gstatic\.com|cdnjs\.cloudflare\.com|fonts\.googleapis\.com)$/.test(u.hostname);
  if(r.method!='GET'||!ok||u.pathname.startsWith('/__/'))return;
  if(same){ // file aplikasi: selalu ambil versi terbaru bila online, cache hanya untuk offline
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(m=>{
    const f=fetch(r).then(res=>{if(res.ok||res.type=='opaque'){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res}).catch(()=>m);
    return m||f;
  }));
});

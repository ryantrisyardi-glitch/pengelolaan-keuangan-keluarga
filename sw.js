const C='kk-v1',F=['./','index.html','manifest.json','icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!='GET'||u.hostname.endsWith('googleapis.com'))return;
  e.respondWith(caches.match(r).then(m=>{
    const f=fetch(r).then(res=>{if(res.ok||res.type=='opaque'){const cl=res.clone();caches.open(C).then(c=>c.put(r,cl))}return res}).catch(()=>m);
    return m||f;
  }));
});

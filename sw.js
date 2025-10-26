// v12d — bump to force refresh
self.addEventListener('install', e=>{
  self.skipWaiting();
  e.waitUntil(caches.open('lin-assist-ext-v12d').then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./app.js'])));
});
self.addEventListener('activate', e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{
      const copy = resp.clone();
      caches.open('lin-assist-ext-v12d').then(c=>c.put(e.request, copy));
      return resp;
    }).catch(()=>caches.match('./')))
  );
});

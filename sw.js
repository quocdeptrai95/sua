/* Service Worker - Sổ Theo Dõi Sữa */
self.addEventListener('install', (event) => { self.skipWaiting(); });
self.addEventListener('activate', (event) => { event.waitUntil(clients.claim()); });

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let title = 'Sổ Sữa Của Pép Pi';
    let body = 'Có thông báo mới';
    let tag = 'milk-' + Date.now();
    try {
      if (event.data) {
        const raw = await event.data.text();
        try {
          const data = JSON.parse(raw);
          title = 'Sổ Sữa Của Pép Pi';
          body = data.body || data.message || body;
          tag = data.tag || tag;
        } catch (_) { if (raw) body = raw; }
      }
    } catch (e) {}
    await self.registration.showNotification(title, {
      body, tag, renotify: true, data: { url: './' }
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    for (const client of list) {
      if ('focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('./');
  }));
});

/* Service Worker - Sổ Theo Dõi Sữa */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let title = 'Sổ Sữa Của Bé 🍼';
    let body = 'Có thông báo mới';
    let tag = 'milk-' + Date.now();

    try {
      if (event.data) {
        const raw = event.data.text();
        try {
          const data = JSON.parse(raw);
          title = data.title || title;
          body = data.body || data.message || body;
          tag = data.tag || tag;
        } catch (_) {
          if (raw) body = raw;
        }
      }
    } catch (e) {
      console.warn('push parse', e);
    }

    const options = {
      body: body,
      icon: '/sua/icon-192.png',
      badge: '/sua/icon-192.png',
      tag: tag,
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { url: '/sua/' }
    };

    try {
      await self.registration.showNotification(title, options);
    } catch (e) {
      console.error('showNotification failed', e);
    }
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});

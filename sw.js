const CACHE_NAME = 'didup-cache-v34'; // Fix proporzioni iPhone Home e testo assenze
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    'https://cdn-icons-png.flaticon.com/512/747/747376.png',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
];

self.addEventListener('install', (e) => {
    self.skipWaiting(); // Forza l'attivazione immediata
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
    // Rileva e cancella tutte le vecchie versioni della cache (es. v7, v8)
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request)));
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: 'didUP NextGen', body: 'Controlla le novità a scuola.' };
    const options = {
        body: data.body, // Aggiunto per coerenza
        icon: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
        vibrate: [200, 100, 200]
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('./index.html'));
});
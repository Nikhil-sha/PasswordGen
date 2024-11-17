self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('password-gen-cache').then(cache => {
			return cache.addAll([
        '/PasswordGen',
        '/PasswordGen/index.html',
        '/PasswordGen/styles/main.css',
        '/PasswordGen/scripts/app.js',
        '/PasswordGen/scripts/manifest.json',
        '/PasswordGen/icons/icon-192x192.png',
        '/PasswordGen/icons/icon-512x512.png'
      ]);
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('v1')
			.then( cache => cache.addAll(['/', '/main.css', 'index.js', 'favicon.ico' ]) )
	)
})

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request)
			.then( response => {
				return response || fetch(event.request).then( response2 => {
					caches.open('v1')
						.then( cache => {
							cache.put(event.request, response2.clone())
							return response;
						})
				})
			} )
	)
})

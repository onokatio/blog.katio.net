self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('v1')
			.then( cache => cache.addAll(['/', '/main.css', 'index.js' ]) )
	)
})

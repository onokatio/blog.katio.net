const origin = 'https://blog.katio.net'

const cacheList = [
	origin + '/',
	origin + '/main.css',
	origin + '/index.js',
	origin + '/favicon.ico'
	origin + '/serviceworker.js',
	// 'https://cdn.honokak.osaka/honoka/4.3.1/css/bootstrap.min.css',
	// 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css',
	// 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/solarized-dark.min.css',
	// 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.6.1/marked.min.js',
	// 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js',
	// 'https://cdn.jsdelivr.net/npm/emoji-toolkit@5.0.5/lib/js/joypixels.min.js',
	// 'https://cdn.jsdelivr.net/npm/emoji-toolkit@5.0.5/extras/css/joypixels.min.css',
	// 'https://unpkg.com/js-yaml@3.10.0/dist/js-yaml.js',
	// 'https://dworthen.github.io/js-yaml-front-matter/js/yamlFront.js'
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('v1')
			.then( cache => cache.addAll(cacheList) )
	)
})

self.addEventListener('fetch', event => {
	console.log('sw: fetch triggered.');
	event.respondWith(
		caches.match(event.request)
			.then( response => {
				return response || fetch(event.request).then( response2 => {
					console.log('sw: fetching non cached resources')
					return caches.open('v1')
						.then( cache => {
							cache.put(event.request, response2.clone())
							return response2;
						})
				})
			} )
	)
})

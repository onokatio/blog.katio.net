const origin = 'https://blog.katio.net'

const cacheList = [
	'/',
	'/main.css',
	'/index.js',
	'/favicon.ico',
	'/serviceworker.js',
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
		caches.open(cacheVersion)
			.then( cache => cache.addAll(cacheList) )
	)
})

self.addEventListener('fetch', event => {
		caches.match(event.request)
			.then( response => {
					if( event.request.url.startsWith('http://localhost') || event.request.url.startsWith('https://blog.katio.net') ){
						if (response) {
							console.log('sw: Same Origin(from cache). ' + event.request.url)
							console.log(response)
							return response
						} else {
							console.log('sw: Same Origin(fetch). ' + event.request.url)
							return fetch(event.request.url).then( response2 => {
								return caches.open(cacheVersion)
									.then( cache => {
										cache.put(event.request, response2.clone())
										event.respondWith(response2)
									})
							})
						}
					}else{
						if (response) {
							console.log('sw: Cross Origin(from cache). ' + event.request.url)
							return response
						} else {
							console.log('sw: Cross Origin(fetch). ' + event.request.url)
							return fetch(event.request.url, {mode: "no-cors"}).then( response2 => {
								return caches.open(cacheVersion)
									.then( cache => {
										cache.put(event.request, response2.clone())
										event.respondWith(response2)
									})
							})
						}
					}
			} )
})

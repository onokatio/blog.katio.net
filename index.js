"use strict";

//navigator.serviceWorker.register('/serviceworker.js')
//	.then( () => console.log('sw registered.') )

const smoothJump = (event) => {
	event.preventDefault()
	event.stopPropagation()
	history.pushState(null, null, event.target.pathname)
	UpdatePageFromUrl()
	return false;
}

const hashChangeEvent = () => {
	if (location.pathname === "/" && location.hash.startsWith('#/page/')) {
		location.href = "/page/" + location.hash.slice(7)
	}
}

const isValidFileName = filename => ! filename.match( /^[a-zA-Z0-9-0_\.\-\/]+$/)

const UpdatePageFromUrl = () => {
	document.getElementById("markdown").textContent = 'loading ...';

	(() => {
		if( location.pathname === '/' ){
			return RenderIndex()
		}else if( location.pathname.startsWith('/adventcalendar/2019/onokatio') ){
			return RenderAdventCalendar()
		} else if ( location.pathname.startsWith('/page/') ) {
			const filename = 'post/' + location.pathname.slice(6) + '.md'
			if ( isValidFileName(filename) ) filename = 'post/404.md';

			if( (new URLSearchParams(location.search)).get('slide') === "true" ){
				return RenderSlide(filename)
			}else{
				return RenderMarkdown(filename)
			}
		} else {
			return RenderMarkdown('post/404.md')
		}
	})().then( () => {
		const text = document.getElementById('markdown')
		text.innerHTML = joypixels.shortnameToUnicode(text.innerHTML)

		Array.from(text.getElementsByTagName('a')).forEach( element => {
			if( element.pathname.startsWith('/page/')
				|| element.pathname.startsWith('/adventcalendar/')
				|| ( element.pathname === '/' && element.hash === "" ) ){
					element.addEventListener('click', smoothJump )
			}
		})

	})

}

document.getElementById('gobacklink').addEventListener('click', smoothJump )

window.onhashchange = hashChangeEvent
window.onpopstate = UpdatePageFromUrl

hashChangeEvent()
UpdatePageFromUrl()

"use strict";

navigator.serviceWorker.register('/serviceworker.js')
	.then( () => console.log('sw registered.') )

const renderer = new marked.Renderer()

marked.setOptions({
	renderer: renderer,
	langPrefix: 'hljs ',
	highlight: (code) => hljs.highlightAuto(code).value,
})

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
hashChangeEvent()


const RenderIndex = () => {
	return fetch('https://static.katio.net/dynamic/markdownlist')
		.then( (response) => response.json() )
		.then( (json) => {

			document.getElementById("editgithub").setAttribute("href", "https://github.com/onokatio-blog/blog")
			document.getElementById("editgithub").textContent = 'Pull Request this site on github'
			document.getElementById("markdown").textContent = ''

			const header = document.createElement('h1')
			header.textContent = "おのかちお's blog"

			const adcLink = document.createElement('a')
			adcLink.href = "/adventcalendar/2019/onokatio"
			adcLink.innerText = "アドベントカレンダー 2019はこちら"

			const articleList = document.createElement('div')
			articleList.className = 'd-flex flex-wrap'
			articleList.id = 'articleList'

			document.getElementById("markdown").appendChild(header)
			document.getElementById("markdown").appendChild(adcLink)
			document.getElementById("markdown").appendChild(articleList)


			json.filter( contentAndFilename => contentAndFilename.filename !== '404.md' )
				.forEach( ({filename,title,summary}) => {
					document.getElementById("articleList").appendChild(createCard(filename,title,summary))
				})

			document.querySelector("meta[name='description']").setAttribute('content', '記事一覧')
			document.querySelector("meta[property='og:description']").setAttribute('content', '記事一覧')
			document.title = "記事一覧 - おのかちお's blog"
			document.querySelector("meta[property='og:title']").setAttribute('content', "記事一覧 - おのかちお's blog")

		})
}

const RenderAdventCalendar = () => {
	return fetch('https://static.katio.net/adventCalendar/2019/onokatio.json')
		.then( (response) => response.json() )
		.then( (json) => {

			document.getElementById("editgithub").setAttribute("href", "https://github.com/onokatio/static.katio.net/")
			document.getElementById("editgithub").textContent = 'Pull Request this calendar on github'
			document.getElementById("markdown").textContent = ''

			const header = document.createElement('h1')
			header.textContent = json.name

			const articleList = document.createElement('div')
			articleList.className = 'd-flex flex-wrap'
			articleList.id = 'articleList'

			document.getElementById("markdown").appendChild(header)
			document.getElementById("markdown").appendChild(articleList)

			for(let i=1; i <= 31; i++){
				const post = json.posts[i]
				if( post === undefined ){
					articleList.appendChild(createCalandarEntry(null,i + "日目",'記事が登録されていません。'))
				}else{
					articleList.appendChild(createCalandarEntry(post.url,i + "日目",post.title))
				}
			}

			document.querySelector("meta[name='description']").setAttribute('content', json.name)
			document.querySelector("meta[property='og:description']").setAttribute('content', json.name)
			document.title = json.name + " - おのかちお's blog"
			document.querySelector("meta[property='og:title']").setAttribute('content', json.name + " - おのかちお's blog")

		})
}

const RenderMarkdown = filename => {
		return fetch('https://static.katio.net/' + filename)
			.then( (response) => {
				if( response.ok !== true ) {
					return fetch('https://static.katio.net/post/404.md')
						//.then( (response) => response.body.getReader() )
						.then( (response) => response.text() )
				} else {
					//return response.body.getReader()
					return response.text()
				}
			})
			/*
			.then( reader => {

				let text = '';

				const decoder = new TextDecoder();
				const readText = () => {
					return reader.read().then( ({done, value}) => {
						if(done) return text;
						text = decoder.decode(value);
						console.log('load bytes:' + text.length)
						return readText();
					})
				}

				return readText();

				//return text;
			})
			*/
			.then ( (text) => {
				const metadata = yamlFront.safeLoadFront(text)
				const content = metadata.__content
				const html = marked(content, { renderer: renderer })
				document.getElementById("markdown").textContent = ''
				document.getElementById("markdown").insertAdjacentHTML('afterbegin',html)

				const hackmd_title_regex = /^\n*(.+)\n=+/
				const markdown_title_regex = /^\n*# (.+)\n/

				const summary = content.replace(hackmd_title_regex,'') // remove (title \n ===)
					.replace(markdown_title_regex,'')          // remove (# title\n)
					.replace(/\n#+ /g,'\n')         // remove markdown sharp
					.replace(/`/g,'')               // remove markdown back quote`
					.replace(/^ +- /g,'')           // remove markdown hyphen
					.replace(/\!?\[.*\]\((.+)\)/g,'$1') // remove markdown link
					.replace(/:[a-zA-Z]+:/g,'')     // remove emoji
					.replace(/\n/g,' ')             // replace newline to space
					.replace(/^ +/,'')              // delete prefix space
					.slice(0,100)


				document.querySelector("meta[name='description']").setAttribute('content', summary)
				document.querySelector("meta[property='og:description']").setAttribute('content', summary)

				let title;
				let result;
				if( metadata.title !== undefined ){
					title = metadata.title
				}else if( ( result = content.match(hackmd_title_regex) ) !== null){
					title = result[0].replace(hackmd_title_regex,'$1')
				}else if( ( result = content.match(markdown_title_regex)) !== null){
					title = result[0].replace(markdown_title_regex,'$1')
				}else{
					title = ''
				}

				document.title = title + " - おのかちお's blog"
				document.querySelector("meta[property='og:title']").setAttribute('content', title + " - おのかちお's blog")
				document.getElementById("editgithub").textContent = 'Pull Request this page on github'
				document.getElementById("editgithub").setAttribute("href", "https://github.com/onokatio-blog/blog/blob/master/" + filename)
			})
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

			return RenderMarkdown(filename)
		} else {
			return RenderMarkdown('post/404.md')
		}
	})().then( () => {
		const text = document.getElementById('markdown')
		text.innerHTML = joypixels.shortnameToUnicode(text.innerHTML)

		// Array.prototype.forEach.call(text.getElementsByTagName('a'), (element) => {

		Array.from(text.getElementsByTagName('a')).forEach( element => {
			//TODO see domain and use smooth for adc link
			if( element.pathname.startsWith('/page/') || ( element.pathname === '/' && element.hash === "" ) ) element.addEventListener('click', smoothJump )
		})

	})

}
const createCard = (filename,title,summary) => {
	const articleTitle = document.createElement("h5")
	articleTitle.className = "card-title"
	articleTitle.textContent = title

	const articleSummary = document.createElement("p")
	articleSummary.className = "card-text"
	articleSummary.textContent = summary + '...'

	const articleLink = document.createElement("a")
	articleLink.className = "card-link"
	articleLink.href = "/page/" + filename.replace(/\.md$/,'')
	articleLink.textContent = "Read more"

	const articleBody = document.createElement("div")
	articleBody.className = "card-body"
	articleBody.appendChild(articleTitle)
	articleBody.appendChild(articleSummary)
	articleBody.appendChild(articleLink)

	const card = document.createElement("div")
	card.className = "card"
	card.appendChild(articleBody)

	return card
}

const createCalandarEntry = (url,title,summary) => {

	const articleBody = document.createElement("div")
	articleBody.className = "card-body"

	const articleTitle = document.createElement("h5")
	articleTitle.className = "card-title"
	articleTitle.textContent = title
	articleBody.appendChild(articleTitle)

	const articleSummary = document.createElement("p")
	articleSummary.className = "card-text"
	articleSummary.textContent = summary
	articleBody.appendChild(articleSummary)

	if( url !== null){
		const articleLink = document.createElement("a")
		articleLink.className = "card-link"
		articleLink.href = url
		articleLink.textContent = "Read more"
		articleBody.appendChild(articleLink)
	}


	const card = document.createElement("div")
	card.className = "card"
	card.appendChild(articleBody)

	return card
}

document.getElementById('gobacklink').addEventListener('click', smoothJump )

window.onhashchange = hashChangeEvent
window.onpopstate = UpdatePageFromUrl

UpdatePageFromUrl()

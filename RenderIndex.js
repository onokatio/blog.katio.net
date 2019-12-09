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

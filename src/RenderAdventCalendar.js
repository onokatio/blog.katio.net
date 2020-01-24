"use strict";

const RenderAdventCalendar = () => {
	return fetch('https://blog.katio.net/resource/adventcalendar/2019/onokatio.json')
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

			for(let i=1; i <= 25; i++){
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

export default RenderAdventCalendar

"use strict";

//import ArticleItem from "./components/ArticleItem.jsx"
import ArticleList from "./components/ArticleList.jsx"

const RenderIndex = () => {
	return fetch('https://static.katio.net/dynamic/markdownlist')
		.then( (response) => response.json() )
		.then( async (json) => {
			const { default: React } = await import(/* webpackChunkName: "react" */ "react")
			const { default: ReactDOM } = await import(/* webpackChunkName: "react-dom" */ "react-dom")

			document.getElementById("editgithub").setAttribute("href", "https://github.com/onokatio/blog.katio.net")
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


			const items = json.filter( contentAndFilename => contentAndFilename.filename !== '404.md' ).map( ({filename,title,summary}) => {
					const link = "/page/" + filename.replace(/\.md$/,'')
					return {link, title, summary}
			})

			ReactDOM.render(<ArticleList items={items}/>, document.getElementById("articleList"))

			document.querySelector("meta[name='description']").setAttribute('content', '記事一覧')
			document.querySelector("meta[property='og:description']").setAttribute('content', '記事一覧')
			document.title = "記事一覧 - おのかちお's blog"
			document.querySelector("meta[property='og:title']").setAttribute('content', "記事一覧 - おのかちお's blog")

		})
}

export default RenderIndex

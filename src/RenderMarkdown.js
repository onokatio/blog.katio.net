"use strict";

import 'highlight.js/styles/solarized-dark.css'

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
			.then ( async (text) => {
				const { default: marked } = await import(/* webpackChunkName: "marked" */ "marked")
				const yamlFront = await import(/* webpackChunkName: "yaml-front-matter" */ "yaml-front-matter")

				const { default: hljs } = await import(/* webpackChunkName: "highlight" */ "highlight.js/lib/highlight.js")
				const { default: lang_javascript } = await import(/* webpackChunkName: "highlight-lang-javascript" */ "highlight.js/lib/languages/javascript.js")
				const { default: lang_shell } = await import(/* webpackChunkName: "highlight-lang-shell" */ "highlight.js/lib/languages/shell.js")
				hljs.registerLanguage('javascript', lang_javascript)
				hljs.registerLanguage('shell', lang_shell)

				marked.setOptions({
					langPrefix: 'hljs ',
					highlight: (code) => hljs.highlightAuto(code).value,
				})

				const metadata = yamlFront.safeLoadFront(text)
				const content = metadata.__content
				const html = marked(content)
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

export default RenderMarkdown

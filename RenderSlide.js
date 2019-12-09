"use strict";

const RenderSlide = filename => {
		return fetch('https://static.katio.net/' + filename)
			.then( (response) => {
				return response.text()
			})
			.then ( (text) => {
				const revealdiv = document.createElement("div")
				revealdiv.className = "reveal"

				const slide = document.createElement("div")
				slide.className = "slides"

				const section = document.createElement("section")
				section.setAttribute("data-markdown","")
				section.setAttribute("data-separator","----")
				section.innerText = text

				slide.appendChild(section)
				revealdiv.appendChild(slide)

				const markdown = document.getElementById("markdown")
				markdown.innerText = ''
				document.getElementsByClassName("container")[0].insertBefore(revealdiv, markdown)

				Reveal.initialize({
					dependencies: [
						{ src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.8.0/plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
						{ src: 'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.8.0/plugin/markdown/markdown.min.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
					]
				})
			})
}

import React from "react"
import ArticleItem from "./ArticleItem.jsx"

export default class ArticleList extends React.Component {
	render() {
			return (
				<ul>
					{
						this.props.items.map( (item) => {
						return (
							<li className="ArticleItem card">
								<div className="card-body">
									<h5 className="card-title">{item.title}</h5>
									<p className="card-text">{item.summary}</p>
									<a className="card-link" href={item.link}>Read more</a>
								</div>
							</li>
						)
						})
					}
				</ul>
			)
	}
}

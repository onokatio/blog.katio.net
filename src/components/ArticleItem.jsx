import React from "react"

export default class ArticleItem extends React.Component {
	render() {
		return (
			<div className="ArticleItem card">
				<div className="card-body">
					<h5 className="card-title">{this.props.title}</h5>
					<p className="card-text">{this.props.summary}</p>
					<a className="card-link" href={this.props.link}>Read more</a>
				</div>
			</div>
		)
	}
}

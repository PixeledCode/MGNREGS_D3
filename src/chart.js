import React, { Component } from 'react'
import * as d3 from 'd3'

class Chart extends Component {
	componentDidMount() {
		this.drawChart()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.constituency !== this.props.constituency) {
			document.querySelector('.label').remove()
			document.querySelector('.district').remove()
			document.querySelector('.label').remove()
			document.querySelector('.main-g').remove()
			this.drawChart()
		}
	}

	drawChart() {
		const data = [
			{
				language: 'Opening Balance',
				value: this.props.opening_bal,
				color: '#00a2ee',
			},
			{
				language: 'Funds Available',
				value: this.props.total_funds,
				color: '#fbcb39',
			},
			{
				language: 'Expenditure-Wages',
				value: this.props.expenditure_wages,
				color: '#007bc8',
			},
			{
				language: 'Expenditure-Material',
				value: this.props.expenditure_materials,
				color: '#007bc8',
			},
			{
				language: 'Grand Expenditure',
				value: this.props.total_expenditure,
				color: '#65cedb',
			},
			{
				language: 'Unspent Balance',
				value: this.props.unspent_bal,
				color: '#ff6e52',
			},
			{
				language: 'Payment Due',
				value: this.props.payment_due,
				color: '#f9de3f',
			},
		]

		const svg = d3.select('#chart')
		const chartDOM = document.querySelector('#container')
		const margin = 80
		const width = chartDOM.clientWidth - margin
		const height = chartDOM.clientHeight - margin * 3

		const chart = svg.append('g').attr('class', 'main-g')
		// .attr('transform', `translate(${margin}, ${margin/3})`)

		const xScale = d3
			.scaleBand()
			.range([0, width])
			.domain(data.map((s) => s.language))
			.padding(0.3)

		const yScale = d3.scaleLinear().range([height, 0]).domain([0, 200])

		const makeYLines = () => d3.axisLeft().scale(yScale)

		chart
			.append('g')
			.attr('class', 'alt-g')
			.attr('transform', `translate(0, ${height})`)
			.call(d3.axisBottom(xScale))

		chart.append('g').call(d3.axisLeft(yScale))

		chart
			.append('g')
			.attr('class', 'grid')
			.call(makeYLines().tickSize(-width, 0, 0).tickFormat(''))

		const barGroups = chart.selectAll().data(data).enter().append('g')

		barGroups
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (g) => xScale(g.language))
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))
			.attr('width', xScale.bandwidth())

		barGroups
			.append('text')
			.attr('class', 'value')
			.attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.attr('text-anchor', 'middle')
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)

		svg
			.append('text')
			.attr('class', 'label budget')
			.attr('x', -(height / 2) - margin * 1.4)
			.attr('y', margin / 2.4)
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'middle')
			.text('Budget (10 Crore INR)')

		svg
			.append('text')
			.attr('class', 'label')
			.attr('x', width - margin * 3)
			.attr('y', height + margin * 2.8)
			.attr('text-anchor', 'middle')
			.text('Category')
      
		barGroups
			.append('text')
			.attr('class', 'district')
			.attr('x', width - margin  * 3)
			.attr('y', height - margin * 3)
			.attr('text-anchor', 'middle')
			.text(this.props.constituency)
	}

	render() {
		return (
			<div id="container">
				<svg id={'chart'} />
			</div>
		)
	}
}

export default Chart

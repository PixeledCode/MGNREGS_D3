import React, { Component } from 'react'
import * as d3 from 'd3'

class Chart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			constituency: '',
		}
	}
	componentDidMount() {
		this.drawChart()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.constituency !== this.props.constituency) {
			this.setState({
				constituency: this.props.constituency,
			})
			this.updateChart()
		}
	}

	drawChart() {
		const data = [
			{
				category: 'Opening Balance',
				value: this.props.opening_bal,
			},
			{
				category: 'Funds Available',
				value: this.props.total_funds,
			},
			{
				category: 'Expenditure-Wages',
				value: this.props.expenditure_wages,
			},
			{
				category: 'Expenditure-Material',
				value: this.props.expenditure_materials,
			},
			{
				category: 'Grand Expenditure',
				value: this.props.total_expenditure,
			},
			{
				category: 'Unspent Balance',
				value: this.props.unspent_bal,
			},
			{
				category: 'Payment Due',
				value: this.props.payment_due,
			},
		]

		const svg = d3.select('#chart')
		const chartDOM = document.querySelector('#container')
		const margin = 80
		const width = chartDOM.clientWidth - margin
		const height = chartDOM.clientHeight - margin * 3

		const chart = svg.append('g').attr('class', 'main-g')

		const xScale = d3
			.scaleBand()
			.range([0, width])
			.domain(data.map((s) => s.category))
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
			.attr('x', (g) => xScale(g.category))
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))
			.attr('width', xScale.bandwidth())

		barGroups
			.append('text')
			.attr('class', 'value')
			.attr('x', (a) => xScale(a.category) + xScale.bandwidth() / 2)
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.attr('text-anchor', 'middle')
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)

		svg
			.append('text')
			.attr('class', 'label budget')
			.attr('x', -(height / 2) - margin / 2)
			.attr('y', (width / margin) * 3)
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'middle')
			.text('Budget ( x10 Crore INR )')
	}

	updateChart() {
		const newData = [
			{
				value: this.props.opening_bal,
			},
			{
				value: this.props.total_funds,
			},
			{
				value: this.props.expenditure_wages,
			},
			{
				value: this.props.expenditure_materials,
			},
			{
				value: this.props.total_expenditure,
			},
			{
				value: this.props.unspent_bal,
			},
			{
				value: this.props.payment_due,
			},
		]
		const margin = 80
		const chartDOM = document.querySelector('#container')
		const height = chartDOM.clientHeight - margin * 3
		const yScale = d3.scaleLinear().range([height, 0]).domain([0, 200])

		const bar = d3.selectAll('.bar').data(newData).transition().duration(200)
		bar
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))

		const value = d3
			.selectAll('.value')
			.data(newData)
			.transition()
			.duration(200)
		value
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)
	}

	render() {
		return (
			<div id="container">
				<h1>MGNREGS (2019-20)</h1>
				<section>
					<p>
						Data Visualization to analyse expenditures for Mahatma Gandhi
						National Rural Employment Guarantee Scheme (MGNREGS) in
						parliamentary constituencies of Odisha for the financial year
						2019-20.
					</p>
					<p id="info">Click on map to display expenditures</p>
				</section>

				<h3>{this.state.constituency}</h3>
				<svg id={'chart'} viewBox="0 0 400 500" />
			</div>
		)
	}
}

export default Chart

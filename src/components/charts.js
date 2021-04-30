import React, { Component } from 'react'
import * as d3 from 'd3'

class Charts extends Component {
	constructor(props) {
		super(props)
		this.state = {
			constituency: '',
			opening_bal: 0,
			total_funds: 0,
			expenditure_wages: 0,
			expenditure_materials: 0,
			total_expenditure: 0,
			unspent_bal: 0,
			payment_due: 0,
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
			},
			{
				language: 'Funds Available',
				value: this.props.total_funds,
			},
			{
				language: 'Expenditure-Wages',
				value: this.props.expenditure_wages,
			},
			{
				language: 'Expenditure-Material',
				value: this.props.expenditure_materials,
			},
			{
				language: 'Grand Expenditure',
				value: this.props.total_expenditure,
			},
			{
				language: 'Unspent Balance',
				value: this.props.unspent_bal,
			},
			{
				language: 'Payment Due',
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
			.attr('x', -(height / 2) - margin / 2)
			.attr('y', (width / margin) * 3)
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'middle')
			.text('Budget (10 Crore INR)')
	}

	render() {
		
		return (
			<div id="container">
				<h1>MGNREGS (2019-20)</h1>
				<p>
					Data Visualization to analyse expenditures for Mahatma Gandhi National
					Rural Employment Guarantee Scheme (MGNREGS) in parliamentary
					constituencies of Odisha for the financial year 2019-20.
				</p>
				<h3>{this.state.constituency}</h3>
				<svg id={'chart'} viewBox="0 0 400 500" />
			</div>
		)
	}
}

export default Charts

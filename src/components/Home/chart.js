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
				category: 'Expenditure Wages',
				value: this.props.expenditure_wages,
			},
			{
				category: 'Expenditure Material',
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

		function mouseOverHandler(d, i) {
			d3.select('.tooltip-area').style('visibility', 'visible')
		}

		function mouseOutHandler(d, i) {
			d3.select('.tooltip-area').style('visibility', 'hidden')
		}

		const mousemove = (d, i) => {
			console.log(i.category);
			d3.select('.tooltip-text-category1').text(i.category.split(' ')[0])
			d3.select('.tooltip-text-category2').text(i.category.split(' ')[1])
			d3.select('.tooltip-text-value1').text(
				i.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			)
			d3.select('.tooltip-text-value2').text('INR')
			const [x, y] = d3.pointer(d)

			d3.select('.tooltip-area').attr('transform', `translate(${x}, ${y})`)
		}
		
		const chartDOM = document.querySelector('#svgContainer')
		const margin = 80
		const width = chartDOM.clientWidth 
		const height = chartDOM.clientHeight

		const svg = d3.select('#chart').classed('svg-container', true)
		.attr('preserveAspectRatio', 'xMinYMin meet')
		.attr('viewBox', `0 0 ${width} ${height + 150}`)

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
			.on('mouseover', mouseOverHandler)
			.on('mouseout', mouseOutHandler)
			.on('mousemove', mousemove)
			

		svg
			.append('text')
			.attr('class', 'label budget')
			.attr('x', -(height / 2) - margin / 2)
			.attr('y', (width / margin) * 3)
			.attr('transform', 'rotate(-90)')
			.attr('text-anchor', 'middle')
			.text('Expenditures')

		// Tool-tip
		svg
			.append('g')
			.attr('class', 'tooltip-area')
			.append('path')
			.style('fill', 'white')
			.style('stroke', '#999')
			.attr('stroke-width', '1px')
			.attr(
				'd',
				'M2.5,11.513496398925781 L2.5,11.513496398925781 C2.5,6.535900115966797 6.4405975341796875,2.5 11.301300048828125,2.5 L15.303199768066406,2.5 L15.303199768066406,2.5 L34.508995056152344,2.5 L70.51799011230469,2.5 C72.85198974609375,2.5 75.08999633789062,3.449298858642578 76.74200439453125,5.140098571777344 C78.39299011230469,6.830799102783203 79.31999206542969,9.123699188232422 79.31999206542969,11.513496398925781 L79.31999206542969,58.0469970703125 L79.31999206542969,58.0469970703125 L79.31999206542969,71.56700134277344 L79.31999206542969,71.56700134277344 C79.31999206542969,76.54499816894531 75.37899780273438,80.58099365234375 70.51799011230469,80.58099365234375 L46.508995056152344,80.58099365234375 L38.41899871826172,92.5 L32.303199768066406,80.58099365234375 C35.969200134277344,80.58099365234375 12.635299682617188,80.58099365234375 11.301300048828125,80.58099365234375 C6.4405975341796875,80.58099365234375 2.5,76.54499816894531 2.5,71.56700134277344 L2.5,71.56700134277344 L2.5,58.0469970703125 L2.5,58.0469970703125 L2.5,11.513496398925781 z'
			)
			.attr('transform', 'rotate(0,0,100)translate(30, -50)')

			d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-category1')
			.attr('transform', function (d, i) {
				return 'translate(35, -35)'
			})

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-category2')
			.attr('transform', function (d, i) {
				return 'translate(35, -20)'
			})

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-value1')
			.attr('transform', function (d, i) {
				return 'translate(34, 5)'
			})

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-value2')
			.attr('transform', function (d, i) {
				return 'translate(35, 20)'
			})
	}

	updateChart() {
		const newData = [
			{
				category: 'Opening Balance',
				value: this.props.opening_bal,
			},
			{
				category: 'Funds Available',
				value: this.props.total_funds,
			},
			{
				category: 'Expenditure Wages',
				value: this.props.expenditure_wages,
			},
			{
				category: 'Expenditure Material',
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
		const chartDOM = document.querySelector('#svgContainer')
		const height = chartDOM.clientHeight
		const yScale = d3.scaleLinear().range([height, 0]).domain([0, 200])

		const bar = d3.selectAll('.bar').data(newData).transition().duration(200)
		bar
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))



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
					<p id="info">Click on map to populate chart</p>
					<p id="info">Hover on map to display expenditures</p>
				</section>
				<section className="details">
				<h3>{this.state.constituency}</h3>
				<p>( x10 Crore &#x20B9; )</p>
				</section>
				<section id="svgContainer">
					<svg id={'chart'} />
				</section>
			</div>
		)
	}
}

export default Chart

import React, { Component } from 'react'
import * as d3 from 'd3'
import data from 'assets/data.json'

const data1 = [
	{
		id: 'opening_bal',
		language: 'Opening Balance',
		value: 0,
	},
	{
		id: 'total_funds',
		language: 'Funds Available',
		value: 0,
	},
	{
		id: 'expenditure_wages',
		language: 'Expenditure Wages',
		value: 0,
	},
	{
		id: 'expenditure_materials',
		language: 'Expenditure Material',
		value: 0,
	},
	{
		id: 'total_expenditure',
		language: 'Grand Expenditure',
		value: 0,
	},
	{
		id: 'unspent_bal',
		language: 'Unspent Balance',
		value: 0,
	},
	{
		id: 'payment_due',
		language: 'Payment Due',
		value: 0,
	},
]

const data2 = [
	{
		id: 'opening_bal',
		language: 'Opening Balance',
		value: 0,
	},
	{
		id: 'total_funds',
		language: 'Funds Available',
		value: 0,
	},
	{
		id: 'expenditure_wages',
		language: 'Expenditure Wages',
		value: 0,
	},
	{
		id: 'expenditure_materials',
		language: 'Expenditure Material',
		value: 0,
	},
	{
		id: 'total_expenditure',
		language: 'Grand Expenditure',
		value: 0,
	},
	{
		id: 'unspent_bal',
		language: 'Unspent Balance',
		value: 0,
	},
	{
		id: 'payment_due',
		language: 'Payment Due',
		value: 0,
	},
]

class Chart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			constituency: '',
			district1: 'Aska',
			district2: 'Bargarh',
		}
	}
	componentDidMount() {
		document.querySelector('#districtSelector2').value = this.state.district2
		this.drawChart()
	}

	drawChart() {
		// updating objects for chart
		for (let val of data1) val['value'] = data[this.state.district1][val['id']]
		for (let val of data2) val['value'] = data[this.state.district2][val['id']]

		function mouseOverHandler(d, i) {
			d3.select('.tooltip-area').style('visibility', 'visible')
		}

		function mouseOutHandler(d, i) {
			d3.select('.tooltip-area').style('visibility', 'hidden')
		}

		const mousemove = (d, i) => {
			d3.select('.tooltip-text-category1').text(i.language.split(' ')[0])
			d3.select('.tooltip-text-category2').text(i.language.split(' ')[1])
			d3.select('.tooltip-text-value1').text(
				i.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			)
			d3.select('.tooltip-text-value2').text('INR')
			const [x, y] = d3.pointer(d)

			d3.select('.tooltip-area').attr('transform', `translate(${x}, ${y})`)
		}

		const chartDOM = document.querySelector('#svgContainer')
		const width = chartDOM.clientWidth
		const height = chartDOM.clientHeight - 150

		const svg = d3
			.select('#chart')
			.classed('svg-container', true)
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', `0 0 ${width} ${height - 100}`)
			.classed('svg-content-responsive', true)

		const xScale = d3
			.scaleBand()
			.range([0, width])
			.domain(data1.map((s) => s.language))
			.padding(0.3)

		const yScale = d3.scaleLinear().range([height, 0]).domain([0, 200])

		const chart1 = svg.append('g').attr('class', 'main-g')
		chart1
			.append('g')
			.attr('class', 'alt-g')
			.attr('transform', `rotate(0) translate(0, ${height + 100})`)
			.call(d3.axisBottom(xScale))

		// 1st Bar Chart
		const barGroups = chart1.selectAll().data(data1).enter().append('g')
		barGroups
			.append('rect')
			.attr('class', 'bar')
			.attr('x', (g) => xScale(g.language))
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))
			.attr('width', xScale.bandwidth() / 2)
			.attr('transform', `translate(0,100)`)
			.on('mouseover', mouseOverHandler)
			.on('mouseout', mouseOutHandler)
			.on('mousemove', mousemove)

		barGroups
			.append('text')
			.attr('class', 'value')
			.attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.attr('text-anchor', 'middle')
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)
			.attr('transform', `translate(-30,100)`)

		// 2nd Bar Chart
		const chart2 = svg.append('g').attr('class', 'main-g second-g')
		const barGroups2 = chart2.selectAll().data(data2).enter().append('g')
		barGroups2
			.append('rect')
			.attr('class', 'bar2')
			.attr('x', (g) => xScale(g.language))
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))
			.attr('width', xScale.bandwidth() / 2)
			.attr('transform', `translate(${xScale.bandwidth() / 2 - 1}, 100)`)
			.on('mouseover', mouseOverHandler)
			.on('mouseout', mouseOutHandler)
			.on('mousemove', mousemove)

		barGroups2
			.append('text')
			.attr('class', 'value2')
			.attr('x', (a) => xScale(a.language) + xScale.bandwidth() / 2)
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.attr('text-anchor', 'middle')
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)
			.attr('transform', `translate(${xScale.bandwidth() / 4}, 100)`)

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
			.attr('transform', 'rotate(0,0,100)translate(-35, -90)')

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-category1')
			.attr('transform', function (d, i) {
				return 'translate(-25, -70)'
			})

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-category2')
			.attr('transform', function (d, i) {
				return 'translate(-25, -55)'
			})

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-value1')
			.attr('transform', function (d, i) {
				return 'translate(-29, -30)'
			})

		d3.select('.tooltip-area')
			.append('text')
			.attr('class', 'tooltip-text-value2')
			.attr('transform', function (d, i) {
				return 'translate(-5, -15)'
			})
	}

	updateChart() {
		for (let val of data1) val['value'] = data[this.state.district1][val['id']]
		for (let val of data2) val['value'] = data[this.state.district2][val['id']]

		const chartDOM = document.querySelector('#svgContainer')
		const height = chartDOM.clientHeight - 150
		const yScale = d3.scaleLinear().range([height, 0]).domain([0, 200])

		const bar1 = d3.selectAll('.bar').data(data1).transition().duration(200)
		bar1
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))

		const bar2 = d3.selectAll('.bar2').data(data2).transition().duration(200)
		bar2
			.attr('y', (g) => yScale(g.value / 10000000))
			.attr('height', (g) => height - yScale(g.value / 10000000))

		const value1 = d3.selectAll('.value').data(data1).transition().duration(200)
		value1
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)

		const value2 = d3
			.selectAll('.value2')
			.data(data2)
			.transition()
			.duration(200)
		value2
			.attr('y', (a) => yScale(a.value / 10000000) - 10)
			.text((a) => `${(a.value / 10000000).toFixed(2)} Cr`)
	}

	render() {
		const districts = Object.keys(data)
		return (
			<div id="compareContainer">
				<section className="heading">
					<h1>MGNREGS (2019-20) Compare Chart</h1>
					<p>
						Select any two constituencies to compare their expenditures
						(&#x20B9;)
					</p>
				</section>

				<section className="selector-section">
					<select
						className="selector"
						id="districtSelector1"
						onChange={(e) => this.setState({ district1: e.target.value })}
					>
						{districts.map((val) => (
							<option key={val + '-d1'} value={val}>
								{val}
							</option>
						))}
					</select>
					<select
						className="selector"
						id="districtSelector2"
						onChange={(e) => this.setState({ district2: e.target.value })}
					>
						{districts.map((val) => (
							<option key={val + '-d2'} value={val}>
								{val}
							</option>
						))}
					</select>
					<button onClick={() => this.updateChart()} id="compareButton">
						COMPARE
					</button>
					<p id="info">Click/Hover on bar to display expenditures</p>
				</section>
				<section id="svgContainer">
					<svg id={'chart'} />
				</section>
			</div>
		)
	}
}

export default Chart

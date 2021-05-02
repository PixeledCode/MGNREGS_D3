import React, { Component } from 'react'
import * as d3 from 'd3'
import odisha from 'assets/odihsa'
import data from 'assets/data.json'

const getColorByValue = (val, hue, range) => {
	const getLightness = (val) => {
		if (range === 'Lakhs') {
			if (val === 0) return 95
			if (val < 1) return 85
			if (val < 51) return 75
			if (val < 101) return 65
			if (val < 501) return 55
			if (val >= 501) return 45
		} else {
			if (val < 11) return 85
			if (val < 51) return 75
			if (val < 101) return 65
			if (val < 150) return 55
			if (val >= 150) return 45
		}
	}

	const color = getLightness(val)
	return `hsl(${hue}, 100%, ${color}%)`
}

const categories = {
	opening_bal: 'Opening Balance',
	total_funds: 'Funds Available',
	expenditure_wages: 'Expenditure Wages',
	expenditure_materials: 'Expenditure Materials',
	total_expenditure: 'Grand Expenditure',
	unspent_bal: 'Unspent Balance',
	payment_due: 'Payment Due',
}
class Filter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hue: 200,
			lightness: [95, 85, 75, 65, 55, 45],
			rangeArray: ['0', '1<', '1-50', '51-100', '101-500', '500+'],
			rangeText: 'Lakhs',
			rangeValue: 100000,
			category: 'opening_bal',
		}
	}

	componentDidMount() {
		this.drawMap()
	}

	componentDidUpdate() {
		this.updateMap()
	}

	updateCategory(value) {
		const blue = ['opening_bal', 'unspent_bal', 'payment_due']
		const purple = ['total_funds', 'total_expenditure']

		if (blue.includes(value)) {
			this.setState({
				hue: 200,
				lightness: [95, 85, 75, 65, 55, 45],
				rangeText: 'Lakhs',
				rangeValue: 100000,
				rangeArray: ['0', '1<', '1-50', '51-100', '101-500', '500+'],
			})
		} else {
			if (purple.includes(value)) this.setState({ hue: 248 })
			else this.setState({ hue: 350 })
			this.setState({
				lightness: [85, 75, 65, 55, 45],
				rangeText: 'Crores',
				rangeValue: 10000000,
				rangeArray: ['1-10', '11-50', '51-100', '101-150', '150+'],
			})
		}
		this.setState({ category: value })
	}

	updateMap() {
		const hue = this.state.hue
		const range = this.state.rangeValue
		const rangeText = this.state.rangeText
		const budget = {}

		for (let val in data) {
			budget[val] = data[val][this.state.category]
		}
		d3.selectAll('.svgDistrict')
			.transition()
			.duration(150)
			.attr('fill', function (d) {
				return getColorByValue(
					budget[d.properties.pc_name] / range,
					hue,
					rangeText
				)
			})
	}

	drawMap() {
		const WIDTH = window.innerWidth
		const HEIGHT = window.innerHeight
		const HOVER_COLOR = '#d36f80'
		let fitSVG = WIDTH / 3
		if (WIDTH < 780) fitSVG = 0
		const budget = {}
		// --------------- Event handler ---------------

		function mouseOverHandler() {
			d3.select(this).attr('stroke', HOVER_COLOR).attr('stroke-width', 1)
			d3.select('.tooltip-area').style('visibility', 'visible')
		}

		function mouseOutHandler() {
			d3.select(this).attr('stroke', '#fff').attr('stroke-width', 0.5)
			d3.select('.tooltip-area').style('visibility', 'hidden')
		}

		const mousemove = (d, i) => {
			d3.select('.tooltip-text-category1').text(
				`${categories[this.state.category].split(' ')[0]}`
			)
			d3.select('.tooltip-text-category2').text(
				`${categories[this.state.category].split(' ')[1]}`
			)
			d3.select('.tooltip-text-value1').text(
				`${data[i.properties.pc_name][this.state.category]
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
			)
			d3.select('.tooltip-text-value2').text('INR')
			const [x, y] = d3.pointer(d)

			d3.select('.tooltip-area').attr('transform', `translate(${x}, ${y})`)
		}

		const svg = d3
			.select('#map__container')
			.classed('svg-container', true)
			.append('svg')
			.attr('preserveAspectRatio', 'xMinYMin meet')
			.attr('viewBox', `0 0 ${WIDTH} ${HEIGHT - 100}`)
			.classed('svg-content-responsive', true)

		const projection = d3.geoMercator().fitExtent(
			[
				[fitSVG, 0],
				[WIDTH, HEIGHT],
			],
			odisha
		)

		for (let val in data) {
			budget[val] = data[val][this.state.category]
		}
		const path = d3.geoPath().projection(projection)

		const hue = this.state.hue
		const range = this.state.rangeValue
		const rangeText = this.state.rangeText

		const g = svg.attr('class', 'svgMap')
		const renderMap = (root) => {
			g.append('g')
				.selectAll('path')
				.data(root.features)
				.enter()
				.append('path')
				.attr('class', 'svgDistrict')
				.attr('id', (d) => d.properties.pc_name)
				.attr('d', path)
				.attr('fill', function (d) {
					return getColorByValue(
						budget[d.properties.pc_name] / range,
						hue,
						rangeText
					)
				})
				.attr('stroke', '#FFF')
				.attr('stroke-width', 0.5)
				.on('mouseover', mouseOverHandler)
				.on('mouseout', mouseOutHandler)
				.on('mousemove', mousemove)

			g.append('g')
				.selectAll('text')
				.data(root.features)
				.enter()
				.append('text')
				.attr('class', 'svgDistrictName')
				.attr('transform', (d) => `translate(${path.centroid(d)})`)
				.attr('text-anchor', 'middle')
				.attr('font-size', 10)
				.text((d) => d.properties.pc_name)

			g.append('g')
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
		renderMap(odisha)
	}

	render() {
		return (
			<>
				<div id="container" className="filter-container">
					<h1>MGNREGS (2019-20)</h1>
					<p>
						Data Visualization to analyse expenditures for Mahatma Gandhi
						National Rural Employment Guarantee Scheme (MGNREGS) in
						parliamentary constituencies of Odisha for the financial year
						2019-20.
					</p>
					<div id="map-budget-key">
						{this.state.lightness.map((val, index) => {
							return (
								<div
									key={'mk-' + index}
									className="key-block"
									id={'mk-' + index}
								>
									<div
										className="key-color-block"
										style={{
											backgroundColor: `hsl(${this.state.hue}, 100%, ${val}%)`,
										}}
									></div>
									<div className="range">{this.state.rangeArray[index]}</div>
								</div>
							)
						})}
						<p className="range-value">
							Range is in <span>{this.state.rangeText}</span>
						</p>
					</div>
					<p id="info">Select a category to change data</p>
					<select
						id="district"
						onChange={(e) => this.updateCategory(e.target.value)}
					>
						<option value="opening_bal">Opening Balance</option>
						<option value="total_funds">Funds Available</option>
						<option value="expenditure_wages">Expenditure Wages</option>
						<option value="expenditure_materials">Expenditure Materials</option>
						<option value="total_expenditure">Grand Expenditure</option>
						<option value="unspent_bal">Unspent Balance</option>
						<option value="payment_due">Payment Due</option>
					</select>
				</div>
				<div id={'map__container'} className="filterMap"></div>
			</>
		)
	}
}

export default Filter

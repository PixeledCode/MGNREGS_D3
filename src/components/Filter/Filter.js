import React, { Component } from 'react'
import * as d3 from 'd3'
import odisha from 'assets/odihsa'
import data from 'assets/data.json'

class Filter extends Component {
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
			initial: true,
		}
	}

	componentDidMount() {
		this.drawMap()
	}

	drawMap() {
		const WIDTH = window.innerWidth
		const HEIGHT = window.innerHeight
		const HOVER_COLOR = '#d36f80'
		let fitSVG = WIDTH / 3
		if (WIDTH < 780) fitSVG = 0
		const budget = {}
		// --------------- Event handler ---------------

		function mouseOverHandler(d, i) {
			d3.select(this).attr('fill', HOVER_COLOR)
		}

		function mouseOutHandler(d, i) {
			d3.select(this).attr('fill', color)
		}

		const clickHandler = (d, i) => {
			if (document.querySelector('.selectedMap'))
				document.querySelector('.selectedMap').classList.remove('selectedMap')

			document.getElementById(i.properties.pc_name).classList.add('selectedMap')
			this.setState({
				initial: false,
				constituency: i.properties.pc_name,
				opening_bal: data[i.properties.pc_name]['opening_bal'],
				total_funds: data[i.properties.pc_name]['total_funds'],
				expenditure_wages: data[i.properties.pc_name]['expenditure_wages'],
				expenditure_materials:
					data[i.properties.pc_name]['expenditure_materials'],
				total_expenditure: data[i.properties.pc_name]['total_expenditure'],
				unspent_bal: data[i.properties.pc_name]['unspent_bal'],
				payment_due: data[i.properties.pc_name]['payment_due'],
			})
		}

		// Prepare SVG container for placing the map,
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

		d3.json('data.json', function (d) {
			budget.d.properties.pc_name = d.properties.pc_name['opening_bal']
		})

		// Prepare SVG path and color, import the
		// effect from above projection.
		const path = d3.geoPath().projection(projection)
		// const color = '#9ecae1'
		var color = d3
			.scaleThreshold()
			.domain(d3.range(2, 18))
			.range(d3.schemeBlues[6])
		// .domain([0, 5, 9])
		// .range(["blue", "yellow", "green"]);

		const g = svg.attr('class', 'svgMap')
		function renderMap(root) {
			// Draw districts and register event listeners
			g.append('g')
				.selectAll('path')
				.data(root.features)
				.enter()
				.append('path')
				.attr('class', 'svgDistrict')
				.attr('id', (d) => d.properties.pc_name)
				.attr('d', path)
				.attr('fill', color)
				// .attr("fill", function(d) {
				//   return color(d.Poverty = data.get(d.properties.pc_name)); })
				.attr('stroke', '#FFF')
				.attr('stroke-width', 0.5)
				.on('mouseover', mouseOverHandler)
				.on('mouseout', mouseOutHandler)
				.on('click', clickHandler)

			// Place name labels in the middle of a district
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
				.on('click', clickHandler)
		}

		renderMap(odisha)
	}

	render() {
		return (
			<>
				<div id={'map__container'}></div>
			</>
		)
	}
}

export default Filter

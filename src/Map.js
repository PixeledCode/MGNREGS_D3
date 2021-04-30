import React, { Component } from 'react'
import * as d3 from 'd3'
import odisha from './odihsa'
import data from './data.json'
import Chart from './chart'
class Map extends Component {
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
		const ZOOM_THRESHOLD = [0.5, 2]
		const OVERLAY_MULTIPLIER = 10
		const OVERLAY_OFFSET = OVERLAY_MULTIPLIER / 2 - 0.5
		const HOVER_COLOR = '#d36f80'

		// --------------- Event handler ---------------

		function zoomHandler(event) {
			g.attr('transform', event.transform)
		}

		function mouseOverHandler(d, i) {
			d3.select(this).attr('fill', HOVER_COLOR)
		}

		function mouseOutHandler(d, i) {
			d3.select(this).attr('fill', color)
		}

		const clickHandler = (d, i) => {
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
		// and overlay a transparent rectangle for better pan and zoom.
		const svg = d3
			.select('#map__container')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')

		const zoom = d3.zoom().scaleExtent(ZOOM_THRESHOLD).on('zoom', zoomHandler)

		const g = svg
			.call(zoom)
			.append('g')

			g.append('rect')
			.attr('width', WIDTH * OVERLAY_MULTIPLIER)
			.attr('height', HEIGHT * OVERLAY_MULTIPLIER)
			.attr(
				'transform',
				`translate(-${WIDTH * OVERLAY_OFFSET},-${HEIGHT * OVERLAY_OFFSET})`
			)
			.style('fill', 'none')
			.style('pointer-events', 'all')

		// Project GeoJSON from 3D to 2D plane, and set
		// projection config.
		const projection = d3
			.geoMercator()
			.center([84.400309, 20.761804])
			.scale(8000)
			.translate([WIDTH / 3, HEIGHT / 3])

		// Prepare SVG path and color, import the
		// effect from above projection.
		const path = d3.geoPath().projection(projection)
		const color = '#9ecae1'

		function renderMap(root) {
			// Draw districts and register event listeners
			g.append('g')
				.selectAll('path')
				.data(root.features)
				.enter()
				.append('path')
				.attr('class', 'svgDistrict')
				.attr('d', path)
				.attr('fill', color)
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
				<Chart
					constituency={this.state.constituency}
					opening_bal={this.state.opening_bal}
					total_funds={this.state.total_funds}
					expenditure_wages={this.state.expenditure_wages}
					expenditure_materials={this.state.expenditure_materials}
					total_expenditure={this.state.total_expenditure}
					unspent_bal={this.state.unspent_bal}
					payment_due={this.state.payment_due}
				/>
				<div id={'map__container'}></div>
			</>
		)
	}
}

export default Map

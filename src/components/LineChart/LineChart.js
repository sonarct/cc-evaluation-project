import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {select, scaleLinear, line, extent} from 'd3'

class LineChart extends Component {
  constructor (props) {
    super(props)
    this.createLineChart = this.createLineChart.bind(this)
  }

  componentDidMount () {
    this.createLineChart()
  }

  componentDidUpdate () {
    this.createLineChart()
  }

  createLineChart () {
    const {data, size} = this.props
    const svg = select(this.node)

    var x = scaleLinear()
      .rangeRound([0, size[0]])

    var y = scaleLinear()
      .rangeRound([size[1], 0])

    var line_ = line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))

    x.domain(extent(data, (d) => d.date))
    y.domain(extent(data, (d) => d.value))

    svg.select('g').remove()

    svg.append('g')
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line_)
  }

  render () {
    const {size} = this.props

    return (
      <svg
        ref={node => { this.node = node }}
        width={size[0]}
        height={size[1]}
      />
    )
  }
}

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    date: PropTypes.number
  })),
  size: PropTypes.arrayOf(PropTypes.number)
}

export default LineChart

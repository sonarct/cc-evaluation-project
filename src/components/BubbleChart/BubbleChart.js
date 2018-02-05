import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './bubbleChart.scss'
import { format, pack, hierarchy, select } from 'd3'

class BubbleChart extends Component {
  constructor (props) {
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount () {
    this.createBarChart()
  }

  componentDidUpdate () {
    this.createBarChart()
  }

  createBarChart () {
    const {size, data, onClick} = this.props

    if (!data.length) {
      return
    }

    const format_ = format(',d')

    const pack_ = pack()
      .size(size)
      .padding(1.5)

    const root = hierarchy({children: data})
      .sum((d) => d.value)

    select(this.node)
      .selectAll('.node')
      .remove()

    const node = select(this.node)
      .selectAll('.node')
      .data(pack_(root).leaves())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')

    node.on('click', (e) => onClick(e.data.name))

    node.append('circle')
      .attr('id', (d) => d.data.id)
      .attr('r', (d) => d.r)
      .style('fill', (d) => d.data.colour)

    node.append('clipPath')
      .attr('id', (d) => 'clip-' + d.data.id)
      .append('use')
      .attr('xlink:href', (d) => '#' + d.data.id)

    node.append('text')
      // .attr('clip-path', function (d) { return 'url(#clip-' + d.id + ')'; })
      .selectAll('tspan')
      .data((d) => [d.data.name])
      .enter().append('tspan')
      .attr('x', 0)
      .attr('y', 3)
      .text((d) => d)

    node.append('title')
      .text((d) => `${d.data.name}\n${d.data.language}\n${format_(d.data.value)} watchers`)
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

BubbleChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    value: PropTypes.number,
    name: PropTypes.string,
    language: PropTypes.string,
    colour: PropTypes.string
  })),
  onClick: PropTypes.func.isRequired,
  size: PropTypes.arrayOf(PropTypes.number)
}

export default BubbleChart

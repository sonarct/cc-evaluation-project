import React from 'react'
import PropTypes from 'prop-types'
import './background.scss'

const Background = (props) => (
  <div styleName='fullscreen'>
    <span>
      {props.text}
    </span>
  </div>
)

Background.propTypes = {
  text: PropTypes.string
}

export default Background

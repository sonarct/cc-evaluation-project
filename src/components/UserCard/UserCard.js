import React from 'react'
import PropTypes from 'prop-types'
import './userCard.scss'

const UserCard = props => {
  return (
    <div styleName='user-card'>
      <div styleName='header' />
      <a href={`https://github.com/${props.login}`} styleName='avatar' >
        <img src={props.avatar} alt={props.name} />
      </a>
      <div>
        <h1 styleName='name'>{props.name}</h1>
        <h3 styleName='location'>{props.location}</h3>
        <div styleName='status-wrap'>
          <ul styleName='status'>
            <StatusCell
              number={props.publicRepos}
              link={`https://github.com/${props.login}?tab=repositories`}
              description='repos'
            />
            <StatusCell
              number={props.publicGists}
              link={`https://gist.github.com/${props.login}`}
              description='gists'
            />
            <StatusCell
              number={props.followers}
              link={`https://github.com/${props.login}?tab=followers`}
              description='followers'
            />
          </ul>
        </div>
      </div>
    </div>
  )
}

const StatusCell = props => {
  return (
    <li styleName='status-cell'>
      <a href={props.link}>
        <strong styleName='status-number'>
          {props.number}
        </strong>
        {props.description}
      </a>
    </li>
  )
}

UserCard.propTypes = {
  avatar: PropTypes.string,
  followers: PropTypes.number,
  location: PropTypes.string,
  login: PropTypes.string,
  name: PropTypes.string,
  publicGists: PropTypes.number,
  publicRepos: PropTypes.number
}

StatusCell.propTypes = {
  link: PropTypes.string,
  number: PropTypes.number,
  description: PropTypes.string
}

export default UserCard

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LineChart from 'components/LineChart/LineChart'
import BubbleChart from 'components/BubbleChart/BubbleChart'
import UserCard from 'components/UserCard'
import Background from 'components/Background'

import './app.scss'

import Api from 'services/Api'
import { getLanguageColour } from 'services/helpers'
import {getUser, getRepoActivity, getRepos} from 'middleware/thunks'

const USER_LOGIN = 'tj'

class App extends Component {
  constructor (props) {
    super(props)

    this.api = new Api({errorHandler: this.errorHandler})
    this.login = 'tj'

    this.state = {
      ww: 500,
      wh: 500
    }
  }

  static propTypes = {
    getUser: PropTypes.func,
    getRepoActivity: PropTypes.func,
    getRepos: PropTypes.func,
    activity: PropTypes.arrayOf(PropTypes.shape({})),
    repos: PropTypes.arrayOf(PropTypes.shape({})),
    selectedRepo: PropTypes.string,
    user: PropTypes.shape({}),
    apiExceeded: PropTypes.bool,
    isLoading: PropTypes.bool
  }

  errorHandler = (e) => {
    this.setState({apiExceeded: true})
  }

  componentDidMount () {
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)

    this.props.getUser(USER_LOGIN)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
  }

  getRepos = () => {
    if (
      // this.props.page && 
      this.props.apiExceeded
    ) {
      return
    }

    this.props.getRepos()
  }

  onWindowResize = () => {
    this.setState({
      ww: window.innerWidth,
      wh: window.innerHeight
    })
  }

  onRepoClick = (repo) => {
    if (!repo) {
      return
    }

    this.props.getRepoActivity(repo)
  }

  render () {
    console.log('--- this.props', this.props)

    const {
      ww,
      wh
    } = this.state

    const {
      activity,
      repos,
      selectedRepo,
      user,
      apiExceeded,
      isLoading
    } = this.props

    const _repos = repos.map(r => ({
      colour: getLanguageColour(r.language),
      id: r.id,
      language: r.language,
      name: r.name,
      value: r.watchers
    }))

    const _activity = activity.all && activity.all.map((a, i) => ({
      date: i,
      value: a
    }))

    return (
      <div styleName='App'>
        {isLoading &&
          <Background
            text='Loading'
          />
        }

        {apiExceeded &&
          <Background
            text='Sorry, Github api rate limit exceeded for current IP'
          />
        }

        <div styleName='panel-left'>
          <UserCard
            {...user}
          />

          {_activity &&
            <div styleName='bottom-graph'>
              <h3 styleName='title'>
                {selectedRepo} - past year of activity
              </h3>
              <LineChart
                data={_activity}
                size={[ww * 0.26, wh * 0.0625]}
              />
            </div>
          }
        </div>

        <div styleName='main'>
          <h3 styleName='title'>
            Repositories
          </h3>
          <BubbleChart
            data={_repos}
            size={[ww * 0.73, wh * 0.9]}
            onClick={this.onRepoClick}
          />
        </div>

        <button onClick={this.getRepos}>
          load more repos
        </button>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  activity: state.app.activity,
  apiExceeded: state.app.apiExceeded,
  user: state.app.user,
  page: state.app.page,
  repos: state.app.repos,
  selectedRepo: state.app.selectedRepo,
  isLoading: state.app.isLoading
})

const mapDispatchToProps = (dispatch) => ({
  getUser: user => dispatch(getUser(user)),
  getRepos: () => dispatch(getRepos()),
  getRepoActivity: repo => dispatch(getRepoActivity(repo))
})

export default connect(mapStateToProps, mapDispatchToProps)(App)

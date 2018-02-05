import React, { Component } from 'react'
import LineChart from 'components/LineChart/LineChart'
import BubbleChart from 'components/BubbleChart/BubbleChart'
import UserCard from 'components/UserCard'
import Background from 'components/Background'
import './app.scss'
import Api from 'services/Api'
import { getLanguageColour } from 'services/helpers'

class App extends Component {
  constructor (props) {
    super(props)

    this.api = new Api({errorHandler: this.errorHandler})
    this.login = 'tj'

    this.state = {
      user: {
        avatar: '',
        followers: 0,
        login: '',
        name: '',
        publicGists: 0,
        publicRepos: 0
      },
      apiExceeded: false,
      isLoading: true,
      activity: [],
      repos: [],
      selectedRepo: '',
      ww: 500,
      wh: 500
    }
  }

  errorHandler = (e) => {
    this.setState({apiExceeded: true})
  }

  componentDidMount () {
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)

    this.api.request(`https://api.github.com/users/${this.login}`)
      .then(this.saveUserData)
      .then((reposUrl) => {
        this.api.request(`${reposUrl}?per_page=90`)
          .then(this.saveReposData)
          .then(this.getRepoActivity)
      })
      .catch(error => console.log(error))
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
  }

  saveUserData = (user) => {
    this.data = {
      user: user,
      repos: [],
      page: 1
    }

    this.setState({
      user: {
        avatar: user.avatar_url,
        location: user.location,
        login: user.login,
        name: user.name,
        followers: user.followers,
        publicRepos: user.public_repos,
        publicGists: user.public_gists
      }
    })

    return user.repos_url
  }

  saveReposData = (repos) => {
    this.data.repos.push(...repos)
    if (repos.length) {
      ++this.data.page

      this.setState({
        repos: this.data.repos.map(r => ({
          colour: getLanguageColour(r.language),
          id: r.id,
          language: r.language,
          name: r.name,
          value: r.watchers
        })),
        isLoading: false
      })

      return repos[0].name
    } else {
      this.data.page = 0
      return null
    }
  }

  getRepoActivity = (repo) => {
    if (!repo) {
      return
    }

    this.api.request(`https://api.github.com/repos/${this.login}/${repo}/stats/participation`)
      .then((e) => {
        this.setState({
          selectedRepo: repo,

          activity: e.all.map((a, i) => ({
            date: i,
            value: a
          }))
        })
      })
      .catch(error => console.log(error))
  }

  getRepos = () => {
    if (this.data.page && !this.state.apiExceeded) {
      this.api.request(`${this.data.user.repos_url}?per_page=90&page=${this.data.page}`)
        .then(this.saveReposData)
        .then(this.getRepoActivity)
    }
  }

  onWindowResize = () => {
    this.setState({
      ww: window.innerWidth,
      wh: window.innerHeight
    })
  }

  onRepoClick = (name) => {
    this.getRepoActivity(name)
  }

  render () {
    const {
      activity,
      repos,
      selectedRepo,
      user,
      ww,
      wh
    } = this.state

    return (
      <div styleName='App'>
        {this.state.isLoading &&
          <Background
            text='Loading'
          />
        }

        {this.state.apiExceeded &&
          <Background
            text='Sorry, Github api rate limit exceeded for current IP'
          />
        }

        <div styleName='panel-left'>
          <UserCard
            avatar={user.avatar}
            followers={user.followers}
            login={user.login}
            location={user.location}
            name={user.name}
            publicGists={user.publicGists}
            publicRepos={user.publicRepos}
          />

          {selectedRepo &&
            <div styleName='bottom-graph'>
              <h3 styleName='title'>
                {selectedRepo} - past year of activity
              </h3>
              <LineChart
                data={activity}
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
            data={repos}
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

export default App

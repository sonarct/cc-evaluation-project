import { GET_USER_DATA_SUCCESS } from 'constants/actionTypes'
import {
  GET_REPOS_DATA_SUCCESS,
  DATA_IS_LOADING,
  GET_REPO_ACTIVITY_SUCCESS,
  SELECT_REPO
} from '../constants/actionTypes'

const initialState = {
  user: {
    avatar: '',
    followers: 0,
    location: '',
    login: '',
    name: '',
    publicGists: 0,
    publicRepos: 0
  },
  activity: [],
  apiExceeded: false,
  isLoading: true,
  page: 1,
  repos: [],
  selectedRepo: ''
}

export default function app (state = initialState, action) {
  switch (action.type) {
    case GET_USER_DATA_SUCCESS:
      return {
        ...state,
        user: {
          avatar: action.user.avatar_url,
          followers: action.user.followers,
          location: action.user.location,
          login: action.user.login,
          name: action.user.name,
          publicGists: action.user.public_gists,
          publicRepos: action.user.public_repos,
          reposUrl: action.user.repos_url
        }
      }
    case GET_REPOS_DATA_SUCCESS:
      return {
        ...state,
        page: action.repos.length ? ++state.page : 0,
        repos: [...state.repos, ...action.repos]
      }
    case DATA_IS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }
    case GET_REPO_ACTIVITY_SUCCESS:
      return {
        ...state,
        activity: action.activity
      }
    case SELECT_REPO:
      return {
        ...state,
        selectedRepo: action.repo
      }
    default:
      return state
  }
}

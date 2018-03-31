import {
  DATA_IS_LOADING,
  FETCHING_DATA_FAILURE,
  GET_REPOS_DATA_SUCCESS,
  GET_USER_DATA_SUCCESS,
  GET_REPO_ACTIVITY_SUCCESS,
  SELECT_REPO
} from 'constants/actionTypes'

export const saveUserData = (userData) => ({
  type: GET_USER_DATA_SUCCESS,
  user: userData
})

export const handleError = (error) => ({
  type: FETCHING_DATA_FAILURE,
  error
})

export const dataIsLoading = (bool) => ({
  type: DATA_IS_LOADING,
  isLoading: bool
})

export const saveReposData = (repos) => ({
  type: GET_REPOS_DATA_SUCCESS,
  repos
})

export const saveRepoActivityData = (activity) => ({
  type: GET_REPO_ACTIVITY_SUCCESS,
  activity
})

export const selectRepo = (repo) => ({
  type: SELECT_REPO,
  repo
})

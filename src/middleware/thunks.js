import Api from 'services/Api'
import {
  saveUserData,
  handleError,
  dataIsLoading,
  saveReposData,
  saveRepoActivityData
} from 'actions/appActions'

const api = new Api({errorHandler: this.errorHandler})

export const getUserData = (username) => {
  return (dispatch) => {
    dispatch(dataIsLoading(true))

    api.request(`https://api.github.com/users/${username}`).then(
      userData => Promise.all([
        dispatch(saveUserData(userData)),
        dispatch(dataIsLoading(false))
      ]),
      error => dispatch(handleError(error))
    ).then(
      () => {
        console.log('invoke second then')
        return dispatch(getReposData())
      }
    )
  }
}

export const getReposData = () => {
  return (dispatch, getState) => {
    dispatch(dataIsLoading(true))

    api.request(`${getState().app.user.reposUrl}?per_page=90&page=${getState().app.page}`).then(
      repos => Promise.all([
        dispatch(saveReposData(repos)),
        dispatch(getRepoActivity(repos[0].name)),
        dispatch(dataIsLoading(false))
      ])
    )
  }
}

export const getRepoActivity = (repo) => {
  return (dispatch, getState) => {
    dispatch(dataIsLoading(true))

    api.request(`https://api.github.com/repos/${getState().app.user.login}/${repo}/stats/participation`).then(
      (activityData) => Promise.all([
        dispatch(saveRepoActivityData(activityData)),
        dispatch(dataIsLoading(false))
      ]),
      error => dispatch(handleError(error))
    )
  }
}

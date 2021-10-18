import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrMsg: false,
    errMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errMsg => {
    this.setState({showErrMsg: true, errMsg})
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const loginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginApiUrl, options)
    const loginResponseData = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(loginResponseData.jwt_token)
    } else {
      this.onSubmitFailure(loginResponseData.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showErrMsg, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-container">
        <div className="login-responsive-container">
          <div className="login-form-bg-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="login-website-logo"
            />
            <form
              className="login-form-container"
              onSubmit={this.onSubmitLoginForm}
            >
              <div className="login-input-container">
                <label htmlFor="username" className="login-label">
                  USERNAME
                </label>
                <input
                  id="username"
                  type="text"
                  className="login-input"
                  placeholder="Username"
                  onChange={this.onChangeUsername}
                />
              </div>
              <div className="login-input-container">
                <label htmlFor="password" className="login-label">
                  PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  className="login-input"
                  placeholder="Password"
                  onChange={this.onChangePassword}
                />
              </div>
              <button type="submit" className="login-button">
                Login
              </button>
              {showErrMsg && <p className="login-error-msg">*{errMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login

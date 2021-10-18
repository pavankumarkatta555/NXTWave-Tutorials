import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="header-nav-container">
      <div className="header-logo-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>
      </div>
      <div className="mobile-icons-container">
        <ul className="mobile-icons-list">
          <Link to="/" className="link-icon-item">
            <li>
              <AiFillHome color="#ffffff" />
            </li>
          </Link>
          <Link to="/jobs" className="link-icon-item">
            <li>
              <BsFillBriefcaseFill color="#ffffff" />
            </li>
          </Link>
          <Link to="/login">
            <li>
              <FiLogOut color="#ffffff" />
            </li>
          </Link>
        </ul>
      </div>
      <div className="header-list-items-logout-container">
        <ul className="header-list-items-container">
          <Link to="/" className="header-link-item">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="header-link-item">
            <li>Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          className="header-logout-btn"
          onClick={onClickLogoutBtn}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)

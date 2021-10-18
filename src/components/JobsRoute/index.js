import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {MdLocationOn} from 'react-icons/md'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {RiStarSFill} from 'react-icons/ri'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileApiStatusConstants: profileApiConstants.initial,
    profileDetails: {},
    jobDetailsApiStatus: profileApiConstants.initial,
    jobDetailsList: [],
    searchInput: '',
    radioInput: '',
    checkBoxInput: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  onChangeCheckBox = event => {
    const {checkBoxInput} = this.state
    const isInclude = checkBoxInput.includes(event.target.value)

    if (isInclude) {
      const index = checkBoxInput.indexOf(event.target.value)
      checkBoxInput.splice(index, 1)
      this.setState({checkBoxInput}, this.getJobDetails)
    } else {
      this.setState(
        prevState => ({
          checkBoxInput: [...prevState.checkBoxInput, event.target.value],
        }),
        this.getJobDetails,
      )
    }
  }

  onChangeRadioInput = event => {
    this.setState({radioInput: event.target.value}, this.getJobDetails)
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    this.getJobDetails()
  }

  onClickJobDetailsRetryBtn = () => {
    this.getJobDetails()
  }

  onClickRetryBtn = () => {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatusConstants: profileApiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const profileData = await response.json()
      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImgUrl: profileData.profile_details.profile_image_url,
        bio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatusConstants: profileApiConstants.success,
      })
    } else {
      this.setState({profileApiStatusConstants: profileApiConstants.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({jobDetailsApiStatus: profileApiConstants.inProgress})
    const {searchInput, radioInput, checkBoxInput} = this.state
    const employmentType = checkBoxInput.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const jobDetailsData = await response.json()

      const updatedJobDetailsData = jobDetailsData.jobs.map(eachItem => ({
        id: eachItem.id,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobDetailsList: updatedJobDetailsData,
        jobDetailsApiStatus: profileApiConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: profileApiConstants.failure})
    }
  }

  onSuccessProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImgUrl, bio} = profileDetails

    return (
      <>
        <div className="profile-details-bg">
          <div className="profile-details-responsive-container">
            <img src={profileImgUrl} alt={name} className="profile-image" />
            <h1 className="profile-name-heading">{name}</h1>
            <p className="profile-bio">{bio}</p>
          </div>
        </div>
        <hr className="hr-line" />
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader
        type="Rings"
        color="#ffffff"
        height="50"
        width="50"
        className="loader"
      />
    </div>
  )

  onFailureJobDetails = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="profile-retry-button"
        onClick={this.onClickJobDetailsRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  onFailureProfileDetails = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="profile-retry-button"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderDetailsList = () => {
    const {jobDetailsList} = this.state

    return (
      <ul className="job-details-list-container">
        {jobDetailsList.map(eachItem => {
          const {
            id,
            companyLogoUrl,
            employmentType,
            jobDescription,
            location,
            packagePerAnnum,
            rating,
            title,
          } = eachItem

          return (
            <Link key={id} to={`/jobs/${id}`} className="jobs-link-item">
              <li className="job-details-list-item">
                <div className="job-details-logo-title-rating-container">
                  <img
                    src={companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="jobs-title-rating-container">
                    <h1 className="jobs-company-title">{title}</h1>
                    <div className="jobs-rating-container">
                      <RiStarSFill color=" #fbbf24" className="star-icon" />
                      <p className="jobs-rating">{rating}</p>
                    </div>
                  </div>
                </div>
                <div className="jobs-location-type-salary-container">
                  <div className="jobs-location-type-container">
                    <div className="jobs-location-container">
                      <MdLocationOn color="#faf8fc" className="icons" />
                      <p className="jobs-location">{location}</p>
                    </div>
                    <div className="jobs-type-container">
                      <BsBriefcaseFill color="#faf8fc" className="icons" />
                      <p className="jobs-type">{employmentType}</p>
                    </div>
                  </div>
                  <p className="jobs-salary">{packagePerAnnum}</p>
                </div>
                <hr className="jobs-hr-line" />
                <div className="jobs-description-container">
                  <p className="jobs-description-heading">Description</p>
                  <p className="jobs-description">{jobDescription}</p>
                </div>
              </li>
            </Link>
          )
        })}
      </ul>
    )
  }

  renderNoJobsImage = () => (
    <div className="no-jobs-image-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </div>
  )

  onSuccessGettingJobDetails = () => {
    const {jobDetailsList} = this.state
    const isEmpty = jobDetailsList.length > 0

    return isEmpty ? this.renderDetailsList() : this.renderNoJobsImage()
  }

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="jobs-search-container">
        <input
          type="search"
          className="jobs-container-search-input"
          placeholder="Search"
          onChange={this.onChangeSearchInput}
          value={searchInput}
        />
        <button
          type="button"
          testid="searchButton"
          className="search-button"
          onClick={this.onClickSearchIcon}
        >
          <BsSearch color="#ffffff" className="search-icon" />
        </button>
      </div>
    )
  }

  renderProfileDetails = () => {
    const {profileApiStatusConstants} = this.state

    switch (profileApiStatusConstants) {
      case profileApiConstants.success:
        return this.onSuccessProfileDetails()
      case profileApiConstants.failure:
        return this.onFailureProfileDetails()
      case profileApiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderSalaryEmployment = () => (
    <>
      <h1 className="types-heading">Type of Employment</h1>
      <ul className="employmentTypesList">
        {employmentTypesList.map(eachType => {
          const {employmentTypeId, label} = eachType

          return (
            <li key={employmentTypeId} className="employmentTypesListItem">
              <input
                type="checkbox"
                id={employmentTypeId}
                value={employmentTypeId}
                className="employmentInputCheckBox"
                onChange={this.onChangeCheckBox}
              />
              <label className="label">{label}</label>
            </li>
          )
        })}
      </ul>
      <hr className="hr-line" />
      <h1 className="types-heading">Salary Range</h1>
      <ul className="employmentTypesList">
        {salaryRangesList.map(eachType => {
          const {salaryRangeId, label} = eachType

          return (
            <li key={salaryRangeId} className="employmentTypesListItem">
              <input
                type="radio"
                id={salaryRangeId}
                name="salary"
                value={salaryRangeId}
                className="employmentInputCheckBox"
                onChange={this.onChangeRadioInput}
              />
              <label className="label">{label}</label>
            </li>
          )
        })}
      </ul>
    </>
  )

  renderJobDetails = () => {
    const {jobDetailsApiStatus} = this.state

    switch (jobDetailsApiStatus) {
      case profileApiConstants.success:
        return this.onSuccessGettingJobDetails()
      case profileApiConstants.failure:
        return this.onFailureJobDetails()
      case profileApiConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="jobs-container-mobile-view">
            {this.renderSearchInput()}
            {this.renderProfileDetails()}
            {this.renderSalaryEmployment()}
            {this.renderJobDetails()}
          </div>
          <div className="jobs-container-laptop-view">
            <div className="jobs-profile-salary-employment-lg">
              {this.renderProfileDetails()}
              {this.renderSalaryEmployment()}
            </div>
            <div className="jobs-search-job-details-container">
              {this.renderSearchInput()}
              {this.renderJobDetails()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs

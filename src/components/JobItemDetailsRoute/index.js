import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {RiStarSFill} from 'react-icons/ri'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsList: [],
    skillsList: [],
    lifeAtCompany: {},
    apiStatus: apiStatusConstants.initial,
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobData()
  }

  onClickRetryBtn = () => {
    this.getJobData()
  }

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      const updatedSkillsData = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      const updatedLifeAtCompany = {
        imageUrl: data.job_details.life_at_company.image_url,
        companyDescription: data.job_details.life_at_company.description,
      }
      const updatedSimilarJobsList = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
        id: each.id,
      }))

      this.setState({
        jobDetailsList: updatedData,
        skillsList: updatedSkillsData,
        lifeAtCompany: updatedLifeAtCompany,
        similarJobsList: updatedSimilarJobsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsSection = () => {
    const {
      jobDetailsList,
      skillsList,
      lifeAtCompany,
      similarJobsList,
    } = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobDetailsList

    return (
      <>
        <div className="job-details-card-container">
          <div className="job-details-company-logo-title-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="jobs-details-company-logo"
            />
            <div className="job-details-title-rating-container">
              <h1 className="job-details-company-title ">Devops Engineer</h1>
              <div className="job-details-rating-container">
                <RiStarSFill color=" #fbbf24" className="stars-icon" />
                <p className="jobs-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-location-type-salary-container">
            <div className="job-details-location-type-container">
              <div className="job-details-location-container">
                <MdLocationOn color="#faf8fc" />
                <p className="job-details-location">{location}</p>
              </div>
              <div className="job-details-type-container">
                <BsBriefcaseFill color="#faf8fc" className="icons" />
                <p className="job-details-type">{employmentType}</p>
              </div>
            </div>
            <p className="job-details-salary">{packagePerAnnum}</p>
          </div>
          <hr className="job-details-hr-line" />
          <div className="job-details-description-container">
            <div className="visit-btn-container">
              <h1 className="job-details-description-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="visit-btn"
              >
                Visit <BsBoxArrowUpRight className="arrow-icon" />
              </a>
            </div>
            <p className="job-details-description">{jobDescription}</p>
            <p className="job-details-description-heading">Skills</p>
            <ul className="skills-list">
              {skillsList.map(each => (
                <li key={each.name} className="skill-list-item">
                  <img
                    src={each.imageUrl}
                    alt={each.name}
                    className="skill-image"
                  />
                  <p className="skill-name">{each.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="job-details-description-heading">Life At Company</h1>
            <div className="life-at-company-image-description">
              <p className="description">{lifeAtCompany.companyDescription}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobsList.map(each => (
              <li key={each.id} className="similar-jobs-list-item-container">
                <div className="similar-jobs-logo-title-rating-container">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-jobs-company-logo"
                  />
                  <div className="similar-jobs-title-rating-container">
                    <h1 className="similar-jobs-company-title">{each.title}</h1>
                    <div className="similar-jobs-rating-container">
                      <RiStarSFill color=" #fbbf24" />
                      <p className="similar-jobs-rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="similar-jobs-description-container">
                  <h1 className="similar-jobs-description-heading">
                    Description
                  </h1>
                  <p className="similar-jobs-description">
                    {each.jobDescription}
                  </p>
                </div>
                <div className="similar-jobs-location-type-container">
                  <div className="similar-jobs-location-container">
                    <MdLocationOn color="#faf8fc" />
                    <p className="similar-jobs-location">{each.location}</p>
                  </div>
                  <div className="similar-jobs-type-container">
                    <BsBriefcaseFill color="#faf8fc" className="icons" />
                    <p className="similar-jobs-type">{each.employmentType}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureJobDetailsSection = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.onClickRetryBtn}>
        Retry
      </button>
    </div>
  )

  renderLoadingSection = () => (
    <div className="loader-container" testid="loader">
      <Loader
        type="ThreeDots"
        color="#ffffff"
        height="50"
        width="50"
        className="loader"
      />
    </div>
  )

  renderJobDetailsRoute = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSection()
      case apiStatusConstants.failure:
        return this.renderFailureJobDetailsSection()
      case apiStatusConstants.inProgress:
        return this.renderLoadingSection()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-bg-container">
          {this.renderJobDetailsRoute()}
        </div>
      </>
    )
  }
}

export default JobItemDetails

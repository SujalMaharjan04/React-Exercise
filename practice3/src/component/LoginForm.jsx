import PropTypes from 'prop-types'
const LoginForm = ({username, password, handleSubmit, handleUsernameChange, handlePasswordChange}) => {
    return (
      <form onSubmit={handleSubmit}>
        <div>
          Username:
          <input type = 'text' data-testid = "username" value = {username} name = "Username" onChange={handleUsernameChange} />
        </div>
        <div>
          Password:
          <input type = "password" data-testid = "password" value = {password} name = "password" onChange={handlePasswordChange} />
        </div>
        <div>
          <button type = "submit">Login</button>
        </div>        
      </form>
    )
    
}
LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm
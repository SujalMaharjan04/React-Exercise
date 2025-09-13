import PropTypes from 'prop-types'
import {Form, Button} from 'react-bootstrap'

const LoginForm = ({username, password, handleSubmit, handleUsernameChange, handlePasswordChange}) => {
    return (
      <div>
        <h2>Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control type = 'text' data-testid = "username" value = {username} name = "Username" onChange={handleUsernameChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control type = "password" data-testid = "password" value = {password} name = "password" onChange={handlePasswordChange} />
          </Form.Group>
          <Form.Group>
            <Button variant='primary' type = "submit">Login</Button>
          </Form.Group>        
        </Form>
      </div>
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
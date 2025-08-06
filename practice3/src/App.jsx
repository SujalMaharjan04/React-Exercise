import {useState, useEffect, useRef} from 'react'
import Note from './component/Note'
import noteServices from './services/Notes'
import login from './services/login'
import Togglable from './component/Togglable'
import LoginForm from './component/LoginForm'
import NoteForm from './component/NoteForm'
import PropTypes from 'prop-types'



const Notification = ( {message} ) => {
  if (message === null) {
    return null
  }
  return (
    <div className = "error">{message}</div>
  )
}

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16
  }

  return (
    <div style = {footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2025</em>
    </div>
  )
}
const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(()=> {
    noteServices
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteServices.setToken(user.token)
    }
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important} 

    noteServices
      .update(id, changedNote)
      .then(requestedData => {
        setNotes(notes.map(note => note.id === id ? requestedData : note))
      })
      .catch (error => {
        setErrorMessage(`Note: ${note.content} was already deleted from the server`)
        console.log(error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  console.log('render', notes.length, 'notes')

  const addNote = (newObject) => {
    noteFormRef.current.toggleVisibility()
    noteServices
      .create(newObject)
      .then(requestedData => {
        setNotes(notes.concat(requestedData))
      })
    }

  const notestoShow = showAll
    ? notes 
    : notes.filter(note => note.important === true)

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    try {
      const user = await login.login({username, password})
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
      noteServices.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
  }

  const noteFormRef = useRef()
  return(
    <div>
      {user === null 
          ? <Togglable buttonLabel = "login">
            <LoginForm username = {username} password = {password} handleSubmit={handleSubmit} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} />
          </Togglable>
          :
          <div>
            <p>{user.name} logged in</p>
            <button type = "submit" onClick={handleLogOut}>Log Out</button>
            <Togglable buttonLabel = 'Add Note' ref = {noteFormRef}>
              <NoteForm createNote = {addNote} />
            </Togglable>
          </div> 
          }
      <h2>Notes</h2>
      <Notification message = {errorMessage} />
      
      <button onClick = {() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'All'}
      </button>
      <ul>
        {notestoShow.map(note => <Note key = {note.id} note = {note} toggleImportant={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <Footer />
    </div>
  )
}

Notification.propTypes = {
  message : PropTypes.string.isRequired
}

export default App
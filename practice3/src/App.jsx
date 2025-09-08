import {useState, useEffect, useRef} from 'react'
import Note from './component/Note'
import noteServices from './services/Notes'
import login from './services/login'
import Togglable from './component/Togglable'
import LoginForm from './component/LoginForm'
import NoteForm from './component/NoteForm'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate,
  Navigate,
  useMatch
} from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h2>TLTK Note App</h2>
    </div>
  )
}

const Users = () => {
  return (
    <div>
      <h2>TKTL notes app</h2>
      <ul>
        <li>Matti Luukkainen</li>
        <li>Juha Tauriainen</li>
        <li>Arto Hellas</li>
      </ul>
    </div>
  )
}


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

  const match = useMatch('/notes/:id')
  const note = match ? notes.find(n => n.id === Number(match.params.id)) : null

  const padding = {
    padding: 5
  }
  return(
    <div>
      {/*Navigation Bar */}
      <div>
        <Link style = {padding} to = "/">Home</Link>
        <Link style = {padding} to = "/notes">Notes</Link>
        <Link style = {padding} to = "/users">Users</Link>
        {user 
          ? <div><em>{user.name} logged in</em>
            <button type = "submit" onClick={handleLogOut}>Log Out</button></div>
          : <Link style = {padding} to = "/login">login</Link>}
      </div>

      
      <Routes>
        <Route path = "/notes" element = {
          <div>
            <h2>Notes</h2>
            <Notification message = {errorMessage} />
            
            <button onClick = {() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'All'}
            </button>
            <ul>
              {notestoShow.map(note => <Note key = {note.id} note = {note} toggleImportant={() => toggleImportanceOf(note.id)} />)}
            </ul>
          </div>
        } />
        <Route path = "/" element = {user
          ? <div>
              <Home />
              <div>
                
                <Togglable buttonLabel = 'Add Note' ref = {noteFormRef}>
                  <NoteForm createNote = {addNote} />
                </Togglable>
              </div> 
            </div>
          : <Home />} />
        <Route path = "/notes/:id" element = {note ? <Note note = {note} /> : <div>Note not found</div>} />
        <Route path = "/users" element = {user ? <Users /> : <Navigate replace to = "/login" />} />
        <Route path = "/login" element = {
          <div>
            {user === null 
            ? <Togglable buttonLabel = "login">
              <LoginForm username = {username} password = {password} handleSubmit={handleSubmit} handleUsernameChange={({target}) => setUsername(target.value)} handlePasswordChange={({target}) => setPassword(target.value)} />
            </Togglable>
            :
            <Navigate replace to = "/" />
            
            }
          </div>
        } />
      </Routes>
      
      
      <Footer />
    </div>
  )
}

Notification.propTypes = {
  message : PropTypes.string.isRequired
}

export default App
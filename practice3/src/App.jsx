import {useState, useEffect} from 'react'
import Note from './component/Note'
import noteServices from './services/Notes'


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
  const [newNotes, setNewNotes] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(()=> {
    noteServices
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important} 

    noteServices
      .update(id, changedNote)
      .then(requestedData => {
        setNotes(notes.map(note => note.id === id ? requestedData : note))
      })
      .catch(error => {
        setErrorMessage(
          `Note: ${note.content} was already deleted from the server`
        )
        console.log(errorMessage)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  console.log('render', notes.length, 'notes')
  const addNote = (event) => {
    event.preventDefault();
    const newObject = {
      content: newNotes,
      important: Math.random() < 0.5,
    }
    noteServices
      .create(newObject)
      .then(requestedData => {
        setNotes(notes.concat(requestedData))
        setNewNotes('')
      })
    }

  const handleClick = (event) => {
    setNewNotes(event.target.value)
  }

  const notestoShow = showAll
    ? notes 
    : notes.filter(note => note.important === true)
  return(
    <div>
      <h2>Notes</h2>
        <Notification message = {errorMessage} />
      <button onClick = {() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'All'}
      </button>
      <ul>
        {notestoShow.map(note => <Note key = {note.id} note = {note} toggleImportant={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <div>
        <form onSubmit={addNote}>
          <input value = {newNotes} onChange = {handleClick} />
          <button type = "submit">add</button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default App;
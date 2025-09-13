import PropTypes from "prop-types";
import { Link } from "react-router-dom";


const Note = ({note, toggleImportant}) => {
    const label = note.important ? 'make not important' : 'make important'
    return (
    <tr>
        <td>
            <Link to = {`/notes/${note.id}`}>{note.content}</Link>
            <button onClick = {toggleImportant}>{label}</button> 
        </td>
        <td>{note.user.username}</td>
    </tr>
    
)
}

Note.propTypes = {
    note : {
        content: PropTypes.string.isRequired,
        important: PropTypes.bool.isRequired},
    toggleImportant : PropTypes.func.isRequired,
    

}
export default Note;
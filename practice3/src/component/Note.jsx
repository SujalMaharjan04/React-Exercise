import PropTypes from "prop-types";

const Note = ({note, toggleImportant}) => {
    const label = note.important ? 'make not important' : 'make important'
    return (
    <li className = "note">
        <span>{note.content}</span>
        <button onClick = {toggleImportant}>{label}</button> 
    </li>
)
}

Note.propTypes = {
    note : {
        content: PropTypes.string.isRequired,
        important: PropTypes.bool.isRequired},
    toggleImportant : PropTypes.func.isRequired,
    

}
export default Note;
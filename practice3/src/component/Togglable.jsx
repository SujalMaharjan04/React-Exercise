import {useState, forwardRef, useImperativeHandle} from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideLoginForm = {display: visible ? 'none' : '' }
    const showLoginForm = {display: visible ? '': 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        toggleVisibility
    })

    return (
        <div>
            <div style = {hideLoginForm}>
                <button onClick={() => toggleVisibility()}>{props.buttonLabel}</button>
            </div>
            <div style = {showLoginForm}>
                {props.children}
                <button onClick={() => toggleVisibility()}>Cancel</button>
            </div>
        </div>
    )
})

Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired, 
}
export default Togglable
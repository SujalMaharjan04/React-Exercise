import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'
import Togglable from './Togglable'
import NoteForm from './NoteForm'
import { createElement } from 'react'

test('render content', async() => {
    const note = {
        content: 'Component testing is done by react-testing-library',
        important: true
    }
    const mockHandler = vi.fn()

    render(<Note note = {note} toggleImportant={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('make not important')
    await user.click(button)


    expect(mockHandler.mock.calls).toHaveLength(1)

})

describe('<Togglable />', () => {
    let container

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel = "show...">
                <div className='testDiv'>
                    togglable content
                </div>
            </Togglable>
        ).container
    })

    test('renders its children', async() => {
        await screen.findAllByText('togglable content')
    })

    test('at start the child is not displayed', () => {
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', async() => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', async() => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const closeButton = screen.getByText('Cancel')
        await user.click(closeButton)

        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
})

describe('<NoteForm />', () => {
    test('<NoteForm /> updates parent state and calls onSubmit', async() => {
        const createNote = vi.fn()
        const user = userEvent.setup()

        render(<NoteForm createNote={createNote} />)
        
        const input = screen.getByRole('textbox')
        const sendButton = screen.getByText('save')
        
        await user.type(input, 'testing a form...')
        await user.click(sendButton)

        expect(createNote.mock.calls).toHaveLength(1)
        expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
    })
})
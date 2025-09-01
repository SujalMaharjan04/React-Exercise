const loginWith = async(page, username, password) => {
    await page.getByRole('button', {name: 'login'}).click()
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').last().fill(password)
    await page.getByRole('button', {name: 'login'}).click()
}

const createNote = async(page, content) => {
    await page.getByRole('button', {name: 'Add Note'}).click()
    await page.getByRole('textbox').fill(content)
    await page.getByRole('button', {name: 'save'}).click()

    await page.getByText(content).waitFor()
}

export {loginWith, createNote}
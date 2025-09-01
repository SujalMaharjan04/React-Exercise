import {test, describe,  expect, beforeEach} from '@playwright/test'
import {loginWith, createNote} from './helper'


describe('Note app', () => {

    beforeEach(async ({page, request}) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'this',
                username: 'root3',
                password: '12345'
            }
        })
        await page.goto('/')
    })
    test('front page can be opened', async({page}) => {

        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
    })

    test('login form can be opened', async({page}) => {
       await loginWith(page, 'root3', '12345')

        await expect(page.getByText('this logged in')).toBeVisible()
    })

    describe('when logged in', () => {
        beforeEach(async({page}) => {
            await loginWith(page, 'root3', '12345')
        })

        test('a new note can be created', async({page}) => {
            await createNote(page, 'a new note created by playwright')
            await expect(page.getByText('a new note created by playwright')).toBeVisible()
        })    
    })

    describe('a note existed', () => {
        beforeEach(async ({page}) => {
            await loginWith(page, 'root3', '12345')
            await createNote(page, 'another note by playwright')
        })

        test('importance can be changed', async({page}) => {
            await page.getByRole('button', {name: 'make not important'}).click()
            await expect(page.getByText('make important')).toBeVisible()
        })
    })

    test('login fails with wrong password', async({page}) => {
       await loginWith(page, 'root3', '1234')

        const errorDiv = page.locator('.error')

        await expect(errorDiv).toContainText('Wrong Credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('this logged in')).not.toBeVisible()
    })

    describe('and several notes exist', () => {
        beforeEach(async({page}) => {
            await loginWith(page, 'root3', '12345')
            await createNote(page, 'first note')
            await createNote(page, 'second note')
            await createNote(page, 'third note')
        })

        test('one of those can be made non-important', async({page}) => {
            const otherNote = await page.getByText('third note')
            const otherNoteElement = await otherNote.locator('..')

            await otherNoteElement.getByRole('button', {name: 'make not important'}).click()
            await expect(otherNoteElement.getByText('make important')).toBeVisible()
        })
    }) 
})


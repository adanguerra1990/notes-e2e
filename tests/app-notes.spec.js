const { test, describe, expect, beforeEach } = require('@playwright/test');


describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: "Aaron Valerio",
                username: "user",
                password: "password"
            }
        })
        await page.goto('http://localhost:5173/')
    })
    test('La página principal se puede abrir.', async ({ page }) => {
        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible('Notes')
        // await expect(page.getByText('Una nota creadad por playwright')).toBeVisible()
    });

    test('El formulario de inicio de sesión se puede abrir.', async ({ page }) => {
        // buscar los campos de texto con el id correspondiente e introducir el nombre de usuario y la contraseña en ellos
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('user')
        await page.getByTestId('password').fill('password')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Aaron Valerio logged')).toBeVisible()
    });

    test('el inicio de sesión falla con la contraseña incorrecta', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('user')
        await page.getByTestId('password').fill('contraseña')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Aaron Valerio logged in')).not.toBeVisible()
    });


    describe('cuando inicia sesión', () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'log in' }).click()
            await page.getByTestId('username').fill('user')
            await page.getByTestId('password').fill('password')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('se puede crear una nueva nota', async ({ page }) => {
            await page.getByRole('button', { name: 'new note' }).click()
            await page.getByRole('textbox').fill('Una nota creadad por playwright')
            await page.getByRole('button', { name: 'Save' }).click()
            await expect(page.getByText('Una nota creadad por playwright')).toBeVisible()
        });

        describe('y existe una nota', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'new note' }).click()
                await page.getByRole('textbox').fill('otra nota de playwright')
                await page.getByRole('button', { name: 'Save' }).click()
            })

            test('important se puede Cambiar', async ({ page }) => {
                await page.getByRole('button', { name: 'make not important' }).click()
                await expect(page.getByText('make important')).toBeVisible()
            });

        });
    });

});
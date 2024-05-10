const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper')


describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: "Aaron Valerio",
                username: "user",
                password: "password"
            }
        })
        await page.goto('')
    })
    test('La página principal se puede abrir.', async ({ page }) => {
        const locator = await page.getByText('Notes')
        await expect(locator).toBeVisible('Notes')
        // await expect(page.getByText('Una nota creadad por playwright')).toBeVisible()
    });

    test('usuario puede iniciar sesión', async ({ page }) => {
        await loginWith(page, 'user', 'password')
        await expect(page.getByText('Aaron Valerio logged')).toBeVisible()
    });

    test('el inicio de sesión falla con la contraseña incorrecta', async ({ page }) => {
        await loginWith(page, 'user', 'contraseña')

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Aaron Valerio logged in')).not.toBeVisible()
    });


    describe('cuando inicia sesión', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'user', 'password')
        })

        test('se puede crear una nueva nota', async ({ page }) => {
            await createNote(page, 'Una nota creadad por playwright', true)
            await expect(page.getByText('Una nota creadad por playwright')).toBeVisible()
        });

        describe('y existe una nota', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'otra nota de playwright', true)
            })

            test('important se puede Cambiar', async ({ page }) => {
                await page.getByRole('button', { name: 'make not important' }).click()
                await expect(page.getByText('make important')).toBeVisible()
            });
        });
    });

});
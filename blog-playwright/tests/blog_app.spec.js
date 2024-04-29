const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'ulla',
        username: 'ullapulla',
        password: 'jotain'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
    
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'ullapulla', 'jotain')

      await expect(page.getByText('ulla logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrongusername', 'wrongpassword')
      const errorMessage = page.locator('.errorMessage')
      await expect(errorMessage).toContainText('Wrong credentials')
      await expect(errorMessage).toHaveCSS('border-style', 'solid')
      await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('ulla logged-in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'ullapulla', 'jotain')
    })
  
    test('a new blog can be created', async ({ page }) => {      
      await createBlog(page, 'random title', 'random author', 'www.randomblog.com')
      const blogDiv = page.locator('.defaultBlog')
      await expect(blogDiv).toContainText('random title')
      await expect(blogDiv).toContainText('random author')
      await expect(page.getByRole('button', {name: 'view'})).toBeVisible()
    })
    describe('When note is created', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'ullapulla', 'jotain')
        await createBlog(page, 'random title', 'random author', 'www.randomblog.com')
      })

      test('a blog can be edited', async ({ page }) => {      
        await page.getByRole('button', {name: 'view'}).click()
        const blogDiv = page.locator('.detailedBlog')
        await expect(blogDiv).toContainText('0')
        await page.getByRole('button', {name: 'like'}).click()
        await expect(blogDiv).toContainText('1')
      })

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', async dialog => {
          console.log(dialog.message())
          await dialog.accept()
        })      
        await page.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'delete'}).click()
        
        
        await expect(page.locator('.defaultBlog')).not.toBeVisible()
        await expect(page.locator('.detailedBlog')).not.toBeVisible()

      })

      test('only person who added blog can see delete button', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            name: 'veikko',
            username: 'veijari',
            password: 'jotain'
          }
        })

        await page.getByRole('button', {name: 'logout'}).click()
        await loginWith(page, 'veijari', 'jotain')
        await page.getByText('blogs').waitFor()

        await page.getByRole('button', {name: 'view'}).click()

        await expect(page.locator('.detailedBlog')).toBeVisible()
        await expect(page.getByRole('button', {name: 'delete'})).not.toBeVisible()

      })

      test('blogs are arranged by their like count', async ({ page, request }) => {
        await createBlog(page, 'second blog', 'moses himself', 'www.mobile.com')
        const firstBlog = await page.getByText('random title')
        await firstBlog.getByRole('button', {name: 'view'}).click()
        const secondBlog = await page.getByText('second blog')
        
        await secondBlog.getByRole('button', {name: 'view'}).click()

        await expect(page.locator('.detailedBlog')).toContainText(['random title', 'second blog'])
        await secondBlog.getByRole('button', {name: 'like'}).click()
        await secondBlog.filter({hasText: '1'}).waitFor()
        await expect(page.locator('.detailedBlog').filter({hasText: 'second blog'})).toContainText('1')
        
        await expect(page.locator('.detailedBlog')).toContainText(['second blog', 'random title'])

      })
    })
  })
})
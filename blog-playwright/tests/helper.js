const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('type title').fill(title)
  await page.getByPlaceholder('type author').fill(author)
  await page.getByPlaceholder('type url').fill(url)
  await page.getByRole('button', { name: 'save' }).click()
  await page.locator('.defaultBlog').filter({hasText: title}).waitFor()
}

export { loginWith, createBlog }
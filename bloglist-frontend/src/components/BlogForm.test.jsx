import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm/> creates a blog properly', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog}/> )
  const title = screen.getByPlaceholderText('type title')
  const author = screen.getByPlaceholderText('type author')
  const url = screen.getByPlaceholderText('type url')
  const sendButton = screen.getByText('save')

  await user.type(title, 'random title')
  await user.type(author, 'random author')
  await user.type(url, 'www.randomblog.com')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('random title')
  expect(createBlog.mock.calls[0][0].author).toBe('random author')
  expect(createBlog.mock.calls[0][0].url).toBe('www.randomblog.com')
})
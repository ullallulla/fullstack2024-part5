import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('renders title and author by default', () => {
  const blog = {
    title: 'this is a blog',
    author: 'magician',
    url: 'www.coolblog.com',
    likes: 10,
    user: {
      id: 1234,
      username: 'heikki',
      name: 'hermanni'
    }
  }

  const { container } = render(<Blog blog={blog}/>)

  const div = container.querySelector('.defaultBlog')
  expect(div).toHaveTextContent('this is a blog')
  expect(div).toHaveTextContent('magician')
  const hiddenDiv = container.querySelector('.detailedBlog')
  expect(hiddenDiv).toHaveStyle('display: none')

})

test('url and likes are shown after clicking view', async () => {
  const blog = {
    title: 'this is a blog',
    author: 'magician',
    url: 'www.coolblog.com',
    likes: 10,
    user: {
      id: 1234,
      username: 'heikki',
      name: 'hermanni'
    }
  }

  const { container } = render(<Blog blog={blog}/>)
  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.detailedBlog')
  expect(div).not.toHaveStyle('display: none')
  expect(div).toHaveTextContent('www.coolblog.com')
  expect(div).toHaveTextContent('10')
})

test('like button gets clicked twice', async () => {
  const blog = {
    title: 'this is a blog',
    author: 'magician',
    url: 'www.coolblog.com',
    likes: 10,
    user: {
      id: 1234,
      username: 'heikki',
      name: 'hermanni'
    }
  }
  const updateBlogLikes = vi.fn()
  render(<Blog blog={blog} updateBlogLikes={updateBlogLikes}/>)
  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlogLikes.mock.calls).toHaveLength(2)
})
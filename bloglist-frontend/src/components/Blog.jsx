import { useState } from 'react'

const Blog = ({ blog, updateBlogLikes, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = async (event) => {
    event.preventDefault()
    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlogLikes(blog.id, blogObject)
  }

  const deleteBlog = async (event) => {
    event.preventDefault()

    removeBlog(blog.id)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='defaultBlog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className='detailedBlog'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        {blog.likes}
        <button onClick={updateLikes}>like</button> <br />
        {blog.user.name} <br />
        {user && user.username === blog.user.username ?
          (<div><button onClick={deleteBlog}>delete</button></div>) : (null)}
      </div>
    </div>
  )
}

export default Blog
import { useState } from "react"

const Blog = ({ blog, updateBlogLikes }) => {
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

  return (
    <div div style={blogStyle}>
      <div div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button> <br />
        {blog.url} <br />
        {blog.likes}
        <button onClick={updateLikes}>like</button> <br />
        {blog.user.name}
      </div>
    </div>
  )
}

export default Blog
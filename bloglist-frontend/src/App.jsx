import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import ErrorMessage from './components/ErrorMessage'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [blogVisible, setBlogVisible] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const initialBlogs = await blogService.getAll()
      setBlogs(initialBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const updateLikes = async (id, blogObject) => {
    try {
      const newBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(b => b.id !== id ? b : newBlog))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBlog = async (id) => {
    const blog = blogs.find(blog => blog.id === id)

    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id)
      setNotification(`blog ${blog.title} by ${blog.author} deleted!`)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setTimeout(() => {
        setNotification(null)
      }, 3000)
    }

  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleURLChange = (event) => {
    setNewURL(event.target.value)
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          data-testid='username'
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          data-testid='password'
        />
      </div>
      <button id='login-button' type="submit">login</button>
    </form>
  )

  const blogForm = () => {

    const hideWhenVisible = { display: blogVisible ? 'none' : '' }
    const showWhenVisible = { display: blogVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogVisible(true)}>
            new blog
          </button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            createBlog={addBlog}
            handleAuthorChange={({ target }) => setNewAuthor(target.value)}
            handleTitleChange={({ target }) => setNewTitle(target.value)}
            handleURLChange={({ target }) => setNewURL(target.value)}
            newAuthor={newAuthor}
            newTitle={newTitle}
            newURL={newURL}
          />
          <button onClick={() => setBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <ErrorMessage message={errorMessage} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>{user.name} logged-in</p> <button onClick={handleLogout}>logout</button>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlogLikes={updateLikes} removeBlog={deleteBlog} user={user}/>
      )}
    </div>
  )
}

export default App
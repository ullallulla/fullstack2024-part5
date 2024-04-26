import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newURL, setNewURL] = useState('')


  const addBlog = async (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL
    })
    setNewTitle('')
    setNewAuthor('')
    setNewURL('')
  }


  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
                title: <input
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            placeholder='type title'
          />
        </div>
        <div>
                author: <input
            value={newAuthor}
            onChange={event => setNewAuthor(event.target.value)}
            placeholder='type author'
          />
        </div>
        <div>
                url: <input
            value={newURL}
            onChange={event => setNewURL(event.target.value)}
            placeholder='type url'
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm




const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned and unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    assert(response.body[0].id)
    assert.strictEqual(response.body[0]._id, undefined)
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(titles.includes('Canonical string reduction'))
    })

    test('likes property defaults to 0 if missing', async () => {
      const newBlog = {
        title: 'Blog without likes property',
        author: 'Anonymous',
        url: 'https://example.com/no-likes',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      assert.strictEqual(response.body.likes, 0)
    })

    test('backend responds with 400 if title or url is missing', async () => {
      const missingTitleBlog = {
        author: 'Missing Title',
        url: 'https://example.com/no-title',
      }

      await api.post('/api/blogs').send(missingTitleBlog).expect(400)

      const missingUrlBlog = {
        title: 'Missing Url Blog',
        author: 'Anonymous',
      }

      await api.post('/api/blogs').send(missingUrlBlog).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map((b) => b.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('succeeds in updating the number of likes for a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 10,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
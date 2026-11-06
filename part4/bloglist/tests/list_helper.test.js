const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const biggerList = [
  {
    _id: '5a422aa71b54a676234d17f1',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f2',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f3',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f4',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htm',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f5',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.htm',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f6',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.htm',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [biggerList[1]]
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(biggerList)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(biggerList)
    const expected = biggerList[2]
    assert.deepStrictEqual(result, expected)
  })
})

describe('most blogs', () => {
  test('finds the author with the largest amount of blogs', () => {
    const result = listHelper.mostBlogs(biggerList)
    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most likes', () => {
  test('finds the author with the largest amount of likes', () => {
    const result = listHelper.mostLikes(biggerList)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    assert.deepStrictEqual(result, expected)
  })
})
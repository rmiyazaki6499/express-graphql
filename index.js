const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const gql = require('graphql-tag')
const schema = require('./schemas/dataSchema')
const uuid = require('uuid/v4')

const app = express()

// Applying CORS
app.use(cors())


const PEOPLE = new Map()
const POSTS = new Map()

class Post {
    constructor (data) { Object.assign(this, data)  }
    get author () {
        return PEOPLE.get(this.authorId)
    }
}

class Person {
    constructor (data) { Object.assign(this, data)  }
    get posts () {
        return [...POSTS.values()].filter(post => post.authorId === this.id)
    }
}

const rootValue = {
    posts: () => POSTS.values(),
    post: ({ id  }) => POSTS.get(id),
    authors: () => PEOPLE.values(),
    author: ({ id  }) => PEOPLE.get(id)
}

const initializeData = () => {
    const fakePeople = [
        { id: '1', firstName: 'John', lastName: 'Doe'  },
        { id: '2', firstName: 'Jane', lastName: 'Doe'  }
    ]
    fakePeople.forEach(person => PEOPLE.set(person.id, new Person(person)))

    const fakePosts = [
        { id: '1', authorId: '1', body: 'Hello world'  },
        { id: '2', authorId: '2', body: 'Hi, planet!'  }
    ]
    fakePosts.forEach(post => POSTS.set(post.id, new Post(post)))
}

initializeData()

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}))

const port = process.env.PORT || 4000
app.listen(port)
console.log(`Running GraphQL API server at port ${port}`)

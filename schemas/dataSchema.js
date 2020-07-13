const gql = require('graphql-tag')
const { buildASTSchema  } = require('graphql')

const schema = buildASTSchema(gql`
  type Query {
     posts: [Post]
     post(id: ID): Post
     authors: [Person]
     author(id: ID): Person
  }

  type Post {
    id: ID
    author: Person
    body: String
    }

    type Person {
      id: ID
      posts: [Post]
      firstName: String
      lastName: String
  }
`)

module.exports = schema

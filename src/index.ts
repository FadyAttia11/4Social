import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants"
// import { Post } from "./entities/Post"
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"

const main = async () => {
    
    const orm = await MikroORM.init(microConfig) //connect to db
    await orm.getMigrator().up() //run the migrator before doing anything else
    
    const app = express()
    const apolloServer = new ApolloServer({ //our schema built by type-graphql
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        //special object accessible by all your resolvers
        context: () => ({ em: orm.em }) //to be able to access orm from our resolvers
    })

    apolloServer.applyMiddleware({ app })

    app.listen(5000, () => {
        console.log('server is running on localhost:5000')
    })
    
}

main()



// const post = orm.em.create(Post, {title: 'my first post'}) //creating new post
// await orm.em.persistAndFlush(post) //inserting the new post to the db forsocial

// const posts = await orm.em.find(Post, {})
// console.log(posts)
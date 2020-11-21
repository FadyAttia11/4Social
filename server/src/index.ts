import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core"
import { COOKIE_NAME, __prod__ } from "./constants"
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"

import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'


const main = async () => {
    
    const orm = await MikroORM.init(microConfig) //connect to db
    await orm.getMigrator().up() //run the migrator auto before doing anything else
    
    const app = express()

    //after initializing express & before applymiddleware because we will need the session inside the apollo middleware
    //this is to make a cookie inside the browser for the logged in user
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()
    app.use(cors({
        origin: "http://localhost:3000",
        credentials: true
    }))
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years 
                httpOnly: true, //good for security reasons ==> cannot access in frontend
                sameSite: 'lax', //csrf
                secure: __prod__ //cookie only works in https
            },
            saveUninitialized: false,
            secret: 'kjsdafkjsdlsdkjmlkdxnmzbvosd', //env variable later
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({ //our schema built by type-graphql
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        //special object accessible by all your resolvers
        context: ({ req, res }) => ({ em: orm.em, req, res }) //to be able to access orm from our resolvers
    })

    apolloServer.applyMiddleware({ 
        app, 
        cors: false
    })

    app.listen(5000, () => {
        console.log('server is running on localhost:5000')
    })
    
}

main()

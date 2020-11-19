import { Post } from "../entities/Post";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class PostResolver { //this is our schema

    //Query()    ==> for getting data
    //Mutation() ==> for updating, insering, deleting data


    //this is a query for reading all posts (READ)
    @Query(() => [Post]) //query returns type string (graphQL type)
    //first line is my context (em) with it's type, then the type of the return (which is post)
    posts(@Ctx() { em }: MyContext) : Promise<Post[]> { //(TS type) (duplication)
        return em.find(Post, {})
    } 


    //reading only one post by it's id (takes an argument) (READ)
    @Query(() => Post, { nullable: true }) //returns post or null (as types)
    post(
        @Arg('id') id: number, //(the argument) with ts type
        @Ctx() { em }: MyContext) : Promise<Post | null> {
        return em.findOne(Post, { id })
    } 


    //mutation for creating a post (CREATE)
    @Mutation(() => Post) //returns just post (as type)
    async createPost(
        @Arg('title') title: string, //(the parameters it takes) with ts type
        @Ctx() { em }: MyContext) : Promise<Post> {
        const post = em.create(Post, {title}) //creating new post
        await em.persistAndFlush(post) //inserting the new post into the db
        return post
    }


    //mutation for updating a post (UPDATE)
    @Mutation(() => Post, {nullable: true}) //returns just post (as type)
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string, //optional to update ==> so we have to explicitly set the graphql type
        @Ctx() { em }: MyContext) : Promise<Post | null> {
        const post = await em.findOne(Post, {id})
        if(!post) {
            return null
        }
        if(typeof title !== 'undefined') {
            post.title = title //update the post title
            await em.persistAndFlush(post) //insert the updated post to the db
        }
        return post
    }

    //mutation for deleting a post (DELETE)
    @Mutation(() => Boolean) //returns true of false (as type)
    async deletePost(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext) : Promise<boolean> {
        try {
            await em.nativeDelete(Post, {id})
            return true
        } catch {
            return false
        }
    }
}
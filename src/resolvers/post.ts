import { Post } from "../entities/Post";
import { Resolver, Query, Ctx, Arg, Int } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class PostResolver { //this is our schema


    @Query(() => [Post]) //query returns type string (graphQL type)
    
    //this is a query for reading all posts
    //first line is my context (em) with it's type, then the type of the return (which is post)
    posts(@Ctx() { em }: MyContext) : Promise<Post[]> { //(TS type) (duplication)
        return em.find(Post, {})
    } 

    //reading only one post by it's id (takes an argument)
    @Query(() => Post, { nullable: true }) //returns post or null (as types)
    post(
        @Arg('id', () => Int) id: number, //(the argument) with type-graphql type then ts type
        @Ctx() { em }: MyContext) : Promise<Post | null> {
        return em.findOne(Post, { id })
    } 
}
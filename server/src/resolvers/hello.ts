import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver { //this is our schema
    @Query(() => String) //query returns type string
    hello() {
        return "hello world22"
    }
}
import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2'
import { User } from "../entities/User";

@InputType() //inputtype ==> we use for arguments
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType() //objecttype ==> can be returned from mutation
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]

    @Field(() => User, {nullable: true})
    user?: User
}


@Resolver()
export class UserResolver {

    //for getting the current user if there is logged in one (by getting his id from the session)
    @Query(() => User, {nullable: true}) //if logged (there is qid cookie(mean userId session) then return user, if not return null)
    async me(
        @Ctx() { req, em }: MyContext
    ) {
        //you are not logged in
        if(!req.session.userId) {
            return null
        }
        const user = await em.findOne(User, {id: req.session.userId})
        return user
    }

    //for register a new user
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if(options.username.length <= 2) {
            return {
                errors: [{
                    field: 'username',
                    message: 'length mush be greater than 2'
                }]
            }
        }
        if(options.password.length <= 2) {
            return {
                errors: [{
                    field: 'password',
                    message: 'length mush be greater than 2'
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, { username: options.username, password: hashedPassword})
        try {
            await em.persistAndFlush(user)
        } catch(err) {
            //duplicate username error
            if(err.code === '23505') {
                return {
                    errors: [{
                        field: 'username',
                        message: 'username already been taken!'
                    }]
                }
            }
        }

        //auto login after register (store userId session & set a cookie on the browser)
        req.session.userId = user.id

        return {
            user
        }
    }



    //for login user
    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        if(!user) {
            return {
                errors: [{
                    field: 'username',
                    message: "that username doesn't exist"
                }]
            }
        }
        const valid = await argon2.verify(user.password, options.password)
        if(!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'incorrect password'
                }]
            }
        }

        //store the logged in userId in session (and uid in browser cookie)
        //if removed the cookie the session will end (req.session.userId will be null) 
        req.session.userId = user.id

        return {
            user
        }
    }
}
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() //it's objecttype ==> to be able to use it in type-graphql (server)
@Entity() //also it still an entity (database)
export class Post {

  @Field() //exposing that to our graphql schema (server)
  @PrimaryKey() //(database)
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field() //if we remove the field from one ==> we cannot expose it from our query
  @Property({ type: 'text' })
  title!: string;

}
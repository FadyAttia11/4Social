import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() //it's objecttype ==> to be able to use it in type-graphql (server)
@Entity() //also it still an entity (database)
export class User {

  @Field() //exposing that to our graphql schema (server)
  @PrimaryKey() //(database)
  id!: number;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field() 
  @Property({ type: 'text', unique: true })
  username!: string;

  //if we remove the field from our property ==> we cannot expose it from our graphql query
  @Property({ type: 'text' })
  password!: string;

}
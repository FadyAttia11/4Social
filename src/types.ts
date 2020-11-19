import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";

export type MyContext { //the types for myContext to import it in post resolver
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}
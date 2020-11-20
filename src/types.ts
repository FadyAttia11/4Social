import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core";
import { Request, Response } from 'express'


export type MyContext = { //the types for myContext to import it in post resolver
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
    req: Request & { session: Express.Session } //have to use @types/express-session@1.17.0
    res: Response
}


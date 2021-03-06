import { Response, Request } from 'express'
export interface MyContext {
    res: Response;
    req: Request;
    payload?: { userId: string };
}
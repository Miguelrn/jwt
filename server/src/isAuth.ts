import { MiddlewareFn } from "type-graphql"
import { MyContext } from "./MyContext";
import {verify} from 'jsonwebtoken';   

export const isAuth: MiddlewareFn<MyContext> = ({context}, next) => {
    const authorization = context.req.headers['authorization'];

    if(!authorization){
        throw new Error('not authenticated');
    }
    
    try{
        const token = authorization.split(' ')[1]; //bearer as654d6as54
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (e){
        console.log(e);
        throw new Error('not authenticated2');
    }
    
    return next()
}
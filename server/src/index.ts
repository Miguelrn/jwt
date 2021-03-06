import "reflect-metadata";
import express from 'express';
import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/userResolver";
import { createConnection } from "typeorm";
import cookieParser from 'cookie-parser'
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { SendRefreshToken } from "./sendRefreshToken";
import cors from 'cors';

(async () => {
    const app = express();
    app.use(cookieParser());
    app.use(cors({
        credentials: true,
        origin: ['http://localhost:3000', 'https://studio.apollographql.com']
    }));
    app.get('/', (_req, res) => res.send('hello!'));
    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid;
        console.log('refresh, ', token)
        if(!token) return res.send({ ok: false, accessToken: ''});

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
        } catch (err) {
            console.log(err);
            return res.send({ ok: false, accessToken: ''});
        }

        // token is valid an can be send a valid token back
        const user = await User.findOne({ id: payload.userId });
        if(!user) return res.send({ ok: false, accessToken: ''});

        if(user.tokenVersion !== payload.tokenVersion) return res.send({ ok: false, accessToken: ''});

        SendRefreshToken(res, createRefreshToken(user));

        return res.send({ ok: true, accessToken: createAccessToken(user)});
    })
    let retries = 5;
    while(retries){
        try{
            await createConnection();
            break;
        }
        catch(e){
            retries--;
            console.log(e);
            console.log(`retries left: ${retries}`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [
                UserResolver
            ]
        }),
        context: ({req, res}) => ({req, res})
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(3001, () => {
        console.log('escuchando puerto 3001')
    })
})()
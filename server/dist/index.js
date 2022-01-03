"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const userResolver_1 = require("./resolvers/userResolver");
const typeorm_1 = require("typeorm");
(async () => {
    const app = (0, express_1.default)();
    app.get('/', (_req, res) => res.send('hello!'));
    await (0, typeorm_1.createConnection)();
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [
                userResolver_1.UserResolver
            ]
        })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.listen(3001, () => {
        console.log('escuchando puerto 3001');
    });
})();
//# sourceMappingURL=index.js.map
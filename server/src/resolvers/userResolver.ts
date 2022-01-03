import 'dotenv/config'
import { User } from '../entity/User';
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { hash, compare } from 'bcryptjs';
import { MyContext } from '../MyContext';
import { createAccessToken, createRefreshToken } from '../auth';
import { isAuth } from '../isAuth';
import { SendRefreshToken } from '../sendRefreshToken';
import { getConnection } from 'typeorm';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: String
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hi!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return "Bye " + payload!.userId;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokenForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    
      return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email: email } });
    if (!user) throw new Error("Invalid login");

    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Invalid login");

    // success logged in
    SendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email", () => String) email: string,
    @Arg("password", () => String) password: string
  ) {
    try {
      const hashPassword = await hash(password, 12);
      await User.insert({
        email: email,
        password: hashPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
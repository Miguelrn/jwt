import {Response} from 'express'

export const SendRefreshToken = (res: Response, token: string) => {
    return res.cookie(
        'jid', 
        token,
        {
            httpOnly: true,
            path: '/refresh_token'
        },
    )
}
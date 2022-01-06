import React from 'react'
import { useUsersQuery } from '../generated/graphql'

export default function Home() {
    const {data, loading} = useUsersQuery({fetchPolicy: 'network-only'});

    if(!data || loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <div>users:</div>
            <ul>
                {
                    data.users.map(user => {
                        return <li key={user.id}>{user.email}, {user.id}</li>
                    })
                }
            </ul>
        </div>
    )
}

import React from 'react'
import { useByeQuery } from '../generated/graphql'

export default function Bye() {
    const {data, loading, error} = useByeQuery({
        fetchPolicy: 'network-only'
    })

    if(loading) {
        return <div>loading...</div>
    }

    if(error) {
        return <div>Error, {error.message}</div>
    }

    return (
        <div>
            hola mundo, restringido {data?.bye}
        </div>
    )
}

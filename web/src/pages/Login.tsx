import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { useLoginMutation } from '../generated/graphql';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login] = useLoginMutation();
    const navigate = useNavigate();

    return (
        <form onSubmit={ async e => {
            e.preventDefault();
            const res = await login({
                variables: {
                    email: email,
                    password: password
                }
            });

            if(res && res.data) {
                setAccessToken(res.data.login.accessToken);
                navigate('/');
            }
            
        }}>
            <div>
                <input value={email} placeholder='email' onChange={e => setEmail(e.target.value)}></input>
            </div>
            <div>
                <input value={password} type={password} placeholder='password' onChange={e => setPassword(e.target.value)}></input>
            </div>
            <button type='submit'>Login</button>
        </form>
    )
}

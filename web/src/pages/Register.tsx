import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';


interface iProps {

}

export default function Register(props: iProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register] = useRegisterMutation();
    const navigate = useNavigate();

    return (
        <form onSubmit={ async e => {
            e.preventDefault();
            await register({
                variables: {
                    email: email,
                    password: password
                }
            });
            navigate('/');
        }}>
            <div>
                <input value={email} placeholder='email' onChange={e => setEmail(e.target.value)}></input>
            </div>
            <div>
                <input value={password} type={password} placeholder='password' onChange={e => setPassword(e.target.value)}></input>
            </div>
            <button type='submit'>Register</button>
        </form>

    )
}

import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const API = 'http://localhost:5000';

export default function AuthPage() {
    const location = useLocation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.pathname !== '/register');

    useEffect(() => {
        setIsLogin(location.pathname !== '/register');
    }, [location.pathname]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const res = await axios.post(`${API}/auth/login`, { email, password });
                localStorage.setItem('token', res.data.token);
                navigate('/');
            } else {
                await axios.post(`${API}/auth/register`, { name, email, password });
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    }

    return (
        <Container className="my-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">{isLogin ? 'Login' : 'Register'}</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                {!isLogin && (
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
                    </Form.Group>
                )}
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                    {isLogin ? 'Login' : 'Register'}
                </Button>
            </Form>

            <p className="mt-3 text-center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button variant="link" className="p-0" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Register' : 'Login'}
                </Button>
            </p>
        </Container>
    );
}
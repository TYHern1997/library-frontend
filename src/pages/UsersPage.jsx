import { useState, useEffect, useRef } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';
import { ClockHistory } from 'react-bootstrap-icons';

const API = 'https://library-backend-huqa.onrender.com';

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [historyFor, setHistoryFor] = useState(null);
    const [history, setHistory] = useState([]);
    const iconRefs = useRef({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API}/auth/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleHistoryClick = async (userId) => {
        if (historyFor === userId) {
            setHistoryFor(null);
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API}/auth/users/${userId}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(res.data);
            setHistoryFor(userId);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4">Users</h2>
            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Borrow History</th>
                        <th>Member Since</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                                <span ref={(el) => (iconRefs.current[u.id] = el)}>
                                    <ClockHistory
                                        role="button"
                                        onClick={() => handleHistoryClick(u.id)}
                                    />
                                </span>
                                <Overlay
                                    show={historyFor === u.id}
                                    target={() => iconRefs.current[u.id]}
                                    placement="bottom"
                                    rootClose
                                    onHide={() => setHistoryFor(null)}
                                >
                                    <Popover>
                                        <Popover.Body>
                                            {history.length === 0 ? (
                                                'No books borrowed'
                                            ) : (
                                                <ul className="mb-0 ps-3">
                                                    {history.map((h, i) => (
                                                        <li key={i}>
                                                            {h.title} — {new Date(h.borrowed_at).toLocaleDateString()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </Popover.Body>
                                    </Popover>
                                </Overlay>

                            </td>
                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}
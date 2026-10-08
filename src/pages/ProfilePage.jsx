import { Container, Table, Tabs, Tab, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://library-backend-huqa.onrender.com';

export default function ProfilePage() {

    const [borrows, setBorrows] = useState([]);
    const token = localStorage.getItem('token');

    const fetchBorrows = async () => {
        try {
            const res = await axios.get(`${API}/borrows/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBorrows(res.data);
        } catch (err) {
            console.error(err);
        }

    };

    useEffect(() => {
        if (token) fetchBorrows();
    }, [])

    const handleReturn = async (bookId) => {
        try {
            await axios.put(`${API}/borrows/${bookId}/return`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchBorrows();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to return book');
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString();

    // Current: not returned yet
    const current = borrows.filter((b) => !b.returned_at);

    // History: returned borrows, one row per book (the list is newest first)
    const seen = new Set();
    const history = borrows.filter((b) => {
        if (!b.returned_at || seen.has(b.book_id)) return false;
        seen.add(b.book_id);
        return true;
    });

    return (
        <Container className="my-5">
            <h2 className="mb-4">My Borrows</h2>

            <Tabs defaultActiveKey="current" className="mb-3">
                <Tab eventKey="current" title={`Current Borrow (${current.length})`}>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Year</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current.length === 0 ? (
                                <tr><td colSpan="5" className="text-center">No books borrowed right now.</td></tr>
                            ) : (
                                current.map((b) => (
                                    <tr key={b.book_id}>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.category}</td>
                                        <td>{b.year}</td>
                                        <td>
                                            <Button size="sm" variant="outline-secondary" onClick={() => handleReturn(b.book_id)}>
                                                Return
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Tab>

                <Tab eventKey="history" title={`History (${history.length})`}>
                    <Table bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Year</th>
                                <th>Last Borrowed</th>
                                <th>Last Returned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr><td colSpan="6" className="text-center">No returned books yet.</td></tr>
                            ) : (
                                history.map((b) => (
                                    <tr key={b.book_id}>
                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.category}</td>
                                        <td>{b.year}</td>
                                        <td>{formatDate(b.borrowed_at)}</td>
                                        <td>{formatDate(b.returned_at)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    );
}
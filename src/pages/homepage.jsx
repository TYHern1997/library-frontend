import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Form, Button, Row, Col, } from 'react-bootstrap';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import { jwtDecode } from 'jwt-decode'

const API = 'https://library-backend-huqa.onrender.com';



export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;


  const fetchBooks = async (query = '') => {
    try {
      const res = await axios.get(`${API}/books`, { params: { search: query } });
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/books/${editingId}`, { title, author, category, year });
        setEditingId(null);
      } else {
        await axios.post(`${API}/books`, { title, author, category, year });
      }
      setTitle(''); setAuthor(''); setCategory(''); setYear('');
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`${API}/books/${id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await axios.post(`${API}/borrows/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to borrow book');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await axios.put(`${API}/borrows/${bookId}/return`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to return book');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(search);
  };



  const handleEdit = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category || '');
    setYear(book.year);
  };
  return (


    <Container className="my-5">
      <h2 className="mb-4">Book Collection</h2>


      {/* Add / Edit form — same form handles both, editingId decides which */}
      {user?.role === 'admin' && (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Row className="g-2 align-items-end">
            <Col sm={3}>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title" required />
            </Col>
            <Col sm={3}>
              <Form.Control
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                required
              />
            </Col>
            <Col sm={2}>
              <Form.Control
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
              />
            </Col>
            <Col sm={2}>
              <Form.Control
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                required
              />
            </Col>
            <Col sm={2}>
              <Button type="submit" variant="primary" className="w-100">
                {editingId ? 'Update Book' : 'Add Book'}
              </Button>
            </Col>
          </Row>
        </Form>
      )}


      {/* Search bar — separate form, calls fetchBooks with the query */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2">
          <Col sm={4}>
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
            />
          </Col>
          <Col sm={2}>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Book list */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.year}</td>
              <td>{book.status}</td>
              <td>
                {user?.role === 'admin' ? (
                  <>
                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(book)}>
                      <PencilSquare />
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(book.id)}>
                      <Trash />
                    </Button>
                  </>
                ) : user ? (
                  book.status === 'Available' ? (
                    <Button size="sm" variant="outline-primary" onClick={() => handleBorrow(book.id)}>
                      Borrow
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline-secondary" onClick={() => handleReturn(book.id)}>
                      Return
                    </Button>
                  )
                ) : (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => alert('Please log in to borrow books.')}
                  >
                    Borrow
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>


  );
}
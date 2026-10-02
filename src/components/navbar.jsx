import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function NavBar() {


    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const user = token ? jwtDecode(token) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    return (
        <Navbar expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/">Readers Reserve</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        {user?.role === 'admin' && <Nav.Link href="/users">Users</Nav.Link>}
                    </Nav>
                    {token ? (
                        <>
                            <Nav.Link as={Link} to="/profile" className="me-2">{user?.name}</Nav.Link>
                            <Button variant="primary" onClick={handleLogout}>Logout</Button>
                        </>

                    ) : (
                        <>
                            <Button as={Link} to="/auth" variant="primary" className="me-2">Login</Button>
                            <Button as={Link} to="/register" variant="primary">Register</Button>
                        </>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
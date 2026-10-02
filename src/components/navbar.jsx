import { Navbar, Container, Nav, Button } from 'react-bootstrap';

export default function NavBar() {
    return (
        <Navbar expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand href="/">Readers Reserve</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    <Button variant="primary" className="me-2">Login</Button>
                    <Button variant="primary">Register </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
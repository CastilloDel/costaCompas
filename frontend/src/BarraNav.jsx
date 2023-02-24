import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export const BarraNav = () => {
    return (
        <Navbar bg="light" className="shadow">
            <Container>
                <Navbar.Brand className="d-flex align-items-center py-0" href="/">
                    <img
                        alt=""
                        src="./assets/LogoCC.svg"
                        width="40"
                        height="40"
                        className="d-inline-block align-center me-2"
                    />{' '}
                    CostaCompás
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

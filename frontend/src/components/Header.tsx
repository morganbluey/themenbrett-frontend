import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "./LinkContainer";
import { deleteLogin } from "../auth/api";
import { useLoginContext } from "../LoginContext";

interface HeaderProps {
  onLoginClick: () => void;
}

function Header({ onLoginClick }: HeaderProps) {
  const { login, setLogin } = useLoginContext();

  const doLogout = async () => {
    await deleteLogin();
    setLogin(false);
  };

  return (
    <Navbar expand="lg" className="bg-light" collapseOnSelect>
      <Container>
        <Navbar.Brand href={import.meta.env.BASE_URL}>Themenbrett</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav variant="pills" className="ms-auto">
            {login ? (
              <LinkContainer to="/">
                <Nav.Link data-testid="logout" onClick={() => doLogout()}>Logout</Nav.Link>
              </LinkContainer>
            ) : (
              <Nav.Link data-testid="login-open" onClick={onLoginClick}>Login</Nav.Link>
            )}
            {login && login.role === "a" ? (
              <LinkContainer to="/admin">
                <Nav.Link data-testid="admin-link">Admin</Nav.Link>
              </LinkContainer>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

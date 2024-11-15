import Container from "react-bootstrap/Container";
import logo from "../logo.svg";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import TicTacToe from "./TicTacToe";
import BoardGame from "./BoardGame";
import Ludo from "./Ludo";
import Solitare from "./Solitare";
import WordPlay from "./WordPlay";

function BasicNav() {
  return (
    <BrowserRouter>
      <Navbar bg="success" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              width="20"
              height="30"
              className="d-inline-block align-top"
              alt="React"
            />
            &nbsp;&nbsp;&nbsp;&nbsp;BG
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Boardgames
              </Nav.Link>

              <Nav.Link as={NavLink} to="/tictactoe">
                TicTacToe
              </Nav.Link>
              <Nav.Link as={NavLink} to="/ludo">
                Ludo
              </Nav.Link>
              <NavDropdown title="Magic" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/solitare">
                  Solitare
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/action">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/something">
                  Something
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/getuser">
                  Get Gamers
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Routes>
        <Route exact path="/" element={<BoardGame />} />
        <Route exact path="/tictactoe" element={<TicTacToe />} />
        <Route exact path="/ludo" element={<Ludo />} />
        <Route exact path="/solitare" element={<Solitare />} />
        <Route exact path="/getuser" element={<WordPlay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default BasicNav;

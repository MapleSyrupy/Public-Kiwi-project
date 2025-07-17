import { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import styles from "../Styles/App.module.css"

 export default function BasicExample() {
    return (
      <Navbar expand="lg"  bg="dark" data-bs-theme="dark" className=" Nav sticky-top" >
        <Container className = {styles.container}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/start">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          </Container>
      </Navbar>
    );
  }

 
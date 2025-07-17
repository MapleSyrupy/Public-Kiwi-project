import { useState } from 'react'
import { useRouteError } from "react-router-dom";
import Released from "../Templates/Navbar";
import Card from 'react-bootstrap/Card';


function BasicExample() {
  const error = useRouteError();
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Img src="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2629&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></Card.Img>
        <Card.Title>Oh no An Error</Card.Title>
        <Card.Text>
          Something Went Wrong
        </Card.Text>

      </Card.Body>
    </Card>

  );
}


export default function main() {

  return (
    <>
      <Released />
      <div className="d-flex align-items-center justify-content-center vh-100">
        <BasicExample />
      </div>
    </>
  )
}
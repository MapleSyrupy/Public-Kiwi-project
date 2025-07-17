import { useState } from 'react';
import {useNavigate,useNavigation} from "react-router-dom"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import NavBar from "../Templates/Navbar"
import Card from 'react-bootstrap/Card';
import CardTitle from 'react-bootstrap/esm/CardTitle';
import Alert from 'react-bootstrap/Alert';
import axios from "axios";
import style from "../Styles/login.module.css"

// Remember to protect this page against already logged in users
function FormExample() {
    const [validated, setValidated] = useState(false);
    const [Username, setUsername] = useState("");
    const [Password,SetPassword] = useState("");
    const [alert,Setalert] = useState(false)
    const [disabled,Setdisabled] = useState(false);
    const navigate = useNavigate();
    const navigation = useNavigation();
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } 
        setValidated(true);
        
        axios.post('http://localhost:3000/productivity/login', {
          
            username:Username,
            password:Password,
          
          },{headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        withCredentials:true
            
    })
          .then(function (response) {
            Setdisabled(true)
            navigate("/index/" + response.data);
          })
          .catch(function (error) {
            if(error.status === 401){
            
                Setalert(true)
                setUsername("");
                SetPassword("");
                setTimeout(()=>{
                 Setalert(false)
             },5000)
            }else{
                navigate("/error")
            }
           
          });
          
    };    function Link() {
        
        return (
          <>
  
              <Alert key= "danger" variant="danger" className = "text-center">
                Wrong Username or Password!
              </Alert>

          </>
        );
      }
    return (
        <>

        <NavBar />
        <div className = {style.main}>
        <div className={
          navigation.state === "loading" ? style.loading : ""
        }>
          
        <div className ="  d-flex align-items-center justify-content-center vh-100 " >
        
        <Card style={{ width: '20rem' }} className='shadow mb-5 bg-white rounded '>
    
        <Card.Img variant="top" src="https://images.unsplash.com/photo-1522199670076-2852f80289c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VG9ET3xlbnwwfHwwfHx8MA%3D%3D" />
      <Card.Body >
      {alert ? <Link /> : ""}
        <Form noValidate validated={validated} onSubmit={handleSubmit} className = "col-md-10 mx-auto text-center" >
            <Row className="mb-2 ">
            <CardTitle>Log In</CardTitle>
            
                <Form.Group className="mb-3 " controlId="validationCustom01">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        disabled = {disabled}
                        type="text"
                        placeholder="Username"
                        name = "username"
                        value = {Username}
                        onChange={e=>setUsername(e.target.value)}
                   />


                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                
            </Row>
            <Row className="mb-3">


                <Form.Group className="mb-3" controlId="validationCustom01">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        disabled = {disabled}
                        type="text"
                        placeholder="Password"
                        name = "password"
                        value = {Password}
                        onChange={e=>SetPassword(e.target.value)}
                    />


                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Button type="submit" variant = "outline-dark" className = "tw-rounded-full ">Submit form</Button>
        </Form>
      </Card.Body>
    </Card>
        </div>
        </div>
        </div>

        </>
    );
}

export default FormExample;
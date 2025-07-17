import { useState } from 'react';
import { useEffect } from 'react';
import { FormControl, NavItem, Offcanvas } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { NavLink, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import MenuIcon from '@mui/icons-material/Menu';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import axios from "axios";
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import {useLoaderData} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import styles from "../Styles/list.module.css"
import Kiwi from "../../public/kiwi.jsx"
function ProgressBar(props){
  const list = useLoaderData();

  return(<>
  <div className = "d-flex justify-content-center align-items-center mb-5">
<Kiwi toma = {list.found2.toma} />
 
  </div>
  <div className = "text-center ">

  <progress className="tw-progress tw-progress-success tw-w-2/3 " value={list.found2.toma} max="100"></progress>
  <p>{list.found2.toma}</p>
  </div>
  </>)
  
}
function NavSideBar(props){
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const loader = useLoaderData();
    return(
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
<a type = "button" href = {`/index/${loader.found2._id}}`} className = "border rounded border-3 ">
    <MenuIcon ></MenuIcon>
    </a>
    </Container>
  </Navbar>

</>
    )
}
function Categories(props){
  const loaders = useLoaderData();
  console.log(loaders)
 return(
  <>
       <Card className =  "mt-5 tw-mx-20 tw-w-1/3 tw-h-52 float-start">
      <Card.Body className = "tw-w-5/6 ">
        <Card.Title>Timer+Test</Card.Title>
        <Card.Text>
          Want to start a study session and maybe test yourself after that? Click here!
        </Card.Text>
        <Button variant="primary" href = {`/List/${props.userId}/studyStartup`}>Study Timer Setup</Button>
      </Card.Body>
    </Card>
    
    <Card className =  "mt-5 tw-mx-20 tw-w-1/3 tw-h-52 float-end">
      <Card.Body>
        <Card.Title>History</Card.Title>
        <Card.Text>
          Study timers history
        </Card.Text>
        <Button variant="primary" href = {`/start/${props.userId}/testsPrep`} disabled = {loaders.found3.length===0?true:false}>Go</Button>
      </Card.Body>
    </Card>

  </>
 )
}
export default function(){

    const navigate = useNavigate();
    const [userId,setuserId] = useState("");
    const list = useLoaderData();
    useEffect(() => {
      axios("http://localhost:3000/productivity/user", {
        method: "GET",
        withCredentials: true
      })
      .then((res)=>{
        setuserId(res.data.user)
      })
        .catch((err) => {
          if (err.status === 401) {
            navigate("/login")
          }
          else {
            navigate("/error")
          }
        })
     if(list.found2.toma===0||list.found2.toma<0){
      setTimeout(()=>{
        navigate("/KiwisRevenge")
      },2000)
    }
      axios.post(`http://localhost:3000/timeLogger`, {
        data: {
          x:"A"
        }
      },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true
        }
      )

    }, [])
  
        
return( 
    <>
<NavSideBar userId = {userId}/>
<div className = "d-flex justify-content-center align-items-center mt-5 ">
<div className = "border tw-w-4/6 ">
<ProgressBar /><br></br>
<Categories userId={userId} className = "tw-bg-white"/>
</div>
</div>

</>
)
}

import Button from 'react-bootstrap/Button';
import Released from "../Templates/Navbar"
import Stack from 'react-bootstrap/Stack';
import  styles from "../Styles/App.module.css";


function MyButton(){
    return(
        <Button variant="primary">Primary</Button>
    )
}

function ButtonGrid() {
    return (
        <Stack gap={2} className= "col-md-3 mx-auto text-center justify-content-center vh-100">
          <h1 className = "tw-font-bold tw-text-5xl">Welcome!</h1>
          <Button  href = "/signUp" className = "tw-rounded-full tw-bg-neutral-900">Sign Up</Button>
          <Button  href = "/login" className = "tw-rounded-full tw-bg-neutral-900">Log In</Button>
        </Stack>
      );
  }
  
export default function(){
    return(
     
     <body className = {styles.main}>
      <Released />
      <ButtonGrid />
      </body>
    
  
    )
}

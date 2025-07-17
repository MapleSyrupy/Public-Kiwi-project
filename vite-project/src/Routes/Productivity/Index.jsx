import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import styles from "../../Styles/index.module.css"
import { NavLink, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Accordion from 'react-bootstrap/Accordion';
import { FormControl, NavItem, Offcanvas } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Nav from 'react-bootstrap/Nav';
import DeleteIcon from '@mui/icons-material/Delete';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Minikiwi from '../../../public/Minikiwi';
import Chip from '@mui/joy/Chip';
function Sidebar(props) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container >
<a type = "button" onClick = {handleShow} href = {`/List/${props.user}`}><p className = "mx-5 tw-text-orange-400" style = {{float:"left"}}>Click here to switch to Feed the Kiwi!!</p>
  <Minikiwi />
        </a>
</Container>
      </Navbar>
 
  
    </>
  )
}

function Link(props) {

  return (
    <>

      <Alert key="danger" variant="danger" className="text-center">
        {props.alert}
      </Alert>

    </>
  );
}
function Inputs(props) {
  return (
    <>
      <InputGroup>
        <Form.Control as="textarea" aria-label="With textarea" size="lg" placeholder=" Todo Description" className="border rounded-0" value={props.Description} onChange={e => props.setDescription(e.target.value)} />
      </InputGroup>
      <InputGroup className="tw-bg-slate-200 d-flex align-items-center justify-content-center">
        <input type="date" className="tw-bg-slate-200 border-0 mr-3" size="sm" value={props.date} onChange={e => props.setDate(e.target.value)} />
        <input type="time" className="tw-bg-slate-200 border-0" size="sm" value={props.time} onChange={e => props.setTime(e.target.value)} />
        <Button className="btn btn-success rounded-0" type="submit">Make ToDO</Button>
      </InputGroup>

    </>
  )
}
function Forms(props) {
  const [showInputs, setShowInputs] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [Description, setDescription] = useState("");
  const [ToDoName, setTodoName] = useState("");
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [alert, setAlert] = useState("")
  const handleSubmit = (event) => {
    event.preventDefault()
    if (ToDoName === "" || Description === "") {
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 5000)
      setAlert("ToDoName or description is not filled")
    } else {
      axios.post(`http://localhost:3000/productivity/new/${props.chosenCategories}`, {
        data: {
          name: ToDoName,
          description: Description,
          date: date,
          time: time
        }
      },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true
        }
      )
        .then((res) => {
          const data = [res.data]
          if (res.data.isImportant === false) {
            console.log("LOL")
            const un = data.filter(data => data.isImportant === false);
            props.SetUnimportant([...props.unImportant, ...un]);
          } else {

            props.setToDoes([...props.toDoes, ...data])
          }



        })
        .catch((err) => {
          console.log(err)
          navigate("/error")
        })

    }
    setTodoName("")
    setDescription("")
    setDate("")
    setTime("")
    // const newArray = [{name:ToDoName,description:Description,date:date,time:time,isImportant:false}]
    // props.setToDoes([...props.toDoes,...newArray])
    // const uni = newArray.filter(newArray=>newArray.isImportant===false);
    // props.SetUnimportant([...props.unImportant,...uni]);
    // console.log(uni)
  }
  return (
    <Form noValidate onSubmit={handleSubmit} className="tw-border-2 tw-rounded" >
      {showAlert ? <Link alert={alert} /> : ""}
      <InputGroup >

        <InputGroup.Text id="basic-addon1" className="border-0" >+</InputGroup.Text>
        <Form.Control

          required
          className="border-0"
          placeholder="New Todo here!"
          aria-label="New Todo"
          aria-describedby="basic-addon1"
          size="lg"
          value={ToDoName}
          onFocus={() => setShowInputs(true)}
          onChange={e => setTodoName(e.target.value)}
        />

      </InputGroup>
      {showInputs ? <Inputs setDescription={setDescription} setDate={setDate} setTime={setTime} Description={Description} date={date} time={time} /> : ""}
    </Form>
  )
}

function OffCanvas(props) {
  return (
    <Offcanvas show={props.show} onHide={props.handleClose} placement="end" name="end" scroll backdrop={false} >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Offcanvas</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Form onSubmit={() => props.EditFunction(event, props.offCanvasData._id)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control value={props.offCanvasData.name} onChange={e => props.setoffCanvasData({...props.offCanvasData,name:e.target.value})} />
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value = {props.offCanvasData.description} onChange={e => props.setoffCanvasData({...props.offCanvasData,description:e.target.value})} />
            <input type="date" className="tw-bg-slate-200 border-0 mr-3" size="sm"value = {props.offCanvasData.date} onChange={e => props.setoffCanvasData({...props.offCanvasData,date:e.target.value})}/>
            <input type="time" className="tw-bg-slate-200 border-0" size="sm"value = {props.offCanvasData.time} onChange={e => props.setoffCanvasData({...props.offCanvasData,time:e.target.value})} />

          </Form.Group>
          <button className="btn btn-success" type="submit" onClick = {props.handleClose}>Update</button>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
function Accord(props) {
  const [advancedShow,setAdvancedShow] = useState(false);
  const [show, setShow] = useState(false);
  const [offCanvasData, setoffCanvasData] = useState({name:"",description:"",date:"",time:""})
  const [data,setData] = useState("")
  const handleClose = () => setShow(false);
  const EditFunction = (event, x) => {
    event.preventDefault()
    axios.post(`http://localhost:3000/productivity/index/edit/${x}`, {
      
        name: offCanvasData.name,
        description: offCanvasData.description,
        date: offCanvasData.date,
        time: offCanvasData.time
      ,
      headers: {
        "content": "application/json"
      }
    })
      .then((res) => {
        const data = res.data;
        const update1 = props.unImportant.filter((item)=>item._id !== data._id)
        props.SetUnimportant([offCanvasData,...update1])
        const update2 = props.late.filter((item)=>item._id !== data._id)
        props.setLate([offCanvasData,...update2])
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function handleCheck(x) {
    axios.post("http://localhost:3000/productivity/index/checked", {
      data: {
        _id: x
      }
    },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true
      }
    )
      .then((res) => {

        const data = res.data
        const removed = props.unImportant.filter((item) => item._id !== data._id)
        props.setChecked([...props.checked, data])
        props.SetUnimportant(removed)
      })
      .catch((err) => {
        console.log(err)
        navigate("/error")
      })

  }
  function handleCheck2(x) {
    axios.post(`http://localhost:3000/productivity/index/${x}/unchecked`,
      {
        data: {
          "x": "X"
        }
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true
      }

    )
      .then((res) => {
        const data = res.data
        const removed = props.checked.filter((item) => item._id !== data._id)
        const notRemoved = props.checked.filter((item) => item._id === data._id && item.isLate === false)
        const late = props.checked.filter((item) => item.isLate === true && item._id===data._id)
        props.setLate([...props.late,...late])
        props.setChecked([...removed])
        props.SetUnimportant([...props.unImportant, ...notRemoved])
      })
      .catch((err) => {
        console.log(err)
        navigate("/error")
      })

  }

  function handleCheckLateEdition(x) {
    axios.post("http://localhost:3000/productivity/index/checked", {
      data: {
        _id: x
      }
    },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true
      }
    )
      .then((res) => {
        const data = res.data
        const removed = props.late.filter((item) => item._id !== data._id)
        props.setChecked([...props.checked, data])
        props.setLate(removed)
      })
      .catch((err) => {
        console.log(err)
        navigate("/error")
      })

  }
  function handleCheckImportantEdition(x){
      axios.post(`http://localhost:3000/productivity/toDo/${x}/important`,
        {body:{_id:x}},
      )
      .then((res)=>{
        if(res.data.isImportant === false){
        let found = props.unImportant.filter((item)=>item._id!==res.data._id)
        props.SetUnimportant([res.data,...found])
        }
      })
      .catch((err)=>{
        navigate("/error")
      })
  }
  function deleteHandler(x) {
    axios.delete(`http://localhost:3000/productivity/index/delete/${x}`,

      { body: { _id: x } },
      { withCredentials: true }
    )
      .then((res) => {
        const data = res.data
        const removed = props.checked.filter((item) => item._id !== data._id)
        const notRemoved = props.unImportant.filter((item) => item._id !== data._id)
        const notRemoved2 = props.late.filter((item) => item._id !== data._id)
        props.SetUnimportant([...notRemoved])
        props.setChecked([...removed])
        props.setLate([...notRemoved2])
      })
      .catch((err) => {
        navigate("/error")
      })
  }
  function categorySubmit(event){
      axios.post(`http://localhost:3000/makeCategory/${props.user}`,{
        data: {
          data:data
        }
      },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
       
      )
      .then((res)=>{
        console.log(res)
      })
      .catch((err)=>{
        console.log(err)
        navigate("/error")
      })
    
  }
 
 function handleDeleteCategoryEdition(x){
axios.post(`http://localhost:3000/deleteCategory/${props.user}`,  {
  data: {
  data:x
}
},
{
  headers: {
    "Content-Type": "application/json",
  }
}

)
.then((res)=>{
console.log(res)
})
.catch((err)=>{
console.log(err)
navigate("/error")
})
 }

  return (
    <>
    
      <OffCanvas  show={show} handleClose={handleClose} setoffCanvasData={setoffCanvasData} offCanvasData={offCanvasData} EditFunction={EditFunction} />
      <Nav variant="tabs" className="tw-mt-2  shadow">
     {props.categories.map(linky=>
     <Nav.Item  onClick={()=>props.SetchosenCategories(linky)} key = {linky}>
      <Nav.Link active= {props.chosenCategories === "General"?true:""} eventKey = {linky} >{linky} </Nav.Link>
      </Nav.Item>
      )}
       {props.fixedCategories.map(linky2=>
     <Nav.Item  onClick={()=>props.SetchosenCategories(linky2)} key = {linky2}>
      <Nav.Link key = {linky2} eventKey = {linky2} > {linky2} </Nav.Link> 
      </Nav.Item>
      
      )}
       <Nav.Item >
        <Nav.Link  onClick = {()=>setAdvancedShow(true)}>{advancedShow === false?"+":<Form onSubmit = {categorySubmit}>
          <FormControl  size = "sm" onChange = {e=>setData(e.target.value)} ></FormControl>
          </Form>}</Nav.Link>
       </Nav.Item>
       {props.chosenCategories!== "General"?
       <Container fluid className = "border">
      <Row>
        <Col className = "text-start">
        <Form className = "float-start" onSubmit = {()=>handleDeleteCategoryEdition(props.chosenCategories)}><button><DeleteIcon></DeleteIcon></button></Form>{props.chosenCategories}
        </Col>
      </Row>
    </Container>
      :""}
      </Nav>
      <Accordion defaultActiveKey="0" flush className="tw-mt-5 tw-border-2">
     
        <Accordion.Item eventKey="0" >
          <Accordion.Header>Uncompleted <Chip>{props.unImportant.length}</Chip></Accordion.Header>
          <Accordion.Body>
            {props.unImportant.length !== 0 ?
              <Table hover >
                <thead className = "text-start">
                  <tr>
                    <th style = {{"width":"20px"}}>Check!</th>
                    <th style = {{"width":"20px"}}>Important</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>



                <tbody className = "text-start">
                  {props.unImportant.map(toDo =>
                    <tr  key={toDo._id} onDoubleClick={() => [setShow(true),setoffCanvasData({name:toDo.name,description:toDo.description,date:toDo.date,time:toDo.time,_id:toDo._id})]}>
        
                      <td ><input aria-label = "checkButton"type="radio" className="tw-accent-blue-300" onChange={() => { handleCheck(toDo._id) }}></input></td>
                      <td><input defaultChecked = {toDo.isImportant===true?true:""} aria-label = "checkButton"type="checkbox" className="tw-accent-blue-300" onClick={() => { handleCheckImportantEdition(toDo._id) }}></input></td>
                      <td>{toDo.name} <button aria-label = "deleteButton"><DeleteIcon fontSize='12px' onClick={() => { deleteHandler(toDo._id) }}></DeleteIcon></button></td>
                      <td>{toDo.description}</td>
                      <td>{toDo.date ? toDo.date : "-"}</td>
                      <td>{toDo.time ? toDo.time : "-"}</td>
                    </tr>
                  )
                  }
                </tbody>

              </Table>
              : <h1>NOTHING HERE</h1>}

          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Completed! <Chip>{props.checked.length}</Chip></Accordion.Header>
          <Accordion.Body>

            {props.checked.length !== 0 ?
              <Table hover>
                <thead>
                  <tr>
                    <th>Check!</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>

                  {props.checked.map(toDo =>
                    <tr key={toDo._id}  onDoubleClick={() => [setShow(true),setoffCanvasData({name:toDo.name,description:toDo.description,date:toDo.date,time:toDo.time,_id:toDo._id})]}>
                      <td><input type="radio" className="tw-accent-blue-300" defaultChecked onClick={() => { handleCheck2(toDo._id) }} ></input></td>
                      <td ><s>{toDo.name}</s></td>
                      <td><s>{toDo.description}</s></td>
                      <td>{toDo.date ? toDo.date : "-"}</td>
                      <td>{toDo.time ? toDo.time : "-"}</td>
                    </tr>
                  )}



                </tbody>
              </Table>
              : <h1>NOTHING HERE</h1>}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Late  <Chip>{props.late.length}</Chip></Accordion.Header>
          <Accordion.Body>

            {props.late.length !== 0 ?
              <Table hover>
                <thead>
                  <tr>
                    <th>Check!</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>

                  {props.late.map(toDo =>
                    <tr key={toDo._id}  onDoubleClick={() => [setShow(true),setoffCanvasData({name:toDo.name,description:toDo.description,date:toDo.date,time:toDo.time,_id:toDo._id})]}>
                      <td><input type="radio" className="tw-accent-blue-300" onChange={() => { handleCheckLateEdition(toDo._id) }} ></input></td>
                      <td ><p className='tw-text-red-600'>{toDo.name}</p></td>
                      <td ><p className='tw-text-red-600'>{toDo.description}</p></td>
                      <td><p className = "tw-text-red-600">{toDo.date ? toDo.date : "-"}</p></td>
                      <td><p className = "tw-text-red-600">{toDo.time ? toDo.time : "-"}</p></td>
                    </tr>
                  )}



                </tbody>
              </Table>
              : <h1>NOTHING HERE</h1>}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );

}

export default function () {
  const [toDoes, setToDoes] = useState([])
  const [categories, setCategories] = useState([]);
  const [fixedCategories, setFixedCategories] = useState([])
  const [unImportant, SetUnimportant] = useState([]);
  const [checked, setChecked] = useState([]);
  const [late, setLate] = useState([]);
  const [chosenCategories, SetchosenCategories] = useState("General");
  const [userId,setuserId] = useState("");

  const navigate = useNavigate();

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

    axios.get(`http://localhost:3000/productivity/toDoes/${chosenCategories}`, {
      withCredentials: true
    })
      .then((res) => {
        const data = res.data.found
        const data2 = res.data.found2.fixedCategories
        const data3 = res.data.found2.categories
        const un = data.filter(data => data.checked === false && data.isLate === false )
        const check = data.filter(data => data.checked === true);
        const check2 = data.filter(data => data.checked !== true && data.isLate === true);
        setChecked([ ...check]);
        SetUnimportant([ ...un]);
        setLate([...check2])
        setCategories([...data2]);
        setFixedCategories([...data3])
      })
      .catch((err) => {
        console.log(err)
        navigate("/error")
      })

  }, [chosenCategories])
useEffect(()=>{
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
},[])

  return (
    <>
    <meta name = "description" content="ToDoSite"></meta>
      <div>
        <Sidebar userId = {userId}/>
      </div>
      <div id={styles.mainDiv}>
        <div className="tw-mt-20 tw-mr-20 tw-ml-20 tw-text-center"  >
          <div>
            <div>
              <Forms chosenCategories = {chosenCategories} toDoes={toDoes} setToDoes={setToDoes} unImportant={unImportant} SetUnimportant={SetUnimportant} />
              <Accord user = {userId} fixedCategories = {fixedCategories} chosenCategories = {chosenCategories} SetchosenCategories = {SetchosenCategories}categories = {categories}setLate={setLate} late={late} toDoes={toDoes} unImportant={unImportant} checked={checked} setChecked={setChecked} setToDoes={setToDoes} SetUnimportant={SetUnimportant} />
            </div>
          </div>

        </div>

      </div>
    </>

  )
}
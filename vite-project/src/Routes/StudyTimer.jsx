import { useLoaderData } from "react-router-dom"
import { useState } from "react"
import Countdown from "react-countdown";
import { useRef } from "react";
import { useEffect } from "react";
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ModalClose } from "@mui/joy";
import { Sheet } from "@mui/joy";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from "axios";
import { useNavigate } from "react-router-dom";
function List(props) {
    const [checked, setChecked] = useState([]);
    const [open, setOpen] = useState(false);
    const loader = useLoaderData();
    const unloaded = loader.found4[0]
    const unloaded2 = unloaded.affectedTodoes;
    const navigate = useNavigate();
    console.log(unloaded2)
    useEffect(() => {
        if (checked.length === unloaded2.length) {
            setOpen(true);
            props.countdownRef.current.pause()
        }
    }, [checked])
    function removeArray(y) {
        setChecked(checked.filter(check => check !== y))
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '16px',
        p: 4,
    };
    function handleClick(){
       navigate(`/List/${unloaded.author}`)
    }
    function handleClick2(){
        navigate(`/start/${unloaded._id}/test`)
    }
    return (
        <>
              <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={open}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Sheet

                        variant="outlined"
                        sx={style}
                    >
                        <Typography
                            component="h2"
                            id="modal-title"
                            level="h4"
                            sx={{ fontWeight: 'lg', mb: 1 }}
                        >
                        </Typography>
                   
                    {!unloaded.test?
                   <>
                    <h1>Congratulations, you have finsished this study session!</h1>
                    <Button variant = "contained" size = "small" className = "mt-3" onClick = {handleClick}>Finished</Button>
                   </>
                    :
                    <>
                    <h1>Finished studying, proceed to test</h1>
                    <Button variant = "contained" size = "small" className = "mt-3" onClick = {handleClick2}>Start Test?</Button>
                    </>
                    }
                    </Sheet>
                </Modal>
            <div className="d-flex justify-content-center align-items-center mt-5">

                <table className="table tw-w-2/3">
                    <thead>
                        <tr>
                            <th style={{ "width": "5rem" }}>Check</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unloaded2.map(x =>
                            <tr key={x._id}>
                                <td > <Checkbox size="x-small" onClick={(e) => e.target.checked === true ? setChecked([...checked, x._id]) : removeArray(x._id)} /></td>
                                <td>{x.name}</td>
                                <td>{x.description}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default function () {
    const loader = useLoaderData();
    const unloaded = loader.found4[0];
    const [starts, SetStart] = useState(0);
    const countdownRef = useRef();
    const navigate = useNavigate()
    console.log(loader)
    function handleStart(props) {
        props.start();

    }
    function handlePause(props) {
        props.pause();

    }
    useEffect(()=>{
        if(!unloaded){
            navigate(-1)
        }
    },[])

    const finishingFunction = (x)=>{
    axios.post("http://localhost:3000/productivity/endTimer",{
            unloaded,
            x,
        },
        {
            header:{
                "content":"application/json"
            }
        },
    )
      }
    const renderer = ({hours, minutes, seconds, completed }) => {

        if (completed) {
            console.log("yes")
        }
         else {
            const onTick = ((hours * 60) + minutes + (seconds / 60))
            const finale = ((onTick / unloaded.TimerList.time) * 100);
            return (
                <>
                    <div className="tw-radial-progress" style={{ "--value": finale, "--size": "12rem", "--thickness": "1rem" }} role="tw-progressbar">
                        <span>{hours}:{minutes}:{seconds}</span>
                    </div>

                </>

            )
        }

    };
    return (
        <>
        {unloaded?
           <>
            <section>
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <h1> <Countdown date={Date.now() + unloaded.TimerList.time * 60000} ref={countdownRef} renderer={renderer} autoStart={false} onPause={(x)=>finishingFunction(x.total)}/></h1>
                </div>
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <button className="tw-btn tw-btn-accent" onClick={() => handleStart(countdownRef.current)}  >Start</button>
                    {/* <button className="tw-btn tw-btn-error tw-ml-5" style={{ "float": "left" }} onClick={() => handlePause(countdownRef.current)} >Pause</button> */}
                </div>
            </section>
            <List countdownRef = {countdownRef} />
            </>
        :""}
        </>
    )
}
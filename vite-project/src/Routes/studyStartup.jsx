import { useLoaderData } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react";
import Table from '@mui/joy/Table';
import Button from '@mui/material/Button';
import axios from "axios";
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Checkbox } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/joy/CircularProgress';
function MainPart() {
    const [check, setCheck] = useState([])
    const [open, setOpen] = useState(false);
    const [time, setTime] = useState({});
    const [test, setTest] = useState(false);
    const [active, setActive] = useState(false);
    const loader = useLoaderData();
    console.log(loader)
    const navigate = useNavigate()
    const id = loader.found2._id;
    const handleSubmit = async () => {
        setActive(true)
        axios.post(`http://localhost:3000/productivity/${loader.found2._id}/startTimer`, {
            time,
            check,
            test,
            id

        },
            {
                headers: {
                    "content": "application/json"
                }
            }

        )
            .then((res) => {
                navigate(`/start/${res.data}/studyTimer`)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function removeArray(x) {
        setCheck(check.filter(check => check !== x))
    }
    return (
        <>

            <a className="btn btn-danger rounded float-end" href={`/list/${loader.found2._id}`} >X</a>
         {/* {loader.found.filter((y)=>y.categories==="General")?   */}
         <div className="shadow tw-bg-white">
        {loader.found.filter((y)=>y.categories==="General").length!==0? <div className="overflow-x-auto">
            <table className="table ">
                {/* head */}
                <thead>
                    <tr >
                        <th>General</th>
                    </tr>
                    <tr>
                        <th style={{ "width": "20px" }} >Check</th>
                        <th >Name</th>
                        <th >Description</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        loader.found.filter((y) => y.categories === "General")
                            .map(y =>
                                <tr key={y._id}>
                                    <td><input type="checkbox" onClick={(e) => e.target.checked === true ? setCheck([...check, y]) : removeArray(y)}></input></td>
                                    <td>{y.name}</td>
                                    <td>{y.description}</td>
                                </tr>

                            )

                    }

                </tbody>
            </table>

        </div>:""}


                {loader.found2.categories.map(x =>
                    <div className="overflow-x-auto" key={x}>
                        <table className="table ">
                            {/* head */}
                            <thead>
                                <tr >
                                    <th>{x}</th>
                                </tr>
                                <tr>
                                    <th style={{ "width": "20px" }} >Check</th>
                                    <th >Name</th>
                                    <th >Description</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    loader.found.filter((y) => y.categories === x)
                                        .map(y =>
                                            <tr key={y._id}>
                                                <td><input type="checkbox" onClick={(e) => e.target.checked === true ? setCheck([...check, y]) : removeArray(y)}></input></td>
                                                <td>{y.name}</td>
                                                <td>{y.description}</td>
                                            </tr>

                                        )

                                }

                            </tbody>
                        </table>

                    </div>


                )}
                <div className="d-flex justify-content-center"><form ><Button onClick={() => setOpen(true)} variant="contained" color="success" disabled={check.length !== 0 ? false : true}>Start?</Button></form></div>

                <Modal
                    aria-labelledby="modal-title"
                    aria-describedby="modal-desc"
                    open={open}
                    onClose={() => setOpen(false)}
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    {active === false ?
                        <Sheet

                            variant="outlined"
                            sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                        >
                            <ModalClose variant="plain" sx={{ m: 1 }} />
                            <Typography
                                component="h2"
                                id="modal-title"
                                level="h4"
                                textColor="inherit"
                                sx={{ fontWeight: 'lg', mb: 1 }}
                            >
                            </Typography>
                            <Table aria-label="basic table">
                                <thead>
                                    <tr>
                                        <th>Selected</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>Description</td>
                                        <td>Ammount of time needed? (minutes) </td>
                                    </tr>

                                    {check.map(x =>

                                        <tr key={x._id} >
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>
                                                <input type="number" placeholder="Type here" className="tw-input tw-input-bordered tw-w-full tw-max-w-xs tw-bg-white" onChange={(e) => setTime({ ...time, [x.name]: parseInt(e.target.value) })} />

                                            </td>
                                        </tr>
                                    )}


                                </tbody>
                            </Table>
                           
                            <div className="d-flex justify-content-center align-items-center">
                                <FormControlLabel control={<Checkbox />} onClick={() => setTest(!test)} checked={test === true ? true : false} label="Include Test?" />
                                <button className=" btn btn-primary" onClick={() => handleSubmit()}>Check</button>
                            </div>

                        </Sheet>
                         : <CircularProgress variant="soft" /> }
                </Modal>

            </div>

        </>
    )
}

export default function () {

    return (
        <>

            <MainPart className="tw-slate-400" />

        </>
    )
}
import styles from "../Styles/KiwiRevenge.module.css"
import Input from '@mui/joy/Input';
import { useState } from "react";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Button from '@mui/joy/Button';
import Modal from '@mui/material/Modal';
import { Sheet } from "@mui/joy";
import Typography from '@mui/material/Typography';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import CircularProgress from '@mui/joy/CircularProgress';
function Kiwi() {
    const styleSheet = { backgroundColor: "brown", transform: "rotate(30deg)" };
    return (
        <div id={styles.circle} style={styleSheet}>
            <div id={styles.circle2} style={{ float: "right", backgroundColor: "brown" }}>
                <div id={styles.line2}></div>
                <div id={styles.line3} ></div>
                <div id={styles.circle3} style={{ backgroundColor: "white" }} >
                    <div id={styles.line9}></div>
                    <div id={styles.line}>
                    </div>
                </div>
            </div>

        </div>
    )

}
export default function () {
    const [dataes, setData] = useState("");
    const [active, setActive] = useState(false);
    const [test, setTest] = useState("");
    const [open, setOpen] = useState(false);
    const [answers, setAnswers] = useState([{}]);
    const [inlineText,setInlineTex] = useState("")
    const [percentage,finalPercentage] = useState(0);
    const [active2,setActive2] = useState(false);
    const loader = useLoaderData();
    console.log(loader)
    const navigate = useNavigate(false);
    function handleSubmit(e) {
        e.preventDefault();
        setActive2(true)
        if (dataes !== "") {
            console.log(dataes)
            axios.post("http://localhost:3000/kiwisRevenge/test", { dataes })
                .then((data) => {
                    console.log(data.data)
                    setTest(data.data)
                    setActive2(false)
                })
                .catch((err) => {
                    console.log(err)
                })
            setActive(true)
        }

    }
    console.log(answers)
    function handleSelect(x, y, z) {
        console.log("yes")
        const found = answers.filter((b) => b.question !== x);
        setAnswers([...found, { question: x, answer: y, Realanswer: z }]);

    }
    function nothandleSelect(x, y, z) {
        console.log("yes")
        const found = answers.filter((b) => b.question !== x);
        setAnswers([...found, { question: x, answer: y, Realanswer: z }]);

    }
    function handleSubmit2(){
        let correct = 0
        for(let questions of answers){
            if(questions.answer === questions.Realanswer){
               correct+=1
            }
        }
        finalPercentage(Math.floor((correct-1)/(answers.length-1)*100))
      if(Math.floor((correct-1)/(answers.length-1)*100)>50){
        setOpen(true)
        setInlineTex("Congratulations, you did it! :D");
        axios.post("http://localhost:3000/kiwiForgive",{_id:loader.found2._id})
        setTimeout(()=>{
             navigate(`/List/${loader.found2._id}`)
        },5000)
      }else{
        setOpen(true)
        setInlineTex("SERIOUSLY? DO IT AGAIN")
        setTimeout(()=>{
            window.location.reload();
        },5000)
      }
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
    // function handleSubmit(){
    //     setOpen(true)
    //     let correct = 0
    //     for(let questions of answers){
    //         if(questions.answer === questions.Realanswer){
    //            correct+=1
    //         }
    //     }
    //     finalPercentage(Math.floor((correct-1)/(answers.length-1)*100));
    //     console.log(correct)
    //     axios.post("http://localhost:3000/test",{
    //             x:Math.floor(correct/(answers.length-1)*100),
    //             author:loader.data.author

    //     })
    // }
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
                   <h1>{inlineText}</h1>
                   <p>{`Your Score is ${percentage}%`}</p>
                    </Sheet>
                </Modal>
            <div className=" d-flex justify-content-center align-items-center border" style={{ height: "30vh", textAlign: "center" }}>
                <h1 className="tw-text-7xl">KIWI'S REVENGE</h1>
                <Kiwi />

            </div>
            <label></label>
            <div className="d-flex justify-content-center align-items-center">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <FormControl >
                        <FormLabel>Punishement: Input a test prompt</FormLabel>
                        <Input placeholder="You are terrible" value={dataes} onChange={e => setData(e.target.value)} />
                        <Button className="mt-3" type="submit" disabled={active}>Submit</Button>
                        <FormHelperText >Kiwi says screw you!</FormHelperText>
                    </FormControl>
                </form>
            </div>
            <div>
          <div className="d-flex justify-content-center align-items-center">
          {active2===true?<CircularProgress variant="soft" /> :    ""}
          </div>
          <div className="d-flex justify-content-center align-items-center mt-5">
          
                    <div className="tw-w-2/3">
                        {test ?
                            test.Questions.map(x =>
                                <div className=" shadow mb-3 rounded tw-h-48" key={x.question}>
                                    <h1>{x.question}</h1>
                                    {Object.keys(x.options).map(y =>
                                        <div key={x.options[y]}>
                                            <span className="label-text">{x.options[y]}</span>
                                            <input type="radio" name={x.question} className="radio checked:bg-blue-500" label={y} value={x.options[y]} onClick={(e) => e.target.checked ? handleSelect(x.question, e.target.value, x.answer) : nothandleSelect(x.question, e.target.value, x.answer)} />
                                        </div>

                                    )}

                                </div>

                            )

:""}
                     <div className  = "d-flex justify-content-center align-items-center">
                    <button className = "tw-btn tw-btn-success mb-5" onClick = {handleSubmit2}>Submit</button>
                    </div>
                    </div>

                </div>
            </div >
        </>


    )
}
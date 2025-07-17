import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { Sheet } from "@mui/joy";
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from "axios";
import { compareByFieldSpecs } from "@fullcalendar/core/internal";

export default function () {
    const [answers, setAnswers] = useState([{}]);
    const [percentage,finalPercentage] = useState(0)
    const [open, setOpen] = useState(false);
    const loader = useLoaderData();
    console.log(loader)
    const tests = JSON.parse(loader.data.test);
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
function handleSubmit(){
    setOpen(true)
    let correct = 0
    for(let questions of answers){
        if(questions.answer === questions.Realanswer){
           correct+=1
        }
    }
    finalPercentage(Math.floor((correct-1)/(answers.length-1)*100));
    console.log(percentage)
    axios.post("http://localhost:3000/test",{
            x:Math.floor((correct-1)/(answers.length-1)*100),
            author:loader.data.author

    })
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
                   <h1>Congratulations, you are done! :D</h1>
                   <p>{`Your Score is ${percentage}%`}</p>
                   <a className = "btn btn-primary" type = "button" href = {`/List/${loader.data.author}`}>Back</a>
                    </Sheet>
                </Modal>
            <div className="d-flex justify-content-center align-items-center mt-5">
                <div className="tw-w-2/3">
                    {tests.Questions.map(x =>
                       <div className=" shadow mb-3 rounded tw-h-48" key={x.question}>
                       <h1>{x.question}</h1>
                       {Object.keys(x.options).map(y =>
                           <div key={x.options[y]}>
                               <span className="label-text">{x.options[y]}</span>
                               <input type="radio" name={x.question} className="radio checked:bg-blue-500" label={y} value={x.options[y]} onClick={(e) => e.target.checked  ?  handleSelect(x.question,e.target.value,x.answer):nothandleSelect(x.question,e.target.value,x.answer)}  />
                           </div>

                       )}
                   </div>

                    )}
                    <div className  = "d-flex justify-content-center align-items-center">
                    <button className = "tw-btn tw-btn-success mb-5" onClick = {handleSubmit} disabled = {answers.length-1!==tests.Questions.length?true:false}>Submit</button>
                    </div>
                </div>
                    
            </div>
        </>
    )
}
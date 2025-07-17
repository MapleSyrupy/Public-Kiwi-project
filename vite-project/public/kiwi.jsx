import styles from "../src/Styles/kiwi.module.css"
import { useEffect } from "react";
import { useState } from "react"
export default function (props) {
    const [active, setActive] = useState(false)
    const [active2, notActive2] = useState(false);
    const styleSheet = { backgroundColor: props.toma > 80 ? "brown" : "#cad466"};
    // console.log(active)
    if(active===true){
       
    }
    return (
        <>
            <div className = {props.toma!==0?"":"mt-5"} style = {{transform:props.toma!==0?"":"rotate(180deg)"}} onMouseDown = {()=>setActive(true)} onMouseUp={()=>setActive(false)}>
                <div id={styles.circle} style={styleSheet}>
                    <div id={styles.line4}></div>
                    <div id={styles.line5}></div>
                    <div id={styles.circle2} style={{ float: "right", backgroundColor: props.toma > 80 ? "brown" : "#cad466" }}>
                        <div id={styles.line2}></div>
                        <div id={styles.line3} ></div>
                        <div id={styles.circle3} style={{ backgroundColor: props.toma > 80 ? "white" : "#edf59d" }} >
                            {props.toma!==0 ? <div id={styles.line} style = {{transform:active===true? "translate(0.5ch, 0.9mm)":""}}>
                            </div> :<><div id = {styles.line7} ></div><div id = {styles.line8}></div></>}
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}
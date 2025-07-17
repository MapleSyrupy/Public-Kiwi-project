import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
export default function () {
  const loader = useLoaderData();
  console.log(loader.found3)
  return (
    <>
    <div >
      <a className="btn btn-danger rounded float-end " style = {{position:"absolute"}}  href={`/list/${loader.found2._id}`}>X</a>
  {loader.found3.map(x =>
          <div className="d-flex justify-content-center align-items-center" key = {x._id}>
            <Card className="mt-5 tw-w-1/3 tw-h-42" >
              <Card.Body className="text-center">
                <Card.Title>{x.affectedTodoes[0].name}</Card.Title>
                <Card.Text>
                  {`Time(In Minutes):${x.TimerList.time}`}<br></br>
                  {x.affectedTodoes[0].description}

                </Card.Text>
                {x.test ? <Button variant="primary" href={`/start/${x._id}/test`}>Go somewhere</Button> : ""}
              </Card.Body>
            </Card>
          </div>
        )}
        </div>
    </>
  )
}
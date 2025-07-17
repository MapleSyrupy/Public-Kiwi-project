import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Start from './Routes/Start.jsx'
import ErrorPage from "./Errors/Error"
import Index from "./Routes/Productivity/Index.jsx"
import List from "./Routes/List.jsx"
import StudyStartup from './Routes/studyStartup.jsx'
import  Login from "./Routes/login.jsx"
import SignUp from "./Routes/signUp.jsx"
import StudyTimer from "./Routes/StudyTimer.jsx"
import axios from "axios"
import Test from "./Routes/test.jsx"
import OldtestsSetup from './Routes/OldtestsSetup.jsx'
import "./Styles/index.css"

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import KiwisRevenge from './Routes/KiwisRevenge.jsx'


const loaders = async()=>{
  const response2 = await axios.get("http://localhost:3000/productivity/toDoes",{withCredentials:true})
  return response2.data
}
const loaders2 = async()=>{
  const response = await axios.get("http://localhost:3000/productivity/studyTimers",{withCredentials:true})
    return response.data

}
const loaders3 = async({params})=>{
  const response = await axios.get(`http://localhost:3000/productivity/${params.id}/test`,{withCredentials:true})
    return response

}
const router = createBrowserRouter([
  {
    path:"/",
    errorElement:<ErrorPage />,
    children:[
      {
        path:"/Error",
        element:<ErrorPage />
      },
      {
        path: "/start",
        element: (
        <Start />
        ),
      },
      {
        path: "/index/:id",
        element: <Index />,
      },
      {
        path:"/login",
        element:<Login />,
      },
      {
        path:"/signUp",
        element:<SignUp />
      },
      {
        path:"/List/:id",
        element:<List />,
        loader: loaders
      },
      {
        path:"/List/:id/studyStartup",
        element:<StudyStartup />,
        loader:loaders
      },
      {
        path:"/start/:id/studyTimer",
        element:<StudyTimer />,
        loader:loaders2
      },
      {
        path:"/start/:id/test",
        element:<Test />,
        loader:loaders3
      },
      {
        path:"/start/:id/testsPrep",
        element:<OldtestsSetup />,
        loader:loaders
      },
      {
        path:"/KiwisRevenge",
        element:<KiwisRevenge />,
        loader:loaders
      }
    ]
  }
 
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
  <RouterProvider router={router} />
  </StrictMode>
);
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

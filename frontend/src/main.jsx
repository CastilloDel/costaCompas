import React from 'react'
import ReactDOM from 'react-dom/client'
import { Inicio } from './Inicio'
import { Resultados } from './Resultados'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BarraNav } from './BarraNav';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />,
  },
  {
    path: "/resultados",
    element: <Resultados />,
  },
  {
    path: "/resultados",
    element: <Resultados />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BarraNav />
    <RouterProvider router={router} />
  </React.StrictMode>,
)

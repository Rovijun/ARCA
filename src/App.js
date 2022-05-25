import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  Routes,
  Route,
} from "react-router-dom";
import Menu from "./pages/Menu"
import Graph from "./pages/Graph"
import Tableau from "./pages/Tableau"

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/graphe" element={<Graph />}/>
                <Route path="/tableau" element={<Tableau />}/>
            </Routes>
        </div>
    )
}

export default App

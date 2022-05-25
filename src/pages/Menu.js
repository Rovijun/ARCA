import React, { Component } from "react"
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default class Menu extends Component {

  async getTabs() {
    try {
        const response = await fetch('http://localhost:4000/api/total')
        await response.json()
    } catch (error) {
        console.log(error)
    }
  }

  async getGraphs() {
    try {
        const response = await fetch('http://localhost:4000/api/time/annee/2008')
        await response.json()
    } catch (error) {
        console.log(error)
    }
  }

  async componentDidMount(){
    this.getGraphs();
    this.getTabs();
  }

  render() { 
    return (
      <div>
        <div className="container d-flex align-items justify-content-center">
            <div style={{margin: 250}} className="mb-2">
              <div className="container d-flex align-items justify-content-center">
                <h1>MENU</h1>
              </div>
              <Link to="/tableau">
                <Button style={{padding: 100, margin: 25}} variant="secondary" size="lg">
                  Tableau
                </Button>
              </Link>
              <Link to="/graphe">
                <Button style={{padding: 100, margin: 25}} variant="secondary" size="lg">
                  Graphe
                </Button>
              </Link>
            </div>
        </div>
      </div>
    )
  }
}
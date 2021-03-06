import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables, ArcElement } from "chart.js"
import { ButtonGroup, Button, Spinner } from 'react-bootstrap'

Chart.register(...registerables)
Chart.register(ArcElement)

export default class Graphs extends Component {

  constructor(props){
    super(props)

    this.state = {
        datafull: [],
        year: '2008',
        isLoading: true
    }
}

async getGraph() {
  try {
      const response = await fetch('http://localhost:4000/api/time/annee/'+this.state.year)
      const req = await response.json()
      this.setState({datafull: req})
  } catch (error) {
      console.log(error)
  } finally {
      this.setState({ isLoading: false })
  }
}

async componentDidMount(){
  this.getGraph()
}

getYear=(one)=> {
  const isLoading = this.state
  this.setState({ year: one.target.value, isLoading: true}, this.getGraph)
  console.log("Annee", this.state.year)
}

renderIndicator() {
  const isLoading = this.state
  return (
    isLoading ?
    <div className="d-flex align-self-center flex-wrap justify-content-center">
      <div style={{margin: 250}} className="justify-content-center">
        <div className="container d-flex align-items justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
        <div>
          <span className="sr-only">Chargement...</span>
        </div>
      </div > 
    </div>: null
  )
}

  render() {
    const { datafull, year, isLoading } = this.state;
    let time = datafull.map((index) => {
      return index._id
    })
    let somme = datafull.map((index) => {
      return index.somme
    })
    let nombre = datafull.map((index) => {
      return index.nombre
    })

      return (
      <div className='container d-flex flex-column align-items justify-content-center'>   
        <h4> Somme des valeurs : {year}</h4>
        {isLoading ? this.renderIndicator() : (
        <Line
          data={{
            labels: time,
            datasets: [
              {
                label: "Valeur",
                data: somme,
                backgroundColor: ["rgba(75, 192, 192, 0.6)"],
                borderWidth: 3,
                fill: true
              },
              {
                label: "Nombre",
                data: nombre,
                backgroundColor: ["rgba(255,140,0, 0.6)"],
                borderWidth: 3,
                fill: true
              }
            ]}
          }
        />)} 
        <ButtonGroup onClick={this.getYear}>
          <Button variant="secondary" value="2008">2008</Button>
          <Button variant="secondary" value="2009">2009</Button>
          <Button variant="secondary" value="2010">2010</Button>
          <Button variant="secondary" value="2011">2011</Button>
          <Button variant="secondary" value="2012">2012</Button>
        </ButtonGroup>
      </div>
    )
  }
}

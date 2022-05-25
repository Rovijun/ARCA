import React, { Component } from "react"
import { Table, Button, Spinner, ButtonGroup } from 'react-bootstrap'
import { Line } from 'react-chartjs-2'
import { Chart, registerables, ArcElement } from "chart.js"

Chart.register(...registerables)
Chart.register(ArcElement)

export default class Tableaux extends Component {
    constructor(props){
        super(props)

        this.state = {
            data: [],
            datafull: [],
            isLoading: true,
            country:'',
            year: '2008'
        }
    }

    async getLists() {
        try {
            const response = await fetch('http://localhost:4000/api/total')
            const req = await response.json()
            this.setState({data: req})
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({ isLoading: false })
        }
    }

    async getGraph() {
        try {
            const response = await fetch('http://localhost:4000/api/total/'+this.state.country+this.state.year)
            const req = await response.json()
            this.setState({datafull: req})
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({ isLoading: false })
        }
      }

    async componentDidMount(){
        this.getLists()
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


    getSelect=(one)=> {
        this.setState({ country: one.target.value+'/', isLoading: true}, this.getGraph)
        console.log("Pays", this.state.country)
    }

    getYear=(one)=> {
        this.setState({ year: one.target.value, isLoading: true}, this.getGraph)
        console.log("Annee", this.state.year)
    }

    render() { 
        const { data, isLoading, country, datafull, year } = this.state

        let lists=data.map((val, key) => {
            return <tr key={key}>
                <td>{val._id}</td>
                <td>{val.nombre}</td>
                <td>{val.somme}</td>
                <td><Button variant="success" value={val._id} onClick={this.getSelect}>Voir</Button></td>
            </tr>
        })

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
            <div>
                <div className="container">
                    {isLoading ? this.renderIndicator() : 
                    country ? (<div className='container d-flex flex-column align-items justify-content-center'>   
                        <h4> Graphe : {country}{year}</h4>
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
                    ) : (<Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Pays</th>
                                <th>Somme des valeurs</th>
                                <th>Nombres</th>
                                <th>Détails</th>
                            </tr>
                        </thead>
                            <tbody>
                                { lists }
                            </tbody>
                    </Table> 
                    )}
                </div>    
            </div>
        )
    }
}
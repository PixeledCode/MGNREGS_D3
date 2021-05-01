import React, { Component } from 'react'
import { Switch, Route} from 'react-router-dom'
import Home from 'components/Home/Home'
import Filter from 'components/Filter/Filter'
import Error from 'components/Error/Error'
import Navbar from 'components/Navbar/Navbar'

class App extends Component {
	render() {
		return (
			<div className="App">
				<Navbar />
				<Switch>
				<Route path="/" component={Home} exact />
				<Route path="/filter" component={Filter} />
				<Route component={Error} />
				</Switch>
			</div>
		)
	}
}

export default App

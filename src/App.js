import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from 'components/Home/Home'
import Filter from 'components/Filter/Filter'
import Compare from 'components/Compare/Compare'
import Error from 'components/Error/Error'
import Navbar from 'components/Navbar/Navbar'
import { AnimatePresence } from 'framer-motion'

class App extends Component {
	render() {
		return (
			<div className="App">
				<Navbar />
				<AnimatePresence>
					<Switch>
						<Route path="/" component={Home} exact />
						<Route path="/filter" component={Filter} />
						<Route path="/compare" component={Compare} />
						<Route component={Error} />
					</Switch>
				</AnimatePresence>
			</div>
		)
	}
}

export default App

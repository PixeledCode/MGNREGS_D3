import { Link, useLocation } from 'react-router-dom'

function Navbar() {
		const router = useLocation();

		console.log(router);
		return (
			<div className="navbar">
				<Link className="logo" to="/"><h1>MGNREGS</h1></Link>
				
				<div className="nav-links">
					<Link className={router.pathname === "/" ? "active" : ""}  to="/">Home </Link>
					<Link className={router.pathname === "/filter" ? "active" : ""} to="/filter">Filter </Link>
					<Link className={router.pathname === "/compare" ? "active" : ""} to="/compare">Compare </Link>
				</div>
			</div>
		)
}

export default Navbar

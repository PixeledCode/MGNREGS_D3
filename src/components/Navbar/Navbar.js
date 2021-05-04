import { Link, useLocation } from 'react-router-dom'

function Navbar() {
		const router = useLocation();

		return (
			<div className="navbar">
				<Link className="logo" to="/"><h1>MGNREGS</h1></Link>
				
				<div className="nav-links">
					<Link className={router.pathname === "/" ? "active" : ""}  to="/">HOME</Link>
					<Link className={router.pathname === "/filter" ? "active" : ""} to="/filter">FILTER</Link>
					<Link className={router.pathname === "/compare" ? "active" : ""} to="/compare">COMPARE</Link>
				</div>
			</div>
		)
}

export default Navbar

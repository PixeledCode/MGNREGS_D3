import { Link, useLocation } from 'react-router-dom'

function Navbar() {
		const router = useLocation();

		return (
			<div className="navbar">
				<Link className="logo" to="/"><h1>MGNREGS</h1></Link>
				
				<ul className="nav-links">
					<li className={router.pathname === "/" ? "active" : ""}><Link to="/">HOME</Link></li>
					<li className={router.pathname === "/filter" ? "active" : ""}><Link to="/filter">FILTER</Link></li>
					<li className={router.pathname === "/compare" ? "active" : ""} ><Link className={router.pathname === "/compare" ? "active" : ""} to="/compare">COMPARE</Link></li>
				</ul>
			</div>
		)
}

export default Navbar

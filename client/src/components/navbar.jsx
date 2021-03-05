import React from "react";
import { Link, NavLink } from "react-router-dom";

//stateless functional component
const Navbar = () => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-expand navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          ETH DApp
        </Link>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dexTokens">
                deX Tokens
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;

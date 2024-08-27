import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full bg-pink-300 h-16 py-2">
      <ul className="md:ml-4 text-md md:text-2xl lg:text-3xl font-semibold flex flex-row justify-around text-color4">
        <li>
          <NavLink
            to={"/"}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to={"/play"}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            Map
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

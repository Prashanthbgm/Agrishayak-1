import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/crop", label: "Crop" },
    { to: "/disease", label: "Disease" },
    { to: "/mandi", label: "Mandi" },
    { to: "/auction", label: "Auction" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Glass background */}
      <div className="backdrop-blur-lg bg-white/70 border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌾</span>
              <NavLink
                to="/"
                className="text-xl font-bold text-green-800 tracking-wide"
              >
                SmartCrop
              </NavLink>
            </div>

            {/* DESKTOP LINKS */}
            <nav className="hidden md:flex items-center gap-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? "bg-green-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* MOBILE BUTTON */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full bg-white/80 shadow hover:bg-green-100 transition"
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden backdrop-blur-lg bg-white/80 border-b border-green-100 shadow-lg">
          <div className="px-6 py-4 space-y-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-xl text-base font-medium transition
                  ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-green-100 hover:text-green-800"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

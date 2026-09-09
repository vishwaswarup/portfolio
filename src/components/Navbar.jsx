import "../styles/Navbar.css";

function Navbar() {
  return (
    <header className="navbar-wrapper">

      <nav className="navbar" aria-label="Main navigation">

        <ul className="nav-links">

          <li>
            <a href="#home">
              Home
            </a>
          </li>

          <li>
            <a href="#about">
              About
            </a>
          </li>

          <li>
            <a href="#skills">
              Skills
            </a>
          </li>

          <li>
            <a href="#projects">
              Projects
            </a>
          </li>

          <li>
            <a href="#resume">
              Resume
            </a>
          </li>

          <li>
            <a href="#contact">
              Contact
            </a>
          </li>

        </ul>

      </nav>

    </header>
  );
}

export default Navbar;
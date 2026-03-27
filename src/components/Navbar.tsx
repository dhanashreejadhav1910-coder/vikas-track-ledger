import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/corporate', label: 'Corporate' },
    { to: '/ngo', label: 'NGO' },
    { to: '/ledger', label: 'Public Ledger' },
    { to: '/impact', label: 'Impact' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-teal-stripe" style={{ backgroundColor: 'var(--deep-navy)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" style={{ color: 'white' }}>
          <span style={{ fontSize: '1.5rem' }}>🔗</span>
          <span style={{ fontFamily: 'Poppins', fontWeight: 700 }}>VIKAS-TRACK</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav ms-auto">
            {links.map(l => (
              <li className="nav-item" key={l.to}>
                <Link
                  className={`nav-link ${pathname === l.to ? 'active' : ''}`}
                  to={l.to}
                  style={{
                    color: pathname === l.to ? 'var(--civic-teal)' : 'rgba(255,255,255,0.85)',
                    fontWeight: pathname === l.to ? 600 : 400,
                    fontFamily: 'Inter',
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

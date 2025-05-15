import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Navbar.css';
import { useUser } from '../../Context/UserContext'; // Make sure the path is correct

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { token, logout, role } = useUser(); // Access token, logout, and role
  const navigate = useNavigate();

  const isAdmin = role === 'Admin'; // Adjust based on how you define admin

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white rounded">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/Home">
          {t('navbar.title')}
        </Link>
        <div className="d-flex align-items-center">
          <div className="dropdown me-3">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              id="languageDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {i18n.language.toUpperCase()}
            </button>
            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage('en')}>
                  English
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={() => changeLanguage('ar')}>
                  Arabic
                </button>
              </li>
            </ul>
          </div>
          <ThemeToggle />
          {isAdmin && (
            <Link to="/admin" className="btn btn-outline-secondary me-2">
              {t('navbar.admin')}
            </Link>
          )}

          {token ? (
            <button className="btn btn-outline-danger me-2" onClick={handleLogout}>
              {t('navbar.logout') || 'Logout'}
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                {t('navbar.login')}
              </Link>
              <Link to="/" className="btn btn-primary">
                {t('navbar.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

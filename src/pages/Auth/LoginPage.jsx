import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar/Navbar';
import { useUser } from '../../Context/UserContext';
import './AuthPages.css';

const LoginPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError(t('login.errors.fillAllFields'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(t('login.errors.invalidCredentials'));
        }
        throw new Error(t('login.errors.general'));
      }

      const data = await response.json();
      const decoded = jwtDecode(data.token);

      const role =
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (!role) throw new Error(t('login.errors.roleNotFound'));

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);

      login(data.token);

      if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/Home');
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{t('login.title')}</h2>
          <p className="auth-subtitle">{t('login.subtitle')}</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">{t('login.username')}</label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('login.usernamePlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">{t('login.password')}</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('login.passwordPlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary w-100" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    {t('login.loggingIn')}
                  </>
                ) : t('login.loginButton')}
              </button>
            </div>
            
            <div className="auth-footer">
              <p>
                {t('login.noAccount')} <Link to="/register">{t('login.registerHere')}</Link>
              </p>
              <p>
                <Link to="/forgot-password">{t('login.forgotPassword')}</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
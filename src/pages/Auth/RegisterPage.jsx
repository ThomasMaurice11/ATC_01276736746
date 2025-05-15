import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar/Navbar';
import './AuthPages.css';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.username || !formData.email || !formData.password) {
      setError(t('register.errors.fillAllFields'));
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t('register.errors.passwordLength'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('api/Auth/RegisterUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('register.errors.general'));
      }

      const data = await response.json();
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
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
          <h2 className="auth-title">{t('register.title')}</h2>
          <p className="auth-subtitle">{t('register.subtitle')}</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">{t('register.username')}</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('register.usernamePlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">{t('register.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('register.emailPlaceholder')}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">{t('register.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('register.passwordPlaceholder')}
                required
                minLength={6}
              />
            </div>
            
            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? t('register.registering') : t('register.registerButton')}
              </button>
            </div>
            
            <div className="auth-footer">
              <p>
                {t('register.haveAccount')} <Link to="/login">{t('register.loginHere')}</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
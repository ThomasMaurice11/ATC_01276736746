import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const NotFoundPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="container">
      <Navbar />
      <div className="text-center my-5 py-5">
        <h1>404</h1>
        <p className="lead">{t('notFound.message')}</p>
        <Link to="/" className="btn btn-primary">
          {t('notFound.goHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
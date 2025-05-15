import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Home from './pages/Home/Home';
import EventDetails from './pages/EventDetails/EventDetails';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import AdminEventsPage from './pages/Admin/AdminEventsPage';
import EditEventPage from './pages/Admin/EditEventPage';
import i18n from './i18n';
import NotFoundPage from './pages/NotFoundPage';
import './styles/global.css';
import './styles/darkMode.css';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
       
        <ToastContainer/>
        
        <Routes>
        
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RegisterPage />} />
          <Route path="/event/:id" element={<EventDetails />} />
         
         <Route path="/admin"element={
          <ProtectedRoute requiredRole="Admin">
            <AdminEventsPage />
          
          </ProtectedRoute>
            } 
          />
          <Route path="admin/EditEventsPage/:id"element={
          <ProtectedRoute requiredRole="Admin">
            <EditEventPage />
          
          </ProtectedRoute>
            } 
          />
          
         
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </I18nextProvider>




  );
}

export default App;
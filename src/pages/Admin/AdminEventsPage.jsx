import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import './AdminEvents.css';

const AdminEventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [createdEventId, setCreatedEventId] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    venue: '',
    imageFile: null,
    translations: [
      {
        languageCode: 'en',
        name: '',
        details: '',
        price: '',
        category: ''
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
    };
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events', {
          headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error(t('adminEvents.errors.fetchEvents'));
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };
    fetchEvents();
  }, [t]);

  const handleStep1Change = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'imageFile' ? files[0] : value
    }));
  };

  const handleTranslationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newTranslations = [...prev.translations];
      newTranslations[index] = { ...newTranslations[index], [name]: value };
      return { ...prev, translations: newTranslations };
    });
  };

  const addTranslation = () => {
    setFormData(prev => ({
      ...prev,
      translations: [
        ...prev.translations,
        { languageCode: '', name: '', details: '', price: '', category: '' }
      ]
    }));
  };

  const removeTranslation = (index) => {
    setFormData(prev => ({
      ...prev,
      translations: prev.translations.filter((_, i) => i !== index)
    }));
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('Date', formData.date);
      formDataToSend.append('Venue', formData.venue);
      formDataToSend.append('ImageFile', formData.imageFile);

      const response = await fetch('/api/events', {
        method: 'POST',
        body: formDataToSend,
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('adminEvents.errors.createEvent'));
      }

      const createdEvent = await response.json();
      setCreatedEventId(createdEvent.id);
      setCurrentStep(2);
      toast.success(t('adminEvents.success.createEvent'));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      for (const translation of formData.translations) {
        const response = await fetch(`/api/Events/${createdEventId}/translations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(translation)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || t('adminEvents.errors.addTranslation'));
        }
      }

      // Refresh events list
      const eventsResponse = await fetch('/api/events', {
        headers: getAuthHeaders()
      });
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
      
      // Reset form
      setFormData({
        date: '',
        venue: '',
        imageFile: null,
        translations: [
          {
            languageCode: 'en',
            name: '',
            details: '',
            price: '',
            category: ''
          }
        ]
      });
      setCurrentStep(1);
      setCreatedEventId(null);
      toast.success(t('adminEvents.success.completeCreation'));
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('adminEvents.confirmDelete'))) {
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error(t('adminEvents.errors.deleteEvent'));

        setEvents(events.filter(event => event.id !== id));
        toast.success(t('adminEvents.success.deleteEvent'));
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="admin-events-page">
      <Navbar />
      
      <div className="admin-container">
        <h2 className="admin-title">{t('adminEvents.title')}</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="admin-content">
          <div className="admin-form-container">
            {currentStep === 1 ? (
              <>
                <h3>{t('adminEvents.step1.title')}</h3>
                <form onSubmit={handleStep1Submit}>
                  <div className="form-group">
                    <label>{t('adminEvents.step1.date')}</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleStep1Change}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>{t('adminEvents.step1.venue')}</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleStep1Change}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>{t('adminEvents.step1.image')}</label>
                    <input
                      type="file"
                      name="imageFile"
                      onChange={handleStep1Change}
                      accept="image/*"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? '...' : t('adminEvents.step1.nextButton')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3>{t('adminEvents.step2.title')}</h3>
                <form onSubmit={handleStep2Submit}>
                  {formData.translations.map((translation, index) => (
                    <div key={index} className="translation-group">
                      <h5>{t('adminEvents.step2.translation')} {index + 1}</h5>
                      
                      <div className="form-group">
                        <label>{t('adminEvents.step2.languageCode')}</label>
                        <input
                          type="text"
                          name="languageCode"
                          value={translation.languageCode}
                          onChange={(e) => handleTranslationChange(index, e)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('adminEvents.step2.eventName')}</label>
                        <input
                          type="text"
                          name="name"
                          value={translation.name}
                          onChange={(e) => handleTranslationChange(index, e)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('adminEvents.step2.details')}</label>
                        <textarea
                          name="details"
                          value={translation.details}
                          onChange={(e) => handleTranslationChange(index, e)}
                          required
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>{t('adminEvents.step2.price')}</label>
                          <input
                            type="text"
                            name="price"
                            value={translation.price}
                            onChange={(e) => handleTranslationChange(index, e)}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>{t('adminEvents.step2.category')}</label>
                          <input
                            type="text"
                            name="category"
                            value={translation.category}
                            onChange={(e) => handleTranslationChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                      
                      {index > 0 && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeTranslation(index)}
                        >
                          {t('adminEvents.removeTranslation')}
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={addTranslation}
                    >
                      {t('adminEvents.step2.addTranslation')}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      {t('adminEvents.step2.back')}
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? '...' : t('adminEvents.step2.complete')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
          
          <div className="admin-list-container">
            <h3>{t('adminEvents.currentEvents')}</h3>
            {events.length === 0 ? (
              <p className="no-events">{t('adminEvents.noEvents')}</p>
            ) : (
              <div className="events-list">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-image">
                      {event.imageUrl && (
                        <img src={event.imageUrl} alt={event.name} />
                      )}
                    </div>
                    <div className="event-details">
                      <h4>{event.name}</h4>
                      <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="event-location">{event.venue}</p>
                    </div>
                    <div className="event-actions">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => navigate(`/admin/EditEventsPage/${event.id}`)}
                      >
                        {t('adminEvents.edit')}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(event.id)}
                      >
                        {t('adminEvents.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventsPage;
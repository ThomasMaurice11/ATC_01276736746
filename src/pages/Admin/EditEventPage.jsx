import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import './AdminEvents.css';

const EditEventPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: '',
    venue: '',
    imageFile: null,
    existingImage: '',
    translations: []
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Accept-Language': localStorage.getItem('i18nextLng') || 'en'
    };
  };


  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events/${id}`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error(t('adminEvents.errors.fetchEvent'));
        }
        
        const eventData = await response.json();
        setFormData({
          date: eventData.date.split('T')[0], 
          venue: eventData.venue,
          imageFile: null,
          existingImage: eventData.imageUrl,
          translations: eventData.translations || []
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [id, t]);

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
      newTranslations[index] = {
        ...newTranslations[index],
        [name]: value
      };
      return {
        ...prev,
        translations: newTranslations
      };
    });
  };

  const addNewTranslation = () => {
    setFormData(prev => ({
      ...prev,
      translations: [
        ...prev.translations,
        {
          languageCode: '',
          name: '',
          details: '',
          price: '',
          category: '',
          isNew: true 
        }
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
    if (formData.imageFile) {
      formDataToSend.append('ImageFile', formData.imageFile);
    }

    const response = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      body: formDataToSend,
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || t('adminEvents.errors.updateEvent'));
    }

    // For image updates, we need to fetch the updated event to get the new image URL
    if (formData.imageFile) {
      const updatedResponse = await fetch(`/api/events/${id}`, {
        headers: getAuthHeaders()
      });
      
      if (updatedResponse.ok) {
        const updatedEvent = await updatedResponse.json();
        setFormData(prev => ({
          ...prev,
          existingImage: updatedEvent.imageUrl
        }));
      }
    }

    setCurrentStep(2);
    toast.success(t('adminEvents.success.updateBasicInfo'));
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
   
      const translationsToSend = formData.translations.map(translation => ({
        languageCode: translation.languageCode,
        name: translation.name,
        details: translation.details,
        price: translation.price,
        category: translation.category
      }));

      const response = await fetch(`/api/Events/UpdateTranslations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(translationsToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('adminEvents.errors.updateTranslations'));
      }

      toast.success(t('adminEvents.success.updateTranslations'));
      navigate('/admin');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-events-page">
      <Navbar />
      
      <div className="admin-container">
        <h2 className="admin-title">{t('adminEvents.editTitle')}</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="admin-content">
          <div className="admin-form-container">
            {currentStep === 1 ? (
              <>
                <h3>{t('adminEvents.editStep1.title')}</h3>
                <form onSubmit={handleStep1Submit}>
                  <div className="form-group">
                    <label>{t('adminEvents.editStep1.date')}</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleStep1Change}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>{t('adminEvents.editStep1.venue')}</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleStep1Change}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>{t('adminEvents.editStep1.image')}</label>
                    {formData.existingImage && (
                      <div className="existing-image-preview">
                        <img 
                          src={formData.existingImage} 
                          alt={t('adminEvents.currentImage')}
                          className="img-thumbnail"
                        />
                        <p className="text-muted">{t('adminEvents.currentImage')}</p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="imageFile"
                      onChange={handleStep1Change}
                      accept="image/*"
                    />
                    <small className="text-muted">
                      {t('adminEvents.editStep1.imageHint')}
                    </small>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin')}
                    >
                      {t('adminEvents.cancel')}
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? t('adminEvents.saving') : t('adminEvents.next')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3>{t('adminEvents.editStep2.title')}</h3>
                <form onSubmit={handleStep2Submit}>
                  {formData.translations.map((translation, index) => (
                    <div key={index} className="translation-group">
                      <h5>
                        {t('adminEvents.editStep2.translation')} {index + 1}
                        {translation.isNew && (
                          <span className="badge bg-info ms-2">
                            {t('adminEvents.new')}
                          </span>
                        )}
                      </h5>
                      
                      <div className="form-group">
                        <label>{t('adminEvents.editStep2.languageCode')}</label>
                        <input
                          type="text"
                          name="languageCode"
                          value={translation.languageCode}
                          onChange={(e) => handleTranslationChange(index, e)}
                          required
                          disabled={!translation.isNew}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('adminEvents.editStep2.eventName')}</label>
                        <input
                          type="text"
                          name="name"
                          value={translation.name}
                          onChange={(e) => handleTranslationChange(index, e)}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('adminEvents.editStep2.details')}</label>
                        <textarea
                          name="details"
                          value={translation.details}
                          onChange={(e) => handleTranslationChange(index, e)}
                          required
                        />
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>{t('adminEvents.editStep2.price')}</label>
                          <input
                            type="text"
                            name="price"
                            value={translation.price}
                            onChange={(e) => handleTranslationChange(index, e)}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label>{t('adminEvents.editStep2.category')}</label>
                          <input
                            type="text"
                            name="category"
                            value={translation.category}
                            onChange={(e) => handleTranslationChange(index, e)}
                            required
                          />
                        </div>
                      </div>
                      
                      {formData.translations.length > 1 && (
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
                      className="btn btn-outline-primary"
                      onClick={addNewTranslation}
                    >
                      {t('adminEvents.addTranslation')}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      {t('adminEvents.back')}
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? t('adminEvents.saving') : t('adminEvents.saveChanges')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
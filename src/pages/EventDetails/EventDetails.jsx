import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept-Language': i18n.language
          }
        });

        if (!response.ok) {
          throw new Error(t('eventDetails.fetchError'));
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, i18n.language]);

const handleBookNow = async () => {
  setIsBooking(true);
  
  try {
    const response = await fetch(`/api/Booking?eventId=${id}`, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept-Language': i18n.language
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || t('eventDetails.bookingFailed'));
    }

    // Update the event's booked status in local state
    setEvent(prevEvent => ({
      ...prevEvent,
      isBooked: true
    }));

    toast.success(t('eventDetails.bookingSuccess'), {
      position: "top-right",
      autoClose: 3000,
    });
  } catch (err) {
    toast.error(err.message || t('eventDetails.bookingFailed'), {
      position: "top-right",
      autoClose: 3000,
    });
  } finally {
    setIsBooking(false);
  }
};

  const getEventTranslation = () => {
    if (!event) return {};

    return event.translations?.find(t => t.languageCode === i18n.language) || 
           event.translations?.find(t => t.languageCode === 'en') || 
           {};
  };

  if (loading) {
    return (
      <div className="event-details-page">
        <Navbar />
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('common.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-details-page">
        <Navbar />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-details-page">
        <Navbar />
        <div className="alert alert-info">{t('eventDetails.notFound')}</div>
      </div>
    );
  }

  const translation = getEventTranslation();
  const eventDate = new Date(event.date);

  return (
    <div className="event-details-page">
      <Navbar />
      
      <div className="event-content-container">
        
        <div className="event-photo-column">
          <div 
            className="event-photo"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          >
            <div className="event-photo-overlay"></div>
            <div className="event-photo-content">
              <h1>{translation.name || t('eventDetails.untitled')}</h1>
              <p className="event-subtitle">{translation.category || ''}</p>
            </div>
          </div>
        </div>

      
        <div className="event-details-column">
          <div className="event-details-card">
            <section className="event-section">
              <h2>{t('eventDetails.description')}</h2>
              <p className="event-description">
                {translation.details || t('eventDetails.noDescription')}
              </p>
            </section>
            
            <section className="event-section">
              <h2>{t('eventDetails.information')}</h2>
              <div className="event-info-grid">
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">{t('eventDetails.category')}</span>
                    <span className="info-value">{translation.category || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">{t('eventDetails.date')}</span>
                    <span className="info-value">
                      {eventDate.toLocaleDateString(i18n.language, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="info-row">
                 
                  <div className="info-item">
                    <span className="info-label">{t('eventDetails.venue')}</span>
                    <span className="info-value">{event.venue}</span>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-item">
                    <span className="info-label">{t('eventDetails.price')}</span>
                    <span className="info-value">{translation.price || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="event-actions">
              <button
                className={`btn ${event.isBooked ? 'btn-success' : 'btn-primary'}`}
                onClick={handleBookNow}
                disabled={event.isBooked || isBooking}
              >
                {isBooking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {t('eventDetails.booking')}
                  </>
                ) : event.isBooked ? (
                  t('eventDetails.booked')
                ) : (
                  t('eventDetails.bookNow')
                )}
              </button>
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
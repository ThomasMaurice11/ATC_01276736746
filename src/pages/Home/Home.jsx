import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css';

const Home = () => {
  const { t, i18n } = useTranslation(); 
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all'); 


  const categories = [
    { value: 'all', label: t('home.categories.all') },
    { value: 'tech', label: t('home.categories.tech') },
    { value: 'art', label: t('home.categories.art') },
     { value: 'food', label: t('home.categories.food') }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept-Language': i18n.language 
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [i18n.language]);


  useEffect(() => {
  if (selectedCategory === 'all') {
    setFilteredEvents(events);
  } else {
    const filtered = events.filter(event => {
      const translation = event.translations.find(t => t.languageCode === i18n.language) || 
                         event.translations.find(t => t.languageCode === 'en');
      const eventCategory = translation?.category?.toLowerCase();
      return eventCategory === selectedCategory;
    });
    setFilteredEvents(filtered);
  }
}, [selectedCategory, events, i18n.language]);

  const handleBookNow = async (eventId) => {
    setBookingLoading(prev => ({ ...prev, [eventId]: true }));
    
    try {
      const response = await fetch(`/api/Booking?eventId=${eventId}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept-Language': i18n.language
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? { ...event, isBooked: true } : event
        )
      );

      toast.success(t('home.bookingSuccess'), {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || t('home.bookingFailed'), {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setBookingLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Navbar />
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Navbar />
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar />
      
      <h2 className="my-4">{t('home.title')}</h2>
      <p className="text-muted">{t('home.subtitle')}</p>

      
      <div className="mb-4">
        <label htmlFor="categoryFilter" className="form-label">
          {t('home.filterByCategory')}
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="alert alert-info">
          {selectedCategory === 'all' 
            ? t('home.noEvents') 
            : t('home.noEventsInCategory', { category: categories.find(c => c.value === selectedCategory)?.label })}
        </div>
      ) : (
        <div className="row">
          {filteredEvents.map(event => {
            const translation = event.translations.find(t => t.languageCode === i18n.language) || 
                              event.translations.find(t => t.languageCode === 'en');
            
            return (
              <div className="col-md-6 col-lg-3" key={event.id}>
                <div className="card h-100">
                  <div style={{position: 'relative'}}>
                    <img 
                      src={event.imageUrl} 
                      className="card-img-top" 
                      alt={translation?.name || 'Event'} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <span className="date-badge">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{translation?.name || 'Event'}</h5>
                    <p className="text-muted">
                      <i className="fas fa-map-marker-alt text-primary me-1"></i> {event.venue}
                    </p>
                    <p className="card-text small text-muted mb-3">
                      {translation?.details || 'No description available'}
                    </p>
                    <p className="text-muted">
                      <strong>{t('home.category')}:</strong> {translation?.category || 'N/A'}
                    </p>
                    <p className="text-muted mt-auto">
                      <strong>{t('home.price')}:</strong> {translation?.price || 'N/A'}
                    </p>
                    <div className="d-grid gap-2 mt-3">
                      <Link 
                        to={`/event/${event.id}`} 
                        className="btn btn-outline-primary"
                      >
                        {t('home.moreDetails')}
                      </Link>
                      
                      <button
                        onClick={() => handleBookNow(event.id)}
                        className={`btn ${event.isBooked ? 'btn-success' : 'btn-primary'}`}
                        disabled={event.isBooked || bookingLoading[event.id]}
                      >
                        {bookingLoading[event.id] ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            {t('home.booking')}
                          </>
                        ) : event.isBooked ? (
                          t('home.booked')
                        ) : (
                          t('home.bookNow')
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
import { useState } from 'react';
import './App.css';
import DoctorsPage from './components/DoctorsPage';
import AppointmentPage from './components/AppointmentPage';
import AppointmentsList from './components/AppointmentsList';

const PAGES = {
  doctors: 'doctors',
  book: 'book',
  appointments: 'appointments',
};

function App() {
  const [activePage, setActivePage] = useState(PAGES.doctors);

  function renderPage() {
    switch (activePage) {
      case PAGES.doctors:
        return <DoctorsPage />;
      case PAGES.book:
        return <AppointmentPage />;
      case PAGES.appointments:
        return <AppointmentsList />;
      default:
        return <DoctorsPage />;
    }
  }

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">🏥 Hospital Booking</div>
        <div className="navbar-links">
          <button
            className={`nav-btn ${activePage === PAGES.doctors ? 'active' : ''}`}
            onClick={() => setActivePage(PAGES.doctors)}
          >
            Doctors
          </button>
          <button
            className={`nav-btn ${activePage === PAGES.book ? 'active' : ''}`}
            onClick={() => setActivePage(PAGES.book)}
          >
            Book Appointment
          </button>
          <button
            className={`nav-btn ${activePage === PAGES.appointments ? 'active' : ''}`}
            onClick={() => setActivePage(PAGES.appointments)}
          >
            Appointments
          </button>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

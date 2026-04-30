import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api';

const TIME_SLOTS = ['08:00-09:00', '10:00-11:00', '14:00-15:00'];

function AppointmentPage() {
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsFetchFailed, setDoctorsFetchFailed] = useState(false);
  const [form, setForm] = useState({
    patientName: '',
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    timeSlot: '',
  });
  const [submitMessage, setSubmitMessage] = useState({ text: '', type: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  function loadDoctors() {
    setDoctorsLoading(true);
    setDoctorsFetchFailed(false);
    fetch(`${API_BASE}/doctors`)
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setDoctorsLoading(false);
      })
      .catch(() => {
        setDoctorsLoading(false);
        setDoctorsFetchFailed(true);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitMessage({ text: '', type: '' });
    setSubmitting(true);

    fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, doctorId: Number(form.doctorId) }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Server returned an error. Please try again.');
        return res.json();
      })
      .then(() => {
        setSubmitMessage({ text: 'Appointment booked successfully!', type: 'success' });
        setForm({
          patientName: '',
          patientId: '',
          doctorId: '',
          appointmentDate: '',
          timeSlot: '',
        });
        setSubmitting(false);
      })
      .catch((err) => {
        setSubmitMessage({
          text: err.message === 'Failed to fetch'
            ? 'Cannot connect to the server. Make sure the backend is running on port 8080.'
            : err.message,
          type: 'error',
        });
        setSubmitting(false);
      });
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Book an Appointment</h2>

      {submitMessage.text && (
        <p style={submitMessage.type === 'success' ? styles.successBanner : styles.errorBanner}>
          {submitMessage.text}
        </p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Patient Name</label>
          <input
            style={styles.input}
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            placeholder="Enter patient name"
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Patient ID</label>
          <input
            style={styles.input}
            type="text"
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            placeholder="Enter patient ID"
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Doctor</label>
          {doctorsLoading && (
            <p style={styles.inlineInfo}>Loading doctors...</p>
          )}
          {!doctorsLoading && doctorsFetchFailed && (
            <div style={styles.retryRow}>
              <p style={styles.inlineInfo}>Could not load doctors.</p>
              <button type="button" style={styles.retryButton} onClick={loadDoctors}>
                Retry
              </button>
            </div>
          )}
          {!doctorsLoading && !doctorsFetchFailed && (
            <select
              style={styles.input}
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName} — {doc.specialization}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Appointment Date</label>
          <input
            style={styles.input}
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Time Slot</label>
          <select
            style={styles.input}
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a Time Slot --</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <button style={submitting ? styles.buttonDisabled : styles.button} type="submit" disabled={submitting}>
          {submitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: '24px', maxWidth: '520px' },
  heading: { fontSize: '24px', marginBottom: '16px', color: '#1a1a2e' },
  successBanner: {
    background: '#d4edda',
    color: '#155724',
    padding: '10px 14px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  errorBanner: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '10px 14px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  inlineInfo: {
    color: '#555',
    fontStyle: 'italic',
    fontSize: '13px',
    margin: '4px 0',
  },
  retryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  retryButton: {
    padding: '4px 12px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  form: {
    background: '#f4f6f9',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#333' },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '15px',
    marginTop: '4px',
  },
  buttonDisabled: {
    padding: '10px',
    background: '#7f8c8d',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '15px',
    marginTop: '4px',
  },
};

export default AppointmentPage;

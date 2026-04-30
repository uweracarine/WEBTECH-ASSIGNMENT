import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api';

function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  function fetchAppointments() {
    setLoading(true);
    setFetchFailed(false);
    fetch(`${API_BASE}/appointments`)
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFetchFailed(true);
      });
  }

  function handleCancel(id) {
    setCancelError('');
    fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to cancel appointment.');
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      })
      .catch((err) => setCancelError(err.message));
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Appointments</h2>

      {cancelError && <p style={styles.errorBanner}>{cancelError}</p>}

      {loading && <p style={styles.info}>Loading appointments...</p>}

      {!loading && fetchFailed && (
        <p style={styles.info}>
          Could not reach the server. Make sure the backend is running on port 8080.
        </p>
      )}

      {!loading && !fetchFailed && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Patient Name</th>
              <th style={styles.th}>Patient ID</th>
              <th style={styles.th}>Doctor ID</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time Slot</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.noData}>
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((appt, index) => (
                <tr key={appt.id} style={styles.tableRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{appt.patientName}</td>
                  <td style={styles.td}>{appt.patientId}</td>
                  <td style={styles.td}>{appt.doctorId}</td>
                  <td style={styles.td}>{appt.appointmentDate}</td>
                  <td style={styles.td}>{appt.timeSlot}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.cancelButton}
                      onClick={() => handleCancel(appt.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '24px' },
  heading: { fontSize: '24px', marginBottom: '16px', color: '#1a1a2e' },
  info: {
    color: '#555',
    fontStyle: 'italic',
    padding: '12px 0',
  },
  errorBanner: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '10px 14px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#0f3460', color: '#fff' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #e0e0e0' },
  td: { padding: '10px 14px', fontSize: '14px' },
  noData: { padding: '16px', textAlign: 'center', color: '#888' },
  cancelButton: {
    padding: '5px 14px',
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default AppointmentsList;

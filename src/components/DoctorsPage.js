import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8080/api';

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    specialization: '',
    department: '',
    available: true,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  function fetchDoctors() {
    setLoading(true);
    setFetchFailed(false);
    fetch(`${API_BASE}/doctors`)
      .then((res) => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
      })
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setFetchFailed(true);
      });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to add doctor. Check that the server is running.');
        return res.json();
      })
      .then(() => {
        setFormSuccess('Doctor added successfully!');
        setForm({ fullName: '', specialization: '', department: '', available: true });
        fetchDoctors();
      })
      .catch((err) => setFormError(err.message));
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Doctors</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.subHeading}>Add New Doctor</h3>

        {formError && <p style={styles.errorBanner}>{formError}</p>}
        {formSuccess && <p style={styles.successBanner}>{formSuccess}</p>}

        <div style={styles.formRow}>
          <input
            style={styles.input}
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="specialization"
            placeholder="Specialization"
            value={form.specialization}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />
            &nbsp;Available
          </label>
          <button style={styles.button} type="submit">
            Add Doctor
          </button>
        </div>
      </form>

      {loading && <p style={styles.info}>Loading doctors...</p>}

      {!loading && fetchFailed && (
        <p style={styles.info}>
          Could not reach the server. Make sure the backend is running on port 8080.
        </p>
      )}

      {!loading && !fetchFailed && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Specialization</th>
              <th style={styles.th}>Department</th>
              <th style={styles.th}>Available</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  No doctors found. Add one above.
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => (
                <tr key={doctor.id} style={styles.tableRow}>
                  <td style={styles.td}>{doctor.fullName}</td>
                  <td style={styles.td}>{doctor.specialization}</td>
                  <td style={styles.td}>{doctor.department}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        doctor.available ? styles.available : styles.unavailable
                      }
                    >
                      {doctor.available ? 'Yes' : 'No'}
                    </span>
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
  subHeading: { fontSize: '18px', marginBottom: '12px', color: '#16213e' },
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
    marginBottom: '10px',
    fontSize: '14px',
  },
  successBanner: {
    background: '#d4edda',
    color: '#155724',
    padding: '10px 14px',
    borderRadius: '4px',
    marginBottom: '10px',
    fontSize: '14px',
  },
  form: {
    background: '#f4f6f9',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  formRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    flex: '1 1 160px',
  },
  checkboxLabel: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    padding: '8px 20px',
    background: '#0f3460',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#0f3460', color: '#fff' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #e0e0e0' },
  td: { padding: '10px 14px', fontSize: '14px' },
  noData: { padding: '16px', textAlign: 'center', color: '#888' },
  available: {
    background: '#d4edda',
    color: '#155724',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '13px',
  },
  unavailable: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '13px',
  },
};

export default DoctorsPage;

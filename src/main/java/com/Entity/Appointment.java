package com.Entity;

import jakarta.persistence.*;

@Entity
public class Appointment {


@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String patientName;
private String patientId;
private Long doctorId;
private String appointmentDate;
private String timeSlot;

public Appointment() {}

public Appointment(String patientName, String patientId, Long doctorId, String appointmentDate, String timeSlot) {
    this.patientName = patientName;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.appointmentDate = appointmentDate;
    this.timeSlot = timeSlot;
}

// Getters & Setters
public Long getId() { return id; }

public String getPatientName() { return patientName; }
public void setPatientName(String patientName) { this.patientName = patientName; }

public String getPatientId() { return patientId; }
public void setPatientId(String patientId) { this.patientId = patientId; }

public Long getDoctorId() { return doctorId; }
public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

public String getAppointmentDate() { return appointmentDate; }
public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

public String getTimeSlot() { return timeSlot; }
public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }


}

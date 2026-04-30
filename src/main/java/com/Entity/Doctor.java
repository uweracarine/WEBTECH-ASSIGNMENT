package com.Entity;

import jakarta.persistence.*;

@Entity
public class Doctor {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private String fullName;
private String specialization;
private String department;
private boolean available;

// Constructors
public Doctor() {}

public Doctor(String fullName, String specialization, String department, boolean available) {
    this.fullName = fullName;
    this.specialization = specialization;
    this.department = department;
    this.available = available;
}

// Getters & Setters
public Long getId() { return id; }

public String getFullName() { return fullName; }
public void setFullName(String fullName) { this.fullName = fullName; }

public String getSpecialization() { return specialization; }
public void setSpecialization(String specialization) { this.specialization = specialization; }

public String getDepartment() { return department; }
public void setDepartment(String department) { this.department = department; }

public boolean isAvailable() { return available; }
public void setAvailable(boolean available) { this.available = available; }


}

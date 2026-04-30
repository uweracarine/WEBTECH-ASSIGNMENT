package com.controller;

import com.Entity.Doctor;
import com.repository.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorRepository repo;

    public DoctorController(DoctorRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getOne(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Doctor> create(@RequestBody Doctor doctor) {
        Doctor saved = repo.save(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @RequestBody Doctor updated) {
        return repo.findById(id).map(d -> {
            d.setFullName(updated.getFullName());
            d.setSpecialization(updated.getSpecialization());
            d.setDepartment(updated.getDepartment());
            d.setAvailable(updated.isAvailable());
            return ResponseEntity.ok(repo.save(d));
        }).orElse(ResponseEntity.notFound().build());
    }
}

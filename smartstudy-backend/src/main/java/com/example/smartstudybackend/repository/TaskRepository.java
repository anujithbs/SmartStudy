package com.example.smartstudybackend.repository;

import com.example.smartstudybackend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long>{
}

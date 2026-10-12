package com.example.smartstudybackend.service;

import com.example.smartstudybackend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import com.example.smartstudybackend.model.Task;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    public TaskService(TaskRepository taskRepository){
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    public Task createTask(Task task){
        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(Long id){
        return taskRepository.findById(id);
    }

    public Optional<Task> updateTask(long id,Task updatedTask){
        Optional<Task> existingTask = taskRepository.findById(id);
        if(existingTask.isPresent()){
            Task task = existingTask.get();
            task.setCompleted(updatedTask.isCompleted());
            task.setDeadline(updatedTask.getDeadline());
            task.setDescription(updatedTask.getDescription());
            task.setTitle(updatedTask.getTitle());

            return Optional.of(taskRepository.save(task));
        }
        return Optional.empty();
    }

    public void deleteTask(long id){
        taskRepository.deleteById(id);
    }




}

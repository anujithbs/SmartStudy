
import { useEffect, useRef, useState } from 'react';
import './App.css';
import {deleteTask,updateTask,getTasks,createTask} from './Services/taskServices.js'; 

function App() {
  // Store the tasks and form input values
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  
useEffect(() => {
  getTasks()
    .then((response) => {
      setTasks(response.data);
    })
    .catch((error) => {
      console.error('Could not load tasks:', error);
    });
}, []);


  // Allows us to focus the title input when needed
  const titleInput = useRef(null);

  // Calculate task statistics
  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const activeCount = tasks.length - completedCount;

  const today = new Date().toISOString().slice(0, 10);

  const overdueCount = tasks.filter(
    (task) =>
      !task.completed &&
      task.deadline &&
      task.deadline < today
  ).length;

  // Add a new task
  async function handleSubmit(event){
    event.preventDefault();

    if(!title.trim()){
      titleInput.current?.focus();
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline ? `${deadline}T23:59:00` : null,
      completed: false,
    };

    try{
      const response = await createTask(newTask);
      setTasks((currentTasks) =>
      [...currentTasks, response.data]);
    

    setTitle('');
    setDescription('');
    setDeadline('');
    }
    catch(error){
      console.error('Could not create task:',error);
      alert('Could not save the task please try again later.');

    }


  }

  // Mark a task as completed or incomplete
 async function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (!task) return;

  const updatedTask = {
    ...task,
    completed: !task.completed,
  };

  try {
    const response = await updateTask(id, updatedTask);

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? response.data : task
      )
    );
  } catch (error) {
    console.error('Could not update task:', error);
    alert('Could not update the task. Please try again.');
  }
}

  async function handleDeleteTask(id) {
  try {
    await deleteTask(id);

    setTasks(currentTasks =>
      currentTasks.filter(task => task.id !== id)
    );
  } catch (error) {
    console.error('Could not delete task:', error);
    alert('Could not delete the task. Please try again.');
  }
}

  // Focus the task title input
  function focusTaskForm() {
    titleInput.current?.focus();
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        {/* Simple header without profile or navigation */}
        <header className="topbar">
          <div className="page-label">
            <h1>SmartStudy</h1>
            <p>Your personal study task manager</p>
          </div>
        </header>

        {/* Welcome banner */}
        <section className="hero">
          <div className="hero-content">
            <span className="hero-eyebrow">
              YOUR STUDY SPACE
            </span>

            <h2>Make today count.</h2>

            <p>
              Organise your assignments, track your progress,
              and stay on top of your studies.
            </p>

            <button
              className="hero-button"
              onClick={focusTaskForm}
              type="button"
            >
              + Add a task
            </button>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            <div className="book book-one"></div>
            <div className="book book-two"></div>
            <div className="book book-three"></div>
            <div className="plant">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="plant-pot"></div>
          </div>
        </section>

        {/* Task statistics */}
        <section className="stats-grid">
          <article className="stat-card total-card">
            <div className="stat-icon">▤</div>
            <p>Total tasks</p>
            <h3>{tasks.length}</h3>
            <span>All your study tasks</span>
          </article>

          <article className="stat-card completed-card">
            <div className="stat-icon">✓</div>
            <p>Completed</p>
            <h3>{completedCount}</h3>
            <span>Tasks finished</span>
          </article>

          <article className="stat-card active-card">
            <div className="stat-icon">◷</div>
            <p>In progress</p>
            <h3>{activeCount}</h3>
            <span>Still to work on</span>
          </article>

          <article className="stat-card overdue-card">
            <div className="stat-icon">!</div>
            <p>Overdue</p>
            <h3>{overdueCount}</h3>
            <span>Past their deadline</span>
          </article>
        </section>

        {/* Main task workspace */}
        <section className="workspace-grid">
          {/* Task creation form */}
          <section className="panel task-form-panel">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">
                  GET ORGANISED
                </span>
                <h2>Create a task</h2>
                <p>Add something you need to get done.</p>
              </div>
              <div className="heading-icon">＋</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="task-title">
                  Task title <span>*</span>
                </label>

                <input
                  ref={titleInput}
                  id="task-title"
                  type="text"
                  placeholder="e.g. Complete Java assignment"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-description">
                  Description
                </label>

                <textarea
                  id="task-description"
                  placeholder="Add a few details about this task..."
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-deadline">
                  Deadline
                </label>

                <input
                  id="task-deadline"
                  type="date"
                  value={deadline}
                  onChange={(event) =>
                    setDeadline(event.target.value)
                  }
                />
              </div>

              <button className="submit-button" type="submit">
                + Create task
              </button>
            </form>
          </section>

          {/* Task list */}
          <section className="panel task-list-panel">
            <div className="panel-heading">
              <div>
                <span className="section-eyebrow">
                  YOUR WORKLOAD
                </span>
                <h2>My tasks</h2>
                <p>
                  {tasks.length === 0
                    ? 'Your next accomplishment starts here.'
                    : `${activeCount} task${activeCount === 1 ? '' : 's'} remaining`}
                </p>
              </div>

              <div className="task-count">
                {tasks.length}
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✎</div>
                <h3>Nothing on your list yet</h3>
                <p>
                  Add your first task and start making progress.
                </p>
                <button
                  type="button"
                  className="empty-button"
                  onClick={focusTaskForm}
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="task-list">
                {tasks.map((task) => (
                  <article
                    className={`task-item ${
                      task.completed ? 'task-completed' : ''
                    }`}
                    key={task.id}
                  >
                    <button
                      type="button"
                      className={`completion-button ${
                        task.completed ? 'is-completed' : ''
                      }`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.completed
                          ? 'Mark task as incomplete'
                          : 'Mark task as completed'
                      }
                    >
                      {task.completed ? '✓' : ''}
                    </button>

                    <div className="task-details">
                      <h3>{task.title}</h3>

                      {task.description && (
                        <p>{task.description}</p>
                      )}

                      {task.deadline && (
                        <span
                          className={`deadline ${
                            !task.completed &&
                            task.deadline < today
                              ? 'deadline-overdue'
                              : ''
                          }`}
                        >
                          <span aria-hidden="true">◷</span>{' '}
                          {task.deadline}
                          {!task.completed &&
                            task.deadline < today &&
                            ' · Overdue'}
                        </span>
                      )}

                      {task.completed && (
                        <span className="completed-label">
                          Completed
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                      title="Delete task"
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <footer className="footer">
          <p>Made for better study days.</p>
          <span>SMARTSTUDY</span>
        </footer>
      </main>
    </div>
  );
}

export default App;

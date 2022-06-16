import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import Footer from './Footer';
import About from './About';

function App() {

  const [tasks, setTask] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await fetchTasks()
      setTask(taskFromServer)
    }
    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/tasks')
      const data = await res.json();
      return data
    } catch (error) {
      console.log(error.message)
    }
  }

  // Fetch Task
  const fetchTask = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`)
      const data = await res.json();
      return data
    } catch (error) {
      console.log(error.message)
    }
  }

  // Add a new Task
  const addTask = async (task) => {
    try {
      const res = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      })

      const data = await res.json()
      setTask([...tasks, data])
    } catch (error) {
      console.log(error.message)
    }


    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTask([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
      })
      setTask(
        tasks.filter((task) => task.id !== id)
      )
    } catch (error) {
      console.log(error.message)
    }
  }

  // Toggle Reminder
  const ToggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask)
      })

      const data = await res.json();

      setTask(tasks.map((task) =>
        task.id === id ? { ...task, reminder: !data.reminder } : task
      ))
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <Router>
      <div className="container">
        <Header
          title={'Task Tracker'}
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route path='/'
            element={
              <>
                {showAddTask && <AddTask onAdd={addTask} />}
                {tasks.length > 0 ? <Tasks tasks={tasks}
                  onDelete={deleteTask}
                  onToggle={ToggleReminder}
                /> : 'No Tasks to show'}
              </>
            } />
          <Route path='/about' element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import AddTask from './components/AddTask'
import Navbar from './components/Navbar'
import SidebarInputFields from './components/SidebarInputFields'

import GoogleMap from './components/GoogleMap'

import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import About from './components/About'
import Map from './components/MapContainer'

function App() {
  const name = 'Brad'
  const [tasks, setTasks] = useState([])

const [showAddTask, setShowAddTask] = useState(false)

const [stopData, setStopData] = useState([])

useEffect(()=> {
  const fetchStops = async () => {
    const res = await fetch(`http://localhost:8000/stops`)
    const data = await res.json()
    setStopData(data)
    console.log("stop data", data)
    return data
  }
  fetchStops()
}, [])

console.log(stopData, "hopefully all went okay...")

useEffect(() => {
  const getTasks = async () => {
    const tasksFromServer = await fetchTasks()
    setTasks(tasksFromServer)
  }

  getTasks()
}, [])

// Fetch tasks from dummy json server
const fetchTasks = async () => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()
  console.log("data from fetch tasks", data)
  return data
}

// Fetch TASK - just one - from dummy json server
const fetchTask = async (id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()
  console.log("data from fetch task", data)
  return data
}

// Fetch stop data from backend
const fetchStops = async () => {
  const res = await fetch(`http://localhost:8000/stops`)
  const data = await res.json()
  console.log("stop data", data)
  return data
}

const renderMap = async () => {
  const data = await fetchStops()
  console.log(data, "got it")
}
renderMap()
console.log(stopData, "is stopdata")

// add task

const addTask = async (task) => {
  const res = await fetch(`http://localhost:5000/tasks`, {method: 'POST', headers: {'Content-type': 'application/json'}, body: JSON.stringify(task)})
  
  const data = await res.json()

  setTasks([...tasks, data])
  // const id = Math.floor(Math.random() * 10000 + 1)
  // const newTask = { id, ...task}
  // setTasks([...tasks, newTask])
}

// Delete
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
  
  setTasks(tasks.filter((task) => task.id !== id))
}
  
// Toggle Reminder
 const toggleReminder = async (id) => {
   const taskToToggle = await fetchTask(id)
   const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}

   const res = await fetch(`http://localhost:5000/tasks/${id}`, {method: 'PUT', headers: {'Content-type' : 'application/json'}, body: JSON.stringify(updTask)})
   const data = await res.json()
   
   setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder} : task))
 }

 const Welcome = 'Hello'
  return (
    <Router>
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} title = {Welcome}/>
      // Start of default Page
      <Navbar></Navbar>
      <Route path='/' exact render={(props) => (<>
        {showAddTask && <AddTask onAdd={addTask}/>}
      {tasks.length >0 ? <Tasks tasks={tasks} onToggle={toggleReminder} onDelete = {deleteTask}/> : 'No Tasks to Show'}
      <h1 style = {{color : 'red', backgroundColor: 'black'}}>Hello From React</h1>
      <h2>Hello { name }</h2>
      </>)}/>
      // End of Default Page
      <Route path='/map' render={(props) => (<><Map stopData={stopData}/></>)}/>
      <Route path='/gmap' render={(props) => (<><GoogleMap stopData={stopData}/></>)}/>
      <Footer />    
    </div>
    </Router>
  );
}

export default App;
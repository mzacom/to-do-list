import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const usePersistentTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return [tasks, setTasks];
};

const generateTaskId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const Today = () => {
  const current = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const monthReal = current.getMonth();
  const dayReal = current.getDay();

  const printMonth = months[monthReal];
  const printDay = days[dayReal];

  // overlay and add task button
  const [add, setAdd] = useState(false);

  // State to control the bounce animation
  const [bounce, setBounce] = useState(false);

  const addTask = function () {
    setAdd(true);
    setBounce(true); // Start the bounce animation
    setTimeout(() => setBounce(false), 500);
  };

  // Initialize state for each input
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");

  // Function to handle input changes
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  // Determine if all inputs are filled
  const allInputsFilled = taskName && description && dateTime;

  // Use the custom hook to manage persistent tasks
  const [tasks, setTasks] = usePersistentTasks();

  // Function to add a new task
  const addNewTask = () => {
    // Create a new task object
    const newTask = {
      id: generateTaskId(), // Generate a unique ID for the task
      name: taskName,
      description: description,
      dateTime: dateTime,
    };

    // Add the new task to the tasks state by creating a new array
    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Clear the input fields
    setTaskName("");
    setDescription("");
    setDateTime("");

    // Close the add task overlay
    setAdd(false);
  };

  // Function to delete a task
  const deleteTask = (id) => {
    // Filter out the task with the specified ID
    const updatedTasks = tasks.filter((task) => task.id !== id);
    // Update the tasks state
    setTasks(updatedTasks);
  };

  return (
    <>
      <section className="flex flex-col w-full mx-auto my-3">
        {/* Today */}
        <div className="w-full flex text-2xl justify-center font-bold items-center">
          <p className="">Today</p>
          <i className="fa-solid fa-calendar-week flex absolute right-[20px] text-red-500"></i>
        </div>

        {/* month and day */}
        <div className="px-[20px] text-black flex gap-1 mt-3">
          <span>{printMonth}</span>.<span> {printDay} </span>
        </div>

        {/* add task And display area. */}
        <div
          className={`${
            bounce ? "bounce" : ""
          } w-[90%] mx-auto h-[60px] cursor-pointer rounded-lg shadow2 flex-col mt-7 justify-center flex items-start px-4`}
          onClick={addTask}
        >
          <div className="flex gap-5 items-center">
            <i className="fa-solid fa-plus text-xl text-red-500"></i>
            <p className="text-xl">Add Task</p>
          </div>
        </div>

        {/* inputation */}
        {/* overlay */}
        <div
          className={`${
            add ? "flex" : "hidden"
          } fixed w-full h-[100%] bg-[#0000003a] top-0 left-0 right-0 z-[100]`}
          onClick={() => setAdd(false)}
        ></div>

        <div
          className={`${
            add ? "flex flex-col" : "hidden"
          } enter flex w-full h-[270px] px-3 rounded-t-[10px] shadow-lg z-[200] bottom-0 bg-white fixed m-0 justify-start items-start p-0`}
        >
          {/* Input area */}
          {/* Task Name */}
          <input
            type="text"
            placeholder="Task Name"
            className="font-bold mt-3 w-full outline-none border-none pl-2 text-xl h-[50px]"
            value={taskName}
            onChange={handleInputChange(setTaskName)}
          />

          {/* Description */}
          <input
            type="text"
            placeholder="Description"
            className="font-thin w-full outline-none border-none pl-2 text-xl h-[30px]"
            value={description}
            onChange={handleInputChange(setDescription)}
          />

            <p className=" mt-3 ml-2 text-slate-500 " >
              Date and Time 
            </p>
          {/* Date and Time */}
          <input
            type="datetime-local"
            name=""
            id=""
            placeholder="Date, Time"
            className=" outline-none  border-[1px] rounded-lg px-[10px] ml-2 text-xl font-thin mt-2"
            value={dateTime}
            onChange={handleInputChange(setDateTime)}
          />

          <div className="w-full flex justify-end px-[1rem] mt-[2rem]">
            {/* Button */}
            <button
              className={`bg-${
                !taskName || !dateTime ? "slate-300" : "red-500"
              } p-3 rounded-full h-[45px] font-bold shadow-lg  text-xl text-white w-[45px] items-center justify-center`}
              disabled={!taskName || !dateTime}
              onClick={addNewTask}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Render the tasks */}
      <div className="flex-col mt-7 w-full justify-center flex items-start  task-list">
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <div className="task-item  rounded-lg p-3 w-[90%] gap-2 my-[10px] mx-[20px] flex flex-col" style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              {/* To-do checkbox */}
              <div className="checkbox-wrapper-15">
                <input
                 className="inp-cbx"
                 id={`cbx-${task.id}`} // Unique ID for each checkbox
                 type="checkbox"
                 style={{ display: "none" }}
                />
                <label className="cbx" htmlFor={`cbx-${task.id}`}>
                 <span>
                    <svg width="12px" height="9px" viewBox="0 0 12 9">
                      <polyline points="1 5 4 8 11 1"></polyline>
                    </svg>
                 </span>
                 <span className="text-xl">{task.name}</span> {/* Display task name as the checkbox label */}
                </label>
              </div>

              {/* Task details */}
              <p>{task.description}</p>
              <p className="text-[12px] font-thin">{task.dateTime}</p>

              {/* Delete button */}
              <div className="flex justify-end">
                <button
                 className="bg-red-500 flex items-center justify-center h-[22px] w-[20px] text-white px-3 py-1 rounded-md"
                 onClick={() => deleteTask(task.id)}
                >
                 <i className="fa-solid text-[12px] p-1 fa-trash"></i>
                </button>
              </div>
            </div>
            {/* Add a horizontal rule after each task except the last one */}
            {index < tasks.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Today;

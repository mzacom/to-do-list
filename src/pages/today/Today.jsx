import React, { useState, useEffect, useRef } from "react";
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

const Clock = ({ time }) => {
  const formattedTime = () => {
    const hours = time.getHours() % 12 || 12;
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const ampm = time.getHours() >= 12 ? "PM" : "AM";
    return `${hours}:${minutes} ${ampm}`;
  };

  return <div className="text-sm text-gray-500">{formattedTime()}</div>;
};

const Today = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const monthReal = currentTime.getMonth();
  const dayReal = currentTime.getDay();

  const printMonth = `${months[monthReal]} ${currentTime.getDate()}, ${
    days[dayReal]
  }`;

  const [add, setAdd] = useState(false);
  const [bounce, setBounce] = useState(false);
  const taskNameInputRef = useRef(null); // Ref for Task Name input

  const addTask = function () {
    setAdd(true);
    setBounce(true);
    setTimeout(() => {
      setBounce(false);
      if (taskNameInputRef.current) {
        taskNameInputRef.current.focus(); // Focus on Task Name input
      }
    }, 500);
  };

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const [tasks, setTasks] = usePersistentTasks();

  const addNewTask = () => {
    const newTask = {
      id: generateTaskId(),
      name: taskName,
      description: description,
      time: new Date().getTime(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskName("");
    setDescription("");
    setAdd(false);
  };

  const deleteTaskAfterDelay = (id) => {
    setTimeout(() => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    }, 3000);
  };

  const handleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    deleteTaskAfterDelay(id);
  };

  return (
    <>
      <section className="relative flex flex-col w-full mx-auto my-3">
        <div className="w-full flex text-2xl justify-center font-bold items-center">
          <p className="">Today</p>
          <i className="fa-solid fa-calendar-week flex absolute right-[20px] text-red-500"></i>
        </div>

        <div className="px-[20px] items-center justify-between text-black flex gap-1 mt-3">
          <div>
            <span>{printMonth}</span>
          </div>

          <div className="text-black fo">
            <Clock time={currentTime} />
          </div>
        </div>

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

        <div
          className={`${
            add ? "flex" : "hidden"
          } fixed w-full h-[100%] bg-[#0000003a] top-0 left-0 right-0 z-[100]`}
          onClick={() => setAdd(false)}
        ></div>

        <div
          className={`${
            add ? "flex flex-col" : "hidden"
          } enter flex w-full h-[220px] px-3 rounded-t-[10px] shadow-lg z-[200] bottom-0 bg-white fixed m-0 justify-start items-start p-0`}
        >
          <input
            type="text"
            placeholder="Task Name"
            className=" font-semibold mt-3 w-full outline-none border-none pl-2 text-xl h-[50px]"
            value={taskName}
            onChange={handleInputChange(setTaskName)}
            ref={taskNameInputRef} // Assign the ref to Task Name input
          />

          <input
            type="text"
            placeholder="Description"
            className="font-thin w-full outline-none border-none pl-2 text-xl h-[30px]"
            value={description}
            onChange={handleInputChange(setDescription)}
          />

          <div className="w-full flex justify-end px-[1rem] mt-[2rem]">
            <button
              style={{ backgroundColor: !taskName ? "#dee3e0" : "#EF4444" }}
              className="p-3 rounded-full h-[45px] font-bold shadow-lg text-xl text-white w-[45px] items-center justify-center"
              disabled={!taskName}
              onClick={addNewTask}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </section>

      <div className="flex-col mt-7 w-full justify-center flex items-start task-list">
        {tasks.map((task, index) => (
          <React.Fragment key={task.id}>
            <div
              className="task-item rounded-lg p-3 w-[90%]  gap-2 mx-auto my-[10px] flex flex-col"
              style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex flex-col  items-start ">
                <div>
                  <div className="checkbox-wrapper-15">
                    <input
                      className="inp-cbx"
                      id={`cbx-${task.id}`}
                      type="checkbox"
                      style={{ display: "none" }}
                      checked={task.completed}
                      onChange={() => handleTaskCompletion(task.id)}
                    />
                    <label className="cbx" htmlFor={`cbx-${task.id}`}>
                      <span>
                        <svg width="12px" height="9px" viewBox="0 0 12 9">
                          <polyline points="1 5 4 8 11 1"></polyline>
                        </svg>
                      </span>
                      <span className="text-xl">{task.name}</span>
                    </label>
                  </div>

                  <p className=" ml-[1.9rem] text-[13px] font-thin">
                    {task.description}
                  </p>
                </div>
                
                <div className="  ml-[1.9rem] ">
                  <Clock time={new Date(task.time)} />
                </div>
              </div>
            </div>
            {index < tasks.length - 1 && <hr />}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Today;

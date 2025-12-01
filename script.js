// Calendar
const calendarGrid = document.getElementById("calendar-grid");
const monthSelect = document.getElementById("month-select");
const monthUp = document.getElementById("month-up");
const monthDown = document.getElementById("month-down");

monthSelect.addEventListener("change", () => {
  selectedDate = new Date(monthSelect.value);
  renderCalendar();
});

monthUp.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  monthSelect.value = selectedDate.toISOString().slice(0, 10);
  renderCalendar();
});

monthDown.addEventListener("click", () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  monthSelect.value = selectedDate.toISOString().slice(0, 10);
  renderCalendar();
});

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const daysInMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  ).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("calendar-day");
    dayCell.innerHTML = `<strong>${day}</strong>`;

    const tasksList = document.createElement("div");
    tasksList.classList.add("tasks-list");
    dayCell.appendChild(tasksList);

    const currentDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      day
    );

    const tasksOnThisDay = tasks.filter((task) => {
      const taskStart = new Date(task.startTime);
      const taskEnd = new Date(task.endTime);

      const dayStart = new Date(currentDay);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDay);
      dayEnd.setHours(23, 59, 59, 999);

      return taskStart <= dayEnd && taskEnd >= dayStart;
    });

    tasksOnThisDay.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("calendar-task");
      taskElement.classList.add(`${task.priority}`);
      taskElement.innerHTML = `<p>${task.name}</p>
         <p>${new Date(task.startTime).getHours()}:${new Date(
        task.startTime
      ).getMinutes()}-${new Date(task.endTime).getHours()}:${new Date(
        task.startTime
      ).getMinutes()}</p>`;

      tasksList.appendChild(taskElement);
    });

    calendarGrid.appendChild(dayCell);
  }
}

// Upcoming
const upcoming_list = document.getElementById("task-list");

function renderUpcoming() {
  upcoming_list.innerHTML = "";

  let now = new Date();
  tasks.forEach((task) => {
    if (now > new Date(task.endTime)) {
      return;
    }

    const task_div = document.createElement("div");
    task_div.classList.add("task");
    task_div.innerHTML = `
      <h3>${task.name}</h3>
      <p>${task.description}</p>
      <p>Priority: ${task.priority}</p>
      <p>Start: ${task.startTime}</p>
      <p>End: ${task.endTime}</p>
    `;
    upcoming_list.appendChild(task_div);
  });
}

// Add task popup
const popover = document.getElementById("task-popover");
const addTaskButton = document.getElementById("add-task-button");
const closeBtn = document.querySelector(".close-btn");
const task_form = document.getElementById("task-form");

function openPopover() {
  popover.classList.add("show");

  const taskStartInput = document.getElementById("task-start");
  const taskEndInput = document.getElementById("task-end");

  const now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);

  taskStartInput.value = now.toISOString().slice(0, 16);
  taskEndInput.value = later.toISOString().slice(0, 16);
}

function closePopover() {
  popover.classList.remove("show");
}

addTaskButton.addEventListener("click", openPopover);

closeBtn.addEventListener("click", closePopover);
window.addEventListener("click", (event) => {
  if (event.target == popover) {
    closePopover();
  }
});

task_form.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const taskPriority = document.getElementById("task-priority").value;
  const taskStartTime = document.getElementById("task-start").value;
  const taskEndTime = document.getElementById("task-end").value;

  const newTask = {
    name: taskName,
    description: taskDescription,
    priority: taskPriority,
    startTime: taskStartTime,
    endTime: taskEndTime,
  };

  addTask(newTask);
  renderUpcoming();
  task_form.reset();
  closePopover();
});

// Chat
const chatMessages = document.getElementById("chat-messages");
const sendButton = document.getElementById("send-button");
const messageBox = document.getElementById("message-box");

let AIScript = [
  {
    user: "AI",
    content:
      "You have some free time on wednesday would you like me to schedule a walk to calm down your busy week?",
  },
  {
    user: "AI",
    content:
      "This week you have a midterm, exam, seminar, statistics homework, and a meting with your academic advisor",
  },
  {
    user: "AI",
    content: "I will add your task right away",
  },
];

sendButton.addEventListener("click", () => {
  messages.push({
    user: "",
    content: messageBox.value,
  });

  let nextMessage = AIScript.pop();

  if (nextMessage != null) {
    messages.push(nextMessage);
  } else {
    messages.push({
      user: "AI",
      content:
        "This is only an example and i've run out of prescribed responses",
    });
  }

  messageBox.value = "";
  renderMessages();
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function renderMessages() {
  let newMessage = "";
  chatMessages.innerHTML = "";

  messages.forEach((message) => {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");

    if (message.user == "AI") {
      newMessage.classList.add("other");
    } else {
      newMessage.classList.add("you");
    }

    newMessage.innerHTML = `
        <h3>${message.user}</h3>
        <p>${message.content}</p>
      `;
    chatMessages.appendChild(newMessage);
  });
}

// Main
function addTask(task) {
  tasks.push(task);
  tasks = tasks.sort((a, b) => {
    const dateA = new Date(a.startTime);
    const dateB = new Date(b.startTime);
    return dateA - dateB;
  });
  renderCalendar();
  renderUpcoming();
}

let tasks = [
  {
    name: "Math Homework",
    startTime: "2025-11-02T10:00:00.000Z",
    endTime: "2025-11-02T12:30:00.000Z",
    description: "Complete problems 1-25",
    priority: "high",
  },
  {
    name: "Attend  Lab",
    startTime: "2025-11-05T14:00:00.000Z",
    endTime: "2025-11-05T16:00:00.000Z",
    description: "Lab session",
    priority: "medium",
  },
  {
    name: "Essay Draft",
    startTime: "2025-11-08T09:00:00.000Z",
    endTime: "2025-11-08T11:00:00.000Z",
    description: "Write first draft of essay",
    priority: "high",
  },
  {
    name: "Attend Lecture",
    startTime: "2025-11-10T15:00:00.000Z",
    endTime: "2025-11-10T16:30:00.000Z",
    description: "Lecture",
    priority: "medium",
  },
  {
    name: "Study for Quiz",
    startTime: "2025-11-12T11:00:00.000Z",
    endTime: "2025-11-12T13:00:00.000Z",
    description: "Review material",
    priority: "high",
  },
  {
    name: "Group Project Meeting",
    startTime: "2025-11-15T08:00:00.000Z",
    endTime: "2025-11-15T10:00:00.000Z",
    description: "Meet with team to discuss computer science project progress",
    priority: "medium",
  },
  {
    name: "Complete Lab Report",
    startTime: "2025-11-17T13:00:00.000Z",
    endTime: "2025-11-17T16:00:00.000Z",
    description: "Write up findings experiment",
    priority: "high",
  },
  {
    name: "Attend Class",
    startTime: "2025-11-19T10:00:00.000Z",
    endTime: "2025-11-19T12:00:00.000Z",
    description: "Lecture on techniques",
    priority: "medium",
  },
  {
    name: "Assignment",
    startTime: "2025-11-22T14:00:00.000Z",
    endTime: "2025-11-22T15:30:00.000Z",
    description: "Complete exercises and practice",
    priority: "medium",
  },
  {
    name: "Read Book Chapters",
    startTime: "2025-11-24T09:00:00.000Z",
    endTime: "2025-11-24T11:30:00.000Z",
    description: "Read chapters 8-10",
    priority: "low",
  },
  {
    name: "Attend Study Group",
    startTime: "2025-11-26T12:00:00.000Z",
    endTime: "2025-11-26T14:00:00.000Z",
    description: "Group study session for upcoming midterms",
    priority: "high",
  },
  {
    name: "Programming Assignment",
    startTime: "2025-11-28T16:00:00.000Z",
    endTime: "2025-11-28T19:00:00.000Z",
    description: "Complete Python assignment on data structures",
    priority: "high",
  },
  {
    name: "Review Notes",
    startTime: "2025-11-30T10:00:00.000Z",
    endTime: "2025-11-30T12:00:00.000Z",
    description: "Review all notes from the past two weeks",
    priority: "medium",
  },
  {
    name: "Midterm Exam",
    startTime: "2025-12-01T09:00:00.000Z",
    endTime: "2025-12-01T11:00:00.000Z",
    description: "Midterm covering chapters 1-6",
    priority: "high",
  },
  {
    name: "Attend Seminar",
    startTime: "2025-12-03T13:00:00.000Z",
    endTime: "2025-12-03T15:00:00.000Z",
    description: "Guest speaker",
    priority: "low",
  },
  {
    name: "Statistics Homework",
    startTime: "2025-12-05T08:00:00.000Z",
    endTime: "2025-12-05T10:00:00.000Z",
    description: "Complete problem set on probability distributions",
    priority: "medium",
  },
  {
    name: "Meet with Academic Advisor",
    startTime: "2025-12-07T14:00:00.000Z",
    endTime: "2025-12-07T15:00:00.000Z",
    description: "Discuss course selection for next semester",
    priority: "high",
  },
  {
    name: "Complete Research Paper",
    startTime: "2025-12-09T10:00:00.000Z",
    endTime: "2025-12-09T14:00:00.000Z",
    description: "Finish research paper on climate change",
    priority: "high",
  },
  {
    name: "Attend Lecture",
    startTime: "2025-12-11T11:00:00.000Z",
    endTime: "2025-12-11T12:30:00.000Z",
    description: "Lecture",
    priority: "low",
  },
  {
    name: "Lab Practical",
    startTime: "2025-12-13T15:00:00.000Z",
    endTime: "2025-12-13T17:00:00.000Z",
    description: "Practical exam",
    priority: "high",
  },
  {
    name: "Presentation Prep",
    startTime: "2025-12-15T09:00:00.000Z",
    endTime: "2025-12-15T11:00:00.000Z",
    description: "Prepare slides for final project presentation",
    priority: "medium",
  },
  {
    name: "Study for Finals",
    startTime: "2025-12-17T13:00:00.000Z",
    endTime: "2025-12-17T18:00:00.000Z",
    description: "Review all course material for final exams",
    priority: "high",
  },
  {
    name: "Final Exam",
    startTime: "2025-12-19T10:00:00.000Z",
    endTime: "2025-12-19T12:00:00.000Z",
    description: "Comprehensive final covering entire semester",
    priority: "high",
  },
  {
    name: "Submit Final Projects",
    startTime: "2025-12-19T10:00:00.000Z",
    endTime: "2025-12-19T12:00:00.000Z",
    description: "Upload all final project submissions before deadline",
    priority: "high",
  },
  {
    name: "Complete Course Evaluations",
    startTime: "2025-12-23T14:00:00.000Z",
    endTime: "2025-12-23T15:00:00.000Z",
    description: "Fill out end-of-semester course evaluations",
    priority: "low",
  },
  {
    name: "Return Library Books",
    startTime: "2025-12-26T10:00:00.000Z",
    endTime: "2025-12-26T11:00:00.000Z",
    description: "Return all borrowed books before break",
    priority: "medium",
  },
  {
    name: "Update Resume",
    startTime: "2025-12-28T09:00:00.000Z",
    endTime: "2025-12-28T11:00:00.000Z",
    description: "Update resume with recent coursework and projects",
    priority: "low",
  },
  {
    name: "Register for Next Semester",
    startTime: "2025-12-29T20:00:00.000Z",
    endTime: "2025-12-29T21:00:00.000Z",
    description: "Register for spring semester classes",
    priority: "high",
  },
  {
    name: "Review Next Semester Schedule",
    startTime: "2025-12-31T13:00:00.000Z",
    endTime: "2025-12-31T14:00:00.000Z",
    description: "Review and organize schedule for upcoming semester",
    priority: "medium",
  },
];

let messages = [
  {
    user: "AI",
    content:
      "Hello I am your AI assistant. I help you with your schedule. For example ask me add a task. Or, paste in your syllabus and I will add any relevant events. Afterward you can ask me summarize your schedule for the next week.",
  },
];

let selectedDate = new Date();

function main() {
  const [defaultYear, defaultMonth] = monthSelect.value.split("-");

  renderMessages();
  renderCalendar();
  renderUpcoming();
}

main();

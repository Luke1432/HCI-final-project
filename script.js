// Calendar
const calendarGrid = document.getElementById("calendar-grid");
const monthSelect = document.getElementById("month-select");
const monthUp = document.getElementById("month-up");
const monthDown = document.getElementById("month-down");
let currentView = "monthly";
const monthDownButton = document.getElementById("month-down");
const monthUpButton = document.getElementById("month-up");
const confirmPopover = document.getElementById("confirm-popover");
const confirmText = document.getElementById("confirm-text");
const confirmYes = document.getElementById("confirm-yes");
const confirmNo = document.getElementById("confirm-no");

let pendingDeleteId = null;

function openConfirm(text, taskId) {
  confirmText.textContent = text;
  pendingDeleteId = taskId;
  confirmPopover.classList.add("show");
}

function closeConfirm() {
  confirmPopover.classList.remove("show");
  pendingDeleteId = null;
}

confirmNo.addEventListener("click", closeConfirm);

confirmYes.addEventListener("click", () => {
  if (pendingDeleteId) {
    tasks = tasks.filter(t => t.id !== pendingDeleteId);
    renderCalendar();
    renderUpcoming();
  }
  closeConfirm();
});


function generateTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

let isEditing = false;
let editingTaskId = null;

monthDownButton.addEventListener("click", () => {
  if (currentView === "daily") {
    monthSelect.value = selectedDate.toISOString().slice(0, 10);
    renderDailyView();
  } else if (currentView === "weekly") {
    const startOfWeek = new Date(selectedDate);
    selectedDate = new Date(startOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    monthSelect.value = `${startOfWeek.toISOString().slice(0, 10)} - ${endOfWeek
      .toISOString()
      .slice(0, 10)}`;
    renderWeeklyView();
  } else if (currentView === "monthly") {
    monthSelect.value = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}`;
    renderMonthlyView();
  }
});

monthUpButton.addEventListener("click", () => {
  if (currentView === "daily") {
    monthSelect.value = selectedDate.toISOString().slice(0, 10);
    renderDailyView();
  } else if (currentView === "weekly") {
    const startOfWeek = new Date(selectedDate);
    selectedDate = new Date(startOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    monthSelect.value = `${startOfWeek.toISOString().slice(0, 10)} - ${endOfWeek
      .toISOString()
      .slice(0, 10)}`;
    renderWeeklyView();
  } else if (currentView === "monthly") {
    monthSelect.value = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}`;
    renderMonthlyView();
  }
});

monthSelect.addEventListener("change", () => {
  selectedDate = new Date(monthSelect.value);
  renderCalendar();
});

monthUp.addEventListener("click", () => {
  if (currentView === "daily") {
    selectedDate.setDate(selectedDate.getDate() + 1);
    monthSelect.value = selectedDate.toISOString().slice(0, 10);
    renderDailyView();
  } else if (currentView === "weekly") {
    selectedDate.setDate(selectedDate.getDate() + 7);
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    monthSelect.value = `${startOfWeek.toISOString().slice(0, 10)} - ${endOfWeek
      .toISOString()
      .slice(0, 10)}`;
    renderWeeklyView();
  } else if (currentView === "monthly") {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    monthSelect.value = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}`;
    renderMonthlyView();
  }
});

monthDown.addEventListener("click", () => {
  if (currentView === "daily") {
    selectedDate.setDate(selectedDate.getDate() - 1);
    monthSelect.value = selectedDate.toISOString().slice(0, 10);
    renderDailyView();
  } else if (currentView === "weekly") {
    selectedDate.setDate(selectedDate.getDate() - 7);
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    monthSelect.value = `${startOfWeek.toISOString().slice(0, 10)} - ${endOfWeek
      .toISOString()
      .slice(0, 10)}`;
    renderWeeklyView();
  } else if (currentView === "monthly") {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    monthSelect.value = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}`;
    renderMonthlyView();
  }
});

const viewWeeklyButton = document.getElementById("view-weekly");
const viewDailyButton = document.getElementById("view-daily");
const viewMonthlyButton = document.getElementById("view-monthly");

viewMonthlyButton.addEventListener("click", () => {
  currentView = "monthly";
  renderMonthlyView();
});

viewWeeklyButton.addEventListener("click", () => {
  currentView = "weekly";
  renderWeeklyView();
});

viewDailyButton.addEventListener("click", () => {
  currentView = "daily";
  renderDailyView();
});

function createCalendarTaskElement(task, timeLabel) {
  const taskElement = document.createElement("div");
  taskElement.classList.add("calendar-task");
  taskElement.classList.add(task.priority);
  taskElement.dataset.taskId = task.id;

  const nameP = document.createElement("p");
  nameP.textContent = task.name;

  const timeP = document.createElement("p");
  timeP.textContent = timeLabel;

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-task");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startEditingTask(task.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-task");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    deleteTask(task.id);
  });

  taskElement.appendChild(nameP);
  taskElement.appendChild(timeP);
  taskElement.appendChild(editBtn);
  taskElement.appendChild(deleteBtn);

  return taskElement;
}

function renderDailyView() {
  calendarGrid.className = "daily-view";
  calendarGrid.innerHTML = "";

  const dayCell = document.createElement("div");
  dayCell.classList.add("calendar-day");
  dayCell.innerHTML = `<strong>${selectedDate.getDate()}</strong>`;

  const tasksList = document.createElement("div");
  tasksList.classList.add("tasks-list");
  dayCell.appendChild(tasksList);

  const tasksOnThisDay = tasks.filter((task) => {
    const taskStart = new Date(task.startTime);
    const taskEnd = new Date(task.endTime);
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);
    return taskStart <= dayEnd && taskEnd >= dayStart;
  });

  tasksOnThisDay.forEach((task) => {
    const timeLabel = `${new Date(task.startTime).toLocaleTimeString()} - ${new Date(
      task.endTime
    ).toLocaleTimeString()}`;
    const taskElement = createCalendarTaskElement(task, timeLabel);
    tasksList.appendChild(taskElement);
  });

  calendarGrid.appendChild(dayCell);

  monthSelect.type = "date";
  monthSelect.value = selectedDate.toISOString().slice(0, 10);
}

function renderWeeklyView() {
  calendarGrid.className = "weekly-view";
  calendarGrid.innerHTML = "";

  const startOfWeek = new Date(selectedDate);
  startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);

    const dayCell = document.createElement("div");
    dayCell.classList.add("calendar-day");
    dayCell.innerHTML = `<strong>${currentDay.getDate()}</strong>`;

    const tasksList = document.createElement("div");
    tasksList.classList.add("tasks-list");
    dayCell.appendChild(tasksList);

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
      const timeLabel = `${new Date(task.startTime).toLocaleTimeString()} - ${new Date(
        task.endTime
      ).toLocaleTimeString()}`;
      const taskElement = createCalendarTaskElement(task, timeLabel);
      tasksList.appendChild(taskElement);
    });

    calendarGrid.appendChild(dayCell);
  }

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  monthSelect.type = "text";
  monthSelect.value = `${startOfWeek.toISOString().slice(0, 10)} - ${endOfWeek
    .toISOString()
    .slice(0, 10)}`;
}

function renderMonthlyView() {
  calendarGrid.className = "monthly-view";
  calendarGrid.innerHTML = "";

  const startOfMonth = new Date(selectedDate);
  startOfMonth.setDate(1);

  const endOfMonth = new Date(selectedDate);
  endOfMonth.setMonth(selectedDate.getMonth() + 1);
  endOfMonth.setDate(0);

  const daysInMonth = endOfMonth.getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDay = new Date(startOfMonth);
    currentDay.setDate(i);

    const dayCell = document.createElement("div");
    dayCell.classList.add("calendar-day");
    dayCell.innerHTML = `<strong>${currentDay.getDate()}</strong>`;

    const tasksList = document.createElement("div");
    tasksList.classList.add("tasks-list");
    dayCell.appendChild(tasksList);

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
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const timeLabel = `${String(start.getHours()).padStart(2, "0")}:${String(
        start.getMinutes()
      ).padStart(2, "0")}-${String(end.getHours()).padStart(2, "0")}:${String(
        end.getMinutes()
      ).padStart(2, "0")}`;
      const taskElement = createCalendarTaskElement(task, timeLabel);
      tasksList.appendChild(taskElement);
    });

    calendarGrid.appendChild(dayCell);
  }

  monthSelect.type = "month";
  monthSelect.value = `${selectedDate.getFullYear()}-${String(
    selectedDate.getMonth() + 1
  ).padStart(2, "0")}`;
}

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
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const timeLabel = `${String(start.getHours()).padStart(2, "0")}:${String(
        start.getMinutes()
      ).padStart(2, "0")}-${String(end.getHours()).padStart(2, "0")}:${String(
        end.getMinutes()
      ).padStart(2, "0")}`;
      const taskElement = createCalendarTaskElement(task, timeLabel);
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
    task_div.dataset.taskId = task.id;

    const h3 = document.createElement("h3");
    h3.textContent = task.name;

    const pDesc = document.createElement("p");
    pDesc.textContent = task.description;

    const pPriority = document.createElement("p");
    pPriority.textContent = `Priority: ${task.priority}`;

    const pStart = document.createElement("p");
    pStart.textContent = `Start: ${task.startTime}`;

    const pEnd = document.createElement("p");
    pEnd.textContent = `End: ${task.endTime}`;

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-task");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      startEditingTask(task.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-task");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    task_div.appendChild(h3);
    task_div.appendChild(pDesc);
    task_div.appendChild(pPriority);
    task_div.appendChild(pStart);
    task_div.appendChild(pEnd);
    task_div.appendChild(editBtn);
    task_div.appendChild(deleteBtn);

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

  if (!isEditing) {
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);

    taskStartInput.value = now.toISOString().slice(0, 16);
    taskEndInput.value = later.toISOString().slice(0, 16);
  }
}

function closePopover() {
  popover.classList.remove("show");
  isEditing = false;
  editingTaskId = null;
  task_form.reset();
}

addTaskButton.addEventListener("click", () => {
  isEditing = false;
  editingTaskId = null;
  openPopover();
});

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

  if (isEditing && editingTaskId) {
    const index = tasks.findIndex((t) => t.id === editingTaskId);
    if (index !== -1) {
      tasks[index] = {
        ...tasks[index],
        name: taskName,
        description: taskDescription,
        priority: taskPriority,
        startTime: taskStartTime,
        endTime: taskEndTime,
      };
      tasks = tasks.sort((a, b) => {
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateA - dateB;
      });
    }
  } else {
    const newTask = {
      id: generateTaskId(),
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      startTime: taskStartTime,
      endTime: taskEndTime,
    };
    addTask(newTask);
  }

  renderUpcoming();
  renderCalendar();
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
      "This week you have a midterm, exam, seminar, statistics homework, and a meeting with your academic advisor",
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

function deleteTask(taskId) {
  openConfirm("Are you sure you want to delete this task?", taskId);
}



function startEditingTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  isEditing = true;
  editingTaskId = taskId;

  const taskName = document.getElementById("task-name");
  const taskDescription = document.getElementById("task-description");
  const taskPriority = document.getElementById("task-priority");
  const taskStart = document.getElementById("task-start");
  const taskEnd = document.getElementById("task-end");

  taskName.value = task.name;
  taskDescription.value = task.description;
  taskPriority.value = task.priority;
  taskStart.value = task.startTime.slice(0, 16);
  taskEnd.value = task.endTime.slice(0, 16);

  openPopover();
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

tasks = tasks.map((task) => ({
  ...task,
  id: task.id || generateTaskId(),
}));

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

const fs = require("fs");
const path = require("path");

const TASKS_FILE_PATH = path.join(process.cwd(), "tasks.json");

function readTasks() {
  if (!fs.existsSync(TASKS_FILE_PATH)) {
    fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify([], null, 2), "utf8");
    return [];
  }
  const data = fs.readFileSync(TASKS_FILE_PATH, "utf8");
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify(tasks, null, 2), "utf8");
}

function addTask(description) {
  if (!description || description.trim() === "") {
    console.error("Error: Task description cannot be empty");
    return;
  }
  const tasks = readTasks();

  const now = new Date().toISOString();
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    description: description,
    status: "todo",
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(newTask);
  writeTasks(tasks);
  console.log(`Task added (Id: ${newTask.id})`);
}

function listTask() {
  const tasks = readTasks();

  if (tasks.length === 0) {
    console.log("No task found. Add one with:");
    console.log(` node task-cli add 'my first task'`);
    return;
  }
  console.log("\n Your Tasks:");
  console.log("-------------------------------------------------------------");

  console.log("ID  | Status       | Description");
  console.log("-------------------------------------------------------------");

  tasks.forEach((task) => {
    const idStr = String(task.id).padEnd(2);
    const statusStr = task.status.padEnd(12);
    console.log(`${idStr}  | ${statusStr} | ${task.description}`);
  });
  console.log("-------------------------------------------------------------");
}

function deleteTask(idStr) {
  if (!idStr) {
    console.error("Error: missing task id");
    return;
  }

  const taskId = parseInt(idStr, 10);
  if (isNaN(taskId)) {
    console.error("Error: Task Id must be a number.");
    return;
  }

  const tasks = readTasks();
  const updatedTasks = tasks.filter((task) => task.id !== taskId);

  if (updatedTasks.length === tasks.length) {
    console.error(`Task with ID ${taskId} not found`);
    return;
  }

  writeTasks(updatedTasks);
  console.log(`Task ${taskId} deleted sucessfully.`);
}

function updateTask(idStr, newDescription) {
  if (!idStr || !newDescription || newDescription.trim() === "") {
    console.error("Error: Missing task ID or new description");
    return;
  }

  const taskId = parseInt(idStr, 10);
  if (isNaN(taskId)) {
    console.error("Error: Task ID must be a numebr.");
    return;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    console.error(`Task with ID ${taskID} not found.`);
    return;
  }

  tasks[taskIndex].description = newDescription;
  tasks[taskIndex].updatedAt = new Date().toISOString();

  writeTasks(tasks);
  console.log(`task ${taskId} updated sucessfully`);
}

function changeTaskStatus(idStr, status) {
  if (!idStr) {
    console.error(`Error: Missing task ID for marking as '${status}`);
    return;
  }

  const taskId = parseInt(idStr, 10);
  if (isNaN(taskId)) {
    console.error("Error: Task ID must be a number");
    return;
  }

  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    console.error(`Task with ID ${taskId} NOT FOUND.`);
    return;
  }

  tasks[taskIndex].status = status;
  tasks[taskIndex].updatedAt = new Date().toISOString();

  writeTasks(tasks);
  console.log(`Task ${taskId} marked as '${status}'`);
}

function markDone(idStr) {
  changeTaskStatus(idStr, "done");
}

function markInProgress(idStr) {
  changeTaskStatus(idStr, "in-progress");
}

function listTasks(statusFilter) {
  const tasks = readTasks();
  let filtered = tasks;

  const validStatuses = ["todo", "in-progress", "done"];
  if (statudFilter) {
    if (!validStatuses.includes(statusFilter)) {
      console.error(
        `Invalid status '${statusFilter}' . use one of: ${validStatuses.join(
          ", "
        )}`
      );
      return;
    }
    filtered = tasks.filter((task) => task.status === statusFilter);
  }
}

const [, , command, ...args] = process.argv;
if (!command) {
  console.log("please provide a command (eg. add, list)");
  process.exit(0);
}
switch (command) {
  case "add":
    addTask(args[0]);
    break;
  case "list":
    listTask();
    break;
  case "delete":
    deleteTask(args[0]);
    break;
  case "update":
    updateTask(args[0], args[1]);
    break;
  case "mark-done":
    markDone(args[0]);
    break;
  case "mark-in-progress":
    markInProgress(args[0]);
    break;
  default:
    console.log(`Unknown command ${command}`);
    break;
}

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
    console.log("Listing tasks...");
    break;
  default:
    console.log(`Unknown command ${command}`);
    break;
}

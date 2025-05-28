const fs = require('fs')
const path = require('path')

const TASKS_FILE_PATH = path.join(process.cwd(), 'tasks.json')

const readTasks = () => {
  if(!fs.existsSync(TASKS_FILE_PATH)){
    fs.writeFileSync(TASKS_FILE_PATH, JSON.stringify([], null, 2), 'utf8')
    return []
  }
  const data = fs.readFileSync(TASKS_FILE_PATH, 'utf8')
  return JSON.parse(data)
}

const writeTasks = (tasks) => {
  fs.writeFileSync(TASK_FILE_PATH, JSON.stringify(tasks, null, 2), 'utf8')
}
const tasks = readTasks()
console.log('Task:', tasks);

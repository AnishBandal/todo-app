class Tasks {
    constructor(id, description, status = "pending") {
      this.id = id;
      this.description = description;
      this.status = status;
    }
  
    updateStatus(isChecked) {
      this.status = isChecked ? "completed" : "pending";
      console.log(`${this.description} is ${this.status}`);
    }
  }

let tasksArr = [];

// Load tasks from local storage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasksArr = JSON.parse(storedTasks).map(
      (task) => new Tasks(task.id, task.description, task.status)
    );
  }
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

const displayTask = document.getElementById("displayTask");

function addTask() {
  let task = document.getElementById("taskDescription").value;
  if (task == "") {
    alert("Task is Empty!");
  } else {
    let index = 1;
    if (tasksArr && tasksArr.length > 0) {
      index = tasksArr[tasksArr.length - 1].id + 1;
    }
    task = sanitize(task);
    console.log(task);
    tasksArr.push(new Tasks(index, task));
    refreshData();
    document.getElementById("taskDescription").value = "";
  }
}

const createTaskHTML = (task) => `
<div class="task-card ${task.status}">             
  <div class="checkbox-wrapper-46">             
    <input             
      type="checkbox"              
      id="cbx-${task.id}"   
      id="cbx=46"         
      class="inp-cbx"              
      ${task.status === "completed" ? "checked" : ""}
      onchange="toogleStatus(${task.id}, this.checked)"               
    />              
    <label for="cbx-${task.id}" class="cbx">            
      <span>            
        <svg viewBox="0 0 12 10" height="10px" width="12px">              
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>              
        </svg>              
      </span>
      <span>    
        <h4>${task.description}</h4>            
      </span>              
    </label>            
  </div>     

  <button onclick="deleteTask(${task.id})" class="tooltip">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
    <path fill="#6361D9" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" clip-rule="evenodd" fill-rule="evenodd"></path>
  </svg>            
    <span class="tooltiptext">Delete</span>              
  </button>             
</div>`;

function displayTasks() {
  let htmlContent = "";

  const pendingTask = tasksArr.filter((task) => task.status == "pending");
  const completedTask = tasksArr.filter((task) => task.status == "completed");

  if (tasksArr.length === 0) {
    htmlContent = `<h3>No Tasks available</h3>`;
  }
  if (pendingTask.length > 0) {
    htmlContent += "<h3>Pending Tasks</h3>";
    pendingTask.forEach((task) => {
      htmlContent += createTaskHTML(task);
    });
  }

  if (completedTask.length > 0) {
    htmlContent += "<h3>Completed Tasks</h3>";
    completedTask.forEach((task) => {
      htmlContent += createTaskHTML(task);
    });
  }

  displayTask.innerHTML = htmlContent;
}

function displayFilteredTasks(filteredArr){
  let htmlContent = "";

  if (filteredArr.length === 0) {
    htmlContent = `<h3>No Tasks available</h3>`;
  }

  if(filteredArr.length > 0){
    htmlContent += "<h3>Filtered Tasks"
    filteredArr.forEach(task => {
      htmlContent += createTaskHTML(task);
    })
  }
  displayTask.innerHTML = htmlContent;
}



function deleteTask(index) {
  console.log("Deleting Task ID:", index);
  tasksArr = tasksArr.filter((task) => task.id != index);
  refreshData();
}

function toogleStatus(tid, isChecked) {
  let task = tasksArr.find((task) => task.id == tid);
  if (task) task.updateStatus(isChecked);
  refreshData();
}

function sanitize(string) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match) => map[match]);
}


function filterTasks(){
  let option = document.getElementById("filter").value;
  if(option == "allTasks"){
      console.log("all task")
      displayFilteredTasks(tasksArr);
  }
  if(option == "pendingTasks"){
      console.log("pending")
      const pendingTasks = tasksArr.filter((task) => task.status == "pending");
      displayFilteredTasks(pendingTasks);
  }
  if(option == "completedTasks"){
    console.log("completed")
      const completedTasks = tasksArr.filter((task) => task.status == "completed");
      displayFilteredTasks(completedTasks);
  }
}

function completeAllPendingTasks(){
  tasksArr.forEach((task) => task.status = "completed");
  refreshData();
}

function deleteAllCompletedTasks(){
  tasksArr = tasksArr.filter((task) => task.status == "pending");
  refreshData();
}

function updateStats() {
  let totalTaskSpan = document.getElementById("totalTaskCount");
  let pendingTaskSpan = document.getElementById("pendingTaskCount");
  let completedTaskSpan = document.getElementById("completedTaskCount");
  let completionPercentageSpan = document.getElementById("completionPercentage"); 

  let totalTasks = tasksArr.length;
  let pendingTasks = tasksArr.filter(task => task.status === "pending").length;
  let completedTasks = tasksArr.filter(task => task.status === "completed").length;
  let completionPercentage = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  totalTaskSpan.innerText = totalTasks;
  pendingTaskSpan.innerText = pendingTasks;
  completedTaskSpan.innerText = completedTasks;
  completionPercentageSpan.innerText = `${completionPercentage}%`; 
}



// Initialize the task list on page load
loadTasks();
refreshData();

function refreshData(){
    saveTasks();
    displayTasks();
    updateStats();    
}



const tasksButton = document.getElementById('tasksButton');
const tasksMenu = document.getElementById('tasksMenu');

// Toggle dropdown visibility
tasksButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    const isMenuVisible = tasksMenu.style.display === 'block';
    tasksMenu.style.display = isMenuVisible ? 'none' : 'block';
});

// Hide dropdown if clicking outside
document.addEventListener('click', (e) => {
    if (!tasksMenu.contains(e.target) && e.target !== tasksButton) {
        tasksMenu.style.display = 'none';
    }
});

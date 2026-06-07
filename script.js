let taskContainer = document.querySelector(".task-list")
let userInput = document.querySelector(".user-input")
let searchBox = document.querySelector(".search-box")
let addButton = document.querySelector(".add-button")
let searchbtn = document.querySelector(".search-btn")
let counter = document.querySelector(".counter")
let clearAll = document.querySelector(".clear")
let clearCom = document.querySelector(".clear-com")

userInput.focus()

let taskData = JSON.parse(localStorage.getItem("taskData")) || []

// debounce funtion
function debounce(fn, delay) {
    let timer
    return function (...args) {
        clearTimeout(timer)

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

// using local storage
function localSave() {
    localStorage.setItem("taskData", JSON.stringify(taskData));
}

// addition func
searchbtn.addEventListener('click', () => {
    searchBox.focus()
})

// counter
let countSpan = document.querySelector(".counter span")

let completed = taskData.filter(t => t.done).length
let total = taskData.length

countSpan.innerText = `${completed}/${total}`

// clear all
clearAll.addEventListener("click", () => {
    taskData = []
    render(taskData)
    localSave()
})

// clear completed task
clearCom.addEventListener('click', () => {
    taskData = taskData.filter(t => !t.done)
    render(taskData)
    localSave()
})

// first i saveing user data in array
addButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (userInput.value == "") {
        userInput.focus()
    }
    if (userInput.value != "") {
        e.preventDefault()
        taskData.push({
            value: userInput.value,
            done: false
        })
        render(taskData)
        localSave()
        userInput.value = ""
    }
})

// in render i am making new array with user data array (by map) then render in main task box 
function render(dataArray) {
    taskContainer.innerHTML = dataArray.map((t, i) => `
        <div class="task">
                    <div class="left">
                        <input type="checkbox" class="checkbox" data-id="${i}" ${t.done ? "checked" : ""}>
                        <p class="text" style = "${t.done ? "text-decoration: line-through;" : ""}">
                            ${t.value}
                        </p>
                    </div>
                    <div class="right">
                        <button class="delete" data-id="${i}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <div class="edit" data-id ="${i}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </div>
                    </div>
                </div>
        `).join("")
}

// to make delete funtion we need to call main outer permanent parent so it call new coming elemet 
taskContainer.addEventListener("click", (e) => {
    let delButton = e.target.closest(".delete")
    let checkbox = e.target.closest(".checkbox")
    let editButton = e.target.closest(".edit")
    if (delButton) {
        deleteFunction(delButton)
    }
    if (checkbox) {
        checkboxFunction(checkbox)
    }
    if (editButton) {
        editFunction(editButton)
    }
})

// remove taskData object by index
function deleteFunction(delButton) {
    let index = delButton.dataset.id
    taskData.splice(index, 1)
    render(taskData)
    localSave()
}

//  for check box we make fuciton by ternary operator this only give boolen value to checkbox
function checkboxFunction(checkbox) {
    let index = checkbox.dataset.id
    taskData[index].done = checkbox.checked
    render(taskData)
    localSave()
}

//i make edite function by adding html code of input then pass value from taskData by index
// then select task with edite then select text take index
function editFunction(editButton) {
    let index = editButton.dataset.id
    let task = editButton.closest('.task')
    let inputText = task.querySelector('.text')

    // for user inter face and input value remove after click enter
    inputText.innerHTML = `<input type="text" class="edit-Text" name="text" value="${taskData[index].value}">`

    let newInput = task.querySelector(".edit-Text")
    newInput.focus()
    newInput.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            taskData[index].value = newInput.value
            render(taskData)
            localSave()
        }
    })
}

// making search function by filter data from taskdata than render

let search = debounce(() => {
    console.log("hitesh")
    let searchText = searchBox.value.toLowerCase()
    let filterData = taskData.filter(t => t.value.toLowerCase().includes(searchText))
    render(filterData)

}, 2000)

searchBox.addEventListener("input", search)

render(taskData)
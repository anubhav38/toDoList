// Task list item is the main format for handling a task item

class task_list_item {
    /**
     * 
     * @param {string} type 
     * @param {string} statement 
     * @param {string} id 
     */
    
    constructor(type, statement, id) {
      this._type = type;
      this._statement = statement;
      this._id = id;
    }

    get type() {
      return this._type;
    }

    get statement() {
      return this._statement;
    }

    get id() {
        return this._id;
    }

    set type(value) {
        if (typeof value !== 'string') {
          throw new Error("Type must be a string.");
        }
        this._type = value;
      }

    set statement(value) {
      if (typeof value !== 'string') {
        throw new Error("Statement must be a string.");
      }
      this._statement = value;
    }
}


//An array 
task_item_counter = localStorage.length;
const task_item_id_set = localStorage;

/**
 * creates unique task ids
 * @returns {string}
 */
function create_task_id(){
    task_item_counter++;
    while (task_item_id_set.getItem("task_"+task_item_counter) != null){
        task_item_counter++;
    }
    return "task_"+task_item_counter;
}

/**
 * permanently deletes the entry from local storage
 * @param {string} task_id 
 */
function delete_task_id(task_id){
    task_item_id_set.removeItem(task_id);
}

/**
 * add a ~ symbol to entires so it is ignored by fetch tasks
 * @param {string} task_id 
 */
function remove_task_id(task_id){
    localStorage.setItem(task_id, "~"+localStorage.getItem(task_id));
}

/**
 * adds a new item to the list
 * @param {task_list_item} task_item 
 * @param {string} id 
 * @returns {Number}
 */
function add_list_item(task_item){
    
    if (document.getElementById("task_list_empty_item") != null && 
        document.getElementById("task_list_empty_item").style.display != "none"){
        document.getElementById("task_list_empty_item").style.display = "none";
    }

    let task_type = task_item.type;
    let task_statement = task_item.statement;
    let task_id = task_item.id;

    // GET THE CONTAINER
    container_id = "";

    if (task_type == "complete"){
        container_id = "completed_task_list_container";
    }
    else if (task_type == "pending"){
        container_id = "pending_task_list_container";
    }
    else if (task_type == "~complete" || task_type == "~pending"){
        return;
    }
    else{
        console.error("type_task argument invalid");
    }

    if (task_statement == ""){
        console.log("empty");        
        return;
    }

    const list_container = document.getElementById(container_id);

    // CREATE WIDGETS 
    const list_item = document.createElement('div');
    list_item.className = "task_list_item";
    list_item.id = task_id;

    const button_1 = document.createElement('button');
    list_item.appendChild(button_1);
    
    // ADD EVENT LISTENER TO THE BUTTON
    button_1.addEventListener('click', () => {
        const current_item = button_1.parentElement;

        const current_item_container = current_item.parentElement;

        if (current_item_container.id == "completed_task_list_container"){
            document.getElementById("pending_task_list_container").append(current_item);
            store_change_type(current_item.id, "pending");
        }
        else{
            document.getElementById("completed_task_list_container").append(current_item);
            store_change_type(current_item.id, "complete");
        }

        
    });

    const task_p = document.createElement('p');
    task_p.innerHTML = task_statement;
    list_item.appendChild(task_p);

    const button_2 = document.createElement('button');
    list_item.appendChild(button_2);

    button_2.addEventListener('click', () => {
        const current_item = button_1.parentElement;

        const current_item_container = current_item.parentElement;

        remove_list_item(current_item.id);
        remove_task_id(current_item.id);
    });

    //APPEND THE LIST ITEM
    list_container.appendChild(list_item);

}

/**
 * removes items from the page using the id
 * @param {string} task_id 
*/
function remove_list_item(task_id){
    document.getElementById(task_id).remove();
}

/**
 * event listener for the task_add_button
 */
function task_add_button_func(){
    const text_area = document.getElementById("task_input");
    task_text = text_area.value;
    
    task_item = new task_list_item("pending", task_text, create_task_id());

    add_list_item(task_item);
    store_add_task(task_item);
    
    text_area.value = "";
}

/**
 * collapse or expand the containers
 * @param {string} list_type 
 */
function collapse_task_list_container(list_type){

    container_id = "";
    button_id = "";

    if (list_type == "complete"){
        container_id = "completed_task_list_container";
        button_id = "complete_toggle";
    }
    else if (list_type == "pending"){
        container_id = "pending_task_list_container";
        button_id = "pending_toggle";
    }
    else{
        console.error("list_type argument invalid");
    }

    const list_container = document.getElementById(container_id);
    const toggle_button = document.getElementById(button_id);

    if (list_container.className != "task_list_container_collapsed"){
        list_container.className = "task_list_container_collapsed";
        toggle_button.style.transform = "rotate(180deg)";
    }
    else{
        list_container.className = "task_list_container";
        toggle_button.style.transform = "none";
    }

}

/**
 * encodes statement to be stored in the local storage
 * @param {string} type 
 * @param {string} statement 
 * @returns string
 */
function task_encode(type, statement){
    data = `${type}|${statement}`;
    return data;
}

/**
 * decodes a string into the type and statement
 * @param {string} task_string 
 * @returns Object
 */
function task_decode(task_string){
    split_index = task_string.indexOf("|");
    type = task_string.slice(0,split_index);
    statement = task_string.slice(split_index+1, task_string.length);
    return {type, statement};
}

/**
 * stores the task in local storage
 * @param {task_list_item} task_object 
 */
function store_add_task(task_item){
    localStorage.setItem(task_item.id, task_encode(task_item.type, task_item.statement));
}

/**
 * deletes task from local storage
 * @param {task_list_item} task_item 
 */
function store_delete_task(task_item){
    localStorage.removeItem(task_item.id);
}

/**
 * 
 * @param {string} task_id 
 * @param {string} task_type 
 */
function store_change_type(task_id, task_type){
    task_string = localStorage.getItem(task_id);
    split_index = task_string.indexOf("|");
    localStorage.setItem(task_id, task_encode(task_type, task_string.slice(split_index+1, task_string.length)));
}

/**
 * 
 * @returns {Array<task_list_item>}
 */
function fetch_tasks(){
    //ACTUAL FUNCTIONALITY WILL BE ADDED LATER
    const task_item_list = [];

    for (i=0; i<localStorage.length; i++){
        encodedString = localStorage.getItem(localStorage.key(i));
        const task_data = task_decode(encodedString);
        const temp = new task_list_item(task_data["type"], task_data["statement"], localStorage.key(i));
        
        if (temp.type == "complete" || temp.type == "pending"){
            task_item_list.push(temp);
        }
    }

    return task_item_list;
}



const task_add_button = document.getElementById("task_add_button");
const task_input = document.getElementById("task_input");

//LINKING THE EVENT LISTENER TO THE TASK ADD BUTTON
task_add_button.addEventListener("click", task_add_button_func);

//ADDING THE SAME FUNCTIONALITY TO ENTER BUTTON PRESSED EVENT FOR CONVINIENCE 
task_input.addEventListener("keypress", (e)=> {
    if (e.key == "Enter") {
        console.log("pressed\n");
        
        task_add_button_func();
        
        if(e.preventDefault) {
            e.preventDefault();
        }
        console.log("cleared\n");
    }
});


const task_data = fetch_tasks();
task_data.sort((a,b) => (a.id > b.id) ? 1 : (a.id < b.id) ? -1 : 0);

if (task_data.length == 0){
    const empty_div = document.createElement("div");
    empty_div.className = "task_list_empty";
    empty_div.id = "task_list_empty_item";

    const p = document.createElement("p");
    p.innerHTML = "Add a few tasks to begin";
    empty_div.appendChild(p);
    document.getElementById("pending_task_list_container").appendChild(empty_div);

}

for (i = 0; i< task_data.length; i++){
    add_list_item(task_data[i]);
}



document.getElementById("pending_toggle").addEventListener("click", ()=>{
    collapse_task_list_container("pending");
})

document.getElementById("complete_toggle").addEventListener("click", ()=>{
    collapse_task_list_container("complete");
})

const month_map = new Map();
month_map.set(1, "January");
month_map.set(2, "February");
month_map.set(3, "March");
month_map.set(4, "April");
month_map.set(5, "May");
month_map.set(6, "June");
month_map.set(7, "July");
month_map.set(8, "August");
month_map.set(9, "September");
month_map.set(10, "October");
month_map.set(11, "November");
month_map.set(12, "December");

const date_label = document.getElementById("date_label");
const currentDate = new Date();

let date_string = currentDate.getDate().toString();
let date_last_digit = date_string[date_string.length-1 ];
let date_suffix = "";

switch (date_last_digit) {
    case '0':
        date_suffix = "th";
        break;
    case '1':
        date_suffix = "st";
        break;
    case '2':
        date_suffix = "nd";
        break;
    case '3':
        date_suffix = "rd";
        break;
    case '4':
        date_suffix = "th";
        break;
    case '5':
        date_suffix = "th";
        break;
    case '6':
        date_suffix = "th";
        break;
    case '7':
        date_suffix = "th";
        break;
    case '8':
        date_suffix = "th";
        break;
    case '9':
        date_suffix = "th";
        break;
    default:
        break;
}

date_label.innerHTML = 
    currentDate.getDate()+
    date_suffix+" "+
    month_map.get(currentDate.getMonth()+1)+
    "'"+
    currentDate.getFullYear().toString().slice(2,4);


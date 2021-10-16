let isUpdate = false;
let employeePayrollObject = {};

window.addEventListener('DOMContentLoaded', (event) => {

    const button = document.querySelector(".submitButton");
    button.disabled = true;

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });

    checkForUpdate();

    const name = document.querySelector('#name');
    const textError = document.querySelector('.name-text-error');

    name.addEventListener('input', function() {
        if (name.value.length == 0) {
            textError.textContent = "Name Invalid";
            return;
        }
        try {

            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        } catch (e) {
            textError.textContent = e;
            var pointer = document.getElementById("name");
            pointer.scrollIntoView({ block: 'end', behavior: 'smooth' });
        }
    });

    const startDate = document.querySelector(".date-selector");
    const dateError = document.querySelector('.date-text-error');

    startDate.addEventListener('input', function() {
        if (getInputValueById("#year") == "" || getInputValueById("#month") == "" || getInputValueById("#day") == "") {
            dateError.textContent = "Date Invalid";

        } else {

            let dateString = getInputValueById("#year") + "-" + getInputValueById("#month") + "-" + getInputValueById("#day");
            try {
                let employeePayrollData = new EmployeePayrollData();
                employeePayrollData.startDate = new Date(Date.parse(dateString));
                dateError.textContent = "";
                button.disabled = false;

            } catch (e) {
                dateError.textContent = e;
            }
        }
    });
});

const save = () => {
    let employeePayrollData;
    try {
        employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
    } catch (e) {
        return;
    }
}

function createAndUpdateStorage(employeePayrollData) {

    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData]
    }
    alert(employeePayrollData.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    resetForm();
}

const createEmployeePayroll = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    let employeePayrollData = new EmployeePayrollData();
    if (employeePayrollList == null) {
        employeePayrollData.id = 0;
    } else {
        employeePayrollData.id = employeePayrollList.length;
    }

    employeePayrollData.name = getInputValueById('#name');
    employeePayrollData.profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData.gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData.department = getSelectedValues('[id=department]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    let year = getInputValueById('#year');
    let month = parseInt(getInputValueById('#month')) - 1;
    let day = getInputValueById('#day');
    employeePayrollData.startDate = (new Date(year, month, day));
    return employeePayrollData;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selectedItems = new Array();
    allItems.forEach(item => {
        if (item.checked)
            selectedItems.push(item.value);
    });
    return selectedItems;
}

const resetForm = () => {

    const button = document.querySelector(".submitButton");
    button.disabled = true;
    setValue('#name', '');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[id=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setValue('#day', '01');
    setValue('#month', '01');
    setValue('#year', '2021');
    const nameError = document.querySelector('.name-text-error')
    nameError.textContent = "";
    const dateError = document.querySelector('.date-text-error')
    dateError.textContent = "";
    setValue(".date-text-error", "");
    setTextValue('.salary-output', "400000");
    var pointer = document.getElementById("name");
    pointer.scrollIntoView({ block: 'end', behavior: 'smooth' });
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (query, value) => {
    const element = document.querySelector(query);
    element.textContent = value;
}

const setValue = (query, value) => {
    const element = document.querySelector(query);
    element.value = value;
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value === value)
            item.checked = true;
    });
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem("EditEmployeeList");
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObject = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObject._name);
    setSelectedValues('[name=profile]', employeePayrollObject._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObject._gender);
    setSelectedValues('[id=department]', employeePayrollObject._department);
    setValue('#salary', employeePayrollObject._salary);
    setTextValue('.salary-output', employeePayrollObject._salary);
    setValue('#notes', employeePayrollObject._note);
    let date = convertDate(employeePayrollObject._startDate);
    let editedDate = date.toLocaleString().split("/");
    setValue('#day', parseInt(editedDate[0]));
    setValue('#month', parseInt(editedDate[1]));
    setValue('#year', parseInt(editedDate[2]));
}

const convertDate = (date) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const newDate = !date ? "undefined" :
        new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
    return newDate;
}
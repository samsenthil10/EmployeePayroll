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

    document.querySelector(".cancelButton").href = site_properties.home_page;
    checkForUpdate();

    const name = document.querySelector('#name');
    const textError = document.querySelector('.name-text-error');

    name.addEventListener('input', function() {
        if (name.value.length == 0) {
            textError.textContent = "Name Invalid";
            return;
        }
        try {
            checkName(name.value);
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
                checkStartDate(new Date(Date.parse(dateString)));
                dateError.textContent = "";
                button.disabled = false;
            } catch (e) {
                dateError.textContent = e;
            }
        }
    });
});

const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setEmployeePayrollObject();
    createAndUpdateStorage();
    resetForm();
    window.location.replace('../pages/payroll_home.html');
}

const setEmployeePayrollObject = () => {

    if (!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObject.id = createNewEmployeeId();
    }
    employeePayrollObject._name = getInputValueById('#name');
    employeePayrollObject._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObject._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObject._department = getSelectedValues('[id=department]');
    employeePayrollObject._salary = getInputValueById('#salary');
    employeePayrollObject._note = getInputValueById('#notes');
    let year = getInputValueById('#year');
    let month = parseInt(getInputValueById('#month')) - 1;
    let day = getInputValueById('#day');
    employeePayrollObject._startDate = new Date(year, month, day);
}

function createAndUpdateStorage() {

    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    console.log(employeePayrollList);
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.
        find(employee => employee.id == employeePayrollObject.id);
        if (!empPayrollData)
            employeePayrollList.push(employeePayrollObject);
        else {
            const index = employeePayrollList.map(emp => emp.id)
                .indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObject);
        }
    } else {
        employeePayrollList = [employeePayrollObject];
    }
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    resetForm();
}

const createNewEmployeeId = () => {
    const employeeList = localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    let empID = employeeList.length;
    empID = empID + 1;
    return empID;
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
    setValue('#day', '1');
    setValue('#month', '1');
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
    const employeePayrollJson = localStorage.getItem("EditedEmployeeList");
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) {
        resetForm();
        return;
    };
    employeePayrollObject = JSON.parse(employeePayrollJson);
    setForm();
    localStorage.removeItem("EditedEmployeeList");
}

const setForm = () => {
    isUpdate = true;
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
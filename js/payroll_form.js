window.addEventListener('DOMContentLoaded', (event) => {

    const button = document.querySelector(".submitButton");
    button.disabled = true;

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });

    const name = document.querySelector('#name');
    const textError = document.querySelector('.name-text-error');

    name.addEventListener('input', function() {
        if (name.value.length == 0) {
            textError.textContent = "";
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
        const year = getInputValueById('#year');
        const month = parseInt(getInputValueById('#month'));
        const day = getInputValueById('#day');
        const dateString = year + "/" + month + "/" + day;
        try {
            let employeePayrollData = new EmployeePayrollData();
            employeePayrollData.startDate = dateString;
            dateError.textContent = "";
            button.disabled = false;

        } catch (e) {
            dateError.textContent = e;
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
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
    resetForm();
}

const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
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
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setValue('#day', '1');
    setValue('#month', 'January');
    setValue('#year', '2020');
    setValue(".name-text-error", "");
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
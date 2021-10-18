let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    if (site_properties.use_local_storage.match("true")) {
        getEmployeePayrollDataFromStorage();
    } else {
        getEmployeePayrollDataFromServer();
    }
});

const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
}

const getEmployeePayrollDataFromStorage = (key) => {
    empPayrollList = localStorage.getItem("EmployeePayrollList") ?
        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(data => {
            empPayrollList = JSON.parse(data);
            processEmployeePayrollDataResponse();
        }).catch(error => {
            console.log("GET Error Status: " + JSON.stringify(error));
            empPayrollList = [];
            processEmployeePayrollDataResponse();
        });
}

const createInnerHtml = () => {

    if (empPayrollList.length == 0)
        document.querySelector('#table-display').innerHTML = "";

    const headerHtml = "<tr><th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th></tr>";
    let innerHtml = `${headerHtml}`;
    for (const empPayrollData of empPayrollList) {
        const date = new Date(empPayrollData._startDate);
        const month = date.toLocaleString('default', { month: 'short' });
        let dateString = date.getDate() + " " + month + " " + date.getFullYear();
        innerHtml = `${innerHtml}
        <tr>
            <td><img class="profile"  src="${empPayrollData._profilePic}" alt=""></td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>${(getDeptHtml(empPayrollData._department))}</td>
            <td>₹ ${empPayrollData._salary}</td>
            <td>${dateString}</td>
            <td>
                <img name="${empPayrollData.id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
                <img name="${empPayrollData.id}" alt="edit" onclick="update(this)" src="../assets/icons/create-black-18dp.svg">
            </td>
        </tr>
        `;
    }
    document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`;
    }
    return deptHtml;
}

const remove = (node) => {
    deleteIndex = node.parentNode.parentNode.rowIndex;
    let empPayrollData = empPayrollList.find(employee => deleteIndex == employee.id);
    if (!empPayrollData) return;
    const index = empPayrollList.map(employee => employee.id)
        .indexOf(empPayrollData.id);
    empPayrollList.splice(index, 1);
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    createInnerHtml();
}

const update = (node) => {
    editIndex = node.parentNode.parentNode.rowIndex;
    let empPayrollData = empPayrollList.find(employee => editIndex == employee.id);
    if (!empPayrollData) return;
    localStorage.setItem("EditedEmployeeList", JSON.stringify(empPayrollData));
    window.location.replace('../pages/payroll_form.html');
}
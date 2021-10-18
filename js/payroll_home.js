let employeePayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    if (site_properties.use_local_storage.match("true")) {
        getEmployeePayrollDataFromStorage();
    } else {
        getEmployeePayrollDataFromServer();
    }
});

const processEmployeePayrollDataResponse = () => {
    document.querySelector(".emp-count").textContent = employeePayrollList.length;
    createInnerHtml();
}

const getEmployeePayrollDataFromStorage = (key) => {
    employeePayrollList = localStorage.getItem("EmployeePayrollList") ?
        JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(data => {
            employeePayrollList = JSON.parse(data);
            processEmployeePayrollDataResponse();
        }).catch(error => {
            console.log("GET Error Status: " + JSON.stringify(error));
            employeePayrollList = [];
            processEmployeePayrollDataResponse();
        });
}

const createInnerHtml = () => {

    if (employeePayrollList.length == 0)
        document.querySelector('#table-display').innerHTML = "";

    const headerHtml = "<tr><th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th></tr>";
    let innerHtml = `${headerHtml}`;
    for (const employeePayrollData of employeePayrollList) {
        const date = new Date(employeePayrollData._startDate);
        const month = date.toLocaleString('default', { month: 'short' });
        let dateString = date.getDate() + " " + month + " " + date.getFullYear();
        innerHtml = `${innerHtml}
        <tr>
            <td><img class="profile"  src="${employeePayrollData._profilePic}" alt=""></td>
            <td>${employeePayrollData._name}</td>
            <td>${employeePayrollData._gender}</td>
            <td>${(getDeptHtml(employeePayrollData._department))}</td>
            <td>₹ ${employeePayrollData._salary}</td>
            <td>${dateString}</td>
            <td>
                <img name="${employeePayrollData.id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
                <img name="${employeePayrollData.id}" alt="edit" onclick="update(this)" src="../assets/icons/create-black-18dp.svg">
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
    let employeePayrollData = employeePayrollList.find(employee => deleteIndex == employee.id);
    if (!employeePayrollData) return;
    const index = employeePayrollList.map(employee => employee.id)
        .indexOf(employeePayrollData.id);
    employeePayrollList.splice(index, 1);
    if (site_properties.use_local_storage.match("true")) {
        document.querySelector(".emp-count").textContent = employeePayrollList.length;
        localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
        createInnerHtml();
    } else {
        const deleteURL = site_properties.server_url + employeePayrollData.id.toString();
        makeServiceCall("DELETE", deleteURL, true)
            .then(data => {
                createInnerHtml();
            })
            .catch(error => {
                console.log("DELETE Error Status: " + JSON.stringify(error));
            });
    }
}

const update = (node) => {
    editIndex = node.parentNode.parentNode.rowIndex;
    let employeePayrollData = employeePayrollList.find(employee => editIndex == employee.id);
    if (!employeePayrollData) return;
    localStorage.setItem("EditedEmployeeList", JSON.stringify(employeePayrollData));
    window.location.replace('../pages/payroll_form.html');
}
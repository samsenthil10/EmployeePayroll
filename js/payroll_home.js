let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
    empPayrollList = getEmployeePayrollDataFromStorage();
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
});

const getEmployeePayrollDataFromStorage = () => {
    return localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
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
                <img name="${empPayrollData._id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
                <img name="${empPayrollData._id}" alt="edit" onclick="update(this)" src="../assets/icons/create-black-18dp.svg">
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
    deleteIndex = node.parentNode.parentNode.rowIndex - 1;
    let empPayrollData = empPayrollList.find(employee => deleteIndex == employee._id);
    if (!empPayrollData) return;
    const index = empPayrollList.map(employee => employee._id)
        .indexOf(empPayrollData._id);
    console.log(index);
    empPayrollList.splice(index, 1);
    var pointer = 0;
    empPayrollList.forEach(element => {
        element._id = pointer;
        pointer++;
    });

    document.querySelector(".emp-count").textContent = empPayrollList.length;
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    createInnerHtml();
}

const update = (node) => {
    editIndex = node.parentNode.parentNode.rowIndex - 1;
    let empPayrollData = empPayrollList.find(employee => editIndex == employee._id);
    if (!empPayrollData) return;
    localStorage.setItem("EditEmployeeList", JSON.stringify(empPayrollData));
    window.location.replace('../pages/payroll_form.html');
    remove(editIndex);
    empPayrollData = empPayrollList.find(employee => (empPayrollList.length) - 1 == employee._id)
    empPayrollData._id = editIndex;
}
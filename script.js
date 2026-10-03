// Get HTML elements

const employeeForm = document.getElementById("employeeForm");
const employeeTableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");

const totalEmployees = document.getElementById("totalEmployees");
const totalDepartments = document.getElementById("totalDepartments");
const averageSalary = document.getElementById("averageSalary");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Load employees from Local Storage

let employees = JSON.parse(localStorage.getItem("employees")) || [];

// Display employees when page loads

displayEmployees();
updateDashboard();


// Add / Update Employee

employeeForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const employeeId = document.getElementById("employeeId").value;

    const employeeData = {

        id: employeeId
            ? Number(employeeId)
            : Date.now(),

        name: document.getElementById("name").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        department: document.getElementById("department").value,

        position: document.getElementById("position").value.trim(),

        salary: Number(document.getElementById("salary").value),

        joiningDate: document.getElementById("joiningDate").value,

        status: document.getElementById("status").value
    };


    // Update employee

    if (employeeId) {

        employees = employees.map(function (employee) {

            if (employee.id === Number(employeeId)) {
                return employeeData;
            }

            return employee;
        });

        alert("Employee updated successfully!");

    }

    // Add employee

    else {

        employees.push(employeeData);

        alert("Employee added successfully!");
    }


    saveEmployees();

    displayEmployees();

    updateDashboard();

    resetForm();

});


// Display Employees

function displayEmployees(searchTerm = "") {

    employeeTableBody.innerHTML = "";

    const filteredEmployees = employees.filter(function (employee) {

        const search = searchTerm.toLowerCase();

        return (
            employee.name.toLowerCase().includes(search) ||
            employee.email.toLowerCase().includes(search) ||
            employee.department.toLowerCase().includes(search) ||
            employee.position.toLowerCase().includes(search)
        );

    });


    if (filteredEmployees.length === 0) {

        document.getElementById("noData").style.display = "block";

        return;

    } else {

        document.getElementById("noData").style.display = "none";

    }


    filteredEmployees.forEach(function (employee, index) {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${employee.name}</td>

            <td>${employee.email}</td>

            <td>${employee.phone}</td>

            <td>${employee.department}</td>

            <td>${employee.position}</td>

            <td>₹${employee.salary.toLocaleString("en-IN")}</td>

            <td>${employee.joiningDate}</td>

            <td>
                <span class="status ${
                    employee.status === "Active"
                    ? "active"
                    : "inactive"
                }">
                    ${employee.status}
                </span>
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editEmployee(${employee.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteEmployee(${employee.id})">
                    Delete
                </button>

            </td>
        `;

        employeeTableBody.appendChild(row);

    });

}


// Edit Employee

function editEmployee(id) {

    const employee = employees.find(function (employee) {

        return employee.id === id;

    });


    if (!employee) {
        return;
    }


    document.getElementById("employeeId").value = employee.id;

    document.getElementById("name").value = employee.name;

    document.getElementById("email").value = employee.email;

    document.getElementById("phone").value = employee.phone;

    document.getElementById("department").value = employee.department;

    document.getElementById("position").value = employee.position;

    document.getElementById("salary").value = employee.salary;

    document.getElementById("joiningDate").value = employee.joiningDate;

    document.getElementById("status").value = employee.status;


    formTitle.textContent = "Update Employee";

    submitBtn.textContent = "Update Employee";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete Employee

function deleteEmployee(id) {

    const employee = employees.find(function (employee) {

        return employee.id === id;

    });


    if (!employee) {
        return;
    }


    const confirmDelete = confirm(
        `Are you sure you want to delete ${employee.name}?`
    );


    if (confirmDelete) {

        employees = employees.filter(function (employee) {

            return employee.id !== id;

        });


        saveEmployees();

        displayEmployees();

        updateDashboard();

        alert("Employee deleted successfully!");

    }

}


// Search

searchInput.addEventListener("input", function () {

    displayEmployees(searchInput.value);

});


// Dashboard Update

function updateDashboard() {

    // Total Employees

    totalEmployees.textContent = employees.length;


    // Departments

    const departments = new Set(
        employees.map(function (employee) {
            return employee.department;
        })
    );

    totalDepartments.textContent = departments.size;


    // Average Salary

    if (employees.length === 0) {

        averageSalary.textContent = "₹0";

    } else {

        const totalSalary = employees.reduce(
            function (total, employee) {
                return total + employee.salary;
            },
            0
        );

        const average = totalSalary / employees.length;

        averageSalary.textContent =
            "₹" + Math.round(average).toLocaleString("en-IN");

    }

}


// Save data

function saveEmployees() {

    localStorage.setItem(
        "employees",
        JSON.stringify(employees)
    );

}


// Reset Form

function resetForm() {

    employeeForm.reset();

    document.getElementById("employeeId").value = "";

    formTitle.textContent = "Add Employee";

    submitBtn.textContent = "Add Employee";

}


// Cancel Button

cancelBtn.addEventListener("click", function () {

    resetForm();

});
// Modal functionality for Add Appointment
const addModal = document.getElementById('addAppointmentModal');
const addBtn = document.querySelector('.add-btn');
const addCloseBtn = addModal.querySelector('.close-btn');
const appointmentForm = document.getElementById('appointmentForm');

// Modal functionality for Edit Appointment
const editModal = document.getElementById('editAppointmentModal');
const editCloseBtn = editModal.querySelector('.close-btn');
const editAppointmentForm = document.getElementById('editAppointmentForm');

// Modal functionality for Cancel Confirmation
const cancelModal = document.getElementById('cancelAppointmentModal');
const cancelCloseBtn = cancelModal.querySelector('.close-btn');
const confirmCancelBtn = document.getElementById('confirmCancelBtn');
const closeCancelModalBtn = document.getElementById('closeCancelModalBtn');
const cancelPatientNameSpan = document.getElementById('cancelPatientName');

addBtn.addEventListener('click', function() {
    addModal.style.display = 'flex';
});

addCloseBtn.addEventListener('click', function() {
    addModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === addModal) {
        addModal.style.display = 'none';
    } else if (event.target === editModal) {
        editModal.style.display = 'none';
    } else if (event.target === cancelModal) {
        cancelModal.style.display = 'none';
    }
});

appointmentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const patientName = document.getElementById('patientName').value;
    const service = document.getElementById('service').value;
    const schedule = document.getElementById('schedule').value;

    const tableBody = document.querySelector('#appointments-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><span class="patient-icon">${patientName.charAt(0)}</span> ${patientName}</td>
        <td>${service}</td>
        <td>${new Date(schedule).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
        <td>
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn cancel-btn">Cancel</button>
            <button class="action-btn done-btn">Done</button>
        </td>
    `;
    tableBody.appendChild(newRow);

    attachEventListenersToRow(newRow, patientName);
    appointmentForm.reset();
    addModal.style.display = 'none';
});

// Function to attach event listeners to a row
function attachEventListenersToRow(row, patientName) {
    const editBtn = row.querySelector('.edit-btn');
    const cancelBtn = row.querySelector('.cancel-btn');
    const doneBtn = row.querySelector('.done-btn');

    editBtn.addEventListener('click', function() {
        const scheduleCell = row.querySelector('td:nth-child(3)');
        const currentSchedule = scheduleCell.textContent.trim();
        const date = new Date(currentSchedule);
        const formattedDate = date.toISOString().slice(0, 16);
        document.getElementById('editSchedule').value = formattedDate;
        editModal.style.display = 'flex';
        editAppointmentForm.dataset.row = row.rowIndex;
    });

    cancelBtn.addEventListener('click', function() {
        cancelPatientNameSpan.textContent = patientName;
        cancelModal.style.display = 'flex';
        cancelModal.dataset.row = row.rowIndex;
    });

    doneBtn.addEventListener('click', function() {
        const doneTableBody = document.querySelector('#done-appointments-table tbody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><span class="patient-icon">${patientName.charAt(0)}</span> ${patientName}</td>
            <td>${row.cells[1].textContent}</td>
            <td>${row.cells[2].textContent}</td>
        `;
        doneTableBody.appendChild(newRow);
        row.remove();
    });
}

// Attach event listeners to existing rows
document.querySelectorAll('#appointments-table tbody tr').forEach(row => {
    const patientName = row.querySelector('td:first-child').textContent.trim();
    attachEventListenersToRow(row, patientName);
});

// Edit Appointment Modal
editCloseBtn.addEventListener('click', function() {
    editModal.style.display = 'none';
});

editAppointmentForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newSchedule = document.getElementById('editSchedule').value;
    const rowIndex = this.dataset.row;
    const row = document.querySelector(`#appointments-table tbody tr:nth-child(${rowIndex})`);
    const scheduleCell = row.querySelector('td:nth-child(3)');
    scheduleCell.textContent = new Date(newSchedule).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    editModal.style.display = 'none';
});

// Cancel Appointment Modal
cancelCloseBtn.addEventListener('click', function() {
    cancelModal.style.display = 'none';
});

closeCancelModalBtn.addEventListener('click', function() {
    cancelModal.style.display = 'none';
});

confirmCancelBtn.addEventListener('click', function() {
    const rowIndex = cancelModal.dataset.row;
    const row = document.querySelector(`#appointments-table tbody tr:nth-child(${rowIndex})`);
    const patientName = row.querySelector('td:first-child').textContent.trim();
    const cancelledTableBody = document.querySelector('#cancelled-appointments-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><span class="patient-icon">${patientName.charAt(0)}</span> ${patientName}</td>
        <td>${row.cells[1].textContent}</td>
        <td>${row.cells[2].textContent}</td>
    `;
    cancelledTableBody.appendChild(newRow);
    row.remove();
    cancelModal.style.display = 'none';
});
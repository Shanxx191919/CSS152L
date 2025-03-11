// Sample patient data (mocked for pagination and search)
const patients = [
    { id: "1234567890", name: "John Doe", contact: "12345678" },
    { id: "2345678901", name: "Jane Smith", contact: "87654321" },
    { id: "3456789012", name: "Emily Johnson", contact: "11223344" },
    { id: "4567890123", name: "Michael Brown", contact: "44332211" },
    { id: "5678901234", name: "Sarah Davis", contact: "55667788" },
    { id: "6789012345", name: "David Wilson", contact: "99887766" },
    { id: "7890123456", name: "Laura Adams", contact: "66554433" },
    { id: "8901234567", name: "Chris Evans", contact: "33221100" },
    { id: "9012345678", name: "Anna Taylor", contact: "77889900" },
    { id: "0123456789", name: "Robert Lee", contact: "00112233" }
];

// Mock prescription data
const prescriptions = {
    "1234567890": [
        { drugName: "Sodium Divalproex", prescribedDate: "2024-06-10T09:41:00" },
        { drugName: "Olanzapine", prescribedDate: "2024-06-10T09:41:00" }
    ],
    "2345678901": [
        { drugName: "Aspirin", prescribedDate: "2024-06-11T10:00:00" }
    ]
};

// Mock appointment data (including status)
const appointments = {
    "1234567890": [
        { service: "General Medicine", schedule: "2024-06-10T09:41:00", status: "Completed" },
        { service: "Check-up", schedule: "2024-06-12T14:00:00", status: "Scheduled" }
    ],
    "2345678901": [
        { service: "Dental", schedule: "2024-06-11T11:00:00", status: "Completed" }
    ]
};

const rowsPerPage = 4;
let currentPage = 1;
const totalPages = Math.ceil(patients.length / rowsPerPage);

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const patientTableBody = document.querySelector('#patient-table tbody');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const patientDetailsModal = document.getElementById('patientDetailsModal');
const detailCloseBtn = patientDetailsModal.querySelector('.close-btn');
const detailPatientId = document.getElementById('detailPatientId');
const detailName = document.getElementById('detailName');
const detailContact = document.getElementById('detailContact');
const prescriptionHistoryBody = document.getElementById('prescriptionHistoryBody');
const appointmentsBody = document.getElementById('appointmentsBody');
const editInDetailsBtn = document.getElementById('editInDetailsBtn');
const deleteInDetailsBtn = document.getElementById('deleteInDetailsBtn');
const editPatientModal = document.getElementById('editPatientModal');
const editCloseBtn = editPatientModal.querySelector('.close-btn');
const editPatientForm = document.getElementById('editPatientForm');
const saveBtn = document.getElementById('saveBtn');
const patientRecordModal = document.getElementById('patientRecordModal');
const recordCloseBtn = document.getElementById('recordCloseBtn');
const recordPatientId = document.getElementById('recordPatientId');
const recordName = document.getElementById('recordName');
const recordContact = document.getElementById('recordContact');
const recordPrescriptionHistoryBody = document.getElementById('recordPrescriptionHistoryBody');
const recordAppointmentsBody = document.getElementById('recordAppointmentsBody');
const editInRecordBtn = document.getElementById('editInRecordBtn');
const deleteInRecordBtn = document.getElementById('deleteInRecordBtn');

// Initialize total pages
totalPagesSpan.textContent = totalPages;

// Function to render table rows
function renderTable(data, page) {
    patientTableBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="patient-id" data-id="${patient.id}">${patient.id}</td>
            <td class="patient-name" data-id="${patient.id}">${patient.name}</td>
            <td>${patient.contact}</td>
        `;
        patientTableBody.appendChild(row);
    });

    currentPageSpan.textContent = page;
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;

    // Re-attach event listeners to IDs, names, and select button
    document.querySelectorAll('.patient-id').forEach(id => {
        id.addEventListener('click', showPatientRecord);
    });
    document.querySelectorAll('.patient-name').forEach(name => {
        name.addEventListener('click', showPatientDetails);
    });
    document.querySelector('.select-btn button').addEventListener('click', showPatientDetailsFromSelect);
}

// Initial render
renderTable(patients, currentPage);

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.id.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable(filteredPatients, currentPage);
    totalPagesSpan.textContent = Math.ceil(filteredPatients.length / rowsPerPage);
});

// Clear search
clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    currentPage = 1;
    renderTable(patients, currentPage);
    totalPagesSpan.textContent = totalPages;
});

// Pagination controls
prevPageBtn.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderTable(patients, currentPage);
    }
});

nextPageBtn.addEventListener('click', function() {
    if (currentPage < totalPages) {
        currentPage++;
        renderTable(patients, currentPage);
    }
});

// Patient Details Modal (with Edit and Delete)
detailCloseBtn.addEventListener('click', function() {
    patientDetailsModal.style.display = 'none';
});

function showPatientDetails(event) {
    const patientId = event.target.dataset.id;
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        detailPatientId.textContent = patient.id;
        detailName.textContent = patient.name;
        detailContact.textContent = patient.contact;

        // Populate prescription history
        prescriptionHistoryBody.innerHTML = '';
        const patientPrescriptions = prescriptions[patientId] || [];
        patientPrescriptions.forEach(pres => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pres.drugName}</td>
                <td>${new Date(pres.prescribedDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            `;
            prescriptionHistoryBody.appendChild(row);
        });

        // Populate appointments
        appointmentsBody.innerHTML = '';
        const patientAppointments = appointments[patientId] || [];
        patientAppointments.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.service}</td>
                <td>${new Date(app.schedule).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td>${app.status}</td>
            `;
            appointmentsBody.appendChild(row);
        });

        patientDetailsModal.style.display = 'flex';
    }
}

function showPatientDetailsFromSelect() {
    const selectedRow = patientTableBody.querySelector('tr:hover');
    if (selectedRow) {
        const patientId = selectedRow.cells[0].textContent;
        showPatientDetails({ target: { dataset: { id: patientId } } });
    } else {
        alert('Please select a patient by hovering over a row.');
    }
}

// Edit Patient Modal
editInDetailsBtn.addEventListener('click', function() {
    const patientId = detailPatientId.textContent;
    const name = detailName.textContent;
    const contact = detailContact.textContent;

    document.getElementById('editPatientId').value = patientId;
    document.getElementById('editName').value = name;
    document.getElementById('editContact').value = contact;
    patientDetailsModal.style.display = 'none';
    editPatientModal.style.display = 'flex';
});

editInRecordBtn.addEventListener('click', function() {
    const patientId = recordPatientId.textContent;
    const name = recordName.textContent;
    const contact = recordContact.textContent;

    document.getElementById('editPatientId').value = patientId;
    document.getElementById('editName').value = name;
    document.getElementById('editContact').value = contact;
    patientRecordModal.style.display = 'none';
    editPatientModal.style.display = 'flex';
});

editCloseBtn.addEventListener('click', function() {
    editPatientModal.style.display = 'none';
});

editPatientForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const patientId = document.getElementById('editPatientId').value;
    const name = document.getElementById('editName').value;
    const contact = document.getElementById('editContact').value;

    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        patients[patientIndex] = { id: patientId, name, contact };
        renderTable(patients, currentPage);
        editPatientModal.style.display = 'none';
        // Optionally reopen the details modal with updated info
        showPatientDetails({ target: { dataset: { id: patientId } } });
    }
});

// Delete Patient from Details Modal
deleteInDetailsBtn.addEventListener('click', function() {
    const patientId = detailPatientId.textContent;
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        if (confirm(`Are you sure you want to delete the patient ${patients[patientIndex].name}?`)) {
            patients.splice(patientIndex, 1);
            renderTable(patients, currentPage);
            totalPagesSpan.textContent = Math.ceil(patients.length / rowsPerPage);
            patientDetailsModal.style.display = 'none';
        }
    }
});

// Delete Patient from Record Modal
deleteInRecordBtn.addEventListener('click', function() {
    const patientId = recordPatientId.textContent;
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex !== -1) {
        if (confirm(`Are you sure you want to delete the patient ${patients[patientIndex].name}?`)) {
            patients.splice(patientIndex, 1);
            renderTable(patients, currentPage);
            totalPagesSpan.textContent = Math.ceil(patients.length / rowsPerPage);
            patientRecordModal.style.display = 'none';
        }
    }
});

// Patient Record Modal (for Patient ID click)
recordCloseBtn.addEventListener('click', function() {
    patientRecordModal.style.display = 'none';
});

function showPatientRecord(event) {
    const patientId = event.target.dataset.id;
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        recordPatientId.textContent = patient.id;
        recordName.textContent = patient.name;
        recordContact.textContent = patient.contact;

        // Populate prescription history
        recordPrescriptionHistoryBody.innerHTML = '';
        const patientPrescriptions = prescriptions[patientId] || [];
        patientPrescriptions.forEach(pres => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pres.drugName}</td>
                <td>${new Date(pres.prescribedDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            `;
            recordPrescriptionHistoryBody.appendChild(row);
        });

        // Populate appointments
        recordAppointmentsBody.innerHTML = '';
        const patientAppointments = appointments[patientId] || [];
        patientAppointments.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.service}</td>
                <td>${new Date(app.schedule).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td>${app.status}</td>
            `;
            recordAppointmentsBody.appendChild(row);
        });

        patientRecordModal.style.display = 'flex';
    }
}
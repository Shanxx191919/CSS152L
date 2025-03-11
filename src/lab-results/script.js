// Sample lab results data
const labResults = [
    { id: "1234567890", name: "John Doe", testName: "Blood Glucose", testDate: "2024-06-10T09:41:00", result: "120 mg/dL" },
    { id: "1234567890", name: "John Doe", testName: "Cholesterol", testDate: "2024-06-10T09:41:00", result: "200 mg/dL" },
    { id: "2345678901", name: "Jane Smith", testName: "Hemoglobin", testDate: "2024-06-11T10:00:00", result: "13.5 g/dL" },
    { id: "3456789012", name: "Emily Johnson", testName: "Thyroid Function", testDate: "2024-06-12T11:00:00", result: "TSH 2.5 mIU/L" },
    { id: "4567890123", name: "Michael Brown", testName: "Blood Glucose", testDate: "2024-06-13T12:00:00", result: "110 mg/dL" },
    { id: "5678901234", name: "Sarah Davis", testName: "Cholesterol", testDate: "2024-06-14T13:00:00", result: "180 mg/dL" },
    { id: "6789012345", name: "David Wilson", testName: "Hemoglobin", testDate: "2024-06-15T14:00:00", result: "14.0 g/dL" },
    { id: "7890123456", name: "Laura Adams", testName: "Blood Glucose", testDate: "2024-06-16T15:00:00", result: "130 mg/dL" },
    { id: "8901234567", name: "Chris Evans", testName: "Thyroid Function", testDate: "2024-06-17T16:00:00", result: "TSH 3.0 mIU/L" },
    { id: "9012345678", name: "Anna Taylor", testName: "Cholesterol", testDate: "2024-06-18T17:00:00", result: "190 mg/dL" }
];

const rowsPerPage = 4;
let currentPage = 1;
const totalPages = Math.ceil(labResults.length / rowsPerPage);

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const labResultsTableBody = document.querySelector('#lab-results-table tbody');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const labResultDetailsModal = document.getElementById('labResultDetailsModal');
const labResultCloseBtn = document.getElementById('labResultCloseBtn');
const detailPatientId = document.getElementById('detailPatientId');
const detailName = document.getElementById('detailName');
const labResultsBody = document.getElementById('labResultsBody');

// Initialize total pages
totalPagesSpan.textContent = totalPages;

// Function to render table rows
function renderTable(data, page) {
    labResultsTableBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="patient-id" data-id="${result.id}">${result.id}</td>
            <td>${result.name}</td>
            <td>${result.testName}</td>
            <td>${new Date(result.testDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            <td>${result.result}</td>
        `;
        labResultsTableBody.appendChild(row);
    });

    currentPageSpan.textContent = page;
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;

    // Re-attach event listeners to Patient IDs
    document.querySelectorAll('.patient-id').forEach(id => {
        id.addEventListener('click', showLabResultDetails);
    });
}

// Initial render
renderTable(labResults, currentPage);

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredResults = labResults.filter(result =>
        result.name.toLowerCase().includes(searchTerm) ||
        result.id.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable(filteredResults, currentPage);
    totalPagesSpan.textContent = Math.ceil(filteredResults.length / rowsPerPage);
});

// Clear search
clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    currentPage = 1;
    renderTable(labResults, currentPage);
    totalPagesSpan.textContent = totalPages;
});

// Pagination controls
prevPageBtn.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderTable(labResults, currentPage);
    }
});

nextPageBtn.addEventListener('click', function() {
    if (currentPage < totalPages) {
        currentPage++;
        renderTable(labResults, currentPage);
    }
});

// Lab Result Details Modal
labResultCloseBtn.addEventListener('click', function() {
    labResultDetailsModal.style.display = 'none';
});

function showLabResultDetails(event) {
    const patientId = event.target.dataset.id;
    const patientResults = labResults.filter(result => result.id === patientId);
    if (patientResults.length > 0) {
        const patient = patientResults[0];
        detailPatientId.textContent = patient.id;
        detailName.textContent = patient.name;

        // Populate lab results
        labResultsBody.innerHTML = '';
        patientResults.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${result.testName}</td>
                <td>${new Date(result.testDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td>${result.result}</td>
            `;
            labResultsBody.appendChild(row);
        });

        labResultDetailsModal.style.display = 'flex';
    }
}
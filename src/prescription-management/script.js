// Modal functionality for Add Prescription
const addPrescriptionModal = document.getElementById('addPrescriptionModal');
const addPrescriptionBtn = document.querySelector('.add-btn');
const addPrescriptionCloseBtn = addPrescriptionModal.querySelector('.close-btn');
const prescriptionForm = document.getElementById('prescriptionForm');

addPrescriptionBtn.addEventListener('click', function() {
    addPrescriptionModal.style.display = 'flex';
});

addPrescriptionCloseBtn.addEventListener('click', function() {
    addPrescriptionModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === addPrescriptionModal) {
        addPrescriptionModal.style.display = 'none';
    }
});

prescriptionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const drugName = document.getElementById('drugName').value;
    const prescribedDate = document.getElementById('prescribedDate').value;

    const tableBody = document.querySelector('#prescription-table tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${drugName}</td>
        <td>${new Date(prescribedDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
    `;
    tableBody.appendChild(newRow);

    prescriptionForm.reset();
    addPrescriptionModal.style.display = 'none';
});
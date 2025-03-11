// Sample billing data
let billingData = [
    { id: "1234567890", name: "John Doe", insuranceCompany: "Blue Cross", paymentStatus: "Paid" },
    { id: "1234567890", name: "John Doe", insuranceCompany: "Blue Cross", paymentStatus: "Pending" },
    { id: "2345678901", name: "Jane Smith", insuranceCompany: "Aetna", paymentStatus: "Paid" },
    { id: "3456789012", name: "Emily Johnson", insuranceCompany: "Cigna", paymentStatus: "Pending" },
    { id: "4567890123", name: "Michael Brown", insuranceCompany: "UnitedHealthcare", paymentStatus: "Paid" },
    { id: "5678901234", name: "Sarah Davis", insuranceCompany: "Blue Cross", paymentStatus: "Pending" },
    { id: "6789012345", name: "David Wilson", insuranceCompany: "Aetna", paymentStatus: "Paid" },
    { id: "7890123456", name: "Laura Adams", insuranceCompany: "Cigna", paymentStatus: "Pending" },
    { id: "8901234567", name: "Chris Evans", insuranceCompany: "UnitedHealthcare", paymentStatus: "Paid" },
    { id: "9012345678", name: "Anna Taylor", insuranceCompany: "Blue Cross", paymentStatus: "Pending" }
];

const cardsPerPage = 4;
let currentPage = 1;
let currentData = billingData; // To handle filtered data for search

const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const billingCards = document.getElementById('billing-cards');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const billingDetailsModal = document.getElementById('billingDetailsModal');
const billingCloseBtn = document.getElementById('billingCloseBtn');
const detailPatientId = document.getElementById('detailPatientId');
const detailName = document.getElementById('detailName');
const billingDetailsBody = document.getElementById('billingDetailsBody');

// Function to calculate total pages
function updateTotalPages(data) {
    return Math.ceil(data.length / cardsPerPage);
}

// Function to render cards
function renderCards(data, page) {
    billingCards.innerHTML = '';
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const paginatedData = data.slice(start, end);

    paginatedData.forEach((bill, index) => {
        const globalIndex = start + index; // Index in the full dataset
        const card = document.createElement('div');
        card.className = 'billing-card';
        card.setAttribute('data-index', globalIndex); // Use index to track the entry in the dataset
        card.innerHTML = `
            <span class="patient-id">${bill.id}</span>
            <p><span>Name:</span> ${bill.name}</p>
            <p><span>Insurance:</span> ${bill.insuranceCompany}</p>
            <p class="status"><span>Status:</span> ${bill.paymentStatus}</p>
            <div class="card-actions">
                <button class="approve-btn">Approve</button>
                <button class="reject-btn">Reject</button>
            </div>
        `;
        billingCards.appendChild(card);
    });

    currentPageSpan.textContent = page;
    totalPagesSpan.textContent = updateTotalPages(data);
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === updateTotalPages(data);

    // Attach event listeners to the cards and buttons
    document.querySelectorAll('.billing-card').forEach(card => {
        card.addEventListener('click', showBillingDetails);
    });

    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', handleApprove);
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', handleReject);
    });
}

// Initial render
renderCards(billingData, currentPage);

// Search functionality
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    currentData = billingData.filter(bill =>
        bill.name.toLowerCase().includes(searchTerm) ||
        bill.id.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderCards(currentData, currentPage);
});

// Clear search
clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    currentData = billingData;
    currentPage = 1;
    renderCards(currentData, currentPage);
});

// Pagination controls
prevPageBtn.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        renderCards(currentData, currentPage);
    }
});

nextPageBtn.addEventListener('click', function() {
    if (currentPage < updateTotalPages(currentData)) {
        currentPage++;
        renderCards(currentData, currentPage);
    }
});

// Handle Approve button click
function handleApprove(event) {
    event.stopPropagation(); // Prevent modal from opening
    const card = event.target.closest('.billing-card');
    const index = parseInt(card.dataset.index);
    currentData[index].paymentStatus = 'Approved';
    billingData = billingData.map((bill, i) =>
        i === index ? { ...bill, paymentStatus: 'Approved' } : bill
    );
    renderCards(currentData, currentPage);
}

// Handle Reject button click
function handleReject(event) {
    event.stopPropagation(); // Prevent modal from opening
    const card = event.target.closest('.billing-card');
    const index = parseInt(card.dataset.index);
    currentData[index].paymentStatus = 'Rejected';
    billingData = billingData.map((bill, i) =>
        i === index ? { ...bill, paymentStatus: 'Rejected' } : bill
    );
    renderCards(currentData, currentPage);
}

// Billing Details Modal
billingCloseBtn.addEventListener('click', function() {
    billingDetailsModal.style.display = 'none';
});

function showBillingDetails(event) {
    const card = event.currentTarget;
    const index = parseInt(card.dataset.index);
    const patientId = currentData[index].id;
    const patientBills = billingData.filter(bill => bill.id === patientId);
    if (patientBills.length > 0) {
        const patient = patientBills[0];
        detailPatientId.textContent = patient.id;
        detailName.textContent = patient.name;

        // Populate billing details with updated status
        billingDetailsBody.innerHTML = '';
        patientBills.forEach(bill => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bill.insuranceCompany}</td>
                <td>${bill.paymentStatus}</td>
                <td>$500.00</td> <!-- Mock amount -->
                <td>${new Date().toLocaleString('en-US', { dateStyle: 'medium' })}</td> <!-- Mock date -->
            `;
            billingDetailsBody.appendChild(row);
        });

        billingDetailsModal.style.display = 'flex';
    }
}
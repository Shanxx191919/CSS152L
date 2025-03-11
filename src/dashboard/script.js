// Client ID and API key from Google Cloud Console
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '' // Will be set later
    });
    gisInited = true;
}

function initializeGapiClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
    }).then(() => {
        gapiInited = true;
        maybeEnableButtons();
    }).catch(error => console.error('Error initializing GAPI client:', error));
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        gapi.client.getToken() ? updateSigninStatus(gapi.client.getToken().access_token) : handleAuthClick();
    }
}

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error) {
            console.error('Authorization error:', resp.error);
            return;
        }
        updateSigninStatus(resp.access_token);
    };
    tokenClient.requestAccessToken({prompt: 'consent'});
}

function updateSigninStatus(accessToken) {
    if (accessToken) {
        loadCalendar();
    }
}

function loadCalendar() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(response => {
        const events = response.result.items;
        displaySchedule(events);
        displayAppointments(events);
    }).catch(error => console.error('Error loading calendar:', error));
}

function displaySchedule(events) {
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '<h3>Select date</h3>';
    if (events.length > 0) {
        events.forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.textContent = `${event.summary} (${new Date(event.start.dateTime || event.start.date).toLocaleString()})`;
            calendarDiv.appendChild(eventDiv);
        });
    } else {
        calendarDiv.innerHTML += '<p>No upcoming events found.</p>';
    }
}

function displayAppointments(events) {
    const appointmentsList = document.getElementById('appointments-list');
    appointmentsList.innerHTML = '';
    events.forEach(event => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const label = document.createElement('span');
        label.textContent = `${event.summary} (${new Date(event.start.dateTime || event.start.date).toLocaleString()})`;
        li.appendChild(checkbox);
        li.appendChild(label);
        appointmentsList.appendChild(li);
    });
}

document.querySelector('.print-btn').addEventListener('click', function() {
    const prescriptionText = document.querySelector('.prescription textarea').value;
    if (prescriptionText) {
        alert('Printing: ' + prescriptionText);
    } else {
        alert('Please type something to print.');
    }
});

// Load the Google API client and sign-in libraries
gapiLoaded();
gisLoaded();
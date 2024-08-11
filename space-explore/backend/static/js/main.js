function fetchNASAData() {
    fetch('/api/nasa')
        .then(response => response.json())
        .then(data => {
            document.getElementById('apod-image').src = data.url;
            document.getElementById('apod-title').innerText = data.title;
            document.getElementById('apod-description').innerText = data.explanation;
        });
}

function fetchSpaceXData() {
    fetch('/api/spacex')
        .then(response => response.json())
        .then(data => {
            document.getElementById('spacex-details').innerText = `
                Mission: ${data.mission_name}
                Rocket: ${data.rocket.rocket_name}
                Launch Date: ${new Date(data.launch_date_utc).toLocaleDateString()}
            `;
        });
}

function fetchISSLocation() {
    fetch('/api/iss-location')
        .then(response => response.json())
        .then(data => {
            document.getElementById('iss-lat').innerText = data.iss_position.latitude;
            document.getElementById('iss-lon').innerText = data.iss_position.longitude;
        });
}

function fetchN2YOData() {
    fetch('/api/n2yo')
        .then(response => response.json())
        .then(data => {
            document.getElementById('tle-data').innerText = data.tle;
        });
}

// Initial Fetch
fetchNASAData();
fetchSpaceXData();
fetchISSLocation();
fetchN2YOData();
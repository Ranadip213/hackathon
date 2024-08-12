document.addEventListener('DOMContentLoaded', function () {
    // Fetch NASA Data
    fetch('/api/nasa-data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('nasa-title').innerText = data.title;
            document.getElementById('nasa-explanation').innerText = data.explanation;
            const nasaUrl = document.getElementById('nasa-url');
            nasaUrl.href = data.url;
            nasaUrl.innerText = `View ${data.media_type === 'image' ? 'Image' : 'Video'}`;

            const nasaMediaContainer = document.getElementById('nasa-media-container');
            if (data.media_type === 'image') {
                nasaMediaContainer.innerHTML = `<img src="${data.url}" alt="${data.title}">`;
            } else if (data.media_type === 'video') {
                nasaMediaContainer.innerHTML = `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`;
            }
        })
        .catch(error => console.error('Error fetching NASA data:', error));

    // Fetch SpaceX Latest Launch Data
    fetch('/api/spacex-latest-launch')
        .then(response => response.json())
        .then(data => {
            document.getElementById('spacex-details').innerHTML = `
                <strong>Mission Name:</strong> ${data.name} <br>
                <strong>Launch Date:</strong> ${new Date(data.date_utc).toLocaleString()} <br>
                <strong>Rocket:</strong> ${data.rocket.name} <br>
                <strong>Details:</strong> ${data.details || 'No details available'}
            `;
        })
        .catch(error => console.error('Error fetching SpaceX data:', error));

    // Fetch N2YO TLE Data
    fetch('/api/n2yo-tle')
        .then(response => response.json())
        .then(data => {
            document.getElementById('n2yo-details').innerHTML = `
                <strong>Satellite Name:</strong> ${data.name} <br>
                <strong>TLE Lines:</strong> <pre>${data.tle}</pre>
            `;
        })
        .catch(error => console.error('Error fetching N2YO data:', error));

    // Fetch ISS Position Data
    fetch('/api/open-notify')
        .then(response => response.json())
        .then(data => {
            document.getElementById('iss-details').innerHTML = `
                <strong>ISS Position:</strong> <br>
                Latitude: ${data.iss_position.latitude} <br>
                Longitude: ${data.iss_position.longitude}
            `;
        })
        .catch(error => console.error('Error fetching ISS position data:', error));

    // Fetch SpaceX Rockets Data
    fetch('/api/spacex-rockets')
        .then(response => response.json())
        .then(rockets => {
            const rocketsContainer = document.getElementById('spacex-rockets').querySelector('div');
            rockets.forEach(rocket => {
                rocketsContainer.innerHTML += `
                    <div class="rocket">
                        <h3>${rocket.rocket_name}</h3>
                        <p><strong>Rocket ID:</strong> ${rocket.rocket_id}</p>
                        <p><strong>Type:</strong> ${rocket.rocket_type}</p>
                        <p><strong>Cost per Launch:</strong> $${rocket.cost_per_launch}</p>
                        <p><strong>Height:</strong> ${rocket.height.feet} ft (${rocket.height.meters} m)</p>
                        <p><strong>Diameter:</strong> ${rocket.diameter.feet} ft (${rocket.diameter.meters} m)</p>
                        <p><strong>Mass:</strong> ${rocket.mass.kg} kg (${rocket.mass.lb} lb)</p>
                        <p><strong>First Stage Engines:</strong> ${rocket.first_stage.engines}</p>
                        <p><strong>Second Stage Engines:</strong> ${rocket.second_stage.engines}</p>
                        <img src="${rocket.flickr_images[0]}" alt="${rocket.rocket_name}">
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error fetching SpaceX rockets data:', error));

    // Modal Handling
    const modal = document.getElementById('contact-modal');
    const contactLink = document.getElementById('contact-link');
    const closeButton = document.querySelector('.close-button');

    contactLink.addEventListener('click', function (event) {
        event.preventDefault();
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission (Optional: Replace with actual form submission logic)
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const question = document.getElementById('question').value;
        alert(`Email: ${email}\nQuestion: ${question}`);
        modal.style.display = 'none';
    });
});
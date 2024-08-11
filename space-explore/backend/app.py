from flask import Flask, jsonify, render_template, request
import requests

app = Flask(__name__)

# API URLs and Keys
NASA_API_KEY = 'mYSwbYavuxuQJXk3wi8zU2VXbPNJE97M9Q8xCnqz'
NASA_API_URL = f'https://api.nasa.gov/planetary/apod?api_key={NASA_API_KEY}'

SPACEX_API_URL = 'https://api.spacexdata.com/v3/launches/latest?pretty=true'

N2YO_API_KEY = '589P8Q-SDRYX8-L842ZD-5Z9'
N2YO_API_URL = f'https://api.n2yo.com/rest/v1/satellite/tle/25544&apiKey={N2YO_API_KEY}'

ISS_API_URL = 'http://api.open-notify.org/iss-now.json'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/nasa')
def nasa_apod():
    response = requests.get(NASA_API_URL)
    data = response.json()
    return jsonify(data)

@app.route('/api/spacex')
def spacex_latest_launch():
    response = requests.get(SPACEX_API_URL)
    data = response.json()
    return jsonify(data)

@app.route('/api/n2yo')
def n2yo_tle():
    response = requests.get(N2YO_API_URL)
    data = response.json()
    return jsonify(data)

@app.route('/api/iss-location')
def iss_location():
    response = requests.get(ISS_API_URL)
    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
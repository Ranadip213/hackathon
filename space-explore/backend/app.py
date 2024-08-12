from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
import requests
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = '4ea749b5e89c140247952f9183c81f58'

# MySQL Configuration
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'ranadip213'
app.config['MYSQL_DATABASE_DB'] = 'space_explorer'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

# Create MySQL connection
def get_db_connection():
    connection = mysql.connector.connect(
        user=app.config['MYSQL_DATABASE_USER'],
        password=app.config['MYSQL_DATABASE_PASSWORD'],
        host=app.config['MYSQL_DATABASE_HOST'],
        database=app.config['MYSQL_DATABASE_DB']
    )
    return connection

# NASA API Key
nasa_api_key = 'mYSwbYavuxuQJXk3wi8zU2VXbPNJE97M9Q8xCnqz'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user and check_password_hash(user[4], password):  # Assuming password is in the 5th column
            return redirect(url_for('index'))
        flash('Invalid username or password')
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        confirm_password = request.form['confirm-password']
        
        if password != confirm_password:
            flash('Passwords do not match')
            return redirect(url_for('signup'))
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (username, email, phone, password) VALUES (%s, %s, %s, %s)", 
                           (username, email, phone, hashed_password))
            conn.commit()
            cursor.close()
            conn.close()
            return redirect(url_for('login'))
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            flash('Error: ' + str(e))
    return render_template('login.html')

@app.route('/api/nasa-data')
def nasa_data():
    url = f'https://api.nasa.gov/planetary/apod?api_key={nasa_api_key}'
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

@app.route('/api/spacex-latest-launch')
def spacex_latest_launch():
    url = 'https://api.spacexdata.com/v4/launches/latest'
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

@app.route('/api/n2yo-tle')
def n2yo_tle():
    n2yo_api_key = '589P8Q-SDRYX8-L842ZD-5Z9'
    satellite_id = '25544'  # Replace with the actual satellite ID you want
    url = f'https://api.n2yo.com/rest/v1/satellite/tle/{satellite_id}?apiKey={n2yo_api_key}'
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

@app.route('/api/open-notify')
def open_notify():
    url = 'http://api.open-notify.org/iss-now.json'
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

@app.route('/api/nasa-gallery')
def nasa_gallery():
    url = f'https://api.nasa.gov/planetary/apod?api_key={nasa_api_key}'
    response = requests.get(url)
    data = response.json()
    return jsonify({
        'url': data['url'],
        'title': data['title']
    })

@app.route('/api/spacex-rockets')
def spacex_rockets():
    url = 'https://api.spacexdata.com/v3/rockets'
    response = requests.get(url)
    data = response.json()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

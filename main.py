from flask import Flask, jsonify, request, send_file
import mysql.connector as sql
import pandas as pd
import matplotlib.pyplot as plt
import qrcode
import os
from flask_cors import CORS
from flask_cors import cross_origin

app = Flask(__name__)

import matplotlib
matplotlib.use('Agg')
IMG_FOLDER="./images"
os.makedirs(IMG_FOLDER, exist_ok=True)
# Enable CORS for all routes
CORS(app, resources={r"/*": {
    "origins": "http://localhost:3000",
    "allow_headers": ["Content-Type", "Authorization"],
    "methods": ["GET", "POST", "PUT", "DELETE"]
}}, supports_credentials=True)


# Establish MySQL Connection
conn = sql.connect(
    host="localhost",
    user="root",
    password="tiger",
    database="hospital"
)

# Check the connection
if conn.is_connected():
    print("Successfully connected to the database.")
else:
    print("Connection failed.")


@app.before_request
def handle_options():
    """Handle preflight requests for all routes."""
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight response"})
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response, 200

@app.route('/api/doctors', methods=['OPTIONS'])  # Handle preflight requests
def doctors_options():
    return '', 204  # Respond with an empty response and status 204 (No Content)


@app.route('/api/patients', methods=['PUT','OPTIONS'])  # Handle preflight requests
def patients_options():
    return '', 204  # Respond with an empty response and status 204 (No Content)

def get_db_connection():
    try:
        conn = sql.connect(
            host="localhost",
            user="root",
            password="tiger",
            database="hospital"
        )
        return conn
    except sql.Error as err:
        print(f"Error: {err}")
        return None

# 1. About the project
@app.route('/api/about', methods=['GET'])
@cross_origin(origin='http://localhost:3000', methods=['GET'])
def about():
    return jsonify({
        "message": "WELCOME to HOSPITAL MANAGEMENT PROJECT. It is a menu-based project and provides various functionalities."
    })

@app.route('/api/doctors', methods=['POST'])
@cross_origin(origin='http://localhost:3000', methods=['POST'])

def add_doctor():
    try:
        doctor_data = request.get_json()
        name = doctor_data.get('name')
        specialization = doctor_data.get('specialization')
        contact = doctor_data.get('contact')
        email = doctor_data.get('email')

        if not name or not specialization or not contact or not email:
            return jsonify({"error": "Missing required fields"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            INSERT INTO doctor_details (name, specialization, contact, email)
            VALUES (%s, %s, %s, %s)
        """, (name, specialization, contact, email))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Doctor added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 2. Doctor Management APIs
@app.route('/api/doctors', methods=['GET'])
@cross_origin(origin='localhost', methods=['GET'])
def get_doctors():
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM doctor_details")  # Ensure the table name is correct
        doctors = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(doctors)
    except sql.Error as err:
        return jsonify({'error': f"Database error: {err}"}), 500

@app.route('/api/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM doctor_details WHERE id = %s"
        cursor.execute(query, (id,))
        doctor = cursor.fetchone()

        if doctor:
            return jsonify(doctor), 200  # Return doctor data if found
        else:
            return jsonify({"message": "Doctor not found"}), 404  # If doctor not found
    except sql.Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        cursor.close()
        conn.close()




@app.route('/api/doctors/<int:id>', methods=['PUT'])
def update_doctor(id):
    try:
        # Get the updated data from the request body
        data = request.get_json()

        # Log the received data to debug
        print(f"Received data: {data}")

        # Extract fields from the request data
        name = data.get('name')
        specialization = data.get('specialization')  # Ensure 'specialization' is being sent from the frontend
        contact = data.get('contact')
        email = data.get('email')
        
        # Validate required fields
        if not name or not specialization or not contact or not email:
            return jsonify({"message": "Missing required fields"}), 400

        # Update the doctor record in the database
        query = """
            UPDATE doctor_details
            SET name = %s, specialization = %s, contact = %s, email = %s
            WHERE id = %s
        """

        cursor = conn.cursor()
        cursor.execute(query, (name, specialization, contact, email, id))
        conn.commit()

        return jsonify({"message": "Doctor updated successfully!"}), 200
    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging error
        return jsonify({"message": f"Error: {str(e)}"}), 500

@app.route("/api/workers/<int:worker_id>", methods=["DELETE"])
def delete_worker(worker_id):
    try:
        cursor=conn.cursor()
        cursor.execute("SELECT * FROM workers WHERE id = %s", (worker_id,))
        worker = cursor.fetchone()

        if not worker:
            return jsonify({"error": "Worker not found"}), 404

        cursor.execute("DELETE FROM workers WHERE id = %s", (worker_id,))
        conn.commit()  # Commit the deletion

        return jsonify({"message": "Worker deleted successfully"}), 200

    except Exception as e:
        print("Error deleting worker:", e)  # Debugging output
        return jsonify({"error": "Internal Server Error"}), 500



@app.route("/api/patients", methods=["GET"])
@cross_origin(origin='http://localhost:3000', methods=['GET'])
def get_patients():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patient_details")  # Ensure table name is correct
        patients = cursor.fetchall()
        cursor.close()
        conn.close()

        return jsonify(patients), 200  # Return patient list with status code 200
    except sql.Error as err:
        return jsonify({"error": f"Database error: {err}"}), 500



# 3. Patient Management APIs
@app.route("/api/patients/<int:patient_id>", methods=["GET"])
@cross_origin(origin='http://localhost:3000', methods=['GET'], headers=["Content-Type"])
def get_patient(patient_id):
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, age, gender, phone FROM patient_details WHERE id = %s", (patient_id,))
    patient = cursor.fetchone()
    cursor.close()
    
    if patient:
        return jsonify({"id": patient[0], "name": patient[1], "age": patient[2], "gender": patient[3], "phone": patient[4]})
    else:
        return jsonify({"error": "Patient not found"}), 404



@app.route("/api/patients", methods=["POST"])
@cross_origin(origin='http://localhost:3000', methods=['POST'], headers=["Content-Type"])
def add_patient():
    try:
        data = request.get_json()
        name = data.get("name")
        age = data.get("age")
        gender = data.get("gender")
        phone = data.get("phone")

        # Validate input
        if not name or not age or not gender or not phone:
            return jsonify({"error": "Missing required fields"}), 400

        # Get new database connection
        connection = get_db_connection()
        if connection is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = connection.cursor()
        cursor.execute("INSERT INTO patient_details (name, age, gender, phone) VALUES (%s, %s, %s, %s)", 
                       (name, age, gender, phone))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Patient added successfully"}), 201

    except sql.Error as err:
        print("Database Error:", err)  # Debugging log
        return jsonify({"error": "Database error", "message": str(err)}), 500

    except Exception as e:
        print("General Error:", e)  # Debugging log
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

@app.route("/api/patients/<int:patient_id>", methods=["PUT"])
def update_patient(patient_id):
    data = request.json
    print("Received Data:", data)  # Debugging line

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE patient_details 
            SET name = %s, age = %s, gender = %s, phone = %s 
            WHERE id = %s
        """, (data.get("name"), data.get("age"), data.get("gender"), data.get("phone"), patient_id))
        conn.commit()
        cursor.close()

        return jsonify({"message": "Patient updated successfully"}), 200
    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500



@app.route("/api/patients/<int:id>", methods=["DELETE"])
@cross_origin(origin='http://localhost:3000', methods=['DELETE'], headers=["Content-Type"])
def delete_patient(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM patient_details WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    return jsonify({"message": "Patient deleted successfully"})





# 4. Worker Management APIs
@app.route('/api/workers', methods=['GET'])
def get_workers():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM workers")
    workers = cursor.fetchall()
    cursor.close()
    connection.close()
    
    # Format the workers into a list of dictionaries
    workers_list = [{"id": worker[0], "name": worker[1], "role": worker[2], "contact": worker[3],"salary": worker[4]} for worker in workers]
    return jsonify(workers_list), 200

@app.route('/api/workers', methods=['POST'])
def add_worker():
    data = request.get_json()
    name = data['name']
    role = data['role']
    contact = data['contact']
    salary = data['salary']

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO workers (name, role, contact, salary) VALUES (%s, %s, %s, %s)",
        (name, role, contact, salary)
    )
    connection.commit()
    cursor.close()
    connection.close()

    return jsonify({"message": "Worker successfully added!"}), 201

@app.route("/api/workers/<int:worker_id>", methods=["PUT"])
def update_worker(worker_id):
    data = request.json
    name = data.get("name")
    role = data.get("role")
    contact = data.get("contact")
    salary = data.get("salary")
    cursor=conn.cursor()

    if not all([name, role, contact, salary]):
        return jsonify({"error": "All fields are required"}), 400

    try:
        query = "UPDATE workers SET name = %s, role = %s, contact = %s, salary = %s WHERE id = %s"
        cursor=conn.cursor()
        cursor.execute(query, (name, role, contact, salary, worker_id))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "Worker not found"}), 404

        return jsonify({"message": "Worker updated successfully"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500

# Get Worker by ID (for pre-filling update form)
@app.route("/api/workers/<int:worker_id>", methods=["GET"])
def get_worker(worker_id):
    try:
        cursor=conn.cursor()
        cursor.execute("SELECT * FROM workers WHERE id = %s", (worker_id,))
        worker = cursor.fetchone()

        if not worker:
            return jsonify({"error": "Worker not found"}), 404

        return jsonify(worker), 200

    except Exception as e:
        print("Error fetching worker:", e)  # Debugging
        return jsonify({"error": "Internal Server Error"}), 500



app.route('/api/workers/<int:worker_id>', methods=['DELETE'])
def delete_worker(worker_id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM workers WHERE id = %s", (worker_id,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Worker deleted successfully!"}), 200

# 5. Billing APIs
@app.route('/api/billing', methods=['GET'])
def get_billing():
    try:
        # Fetch billing data from MySQL
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM billing")
        bills = cursor.fetchall()
        cursor.close()
        return jsonify(bills)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/api/billing", methods=["POST"])
def add_billing():
    data = request.json
    print("Received Billing Data:", data)  # Debugging line

    if not data:
        return jsonify({"error": "Missing request body"}), 400

    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO billing (patient_name, treatment, amount, date) 
            VALUES (%s, %s, %s, %s)
        """, (data["patientName"], data["treatment"], data["amount"], data["date"]))
        conn.commit()
        cursor.close()

        return jsonify({"message": "Billing details added successfully!"}), 201
    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500

@app.route('/api/billing/<int:id>', methods=['DELETE'])
def delete_billing(id):
    try:
        query = "DELETE FROM bill WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        return jsonify({"message": "Bill deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# 6. Visualization APIs
@app.route("/api/charts/department-distribution")
def department_pie_chart():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch department-wise doctor count
        cursor.execute("SELECT specialization, COUNT(*) FROM doctor_details GROUP BY specialization")
        data = cursor.fetchall()
        conn.close()

        if not data:
            return jsonify({"error": "No data found"}), 404

        # Convert to Pandas DataFrame
        df = pd.DataFrame(data, columns=["Department", "Count"])

        # Generate Pie Chart
        plt.figure(figsize=(6, 6))
        plt.pie(df["Count"], labels=df["Department"], autopct="%1.1f%%", startangle=140)
        plt.title("Department Distribution")
        plt.axis("equal")  # Equal aspect ratio ensures that pie is drawn as a circle.

        # Save image
        chart_path = "department_pie_chart.png"
        plt.savefig(chart_path)
        plt.close()

        return send_file(chart_path, mimetype="image/png")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/charts/hospital-stats')
def generate_bar_chart():
    labels = ["Doctors", "Patients", "Workers"]
    values = [50, 200, 30]  # Replace with dynamic values from your database

    plt.figure(figsize=(6, 4))
    plt.bar(labels, values, color=["#3498db", "#2ecc71", "#e74c3c"])
    plt.xlabel("Categories")
    plt.ylabel("Count")
    plt.title("Hospital Statistics")

    img_path = os.path.join(IMG_FOLDER, "hospital_stats.png")
    plt.savefig(img_path)
    plt.close()

    return send_file(img_path, mimetype='image/png')


# 7. QR Code Generation API
@app.route("/api/payment", methods=["POST"])
def generate_payment():
    try:
        data = request.get_json()
        amount = data.get("amount")

        if not amount or float(amount) <= 0:
            return jsonify({"error": "Invalid amount"}), 400

        transaction_id = str(uuid.uuid4())  # Generate a unique transaction ID

        # Insert into MySQL
        sql = "INSERT INTO transactions (amount, transaction_id) VALUES (%s, %s)"
        cursor.execute(sql, (amount, transaction_id))
        db.commit()

        return jsonify({"transactionId": transaction_id}), 201

    except Exception as e:
        print("Error:", e)  # Log error in console
        return jsonify({"error": "Internal Server Error"}), 500


@app.route('/api/payment/<transaction_id>', methods=['GET'])
def get_payment(transaction_id):
    try:
        sql = "SELECT * FROM transactions WHERE transaction_id = %s"
        cursor=conn.cursor()

        cursor.execute(sql, (transaction_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Transaction not found"}), 404

        transaction = {
            "id": result[0],
            "amount": result[1],
            "transaction_id": result[2],
            "created_at": result[3]
        }

        return jsonify(transaction), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/charts/revenue-trend')
def generate_line_plot():
    months = ["Jan", "Feb", "Mar", "Apr"]
    revenue = [5000, 7000, 8000, 6500]  # Example values (replace with real data)

    plt.figure(figsize=(8, 4))
    plt.plot(months, revenue, marker='o', linestyle='-', color='blue', label="Total Bills ($)")
    plt.xlabel("Months")
    plt.ylabel("Revenue ($)")
    plt.title("Hospital Revenue Trend")
    plt.legend()
    plt.grid(True)

    img_path = os.path.join(IMG_FOLDER, "revenue_trend.png")
    plt.savefig(img_path)
    plt.close()

    return send_file(img_path, mimetype='image/png')


@app.route("/api/doctors", methods=["GET"])
def get_docs():
    try:
        cursor=conn.cursor()
        cursor.execute("SELECT id, name FROM doctor_details")  # Assuming a 'doctors' table exists
        doctors = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
        return jsonify(doctors)
    except Exception as e:
        print("Error fetching doctors:", e)
        return jsonify({"error": "Internal Server Error"}), 500

# Route to book an appointment
@app.route("/api/appointments", methods=["POST"])
def book_appointment():
    try:
        data = request.get_json()
        patient_name = data.get("patientName")
        doctor = data.get("doctor")
        date = data.get("date")
        time = data.get("time")

        if not (patient_name and doctor and date and time):
            return jsonify({"error": "All fields are required"}), 400

        sql = "INSERT INTO appointments (patient_name, doctor, date, time) VALUES (%s, %s, %s, %s)"
        cursor=conn.cursor()
        cursor.execute(sql, (patient_name, doctor, date, time))
        conn.commit()

        return jsonify({"message": "Appointment booked successfully"}), 201

    except Exception as e:
        print("Error booking appointment:", e)
        return jsonify({"error": "Internal Server Error"}), 500




@app.route('/api/doctors', methods=['GET'])
def get_doctor_count():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM doctor_details")
    count = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return jsonify({"count": count}), 200

@app.route('/api/patients/count', methods=['GET'])
def get_patient_count():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM patients")
    count = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return jsonify({"count": count}), 200

@app.route('/api/workers/count', methods=['GET'])
def get_worker_count():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM workers")
    count = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return jsonify({"count": count}), 200

@app.route('/api/billing/count', methods=['GET'])
def get_bill_count():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM billing")
    count = cursor.fetchone()[0]
    cursor.close()
    connection.close()
    return jsonify({"count": count}), 200


if __name__ == '__main__':
    app.run(debug=True)

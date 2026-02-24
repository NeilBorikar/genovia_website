from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# ---------- DB SETUP ----------
def init_db():
    conn = sqlite3.connect("contacts.db")
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        company TEXT,
        message TEXT
    )
    """)
    conn.commit()
    conn.close()

init_db()

# ---------- ADD CONTACT ----------
@app.route("/contact", methods=["POST"])
def contact():
    data = request.json

    conn = sqlite3.connect("contacts.db")
    c = conn.cursor()

    c.execute("""
        INSERT INTO contacts (name, email, phone, company, message)
        VALUES (?, ?, ?, ?, ?)
    """, (data["name"], data["email"], data["phone"], data["company"], data["message"]))

    conn.commit()
    conn.close()

    return jsonify({"message": "Request sent successfully!"})

# ---------- VIEW ALL ----------
@app.route("/contacts", methods=["GET"])
def get_contacts():
    conn = sqlite3.connect("contacts.db")
    c = conn.cursor()

    c.execute("SELECT * FROM contacts")
    data = c.fetchall()

    conn.close()
    return jsonify(data)

# ---------- DELETE ----------
@app.route("/delete/<int:id>", methods=["DELETE"])
def delete_contact(id):
    conn = sqlite3.connect("contacts.db")
    c = conn.cursor()

    c.execute("DELETE FROM contacts WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted successfully"})

if __name__ == "__main__":
    app.run(debug=True)
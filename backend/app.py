from flask import Flask, render_template, request, jsonify
import sqlite3
import os
DB_PATH = os.path.join(os.path.dirname(__file__), "contacts.db")
app = Flask(__name__, 
            template_folder="../templates", 
            static_folder="../static")

# ---------- ROUTES ----------
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/contact-page")
def contact_page():
    return render_template("contact.html")


# ---------- CONTACT API ----------
@app.route("/contact", methods=["POST"])
def contact():
    try:
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

    except Exception as e:
        print("ERROR:", e)   # 👈 IMPORTANT
        return jsonify({"message": "Server error"}), 500
        


# ---------- DB INIT ----------
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
from flask import Flask, render_template, request, jsonify
import sqlite3
import os
DB_PATH = os.path.join(os.getcwd(), "contacts.db")
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

@app.route("/services")
def services():
    return render_template("services.html")

@app.route("/services/seo")
def service_seo():
    return render_template("service-seo.html")

@app.route("/services/paid-advertising")
def service_paid_advertising():
    return render_template("service-paid-advertising.html")

@app.route("/services/social-media-marketing")
def service_social_media_marketing():
    return render_template("service-social-media-marketing.html")

@app.route("/services/content-marketing")
def service_content_marketing():
    return render_template("service-content-marketing.html")

@app.route("/services/influencer-marketing")
def service_influencer_marketing():
    return render_template("service-influencer-marketing.html")

@app.route("/services/email-marketing")
def service_email_marketing():
    return render_template("service-email-marketing.html")

@app.route("/services/branding")
def service_branding():
    return render_template("service-branding.html")

@app.route("/services/website-development")
def service_website_development():
    return render_template("service-website-development.html")

@app.route("/services/conversion-rate-optimization")
def service_conversion_rate_optimization():
    return render_template("service-conversion-rate-optimization.html")

@app.route("/services/marketing-strategy-consulting")
def service_marketing_strategy_consulting():
    return render_template("service-marketing-strategy-consulting.html")


# ---------- CONTACT API ----------
@app.route("/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "Invalid data"}), 400

        with sqlite3.connect(DB_PATH) as conn:
            c = conn.cursor()

        c.execute("""
            INSERT INTO contacts (name, email, phone, company, message)
            VALUES (?, ?, ?, ?, ?)
        """, (data["name"], data["email"], data["phone"], data["company"], data["message"]))

        conn.commit()
        conn.close()

        return jsonify({"message": "Request sent successfully!"})

    except Exception as e:
        import traceback
        print("ERROR:", str(e))
        print(traceback.format_exc())  # 🔥 full error log
        return jsonify({"message": "Server error"}), 500
        
# ---------- ADMIN PAGE ----------
@app.route("/admin")
def admin():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("SELECT * FROM contacts ORDER BY id DESC")
    data = c.fetchall()

    conn.close()

    return render_template("admin.html", contacts=data)


# ---------- DELETE REQUEST ----------
@app.route("/delete/<int:id>", methods=["POST"])
def delete_contact(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("DELETE FROM contacts WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Deleted successfully"})

# ---------- DB INIT ----------
def init_db():
    conn = sqlite3.connect(DB_PATH)
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
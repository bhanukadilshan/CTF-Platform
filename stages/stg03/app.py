from flask import Flask, request, render_template
import sqlite3

app = Flask(__name__)

DATABASE = "challenge.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search")
def search():
    username = request.args.get("username", "")

    conn = get_db()

    # INTENTIONALLY VULNERABLE - CTF LAB ONLY
    query = f"""
        SELECT * FROM incidents
        WHERE username = '{username}'
    """

    print("[DEBUG] Username received:", repr(username), flush=True)
    print("[DEBUG] SQL query:", flush=True)
    print(query, flush=True)

    try:
        results = conn.execute(query).fetchall()

    except sqlite3.Error as error:
        print("[ERROR]", error, flush=True)
        conn.close()

        return render_template(
            "results.html",
            results=[],
            error=str(error)
        )

    conn.close()

    return render_template(
        "results.html",
        results=results,
        error=None
    )


@app.route("/evidence")
def evidence():
    case_ref = request.args.get("case_ref", "")

    conn = get_db()

    # INTENTIONALLY VULNERABLE - CTF LAB ONLY
    query = f"""
        SELECT * FROM evidence
        WHERE case_ref = '{case_ref}'
        AND evidence_type != 'Restricted Evidence'
    """

    print("[DEBUG] Case reference received:", repr(case_ref), flush=True)
    print("[DEBUG] SQL query:", flush=True)
    print(query, flush=True)

    try:
        results = conn.execute(query).fetchall()

    except sqlite3.Error as error:
        print("[ERROR]", error, flush=True)
        conn.close()

        return render_template(
            "results.html",
            results=[],
            error=str(error)
        )

    conn.close()

    return render_template(
        "results.html",
        results=results,
        error=None
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
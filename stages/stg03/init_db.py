import sqlite3

DB_NAME = "challenge.db"


def init_database():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # Remove old tables
    cursor.execute("DROP TABLE IF EXISTS incidents")
    cursor.execute("DROP TABLE IF EXISTS evidence")

    # Incidents table
    cursor.execute("""
        CREATE TABLE incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_ref TEXT NOT NULL,
            username TEXT NOT NULL,
            incident_type TEXT NOT NULL,
            description TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    # Evidence table
    cursor.execute("""
        CREATE TABLE evidence (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_ref TEXT NOT NULL,
            evidence_type TEXT NOT NULL,
            description TEXT NOT NULL
        )
    """)

    # Fictional incident records
    incidents = [
        (
            "CV-001",
            "alice",
            "Password Reset",
            "Employee requested a password reset.",
            "Closed"
        ),
        (
            "CV-002",
            "bob",
            "Suspicious Login",
            "Multiple unsuccessful login attempts detected.",
            "Investigating"
        ),
        (
            "CV-003",
            "charlie",
            "Phishing Email",
            "Suspicious attachment reported by employee.",
            "Investigating"
        ),
       (
    "CV-004",
    "blackout",
    "Critical Incident",
    "Restricted incident record. Sensitive evidence exists.",
    "Restricted"
)
    ]

    cursor.executemany("""
        INSERT INTO incidents
        (case_ref, username, incident_type, description, status)
        VALUES (?, ?, ?, ?, ?)
    """, incidents)

    # Fictional evidence records
    evidence = [
        (
            "CV-001",
            "Email",
            "Password reset request from employee."
        ),
        (
            "CV-002",
            "Login Log",
            "Repeated failed login attempts."
        ),
        (
            "CV-003",
            "Attachment",
            "Suspicious document attached to phishing email."
        ),
       (
    "CV-004",
    "Restricted Evidence",
    "Recovered evidence: CTF{portal_sql_breach}"
),
        (
            "CV-004",
            "Network Log",
            "Suspicious connection observed during the incident."
        )
    ]

    cursor.executemany("""
        INSERT INTO evidence
        (case_ref, evidence_type, description)
        VALUES (?, ?, ?)
    """, evidence)

    conn.commit()
    conn.close()

    print("[+] Database created successfully.")
    print("[+] Database:", DB_NAME)


if __name__ == "__main__":
    init_database()
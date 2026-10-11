# CyberVault CTFd platform

This folder runs CTFd locally on Windows with Docker Desktop. Six CyberVault challenge entries have been created in the **current local CTFd database**. The current event uses User Mode (solo play), and all six challenges are visible.

## Start the platform

1. Open Docker Desktop and wait for its engine to run.
2. In PowerShell, run `./start.ps1` from this folder.
3. Open <http://localhost:8000>.

For a fresh installation, complete CTFd's administrator setup. The script creates a local `.env` file with random platform and database secrets. Keep it private. `./stop.ps1` stops CTFd without deleting its database or uploaded files. `./verify.ps1` checks its status.

## Start the interactive stages

Run `./start-challenges.ps1` from this folder. It builds and starts two separate challenge containers:

| Stage | Service | Local access |
| --- | --- | --- |
| STG-03 — Vulnerable Portal | Web application | <http://localhost:5000> |
| STG-06 — Blackout Server | SSH server | `ssh -p 2222 analyst@127.0.0.1` |

The stage 6 lab password is `incident2026`. Both services bind to localhost. Their source and flags are in `stages/stg03` and `stages/stg06`; do not upload those source folders as player downloads. CTFd contains only the player-facing description, connection details, hints, and flag checks for these stages.

Run `./stop-challenges.ps1` to stop and remove the two challenge containers. Run `./reset-challenges.ps1` to recreate them from their images, restoring their original challenge state. These scripts do not change CTFd data.

## The six CTFd entries

| Stage | Category | Points | Player file or service |
| --- | --- | ---: | --- |
| STG-01 — The Hidden Photograph | Steganography | 100 | `evidence.jpg` |
| STG-02 — Broken Cipher | Cryptography | 100 | `intercepted_message.txt` |
| STG-03 — Vulnerable Portal | Web Security | 200 | Local web service |
| STG-04 — Fragments of the Breach | Digital Forensics | 250 | `evidence.zip` |
| STG-05 — A Conversation on the Wire | Networking | 350 | `blackout_capture.pcap` |
| STG-06 — Blackout Server | Linux / System Security | 500 | Local SSH service |

Stages 1, 2, 4, and 5 have their player files uploaded into CTFd. Each entry has a static flag and two hints. All entries are currently visible. To hide or publish a stage, open it in CTFd's admin challenge list, change **State**, and save.

## Sharing and backups

`cybervault-ctfd-1.0.tar` is only the CTFd application image. It does **not** contain the six challenge entries, the MariaDB database, uploaded files, or the stage 3 and stage 6 services.

For another computer, copy this folder and import `cybervault-ctfd-event-6-stages.zip` into a fresh CTFd installation; run `./start-challenges.ps1` to build the interactive stages. In CTFd, choose **Admin > Config > Import & Export > Import**. A full import replaces the destination CTFd data, including its accounts. The administrator from this backup must sign in afterward and create the new organizer's account. Keep the export private because it includes challenge answers and administrator data. The other computer needs Docker Desktop with Linux containers and internet access for base images on first build.

On a fresh machine, `./start.ps1 -UseSavedImage` loads the saved CTFd image rather than rebuilding it. CTFd still requires its separate MariaDB, Redis, and Alpine images. A fresh CTFd setup and event import are still required.

The localhost links in the interactive stages work on the machine running Docker. A public tunnel for CTFd alone will not expose the web or SSH challenge services; update connection details and provide controlled access before inviting remote players.

Do not use `docker compose down --volumes` unless you intentionally want to erase the local CTFd database and uploads.

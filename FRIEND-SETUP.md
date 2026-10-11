# Run CyberVault on another Windows PC

1. Install Docker Desktop and enable Linux containers. Start Docker Desktop.
2. Extract this package to a normal folder. Open PowerShell in the extracted `ctfd-platform` folder.
3. Run `./start.ps1 -UseSavedImage`. This creates fresh local database secrets and starts CTFd at <http://localhost:8000>. Docker may download MariaDB, Redis, and Alpine images on the first run.
4. Complete CTFd's initial setup with a temporary administrator account.
5. In CTFd, open **Admin > Config > Import & Export > Import** and upload `cybervault-ctfd-event-6-stages.zip`. **The full import replaces all existing CTFd data, including the temporary administrator account.** The administrator account from the export must sign in after import. Arrange for the owner of that account to sign in and create your own administrator account.
6. Run `./start-challenges.ps1`. This builds and starts the stage 3 portal at <http://localhost:5000> and stage 6 SSH server on port 2222.
7. In CTFd, check that all six challenges, four player downloads, and hints appear. The supplied event uses **User Mode (solo play)** and its challenges are visible. You can hide individual challenges in **Admin > Challenges** until your event begins.

Run `./stop.ps1` to stop CTFd without deleting its data. Run `./stop-challenges.ps1` to stop the two interactive services. Use `./reset-challenges.ps1` to recreate those services in their original state.

Keep the event export private. It contains challenge flags and the original administrator account record. Do not send the original computer's `.env` file. The ZIP package intentionally excludes it.

The default links work locally on the PC running Docker. A tunnel for CTFd alone will not expose the stage 3 portal or stage 6 SSH server to remote players.

## Optional temporary public link

Install `cloudflared` from the [official Cloudflare downloads page](https://developers.cloudflare.com/tunnel/downloads/), then keep CTFd running and use a separate PowerShell window:

```powershell
cloudflared tunnel --url http://localhost:8000
```

Share the `https://...trycloudflare.com` address printed in that window. The address works only while Docker, CTFd, and this PowerShell process remain running. Anyone with the link can open the CTFd website. The stage 3 portal on port 5000 needs its own web tunnel and its CTFd connection link updated. Stage 6 SSH on port 2222 needs a separate remote-access setup; this quick web tunnel does not expose SSH. Change the inherited administrator password before sharing a public link.

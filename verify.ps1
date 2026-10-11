$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    docker compose ps
    if ($LASTEXITCODE -ne 0) { throw 'Could not read Docker Compose status.' }

    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/' -MaximumRedirection 5 -TimeoutSec 15
    Write-Host "CTFd HTTP status: $($response.StatusCode)"
    if ($response.StatusCode -ne 200) { throw 'CTFd did not return HTTP 200.' }
    Write-Host 'Platform responds locally. Complete the first-run setup in your browser if it is still shown.'
} finally {
    Pop-Location
}

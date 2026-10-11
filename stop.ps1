$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    docker compose down
    if ($LASTEXITCODE -ne 0) { throw 'Docker Compose could not stop the platform.' }
    Write-Host 'Platform stopped. Database and uploads remain saved.'
} finally {
    Pop-Location
}

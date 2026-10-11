$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

Push-Location $PSScriptRoot
try {
    docker compose -f challenges.compose.yaml down
    if ($LASTEXITCODE -ne 0) { throw 'The challenge services could not stop.' }
    Write-Host 'Stage 3 and stage 6 containers stopped and removed. CTFd data was not changed.'
} finally {
    Pop-Location
}

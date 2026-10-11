$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

Push-Location $PSScriptRoot
try {
    docker info --format '{{.ServerVersion}}' | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Docker is not running. Open Docker Desktop and run this script again.'
    }

    docker compose -f challenges.compose.yaml up --build -d
    if ($LASTEXITCODE -ne 0) { throw 'The challenge services could not start.' }

    docker compose -f challenges.compose.yaml ps
    Write-Host 'Stage 3 portal: http://localhost:5000'
    Write-Host 'Stage 6 SSH: 127.0.0.1 port 2222'
} finally {
    Pop-Location
}

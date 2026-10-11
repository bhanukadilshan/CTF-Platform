param([switch]$UseSavedImage)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function New-HexSecret {
    $bytes = New-Object byte[] 32
    $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
    return ([System.BitConverter]::ToString($bytes)).Replace('-', '').ToLowerInvariant()
}

Push-Location $PSScriptRoot
try {
    if (-not (Test-Path -LiteralPath '.env')) {
        @(
            "CTFD_SECRET_KEY=$(New-HexSecret)"
            "CTFD_DB_PASSWORD=$(New-HexSecret)"
            "CTFD_DB_ROOT_PASSWORD=$(New-HexSecret)"
        ) | Set-Content -LiteralPath '.env' -Encoding utf8
        Write-Host 'Created local .env secrets.'
    }

    docker info --format '{{.ServerVersion}}' | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Docker is not running. Open Docker Desktop, wait for its engine to start, then run this script again.'
    }

    if ($UseSavedImage) {
        if (-not (Test-Path -LiteralPath 'cybervault-ctfd-1.0.tar')) {
            throw 'Place cybervault-ctfd-1.0.tar in this folder before using -UseSavedImage.'
        }
        docker image load -i cybervault-ctfd-1.0.tar
        if ($LASTEXITCODE -ne 0) { throw 'Docker could not load the saved platform image.' }
        docker compose up --no-build -d
    } else {
        docker compose up --build -d
    }
    if ($LASTEXITCODE -ne 0) { throw 'Docker Compose could not start the platform.' }

    docker compose ps
    Write-Host 'Open http://localhost:8000 after CTFd finishes starting.'
} finally {
    Pop-Location
}

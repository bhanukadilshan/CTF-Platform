$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

Push-Location $PSScriptRoot
try {
    docker compose -f challenges.compose.yaml up --force-recreate -d
    if ($LASTEXITCODE -ne 0) { throw 'The challenge services could not reset.' }
    docker compose -f challenges.compose.yaml ps
    Write-Host 'Stage 3 and stage 6 containers recreated from their images. CTFd data was not changed.'
} finally {
    Pop-Location
}

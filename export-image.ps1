$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    docker image inspect cybervault-ctfd:1.0 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Build the image first with start.ps1.' }
    docker image save cybervault-ctfd:1.0 -o cybervault-ctfd-1.0.tar
    if ($LASTEXITCODE -ne 0) { throw 'Docker could not export the image.' }
    Write-Host 'Saved cybervault-ctfd-1.0.tar. The image does not include the database or uploaded challenge files.'
} finally {
    Pop-Location
}

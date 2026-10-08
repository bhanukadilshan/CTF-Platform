# STG-06 — Blackout Server

## Incident Brief

CyberVault investigators have identified the final affected asset:

BLACKOUT-SRV

Evidence suggests that a configuration weakness on this Linux server allowed
protected information to become accessible during the incident.

You have been provided with limited analyst access to investigate the host.

## Mission

Enumerate the Blackout Server.

Identify the relevant configuration or permission weakness.

Demonstrate controlled access to the protected challenge resource.

Recover the final flag.

## Flag Format

CTF{...}

## Rules

You may investigate only the provided Blackout Server CTF environment.

Do not attack:

- the Docker host
- CTF management infrastructure
- other participants
- external systems

Brute forcing and password guessing are not required.

## Investigation Areas

Useful areas to investigate include:

- current user and groups
- operating-system information
- files and directories
- running processes
- listening services
- file permissions
- custom applications
- service configuration
- sudo permissions

## Hint 1

Enumerate before you exploit.

## Hint 2

Focus on permissions and services rather than guessing passwords.


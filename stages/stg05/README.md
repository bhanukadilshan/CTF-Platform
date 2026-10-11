# STG-05 — A Conversation on the Wire

## CyberVault — Operation Blackout

**Stage:** 5 of 6
**Domain:** Networking
**Difficulty:** Moderate–Hard

## Overview

Network monitoring captured traffic during the CyberVault incident.

The participant receives a sanitized packet capture containing ordinary
background activity and an intentionally crafted suspicious exchange.

The objective is to identify the relevant hosts and protocol, reconstruct
the suspicious communication, and recover the stage flag.

## Learning Objectives

Participants should demonstrate:

- PCAP analysis
- protocol identification
- endpoint identification
- Wireshark display filtering
- TCP/HTTP analysis
- stream reconstruction
- correlation of network indicators
- evidence extraction

## Challenge Artifact

challenge/evidence/blackout_capture.pcap

The capture is generated specifically for this CTF and contains fictional
hosts, traffic, services, and evidence.

## Required Tools

Recommended:

- Wireshark
- tshark

Optional:

- grep
- strings
- standard Linux text utilities

## Generate Challenge

From the Stage 5 root:

python3 challenge/scripts/generate_pcap.py

## Participant File

Distribute only:

PLAYER.md
challenge/evidence/blackout_capture.pcap

Do not distribute the solution directory or PCAP generation script to
participants.

## Reset

Regenerate the original capture:

python3 challenge/scripts/generate_pcap.py

See RESET.md for details.

## Security

All traffic contained in the challenge capture is synthetic and created
specifically for CyberVault.

No real credentials, production systems, institutional traffic, or private
network captures should be included.


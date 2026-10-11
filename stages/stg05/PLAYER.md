# STG-05 — A Conversation on the Wire

## Incident Brief

Network monitoring captured traffic during the period in which the
CyberVault breach occurred.

Most of the capture appears to contain ordinary internal activity.

Investigators believe one conversation differs from the normal baseline and
contains evidence relevant to the incident.

## Provided Evidence

blackout_capture.pcap

## Mission

Analyze the packet capture and determine:

1. Which hosts participated in the suspicious communication.
2. Which protocol/service was involved.
3. What information was exchanged.
4. The hidden stage flag.

## Flag Format

CTF{...}

## Recommended Tools

- Wireshark
- tshark

## Rules

Analyze only the supplied CTF evidence.

The capture contains synthetic traffic generated specifically for this
challenge.

No scanning or interaction with external systems is required.

## Hint 1

Start by understanding which protocols dominate the capture.

## Hint 2

Look for a conversation that differs from the baseline.


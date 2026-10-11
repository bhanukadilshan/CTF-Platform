# STG-05 — A Conversation on the Wire
# Instructor Solution

DO NOT DISTRIBUTE TO PARTICIPANTS.

## Objective

Identify the suspicious network conversation and recover the flag from the
reconstructed traffic.

## Step 1 — Open the Capture

Wireshark:

wireshark blackout_capture.pcap

Or:

tshark -r blackout_capture.pcap

## Step 2 — Inspect Protocols

In Wireshark:

Statistics
→ Protocol Hierarchy

The participant should identify DNS and TCP-based application traffic.

## Step 3 — Inspect Conversations

Use:

Statistics
→ Conversations
→ IPv4

Compare the communicating hosts.

The suspicious conversation involves:

10.10.5.37
10.10.5.80

## Step 4 — Filter Suspicious Hosts

Wireshark display filter:

ip.addr == 10.10.5.37

Another useful filter:

ip.addr == 10.10.5.80

The communication uses TCP port 8080.

Useful filter:

tcp.port == 8080

## Step 5 — Investigate the Conversation

The relevant exchange is:

10.10.5.37 → 10.10.5.80:8080

The traffic resembles an HTTP request involving the incident archive.

## Step 6 — Reconstruct the Stream

Select a packet from the suspicious exchange.

Right-click:

Follow
→ TCP Stream

The response contains incident evidence and the stage flag.

## Expected Flag

CTF{wire_conversation_exposed}

## Intended Solution Path

PCAP
→ protocol hierarchy
→ conversations
→ anomalous endpoints
→ TCP/8080
→ follow stream
→ inspect response
→ recover flag

## Security Lesson

Packet captures can reveal application-layer information when protocols
transmit data without adequate confidentiality protection.

Analysts should correlate:

- source and destination addresses
- ports
- protocols
- application behavior
- payload content

rather than relying on a single packet.


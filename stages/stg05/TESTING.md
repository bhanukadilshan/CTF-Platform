# STG-05 — Testing and Validation

## Artifact Validation

- [ ] generate_pcap.py executes successfully
- [ ] blackout_capture.pcap is created
- [ ] PCAP opens successfully in Wireshark
- [ ] tshark can read the capture
- [ ] capture contains multiple conversations
- [ ] capture contains background traffic
- [ ] suspicious exchange exists

## Challenge Validation

- [ ] suspicious hosts can be identified
- [ ] relevant protocol/service can be identified
- [ ] suspicious stream can be reconstructed
- [ ] final flag can be recovered
- [ ] flag uses the correct CTF{...} format

## Shortcut Testing

- [ ] PLAYER.md does not reveal the flag
- [ ] PLAYER.md does not identify suspicious IP addresses
- [ ] participant does not need generate_pcap.py
- [ ] capture does not contain real credentials
- [ ] capture contains no production/institutional traffic

## Wireshark Validation

Test:

Statistics → Protocol Hierarchy

Test:

Statistics → Conversations

Test filters:

tcp

tcp.port == 8080

ip.addr == 10.10.5.37

Verify that following the relevant TCP stream reveals the intended evidence.

## tshark Validation

Run:

tshark -r challenge/evidence/blackout_capture.pcap

Verify packet parsing succeeds.

## Reset Validation

Regenerate:

python3 challenge/scripts/generate_pcap.py

Verify that a clean challenge artifact is produced.

## Independent User Acceptance Test

Tester:

Date:

Completion time:

Hints used:

Unexpected solution paths:

Difficulty feedback:

Problems discovered:

Result:

PASS / FAIL


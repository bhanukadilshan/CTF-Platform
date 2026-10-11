# STG-05 — Reset and Recovery

STG-05 uses a static packet-capture artifact and therefore does not maintain
live challenge state.

## Normal Reset

Provide the participant with a fresh copy of:

challenge/evidence/blackout_capture.pcap

## Regenerate Artifact

From the Stage 5 root:

python3 challenge/scripts/generate_pcap.py

This recreates:

challenge/evidence/blackout_capture.pcap

## Verify

file challenge/evidence/blackout_capture.pcap

Optional:

tshark -r challenge/evidence/blackout_capture.pcap

## Clean-State Requirements

After regeneration:

- PCAP opens successfully
- background traffic exists
- suspicious exchange exists
- intended hosts remain identifiable
- intended TCP stream can be reconstructed
- stage flag remains recoverable
- no participant-created files are required


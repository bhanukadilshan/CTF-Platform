#!/usr/bin/env python3

from scapy.all import Ether, IP, TCP, UDP, DNS, DNSQR, Raw, wrpcap
import random
import time

OUTPUT = "challenge/evidence/blackout_capture.pcap"

packets = []
base_time = int(time.time()) - 3600


def stamp(packet, offset):
    packet.time = base_time + offset
    return packet


# ---------------------------------------------------------
# 1. Normal DNS background traffic
# ---------------------------------------------------------

dns_queries = [
    ("10.10.5.10", "8.8.8.8", "updates.cybervault.local"),
    ("10.10.5.15", "8.8.8.8", "portal.cybervault.local"),
    ("10.10.5.21", "8.8.8.8", "files.cybervault.local"),
]

offset = 1

for src, dst, query in dns_queries:

    pkt = (
        Ether()
        / IP(src=src, dst=dst)
        / UDP(sport=random.randint(40000, 60000), dport=53)
        / DNS(rd=1, qd=DNSQR(qname=query))
    )

    packets.append(stamp(pkt, offset))
    offset += 2


# ---------------------------------------------------------
# 2. Normal HTTP conversation
# ---------------------------------------------------------

client = "10.10.5.15"
server = "10.10.5.50"
sport = 49152

normal_http = [
    (
        client,
        server,
        sport,
        80,
        b"GET /status HTTP/1.1\r\n"
        b"Host: intranet.cybervault.local\r\n"
        b"User-Agent: CyberVault-Client/1.0\r\n\r\n",
    ),
    (
        server,
        client,
        80,
        sport,
        b"HTTP/1.1 200 OK\r\n"
        b"Content-Type: text/plain\r\n"
        b"Content-Length: 17\r\n\r\n"
        b"System operational",
    ),
]

for src, dst, sp, dp, data in normal_http:

    pkt = Ether() / IP(src=src, dst=dst) / TCP(
        sport=sp,
        dport=dp,
        flags="PA",
        seq=random.randint(1000, 5000),
    ) / Raw(load=data)

    packets.append(stamp(pkt, offset))
    offset += 3


# ---------------------------------------------------------
# 3. Additional ordinary traffic
# ---------------------------------------------------------

ordinary_messages = [
    b"backup-status=complete",
    b"service-health=normal",
    b"sync-status=success",
    b"inventory-check=complete",
]

for i, message in enumerate(ordinary_messages):

    pkt = (
        Ether()
        / IP(src="10.10.5.21", dst="10.10.5.60")
        / TCP(
            sport=51000 + i,
            dport=8080,
            flags="PA",
            seq=1000 + i,
        )
        / Raw(load=message)
    )

    packets.append(stamp(pkt, offset))
    offset += 2


# ---------------------------------------------------------
# 4. Suspicious conversation
# ---------------------------------------------------------

attacker_host = "10.10.5.37"
internal_server = "10.10.5.80"
suspicious_sport = 53321

request = (
    b"POST /incident/archive HTTP/1.1\r\n"
    b"Host: archive.cybervault.local\r\n"
    b"User-Agent: BlackoutSync/2.4\r\n"
    b"Content-Type: application/x-www-form-urlencoded\r\n"
    b"Content-Length: 41\r\n\r\n"
    b"case=blackout&request=incident_archive"
)

response = (
    b"HTTP/1.1 200 OK\r\n"
    b"Server: CyberVault-Archive\r\n"
    b"Content-Type: text/plain\r\n\r\n"
    b"Archive synchronization accepted.\n"
    b"Incident evidence recovered.\n"
    b"FLAG=CTF{wire_conversation_exposed}\n"
)

pkt1 = (
    Ether()
    / IP(src=attacker_host, dst=internal_server)
    / TCP(
        sport=suspicious_sport,
        dport=8080,
        flags="PA",
        seq=9000,
    )
    / Raw(load=request)
)

packets.append(stamp(pkt1, offset))
offset += 2

pkt2 = (
    Ether()
    / IP(src=internal_server, dst=attacker_host)
    / TCP(
        sport=8080,
        dport=suspicious_sport,
        flags="PA",
        seq=12000,
    )
    / Raw(load=response)
)

packets.append(stamp(pkt2, offset))


# ---------------------------------------------------------
# Write capture
# ---------------------------------------------------------

wrpcap(OUTPUT, packets)

print("[+] CyberVault STG-05 PCAP generated")
print(f"[+] Output: {OUTPUT}")
print(f"[+] Packets: {len(packets)}")

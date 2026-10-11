#!/bin/bash
set -e

FLAG='CTF{pixels_hide_more_than_they_show}'
PASSWORD='cybervault'

echo "$FLAG" > secret.txt

cat > secret.txt <<EOF2
CYBERVAULT INCIDENT RESPONSE
Evidence Classification: INTERNAL

Recovered artifact:

$FLAG

-- End of recovered evidence --
EOF2

steghide embed \
    -cf original.jpg \
    -ef secret.txt \
    -sf ../player/evidence.jpg \
    -p "$PASSWORD" \
    -f

exiftool \
    -Comment="IR NOTE: Project codename may unlock preserved evidence." \
    -Artist="CyberVault Incident Response Team" \
    -overwrite_original \
    ../player/evidence.jpg

echo "[+] STG-01 generated successfully."

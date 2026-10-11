#!/bin/bash

set -e

FLAG='CTF{weak_encoding_is_not_encryption}'

cat > plaintext.txt <<EOF
CYBERVAULT INTERCEPTED COMMUNICATION

The intercepted message was protected using two weak transformations.

Recovered access token:

$FLAG
EOF

tr 'A-Za-z' 'N-ZA-Mn-za-m' < plaintext.txt |
    base64 -w 0 > ../player/intercepted_message.txt

echo >> ../player/intercepted_message.txt

echo "[+] STG-02 generated successfully."

FROM debian:12-slim

RUN apt-get update && \
    apt-get install -y \
        openssh-server \
        sudo \
        procps \
        iproute2 \
        net-tools \
        findutils \
        file \
        curl \
        nano \
        vim-tiny && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /run/sshd /opt/blackout

RUN useradd -m -s /bin/bash analyst && \
    echo 'analyst:incident2026' | chpasswd

COPY challenge/blackout-monitor /usr/local/bin/blackout-monitor
COPY challenge/blackout.conf /opt/blackout/blackout.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod 755 /usr/local/bin/blackout-monitor && \
    chmod 664 /opt/blackout/blackout.conf && \
    chown root:analyst /opt/blackout/blackout.conf && \
    chmod 755 /entrypoint.sh

RUN echo 'analyst ALL=(root) NOPASSWD: /usr/local/bin/blackout-monitor' \
    > /etc/sudoers.d/blackout-monitor && \
    chmod 440 /etc/sudoers.d/blackout-monitor

RUN printf '%s\n' \
    'CTF{blackout_server_restored}' \
    > /root/final_flag.txt && \
    chmod 600 /root/final_flag.txt

RUN printf '%s\n' \
    '==================================================' \
    ' CYBERVAULT INCIDENT RESPONSE TERMINAL' \
    ' Asset: BLACKOUT-SRV' \
    '==================================================' \
    '' \
    'Limited analyst access granted.' \
    '' \
    'Mission:' \
    'Investigate the compromised server and determine' \
    'how a service configuration could expose protected' \
    'information.' \
    '' \
    'Recover the final CTF flag.' \
    '' \
    'Hint: Enumerate before you exploit.' \
    '==================================================' \
    > /etc/motd

EXPOSE 22

ENTRYPOINT ["/entrypoint.sh"]

---
title: "Azure Operator Nexus: How to upgrade the operating system of a Terminal Server"
description: Learn the process for upgrading the operating system of a Terminal Server
author: sushantjrao 
ms.author: sushrao
ms.date: 01/24/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---

#  Upgrading the operating system of a Terminal Server

This document provides a step-by-step guide to upgrade the operating system (OS) of a Terminal Server. The outlined procedure is manual and includes essential checks, a backup process, and actions for post-upgrade validation.

## **Prerequisites**

- **Root account password** for the Terminal Server.

- An **on-premises machine** with access to the Terminal Server for file transfers.

- Download **Latest firmware download**: [Opengear Firmware](https://ftp.opengear.com/download/opengear_appliances/OM/current/). 

>[!Note]
> This guide has been validated with Opengear firmware version 24.07.1.

## **Stage 1: Pre-upgrade checks (Terminal Server)**

### Check current version of Terminal Server

Run the following command on the Terminal Server.

```bash
cat /etc/version
```

```Example output
22.06.0
```
> [!Note]
> Ensure the current OS version is lower than the version you are upgrading to.

### LLDP Service check and enable

Run the following command on the Terminal Server. 

```bash
ogcli update services/lldp enabled=true
ogcli get services/lldp
```

```Expected output
description=""
enabled=true
physifs=[]
platform=""
```

### LLDP neighbor check

Run the following command on the Terminal Server.

```bash
lldpctl
```

```Expected neighbors: 
Mgmt Switch, PE2, PE1
```

### Ping connectivity check

Run the following command on the Terminal Server.

```bash
default_routes=$(ip route show default | awk '{print $3}')
for ip in $default_routes; do
    echo "Pinging $ip..."
    ping -c 4 $ip
done
```

```Expected output
Pinging 10.103.0.2...
PING 10.103.0.2 (10.103.0.2) 56(84) bytes of data.
64 bytes from 10.103.0.2: icmp_seq=1 ttl=64 time=0.319 ms
64 bytes from 10.103.0.2: icmp_seq=2 ttl=64 time=0.352 ms
64 bytes from 10.103.0.2: icmp_seq=3 ttl=64 time=0.334 ms
64 bytes from 10.103.0.2: icmp_seq=4 ttl=64 time=0.358 ms

--- 10.103.0.2 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3071ms
rtt min/avg/max/mdev = 0.319/0.340/0.358/0.015 ms
Pinging 10.103.0.6...
PING 10.103.0.6 (10.103.0.6) 56(84) bytes of data.
64 bytes from 10.103.0.6: icmp_seq=1 ttl=64 time=0.324 ms
64 bytes from 10.103.0.6: icmp_seq=2 ttl=64 time=0.344 ms
64 bytes from 10.103.0.6: icmp_seq=3 ttl=64 time=0.305 ms
64 bytes from 10.103.0.6: icmp_seq=4 ttl=64 time=0.340 ms

--- 10.103.0.6 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3065ms
rtt min/avg/max/mdev = 0.305/0.328/0.344/0.015 ms
```

### Create a backup of current configuration

Run the following command on Terminal Server.

```bash
ogcli export ogcli_export_<date>
```

## **Stage 2: Backup files (on-premises machine)**

### Transfer Backup files to on-premises machine

Run following command on the on-premises machine to copy the Terminal Server configuration and related files to the on-premises machine. 

```bash
mkdir ~/ts_backup
cd ~/ts_backup
scp -o MACs=umac-128-etm@openssh.com root@<ts_ip>:/etc/dhcp/dhcpd.conf ./
scp -r -o MACs=umac-128-etm@openssh.com root@<ts_ip>:/mnt/nvram/files/conf ./
scp -o MACs=umac-128-etm@openssh.com root@<ts_ip>:~/ogcli_export_<date> ./
scp -r -o MACs=umac-128-etm@openssh.com root@<ts_ip>:/mnt/nvram/nexus ./
scp -r -o MACs=umac-128-etm@openssh.com root@<ts_ip>:/mnt/nvram/opengear_provisioning_rev5 ./
```

>[!Note]
> Replace <ts_ip> with the Terminal Server IP.

## **Stage 3: Install firmware (Terminal Server)**

### Upload firmware

Upload the latest downloaded firmware from on premise machine to the Terminal Server.

```bash
scp -r -o MACs=umac-128-etm@openssh.com ./operations_manager-24.07.1-production-signed.raucb root@<ts_ip>:/tmp/
```

>[!Note]
> Replace <ts_ip> with the Terminal Server IP.<br>
> Ensure the file name corresponds to the specific firmware version being used. For example, <operations_manager-24.07.1-production-signed.raucb> is the file name for Opengear OS version 24.07.1. Adjust the file name accordingly for your firmware version.

### Initiate installation of firmware

Run the following command on the Terminal Server.

```bash
puginstall --reboot-after /tmp/operations_manager-24.07.1-production-signed.raucb
```
> [!Note]
The upgrade process takes 5–10 minutes, during which the Terminal Server will reboot automatically.


## **Stage 4: Cleanup (On-premises machine)**

### Remove backup and firmware

After confirming the successful upgrade, delete temporary files from the on-premises machine. 

```bash
rm -rf ~/ts_backup
rm -rf ./operations_manager-24.07.1-production-signed.raucb
```

>[!Note]
> Perform this action only once the Terminal Server has been upgraded successfully.


### Firmware upgrade failure

If the firmware upgrade fails, follow these steps:

1. Perform a **factory reset**:

    Run the following command on the Terminal Server.

   ```bash
   factory_reset
   ```

   Or, push the Erase button on the port-side panel twice with a bent paper clip while the unit is powered on.

2. Reinstall the latest firmware.

    Repeat the firmware installation process.

3. Reconfigure or restore the device from backup:

    Run the following command on the Terminal Server.

   ```bash
   ogcli restore <file_path>
   ```

### Next steps

[Reconfigure Device Post-Reset](howto-platform-prerequisites.md)
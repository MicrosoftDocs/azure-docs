---
title: How to Upgrade the operating system of a Terminal Server
description: Learn the process for upgrading the operating system of a Terminal Server
author: sushantjrao 
ms.author: sushrao
ms.date: 23/01/2024
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
---

#  Upgrading the operating system of a Terminal Server

This document provides a step-by-step guide to upgrade the operating system (OS) of a Terminal Server. The outlined procedure is manual and includes essential checks, a backup process, and actions for post-upgrade validation.

## **Prerequisites**

- **Root account password** for the Terminal Server.

- An **on-premises machine** with access to the Terminal Server for file transfers.

- Dow**Latest firmware download**: [Opengear Firmware](https://ftp.opengear.com/download/opengear_appliances/OM/current/). 

>[!Note:]
> This guide has been validated with Opengear firmware version 24.07.1.

## **Stage 1: Pre-Upgrade Checks (Terminal Server)**

### Check current version of Terminal Server

Run the following command on the Terminal Server to check the existing OS version.

```bash
cat /etc/version
```

```Example output
22.06.0
```
> [!Note:]
> Ensure the current OS version is lower than the version you are upgrading to.

### LLDP service check and enable

Run the following command on the Terminal Server to check and enable the LLDP service. 

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

Run the following command on the Terminal Server to check the LLDP neighbor.

```bash
lldpctl
```

```Expected neighbors: 
Mgmt Switch, PE2, PE1
```

### Ping connectivity check

Run the following command on the Terminal Server to perform a ping connectivity check.

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

### Backup current configuration

Execute following command on terminal server to create a backup of the current configuration.

```bash
ogcli export ogcli_export_<date>
```

## **Stage 2: Backup Files (on-premises machine)**

### Transfer Backup Files to on-nremises machine

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

>[!Note:]
> Replace <ts_ip> with the terminal server IP.

## **Stage 3: Install Firmware (Terminal Server)**

### Upload Firmware

Upload the latest downloaded firmware from on premise machine to the terminal server.

```bash
scp -r -o MACs=umac-128-etm@openssh.com ./operations_manager-24.07.1-production-signed.raucb root@<ts_ip>:/tmp/
```

>[!Note:]
> Replace <ts_ip> with the terminal server IP.<br>
> Make sure to update the file name while executing above command as `<operations_manager-24.07.1-production-signed.raucb>` is the file name of opengear OS version `24.07.1`. 

### Install Firmware

Run the following command on the Terminal Server to initiate the firmware installation:.

```bash
puginstall --reboot-after /tmp/operations_manager-24.07.1-production-signed.raucb
```
> {!Note:]
The upgrade process takes 5–10 minutes, during which the Terminal Server will reboot automatically.


## **Stage 4: Cleanup (On-Premises Machine)**

### Remove Backup and Firmware

After confirming the successful upgrade, delete temporary files from the on-premises machine. 

```bash
rm -rf ~/ts_backup
rm -rf ./operations_manager-24.07.1-production-signed.raucb
```

>[!Note:]
> Perform this action only once the terminal server has been upgraded successfully.


### Firmware Upgrade Failure

If the firmware upgrade fails, follow these steps:

1. Perform a **factory reset**:

    Run the following command on the terminal server to perform a factory reset.

   ```bash
   factory_reset
   ```

   Or, push the Erase button on the port-side panel twice with a bent paper clip while the unit is powered on.

2. Reinstall the latest firmware.

    Repeat the firmware installation process.

3. Reconfigure or restore the device from backup:

    Run the following command on the terminal server to reconfigure or restore the device from backup

   ```bash
   ogcli restore <file_path>
   ```

### Next Steps

[Reconfigure Device Post-Reset](howto-platform-prerequisites)
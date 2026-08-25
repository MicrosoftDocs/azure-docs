---
title: HA Cluster Node Default Config
description: Include File for HA Node Configuration
services:
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 06/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---

2. **[A]** Configure host name resolution.
   You can either use a DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file.

   Update the entries to match your IPs and hostnames.

   ```bash
   sudo vi /etc/hosts
   [...]
   # IP address of cluster node 1
   10.27.0.6    sap-cl1
   # IP address of cluster node 2
   10.27.0.7    sap-cl2
   # IP address of the load balancer's front-end configuration for SAP NetWeaver ASCS
   10.27.0.9    sapascs
   # IP address of the load balancer's front-end configuration for SAP NetWeaver ERS
   10.27.0.10   sapers
   # Add Any Additional Hostnames/IPs as needed for the Database and/or Additional Application Servers
   10.27.0.8    sapa01
   10.27.0.11   sapa02
   10.27.0.3    sapdb1
   10.27.0.4    sapdb2
   10.27.0.5    sapdb
   ```

3. **[A]** Configure TCP KeepAlive settings.
   
   To ensure communication channels between nodes aren't dropped, configure the following keepalive settings on both nodes. For more information, see SAP Note [1410736][sapnote-1410736-tcpkeepalive].

   ```bash
   # Check Current Settings:
   sudo sysctl -a --pattern net.ipv4.tcp_keepalive
   
   net.ipv4.tcp_keepalive_intvl = 75
   net.ipv4.tcp_keepalive_probes = 9
   net.ipv4.tcp_keepalive_time = 7200
   
   # Set the values:
   sudo vi /etc/sysctl.d/sap.conf
   
   net.ipv4.tcp_keepalive_intvl=75
   net.ipv4.tcp_keepalive_probes=9
   net.ipv4.tcp_keepalive_time=300
   
   # Apply the changes.
   sudo sysctl --system
   ```

4. **[A]** Configure the SWAP file.
   Follow [Create a SWAP partition for an Azure Linux VM][azdoc-vm-linux-swap] to configure a SWAP space for each VM.

[sapnote-1410736-tcpkeepalive]: https://me.sap.com/notes/1410736

[azdoc-vm-linux-swap]: https://learn.microsoft.com/troubleshoot/azure/virtual-machines/linux/create-swap-file-linux-vm
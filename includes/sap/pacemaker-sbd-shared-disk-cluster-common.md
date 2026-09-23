---
title: Pacemaker Cluster SBD Shared Disk Common Cluster Steps
description: Include File for Pacemaker Cluster SBD Shared Disk Common Cluster Steps
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
1. **[A]** Enable the SBD service.
   ```bash
   sudo systemctl enable sbd
   ```
1. **[A]** Enable software watchdog.
   ```bash
   echo softdog | sudo tee /etc/modules-load.d/softdog.conf
   sudo modprobe softdog
   ```
1. **[A]** Discover the iSCSI device ID.
   1. Determine mount point based on LUN number
      ```bash
      ls -l /dev/disk/azure/scsi1/lun1
      lrwxrwxrwx. 1 root root 12 Apr 16 20:22 /dev/disk/azure/scsi1/lun1 -> ../../../sdb
      ```
   1. Get the iSCSI device ID from mount.
      ```bash
      ls -l /dev/disk/by-id/scsi-3* | grep -i sdb
      lrwxrwxrwx. 1 root root  9 Apr 16 20:22 /dev/disk/by-id/scsi-360022480055c9f501a24256ea0f87617 -> ../../sdb
      ```
1. **[1]** Create the SBD device.
   ```bash
   sudo sbd -d /dev/disk/by-id/scsi-360022480055c9f501a24256ea0f87617 -1 60 -4 120 create
   ```
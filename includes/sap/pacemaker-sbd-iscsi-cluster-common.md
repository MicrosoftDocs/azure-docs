---
title: Pacemaker Cluster SBD iSCSI Target Common Setup Steps
description: Include File for Pacemaker Cluster SBD iSCSI Target Common Setup Steps
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
1. **[A]** Enable the required services.
   ```bash
   sudo systemctl enable sbd iscsi iscsid
   ```
1. **[A]** Enable software watchdog.
   ```bash
   echo softdog | sudo tee /etc/modules-load.d/softdog.conf
   sudo modprobe softdog
   ```
1. **[1]** Update the `InitiatorName` for node 1.
   ```bash
   sudo vi /etc/iscsi/initiatorname.iscsi
   [...]
   InitiatorName=iqn.2006-04.sap-cl1.local:sap-cl1
   ```
1. **[2]** Update the `InitiatorName` for node 2.
   ```bash
   # Node 2
   sudo vi /etc/iscsi/initiatorname.iscsi
   [...]
   InitiatorName=iqn.2006-04.sap-cl2.local:sap-cl2
   ```
1. **[A]** Restart the iSCSI services.
   ```bash
   sudo systemctl restart iscsi iscsid
   ```
1. **[A]** Mount the iSCSI targets from all the iSCSI host servers.
   ```bash
   for hostServer in sbd-iscsi1 sbd-iscsi2 sbd-iscsi3; do
      iscsiadm -m discovery --type=st --portal=${hostServer}:3260 
      iscsiadm -m node -T iqn.2006-04.ascsnw1.local:ascsnw1 --login --portal=${hostServer}:3260
      iscsiadm -m node --portal=${hostServer}:3260 -T iqn.2006-04.ascsnw1.local:ascsnw1 --op=update --name=node.startup --value=automatic
   done
   ```
1. **[A]** Discover the iSCSI device IDs.
   1. Determine the iSCSI mount points.
      ```bash
      lsscsi
      [0:0:0:0]    disk    Msft     Virtual Disk     1.0   /dev/sda
      [1:0:0:1]    disk    Msft     Virtual Disk     1.0   /dev/sdb
      [2:0:0:0]    disk    LIO-ORG  sbdascsnw1       4.0   /dev/sdc
      [3:0:0:0]    disk    LIO-ORG  sbdascsnw1       4.0   /dev/sdd
      [4:0:0:0]    disk    LIO-ORG  sbdascsnw1       4.0   /dev/sde
      ```
   1. Get the iSCSI device IDs.
      ```bash
      ls -l /dev/disk/by-id/scsi-3* | grep sd[c,d,e]
      lrwxrwxrwx 1 root root  9 Jul 21 18:02 /dev/disk/by-id/scsi-3600140537cf4c6d604a4ae4b58f1a528 -> ../../sdd
      lrwxrwxrwx 1 root root  9 Jul 21 17:50 /dev/disk/by-id/scsi-360014056e4d07b80e1148ac973330dff -> ../../sdc
      lrwxrwxrwx 1 root root  9 Jul 21 18:04 /dev/disk/by-id/scsi-360014059f135275c24647d49268123e5 -> ../../sde
      ```
1. **[1]** Create the SBD devices.
   ```bash
   sudo sbd -d /dev/disk/by-id/scsi-3600140537cf4c6d604a4ae4b58f1a528 -1 60 -4 120 create
   sudo sbd -d /dev/disk/by-id/scsi-360014056e4d07b80e1148ac973330dff -1 60 -4 120 create
   sudo sbd -d /dev/disk/by-id/scsi-360014059f135275c24647d49268123e5 -1 60 -4 120 create
   ```
---
title: HA Cluster Mount SAP NFS Shares
description: Include File for HA Cluster Mount SAP NFS Shares
services: azure-files,azure-netapp-files
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 06/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---

1. **[1]** Create the SAP Sub Directories on the NFS Share

   ```bash
   # Temporarily mount the volume.
   sudo mkdir -p /saptmp
   sudo mount -t nfs sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1 /saptmp -o noresvport,nfsvers=4.1,sec=sys

   # Create the SAP sub directories.
   cd /saptmp
   sudo mkdir -p sapmntNW1
   sudo mkdir -p usrsapNW1

   # Unmount the volume and delete the temporary directory.
   cd ..
   sudo umount /saptmp
   sudo rmdir /saptmp
   ```

1. **[A]** Create the mount point directories

   ```bash
   sudo mkdir -p /sapmnt/NW1
   sudo mkdir -p /usr/sap/NW1
   sudo mkdir -p /usr/sap/trans

   sudo chattr +i /sapmnt/NW1
   sudo chattr +i /usr/sap/NW1
   sudo chattr +i /usr/sap/trans
   ```

1. **[A]** Mount the NFS Shares

   ```bash
   sudo vi /etc/fstab
   [...]
   sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1 nfs noresvport,nfsvers=4.1,sec=sys,hard  0  0
   sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1/usrsapNW1 /usr/sap/NW1 nfs noresvport,nfsvers=4.1,sec=sys,hard  0  0
   sapnfsafs.file.core.windows.net:/saptrans /usr/sap/trans nfs noresvport,nfsvers=4.1,sec=sys,hard  0  0

   # Mount the file systems.
   sudo mount -a
   ```

   > [!Note]
   > For Encryption-in-Transit (EiT) enabled File systems, use `aznfs` as filesystem type in the mount command syntax. Read [Azure Files NFS Encryption in Transit for SAP on Azure Systems][azdoc-sap-afs-encryption], to learn how to enable EiT and mounting the file systems.


[azdoc-sap-afs-encryption]: ../../articles/sap/workloads/sap-azure-files-nfs-encryption-in-transit-guide.md
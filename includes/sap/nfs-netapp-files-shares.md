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

1. **[A]** Disable ID Mapping
   1. Edit the NFS domain setting. Make sure that the domain is configured as the default Azure NetApp Files domain, `defaultv4iddomain.com`. Also verify that the mapping is set to `nobody`.

      ```bash
      sudo vi /etc/idmapd.conf
      [General]
      Verbosity = 0
      Pipefs-Directory = /var/lib/nfs/rpc_pipefs
      Domain = defaultv4iddomain.com
      [...]
      [Mapping]
      Nobody-User = nobody
      Nobody-Group = nobody
      [...]
      ```

   1. Verify `nfs4_disable_idmapping`. It should be set to `Y`.

      To create the directory structure where `nfs4_disable_idmapping` is located, run the `mount` command. You're unable to manually create the directory under `/sys/modules` because access is reserved for the kernel and drivers.

      ```bash
      # Check nfs4_disable_idmapping.
      cat /sys/module/nfs/parameters/nfs4_disable_idmapping

      # If you need to set nfs4_disable_idmapping to Y:
      sudo mkdir /mnt/tmp
      sudo mount 10.27.1.5:/sapnw1 /mnt/tmp
      sudo umount /mnt/tmp
      echo "Y" | sudo tee /sys/module/nfs/parameters/nfs4_disable_idmapping

      # Make the configuration permanent.
      echo "options nfs nfs4_disable_idmapping=Y" | sudo tee -a /etc/modprobe.d/nfs.conf
      ```

1. **[1]** Temporarily mount the Azure NetApp Files volume on one of the VMs and create the SAP directories (file paths).
   ```bash
   # Temporarily mount the volume.
   sudo mkdir -p /saptmp
   sudo mount -t nfs -o rw,hard,rsize=65536,wsize=65536,nfsvers=4.1,sec=sys,tcp 10.27.1.5:/sapnw1 /saptmp

   # Create the SAP directories.
   cd /saptmp
   sudo mkdir -p sapmntNW1
   sudo mkdir -p usrsapNW1

   # Unmount the volume and delete the temporary directory.
   cd ..
   sudo umount /saptmp
   sudo rmdir /saptmp
   ```

1. **[A]** Create the shared directories.
   ```bash
   sudo mkdir -p /sapmnt/NW1
   sudo mkdir -p /usr/sap/NW1
   sudo mkdir -p /usr/sap/trans

   sudo chattr +i /sapmnt/NW1
   sudo chattr +i /usr/sap/NW1
   sudo chattr +i /usr/sap/trans
   ```

1. **[A]** Mount the file systems.
   ```bash
   sudo vi /etc/fstab
   [...]
   10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=4.1,sec=sys,hard 0 0
   10.27.1.5:/sapnw1/usrsapNW1 /usr/sap/NW1 nfs nfsvers=4.1,sec=sys,hard 0 0
   10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=4.1,sec=sys,hard 0 0

   # Mount the file systems.
   sudo mount -a
   ```

---

[azdoc-anf-nfs-convert]: ../../articles/azure-netapp-files/convert-nfsv3-nfsv41.md#convert-from-nfsv3-to-nfsv41
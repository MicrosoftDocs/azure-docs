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
zone_pivot_groups: sap-ha-nfs-solution
---
## Install SAP Database and Application Server

Some databases require you to execute the database installation on an application server. Prepare an application server, then trigger the Database installation, and finally install the Application Server.

The following common steps assume that you install the application server on a server that's different from the ASCS and HANA servers:

1. Configure host name resolution.

   You can either use a DNS server or modify `/etc/hosts` on all nodes. This example shows how to use the `/etc/hosts` file.

   Update the entries to match your IPs and Hostnames.

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

1. Configure the SWAP file.
   Follow [Create a SWAP partition for an Azure Linux VM][azdoc-vm-linux-swap] to configure a SWAP space for each VM.

1. Configure SAP Directories
   1. Create the Mount Points
      ```bash
      sudo mkdir -p /sapmnt/NW1
      sudo mkdir -p /usr/sap/trans
      
      sudo chattr +i /sapmnt/NW1
      sudo chattr +i /usr/sap/trans
      ```
   1. Mount the File Systems
      :::zone pivot="azurefiles"
         ```bash
         echo "sapnfsafs.file.core.windows.net:/sapnfsafs/sapnw1/sapmntNW1 /sapmnt/NW1 nfs noresvport,nfsvers=4.1,sec=sys  0  0" >> /etc/fstab
         echo "sapnfsafs.file.core.windows.net:/sapnfsafs/saptrans /usr/sap/trans nfs noresvport,nfsvers=4.1,sec=sys  0  0" >> /etc/fstab
         
         # Mount the file systems.
         mount -a
         ```
      :::zone-end
      :::zone pivot="anf"
         ```bash
         # NFSv4.1:
         echo "10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab
         echo "10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=4.1,sec=sys,hard 0 0" >> /etc/fstab

         # NFSv3:
         echo "10.27.1.5:/sapnw1/sapmntNW1 /sapmnt/NW1 nfs nfsvers=3,hard 0 0" >> /etc/fstab
         echo "10.27.1.5:/saptrans /usr/sap/trans nfs nfsvers=3,hard 0 0" >> /etc/fstab
         
         # Mount the file systems.
         mount -a
         ```
      :::zone-end
1. Install Database from Application Server

   In this example, SAP NetWeaver is installed on SAP HANA. You can use any supported database for this installation. For more information on how to install SAP HANA in Azure, see [High availability of SAP HANA on Azure virtual machines][azdoc-sap-hana-ha-rhel]. For a list of supported databases, see SAP Note [1928533][sapnote-1928533-supportedos].

   Install the SAP NetWeaver database instance as root by using a virtual host name that maps to the IP address of the load balancer's front-end configuration for the database. You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a nonroot user to connect to `sapinst`.
   
   ```bash
   sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
   ```

1. Install SAP NetWeaver on Application Server
   1. Install SAP
      You can use the `SAPINST_REMOTE_ACCESS_USER` parameter to allow a nonroot user to connect to `sapinst`.

      ```bash
      sudo <swpm>/sapinst SAPINST_REMOTE_ACCESS_USER=sapadmin
      ```
   1. Update hdbuserstore to point to the database cluster name
      List the entries
      ```bash
      #Run as SIDADM
      su - nw1adm

      hdbuserstore list
      DATA FILE       : /home/nw1adm/.hdb/sapa01/SSFS_HDB.DAT
      KEY FILE        : /home/nw1adm/.hdb/sapa01/SSFS_HDB.KEY
      
      KEY DEFAULT
        ENV : 10.27.0.3:30313
        USER: SAPABAP1
        DATABASE: NW1
      ```
      In this example, the IP address of the default entry points to the VM, not the load balancer. Change the entry to point to the virtual host name of the load balancer. Be sure to use the same port and database name. For example, use `30313` and `NW1` in the sample output.

      ```bash
      hdbuserstore SET DEFAULT sapdb:30313@NW1 SAPABAP1 <password of ABAP schema>
      ```
      


[azdoc-sap-hana-ha-rhel]: ../../articles/sap/workloads/sap-hana-high-availability-rhel.md

[sapnote-1928533-supportedos]: https://launchpad.support.sap.com/#/notes/1928533

[azdoc-vm-linux-swap]: https://learn.microsoft.com/troubleshoot/azure/virtual-machines/linux/create-swap-file-linux-vm
---
title: SAP Cluster Service Configuration
description: Include File for SAP Cluster Service Configuration
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 07/08/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---


2. **[1]** Adapt the instance profiles for running in a cluster.
   1. The ASCS and ERS profiles might contain `Restart_Program` configurations for certain instance services by default. Change these entries to `Start_Program` to prevent SAP from automatically restarting the enqueue replication process, because the cluster manages it. 
      1. ASCS Profile (Enqueue Server)
         ```bash
         sudo vi /sapmnt/NW1/profile/NW1_ASCS00_nw1ascs
         [...]
         #-----------------------------------------------------------------------
         # Start SAP enqueue server
         #-----------------------------------------------------------------------
         _ENQ = enq.sap$(SAPSYSTEMNAME)_$(INSTANCE_NAME)
         Execute_04 = local rm -f $(_ENQ)
         Execute_05 = local ln -s -f $(DIR_EXECUTABLE)/enq_server$(FT_EXE) $(_ENQ)
         Start_Program_01 = local $(_ENQ) pf=$(_PF)
         [...]
         ```
      1. ERS Profile (Enqueue Replicator)
         ```bash
         sudo vi /sapmnt/NW1/profile/NW1_ERS01_nw1ers
         [...]
         #-----------------------------------------------------------------------
         # Start enqueue replicator
         #-----------------------------------------------------------------------
         _ENQR = enqr.sap$(SAPSYSTEMNAME)_$(INSTANCE_NAME)
         Execute_02 = local rm -f $(_ENQR)
         Execute_03 = local ln -s -f $(DIR_EXECUTABLE)/enq_replicator$(FT_EXE) $(_ENQR)
         Start_Program_00 = local $(_ENQR) pf=$(_PF)
         [...]
         ```
   1. Remove `Autostart` from any instances in the cluster, as the cluster manages them.
   1. **ENSA1 only**: Add the Keepalive parameter to the ERS profile.
      ```bash
      sudo vi /sapmnt/NW1/profile/NW1_ERS01_nw1ers
      [...]
      enque/encni/set_so_keepalive = TRUE
      [...]
      ```

1. **[A]** Add the `sidadm` account to the `haclient` group to allow it to run cluster commands.

   ```bash
   sudo usermod -a -G haclient nw1adm
   ```

1. **[A]** Register ASCS and ERS services on both nodes. This step adds or updates the entries in the `/usr/sap/sapservices` file so that both services are listed.

   ```bash
   sudo LD_LIBRARY_PATH=/usr/sap/NW1/ASCS00/exe /usr/sap/NW1/ASCS00/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ASCS00_nw1ascs -reg
   sudo LD_LIBRARY_PATH=/usr/sap/NW1/ERS01/exe /usr/sap/NW1/ERS01/exe/sapstartsrv pf=/usr/sap/NW1/SYS/profile/NW1_ERS01_nw1ers -reg
   ```

1. **[A]** Ensure all SAP services are stopped and disabled on both nodes. The cluster manages them.
   ```bash
   # Run as sidadm
   sudo su - nw1adm
   sapcontrol -nr 00 -function Stop
   sapcontrol -nr 00 -function StopService
   
   sapcontrol -nr 01 -function Stop
   sapcontrol -nr 01 -function StopService
   #Log off of sidadm
   exit
   
   sudo systemctl disable SAPNW1_00
   sudo systemctl disable SAPNW1_01
   ```

1. **[A]** Enable `sapping` and `sappong` services.
   
   The `sapping` agent runs before `sapinit` to hide the `/usr/sap/sapservices` file. The `sappong` agent runs after `sapinit` to unhide the `sapservices` file during VM boot. `SAPStartSrv` isn't started automatically for an SAP instance at boot time, because the Pacemaker cluster manages it.

   ```bash
   sudo systemctl enable sapping
   sudo systemctl enable sappong
   ```
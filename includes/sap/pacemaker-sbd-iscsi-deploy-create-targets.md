---
title: Pacemaker Cluster SBD Create iSCSI Targets on Host Server
description: Include File for Pacemaker Cluster SBD Create iSCSI Targets on Host Server
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
### Create iSCSI targets

For each cluster, you need to provision an iSCSI disk on each iSCSI host server, and then grant every cluster node access to that disk. In this example, you create disks for two different clusters:
- ascsnw1: The ASCS/ERS cluster for NW1
- hdbnw1: The HANA Database cluster for NW1
- sap-cl1 and sap-cl2: Hostnames for the NW1 ASCS/ERS cluster nodes
- sap-db1 and sap-db2: Hostnames for the NW1 HANA cluster nodes

1. Create the root folder for all SBD devices.
   ```bash
   sudo mkdir /sbd
   ```
1. Create the SBD device for the first cluster (ascsnw1).
   ```bash
   # Create Storage Object
   sudo targetcli backstores/fileio create sbdascsnw1 /sbd/sbdascsnw1 50M write_back=false
   # Create iSCSI Target
   sudo targetcli iscsi/ create iqn.2006-04.ascsnw1.local:ascsnw1
   # Creates the LUN and attaches it to the iSCSI Target
   sudo targetcli iscsi/iqn.2006-04.ascsnw1.local:ascsnw1/tpg1/luns/ create /backstores/fileio/sbdascsnw1
   # Grant Cluster Node 1 (sap-cl1) access to the iSCSI Target
   sudo targetcli iscsi/iqn.2006-04.ascsnw1.local:ascsnw1/tpg1/acls/ create iqn.2006-04.sap-cl1.local:sap-cl1
   # Grant Cluster Node 2 (sap-cl2) access to the iSCSI Target
   sudo targetcli iscsi/iqn.2006-04.ascsnw1.local:ascsnw1/tpg1/acls/ create iqn.2006-04.sap-cl2.local:sap-cl2
   ```
1. Create the SBD device for the second cluster (hdbnw1).
   ```bash
   # Create Storage Object
   sudo targetcli backstores/fileio create sbdhdbnw1 /sbd/sbdhdbnw1 50M write_back=false
   # Create iSCSI Target
   sudo targetcli iscsi/ create iqn.2006-04.hdbnw1.local:hdbnw1
   # Creates the LUN and attaches it to the iSCSI Target
   sudo targetcli iscsi/iqn.2006-04.hdbnw1.local:hdbnw1/tpg1/luns/ create /backstores/fileio/sbdhdbnw1
   # Grant Cluster Node 1 (sap-db1) access to the iSCSI Target
   sudo targetcli iscsi/iqn.2006-04.hdbnw1.local:hdbnw1/tpg1/acls/ create iqn.2006-04.sap-db1.local:sap-db1
   # Grant Cluster Node 2 (sap-db2) access to the iSCSI Target
   sudo targetcli iscsi/iqn.2006-04.hdbnw1.local:hdbnw1/tpg1/acls/ create iqn.2006-04.sap-db2.local:sap-db2
   ```
1. Save the configuration.
   ```bash
   sudo targetcli saveconfig
   ```
1. Verify the setup.
   ```bash
   sudo targetcli ls

   o- / ............................................................................................... [...]
     o- backstores .................................................................................... [...]
     | o- block ........................................................................ [Storage Objects: 0]
     | o- fileio ....................................................................... [Storage Objects: 2]
     | | o- sbdascsnw1 ..................................... [/sbd/sbdascsnw1 (50.0MiB) write-thru activated]
     | | | o- alua ......................................................................... [ALUA Groups: 1]
     | | |   o- default_tg_pt_gp ............................................. [ALUA state: Active/optimized]
     | | o- sbdhdbnw1 ....................................... [/sbd/sbdhdbnw1 (50.0MiB) write-thru activated]
     | |   o- alua ......................................................................... [ALUA Groups: 1]
     | |     o- default_tg_pt_gp ............................................. [ALUA state: Active/optimized]
     | o- pscsi ........................................................................ [Storage Objects: 0]
     | o- ramdisk ...................................................................... [Storage Objects: 0]
     o- iscsi .................................................................................. [Targets: 2]
     | o- iqn.2006-04.hdbnw1.local:hdbnw1 ......................................................... [TPGs: 1]
     | | o- tpg1 ..................................................................... [no-gen-acls, no-auth]
     | |   o- acls ................................................................................ [ACLs: 2]
     | |   | o- iqn.2006-04.sap-db1.local:sap-db1 .......................................... [Mapped LUNs: 1]
     | |   | | o- mapped_lun0 ..................................................... [lun0 fileio/sbdhdb (rw)]
     | |   | o- iqn.2006-04.sap-db2.local:sap-db2 .......................................... [Mapped LUNs: 1]
     | |   |   o- mapped_lun0 ..................................................... [lun0 fileio/sbdhdb (rw)]
     | |   o- luns ................................................................................ [LUNs: 1]
     | |   | o- lun0 ................................. [fileio/sbdhdbnw1 (/sbd/sbdhdbnw1) (default_tg_pt_gp)]
     | |   o- portals .......................................................................... [Portals: 1]
     | |     o- 0.0.0.0:3260 ........................................................................... [OK]
     | o- iqn.2006-04.ascsnw1.local:ascsnw1 ....................................................... [TPGs: 1]
     |   o- tpg1 ..................................................................... [no-gen-acls, no-auth]
     |     o- acls ................................................................................ [ACLs: 2]
     |     | o- iqn.2006-04.sap-cl1.local:sap-cl1 .......................................... [Mapped LUNs: 1]
     |     | | o- mapped_lun0 ................................................. [lun0 fileio/sbdascsnw1 (rw)]
     |     | o- iqn.2006-04.sap-cl2.local:sap-cl2 .......................................... [Mapped LUNs: 1]
     |     |   o- mapped_lun0 ................................................. [lun0 fileio/sbdascsnw1 (rw)]
     |     o- luns ................................................................................ [LUNs: 1]
     |     | o- lun0 ............................... [fileio/sbdascsnw1 (/sbd/sbdascsnw1) (default_tg_pt_gp)]
     |     o- portals .......................................................................... [Portals: 1]
     |       o- 0.0.0.0:3260 ........................................................................... [OK]
     o- loopback ............................................................................... [Targets: 0]
   ```
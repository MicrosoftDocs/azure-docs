---
title: Disaster recovery using Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Explains how to perform disaster recovery when using the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 04/21/2021
ms.author: phjensen
---

# Disaster recovery using Azure Application Consistent Snapshot tool

This article explains how to perform disaster recovery when using the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

> [!IMPORTANT]
> This operation applies to **Azure Large Instance** only.

## Introduction

The Azure Large Instance platform can also have a Disaster Recovery site configured where storage volume snapshots can be replicated to.  If snapshots have been configured correctly with such a setup, then it is possible to perform a Disaster Recovery at this site.  This document is intended to be a guide to performing Disaster Recovery for this setup.

## Prerequisites for disaster recovery setup

The following pre-requisites must be met before you plan the disaster recovery failover.

- You have a DR node provisioned at the DR site. There are two options for DR. One is normal DR, and other is multipurpose DR.
- You have storage replication working. The Microsoft operations team performs the storage replication setup at the time of DR provisioning automatically. You can monitor the storage replication using the command `azacsnap -c details --details replication` at the DR site.
- You have set up and configured storage snapshots at the primary location.
- You have an HANA instance installed at the DR site for the primary with the same SID as the primary instance has.
- You read and understand the DR Failover procedure described in [SAP HANA Large Instances high availability and disaster recovery on Azure](../virtual-machines/workloads/sap/hana-failover-procedure.md)
- You have set up and configured storage snapshots at the DR location.
- A configuration file (for example, `DR.json`) has been created with the DR storage volumes and associated
    information on the DR server.
- You completed the steps at the DR site to:
  - Enable communication with storage.
  - Enable communication with SAP HANA.

## Set up disaster recovery

Microsoft supports storage level replication for DR recovery. There are two ways to set up DR.

One is **normal** and other is **multipurpose**. In the **normal** DR, you have a dedicated instance at the DR location for failover. In the **multipurpose** DR scenario, you have another QA or development HANA instance running on the HANA large instance unit at the DR site. But you also installed a pre-installed HANA instance that is dormant and has the same SID as the HANA instance you want to fail over to that HANA Large Instance unit. Microsoft operations set up the environment for you including the storage replication based on the input provided in the Service Request Form (SRF) at the time of onboarding.

> [!IMPORTANT]
> Ensure that all the prerequisites are met for the DR setup.

## Monitor data replication from Primary to DR site

Microsoft operations team already manage and monitor the DR link from Primary site to the DR site.
You can monitor the data replication from your primary server to DR server using the snapshot
command `azacsnap -c details --details replication`.

## Perform a failover to DR site

Run the failover command at the DR site (`azacsnap -c restore --restore revertvolume`).

> [!IMPORTANT]
> The `azacsnap -c restore --restore revertvolume` command breaks the storage replication from the Production site to the DR site. You must reach out to the Microsoft Operations to set up replication again. Once the replication is re-enabled, all the data at DR storage for this SID will get initialized. The command that performs the failover makes available the most recently replicated storage snapshot. If you need to restore back to an older snapshot, open a support request so operations can assist to provide an earlier snapshot restored in the DR site.

At a high level, here are the steps to follow for DR failover:

- You must shut down the HANA instance at **primary** site. This action is needed only if you are truly
    doing the failover to DR site so you don't have data inconsistencies.
- Shut down the HANA instance on the DR node for the production SID.
- Execute the command `azacsnap -c restore --restore revertvolume` on the DR node with the SID to be recovered
  - The command breaks the storage replication link from the Primary to the DR site
  - The command restores the /data and /logbackups volume only, /shared volume is NOT recovered, but rather it uses the existing /shared for SID at the DR location.
  - Mount the /data and /logbackups volume – ensure to add it to the fstab file
- Restore the HANA SYSTEMDB snapshot. HANA studio only shows you the latest HANA snapshot available under the storage snapshot restored as part of the command `azacsnap -c restore --restore revertvolume` execution.
- Recover the tenant database.
- Start the HANA instance on the DR site for the Production SID (Example: H80 in this case).
- Perform testing.

### Example performing Disaster Recovery

This subsection describes the detailed steps for a failover to the Disaster Recovery site.

#### Step 1: Get the volume details of the DR node

Execute the command `df –h` to list the filesystems and associated volumes to refer to after the failover.

```bash
df -h
```

```output
Filesystem Size Used Avail Use% Mounted on
devtmpfs 378G 8.0K 378G 1% /dev
tmpfs 569G 0 569G 0%
/dev/shm
tmpfs 378G 18M 378G 1% /run
tmpfs 378G 0 378G 0%
/sys/fs/cgroup
/dev/mapper/3600a098038304445622b4b584c575a66-part2 47G 20G 28G 42% /
/dev/mapper/3600a098038304445622b4b584c575a66-part1 979M 57M 856M 7% /boot
172.18.20.241:/hana_log_h80_mnt00003_t020_vol 512G 2.1G 510G 1% /hana/log/H80/mnt00003
172.18.20.241:/hana_log_h80_mnt00001_t020_vol 512G 5.5G 507G 2% /hana/log/H80/mnt00001
172.18.20.241:/hana_data_h80_mnt00003_t020_vol 1.2T 332M 1.2T 1% /hana/data/H80/mnt00003
172.18.20.241:/hana_log_h80_mnt00002_t020_vol 512G 2.1G 510G 1% /hana/log/H80/mnt00002
172.18.20.241:/hana_data_h80_mnt00002_t020_vol 1.2T 300M 1.2T 1% /hana/data/H80/mnt00002
172.18.20.241:/hana_data_h80_mnt00001_t020_vol 1.2T 6.4G 1.2T 1% /hana/data/H80/mnt00001
172.18.20.241:/hana_shared_h80_t020_vol/usr_sap_node1 2.7T 11G 2.7T 1% /usr/sap/H80
tmpfs 76G 0 76G 0% /run/user/0
172.18.20.241:/hana_shared_h80_t020_vol 2.7T 11G 2.7T 1% /hana/shared
172.18.20.241:/hana_data_h80_mnt00001_t020_xdp 1.2T 6.4G 1.2T 1% /hana/data/H80/mnt00001
172.18.20.241:/hana_data_h80_mnt00002_t020_xdp 1.2T 300M 1.2T 1% /hana/data/H80/mnt00002
172.18.20.241:/hana_data_h80_mnt00003_t020_xdp 1.2T 332M 1.2T 1% /hana/data/H80/mnt00003
172.18.20.241:/hana_log_backups_h80_t020_xdp 512G 15G 498G 3% /hana/logbackups/H80_T250
```

#### Step 2: Shut down HANA on the Primary site

If performing a complete failover of production workloads, and it is possible to connect to the Primary production site, then shut down the SAP HANA instance(s) being failed over to DR.

For example, if logged in as root the following example shows how SAP HANA can be shut down.  Replace <sid> with your SAP HANA SID.

```bash
su - <sid>adm
HDB stop
```

#### Step 3: Shut down HANA on DR site

It is important to shut down SAP HANA on the DR site before restoring the volumes.

For example, if logged in as root the following example shows how SAP HANA can be shut down.  Replace <sid> with your SAP HANA SID.

```bash
su - <sid>adm
HDB stop
```

> [!IMPORTANT]
> Make sure the HANA instances on the DR site are off-line before restoring any volumes.

#### Step 4: Restore the volumes

```bash
azacsnap -c restore --restore revertvolume --dbsid H80
```

**_Output of the DR failover command_**.

```bash
azacsnap --configfile DR.json -c restore --restore revertvolume --dbsid H80
```

```output
* This program is designed for those customers who have previously installed the
  Production HANA instance in the Disaster Recovery Location either as a
  stand-alone instance or as part of a multi-purpose environment.
* This program should be executed from the Disaster Recovery location otherwise
  unintended consequences may result.
* This program is intended to allow the customer to complete a Disaster Recovery
  failover.
* Any other restore points must be handled by Microsoft Operations.
* All volumes ('data' and 'other') are reverted to their most recent snapshot.
* The SnapMirror replication relationship between Prod and DR will be broken.

  CAUTION: a failback will be required after running this command and failback
   might not be a quick process and will require multiple steps in coordination
   with Microsoft Operations.

Do you wish to continue? (y/n) [n]: y
Checking state of HLI volumes for SID 'H80'
Configured volumes (Data and Other) are not quiesced for revert, will retry in 00:00:10 seconds
Volumes All Ok to Revert = True
Reverting volume 'hana_data_h80_mnt00001_t020_xdp' to snapshot 'H80_HANA_DATA_30MIN.2020-09-16_0330.0'
DR.json Data Volume #1 'hana_data_h80_mnt00001_t020_xdp' assigning to mountpoint 'mnt00001'
Reverting volume 'hana_log_backups_h80_t020_xdp01' to snapshot 'H80_HANA_LOGS_3MIN_X9.2020-09-16_0339.recent'
DR.json Other Volume #1 'hana_log_backups_h80_t020_xdp01' assigning to mountpoint '01'
HLI Volume revert completed for SID 'H80'
Displaying Mount Points by Volume as follows:
10.50.251.34:/hana_data_h80_mnt00001_t020_xdp  /hana/data/H80/mnt00001 nfs  rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
10.50.251.36:/hana_log_backups_h80_t020_xdp01  /hana/log_backups/H80/01 nfs rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
*********************  HANA DR Restore Steps  **********************************
* Please complete the following steps to recover your HANA database:           *
* 1. Ensure ALL the target mount points exist to mount the snapshot clones.    *
*    e.g. mkdir /hana/logbackups/H99_SOURCE                                    *
* 2. Add Mount Point Details from 'Displaying Mount Points by Volume' as       *
*    output above into /etc/fstab of DR Server.                                *
* 3. Mount newly added filesystems.                                            *
* 4. Perform HANA Snapshot Recovery using HANA Studio.                         *
********************************************************************************
```

> [!NOTE]
> The steps at the end of the console display need to be taken to complete the storage preparation for a DR failover.

#### Step 5: Unmount unnecessary filesystems

Execute the command `umount` to unmount the filesystems/volumes that are not needed.

```bash
umount <Mount point>
```

Unmount the data and log backup mountpoints. You may have multiple data mountpoint in the scale-out scenario.

#### Step 6: Configure the mount points

Modify the file `/etc/fstab` to comment out the data and log backups entries for the primary SID (In this example, SID=H80) and add the new mount point entries created from the Primary site DR volumes. The new mount point entries are provided in the command output.

- Comment out the existing mount points running on the DR site with the `#` character:

  ```output
  #172.18.20.241:/hana_data_h80_mnt00001_t020_vol /hana/data/H80/mnt00001 nfs     rw,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
  #172.18.20.241:/hana_log_backups_h80_t020 /hana/logbackups/H80 nfs rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
  ```

- Add the following lines to `/etc/fstab`
  > this should be the same output from the command

  ```output
  10.50.251.34:/hana_data_h80_mnt00001_t020_xdp  /hana/data/H80/mnt00001 nfs  rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
  10.50.251.36:/hana_log_backups_h80_t020_xdp01  /hana/log_backups/H80/01 nfs rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
  ```

#### Step 7: Mount the recovery volumes

Execute the command `mount –a` to mount all the mount points.

```bash
mount -a
```

Now, If you execute `df –h` you should see the `*_dp` volumes mounted.

```bash
df -h
```

```output
Filesystem Size Used Avail Use% Mounted on
devtmpfs 378G 8.0K 378G 1% /dev
tmpfs 569G 0 569G 0% /dev/shm
tmpfs 378G 18M 378G 1% /run
tmpfs 378G 0 378G 0% /sys/fs/cgroup
/dev/mapper/3600a098038304445622b4b584c575a66-part2 47G 20G 28G 42% /
/dev/mapper/3600a098038304445622b4b584c575a66-part1 979M 57M 856M 7% /boot
172.18.20.241:/hana_log_h80_mnt00003_t020_vol 512G 2.1G 510G 1% /hana/log/H80/mnt00003
172.18.20.241:/hana_log_h80_mnt00001_t020_vol 512G 5.5G 507G 2% /hana/log/H80/mnt00001
172.18.20.241:/hana_data_h80_mnt00003_t020_vol 1.2T 332M 1.2T 1% /hana/data/H80/mnt00003
172.18.20.241:/hana_log_h80_mnt00002_t020_vol 512G 2.1G 510G 1% /hana/log/H80/mnt00002
172.18.20.241:/hana_data_h80_mnt00002_t020_vol 1.2T 300M 1.2T 1% /hana/data/H80/mnt00002
172.18.20.241:/hana_data_h80_mnt00001_t020_vol 1.2T 6.4G 1.2T 1% /hana/data/H80/mnt00001
172.18.20.241:/hana_shared_h80_t020_vol/usr_sap_node1 2.7T 11G 2.7T 1% /usr/sap/H80
tmpfs 76G 0 76G 0% /run/user/0
172.18.20.241:/hana_shared_h80_t020_vol 2.7T 11G 2.7T 1% /hana/shared
172.18.20.241:/hana_data_h80_mnt00001_t020_xdp 1.2T 6.4G 1.2T 1% /hana/data/H80/mnt00001
172.18.20.241:/hana_data_h80_mnt00002_t020_xdp 1.2T 300M 1.2T 1% /hana/data/H80/mnt00002
172.18.20.241:/hana_data_h80_mnt00003_t020_xdp 1.2T 332M 1.2T 1% /hana/data/H80/mnt00003
172.18.20.241:/hana_log_backups_h80_t020_xdp 512G 15G 498G 3% /hana/logbackups/H80_T250
```

#### Step 8: Recover the SYSTEMDB

From the HANA Studio, right-click SYSTEMDB instance and chose "Backup and Recovery", and then "Recover System Database"

See the guide to recover a database from a snapshot, specifically the SYSTEMDB.

#### Step 9: Recover the Tenant database

From the HANA Studio, right-click SYSTEMDB instance and chose "Backup and Recovery", and then "Recover Tenant Database".

See the guide to recover a database from a snapshot, specifically the TENANT database(s).

### Run `azacsnap -c backup` at the DR site

If you are running snapshot-based backups at the DR site, then the HANA Server Name configured in the `azacsnap` configuration file at the DR site should be the same as the production server name.

> [!IMPORTANT]
> Running the `azacsnap -c backup` can create storage snapshots at the DR site, these are not automatically replicated to another site.  Work with Microsoft Operations to better understand returning any files or data back to the original production site.

## Next steps

- [Get snapshot details](azacsnap-cmd-ref-details.md)
- [Take a backup](azacsnap-cmd-ref-backup.md)

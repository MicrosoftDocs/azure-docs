---
title: Restore using Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for running the restore command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 05/04/2023
ms.author: phjensen
---

# Restore using Azure Application Consistent Snapshot tool

This article provides a guide for running the restore command of the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

> [!NOTE]
> The restore command is only available for Azure Large Instance and Azure NetApp Files.  Any restores of Azure Managed Disk must be done using the Azure Portal or Azure CLI.
    
## Introduction

Doing a volume restore from a snapshot is done using the `azacsnap -c restore` command.

> [!IMPORTANT]
> This does not perform a database recovery, only a restore of volume(s) as described for each of the options below.

## Command options

The `-c restore` command has the following options:

- `--restore snaptovol` Creates a new volume based on a volume snapshot. This command creates a new "cloned" volume for each volume in the configuration file, by default using the latest volume snapshot as the base to create the new volume.  For data volumes it's possible to select a snapshot to clone by using the option `--snapshotfilter <Snapshot Name>`, this will only complete if ALL data volumes have that same snapshot.  This command does not interrupt the storage replication from primary to secondary. Instead clones of the snapshot are created at the same location and recommended filesystem mountpoints of the cloned volumes are presented. If using on Azure Large Instance system this command should be run **in the DR region** (that is, the target fail-over system).

- `--restore revertvolume` Reverts the target volume to a prior state based on a volume snapshot.  Using this command as part of DR Failover into the paired DR region. This command **stops** storage replication from the primary site to the secondary site, and reverts the target DR volume(s) to their latest available snapshot on the DR volumes along with recommended filesystem mountpoints for the reverted DR volumes. If using on Azure Large Instance system this command should be run **in the DR region** (that is, the target fail-over system).
  
  > [!WARNING]
  > The revertvolume option is data destructive as any content stored in the volumes after the snapshot chosen to revert to will be lost and is not recoverable.

  > [!TIP]
  > After doing a revertvolume it is recommended the volume is remounted to ensure there are no stale file handles.  This can be done using `mount -o remount <mount_point>`.

- `--dbsid <SAP HANA SID>` is the database SID as specified in the configuration file to apply the volume restore commands to.

- `[--configfile <config filename>]` is an optional parameter allowing for custom configuration file names.

## Perform a test DR failover `azacsnap -c restore --restore snaptovol`

This command is like the "full" DR Failover command (`--restore revertvolume`), but rather than breaking the replication between the primary site and the disaster recovery site, a clone volume is created out of the disaster recovery volumes, allowing the restoration of the most recent snapshot in the DR site. Those cloned volumes are then usable by the customer to test Disaster Recovery without having to
execute a complete failover of their HANA environment that breaks the replication agreement between the primary site and the disaster recovery site.

- Multiple different restore points can be tested in this way,
each with their own restoration point.
- The clone is designated by the time-stamp at when the command was executed and represents the most recent data and other snapshot
available when run.

> [!IMPORTANT]
> This operation applies only to Azure Large Instance.
>
> - When the this command is executed it requires the contact email for operations to liaise with prior to the deletion of the clones after 4 weeks.
> - Each execution of the this command will creates a new clone that must be deleted by Microsoft Operations when the test is concluded.
> - Any clone volumes created will be automatically deleted after 4 weeks.

The configuration file (for example, `DR.json`) should contain the DR volumes only and not the Production
volumes, otherwise the Production volumes could have clones created.

### Output of the `azacsnap -c restore --restore snaptovol` command (for Single-Node scenario)

```output
> azacsnap --configfile DR.json -c restore --restore snaptovol --dbsid H80
* This program is designed for those customers who have previously installed the
  Production HANA instance in the Disaster Recovery Location either as a
  stand-alone instance or as part of a multi-purpose environment.
* This program should be executed from the Disaster Recovery location otherwise
  unintended consequences may result.
* This program is intended to allow the customer to simulate a Disaster Recovery
  failover without actually requiring a failover and subsequent failback.
* Any other restore points must be handled by Microsoft Operations.
* As part of the process, a clone is created of the each of the 'data' and 'other'
  volumes per the configuration file.

Do you wish to continue? (y/n) [n]: y

About to create clones of volumes based on the latest snapshot, these will be
kept for 4 weeks before being automatically deleted by Microsoft Operations.
Enter an email address to contact when deleting clones: <b>person@nowhere.com</b>
Checking state of HLI volumes for SID 'PEW'
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Configured volumes (Data and Other) are not ready to clone, will retry in 00:00:10 seconds
Displaying Mount Points by Volume as follows:
10.50.251.34:/hana_data_h80_sapprdhdb80_mnt00001_t020_xdp_rwclone_20200916_0256  /hana/data/H80/mnt00001 nfs  rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
10.50.251.36:/hana_log_backups_h80_sapprdhdb80_t020_xdp_rwclone_20200916_0256  /hana/log_backups/H80/01 nfs  rw,bg,hard,timeo=600,vers=4,rsize=1048576,wsize=1048576,intr,noatime,lock 0 0
*******************  HANA Test DR Restore Steps  ******************************
* Complete the following steps to recover your HANA database:           *
* 1. Ensure ALL the target mount points exist to mount the snapshot clones.    *
*    e.g. mkdir /hana/logbackups/H99_SOURCE                                    *
* 2. Add Mount Point Details from 'Displaying Mount Points by Volume' as       *
*    output above into /etc/fstab of DR Server.                                *
* 3. Mount newly added filesystems.                                            *
* 4. Perform HANA Snapshot Recovery using HANA Studio.                         *
********************************************************************************
*  These snapshot copies (clones) are kept for 4 weeks before                  *
*  being automatically removed.                                                *
*  Please contact Microsoft Operations to delete them earlier.                 *
********************************************************************************
```

> [!IMPORTANT]
> The "Displaying Mount Points by Volume" output is different for the various scenarios.

## Perform full DR failover `azacsnap -c restore --restore revertvolume`

This command **stops** storage replication from the primary site to the  secondary site, restores the latest snapshot on the DR volumes, and provides the mountpoints for the DR volumes.

This command MUST be executed on the DR server using a configuration file (for example, `DR.json`) with DR volumes ONLY!

Perform a failover to DR site, by executing the command `azacsnap -c restore --restore revertvolume`.  This command requires a SID to be added as a parameter. This is the SID of the HANA instance,
which needs to be recovered at the DR site.

> [!IMPORTANT]
> Only run this command if you are planning to perform the DR exercise or a test. This command breaks the replication. You must contact Microsoft Operations to re-enable replication.

At the high level, here are the steps for executing a DR failover:

- You must shut down the HANA instance at **primary** site. This action is needed only if you are truly
    doing the failover to DR site to avoid data inconsistencies.
- Shut down the HANA instance on the DR node for the production SID.
- Execute the command `azacsnap -c restore --restore revertvolume` on the DR node with the  SID to be recovered.
  - The command breaks the storage replication link from the Primary to the DR site
  - The command restores the "data" and "other" volumes as configured.  Typically, this operation would be for the volumes for the `/hana/data` and `/hana/logbackups` filesystems.  The `/hana/shared` filesystem is NOT recovered, but rather it uses the existing `/hana/shared` for SID at the DR location.
  - Mount the `/hana/data` and `/hana/logbackups` volumes – ensure they're added to the `/etc/fstab` file
- Restore the HANA SYSTEMDB snapshot. HANA studio only shows you the latest HANA snapshot available under the storage snapshot restored as part of the snapshot command `azacsnap -c restore --restore revertvolume` execution.
- Recover the tenant database.
- Start the HANA instance on the DR site for the Production SID (Example: H80 in this case).
- Perform any database testing.

## Next steps

- [Take a backup](azacsnap-cmd-ref-backup.md)
- [Get snapshot details](azacsnap-cmd-ref-details.md)

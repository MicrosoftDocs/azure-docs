---
title: What is Azure Application Consistent Snapshot Tool | Microsoft Docs
description: Provides an introduction for the Azure Application Consistent Snapshot Tool that you can use with Azure NetApp Files. 
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
ms.topic: conceptual
ms.date: 12/14/2020
ms.author: phjensen
---

# What is Azure Application Consistent Snapshot Tool (preview)

Azure Application Consistent Snapshot Tool (AzAcSnap) is a command-line tool that enables you to simplify data protection for third-party databases (SAP HANA) in Linux environments (for example, SUSE and RHEL).  

## Benefits of using AzAcSnap

AzAcSnap leverages the volume snapshot and replication functionalities in Azure NetApp Files and Azure Large Instance.  It provides the following benefits:

- **Application-consistent data protection**
    AzAcSnap is a centralized solution for backing up critical database files. It ensures database consistency before performing a storage volume snapshot. As a result, it ensures that the storage volume snapshot can be used for database recovery.
- **Database catalog management**
    When you use AzAcSnap with a database that has a built-in backup catalog, the records within the catalog are kept current with storage snapshots.  This capability allows a database administrator to see the backup activity.
- **Ad hoc volume protection**
    This capability is helpful for non-database volumes that don't need application quiescing before taking a storage snapshot.  Examples include SAP HANA log-backup volumes or SAPTRANS volumes.
- **Cloning of storage volumes**
    This capability provides space-efficient storage volume clones for development and test purposes.
- **Support for disaster recovery**
    AzAcSnap leverages storage volume replication to provide options for recovering replicated application-consistent snapshots at a remote site.

AzAcSnap is a single binary.  It does not need additional agents or plug-ins to interact with the database or the storage (Azure NetApp Files via Azure Resource Manager, and Azure Large Instance via SSH).  AzAcSnap must be installed on a system that has connectivity to the database and the storage.  However, the flexibility of installation and configuration allows for either a single centralized installation or a fully distributed installation with copies installed on each database installation.

## Architecture overview

AzAcSnap can be installed on the same host as the database (SAP HANA), or it can be installed on a centralized system.  But, there must be network connectivity to the database servers and the storage back-end (Azure Resource Manager for Azure NetApp Files or SSH for Azure Large Instance).

AzAcSnap is a lightweight application that is typically executed from an external scheduler.  On most Linux systems, this operation is `cron`, which is what the documentation will focus on.  But the scheduler could be an alternative tool as long as it can import the `azacsnap` user's shell profile.  Importing the user's environment settings ensures file paths and permissions are initialized correctly.

## Command synopsis

The general format of the commands is as follows:
`azacsnap -c [command] --[command] [sub-command] --[flag-name] [flag-value]`.

## Command options

The command options are as follows with the commands as the main bullets and the associated sub-commands as indented bullets:

- **`-h`** provides extended command-line help with examples on AzAcSnap usage.
- **`-c configure`** This command provides an interactive Q&A style interface to create or modify the `azacsnap` configuration file (default = `azacsnap.json`).
  - **`--configuration new`** will create a new config file.
  - **`--configuration edit`** will edit an existing config file.
  - see the [configure](azacsnap-cmd-ref-configure.md) command reference.
- **`-c test`** to test the validate the configuration file and test connectivity.
  - **`--test hana`**  tests the connection to the SAP HANA instance.
  - **`--test storage`** tests communication with the underlying storage interface by creating a temporary storage snapshot on all the configured `data` volumes, and then removing them.
  - **`--test all`** will perform both the `hana` and `storage` tests in sequence.
  - see the [test](azacsnap-cmd-ref-test.md) command reference.
- **`-c backup`** is the primary command to execute database consistent storage snapshots for data (SAP HANA data volumes) & other (for example, shared, log backups, or boot) volumes.
  - **`--volume data`** to snapshot all the volumes in the `dataVolume` stanza of the configuration file.
  - **`--volume other`** to snapshot all the volumes in the `otherVolume` stanza of the configuration file.
  - see the [backup](azacsnap-cmd-ref-backup.md) command reference.
- **`-c details`** provides information on snapshots or replication.
  - **`--details snapshots`** Provides a list of basic details about the snapshots for each volume that has been configured. This command can be run on the primary server or on a server in the disaster-recovery location. The command provides the following information broken down by each volume that contains snapshots:
    - Size of total snapshots in a volume.
    - Each snapshot in that volume includes the following details:
    - Snapshot name
    - Create time
    - Size of the snapshot
    - Frequency of the snapshot
  - **`--details replication`** Provides basic details around the replication status from the production site to the disaster-recovery site. The command monitors to ensure replication is taking place, and it shows the size of the items that are being replicated. It also provides guidance if replication is taking too long or if the link is down.
  - see the [details](azacsnap-cmd-ref-details.md) command reference.
- **`-c delete`** This command deletes a storage snapshot or a set of snapshots. You can use either the SAP HANA Backup ID as found in HANA Studio or the storage snapshot name. The Backup ID is only tied to the `hana` snapshots, which are created for the data and shared volumes. Otherwise, if the snapshot name is entered, it searches for all snapshots that match the entered snapshot name.
  - see the [delete](azacsnap-cmd-ref-delete.md) command reference.
- **`-c restore`** provides two methods to restore a snapshot to a volume, by either creating a new volume based on the snapshot or rolling back a volume to a preview state.
  - **`--restore snaptovol`** Creates a new volume based on the latest snapshot on the target volume.
  - **`-c restore --restore revertvolume`** Reverts the target volume to a prior state based on the most recent snapshot.
  - see the [restore](azacsnap-cmd-ref-restore.md) command reference.
- **`[--configfile <configfilename>]`** The optional  command-line parameter to provide a different JSON configuration filename.  This is particularly useful for creating a separate configuration file per SID (e.g `--configfile H80.json`).

## Next steps

- [Get started with Azure Application Consistent Snapshot Tool](azacsnap-get-started.md)

---
title: What is the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Get basic information about the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: Phil-Jensen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 08/21/2023
ms.author: phjensen
---

# What is the Azure Application Consistent Snapshot tool?

The Azure Application Consistent Snapshot tool (AzAcSnap) is a command-line tool that enables data protection for third-party databases. It handles all the orchestration required to put those databases into an application-consistent state before taking a storage snapshot. After the snapshot, the tool returns the databases to an operational state.

## Supported databases, operating systems, and Azure platforms

- **Databases**
  - SAP HANA (see the [support matrix](azacsnap-get-started.md#snapshot-support-matrix-from-sap) for details)
  - Oracle Database release 12 or later (see [Oracle VM images and their deployment on Microsoft Azure](../virtual-machines/workloads/oracle/oracle-vm-solutions.md) for details)
  - IBM Db2 for LUW on Linux-only version 10.5 or later (see [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](../virtual-machines/workloads/sap/dbms_guide_ibm.md) for details)

- **Operating systems**
  - SUSE Linux Enterprise Server 12+
  - Red Hat Enterprise Linux 7+
  - Oracle Linux 7+

- **Azure platforms**
  - Azure Virtual Machines with Azure NetApp Files storage
  - Azure Large Instances (on bare-metal infrastructure)

> [!TIP]
> If you're looking for new features (or support for other databases, operating systems, and platforms), see [Preview features of the Azure Application Consistent Snapshot tool](azacsnap-preview.md). You can also provide [feedback or suggestions](https://aka.ms/azacsnap-feedback).

## Benefits of using AzAcSnap

AzAcSnap uses the volume snapshot and replication functionalities in Azure NetApp Files and Azure Large Instances. It provides the following benefits:

- **Rapid backup snapshots independent of database size**

  AzAcSnap takes snapshot backups regardless of the size of the volumes or the database by using the snapshot technology of storage. It takes snapshots in parallel across all the volumes, to allow multiple volumes to be part of the database storage.  
  
  In tests, the tool took less than two minutes to take a snapshot backup of a database of 100+ tebibytes (TiB) stored across 16 volumes.
- **Application-consistent data protection**
  
  You can deploy AzAcSnap as a centralized or distributed solution for backing up critical database files. It ensures database consistency before it performs a storage volume snapshot. As a result, it ensures that you can use the storage volume snapshot for database recovery.

- **Database catalog management**

  When you use AzAcSnap with SAP HANA, the records within the backup catalog are kept current with storage snapshots. This capability allows a database administrator to see the backup activity.

- **Ad hoc volume protection**

  This capability is helpful for non-database volumes that don't need application quiescing before the tool takes a storage snapshot.  Examples include SAP HANA log-backup volumes or SAPTRANS volumes.

- **Cloning of storage volumes**

  This capability provides space-efficient storage volume clones for development and test purposes.

- **Support for disaster recovery**

  AzAcSnap uses storage volume replication to provide options for recovering replicated application-consistent snapshots at a remote site.

AzAcSnap is a single binary. It doesn't need additional agents or plug-ins to interact with the database or the storage (Azure NetApp Files via Azure Resource Manager, and Azure Large Instances via Secure Shell [SSH]).

AzAcSnap must be installed on a system that has connectivity to the database and the storage. However, the flexibility of installation and configuration allows for either a single centralized installation (Azure NetApp Files only) or a fully distributed installation (Azure NetApp Files and Azure Large Instances) with copies installed on each database installation.

## Architecture overview

You can install AzAcSnap on the same host as the database (SAP HANA), or you can install it on a centralized system. But, you must have network connectivity to the database servers and the storage back end (Azure Resource Manager for Azure NetApp Files or SSH for Azure Large Instances).

AzAcSnap is a lightweight application that's typically run from an external scheduler. On most Linux systems, this operation is `cron`, which is what the documentation focuses on. But the scheduler could be an alternative tool, as long as it can import the `azacsnap` user's shell profile. Importing the user's environment settings ensures that file paths and permissions are initialized correctly.

## Technical articles

The following technical articles describe where AzAcSnap has been used as part of a data protection strategy:

- [Manual Recovery Guide for SAP HANA on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-hana-on-azure-vms-from-azure/ba-p/3290161)
- [Manual Recovery Guide for SAP HANA on Azure Large Instance from storage snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-hana-on-azure-large-instance-from/ba-p/3242347)
- [Manual Recovery Guide for SAP Oracle 19c on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-oracle-19c-on-azure-vms-from-azure/ba-p/3242408)
- [Manual Recovery Guide for SAP Db2 on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-db2-on-azure-vms-from-azure-netapp/ba-p/3865379)
- [SAP Oracle 19c System Refresh Guide on Azure VMs using Azure NetApp Files Snapshots with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-oracle-19c-system-refresh-guide-on-azure-vms-using-azure/ba-p/3708172)
- [Protecting HANA databases configured with HSR on Azure NetApp Files with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/protecting-hana-databases-configured-with-hsr-on-azure-netapp/ba-p/3654620)
- [Automating SAP system copy operations with Libelle SystemCopy](https://docs.netapp.com/us-en/netapp-solutions-sap/lifecycle/libelle-sc-overview.html)

## Command synopsis

The general format of the commands is:
`azacsnap -c [command] --[command] [sub-command] --[flag-name] [flag-value]`.

## Command options

The command options are as follows. The main bullets are commands, and the indented bullets are subcommands.

- `-h` provides extended command-line help with examples on AzAcSnap usage.
- `-c configure` provides an interactive Q&A style interface to create or modify the `azacsnap` configuration file (default = `azacsnap.json`).
  - `--configuration new` creates a new configuration file.
  - `--configuration edit` enables editing an existing configuration file.

  For more information, see the [configure command reference](azacsnap-cmd-ref-configure.md).
- `-c test` validates the configuration file and tests connectivity.
  - `--test hana` tests the connection to the SAP HANA instance.
  - `--test storage` tests communication with the underlying storage interface by creating a temporary storage snapshot on all the configured `data` volumes, and then removing them.
  - `--test all` performs both the `hana` and `storage` tests in sequence.

  For more information, see the [test command reference](azacsnap-cmd-ref-test.md).
- `-c backup` is the primary command to execute database-consistent storage snapshots for SAP HANA data volumes and for other (for example, shared, log backup, or boot) volumes.
  - `--volume data` takes a snapshot of all the volumes in the `dataVolume` stanza of the configuration file.
  - `--volume other` takes a snapshot of all the volumes in the `otherVolume` stanza of the configuration file.
  - `--volume all` takes a snapshot of all the volumes in the `dataVolume` stanza and then all the volumes in the `otherVolume` stanza of the configuration file.

  For more information, see the [backup command reference](azacsnap-cmd-ref-backup.md).
- `-c details` provides information on snapshots or replication.
  - `--details snapshots` provides a list of basic details about the snapshots for each volume that you configured.
  - `--details replication` provides basic details about the replication status from the production site to the disaster-recovery site.

  For more information, see the [details command reference](azacsnap-cmd-ref-details.md).
- `-c delete` deletes a storage snapshot or a set of snapshots.

  You can use either the SAP HANA backup ID (as found in HANA Studio) or the storage snapshot name. The backup ID is tied to only the `hana` snapshots, which are created for the data and shared volumes. Otherwise, if you enter the snapshot name, the command searches for all snapshots that match the entered snapshot name.

  For more information, see the [delete command reference](azacsnap-cmd-ref-delete.md).
- `-c restore` provides two methods to restore a snapshot to a volume.
  - `--restore snaptovol` creates a new volume based on the latest snapshot on the target volume.
  - `-c restore --restore revertvolume` reverts the target volume to a prior state, based on the most recent snapshot.

  For more information, see the [restore command reference](azacsnap-cmd-ref-restore.md).
- `[--configfile <configfilename>]` is an optional command-line parameter to provide a different file name for the JSON configuration. It's useful for creating a separate configuration file per security ID (for example, `--configfile H80.json`).
- `[--runbefore]` and `[--runafter]` are optional commands to run external commands or shell scripts before and after the execution of the main AzAcSnap logic.

  For more information, see the [runbefore/runafter command reference](azacsnap-cmd-ref-runbefore-runafter.md).
- `[--preview]` is an optional command-line option that's required when you're using preview features.

  For more information, see [Preview features of the Azure Application Consistent Snapshot tool](azacsnap-preview.md).

## Next steps

- [Get started with the Azure Application Consistent Snapshot tool](azacsnap-get-started.md)

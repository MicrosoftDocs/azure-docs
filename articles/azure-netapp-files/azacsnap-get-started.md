---
title: Get started with Azure Application Consistent Snapshot tool for Azure NetApp Files | Microsoft Docs
description: Provides a guide for installing the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 05/15/2024
ms.author: phjensen
---

# Get started with Azure Application Consistent Snapshot tool

This article provides a guide for installing the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.

## Installation and setup workflow for AzAcSnap

This workflow provides the main steps to install, setup and configure AzAcSnap along with your chosen database and storage option.

**Steps**:
1. [Install AzAcSnap](azacsnap-installation.md)
1. [Configure Database](azacsnap-configure-database.md)
   1. [SAP HANA](azacsnap-configure-database.md?tabs=sap-hana)
   1. [Oracle DB](azacsnap-configure-database.md?tabs=oracle)
   1. [IBM Db2](azacsnap-configure-database.md?tabs=db2)
   1. Microsoft SQL Server (PREVIEW)
1. [Configure Storage](azacsnap-configure-storage.md)
   1. [Azure NetApp Files](azacsnap-configure-storage.md?tabs=azure-netapp-files)
   1. [Azure Large Instance](azacsnap-configure-storage.md?tabs=azure-large-instance)
   1. Azure Managed Disk (PREVIEW)
1. [Configure AzAcSnap](azacsnap-cmd-ref-configure.md)
1. [Test AzAcSnap](azacsnap-cmd-ref-test.md)
1. [Take a backup with AzAcSnap](azacsnap-cmd-ref-backup.md)

## Technical articles

The following technical articles describe how to set up AzAcSnap as part of a data protection strategy:

- [Manual Recovery Guide for SAP HANA on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-hana-on-azure-vms-from-azure/ba-p/3290161)
- [Manual Recovery Guide for SAP HANA on Azure Large Instance from storage snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-hana-on-azure-large-instance-from/ba-p/3242347)
- [Manual Recovery Guide for SAP Oracle 19c on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-oracle-19c-on-azure-vms-from-azure/ba-p/3242408)
- [Manual Recovery Guide for SAP Db2 on Azure VMs from Azure NetApp Files snapshot with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-db2-on-azure-vms-from-azure-netapp/ba-p/3865379)
- [SAP Oracle 19c System Refresh Guide on Azure VMs using Azure NetApp Files Snapshots with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/sap-oracle-19c-system-refresh-guide-on-azure-vms-using-azure/ba-p/3708172)
- [Protecting HANA databases configured with HSR on Azure NetApp Files with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/protecting-hana-databases-configured-with-hsr-on-azure-netapp/ba-p/3654620)
- [Automating SAP system copy operations with Libelle SystemCopy](https://docs.netapp.com/us-en/netapp-solutions-sap/lifecycle/libelle-sc-overview.html)

## Get command help

To see a list of commands and examples, type `azacsnap -h` and then press the ENTER key.

The general format of the commands is:
`azacsnap -c [command] --[command] [sub-command] --[flag-name] [flag-value]`.

### Command options

The command options are as follows. The main bullets are commands, and the indented bullets are subcommands.

- `-h` provides extended command-line help with examples on AzAcSnap usage.
- [`-c configure`](azacsnap-cmd-ref-configure.md) provides an interactive Q&A style interface to create or modify the `azacsnap` configuration file (default = `azacsnap.json`).
  - `--configuration new` creates a new configuration file.
  - `--configuration edit` enables editing an existing configuration file.
- [`-c test`](azacsnap-cmd-ref-test.md) validates the configuration file and tests connectivity.
  - `--test <DbType>`, where DbType is one of `hana`, `oracle`, or `db2`, tests the connection to the specified database.
  - `--test storage` tests communication with the underlying storage interface by creating a temporary storage snapshot on all the configured `data` volumes, and then removing them.
  - `--test all` performs both the `hana` and `storage` tests in sequence.
- [`-c backup`](azacsnap-cmd-ref-backup.md) is the primary command to execute database-consistent storage snapshots for SAP HANA data volumes and for other (for example, shared, log backup, or boot) volumes.
  - `--volume data` takes a snapshot of all the volumes in the `dataVolume` stanza of the configuration file.
  - `--volume other` takes a snapshot of all the volumes in the `otherVolume` stanza of the configuration file.
  - `--volume all` takes a snapshot of all the volumes in the `dataVolume` stanza and then all the volumes in the `otherVolume` stanza of the configuration file.
- [`-c details`](azacsnap-cmd-ref-details.md) provides information on snapshots or replication.
  - `--details snapshots` (optional) provides a list of basic details about the snapshots for each volume that you configured.
  - `--details replication` (optional) provides basic details about the replication status from the production site to the disaster-recovery site.
- [`-c delete`](azacsnap-cmd-ref-delete.md) deletes a storage snapshot or a set of snapshots.
- [`-c restore`](azacsnap-cmd-ref-restore.md) provides two methods to restore a snapshot to a volume.
  - `--restore snaptovol` creates a new volume based on the latest snapshot on the target volume.
  - `-c restore --restore revertvolume` reverts the target volume to a prior state, based on the most recent snapshot.
- `[--configfile <configfilename>]` is an optional command-line parameter to provide a different file name for the JSON configuration. It's useful for creating a separate configuration file per security ID (for example, `--configfile H80.json`).
- [`[--runbefore]` and `[--runafter]`](azacsnap-cmd-ref-runbefore-runafter.md) are optional commands to run external commands or shell scripts before and after the execution of the main AzAcSnap logic.
- `[--preview]` is an optional command-line option that's required when you're using preview features.

  For more information, see [Preview features of the Azure Application Consistent Snapshot tool](azacsnap-preview.md).

## Important things to remember

- After the setup of the snapshot tools, continuously monitor the storage space available and if necessary, delete the old snapshots on a regular basis to avoid running out of storage capacity.
- Always use the latest snapshot tools.
- Test the snapshot tools to understand the parameters required and their behavior, along with the log files, before deployment into production.

## Guidance provided in this document

The following guidance is provided to illustrate the usage of the snapshot tools.

### Taking snapshot backups

- [What are the prerequisites for the storage snapshot](azacsnap-installation.md#prerequisites-for-installation)
  - [Enable communication with storage](azacsnap-configure-storage.md#enable-communication-with-storage)
  - [Enable communication with database](azacsnap-configure-database.md#enable-communication-with-the-database)
- [How to take snapshots manually](azacsnap-tips.md#take-snapshots-manually)
- [How to set up automatic snapshot backup](azacsnap-tips.md#setup-automatic-snapshot-backup)
- [How to monitor the snapshots](azacsnap-tips.md#monitor-the-snapshots)
- [How to delete a snapshot?](azacsnap-tips.md#delete-a-snapshot)
- [How to restore a snapshot](azacsnap-tips.md#restore-a-snapshot)
- [How to restore a `boot` snapshot](azacsnap-tips.md#restore-a-boot-snapshot)
- [What are key facts to know about the snapshots](azacsnap-tips.md#key-facts-to-know-about-snapshots)

### Performing disaster recovery

- [What are the prerequisites for DR setup](azacsnap-disaster-recovery.md#prerequisites-for-disaster-recovery-setup)
- [How to set up a disaster recovery](azacsnap-disaster-recovery.md#set-up-disaster-recovery)
- [How to monitor the data replication from Primary to DR site](azacsnap-disaster-recovery.md#monitor-data-replication-from-primary-to-dr-site)
- [How to perform a failover to DR site?](azacsnap-disaster-recovery.md#perform-a-failover-to-dr-site)

## Next steps

- [Install Azure Application Consistent Snapshot tool](azacsnap-installation.md)

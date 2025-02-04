---
title: What is the Azure Application Consistent Snapshot tool for Azure NetApp Files
description: Get basic information about the Azure Application Consistent Snapshot tool that you can use with Azure NetApp Files.
services: azure-netapp-files
author: Phil-Jensen
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 02/01/2025
ms.author: phjensen
---

# What is the Azure Application Consistent Snapshot tool?

The Azure Application Consistent Snapshot tool (AzAcSnap) is a command-line tool that enables data protection for third-party databases. It handles all the orchestration required to put those databases into an application-consistent state before taking a storage snapshot. After the snapshot, the tool returns the databases to an operational state.

Check out the steps to [get started with the Azure Application Consistent Snapshot tool](azacsnap-get-started.md).

## Architecture overview

You can install AzAcSnap on the same host as the database, or you can install it on a centralized system. But, you must have network connectivity to the database servers and the storage back end (Azure Resource Manager for Azure NetApp Files or HTTPS for Azure Large Instances).

AzAcSnap is a lightweight application that's typically run from an external scheduler. On most Linux systems, this operation is `cron`, which is what the documentation focuses on. But the scheduler could be an alternative tool, as long as it can import the `azacsnap` user's shell profile. Importing the user's environment settings ensures that file paths and permissions are initialized correctly.

## Benefits of using AzAcSnap

AzAcSnap uses the volume snapshot and replication functionalities in Azure NetApp Files and Azure Large Instances. It provides the following benefits:

- **Rapid backup snapshots independent of database size**

  AzAcSnap takes an almost instantaneous snapshot of the database with zero performance hit, regardless of the size of the database volumes. It takes snapshots in parallel across all the volumes, to allow multiple volumes to be part of the database storage.  
  
  In tests, the tool took less than two minutes to take a snapshot backup of a database of 100+ tebibytes (TiB) stored across 16 volumes.
  
- **Application-consistent data protection**
  
  You can deploy AzAcSnap as a centralized or distributed solution for backing up critical database files. It ensures database consistency before it performs a storage volume snapshot. As a result, it ensures that you can use the storage volume snapshot for database recovery.  Database roll forward options are available when used with log files.

- **Database catalog management**

  When you use AzAcSnap with SAP HANA, the records within the backup catalog are kept current with storage snapshots. This capability allows a database administrator to see the backup activity.

- **Ad hoc volume protection**

  This capability is helpful for non-database volumes that don't need application quiescing before the tool takes a storage snapshot.  These can be any unstructured file-system, which includes database files like SAP HANA log-backup volumes and shared file systems, or SAPTRANS volumes.

- **Cloning of storage volumes**

  This capability provides space-efficient storage volume clones for rapid development and test purposes.

- **Support for disaster recovery**

  AzAcSnap uses storage volume replication to provide options for recovering replicated application-consistent snapshots at a remote site.

AzAcSnap is a single binary. It doesn't need additional agents or plug-ins to interact with the database or the storage (Azure NetApp Files via Azure Resource Manager, and Azure Large Instances via Secure Shell [SSH]).


## Supported databases, operating systems, and Azure platforms

- **Databases**
  - SAP HANA (see the [support matrix](#snapshot-support-matrix-from-sap) for details)
  - Oracle Database release 12 or later (see [Oracle VM images and their deployment on Microsoft Azure](/azure/virtual-machines/workloads/oracle/oracle-vm-solutions) for details)
  - IBM Db2 for LUW on Linux-only version 10.5 or later (see [IBM Db2 Azure Virtual Machines DBMS deployment for SAP workload](/azure/virtual-machines/workloads/sap/dbms_guide_ibm) for details)
  - MS SQL Server 2022+

- **Operating systems**
  - SUSE Linux Enterprise Server 12+
  - Red Hat Enterprise Linux 8+
  - Oracle Linux 8+
  - Windows Server 2016+

- **Azure platforms**
  - Azure Virtual Machines with Azure NetApp Files storage
  - Azure Large Instances (on bare-metal infrastructure)

> [!TIP]
> If you're looking for new features (or support for other databases, operating systems, and platforms), see [Preview features of the Azure Application Consistent Snapshot tool](azacsnap-preview.md). You can also provide [feedback or suggestions](https://aka.ms/azacsnap-feedback).

## Supported scenarios

The snapshot tools can be used in the following [Supported scenarios for HANA Large Instances](/azure/virtual-machines/workloads/sap/hana-supported-scenario) and [SAP HANA with Azure NetApp Files](/azure/virtual-machines/workloads/sap/hana-vm-operations-netapp).

## Snapshot Support Matrix from SAP

The following matrix is provided as a guideline on which versions of SAP HANA are supported by SAP for Storage Snapshot Backups.
 
|  Database type            | Minimum database versions | Notes                                                                                   |
|---------------------------|---------------------------|-----------------------------------------------------------------------------------------|
| Single Container Database | 1.0 SPS 12, 2.0 SPS 00    |                                                                                         |
| MDC Single Tenant	        | [2.0 SPS 01](https://help.sap.com/docs/SAP_HANA_PLATFORM/42668af650f84f9384a3337bcd373692/2194a981ea9e48f4ba0ad838abd2fb1c.html?version=2.0.01&locale=en-US)                | or later versions where MDC Single Tenant supported by SAP for storage/data snapshots.* | 
| MDC Multiple Tenants      | [2.0 SPS 04](https://help.sap.com/docs/SAP_HANA_PLATFORM/42668af650f84f9384a3337bcd373692/7910eb4a498246b1b0435a4e9bf938d1.html?version=2.0.04&locale=en-US)                | or later where MDC Multiple Tenants supported by SAP for data snapshots.                |
> \* [SAP changed terminology from Storage Snapshots to Data Snapshots from 2.0 SPS 02](https://help.sap.com/docs/SAP_HANA_PLATFORM/42668af650f84f9384a3337bcd373692/7f203cf75ae4445d96ad0012c67c0480.html?version=2.0.02&locale=en-US)


**Additional SAP deployment considerations:**

- When setting up the HANA user for backup, you need to set up the user for each HANA instance. Create an SAP HANA user account to access HANA instance under the SYSTEMDB (and not in the tenant database).
- Automated log deletion is managed with the `--trim` option of the `azacsnap -c backup` for SAP HANA 2 and later releases.

> [!IMPORTANT]
> The snapshot tools only interact with the node of the SAP HANA system specified in the configuration file.  If this node becomes unavailable, there's no mechanism to automatically start communicating with another node.  

  - For an **SAP HANA Scale-Out with Standby** scenario it's typical to install and configure the snapshot tools on the primary node. But, if the primary node becomes
      unavailable, the standby node will take over the primary node role. In this case, the implementation team should configure the snapshot tools on both
      nodes (Primary and Stand-By) to avoid any missed snapshots. In the normal state, the primary node will take HANA snapshots initiated by crontab.  If the primary 
      node fails over those snapshots will have to be executed from another node, such as the new primary node (former standby). To achieve this outcome, the standby
      node would need the snapshot tool installed, storage communication enabled, hdbuserstore configured, `azacsnap.json` configured, and crontab commands staged 
      in advance of the failover.
  - For an **SAP HANA HSR HA** scenario, it's recommended to install, configure, and schedule the snapshot tools on both (Primary and Secondary) nodes. Then, if 
      the Primary node becomes unavailable, the Secondary node will take over with snapshots being taken on the Secondary. In the normal state, the Primary node 
      will take HANA snapshots initiated by crontab.  The Secondary node would attempt to take snapshots but fail as the Primary is functioning correctly.  But, 
      after Primary node failover, those snapshots will be executed from the Secondary node. To achieve this outcome, the Secondary node needs the snapshot tool 
      installed, storage communication enabled, `hdbuserstore` configured, `azacsnap.json` configured, and crontab enabled in advance of the failover.

    > See the technical article on [Protecting HANA databases configured with HSR on Azure NetApp Files with AzAcSnap](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/manual-recovery-guide-for-sap-oracle-19c-on-azure-vms-from-azure/ba-p/3242408)


## Next steps

- [Get started with the Azure Application Consistent Snapshot tool](azacsnap-get-started.md)

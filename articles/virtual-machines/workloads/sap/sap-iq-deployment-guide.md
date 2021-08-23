---
title: Implement SAP NLS/SDA with SAP IQ on Azure | Microsoft Docs
description: Plan, deploy, and configure SAP NLS/SDA solution with SAP IQ on Azure.
services: virtual-machines,virtual-machines-windows,virtual-machines-linux,virtual-network,storage,azure-netapp-files,azure-shared-disk,managed-disk
documentationcenter: saponazure
author: dennispadia
manager: juergent
editor: ''
tags: azure-resource-manager
keywords: ''
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 06/11/2021
ms.author: depadia
---

# SAP BW-Near Line Storage (NLS) implementation guide with SAP IQ on Azure

## Overview

Over the years customer running SAP BW system sees an exponential growth in database size that results in an increase in compute cost. To achieve the perfect balance of cost and performance, customer can use near-line storage (NLS) to migrate the historical data. The NLS implementation based on SAP IQ is the standard method by SAP to move historical data from primary database (SAP HANA or anyDB). The adapter of SAP IQ as a near-line solution is delivered with the SAP BW system. The integration of SAP IQ makes it possible to separate frequently accessed-data from infrequently one, which makes less resource demand in SAP BW system. 

This guide will provide you the guidelines for planning, deploying, and configuring SAP BW near-line storage (NLS) with SAP IQ on Azure. This guide is intended to cover common Azure services and features that are relevant for SAP IQ - NLS deployment and doesn't cover any NLS partner solutions. This guide isn’t intended to replace SAP’s standard documentation on NLS deployment with SAP IQ, instead it complements its official installation and administration documentations. 

## Solution overview

In an operative BW system, the volume of data increases constantly and this data is required for longer period because of the business and legal requirement. The large volume of data can affect the performance of the system and increases the administration effort, which results in the need of implementing a data aging strategy. If you want to keep the amount of data in your SAP BW system without deleting, you can use data archiving. The data is first moved to archive or near-line storage and then deleted from the BW system. You can either access the data directly or load it back as required depending on how the data has been archived. 

SAP BW users can use SAP IQ as a near-line storage (NLS) solution. The adapter for SAP IQ as a near-line solution is delivered with the BW system. With NLS implemented, frequently used data is stored in SAP BW online database (SAP HANA or any DB) while infrequently accessed data is stored in SAP IQ, which reduces the cost to manage data and improves the performance of SAP BW system. To ensure consistency between online data and near-line data, the archived partitions are locked and are read-only. 

SAP IQ supports two type of architecture - simplex and multiplex. In simplex architecture, a single instance of SAP IQ server runs on a single virtual machine and files may be located on a host machine or on a network storage device. 

> [!Important]
> For SAP-NLS solution, only simplex architecture is available/evaluated by SAP.

![SAP IQ solution overview](media/sap-iq-deployment-guide/sap-iq-solution-overview.png)

In Azure, SAP IQ server must be implemented on a separate virtual machine (VM). It's not recommended to install SAP IQ software on an existing server that already has other database instance running, as SAP IQ uses complete CPU and memory for its own usage. One SAP IQ server can be used for multiple SAP-NLS implementations. 

## Support matrix

This section describes glance on the support matrix for SAP IQ-NLS solution, which is covered in more detail in this document. Also, check [product availability matrix (PAM)](https://userapps.support.sap.com/sap/support/pam) for more up-to-date information based on your SAP IQ release. 

- **Operating system**: SAP IQ is certified at the operating system level only. You can run SAP IQ certified operating system on Azure environment as long as they’re compatible to run on Azure infrastructure. For more information, see SAP Note [2133194](https://launchpad.support.sap.com/#/notes/2133194).

- **SAP BW compatibility**: Near-line storage for SAP IQ is released only for SAP BW systems that already run under Unicode. Follow SAP note [1796393](https://launchpad.support.sap.com/#/notes/1796393) that contains information about SAP BW.

- **Storage**: In Azure, SAP IQ supports premium-managed disk (Windows/Linux), Azure shared disk (Windows only), and Azure NetApp Files (NFS - Linux only). 

## Sizing

Sizing of SAP IQ is confined to CPU, memory, and storage. The general sizing guidelines for SAP IQ on Azure can be found in SAP note [1951789](https://launchpad.support.sap.com/#/notes/1951789). The sizing recommendation you get by following the guidelines needs to be mapped to certified Azure virtual machine types for SAP. SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533) provides the list of supported SAP products and Azure VM types. 

> [!Tip]
>
> For productive system, we recommend you to use E-Series virtual machines due to its core-to-memory ratio. 

SAP IQ sizing guide and sizing worksheet mentioned in SAP Note [1951789](https://launchpad.support.sap.com/#/notes/1951789) are developed for the native usage of the SAP IQ database and doesn't reflect the resources for the planning of <SID>IQ database, you might end up with unused resources for SAP-NLS.

## Azure resources

### Choosing regions

If you’re already running your SAP systems on Azure, probably you have your region identified. SAP IQ deployment must be on the same region as that of your SAP BW system for which you're implementing NLS solution. But you need to investigate, that the necessary services required by SAP IQ like Azure NetApp Files (NFS - Linux only) are available in those regions to decide the architecture of SAP IQ. To check the service availability in your region, you can check [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site.

### Availability sets 

To achieve redundancy of SAP systems in Azure infrastructure, application needs to be deployed either in availability sets or availability zones. Technically SAP IQ high availability can be achieved using the IQ multiplex architecture, but the multiplex architecture doesn’t meet the requirement of NLS solution. To achieve high availability for SAP IQ simplex architecture, two node cluster with custom solution needs to be configured. The two node SAP IQ cluster can be deployed in availability sets or availability zones, but the Azure storage that gets attached to the nodes decides its deployment method. Currently Azure shared premium disk and Azure NetApp Files don't support zonal deployment, which only leave the SAP IQ deployment in availability set option. 

### Virtual machines

Based on SAP IQ sizing, you need to map your requirement to Azure virtual machines, which is supported in Azure for SAP product. SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533) is a good starting point that lists supported Azure VM types for SAP products on Windows and Linux. Also a point to keep in mind that beyond the selection of purely supported VM types, you also need to check whether those VM types are available in specific region. You can check the availability of VM type on [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) page. For choosing the pricing model, you can refer to [Azure virtual machines for SAP workload](planning-guide.md#azure-virtual-machines-for-sap-workload). 

For productive system, we recommend you to use E-Series virtual machines because of its core-to-memory ratio.

### Storage

Azure storage has different storage types available for customers and details for the same can be read in the article [What disk types are available in Azure?](../../disks-types.md). Some of the storage types have limited use for SAP scenarios. But several Azure Storage types are well suited or optimized for specific SAP workload scenarios. For more information, refer [Azure Storage types for SAP Workload](planning-guide-storage.md) guide, as it highlights different storage options that are suited for SAP. For SAP IQ on Azure, following Azure storage can be used based on your operating system (Windows or Linux) and deployment method (standalone or highly available).

- Azure-managed disks

  It's a block-level storage volume that is managed by Azure. You can use Azure-managed disks for SAP IQ simplex deployment. There are different types of [Azure Managed Disks](../../managed-disks-overview.md) available, but it's recommended to use [Premium SSDs](../../disks-types.md#premium-ssd) for SAP IQ. 

- Azure shared disks

  [Azure shared disks](../../disks-shared.md) is a new feature for Azure-managed disks that allow you to attach a managed disk to multiple virtual machines (VMs) simultaneously. Shared managed disks do not natively offer a fully managed file system that can be accessed using SMB/NFS. You need to use cluster manager like [Windows server failover cluster](https://github.com/MicrosoftDocs/windowsserverdocs/blob/master/WindowsServerDocs/failover-clustering/failover-clustering-overview.md) (WSFC) that handles cluster node communication and write locking. To deploy highly available solution for SAP IQ simplex architecture on Windows, you can use Azure shared disks between two nodes that are managed by WSFC. SAP IQ deployment architecture with Azure shared disk is discussed in the article [Deploy SAP IQ NLS HA Solution using Azure shared disk on Windows Server](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-iq-nls-ha-solution-using-azure-shared-disk-on-windows/ba-p/2433089)

- Azure NetApp Files

  SAP IQ deployment on Linux can use [Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-introduction.md) as a file system (NFS protocol) to install as standalone or a highly available solution. As this storage offering isn't available in all regions, refer to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site to find out up-to-date information. SAP IQ deployment architecture with Azure NetApp Files is discussed in the article [Deploy SAP IQ-NLS HA Solution using Azure NetApp Files on SUSE Linux Enterprise Server](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-iq-nls-ha-solution-using-azure-netapp-files-on-suse/ba-p/1651172).

The following table lists the recommendation of each storage type based on the operating system. 

| Storage type        | Windows | Linux |
| ------------------- | ------- | ----- |
| Azure-managed disks | Yes     | Yes   |
| Azure shared disks  | Yes     | No    |
| Azure NetApp Files  | No      | Yes   |

### Networking

Azure provides a network infrastructure, which allows the mapping of all scenarios that can be realized for SAP BW system that use SAP IQ as near-line storage like connecting to on-premise system, systems in different virtual network and others. For more information, see [Microsoft Azure Networking for SAP Workload](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/virtual-machines/workloads/sap/planning-guide.md#microsoft-azure-networking).

## Deploy SAP IQ on Windows

### Server preparation and installation

Follow the latest guide by SAP to prepare servers for NLS implementation with SAP IQ on Windows. For the most up-to-date information, refer to first guidance document published by SAP, which you can find in SAP Note [2780668 - SAP First Guidance - BW NLS Implementation with SAP IQ](https://launchpad.support.sap.com/#/notes/0002780668). It covers the comprehensive information related to pre-requisites for SAP BW systems, IQ filesystem layout, installation, post configuration, and BW NLS integration with IQ.

### High-availability deployment

SAP IQ supports both a simplex and a multiplex architecture. For NLS solution, only simplex server architecture is available and evaluated. Simplex is a single instance of an SAP IQ server running on a single virtual machine. Technically SAP IQ high availability can be achieved using multiplex server architecture, but the multiplex architecture doesn't meet the requirement for NLS solution. For simplex server architecture, SAP doesn't provide any features or procedures to run the SAP IQ in high availability configuration. 

To set up SAP IQ high availability on Windows for simplex server architecture, you need to set up a custom solution, which requires extra configuration like Microsoft Windows Server Failover Cluster, shared disk and so on. One such custom solution for SAP IQ on Windows is described in details in [Deploy SAP IQ NLS HA Solution using Azure shared disk on Windows Server](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-iq-nls-ha-solution-using-azure-shared-disk-on-windows/ba-p/2433089) blog.

### Back up and restore

In Azure, you can schedule SAP IQ database backup as described by SAP in [IQ Administration: Backup, Restore, and Data Recovery](https://help.sap.com/viewer/a893f37e84f210158511c41edb6a6367/16.1.4.7/5b8309b37f4e46b089465e380c24df59.html). SAP IQ provides different types of database backups and details about of each backup type can be found in [Backup Scenarios](https://help.sap.com/viewer/a893f37e84f210158511c41edb6a6367/16.1.4.7/a880dc1f84f21015af84f1a6b629dd7a.html).

- Full backup - It makes a complete copy of the database. 
- Incremental backup - It copies all transactions since the last backup of any type. 
- Incremental since full backup - It back up all changes to the database since the last full backup.
- Virtual backup - It copies all of the database except the table data and metadata from the IQ store.

Depending on your IQ database size, you can schedule your database backup from any of the backup scenarios. But if you are using SAP IQ with NLS interface delivered by SAP and want to automate the backup process for IQ database, which ensures that the SAP IQ database can always be recovered to a consistent state without data loss with respect to the data movement processes between the primary database and the SAP IQ database. Refer SAP Note [2741824 - How to setup backup automation for SAP IQ Cold Store/Near-line Storage](https://launchpad.support.sap.com/#/notes/2741824), which provide details on setting up automation for SAP IQ near-line storage. 

For large IQ database, you can use virtual backup in SAP IQ. For more information on virtual backup, see [Virtual Backups](https://help.sap.com/viewer/a893f37e84f210158511c41edb6a6367/16.1.4.7/a880672184f21015a08dceedc7d19776.html), [Introduction Virtual Backup in SAP Sybase IQ](https://wiki.scn.sap.com/wiki/display/SYBIQ/Introduction+Virtual+BackUp+(+general++back+up+method+)+in+SAP+Sybase+IQ) and SAP Note [2461985 - How to Backup Large SAP IQ Database](https://launchpad.support.sap.com/#/notes/0002461985).

If you are using network drive (SMB protocol) to back up and restore SAP IQ server on Windows, make sure to use UNC path for backup. Three backslash ‘\\\\\’ is required when using UNC path for backup/restore.

```sql
BACKUP DATABASE FULL TO '\\\sapiq.internal.contoso.net\sapiq-backup\backup\data\<filename>'
```

## Deploy SAP IQ on Linux

### Server preparation and installation

Follow the latest guide by SAP to prepare servers for NLS implementation with SAP IQ on Linux. For the most up-to-date information, refer to first guidance document published by SAP, which you can find in SAP Note [2780668 - SAP First Guidance - BW NLS Implementation with SAP IQ](https://launchpad.support.sap.com/#/notes/0002780668). It covers the comprehensive information related to pre-requisites for SAP BW systems, IQ filesystem layout, installation, post configuration, and BW NLS integration with IQ.

### High-availability deployment

SAP IQ supports both a simplex and a multiplex architecture. For NLS solution, only simplex server architecture is available and evaluated. Simplex is a single instance of an SAP IQ server running on a single virtual machine. Technically SAP IQ high availability can be achieved using multiplex server architecture, but the multiplex architecture does not suffice the requirement for NLS solution. For simplex server architecture, SAP does not provide any features or procedures to run the SAP IQ in high availability configuration. 

To set up SAP IQ high availability on Linux for simplex server architecture, you need to set up custom solution, which requires extra configuration like pacemaker. One such custom solution for SAP IQ on Linux is described in details in [Deploy SAP IQ-NLS HA Solution using Azure NetApp Files on SUSE Linux Enterprise Server](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/deploy-sap-iq-nls-ha-solution-using-azure-netapp-files-on-suse/ba-p/1651172) blog.

### Back up and restore

In Azure, you can schedule SAP IQ database backup as described by SAP in [IQ Administration: Backup, Restore, and Data Recovery](https://help.sap.com/viewer/a893f37e84f210158511c41edb6a6367/16.1.4.7/5b8309b37f4e46b089465e380c24df59.html). SAP IQ provides different types of database backups and details about of each backup type can be found in [Backup Scenarios](https://help.sap.com/viewer/a893f37e84f210158511c41edb6a6367/16.1.4.7/a880dc1f84f21015af84f1a6b629dd7a.html).

- Full backup - It makes a complete copy of the database. 
- Incremental backup - It copies all transactions since the last backup of any type. 
- Incremental since full backup - It back up all changes to the database since the last full backup.
- Virtual backup - It copies all of the database except the table data and metadata from the IQ store.

Depending on your IQ database size, you can schedule the database backup. But if you're using SAP IQ with NLS interface delivered by SAP and want to automate the backup process for IQ database, which ensures that the SAP IQ database can always be recovered to a state without data loss with respect to the data movement processes between the primary database and the SAP IQ database. Refer SAP Note [2741824 - How to setup backup automation for SAP IQ Cold Store/Near-line Storage](https://launchpad.support.sap.com/#/notes/2741824), which provide details on setting up automation for SAP IQ near-line storage. 

For large IQ database, you can use virtual backup in SAP IQ. For more information on virtual backup, see [Virtual Backups](https://help.sap.com/viewer/a893f37e84f210158511c41edb6a6367/16.1.4.7/a880672184f21015a08dceedc7d19776.html), [Introduction Virtual Backup in SAP Sybase IQ](https://wiki.scn.sap.com/wiki/display/SYBIQ/Introduction+Virtual+BackUp+(+general++back+up+method+)+in+SAP+Sybase+IQ) and SAP Note [2461985 - How to Backup Large SAP IQ Database](https://launchpad.support.sap.com/#/notes/0002461985).

## Disaster recovery

This section explains the strategy to provide disaster recovery (DR) protection for SAP IQ - NLS solution. It complements the [Disaster recovery for SAP](../../../site-recovery/site-recovery-sap.md) document, which represents the primary resources for an overall SAP DR approach. The process described in this document is presented at an abstract level. But you need to validate the exact steps and do thorough test of your DR strategy. 

For SAP IQ, see SAP Note [2566083](https://launchpad.support.sap.com/#/notes/0002566083), which describes methods to implement a DR environment safely. In Azure, you can also use [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) for SAP IQ DR strategy. The strategy for SAP IQ DR depends on the way it's deployed in Azure, and it should also be in line with your SAP BW system. 

- Standalone deployment of SAP IQ

  If you have installed SAP IQ as a standalone system that doesn't have any application-level redundancy or high availability but business requires a DR setup. On a standalone IQ system all the disks (Azure-managed disks) attached to the virtual machine will be local. [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md) can be used to replicate standalone SAP IQ virtual machine on the secondary region. It replicates the servers and all the attached managed disks to the secondary region so that when disasters or an outage occur, you can easily fail over to your replicated environment and continue working. To start replicating the SAP IQ VMs to the Azure DR region, follow the guidance in [Replicate a virtual machine to Azure](../../../site-recovery/azure-to-azure-tutorial-enable-replication.md). 

- Highly available deployment of SAP IQ

  If you have installed SAP IQ as a highly available system where IQ binaries and database files are on Azure shared disk (Windows only) or on the network drive like Azure NetApp Files (Linux only). In such setup, you need to identify whether you need a same highly available SAP IQ on DR site, or a standalone SAP IQ will suffice your business requirement. In case you need standalone SAP IQ on DR site, you can use [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md)  to replicate primary SAP IQ virtual machine on the secondary region. It replicates the servers and all the local attached managed disks to the secondary region, but it won’t replicate Azure shared disk or network drive like Azure NetApp Files. To copy data from Azure shared disk or network drive, you can use any file-base copy tool to replicate data between Azure regions. For more information on how to copy Azure NetApp Files volume in another region, see [FAQs about Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-faqs.md#how-do-i-create-a-copy-of-an-azure-netapp-files-volume-in-another-azure-region).

## Next steps

- [Set up disaster recovery for a multi-tier SAP app deployment](../../../site-recovery/site-recovery-sap.md)
- [Azure Virtual Machines planning and implementation for SAP](planning-guide.md)
- [Azure Virtual Machines deployment for SAP](deployment-guide.md)

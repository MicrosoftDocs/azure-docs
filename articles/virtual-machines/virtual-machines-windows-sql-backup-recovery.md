<properties
	pageTitle="Backup and Restore for SQL Server | Microsoft Azure"
	description="Describes backup and restore considerations for SQL Server databases running on Azure Virtual Machines."
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="rothja"
	manager="jeffreyg"
	editor="monicar"
	tags="azure-resource-management" />

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="05/06/2016"
	ms.author="jroth" />

# Backup and Restore for SQL Server in Azure Virtual Machines

## Overview

Backing up data in SQL Server databases is an important part of the strategy in protecting against data loss due to application or user errors. This is equally true for SQL Server running on Azure Virtual Machines (VMs).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-both-include.md)]

For SQL Server running in Azure VMs, you can use native backup and restore techniques using attached disks for the destination of the backup files. However, there is a limit to the number of disks you can attach to an Azure virtual machine, based on the [size of the virtual machine](virtual-machines-linux-sizes.md). There is also the overhead of disk management to consider.

Beginning with SQL Server 2014, you can backup and restore to Microsoft Azure Blob storage. SQL Server 2016 also provides enhancements for this option. In addition, for database files stored in Microsoft Azure Blob storage, SQL Server 2016 provides an option for nearly instantaneous backups and for rapid restores using Azure snapshots. This article provides an overview of these options, and additional information can be found at [SQL Server Backup and Restore with Microsoft Azure Blob Storage Service](https://msdn.microsoft.com/library/jj919148.aspx).

>[AZURE.NOTE] For a discussion of the options for backing up very large databases, see [Multi-Terabyte SQL Server Database Backup Strategies for Azure Virtual Machines](http://blogs.msdn.com/b/igorpag/archive/2015/07/28/multi-terabyte-sql-server-database-backup-strategies-for-azure-virtual-machines.aspx).

The sections below include information specific to the different versions of SQL Server supported in an Azure virtual machine.

## SQL Server Virtual Machines

When your SQL Server instance is running on an Azure Virtual Machine, your database files already reside on data disks in Azure. These disks live in Azure Blob storage. So the reasons for backing up your database and the approach you take changes slightly. Consider the following. 

- You no longer need to perform database backups to provide protection against hardware or media failure because Microsoft Azure provides this protection as part of the Microsoft Azure service.

- You still need to perform database backups to provide protection against user errors, or for archival purposes, regulatory reasons, or administrative purposes.

- You can store the backup file directly in Azure. For more information, see the following sections that provide guidance for the different versions of SQL Server.

## SQL Server 2016 Release Candidate

Microsoft SQL Server 2016 Release Candidate (RC3) supports the [backup and restore with Azure blobs](https://msdn.microsoft.com/library/jj919148.aspx) features found in SQL Server 2014. But it also includes the following enhancements:

| 2016 Enhancement               | Details                          |
|---------------------|-------------------------------|
| **Striping**              | When backing up to Microsoft Azure blob storage, SQL Server 2016 supports backing up to multiple blobs to enable backing up large databases, up to a maximum of 12.8 TB.      |
| **Snapshot Backup**                | Through the use of Azure snapshots, SQL Server File-Snapshot Backup provides nearly instantaneous backups and rapid restores for database files stored using the Azure Blob storage service. This capability enables you to simplify your backup and restore policies. File-snapshot backup also supports point in time restore. For more information, see [Snapshot Backups for Database Files in Azure](https://msdn.microsoft.com/library/mt169363%28v=sql.130%29.aspx).   |
| **Managed Backup Scheduling**            | SQL Server Managed Backup to Azure now supports custom schedules. For more information, see [SQL Server Managed Backup to Microsoft Azure](https://msdn.microsoft.com/library/dn449496.aspx).   |

For a tutorial of the capabilities of SQL Server 2016 when using Azure Blob storage, see [Tutorial: Using the Microsoft Azure Blob storage service with SQL Server 2016 databases](https://msdn.microsoft.com/library/dn466438.aspx).

## SQL Server 2014

SQL Server 2014 includes the following enhancements:

1. **Backup and Restore to Azure**:

 - *SQL Server Backup to URL* now has support in SQL Server Management Studio. The option to backup to Azure is now available when using Backup or Restore task, or maintenance plan wizard in SQL Server Management Studio. For more information, see [SQL Server Backup to URL](https://msdn.microsoft.com/library/jj919148%28v=sql.120%29.aspx).
 - *SQL Server Managed Backup to Azure* has new functionality that enables automated backup management. This is especially useful for automating backup management for SQL Server 2014 instances running on an Azure Machine. For more information, see [SQL Server Managed Backup to Microsoft Azure](https://msdn.microsoft.com/library/dn449496%28v=sql.120%29.aspx).
 - *Automated Backup* provides additional automation to automatically enable *SQL Server Managed Backup to Azure* on all existing and new databases for a SQL Server VM in Azure. For more information, see [Automated Backup for SQL Server in Azure Virtual Machines](virtual-machines-windows-classic-sql-automated-backup.md).
 - For an overview of all the options for SQL Server 2014 Backup to Azure, see [SQL Server Backup and Restore with Microsoft Azure Blob Storage Service](https://msdn.microsoft.com/library/jj919148%28v=sql.120%29.aspx).

1. **Encryption**: SQL Server 2014 supports encrypting data when creating a backup. It supports several encryption algorithms and the use osf a certificate or asymmetric key. For more information, see [Backup Encryption](https://msdn.microsoft.com/library/dn449489%28v=sql.120%29.aspx).

## SQL Server 2012

For detailed information on SQL Server Backup and Restore in SQL Server 2012, see [Backup and Restore of SQL Server Databases (SQL Server 2012)](https://msdn.microsoft.com/library/ms187048%28v=sql.110%29.aspx).

Starting in SQL Server 2012 SP1 Cumulative Update 2, you can back up to and restore from the Azure Blob Storage service. This enhancement can be used to backup SQL Server databases on a SQL Server running on an Azure Virtual Machine or an on-premises instance. For more information, see [SQL Server Backup and Restore with Azure Blob Storage Service](https://msdn.microsoft.com/library/jj919148%28v=sql.110%29.aspx).

Some of the benefits of using the Azure Blob storage service include the ability to bypass the 16 disk limit for attached disks, ease of management, the direct availability of the backup file to another instance of SQL Server instance running on an Azure virtual machine, or an on-premises instances for migration or disaster recovery purposes. For a full list of benefits to using an Azure blob storage service for SQL Server backups, see the *Benefits* section in [SQL Server Backup and Restore with Azure Blob Storage Service](https://msdn.microsoft.com/library/jj919148%28v=sql.110%29.aspx).

For Best Practice recommendations and troubleshooting information, see [Backup and Restore Best Practices (Azure Blob Storage Service)](https://msdn.microsoft.com/library/jj919149%28v=sql.110%29.aspx).

## SQL Server 2008

For SQL Server Backup and Restore in SQL Server 2008 R2, see [Backing up and Restoring Databases in SQL Server (SQL Server 2008 R2)](https://msdn.microsoft.com/library/ms187048%28v=sql.105%29.aspx).

For SQL Server Backup and Restore in SQL Server 2008, see [Backing up and Restoring Databases in SQL Server (SQL Server 2008)](https://msdn.microsoft.com/library/ms187048%28v=sql.100%29.aspx).

## Next steps

If you are planning your deployment of SQL Server in an Azure VM, you can find provisioning guidance in the following tutorial: [Provisioning a SQL Server Virtual Machine on Azure with Azure Resource Manager](virtual-machines-windows-portal-sql-server-provision.md).

Although backup and restore can be used to migrate your data, there are potentially easier data migration paths to SQL Server on an Azure VM. For a full discussion of migration options and recommendations, see [Migrating a Database to SQL Server on an Azure VM](virtual-machines-windows-migrate-sql.md).

Review other [resources for running SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-server-iaas-overview.md).

<properties
	pageTitle="How to use Azure storage for SQL Server backup and restore | Microsoft Azure"
	description="Backup SQL Server and SQL Database to Azure Storage. Explains the benefits of backing up SQL databases to Azure Storage, and which SQL Server and Azure Storage components are required"
	services="sql-database, virtual-machines"
	documentationCenter=""
	authors="carlrabeler"
	manager="jeffreyg"
	editor="tysonn"/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="vm-windows-sql-server"
	ms.topic="article"
	ms.date="10/20/2015"
	ms.author="carlrab"/>



# How to Use Azure Storage for SQL Server Backup and Restore

## Overview

The feature that provides the ability to write SQL Server backups to the Azure Blob storage service was released in SQL Server 2012 SP1 CU2. You can use this functionality to back up to and restore from the Azure Blob service with an on-premises SQL Server database or a SQL Server database in an Azure virtual machine. Backup to cloud offers benefits of availability, limitless geo-replicated off-site storage, and ease of migration of data to and from the cloud.   You can issue BACKUP or RESTORE statements by using Transact-SQL or SMO. Furthermore, when database files are stored in an Azure blob and you are using SQL Server 2016, you can use [file-snapshot backup](http://msdn.microsoft.com/library/mt169363.aspx) to perform nearly instantaneous backups and incredibly quick restores.

## Benefits of Using the Azure Blob Service for SQL Server Backups

Storage management, risk of storage failure, access to off-site storage, and configuring devices are some of the general backup challenges. These challenges exist for both on-premises database instances and Azure virtual machine database instances. The following lists some of the key benefits of using the Azure Blob storage service storage for SQL Server backups:

* Flexible, reliable, and limitless off-site storage: Storing your backups in Azure blobs can be a convenient, flexible, and easy to access off-site option. Creating off-site storage for your SQL Server backups can be as easy as modifying your existing scripts/jobs to use the **BACKUP TO URL** syntax. Off-site storage should typically be far enough from the production database location to prevent a single disaster that might impact both the off-site and production database locations. By choosing to [geo-replicate your Azure blobs](../storage/storage-redundancy.md), you have an extra layer of protection in the event of a disaster that could affect the whole region. 
* Backup Archive: The Azure Blob Storage service offers a better alternative to the often used tape option to archive backups. Tape storage might require physical transportation to an off-site facility and measures to protect the media. Storing your backups in Azure Blob Storage provides an instant, highly available, and a durable archiving option.
* No overhead of hardware management: There is no overhead of hardware management with Azure services. Azure services manage the hardware and provide geo-replication for redundancy and protection against hardware failures.
* Currently for instances of SQL Server running in an Azure virtual machine, backing up to Azure Blob storage services can be done by creating attached disks. However, there is a limit to the number of disks you can attach to an Azure virtual machine for backups. This limit is 16 disks for an extra large instance and fewer for smaller instances. By enabling a direct backup to Azure blobse, you have access to virtually unlimited storage.
* Backups stored in Azure blobs are available from anywhere and at any time and can easily be accessed for restores to either an on-premises SQL Server or another SQL Server running in an Azure Virtual Machine, without the need for database attach/detach or downloading and attaching the VHD.
* Cost Benefits: Pay only for the service that is used. Can be cost-effective as an off-site and backup archive option. See the [Azure pricing calculator](http://go.microsoft.com/fwlink/?LinkId=277060 "Pricing Calculator"), and the [Azure Pricing article](http://go.microsoft.com/fwlink/?LinkId=277059 "Pricing article") for more information.
* Leverage storage snapshots: When database files are stored in an Azure blob and you are using SQL Server 2016, you can use [file-snapshot backup](http://msdn.microsoft.com/library/mt169363.aspx) to perform nearly instantaneous backups and incredibly quick restores.

For more details, see [SQL Server Backup and Restore with Azure Blob Storage Service](http://go.microsoft.com/fwlink/?LinkId=271617).

The following two sections introduce the Azure Blob storage service, and the SQL Server components used when backing up to or restoring from the Azure Blob storage service. It is important to understand the components and the interaction between them to do a backup to or restore from the Azure Blob storage service.

Creating an Azure account is the first step to this process. For a complete walkthrough of creating a storage account and performing a simple restore using SQL Server 2014, see [Getting Started with Azure Storage Service for SQL Server Backup and Restore](https://msdn.microsoft.com/library/jj720558\(v=sql.120\).aspx). For a complete walkthrough of creating a storage account and performing a simple restore using SQL Server 2014, see [Tutorial: Using the Microsoft Azure Blob storage service with SQL Server 2016 databases](https://msdn.microsoft.com/library/dn466438.aspx).

## Azure Blob Storage Service Components

* Storage Account: The storage account is the starting point for all storage services. To access an Azure Blob Storage service, first create an Azure Storage account. For more information about Azure Blob storage service, see [How to use the Azure Blob Storage Service](http://azure.microsoft.com/develop/net/how-to-guides/blob-storage/)

* Container: A container provides a grouping of a set of blobs, and can store an unlimited number of Blobs. To write a SQL Server backup to an Azure Blob service, you must have at least the root container created.

* Blob: A file of any type and size. Blobs are addressable using the following URL format: `https://<storage account>.blob.core.windows.net/<container>/<blob>`
For more information about page Blobs, see [Understanding Block and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx)

## SQL Server Components

* URL: A URL specifies a Uniform Resource Identifier (URI) to a unique backup file. The URL is used to provide the location and name of the SQL Server backup file. The URL must point to an actual blob, not just a container. If the blob does not exist, it is created. If an existing blob is specified, BACKUP fails, unless the > WITH FORMAT option is specified.
Following is an example of the URL you would specify in the BACKUP command:
**`http[s]://ACCOUNTNAME.Blob.core.windows.net/<CONTAINER>/<FILENAME.bak>`

<b>Note:</b> HTTPS is not required, but is recommended.
<b>Important</b>
If you choose to copy and upload a backup file to the Azure Blob storage service, you must use a page blob type as your storage option if you are planning to use this file for restore operations. RESTORE from a block blob type will fail with an error.

* Credential: The information that is required to connect and authenticate to Azure Blob storage service is stored as a Credential.  In order for SQL Server to write backups to an Azure Blob or restore from it, a SQL Server credential must be created. For more information, see [SQL Server Credential](https://msdn.microsoft.com/library/ms189522.aspx).

## SQL Server Database Backups and Restore with Azure Blobs- Concepts and Tasks:

**Concepts, Considerations, and Code samples:**

[SQL Server Backup and Restore with Azure Blob Storage Service](http://go.microsoft.com/fwlink/?LinkId=271617)

**Getting Started Tutorial:**

[Tutorial: Using the Microsoft Azure Blob storage service with SQL Server 2016 databases](https://msdn.microsoft.com/library/dn466438.aspx)

**Best Practices, Troubleshooting:**

[Back and Restore Best Practices (Azure Blob Storage Service)](http://go.microsoft.com/fwlink/?LinkId=272394)

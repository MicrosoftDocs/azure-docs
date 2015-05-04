<properties 
	pageTitle="How to use Azure storage for SQL Server backup and restore | Azure" 
	description="Backup SQL Server and SQL Database to Azure Storage. Explains the benefits of backing up SQL databases to Azure Storage, and which SQL Server and Azure Storage components are required" 
	services="sql-database, virtual-machines" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor="tysonn"/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/06/2015" 
	ms.author="jeffreyg"/>



# How to Use Azure Storage for SQL Server Backup and Restore

## Overview

The feature that provides the ability to write SQL Server backups to the Azure Blob storage service was released in SQL Server 2012 SP1 CU2. You can use this functionality to back up to and restore from the Azure Blob service from a on-premises SQL Server database or a SQL Server database in an Azure Virtual Machine. Backup to cloud offers benefits of availability, limitless geo-replicated off-site storage, and ease of migration of data to and from the cloud.   In this release, you can issue BACKUP or RESTORE statements by using T-SQL or SMO.

## Benefits of Using the Azure Blob Service for SQL Server Backups

Storage management, risk of storage failure, access to off-site storage, and configuring devices are some of the general backup challenges.  For SQL Server running in an Azure Virtual Machine, there are additional challenges of configuring and backing up a VHD, or configuring attached drives. The following lists some of the key benefits of using the Azure Blob storage service storage for SQL Server backups:

* Flexible, reliable, and limitless off-site storage: Storing your backups on Azure Blob service can be a convenient, flexible, and easy to access off-site option. Creating off-site storage for your SQL Server backups can be as easy as modifying your existing scripts/jobs. Off-site storage should typically be far enough from the production database location to prevent a single disaster that might impact both the off-site and production database locations. By choosing to geo replicate the Blob storage you have an extra layer of protection in the event of a disaster that could affect the whole region. In addition, backups are available from anywhere and at any time and can easily be accessed for restores.
* Backup Archive: The Azure Blob Storage service offers a better alternative to the often used tape option to archive backups. Tape storage might require physical transportation to an off-site facility and measures to protect the media. Storing your backups in Azure Blob Storage provides an instant, highly available, and a durable archiving option.
* No overhead of hardware management: There is no overhead of hardware management with Azure services. Azure services manage the hardware and provide geo-replication for redundancy and protection against hardware failures.
* Currently for instances of SQL Server running in an Azure Virtual Machine, backing up to Azure Blob storage services can be done by creating attached disks. However, there is a limit to the number of disks you can attach to an Azure Virtual Machine. This limit is 16 disks for an extra large instance and fewer for smaller instances. By enabling a direct backup to Azure Blob Storage, you can bypass the 16 disk limit.
* In addition, the backup file which now is stored in the Azure Blob storage service is directly available to either an on-premises SQL Server or another SQL Server running in an Azure Virtual Machine, without the need for database attach/detach or downloading and attaching the VHD.
* Cost Benefits: Pay only for the service that is used. Can be cost-effective as an off-site and backup archive option. See the [Azure pricing calculator](http://go.microsoft.com/fwlink/?LinkId=277060 "Pricing Calculator"), and the [Azure Pricing article](http://go.microsoft.com/fwlink/?LinkId=277059 "Pricing article") for more information.

For more details, see [SQL Server Backup and Restore with Azure Blob Storage Service](http://go.microsoft.com/fwlink/?LinkId=271617).

The following two sections introduce the Azure Blob storage service, and the SQL Server components used when backing up to or restoring from the Azure Blob storage service. It is important to understand the components and the interaction between them to do a backup to or restore from the Azure Blob storage service. 

Creating an Azure account is the first step to this process. SQL Server uses the Azure storage account name and its access key values to authenticate and write and read blobs to the storage service. The SQL Server Credential stores this authentication information and is used during the backup or restore operations. 

For a complete walkthrough of creating a storage account and performing a simple restore, see [Getting Started with Azure Storage Service for SQL Server Backup and Restore](http://go.microsoft.com/fwlink/?LinkId=271615) 

## Azure Blob Storage Service Components 

* Storage Account: The storage account is the starting point for all storage services. To access an Azure Blob Storage service, first create an Azure Storage account. The storage account name and its access key properties are required to authenticate to the Azure Blob Storage service and its components. 
For more information about Azure Blob storage service, see [How to use the Azure Blob Storage Service](http://azure.microsoft.com/develop/net/how-to-guides/blob-storage/)

* Container: A container provides a grouping of a set of Blobs, and can store an unlimited number of Blobs. To write a SQL Server backup to an Azure Blob service, you must have at least the root container created. 

* Blob: A file of any type and size. There are two types of blobs that can be stored in the Azure Blob storage service: block and page blobs.  SQL Server backup uses page Blobs as the Blob type. Blobs are addressable using the following URL format: `https://<storage account>.blob.core.windows.net/<container>/<blob>`
For more information about page Blobs, see [Understanding Block and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx)

## SQL Server Components

* URL: A URL specifies a Uniform Resource Identifier (URI) to a unique backup file. The URL is used to provide the location and name of the SQL Server backup file. In this implementation, the only valid URL is one that points to a page Blob in an Azure Storage account. The URL must point to an actual Blob, not just a container. If the Blob does not exist, it is created. If an existing Blob is specified, BACKUP fails, unless the > WITH FORMAT option is specified. 
Following is an example of the URL you would specify in the BACKUP command: 
**`http[s]://ACCOUNTNAME.Blob.core.windows.net/<CONTAINER>/<FILENAME.bak>`

<b>Note:</b> HTTPS is not required, but is recommended.
<b>Important</b>
If you choose to copy and upload a backup file to the Azure Blob storage service, you must use a page blob type as your storage option if you are planning to use this file for restore operations. RESTORE from a block blob type will fail with an error. 

* Credential: The information that is required to connect and authenticate to Azure Blob storage service is stored as a Credential.  In order for SQL Server to write backups to an Azure Blob or restore from it, a SQL Server credential must be created. The Credential stores the name of the storage account and the storage account access key.  Once the credential is created, it must be specified in the WITH CREDENTIAL option when issuing the BACKUP/RESTORE statements. 
For step by step instructions about how to create a SQL Server Credential, see [Getting Started with Azure Storage Service for SQL Server Backup and Restore](http://go.microsoft.com/fwlink/?LinkId=271615).

## SQL Server Database Backups and Restore with Azure Blobs- Concepts and Tasks:

**Concepts, Considerations, and Code samples:**

[SQL Server Backup and Restore with Azure Blob Storage Service](http://go.microsoft.com/fwlink/?LinkId=271617)

**Getting Started Tutorial:**

[Getting Started with SQL Server Backup and Restore to Azure Blob Storage Service](http://go.microsoft.com/fwlink/?LinkID=271615 "Tutorial")

**Best Practices, Troubleshooting:**
	
[Back and Restore Best Practices (Azure Blob Storage Service)](http://go.microsoft.com/fwlink/?LinkId=272394)




	





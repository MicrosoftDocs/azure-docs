---
title: Migrate a SQL Server database to SQL Server on a VM | Microsoft Docs
description: Learn about how to migrate an on-premises user database to SQL Server in an Azure virtual machine.
services: virtual-machines-windows
documentationcenter: ''
author: MashaMSFT
manager: craigg
editor: ''
tags: azure-service-management
ms.assetid: 00fd08c6-98fa-4d62-a3b8-ca20aa5246b1
ms.service: virtual-machines-sql 
ms.workload: iaas-sql-server
ms.tgt_pltfrm: vm-windows-sql-server
ms.devlang: na
ms.topic: article
ms.date: 08/18/2018
ms.author: mathoma
ms.reviewer: jroth
---
# Migrate a SQL Server database to SQL Server in an Azure VM

There are a number of methods to migrate an on-premises SQL Server user database to SQL Server in an Azure VM. This article will briefly discuss various methods and recommend the best method for various scenarios.


[!INCLUDE [learn-about-deployment-models](../../../../includes/learn-about-deployment-models-both-include.md)]

  > [!NOTE]
  > SQL Server 2008 and SQL Server 2008 R2 are approaching the [end of their support life cycle](https://www.microsoft.com/sql-server/sql-server-2008) for on-premises instances. To extend support, you can either migrate your SQL Server instance to an Azure VM, or buy Extended Security Updates to keep it on-premises. For more information, see [Extend support for SQL Server 2008 and 2008 R2 with Azure](virtual-machines-windows-sql-server-2008-eos-extend-support.md)

## What are the primary migration methods?
The primary migration methods are:

* Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine
* Perform a backup to URL and restore into the Azure virtual machine from the URL
* Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure VM from URL
* Convert on-premises physical machine to Hyper-V VHD, upload to Azure Blob storage, and then deploy as new VM using uploaded VHD
* Ship hard drive using Windows Import/Export Service
* If you have an AlwaysOn Availability Group deployment on-premises, use the [Add Azure Replica Wizard](../sqlclassic/virtual-machines-windows-classic-sql-onprem-availability.md) to create a replica in Azure and then failover, pointing users to the Azure database instance
* Use SQL Server [transactional replication](https://msdn.microsoft.com/library/ms151176.aspx) to configure the Azure SQL Server instance as a subscriber and then disable replication, pointing users to the Azure database instance

> [!TIP]
> You can also use these same techniques to move databases between SQL Server VMs in Azure. For example, there is no supported way to upgrade a SQL Server gallery-image VM from one version/edition to another. In this case, you should create a new SQL Server VM with the new version/edition, and then use one of the migration techniques in this article to move your databases. 

## Choosing your migration method
For optimum data transfer performance, migrate the database files into the Azure VM using a compressed backup file.

To minimize downtime during the database migration process, use either the AlwaysOn option or the transactional replication option.

If it is not possible to use the above methods, manually migrate your database. Using this method, you will generally start with a database backup followed by a copy of the database backup into Azure and then perform a database restore. You can also copy the database files themselves into Azure and then attach them. There are several methods by which you can accomplish this manual process of migrating a database into an Azure VM.

> [!NOTE]
> When you upgrade to SQL Server 2014 or SQL Server 2016 from older versions of SQL Server, you should consider whether changes are needed. We recommend that you address all dependencies on features not supported by the new version of SQL Server as part of your migration project. For more information on the supported editions and scenarios, see [Upgrade to SQL Server](https://msdn.microsoft.com/library/bb677622.aspx).

The following table lists each of the primary migration methods and discusses when the use of each method is most appropriate.

| Method | Source database version | Destination database version | Source database backup size constraint | Notes |
| --- | --- | --- | --- | --- |
| [Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine](#backup-and-restore) |SQL Server 2005 or greater |SQL Server 2005 or greater |[Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/) | This is a very simple and well-tested technique for moving databases across machines. |
| [Perform a backup to URL and restore into the Azure virtual machine from the URL](#backup-to-url-and-restore) |SQL Server 2012 SP1 CU2 or greater |SQL Server 2012 SP1 CU2 or greater |< 12.8 TB for SQL Server 2016, otherwise < 1 TB | This method is just another way to move the backup file to the VM using Azure storage. |
| [Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure virtual machine from URL](#detach-and-attach-from-url) |SQL Server 2005 or greater |SQL Server 2014 or greater |[Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/) |Use this method when you plan to [store these files using the Azure Blob storage service](https://msdn.microsoft.com/library/dn385720.aspx) and attach them to SQL Server running in an Azure VM, particularly with very large databases |
| [Convert on-premises machine to Hyper-V VHDs, upload to Azure Blob storage, and then deploy a new virtual machine using uploaded VHD](#convert-to-vm-and-upload-to-url-and-deploy-as-new-vm) |SQL Server 2005 or greater |SQL Server 2005 or greater |[Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/) |Use when [bringing your own SQL Server license](../../../sql-database/sql-database-paas-vs-sql-server-iaas.md), when migrating a database that you will run on an older version of SQL Server, or when migrating system and user databases together as part of the migration of database dependent on other user databases and/or system databases. |
| [Ship hard drive using Windows Import/Export Service](#ship-hard-drive) |SQL Server 2005 or greater |SQL Server 2005 or greater |[Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/) |Use the [Windows Import/Export Service](../../../storage/common/storage-import-export-service.md) when manual copy method is too slow, such as with very large databases |
| [Use the Add Azure Replica Wizard](../sqlclassic/virtual-machines-windows-classic-sql-onprem-availability.md) |SQL Server 2012 or greater |SQL Server 2012 or greater |[Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/) |Minimizes downtime, use when you have an Always On on-premises deployment |
| [Use SQL Server transactional replication](https://msdn.microsoft.com/library/ms151176.aspx) |SQL Server 2005 or greater |SQL Server 2005 or greater |[Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/) |Use when you need to minimize downtime and do not have an Always On on-premises deployment |

## Backup and restore
Back up your database with compression, copy the backup to the VM, and then restore the database. If your backup file is larger than 1 TB, you must stripe it because the maximum size of a VM disk is 1 TB. Use the following general steps to migrate a user database using this manual method:

1. Perform a full database backup to an on-premises location.
2. Create or upload a virtual machine with the version of SQL Server desired.
3. Setup connectivity based on your requirements. See [Connect to a SQL Server Virtual Machine on Azure (Resource Manager)](virtual-machines-windows-sql-connect.md).
4. Copy your backup file(s) to your VM using remote desktop, Windows Explorer or the copy command from a command prompt.

## Backup to URL and restore
Instead of backing up to a local file, you can use the [backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) and then restore from URL to the VM. With SQL Server 2016, striped backup sets are supported, are recommended for performance, and required to exceed the size limits per blob. For very large databases, the use of the [Windows Import/Export Service](../../../storage/common/storage-import-export-service.md) is recommended.

## Detach and attach from URL
Detach your database and log files and transfer them to [Azure Blob storage](https://msdn.microsoft.com/library/dn385720.aspx). Then attach the database from the URL on your Azure VM. Use this if you want the physical database files to reside in Blob storage. This might be useful for very large databases. Use the following general steps to migrate a user database using this manual method:

1. Detach the database files from the on-premises database instance.
2. Copy the detached database files into Azure blob storage using the [AZCopy command-line utility](../../../storage/common/storage-use-azcopy.md).
3. Attach the database files from the Azure URL to the SQL Server instance in the Azure VM.

## Convert to VM and upload to URL and deploy as new VM
Use this method to migrate all system and user databases in an on-premises SQL Server instance to Azure virtual machine. Use the following general steps to migrate an entire SQL Server instance using this manual method:

1. Convert physical or virtual machines to Hyper-V VHDs.
2. Upload VHD files to Azure Storage by using the [Add-AzureVHD cmdlet](https://msdn.microsoft.com/library/windowsazure/dn495173.aspx).
3. Deploy a new virtual machine by using the uploaded VHD.

> [!NOTE]
> To migrate an entire application, consider using [Azure Site Recovery](../../../site-recovery/site-recovery-overview.md)].

## Ship hard drive
Use the [Windows Import/Export Service method](../../../storage/common/storage-import-export-service.md) to transfer large amounts of file data to Azure Blob storage in situations where uploading over the network is prohibitively expensive or not feasible. With this service, you send one or more hard drives containing that data to an Azure data center, where your data will be uploaded to your storage account.

## Next steps
For more information about running SQL Server on Azure Virtual Machines, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).

> [!TIP]
> If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](virtual-machines-windows-sql-server-iaas-faq.md).

For instructions on creating an Azure SQL Server Virtual Machine from a captured image, see [Tips & Tricks on ‘cloning’ Azure SQL virtual machines from captured images](https://blogs.msdn.microsoft.com/psssql/2016/07/06/tips-tricks-on-cloning-azure-sql-virtual-machines-from-captured-images/) on the CSS SQL Server Engineers blog.


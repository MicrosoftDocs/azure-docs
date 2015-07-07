<properties
	pageTitle="Migrate on-premises database to SQL Server in Azure virtual machine"
	description="Learn about how to migrate an on-premises user database to SQL Server in an Azure virtual machine."
	services="virtual-machines"
	documentationCenter=""
	authors="carlrabeler"
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/07/2015"
	ms.author="carlrab"/>



#Migrating a Database to SQL Server on an Azure VM
There are a number of methods for migrating an on-premises SQL Server database to SQL Server in an Azure virtual machine. This article will discuss the various methods, recommend the best method for various scenarios, and include a tutorial to guide you through the use of the Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard.


##What are the primary migration methods?
The primary migration methods are:
* [Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard](#Use-the-Deploy-a-SQL-Server-Database-to-a-Microsoft-Azure-VM-wizard-to-migrate-an-existing-database)
* [Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine](#Other Migration Methods to migrate a database)
* [Perform a backup to URL and restore into the Azure virtual machine from the URL](#Other Migration Methods to migrate a database)
* [Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure virtual machine from URL](#Other Migration Methods to migrate a database)
* [Convert on-premises machine to Hyper-V VHDs, upload to Azure Blob storage, and then deploy a new virtual machine using uploaded VHD](#Other Migration Methods to migrate a database)
* [Ship hard drive using Windows Import/Export Service](#Other Migration Methods to migrate a database)

Note: If you have an AlwaysOn deployment on-premises, you can also consider using the [Add Azure Replica Wizard](https://msdn.microsoft.com/en-us/library/dn463980.aspx) to create a replica in Azure and then failover as a method of migrating.

## Choosing your migration method
For optimum performance, migration of the database files into the Azure virtual machine by using a compressed backup is generally the best method. This is what the Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard does for you. This wizard is the recommended method for migrating an on-premises user database running on SQL Server 2005 or greater to SQL Server 2014 or greater when the compressed database backup is less than 1 TB.

If it is not possible to use the wizard because the database backup size is too large or you are migrating to an older version of SQL Server version, your migration process will be a manual process that will generally start with a database backup followed by a database restore into SQL Server in the Azure virtual machine. There several methods by which you can accomplish this manual process.

**Note**: When you upgrade to SQL Server 2014 or SQL Server 2016 from older versions of SQL Server, you might need to consider the changes that are needed. We recommend that you address all dependencies on features not supported by the new version of SQL Server as part of your migration project. For more information on the supported editions and scenarios, see [Upgrade to SQL Server]('https://msdn.microsoft.com/library/bb677622.aspx').

The following table lists each of the primary migration methods and discusses when the use of the method is most appropriate.

<table cellspacing="0" border="1">
<tr>
   <th align="left" valign="middle">Method</th>
   <th align="left" valign="middle">Source database version</th>
   <th align="left" valign="middle">Destination database version</th>
   <th align="left" valign="middle">Source database backup size constraint</th>
   <th align="left" valign="middle">Notes</th>
</tr>
<tr>
   <td valign="middle">[Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard](#Use-the-Deploy-a-SQL-Server-Database-to-a-Microsoft-Azure-VM-wizard-to-migrate-an-existing-database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2014 or greater</td>
   <td valign="middle">less than 1 TB</td>
   <td valign="middle">Fastest and simplest method, use whenever possible to migrate to a new or existing SQL Server instance in an Azure virtual machine</td>
</tr>
<tr>
   <td valign="middle">[Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2014 or greater</td>
   <td valign="middle">Azure VM storage limitations</td>
   <td valign="middle">Use only when you cannot use the wizard, such as when the destination database version is less than SQL Server 2012 SP1 CU2 or the database backup size is larger than 1 TB (12.8 TB with SQL Server 2016)</td>
</tr>
<tr>
   <td valign="middle">[Perform a backup to URL and restore into the Azure virtual machine from the URL](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2012 SP1 CU2 or greater</td>
   <td valign="middle">SQL Server 2012 SP1 CU2 or greater</td>
   <td valign="middle">less than 1 TB</td>
   <td valign="middle">Generally using [backup to URL](https://msdn.microsoft.com/en-us/library/dn435916.aspx] is equivalent in performance to using the wizard and not quite as easy</td>
</tr>
<tr>
   <td valign="middle">[Perform a backup to URL and restore into the Azure virtual machine from the URL](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2012 SP1 CU2 or greater</td>
   <td valign="middle">SQL Server 2016</td>
   <td valign="middle">less than 12.8 TB</td>
   <td valign="middle">Consider using [backup to URL](https://msdn.microsoft.com/en-us/library/dn435916.aspx) when Azure virtual machine with SQL Server already exists and the backup file size is larger than 1 TB. Use a striped backup set for performance and to exceed the size limits per blob. For large databases, also consider the [Windows Import/Export Service](https://azure.microsoft.com/en-us/documentation/articles/storage-import-export-service/).</td>
</tr>
<tr>
   <td valign="middle">[Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure virtual machine from URL](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2014 or greater</td>
   <td valign="middle">Azure Blob storage limitations</td>
   <td valign="middle">Use when attaching database files to SQL Server in an Azure VM [storing these files using the Azure Blob storage service](https://msdn.microsoft.com/en-us/library/dn385720.aspx), particularly with very large databases</td>
</tr>
<tr>
   <td valign="middle">[Convert on-premises machine to Hyper-V VHDs, upload to Azure Blob storage, and then deploy a new virtual machine using uploaded VHD](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">Azure VM storage limitations</td>
   <td valign="middle">Use when [bringing your own SQL Server license](https://azure.microsoft.com/en-us/documentation/articles/data-management-azure-sql-database-and-sql-server-iaas/), when migrating a database that you will run on an older version of SQL Server, or when migrating system and user databases together as part of the migration of database dependent on other user databases and/or system databases.</td>
</tr>
<tr>
   <td valign="middle">[Ship hard drive using Windows Import/Export Service](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">Azure VM storage limitations</td>
   <td valign="middle">Use the [Windows Import/Export Service](https://azure.microsoft.com/en-us/documentation/articles/storage-import-export-service/) when manual copy method is too slow, such as with very large databases</td>
</tr>
</table>

##Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard to migrate an existing database
Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard in Microsoft SQL Server Management Studio for Microsoft SQL Server 2016 to migrate a SQL Server 2005, SQL Server 2008, SQL Server 2008 R2, SQL Server 2012, SQL Server 2014, or SQL Server 2016 on-premises database (up to 1 TB) to SQL Server 2014 or SQL Server 2016 in an Azure virtual machine. When you migrate a database to a newer version of SQL Server, the database will automatically be upgraded as part of the process.

Use this wizard to migrate the selected database to an existing Azure virtual machine or use the wizard to create an Azure virtual machine with SQL Server 2014 and SQL Server 2016 installed as part of the migration process. To provision and configure an Azure virtual machine with a SQL Server 2014 or SQL Server 2016 image before using the wizard, see [Provisioning a SQL Server Virtual Machine on Azure](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-provision-sql-server/).

###Download Microsoft SQL Server Management Studio for Microsoft SQL Server 2016 (if applicable)
Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard in Microsoft SQL Server Management Studio for Microsoft SQL Server 2016. This version of the wizard incorporates the most recent updates to the Azure portal and supports the newest Azure virtual machine images in the Gallery. If you do not already have this version of Microsoft SQL Server Management Studio for Microsoft SQL Server 2016, [download it](http://go.microsoft.com/fwlink/?LinkId=616025) and install it on a client computer with connectivity to your on-premises database and to the internet. This version of SQL Server Management Studio, although still in preview mode, is fully supported and includes functionality not present in the SQL Server 2014 version of this wizard.

**Note**: To evaluate the most recent CTP of SQL Server 2016 itself, go to [TechNet Evaluation Center](http://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2016).

###Configure the existing Azure virtual machine and SQL Server instance (if applicable)
If you are migrating to an existing Azure virtual machine, the following configuration steps are required:
* Configure the Azure virtual machine and the SQL Server instance to enable connectivity from another computer by following the steps in Connect to the SQL Server VM instance from SSMS on another computer section in [Provisioning a SQL Server Virtual Machine on Azure](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-provision-sql-server/#SSMS).
* •	Configure an open endpoint for your SQL Server Cloud Adapter service on the Windows Azure gateway with private port of 11435. This endpoint is enables to wizard to utilize the Cloud Adaptor service that is created a part of SQL Server 2014 or SQL Server 2016 provisioning on an Azure VM. For more information, see [Cloud Adapter for SQL Server](https://msdn.microsoft.com/library/en-us/dn169301.aspx). This port is created as part of SQL Server 2014 or SQL Server 2016 provisioning on a Windows Azure VM. The Cloud Adapter also creates a Windows Firewall rule to allow its incoming TCP connections at default port 11435.
![Create Cloud Adapter Endpoint][cloud-adapter-endpoint]
##Other Migration Methods to migrate a database


## Next Steps

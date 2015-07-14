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
	ms.date="07/12/2015"
	ms.author="carlrab"/>



#Migrating a Database to SQL Server on an Azure VM
There are a number of methods for migrating an on-premises SQL Server database to SQL Server in an Azure virtual machine. This article will discuss the various methods, recommend the best method for various scenarios, and include a tutorial to guide you through the use of the Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard.


##What are the primary migration methods?
The primary migration methods are:

- Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard
- Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine
- Perform a backup to URL and restore into the Azure virtual machine from the URL
- Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure virtual machine from URL
- Convert on-premises machine to Hyper-V VHDs, upload to Azure Blob storage, and then deploy a new virtual machine using uploaded VHD]
- Ship hard drive using Windows Import/Export Service

Note: If you have an AlwaysOn deployment on-premises, you can also consider using the [Add Azure Replica Wizard](https://msdn.microsoft.com/library/dn463980.aspx) to create a replica in Azure and then failover as a method of migrating.

## Choosing your migration method
For optimum performance, migration of the database files into the Azure virtual machine by using a compressed backup is generally the best method. This is what the Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard does for you. This wizard is the recommended method for migrating an on-premises user database running on SQL Server 2005 or greater to SQL Server 2014 or greater when the compressed database backup is less than 1 TB.

[Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine](#Other-migration-methods-to-migrate-a-database)

[blah](#choosing-your-migration-method)

If it is not possible to use the wizard because the database backup size is too large or you are migrating to an older version of SQL Server version, your migration process will be a manual process that will generally start with a database backup followed by a database restore into SQL Server in the Azure virtual machine. There several methods by which you can accomplish this manual process.

**Note**: When you upgrade to SQL Server 2014 or SQL Server 2016 from older versions of SQL Server, you might need to consider the changes that are needed. We recommend that you address all dependencies on features not supported by the new version of SQL Server as part of your migration project. For more information on the supported editions and scenarios, see [Upgrade to SQL Server](https://msdn.microsoft.com/library/bb677622.aspx).

The following table lists each of the primary migration methods and discusses when the use of each method is most appropriate.

[Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine](#Other-migration-methods-to-migrate-a-database)

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
   <td valign="middle">[Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine](#Other-migration-methods-to-migrate-a-database)</td>
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
	<td valign="middle">Generally using [backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) is equivalent in performance to using the wizard and not quite as easy</td>
<tr>
   <td valign="middle">[Perform a backup to URL and restore into the Azure virtual machine from the URL](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2012 SP1 CU2 or greater</td>
   <td valign="middle">SQL Server 2016</td>
   <td valign="middle">less than 12.8 TB</td>
   <td valign="middle">Consider using [backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) when Azure virtual machine with SQL Server already exists and the backup file size is larger than 1 TB. Use a striped backup set for performance and to exceed the size limits per blob. For large databases, also consider the [Windows Import/Export Service](../storage-import-export-service/).</td>
</tr>
<tr>
   <td valign="middle">[Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure virtual machine from URL](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2014 or greater</td>
   <td valign="middle">Azure Blob storage limitations</td>
   <td valign="middle">Use when attaching database files to SQL Server in an Azure VM [storing these files using the Azure Blob storage service](https://msdn.microsoft.com/library/dn385720.aspx), particularly with very large databases</td>
</tr>
<tr>
   <td valign="middle">[Convert on-premises machine to Hyper-V VHDs, upload to Azure Blob storage, and then deploy a new virtual machine using uploaded VHD](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">Azure VM storage limitations</td>
   <td valign="middle">Use when [bringing your own SQL Server license](../data-management-azure-sql-database-and-sql-server-iaas/), when migrating a database that you will run on an older version of SQL Server, or when migrating system and user databases together as part of the migration of database dependent on other user databases and/or system databases.</td>
</tr>
<tr>
   <td valign="middle">[Ship hard drive using Windows Import/Export Service](#Other Migration Methods to migrate a database)</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">SQL Server 2005 or greater</td>
   <td valign="middle">Azure VM storage limitations</td>
   <td valign="middle">Use the [Windows Import/Export Service](../storage-import-export-service/) when manual copy method is too slow, such as with very large databases</td>
</tr>
</table>

##Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard to migrate an existing database
Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard in Microsoft SQL Server Management Studio for Microsoft SQL Server 2016 to migrate a SQL Server 2005, SQL Server 2008, SQL Server 2008 R2, SQL Server 2012, SQL Server 2014, or SQL Server 2016 on-premises database (up to 1 TB) to SQL Server 2014 or SQL Server 2016 in an Azure virtual machine. When you migrate a database to a newer version of SQL Server, the database will automatically be upgraded as part of the process.

Use this wizard to migrate the selected database to an existing Azure virtual machine or use the wizard to create an Azure virtual machine with SQL Server 2014 and SQL Server 2016 installed as part of the migration process. To provision and configure an Azure virtual machine with a SQL Server 2014 or SQL Server 2016 image before using the wizard, see [Provisioning a SQL Server Virtual Machine on Azure](../virtual-machines-provision-sql-server/).

###Get Latest Version of Microsoft SQL Server Management Studio
Use the latest version of the Deploy a SQL Server Database to a Microsoft Azure VM wizard in Microsoft SQL Server Management Studio for SQL Server. The latest version of the wizard incorporates the most recent updates to the Azure portal and supports the newest Azure virtual machine images in the Gallery. To get the latest version of Microsoft SQL Server Management Studio for Microsoft SQL Server, [download it](http://go.microsoft.com/fwlink/?LinkId=616025) and install it on a client computer with connectivity to your on-premises database and to the internet.

###Configure the existing Azure virtual machine and SQL Server instance (if applicable)
If you are migrating to an existing Azure virtual machine, the following configuration steps are required:

- Configure the Azure virtual machine and the SQL Server instance to enable connectivity from another computer by following the steps in Connect to the SQL Server VM instance from SSMS on another computer section in [Provisioning a SQL Server Virtual Machine on Azure](../virtual-machines-provision-sql-server/#SSMS).
- Configure an open endpoint for your SQL Server Cloud Adapter service on the Microsoft Azure gateway with private port of 11435. This endpoint is enables to wizard to utilize the Cloud Adaptor service that is created a part of SQL Server 2014 or SQL Server 2016 provisioning on an Azure VM. For more information, see [Cloud Adapter for SQL Server](https://msdn.microsoft.com/library/dn169301.aspx). This port is created as part of SQL Server 2014 or SQL Server 2016 provisioning on a Microsoft Azure VM. The Cloud Adapter also creates a Windows Firewall rule to allow its incoming TCP connections at default port 11435.
![Create Cloud Adapter Endpoint](./media/virtual-machines-migrate-onpremises-database/cloud-adapter-endpoint.png)

###Run the Use the Deploy a SQL Server Database to a Microsoft Azure VM wizard
1. Open Microsoft SQL Server Management Studio for Microsoft SQL Server 2016 and connect to the SQL Server instance containing the database that you are going to migrate to an Azure virtual machine.
2. Right-click the database that you are migrating, point to Tasks and then click Deploy to a Microsoft Azure virtual machine.
![Start Wizard](./media/virtual-machines-migrate-onpremises-database/start-wizard.png)
3. On the Introduction page, click Next.
4. On the Source Settings page, connect to the SQL Server instance containing the database that you are going to migrate to an Azure virtual machine.
5. Specify a temporary location for the backup files. If connecting to a remote server, you must specify a network drive.
6. Click Next.
![Source Settings][source-settings]
7. On the Microsoft Azure Sign-In page, click Sign In and sign-in to your Azure account.
8. Select the subscription that you wish to use and click Next.
![Azure Sign-In][azure-signin]
9. On the Deployment Settings page, you can:
  a. Specify an existing Cloud Service name and Virtual Machine name to use an existing Azure virtual machine. This must an image built using a SQL Server 2014 or SQL Server 2016 Gallery Image.
	b. Specify an existing Cloud Service name and new Virtual Machine name to create a new Azure virtual machine in an existing Cloud Service. You can only select a SQL Server 2014 or SQL Server 2016 Gallery Image.
10.	Specify a new Cloud Service Name and Virtual Machine name to create a new Cloud Service with a new Azure virtual machine using a SQL Server 2014 or SQL Server 2016 Gallery image.
  a. If you specify a new Cloud Service name, specify the storage account that you will use.
	b. If you specify an existing Cloud Service name, the storage account will be retrieved and entered for you.
![Deploymnent Settings][deployment-settings]
11. Click Settings
  a. 	If you specified an existing Cloud Service name and Virtual Machine name, you will be prompted to provide the user name and password.
	![Azure machine settings][azure-machine-settings]
	b. If you specified a new Virtual Machine name, you will be prompted to select an image from the list of Gallery images and provide the following information:
	   i. Image – select only SQL Server 2014 or SQL Server 2016
		ii. Username
		iii. New password
		iv. Confirm password
		v. Location
		vi. Size.
	c. If addition, click to accept the self-generated certificate for this new Microsoft Azure Virtual Machine and then click OK.
	![Azure new machine settings][azure-new-machine-settings]
12. Specify the target database name if different from the source database name. If the target database already exists, the system will automatically increment the database name rather than overwrite the existing database.
13. Click Next and then click Finish.
![Results][results]
14. When the wizard completes, connect to your virtual machine and verify that your database has been migrated.
15. If you created a new virtual machine, Configure the Azure virtual machine and the SQL Server instance by following the steps in Connect to the SQL Server virtual machine instance from SSMS on another computer section in [Provisioning a SQL Server Virtual Machine on Azure](../virtual-machines-provision-sql-server/#SSMS).

## Other migration methods to migrate a database

These next sections give a brief overview of the steps required for each of the other migration methods previously discussed.
###Perform on-premises backup using compression and manually copy the backup file into the Azure virtual machine
Use this method when you cannot use the Deploy a SQL Server Database to a Microsoft Azure VM wizard either because you are migrating to a version of SQL Server prior to SQL Server 2014 or your backup file is larger than 1 TB. Use the following general steps to migrate a user database using this manual method:
1.	Perform a full database backup to an on-premises location.
2.	Create or upload a virtual machine with the version of SQL Server desired.
3.	Provision the virtual machine using the steps in [Provisioning a SQL Server Virtual Machine on Azure](../virtual-machines-provision-sql-server/#SSMS).
4.	Copy your backup file(s) to your VM while connected using remote desktop.
###Perform a backup to URL and restore into the Azure virtual machine from the URL
Use the [backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) method when you cannot use the Deploy a SQL Server Database to a Microsoft Azure VM wizard because your backup file is larger than 1 TB and you are migrating from and to SQL Server 2016. For databases smaller than 1 TB, use of the wizard is recommended. For very large databases, the use of the [Windows Import/Export Service](../storage-import-export-service/) is recommended.
###Detach and then copy the data and log files to Azure blob storage and then attach to SQL Server in Azure virtual machine from URL
Use this method when you plan to store your database files using the Azure blob storage service. Use the following general steps to migrate a user database using this manual method:
1.	Detach the database files from the on-premises database instance.
2.	Copy the detached database files into Azure blob storage using the [AZCopy command-line utility](../storage-use-azcopy/).
3.	Attach the database files from the Azure URL to the SQL Server instance in the Azure VM.
###Convert on-premises machine to Hyper-V VHDs, upload to Azure Blob storage, and then deploy a new virtual machine using uploaded VHD
Use this method to migrate all system and user databases in an on-premises SQL Server instance to Azure virtual machine. Use the following general steps to migrate an entire SQL Server instance using this manual method:
1.	Convert physical or virtual machines to Hyper-V VHDs by using [Microsoft Virtual Machine Converter](http://technet.microsoft.com/library/dn873998.aspx).
2.	Upload VHD files to Azure Storage by using the [Add-AzureVHD cmdlet](https://msdn.microsoft.com/library/windowsazure/dn495173.aspx).
3.	Deploy a new virtual machine by using the uploaded VHD.
Note: To migrate an entire application, consider using [Azure Site Recovery](../services/site-recovery/)].
###Ship hard drive using Windows Import/Export Service
Use the [Windows Import/Export Service method](../storage-import-export-service/) to transfer large amounts of file data to Azure Blob storage in situations where uploading over the network is prohibitively expensive or not feasible. With this service, you send one or more hard drives containing that data to an Azure data center, where your data will be uploaded to your storage account.

## Next Steps

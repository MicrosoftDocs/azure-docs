<properties 
	pageTitle="Overview of SQL Server on Azure VMs"
	description="This article provides an overview of SQL Server hosted on Azure IaaS Virtual Machines. This includes links to depth content." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="rothja" 
	manager="jeffreyg"
	editor=""/>

<tags
	ms.service="virtual-machines"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services" 
	ms.date="09/01/2015"
	ms.author="jroth"/>

# SQL Server on Azure Virtual Machines overview

## Getting started
You can host [SQL Server on Azure Virtual Machines](http://azure.microsoft.com/services/virtual-machines/sql-server/) in a variety of configurations, ranging from a single database server to a multi-machine configuration using AlwaysOn Availability Groups and an Azure Virtual Network.

>[AZURE.NOTE] Running SQL Server on an Azure VM is one option for storing relational data in Azure. You can also use the Azure SQL Database service. For more information, see [Understanding Azure SQL Database and SQL Server in Azure VMs](../sql-database/data-management-azure-sql-database-and-sql-server-iaas.md).

To create a SQL Server virtual machine in Azure, you must first obtain an Azure Platform subscription. You can purchase an Azure subscription at [Purchase Options](http://azure.microsoft.com/pricing/purchase-options/). To try it free, visit [Azure free trial](https://azure.microsoft.com/pricing/free-trial/). 

### Deploy a SQL Server instance on a single VM

After signing up for a subscription, the easiest way to deploy a SQL Server virtual machine in Azure is to [provision a SQL Server machine gallery image in the Azure Management Portal](virtual-machines-provision-sql-server.md). Those images include licensing of SQL Server in the pricing for the VM. 

The following table provides a matrix of available SQL Server images in the virtual machine gallery. 

|SQL Server version|Operating system|SQL Server edition|
|---|---|---|
|SQL Server 2008 R2 SP2|Windows Server 2008 R2|Enterprise, Standard, Web|
|SQL Server 2008 R2 SP3|Windows Server 2008 R2|Enterprise, Standard, Web|
|SQL Server 2012 SP2|Windows Server 2012|Enterprise, Standard, Web|
|SQL Server 2012 SP2|Windows Server 2012 R2|Enterprise, Standard, Web|
|SQL Server 2014|Windows Server 2012 R2|Enterprise, Standard, Web|
|SQL Server 2014 SP1|Windows Server 2012 R2|Enterprise, Standard, Web|
|SQL Server 2016 CTP|Windows Server 2012 R2|Evaluation|

>[AZURE.NOTE] The virtual machines gallery images for data warehousing and transactional workloads (not shown above) are deprecated and will be removed from the gallery soon. Please use the standard images in the previous table and optimize performance for your specific workload by following the recommendations in [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-performance-best-practices.md). 

In addition to these preconfigured images, you can also [create an Azure virtual machine](virtual-machines-windows-tutorial.md) without SQL Server pre-installed. You can install any instance of SQL Server for which you have a license. You migrate your license to Azure for running SQL Server in an Azure Virtual Machine using [License Mobility through Software Assurance on Azure](http://azure.microsoft.com/pricing/license-mobility/). In this scenario, you only pay for Azure compute and storage [costs](http://azure.microsoft.com/pricing/details/virtual-machines) associated with the virtual machine.

During these early stages of provisioning and configuring, common tasks include:

- [Review performance best practices for SQL Server in Azure VMs](virtual-machines-sql-server-performance-best-practices.md)
- [Review security best practices for SQL Server in Azure VMs](virtual-machines-sql-server-security-considerations.md)
- [Set up connectivity](virtual-machines-sql-server-connectivity.md)

### Migrate your data

After your SQL Server virtual machine is up and running, you might want to migrate existing databases to the machine. There are several techniques, but the deployment wizard in SQL Server Management Studio works well for most scenarios. For a discussion of the scenarios and a tutorial of the wizard, see [Migrating a Database to SQL Server on an Azure VM](virtual-machines-migrate-onpremises-database.md).

## High availability

If you require high availability, consider configuring SQL Server AlwaysOn Availability Groups. This involves multiple Azure VMs in a virtual network. The Azure Preview Portal has a template that sets up this configuration for you. For more information, see [SQL Server AlwaysOn Offering in Microsoft Azure Portal Gallery](http://blogs.technet.com/b/dataplatforminsider/archive/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery.aspx). 

If you want to manually configure your Availability Group and associated listener, see the following articles:

- [Configure AlwaysOn Availability Groups in Azure (GUI)](virtual-machines-sql-server-alwayson-availability-groups-gui.md)
- [Configure an ILB listener for AlwaysOn Availability Groups in Azure](virtual-machines-sql-server-configure-ilb-alwayson-availability-group-listener.md)
- [Deploy SQL Server AlwaysOn with an Azure Resource Manager template](virtual-machines-workload-template-sql-alwayson.md)
- [Extend on-premises AlwaysOn Availability Groups to Azure](virtual-machines-sql-server-extend-on-premises-alwayson-availability-groups.md)

For other high availability considerations, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions.md).

## Backup and restore
For on-premises databases, Azure can act as a secondary data center to store SQL Server backup files. For an overview of backup and restore options, see [Backup and Restore for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-backup-and-restore.md).

[SQL Server Backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) stores Azure backup files in Azure blob storage. [SQL Server Managed Backup](https://msdn.microsoft.com/library/dn449496.aspx) allows you to schedule backup and retention in Azure. These services can be used with either on-premises SQL Server instances or SQL Server running on Azure VMs. Azure VMs can also take advantage of [Automated Backup](virtual-machines-sql-server-automated-backup.md) and [Automated Patching](virtual-machines-sql-server-automated-patching.md) for SQL Server.

## SQL Server VM image configuration details

The following tables describe the configuration of the platform-provided SQL Server virtual machine images.

### Windows Server

The Windows Server installation in the platform image contains the following configurations settings and components:

|Feature|Configuration
|---|---|
|Remote Desktop|Enabled for the administrator account|
|Windows Update|Enabled|
|User Accounts|By default, the user account specified during provisioning is a member of the local Administrators group. This administrator account is also the member of the SQL Server sysadmin server role|
|Workgroups|The virtual machine is a member of a workgroup named WORKGROUP|
|Guest Account|Disabled|
|Windows Firewall with Advanced Security|On|
|.NET Framework|Version 4|
|Disks|The size-selected limits the number of data disks you can configure. See [Virtual Machine Sizes for Azure](virtual-machines-size-specs.md)|

### SQL Server

The SQL Server installation in the platform image contains the following configurations settings and components:

|Feature|Configuration|
|---|---|
|Database Engine|Installed|
|Analysis Services|Installed|
|Integration Services|Installed|
|Reporting Services|Configured in Native mode|
|AlwaysOn Availability Groups|Available in SQL Server 2012 or later. Requires [additional configuration](virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions.md)
|Replication|Installed|
|Full-Text and Semantic Extractions for Search|Installed (Semantic Extractions in SQL Server 2012 or later only)|
|Data Quality Services|Installed (SQL Server 2012 or later only)|
|Master Data Services|Installed (SQL Server 2012 or later only). Requires [additional configuration and components](https://msdn.microsoft.com/library/ee633752.aspx)
|PowerPivot for SharePoint|Available (SQL Server 2012 or later only). Requires additional configuration and components (including SharePoint)|
|Distributed Replay Client|Available (SQL Server 2012 or later only), but not installed. See [Running SQL Server setup from the platform-provided SQL Server image](#run-sql-server-setup-from-the-platform-provided-sql-server-image)|
|Tools|All tools, including SQL Server Management Studio, SQL Server Configuration Manager, the Business Intelligence Development Studio, SQL Server Setup, Client Tools Connectivity, Client Tools SDK, and SQL Client Connectivity SDK, and upgrade and migration tools, such as Data-tier applications (DAC), backup, restore, attach, and detach|
|SQL Server Books Online|Installed but requires configuration by using Help Viewer|

### Database engine configuration

The following database engine settings are configured. For more settings, examine the instance of SQL Server.

|Feature|Configuration|
|---|---|
|Instance|Contains a default (unnamed) instance of the SQL Server Database Engine, listening only on the shared memory protocol|
|Authentication|By default, Azure selects Windows Authentication during SQL Server virtual machine setup. If you want to use the sa login or create a new SQL Server account, you need to change the authentication mode. For more information, see [Security Considerations for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-security-considerations.md).|
|sysadmin|The Azure user who installed the virtual machine is initially the only member of the SQL Server sysadmin fixed server role|
|Memory|The Database Engine memory is set to dynamic memory configuration|
|Contained database authentication|Off|
|Default language|English|
|Cross-database ownership chaining|Off|

### Customer Experience Improvement Program (CEIP)

The [Customer Experience Improvement Program (CEIP)](https://technet.microsoft.com/library/cc730757.aspx) is enabled. You can disable the CEIP by using the SQL Server Error and Usage Reporting utility. To launch the SQL Server Error and Usage Reporting utility; on the Start menu, click All Programs, click Microsoft SQL Server version, click Configuration Tools, and then click SQL Server Error and Usage Reporting. If you do not want to use an instance of SQL Server with CEIP enabled, you might also consider deploying your own virtual machine image to Azure.  For more information, see [Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System](virtual-machines-create-upload-vhd-windows-server.md).

## Run SQL Server setup from the platform-provided SQL Server image

If you create a virtual machine by using a platform-provided SQL Server image, you can find the SQL Server setup media saved on the virtual machine in the **C:\SqlServer_SQLMajorVersion.SQLMinorVersion_Full** directory. You can run setup from this directory to perform any setup actions including add or remove features, add a new instance, or repair the instance if the disk space permits.

>[AZURE.NOTE] Azure provides multiple versions of the SQL Server images on the portal. If the version release date of SQL Server platform-provided image is May 15th, 2014 or later, it contains the product key by default. If you provision a virtual machine by using a platform-provided SQL Server image that is published before this date, that VM does not contain the product key. As a best practice, we recommend that you always select the latest image version when you provision a new VM.

## Resources

- [Provisioning a SQL Server Virtual Machine on Azure](virtual-machines-provision-sql-server.md)
- [Migrating a Database to SQL Server on an Azure VM](virtual-machines-migrate-onpremises-database.md)
- [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions.md)
- [Application Patterns and Development Strategies for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-application-patterns-and-development-strategies.md)
- [Azure Virtual Machines](virtual-machines-about.md) 

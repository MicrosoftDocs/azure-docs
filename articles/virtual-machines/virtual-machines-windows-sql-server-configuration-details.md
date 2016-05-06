<properties
	pageTitle="SQL Server VM image configuration details | Microsoft Azure"
	description="This topic describes what gets installed on a SQL Server virtual machine gallery image on Azure. This includes the installed SQL Server features."
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="rothja"
	manager="jhubbard"
	editor=""
	tags="azure-resource-management" />

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="05/06/2016"
	ms.author="jroth" />

# SQL Server VM image configuration details

This topic describes what gets installed and configured for a SQL Server virtual machine gallery image. After installation, you can make additional configuration changes to the virtual machine and SQL Server. This can be done with remote desktop and the SQL Server setup media on the C: drive of each VM. For more information, see the section in this topic, [Customize the SQL VM after provisioning](#customize-the-sql-vm-after provisioning).

>[AZURE.NOTE]For a tutorial on how to provision a SQL Server virtual machine image, see [Provision a SQL Server virtual machine in the Azure Portal](virtual-machines-windows-portal-sql-server-provision.md).

## Windows Server configuration

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
|Disks|The size-selected limits the number of data disks you can configure. See [Virtual Machine Sizes for Azure](virtual-machines-linux-sizes.md)|

## SQL Server features and components

The SQL Server installation in the platform image contains the following configurations settings and components:

|Feature|Configuration|
|---|---|
|Database Engine|Installed|
|Analysis Services|Installed|
|Integration Services|Installed|
|Reporting Services|Configured in Native mode|
|Always On Availability Groups|Available in SQL Server 2012 or later. Requires [additional configuration](virtual-machines-windows-sql-high-availability-dr.md)
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
|Authentication|By default, Azure selects Windows Authentication during SQL Server virtual machine setup. If you want to use the sa login or create a new SQL Server account, you need to change the authentication mode. For more information, see [Security Considerations for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-security.md).|
|sysadmin|The Azure user who installed the virtual machine is initially the only member of the SQL Server sysadmin fixed server role|
|Memory|The Database Engine memory is set to dynamic memory configuration|
|Contained database authentication|Off|
|Default language|English|
|Cross-database ownership chaining|Off|

### Customer Experience Improvement Program (CEIP)

The [Customer Experience Improvement Program (CEIP)](https://technet.microsoft.com/library/cc730757.aspx) is enabled. You can disable the CEIP by using the SQL Server Error and Usage Reporting utility. To launch the SQL Server Error and Usage Reporting utility; on the Start menu, click All Programs, click Microsoft SQL Server version, click Configuration Tools, and then click SQL Server Error and Usage Reporting. If you do not want to use an instance of SQL Server with CEIP enabled, you might also consider deploying your own virtual machine image to Azure.  For more information, see [Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System](virtual-machines-windows-classic-createupload-vhd.md).

## Customize the SQL VM after provisioning

After provisioning a platform-provided SQL Server image, you can customize it in several ways:

| Customization               | Details                          |
|---------------------|-------------------------------|
| Machine configuration | You can customize the virtual machine itself using remote desktop. This could include administrative tasks, such as changing the firewall settings. For details on how to connect to your SQL VM using remote desktop, see [the remote desktop section of the provisioning topic](virtual-machines-windows-portal-sql-server-provision#open-the-vm-with-remote-desktop). |
| Connectivity | Although connectivity can be configured during provisioning, you can also configure connectivity after provisioning. For more details, see [Set up connectivity](virtual-machines-windows-sql-connect.md).|
| SQL Server features | You can customize the features on your SQL Server instance by running SQL Server setup from the virtual machine. This also enables you to install additional SQL Server instances on the same VM. The SQL Server setup media is located on the virtual machine in the **C:\SqlServer_SQLMajorVersion.SQLMinorVersion_Full** directory. |

>[AZURE.NOTE] Azure provides multiple versions of the SQL Server images. If the version release date of SQL Server platform-provided image is May 15th, 2014 or later, it contains the product key by default. If you provision a virtual machine by using a platform-provided SQL Server image that is published before this date, that VM does not contain the product key. As a best practice, we recommend that you always select the latest image version when you provision a new VM.

## Next steps

If you want to deploy a SQL Server virtual machine, see [Provision a SQL Server virtual machine in the Azure Portal](virtual-machines-windows-portal-sql-server-provision.md).

For more information on running SQL Server on a VM, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).

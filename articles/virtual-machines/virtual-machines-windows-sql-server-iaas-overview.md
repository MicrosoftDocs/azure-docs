<properties
	pageTitle="Overview of SQL Server on Virtual Machines | Microsoft Azure"
	description="This article provides an overview of SQL Server hosted on Azure Virtual Machines. This includes links to depth content."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="rothja"
	manager="jhubbard"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="05/06/2016"
	ms.author="jroth"/>

# SQL Server on Azure Virtual Machines overview

## Getting started
You can host [SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/) in a variety of configurations, ranging from a single database server to a multi-machine configuration using Always On Availability Groups and an Azure Virtual Network.

>[AZURE.NOTE] Running SQL Server on an Azure VM is one option for storing relational data in Azure. You can also use the Azure SQL Database service. For more information, see [Understanding Azure SQL Database and SQL Server in Azure VMs](../sql-database/data-management-azure-sql-database-and-sql-server-iaas.md).

To create a SQL Server virtual machine in Azure, you must first obtain an Azure Platform subscription. You can purchase an Azure subscription at [Purchase Options](https://azure.microsoft.com/pricing/purchase-options/). To try it free, visit [Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

For a great overview, watch the video [Azure VM is the best platform for SQL Server 2016](https://channel9.msdn.com/Events/DataDriven/SQLServer2016/Azure-VM-is-the-best-platform-for-SQL-Server-2016).

### Deploy a SQL Server instance on a single VM

After signing up for a subscription, the easiest way to deploy a SQL Server virtual machine in Azure is to [provision a SQL Server machine gallery image in the Azure](virtual-machines-windows-portal-sql-server-provision.md). Those images include licensing of SQL Server in the pricing for the VM.

It is important to note that there are two models for creating and managing Azure virtual machines: classic and Resource Manager. Microsoft recommends that most new deployments use the Resource Manager model. Some of the SQL Server documentation for Azure VMs still refers exclusively to the classic model. These topics are being updated over time to use the new Azure portal and the Resource Manager model. For more information, see [Understanding Resource Manager deployment and classic deployment](../resource-manager-deployment-model.md).

>[AZURE.NOTE] When possible, use the latest [Azure portal](https://portal.azure.com/) to provision and manage SQL Server Virtual Machines. It defaults to using Premium Storage and offers Automated Patching, Automated Backup, and Always On configurations.

The following table provides a matrix of available SQL Server images in the virtual machine gallery.

|SQL Server version|Operating system|SQL Server edition|
|---|---|---|
|SQL Server 2008 R2 SP2|Windows Server 2008 R2|Enterprise, Standard, Web|
|SQL Server 2008 R2 SP3|Windows Server 2008 R2|Enterprise, Standard, Web|
|SQL Server 2012 SP2|Windows Server 2012|Enterprise, Standard, Web|
|SQL Server 2012 SP2|Windows Server 2012 R2|Enterprise, Standard, Web|
|SQL Server 2014|Windows Server 2012 R2|Enterprise, Standard, Web|
|SQL Server 2014 SP1|Windows Server 2012 R2|Enterprise, Standard, Web|
|SQL Server 2016 RC|Windows Server 2012 R2|Evaluation|

For details on the configuration of these images, see [SQL Server VM image configuration details](virtual-machines-windows-sql-server-configuration-details.md).

In addition to these preconfigured images, you can also [create an Azure virtual machine](virtual-machines-windows-hero-tutorial.md) without SQL Server pre-installed. You can install any instance of SQL Server for which you have a license. You migrate your license to Azure for running SQL Server in an Azure Virtual Machine using [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). In this scenario, you only pay for Azure compute and storage [costs](https://azure.microsoft.com/pricing/details/virtual-machines/) associated with the virtual machine.

In order to determine the best virtual machine configuration settings for your SQL Server image, review the [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md). For production workloads, **DS3** is the minimum recommended virtual machine size for SQL Server Enterprise edition, and **DS2** is the minimum recommended virtual machine size for Standard edition.

In addition to reviewing performance best practices, other initial tasks include the following:

- [Review security best practices for SQL Server in Azure VMs](virtual-machines-windows-sql-security.md)
- [Set up connectivity](virtual-machines-windows-sql-connect.md)

### Migrate your data

After your SQL Server virtual machine is up and running, you might want to migrate existing databases to the machine. There are several techniques, but the deployment wizard in SQL Server Management Studio works well for most scenarios. For a discussion of the scenarios and a tutorial of the wizard, see [Migrating a Database to SQL Server on an Azure VM](virtual-machines-windows-migrate-sql.md).

## High availability

If you require high availability, consider configuring SQL Server Always On Availability Groups. This involves multiple Azure VMs in a virtual network. The Azure portal has a template that sets up this configuration for you. For more information, see [SQL Server Always On Offering in Azure Gallery](http://blogs.technet.com/b/dataplatforminsider/archive/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery.aspx).

If you want to manually configure your Availability Group and associated listener, see the following articles based on the Classic deployment model:

- [Configure Always On Availability Groups in Azure (GUI)](virtual-machines-windows-classic-portal-sql-alwayson-availability-groups.md)
- [Configure an ILB listener for Always On Availability Groups in Azure](virtual-machines-windows-classic-ps-sql-int-listener.md)
- [Extend on-premises Always On Availability Groups to Azure](virtual-machines-windows-classic-sql-onprem-availability.md)

For other high availability considerations, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md).

## Backup and restore
For on-premises databases, Azure can act as a secondary data center to store SQL Server backup files. For an overview of backup and restore options, see [Backup and Restore for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-backup-recovery.md).

[SQL Server Backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) stores Azure backup files in Azure blob storage. [SQL Server Managed Backup](https://msdn.microsoft.com/library/dn449496.aspx) allows you to schedule backup and retention in Azure. These services can be used with either on-premises SQL Server instances or SQL Server running on Azure VMs. Azure VMs can also take advantage of [Automated Backup](virtual-machines-windows-classic-sql-automated-backup.md) and [Automated Patching](virtual-machines-windows-classic-sql-automated-patching.md) for SQL Server.

## Next steps

First, [create your own SQL Server VM in the Azure Portal](virtual-machines-windows-portal-sql-server-provision.md).

Then review [performance best practices](virtual-machines-windows-sql-performance.md) and [migration techniques](virtual-machines-windows-migrate-sql.md) as you consider moving your SQL Server workloads to Azure VMs.

If you have more questions about SQL Server on Azure virtual machines, see the [SQL Server on Azure Virtual Machines FAQ](virtual-machines-windows-sql-server-iaas-faq.md).

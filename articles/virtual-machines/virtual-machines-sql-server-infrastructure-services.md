<properties 
	pageTitle="SQL Server on Azure Virtual Machines Overview" 
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
	ms.date="08/18/2015"
	ms.author="jroth"/>

# SQL Server on Azure Virtual Machines Overview

## Overview
You can host [SQL Server on Azure Virtual Machines](http://azure.microsoft.com/services/virtual-machines/sql-server/) in a variety of configurations, ranging from a single database server to a multi-machine configuration using AlwaysOn Availability Groups and an Azure Virtual Network. This topic attempts to point you to some of the best resources for getting started with running SQL Server in an Azure Virtual Machine.

>[AZURE.NOTE] Running SQL Server on an Azure VM is one option for storing relational data in Azure. You can also use the Azure SQL Database service. For more information, see [Understanding Azure SQL Database and SQL Server in Azure VMs](../sql-database/data-management-azure-sql-database-and-sql-server-iaas.md).
 
## Deploy a SQL Server instance on a single VM

The easiest way to deploy a SQL Server virtual machine in Azure is to [provision a SQL Server machine gallery image in the Azure Management Portal](virtual-machines-provision-sql-server.md). Those images include licensing of SQL Server in the pricing for the VM.

However, you can also [create an Azure virtual machine](virtual-machines-windows-tutorial.md) without SQL Server pre-installed. You can install any instance of SQL Server for which you have a license. 

During these early stages of provisioning and configuring, common tasks include:

- [Review performance best practices for SQL Server in Azure VMs](https://msdn.microsoft.com/library/azure/dn133149.aspx)
- [Review security best practices for SQL Server in Azure VMs](https://msdn.microsoft.com/library/azure/dn133147.aspx)
- [Set up connectivity](virtual-machines-sql-server-connectivity.md)

## Deploy a highly available configuration with multiple VMs

You can achieve high availability for SQL Server by using SQL Server AlwaysOn Availability Groups. This involves multiple Azure VMs in a virtual network. The Azure Preview Portal has a template that sets up this configuration for you. For more information, see [SQL Server AlwaysOn Offering in Microsoft Azure Portal Gallery](http://blogs.technet.com/b/dataplatforminsider/archive/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery.aspx). 

If you want to manually configure your Availability Group and associated listener, see the following articles:

- [Configure AlwaysOn Availability Groups in Azure (GUI)](virtual-machines-sql-server-alwayson-availability-groups-gui.md)
- [Configure an ILB listener for AlwaysOn Availability Groups in Azure](virtual-machines-sql-server-configure-ilb-alwayson-availability-group-listener.md)
- [Extend on-premises AlwaysOn Availability Groups to Azure](virtual-machines-sql-server-extend-on-premises-alwayson-availability-groups.md)

For other high availability considerations, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-high-availability-and-disaster-recovery-solutions.md).

## Run business intelligence, data warehousing, and OLTP workloads in Azure   
You can run common SQL Server workloads on Azure Virtual Machines. SQL Server has several optimized virtual machine images available in the gallery. These include images for:

- [Business Intelligence](https://msdn.microsoft.com/library/azure/jj992719.aspx)
- [Data Warehousing](https://msdn.microsoft.com/library/azure/dn387396.aspx)
- [OLTP](https://msdn.microsoft.com/library/azure/dn387396.aspx)

## Migrate your data

After your SQL Server virtual machine is up and running, you might want to migrate existing databases to the machine. There are several techniques, but the deployment wizard in SQL Server Management Studio works well for most scenarios. For a discussion of the scenarios and a tutorial of the wizard, see [Migrating a Database to SQL Server on an Azure VM](virtual-machines-migrate-onpremises-database.md).

## Backup and restore
For on-premises databases, Azure can act as a secondary data center to store SQL Server backup files. For an overview of backup and restore options, see [Backup and Restore for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-backup-and-restore.md).

[SQL Server Backup to URL](https://msdn.microsoft.com/library/dn435916.aspx) stores Azure backup files in Azure blob storage. [SQL Server Managed Backup](https://msdn.microsoft.com/library/dn449496.aspx) allows you to schedule backup and retention in Azure. These services can be used with either on-premises SQL Server instances or SQL Server running on Azure VMs. Azure VMs can also take advantage of [Automated Backup](virtual-machines-sql-server-automated-backup.md) and [Automated Patching](virtual-machines-sql-server-automated-patching.md) for SQL Server.

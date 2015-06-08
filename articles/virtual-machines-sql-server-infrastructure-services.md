<properties 
	pageTitle="SQL Server on Azure Virtual Machines" 
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
	ms.date="04/17/2015"
	ms.author="jroth"/>

# SQL Server on Azure Virtual Machines

## Overview
You can host [SQL Server on Azure Virtual Machines][sqlvmlanding] in a variety of configurations, ranging from a single database server to a multi-machine configuration using AlwaysOn Availability Groups and an Azure Virtual Network.

> [AZURE.NOTE] Running SQL Server on an Azure VM is one option for storing relational data in Azure. You can also use the Azure SQL Database service. For more information, see [Understanding Azure SQL Database and SQL Server in Azure VMs][sqldbcompared].
 
## Deploy a SQL Server instance on a single VM
Once you [create an Azure virtual machine using the Azure Portal][createvmportal] or automation, you can install any instance of SQL Server for which you have a license. However, you must take additional steps to [setup connectivity][setupconnectivity] between the SQL Server machine and other client machines.
 
You can also install one of the many different SQL Server virtual machine images from the gallery. Those images include licensing of SQL Server in the pricing for the VM. For more information, see [Provisioning a SQL Server Virtual Machine on Azure][provisionsqlvm].

## Deploy a highly available configuration with multiple VMs
You can achieve high availability for SQL Server by using SQL Server AlwaysOn Availability Groups. This involves multiple Azure VMs in a virtual network. The Azure Preview Portal has a template that sets up this configuration for you. For more information, see [SQL Server AlwaysOn Offering in Microsoft Azure Portal Gallery][sqlalwaysonportal]. Or you can [manually configure an AlwaysOn Availability Group][sqlalwaysonmanual]. For other high availability considerations, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines][sqlhadr].

## Run business intelligence, data warehousing, and OLTP workloads in Azure   
You can run common SQL Server workloads on Azure Virtual Machines. SQL Server has several optimized virtual machine images available in the gallery. These include images for [Business Intelligence][sqlbi], [Data Warehousing][sqldw], and [OLTP][sqloltp].

## Migrate your data
There are several possible ways to migrate your data to Azure VMs running SQL Server. First provision a SQL Server virtual machine using either the Azure Portal, PowerShell automation, or the deployment wizard in SQL Server Management Studio. Optimized SQL Server images include licensing in their pricing model, but you can also install SQL Server using your own license. To migrate your data, there are several options, such as using the deployment wizard    or migrating a data disk to the target virtual machine. For more information, see [Getting Ready to Migrate to SQL Server in Azure Virtual Machines][migratesql].

## Backup and restore
For on-premises databases, Azure can act as a secondary data center to store SQL Server backup files. [SQL Server Backup to URL][backupurl] stores Azure backup files in Azure blob storage. [SQL Server Managed Backup][managedbackup] allows you to schedule backup and retention in Azure. These services can be used with either on-premises SQL Server instances or SQL Server running on Azure VMs. Azure VMs can also take advantage of [Automated Backup][autobackup] and [Automated Patching][autopatching] for SQL Server. For more information, see [Management Tasks for SQL Server in Azure Virtual Machines][managementtasks].

## Additional resources:
[SQL Server in Azure VMs][sqlmsdnlanding]

[Getting Started with SQL Server in Azure Virtual Machines][sqlvmgetstarted] 

[Performance Best Practices for SQL Server in Azure Virtual Machines][sqlperf] 

[Security Considerations for SQL Server in Azure Virtual Machines][sqlsecurity] 

[Technical Articles for SQL Server in Azure Virtual Machines][technicalarticles] 

  [sqlvmlanding]: http://azure.microsoft.com/services/virtual-machines/sql-server/
  [sqldbcompared]: http://azure.microsoft.com/documentation/articles/data-management-azure-sql-database-and-sql-server-iaas
  [createvmportal]: http://azure.microsoft.com/documentation/articles/virtual-machines-windows-tutorial/
  [setupconnectivity]: https://msdn.microsoft.com/library/azure/dn133152.aspx
  [provisionsqlvm]: http://azure.microsoft.com/documentation/articles/virtual-machines-provision-sql-server/
  [sqlalwaysonportal]: http://go.microsoft.com/fwlink/?LinkId=526941
  [sqlalwaysonmanual]: https://msdn.microsoft.com/library/azure/dn249504.aspx
  [sqlhadr]: https://msdn.microsoft.com/library/azure/jj870962.aspx
  [sqlbi]: https://msdn.microsoft.com/library/azure/jj992719.aspx
  [sqldw]: https://msdn.microsoft.com/library/azure/dn387396.aspx
  [sqloltp]: https://msdn.microsoft.com/library/azure/eb0188e2-5569-48ff-b92c-1f6c0bf79620#about
  [migratesql]: https://msdn.microsoft.com/library/azure/dn133142.aspx
  [backupurl]: https://msdn.microsoft.com/library/dn435916(v=sql.120).aspx
  [managedbackup]: https://msdn.microsoft.com/library/dn449496.aspx
  [autobackup]: https://msdn.microsoft.com/library/azure/dn906091.aspx
  [autopatching]: https://msdn.microsoft.com/library/azure/dn961166.aspx
  [managementtasks]: https://msdn.microsoft.com/library/azure/dn906886.aspx
  [sqlmsdnlanding]: https://msdn.microsoft.com/library/azure/jj823132.aspx
  [sqlvmgetstarted]: https://msdn.microsoft.com/library/azure/dn133151.aspx
  [sqlperf]: https://msdn.microsoft.com/library/azure/dn133149.aspx
  [sqlsecurity]: https://msdn.microsoft.com/library/azure/dn133147.aspx
  [technicalarticles]: https://msdn.microsoft.com/library/azure/dn248435.aspx
<properties
	pageTitle="SQL Server on Azure Virtual Machines FAQ | Microsoft Azure"
	description="This article provides answers to frequently asked questions about running SQL Server on Azure VMs."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="v-shysun"
	manager="felixwu"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="06/03/2016"
	ms.author="v-shysun"/>

# SQL Server on Azure Virtual Machines FAQ

This topic provides answers to some of the most common questions about running [SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/).

[AZURE.INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Frequently Asked Questions

1. **How do I create an Azure virtual machine with SQL Server?**

	There are two ways to do this. The easiest solution is to create a Virtual Machine that includes SQL Server. For a tutorial on signing up for Azure and creating a SQL VM from the portal, see [Provision a SQL Server virtual machine in the Azure Portal](virtual-machines-windows-portal-sql-server-provision.md). You also have the option of manually installing SQL Server on a VM and reusing an on-premises license with [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/).

1. **What is the difference between SQL VMs and the SQL Database service?**

	Conceptually, running SQL Server on an Azure virtual machine is not that different from running SQL Server in a remote datacenter. In contrast, [SQL Database](../sql-database/sql-database-technical-overview.md) offers database-as-a-service. With SQL Database, you do not have access to the machines that host your databases. For a full comparison, see [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](../sql-database/media/sql-database-paas-vs-sql-server-iaas.md).

1. **How can I migrate my on-premises SQL Server database to the Cloud?**

	First create an Azure virtual machine with a SQL Server instance. Then migrate your on-premises databases to that instance. For data migration strategies, see [Migrate a SQL Server database to SQL Server in an Azure VM](virtual-machines-windows-migrate-sql.md).

2. **Can I change the installed features or install a second instance of SQL Server on the same VM?**

	Yes. The SQL Server installation media is located in a folder on the **C** drive. Run **Setup.exe** from that location to add new SQL Server instances or to change other installed features of SQL Server on the machine.

3. **How do I upgrade to a new version/edition of the SQL Server in an Azure VM?**

	Currently, there is no in-place upgrade for SQL Server running in an Azure VM. Create a new Azure virtual machine with the desired SQL Server version/edition, and then migrate your databases to the new server using standard [data migration techniques](virtual-machines-windows-migrate-sql.md).

4. **How can I install my licensed copy of SQL Server on an Azure VM?**

	Copy the SQL Server installation media to the Windows Server VM, and then install SQL Server on the VM. For licensing reasons, you must have [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/).

5. **Do you have to pay the SQL costs of a VM if it is only being used for standby/failover?**

	If you are creating the SQL VM through the gallery, then you must have a separate license for the standby SQL VM and the pricing is the same. If you install SQL Server manually on a virtual machine with [License Mobility](https://azure.microsoft.com/pricing/license-mobility/), you have the option to have one free passive SQL instance for failover. Please review the restrictions and requirements.

6. **How are updates and service packs applied on a SQL Server VM?**

	Virtual machines give you control over the host machine, including when and how you apply updates. For the operating system, you can manually apply windows updates, or you can enable a scheduling service called [Automated Patching](virtual-machines-windows-classic-sql-automated-patching.md). Automated Patching installs any updates that are marked important, including SQL Server updates in that category. Other optional updates to SQL Server must be installed manually.

7. **Is it possible to set up configurations not shown in the virtual machine gallery (For example Windows 2008 R2 + SQL Server 2012)?**

	No. For virtual machine gallery images that include SQL Server, you must select one of the provided images.

9. **How do I install SQL Data tools on my Azure VM?**

	Download and install the SQL Data tools from [Microsoft SQL Server Data Tools - Business Intelligence for Visual Studio 2013 ](https://www.microsoft.com/en-us/download/details.aspx?id=42313).

## Resources

For an overview of SQL Server on Azure Virtual Machines, watch the video [Azure VM is the best platform for SQL Server 2016](https://channel9.msdn.com/Events/DataDriven/SQLServer2016/Azure-VM-is-the-best-platform-for-SQL-Server-2016). You can also get a good introduction in the topic, [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).

Other resources include:

- [Provision a SQL Server virtual machine in the Azure Portal](virtual-machines-windows-portal-sql-server-provision.md)
- [Migrating a Database to SQL Server on an Azure VM](virtual-machines-windows-migrate-sql.md)
- [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md)
- [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md)
- [Application Patterns and Development Strategies for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-server-app-patterns-dev-strategies.md)

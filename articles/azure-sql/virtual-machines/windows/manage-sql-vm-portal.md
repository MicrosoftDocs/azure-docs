---
title: Manage SQL Server virtual machines in Azure by using the Azure portal | Microsoft Docs
description: Learn how to access the SQL virtual machine resource in the Azure portal for a SQL Server VM hosted on Azure to modify SQL Server settings. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.subservice: management

ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 05/30/2021
ms.author: mathoma
ms.reviewer: jroth

---
# Manage SQL Server VMs by using the Azure portal
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

In the [Azure portal](https://portal.azure.com), the [**SQL virtual machines**](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) resource is an independent management service to manage SQL Server on Azure Virtual Machines (VMs) that have been registered with the SQL Server IaaS Agent extension. You can use the resource to view all of your SQL Server VMs simultaneously and modify settings dedicated to SQL Server: 

![SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-manage.png)

The **SQL virtual machines** resource management point is different to the **Virtual machine** resource used to manage the VM such as start it, stop it, or restart it. 


## Prerequisite 

The **SQL virtual machines** resource is only available to SQL Server VMs that have been [registered with the SQL IaaS Agent extension](sql-agent-extension-manually-register-single-vm.md). 


## Access the resource

To access the **SQL virtual machines** resource, do the following:

1. Open the [Azure portal](https://portal.azure.com). 
1. Select **All Services**. 
1. Enter **SQL virtual machines** in the search box.
1. (Optional): Select the star next to **SQL virtual machines** to add this option to your **Favorites** menu. 
1. Select **SQL virtual machines**. 

   ![Find SQL Server virtual machines in all services](./media/manage-sql-vm-portal/sql-vm-search.png)

1. The portal lists all SQL Server VMs available within the subscription. Select the one that you want to manage to open the **SQL virtual machines** resource. Use the search box if your SQL Server VM isn't appearing. 

   ![All available SQL Server VMs](./media/manage-sql-vm-portal/all-sql-vms.png)

   Selecting your SQL Server VM opens the **SQL virtual machines** resource: 


   ![View the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-resource.png)

> [!TIP]
> The **SQL virtual machines** resource is for dedicated SQL Server settings. Select the name of the VM in the **Virtual machine** box to open settings that are specific to the VM, but not exclusive to SQL Server. 


## License and edition 

Use the **Configure** page of the SQL virtual machine resource to change your SQL Server licensing metadata to **Pay as you go**, **Azure Hybrid Benefit**, or **HA/DR** for your [free Azure replica for disaster recovery](business-continuity-high-availability-disaster-recovery-hadr-overview.md#free-dr-replica-in-azure).



![Change the version and edition of SQL Server VM metadata in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-license-edition.png)

You can also modify the edition of SQL Server from the **Configure** page as well, such as **Enterprise**, **Standard**, or **Developer**. 

Changing the license and edition metadata in the Azure portal is only supported once the version and edition of SQL Server has been modified internally to the VM. To learn more see, change the [version](change-sql-server-version.md) and [edition](change-sql-server-edition.md) of SQL Server on Azure VMs. 

## Storage 

Use the **Configure**  page of the SQL virtual machines resource to extend your data, log, and tempdb drives. 

![Extend storage in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-storage-configuration.png)

## Patching

Use the **Patching** page of the SQL virtual machines resource to enable auto patching of your VM and automatically install Windows and SQL Server updates marked as Important. You can also configure a maintenance schedule here, such as running patching daily, as well as a local start time for maintenance, and a maintenance window. 


![Configure automated patching and schedule in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-automated-patching.png)


To learn more, see, [Automated patching](automated-patching.md). 



## Backups

Use the **Backups** page of the SQL virtual machines resource to configure your automated backup settings, such as the retention period, which storage account to use, encryption, whether or not to back up system databases, and a backup schedule. 

![Configure automated backup and schedule in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-automated-backup.png)

To learn more, see, [Automated patching](automated-backup.md). 


## High availability (Preview)

Use the **High Availability** page of the SQL virtual machines resource to create a Windows Server Failover Cluster, and configure an Always On availability group, availability group listener, and Azure Load Balancer. Configuring high availability using Azure portal is currently in preview. 


![Configure a Windows Server Failover Cluster and an Always On availability group in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-high-availability.png)


To learn more, see [Configure availability group by using the Azure portal](availability-group-azure-portal-configure.md).

## Security Configuration 

Use the **Security Configuration** page of the SQL virtual machines resource to configure SQL Server security settings such as which port to use, whether or not SQL Authentication is enabled, and to enable Azure Key Vault integration. 

![Configure SQL Server security in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-security-configuration.png)

To learn more, see the [Security best practices](security-considerations-best-practices.md).


## Security Center 

Use the **Security Center** page of the SQL virtual machines resource to view Security Center recommendations directly in the SQL virtual machine blade. Enable [Azure Defender for SQL](../../../security-center/defender-for-sql-usage.md) to leverage this feature. 

![Configure SQL Server Security Center settings in the Azure portal using the SQL virtual machines resource](./media/manage-sql-vm-portal/sql-vm-security-center.png)


## Next steps

For more information, see the following articles: 

* [Overview of SQL Server on a Windows VM](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [FAQ for SQL Server on a Windows VM](frequently-asked-questions-faq.yml)
* [Pricing guidance for SQL Server on a Windows VM](pricing-guidance.md)
* [Release notes for SQL Server on a Windows VM](doc-changes-updates-release-notes.md)



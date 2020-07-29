---
title: Documentation changes for SQL Server on Azure Virtual Machines| Microsoft Docs
description: Learn about the new features and improvements for SQL Server on Azure Virtual Machines.
services: virtual-machines-windows
author: MashaMSFT
ms.author: mathoma
tags: azure-service-management
ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: virtual-machines-sql

ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 01/06/2020
---
# Documentation changes for SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

Azure allows you to deploy a virtual machine (VM) with an image of SQL Server built in. This article summarizes the documentation changes associated with new features and improvements in the recent releases of [SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/). 


## January 2020

| Changes | Details |
| --- | --- |
| **Azure Government support** | It is now possible to register SQL Server virtual machines with the SQL VM resource provider for virtual machines hosted in the [Azure Government](https://azure.microsoft.com/global-infrastructure/government/) cloud. | 
| &nbsp; | &nbsp; |

## 2019

|Changes | Details |
 --- | --- |
| **Free DR replica in Azure** | You can host a [free passive instance](business-continuity-high-availability-disaster-recovery-hadr-overview.md#free-dr-replica-in-azure) for disaster recovery in Azure for your on-premises SQL Server instance if you have [Software Assurance](https://www.microsoft.com/licensing/licensing-programs/software-assurance-default?rtc=1&activetab=software-assurance-default-pivot:primaryr3). | 
| **Bulk resource provider registration** | You can now [bulk register](sql-vm-resource-provider-bulk-register.md) SQL Server virtual machines with the resource provider. | 
|**Performance optimized storage configuration** | You can now [fully customize your storage configuration](storage-configuration.md#new-vms) when creating a new SQL Server VM. |
|**Premium file share for FCI** | You can now create a failover cluster instance using a [Premium File Share](failover-cluster-instance-premium-file-share-manually-configure.md) instead of the original method of [Storage Spaces Direct](failover-cluster-instance-storage-spaces-direct-manually-configure.md). 
| **Azure Dedicated Host** | You can run your SQL Server VM on an [Azure dedicated host](dedicated-host.md). | 
| **Move SQL Server VM to different region** | Use Azure Site Recovery to [migrate your SQL Server VM from one region to another](move-sql-vm-different-region.md). |
|  **New SQL IaaS installation modes** | It's now possible to install the SQL Server IaaS extension in [lightweight mode](sql-server-iaas-agent-extension-automate-management.md) to avoid restarting the SQL Server service.  |
| **SQL Server edition modification** | You can now change the [edition property](change-sql-server-edition.md) for your SQL Server VM. |
| **Changes to SQL VM resource provider** | You can [register your SQL Server VM with the SQL VM resource provider](sql-vm-resource-provider-register.md) by using the new SQL IaaS modes. This capability includes [Windows Server 2008](sql-vm-resource-provider-register.md#management-modes) images.|
| **Bring-your-own-license images using Azure Hybrid Benefit** | Bring-your-own-license images deployed from Azure Marketplace can now switch their [license type to pay-as-you-go](licensing-model-azure-hybrid-benefit-ahb-change.md#remarks).| 
| **New SQL Server VM management in Azure portal** | There's now a way to manage your SQL Server VM in the Azure portal. For more information, see [Manage SQL Server VMs in the Azure portal](manage-sql-vm-portal.md).  | 
| **Extended support for SQL Server 2008/2008 R2** | [Extend support](sql-server-2008-extend-end-of-support.md) for SQL Server 2008 and SQL Server 2008 R2 by migrating *as is* to an Azure VM. | 
| **Custom image supportability** | You can now install the [SQL Server IaaS extension](sql-server-iaas-agent-extension-automate-management.md#installation) to custom OS and SQL Server images, which offers the limited functionality of [flexible licensing](licensing-model-azure-hybrid-benefit-ahb-change.md). When you're registering your custom image with the SQL VM resource provider, specify the license type as "AHUB." Otherwise, the registration will fail. | 
| **Named instance supportability** | You can now use the [SQL Server IaaS extension](sql-server-iaas-agent-extension-automate-management.md#installation) with a named instance, if the default instance has been uninstalled properly. | 
| **Portal enhancement** | The Azure portal experience for deploying a SQL Server VM has been revamped to improve usability. For more information, see the brief [quickstart](sql-vm-create-portal-quickstart.md) and more thorough [how-to guide](create-sql-vm-portal.md) to deploy a SQL Server VM.|
| **Portal improvement** | It's now possible to change the licensing model for a SQL Server VM from pay-as-you-go to bring-your-own-license by using the [Azure portal](licensing-model-azure-hybrid-benefit-ahb-change.md#vms-already-registered-with-the-resource-provider).|
| **Simplification of availability group deployment with Azure SQL Server VM CLI** | It's now easier than ever to deploy an availability group to a SQL Server VM in Azure. You can use the [Azure CLI](/cli/azure/sql/vm?view=azure-cli-2018-03-01-hybrid) to create the Windows failover cluster, internal load balancer, and availability group listeners all from the command line. For more information, see [Use the Azure SQL Server VM CLI to configure an Always On availability group for SQL Server on an Azure VM](availability-group-az-cli-configure.md). | 
| &nbsp; | &nbsp; |

## 2018 

 Changes | Details |
| --- | --- |
|  **New resource provider for a SQL Server cluster** | A new resource provider (Microsoft.SqlVirtualMachine/SqlVirtualMachineGroups) defines the metadata of the Windows failover cluster. Joining a SQL Server VM to *SqlVirtualMachineGroups* bootstraps the Windows Server Failover Cluster (WSFC) service and joins the VM to the cluster.  |
| **Automated setup of an availability group deployment with Azure quickstart templates** |It's now possible to create the Windows failover cluster, join SQL Server VMs to it, create the listener, and configure the internal load balancer with two Azure quickstart templates. For more information, see [Use Azure quickstart templates to configure an Always On availability group for SQL Server on an Azure VM](availability-group-quickstart-template-configure.md). | 
| **Automatic registration to the SQL VM resource provider** | SQL Server VMs deployed after this month are automatically registered with the new SQL VM resource provider. SQL Server VMs deployed before this month still need to be manually registered. For more information, see [Register a SQL Server virtual machine in Azure with the SQL VM resource provider](sql-vm-resource-provider-register.md).|
|**New SQL VM resource provider** |  A new resource provider (Microsoft.SqlVirtualMachine) provides better management of your SQL Server VMs. For more information on registering your VMs, see [Register a SQL Server virtual machine in Azure with the SQL VM resource provider](sql-vm-resource-provider-register.md). |
|**Switch licensing model** | You can now switch between the pay-per-usage and bring-your-own-license models for your SQL Server VM by using the Azure CLI or PowerShell. For more information, see [How to change the licensing model for a SQL Server virtual machine in Azure](licensing-model-azure-hybrid-benefit-ahb-change.md). | 
| &nbsp; | &nbsp; |

## Additional resources

**Windows VMs**:

* [Overview of SQL Server on a Windows VM](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [Provision SQL Server on a Windows VM](create-sql-vm-portal.md)
* [Migrating a database to SQL Server on an Azure VM](migrate-to-vm-from-sql-server.md)
* [High availability and disaster recovery for SQL Server on Azure Virtual Machines](business-continuity-high-availability-disaster-recovery-hadr-overview.md)
* [Performance best practices for SQL Server on Azure Virtual Machines](performance-guidelines-best-practices.md)
* [Application patterns and development strategies for SQL Server on Azure Virtual Machines](application-patterns-development-strategies.md)

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](../linux/sql-server-on-linux-vm-what-is-iaas-overview.md)
* [Provision SQL Server on a Linux virtual machine](../linux/sql-vm-create-portal-quickstart.md)
* [FAQ (Linux)](../linux/frequently-asked-questions-faq.md)
* [SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)

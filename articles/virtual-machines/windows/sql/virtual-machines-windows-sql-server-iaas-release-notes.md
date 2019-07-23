---
title: SQL Server on Azure VM Release Notes| Microsoft Docs
description: Learn about the new features and improvements of SQL Server on an Azure VM
services: virtual-machines-windows
author: MashaMSFT
ms.author: mathoma
manager: craigg
tags: azure-service-management
ms.assetid: 2fa5ee6b-51a6-4237-805f-518e6c57d11b
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 2/13/2019
---
# SQL Server on Azure Virtual Machine release notes

Azure allows you to deploy a virtual machine with an image of SQL Server built in. This article summarizes the new features and improvements in the recent releases of [SQL Server on Azure virtual machines](https://azure.microsoft.com/services/virtual-machines/sql-server/). The article also lists notable content updates that are not directly related to the release but published in the same time frame. For improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates)


## June 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
| **New SQL IaaS installation modes** | It's now possible to install the SQL IaaS extension in [lightweight mode](virtual-machines-windows-sql-server-agent-extension.md) to avoid restarting SQL Server service.  |
| **SQL Server edition modification** | You can now change the [edition property](virtual-machines-windows-sql-change-edition.md) for your SQL Server VM. |
| **SQL VM RP changes** | You can [register your SQL Server VM with the SQL VM resource provider](virtual-machines-windows-sql-register-with-resource-provider.md#register-with-sql-vm-resource-provider) - even [Windows 2008 images](virtual-machines-windows-sql-register-with-resource-provider.md#register-sql-server-2008r2-on-windows-server-2008-vms) - using the new SQL IaaS modes. |
| **BYOL images using AHUB** | BYOL images deployed from the marketplace can now switch their [license type to 'PAYG'](virtual-machines-windows-sql-ahb.md#remarks).| 
| &nbsp; | &nbsp; |



## May 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
| **New SQL VM management in Azure portal** | There is now a new way to manage your SQL Server VM in the Azure portal. For more information, see [Manage SQL Server VM in the Azure portal](virtual-machines-windows-sql-manage-portal.md).  | 
| &nbsp; | &nbsp; |

### Documentation improvements

| Documentation | Details |
| --- | --- |
| **New SQL VM portal management** | About a dozen articles were updated to the new SQL VM management portal experience. | 
| &nbsp; | &nbsp; |




## April 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
| **Extend support for SQL Server 2008/2008R2** | [Extend support](virtual-machines-windows-sql-server-2008-eos-extend-support.md) for SQL Server 2008 and SQL Server 2008 R2 by migrating *as-is* to an Azure VM. | 
| &nbsp; | &nbsp; |


## March 2019

| Service improvements | Details |
| --- | --- |
| **Custom image supportability** | You can now install the [SQL IaaS extension](virtual-machines-windows-sql-server-agent-extension.md#installation) to custom OS and SQL images, which offers the limited functionality of [flexible licensing](virtual-machines-windows-sql-ahb.md). When registering your custom image with the SQL resource provider, specify the license type as 'AHUB' as otherwise the registration will fail. | 
| **Named instance supportability** | You can now utilize the [SQL IaaS extension](virtual-machines-windows-sql-server-agent-extension.md#installation) with a named instance, if the default instance has been uninstalled properly. | 
| **Portal enhancement** | The Azure portal experience for deploying a SQL Server VM has been revamped to improve usability. For more information, see the brief [Quickstart](quickstart-sql-vm-create-portal.md) and more thorough [How-to](virtual-machines-windows-portal-sql-server-provision.md) guide to deploying a SQL Server VM.|
| &nbsp; | &nbsp; |


## February 2019

| Service improvements | Details |
| --- | --- |
| **Portal improvement** | It is now possible to change the licensing model for a SQL Server VM from pay-as-you-go to bring-your-own-license using the [Azure portal](virtual-machines-windows-sql-ahb.md#change-license-for-vms-already-registered-with-resource-provider)|
|**AG deployment simplification with Azure SQL VM CLI** | It is now easier than ever to deploy an availability group to a SQL Server VM in Azure. [Azure SQL VM CLI](/cli/azure/sql/vm?view=azure-cli-2018-03-01-hybrid) allows you to create the WSFC, ILB and AG listener all from the command line, and in record time! For more information, see [Use Azure SQL VM CLI to configure Always On availability group for SQL Server on an Azure VM](virtual-machines-windows-sql-availability-group-cli.md). | 
| &nbsp; | &nbsp; |


## December 2018

| Service improvements | Details |
| --- | --- |
| **New SQL cluster group resource provider** | A new resource provider (Microsoft.SqlVirtualMachine/SqlVirtualMachineGroups) that defines the metadata of the Windows Failover Cluster. Joining a SQL Server VM to the *SqlVirtualMachineGroups* bootstraps the Windows Failover Cluster service and joins the VM to the cluster.  |
|**Automate setting up an availability group deployment with Azure Quickstart Templates** |It is now possible to create the Windows Failover Cluster, join SQL Server VMs to it, create the listener, and configure the Internal Load Balancer with two Azure Quickstart Templates. For more information, see [Use Azure Quickstart Template to configure Always On availability group for SQL Server on an Azure VM](virtual-machines-windows-sql-availability-group-quickstart-template.md). | 
| **Automatic SQL VM Resource Provider Registration** | SQL Server VMs deployed after this month are automatically registered with the new SQL Server resource provider. SQL Server VMs deployed prior to this month still need to be manually registered. For more information, see [Register existing SQL VM with SQL VM resource provider](virtual-machines-windows-sql-register-with-resource-provider.md).|
| &nbsp; | &nbsp; |


## November 2018

| Service improvements | Details |
| --- | --- |
| **New SQL VM resource provider** |  A new resource provider for SQL Server VMs (Microsoft.SqlVirtualMachine) that provides better management of your SQL Server VM. For more information on registering your VM, see [Register existing SQL VM with new resource provider](virtual-machines-windows-sql-register-with-resource-provider.md). |
|**Switch licensing model** | You can now switch between the pay-per-usage and bring-your-own license model for your SQL VM using Azure CLI or Powershell. For more information, see [How to change the licensing model for a SQL VM](virtual-machines-windows-sql-ahb.md). | 
| &nbsp; | &nbsp; |


## Additional resources

**Windows VMs**:

* [Overview of SQL Server on a Windows VM](virtual-machines-windows-sql-server-iaas-overview.md).
* [Provision a SQL Server Windows VM](virtual-machines-windows-portal-sql-server-provision.md)
* [Migrating a Database to SQL Server on an Azure VM](virtual-machines-windows-migrate-sql.md)
* [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md)
* [Performance best practices for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-performance.md)
* [Application Patterns and Development Strategies for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-server-app-patterns-dev-strategies.md)

**Linux VMs**:

* [Overview of SQL Server on a Linux VM](../../linux/sql/sql-server-linux-virtual-machines-overview.md)
* [Provision a SQL Server Linux Virtual Machine](../../linux/sql/provision-sql-server-linux-virtual-machine.md)
* [FAQ (Linux)](../../linux/sql/sql-server-linux-faq.md)
* [SQL Server on Linux documentation](https://docs.microsoft.com/sql/linux/sql-server-linux-overview)

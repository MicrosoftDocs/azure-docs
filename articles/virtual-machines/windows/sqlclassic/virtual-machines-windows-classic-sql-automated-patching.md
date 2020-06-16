---
title: Automated Patching for SQL Server VMs (Classic) | Microsoft Docs
description: Explains the Automated Patching feature for SQL Server Virtual Machines running in Azure using the classic deployment mode.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
editor: ''
tags: azure-service-management
ms.assetid: 737b2f65-08b9-4f54-b867-e987730265a8
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/07/2018
ms.author: mathoma
ms.reviewer: jroth
---
# Automated Patching for SQL Server in Azure Virtual Machines (Classic)
> [!div class="op_single_selector"]
> * [Resource Manager](../../../azure-sql/virtual-machines/windows/automated-patching.md)
> * [Classic](../classic/sql-automated-patching.md)
> 
> 

Automated Patching establishes a maintenance window for an Azure Virtual Machine running SQL Server. Automated Updates can only be installed during this maintenance window. For SQL Server, this ensures that system updates and any associated restarts occur at the best possible time for the database. 

> [!IMPORTANT]
> Only Windows updates marked **Important** are installed. Other SQL Server updates, such as Cumulative Updates, must be installed manually. 

Automated Patching depends on the [SQL Server IaaS Agent Extension](../classic/sql-server-agent-extension.md).

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../../azure-resource-manager/management/deployment-models.md). This article covers using the Classic deployment model. Microsoft recommends that most new deployments use the Resource Manager model. To view the Resource Manager version of this article, see [Automated Patching for SQL Server in Azure Virtual Machines Resource Manager](../../../azure-sql/virtual-machines/windows/automated-patching.md).

## Prerequisites
To use Automated Patching, consider the following prerequisites:

**Operating System**:

* Windows Server 2012
* Windows Server 2012 R2
* Windows Server 2016

**SQL Server version**:

* SQL Server 2012
* SQL Server 2014
* SQL Server 2016

**Azure PowerShell**:

* [Install the latest Azure PowerShell commands](/powershell/azure/overview).

**SQL Server IaaS Extension**:

* [Install the SQL Server IaaS Extension](../classic/sql-server-agent-extension.md).

## Settings
The following table describes the options that can be configured for Automated Patching. For classic VMs, you must use PowerShell to configure these settings.

| Setting | Possible values | Description |
| --- | --- | --- |
| **Automated Patching** |Enable/Disable (Disabled) |Enables or disables Automated Patching for an Azure virtual machine. |
| **Maintenance schedule** |Everyday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday |The schedule for downloading and installing Windows, SQL Server, and Microsoft updates for your virtual machine. |
| **Maintenance start hour** |0-24 |The local start time to update the virtual machine. |
| **Maintenance window duration** |30-180 |The number of minutes permitted to complete the download and installation of updates. |
| **Patch Category** |Important |The category of updates to download and install. |

## Configuration with PowerShell
In the following example, PowerShell is used to configure Automated Patching on an existing SQL Server VM. The **New-AzureVMSqlServerAutoPatchingConfig** command configures a new maintenance window for automatic updates.

    $aps = New-AzureVMSqlServerAutoPatchingConfig -Enable -DayOfWeek "Thursday" -MaintenanceWindowStartingHour 11 -MaintenanceWindowDuration 120  -PatchCategory "Important"

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension -AutoPatchingSettings $aps | Update-AzureVM

Based on this example, the following table describes the practical effect on the target Azure VM:

| Parameter | Effect |
| --- | --- |
| **DayOfWeek** |Patches installed every Thursday. |
| **MaintenanceWindowStartingHour** |Begin updates at 11:00am. |
| **MaintenanceWindowDuration** |Patches must be installed within 120 minutes. Based on the start time, they must complete by 1:00pm. |
| **PatchCategory** |The only possible setting for this parameter is “Important”. |

It could take several minutes to install and configure the SQL Server IaaS Agent.

To disable Automated Patching, run the same script without the -Enable parameter to the New-AzureVMSqlServerAutoPatchingConfig. As with installation, it can take several minutes to disable Automated Patching.

## Next steps
For information about other available automation tasks, see [SQL Server IaaS Agent Extension](../classic/sql-server-agent-extension.md).

For more information about running SQL Server on Azure VMs, see [SQL Server on Azure Virtual Machines overview](../../../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md).


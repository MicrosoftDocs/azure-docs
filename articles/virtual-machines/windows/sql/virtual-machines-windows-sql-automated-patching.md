---
title: Automated Patching for SQL Server VMs (Resource Manager) | Microsoft Docs
description: Explains the Automated Patching feature for SQL Server Virtual Machines running in Azure using Resource Manager.
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
editor: ''
tags: azure-resource-manager
ms.assetid: 58232e92-318f-456b-8f0a-2201a541e08d
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/07/2018
ms.author: mathoma
ms.reviewer: jroth
---
# Automated Patching for SQL Server in Azure Virtual Machines (Resource Manager)
> [!div class="op_single_selector"]
> * [Resource Manager](virtual-machines-windows-sql-automated-patching.md)
> * [Classic](../sqlclassic/virtual-machines-windows-classic-sql-automated-patching.md)

Automated Patching establishes a maintenance window for an Azure Virtual Machine running SQL Server. Automated Updates can only be installed during this maintenance window. For SQL Server, this restriction ensures that system updates and any associated restarts occur at the best possible time for the database. 

> [!IMPORTANT]
> Only Windows updates marked **Important** are installed. Other SQL Server updates, such as Cumulative Updates, must be installed manually. 

Automated Patching depends on the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md).

## Prerequisites
To use Automated Patching, consider the following prerequisites:

**Operating System**:

* Windows Server 2008 R2
* Windows Server 2012
* Windows Server 2012 R2
* Windows Server 2016

**SQL Server version**:

* SQL Server 2008 R2
* SQL Server 2012
* SQL Server 2014
* SQL Server 2016
* SQL Server 2017

**Azure PowerShell**:

* [Install the latest Azure PowerShell commands](/powershell/azure/overview) if you plan to configure Automated Patching with PowerShell.

[!INCLUDE [updated-for-az.md](../../../../includes/updated-for-az.md)]

> [!NOTE]
> Automated Patching relies on the SQL Server IaaS Agent Extension. Current SQL virtual machine gallery images add this extension by default. For more information, see [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md).
> 
> 

## Settings
The following table describes the options that can be configured for Automated Patching. The actual configuration steps vary depending on whether you use the Azure portal or Azure Windows PowerShell commands.

| Setting | Possible values | Description |
| --- | --- | --- |
| **Automated Patching** |Enable/Disable (Disabled) |Enables or disables Automated Patching for an Azure virtual machine. |
| **Maintenance schedule** |Everyday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday |The schedule for downloading and installing Windows, SQL Server, and Microsoft updates for your virtual machine. |
| **Maintenance start hour** |0-24 |The local start time to update the virtual machine. |
| **Maintenance window duration** |30-180 |The number of minutes permitted to complete the download and installation of updates. |
| **Patch Category** |Important | The category of Windows updates to download and install.|

## Configuration in the Portal
You can use the Azure portal to configure Automated Patching during provisioning or for existing VMs.

### New VMs
Use the Azure portal to configure Automated Patching when you create a new SQL Server Virtual Machine in the Resource Manager deployment model.

In the **SQL Server settings** tab, select **Change configuration** under **Automated patching**. The following Azure portal screenshot shows the **SQL Automated Patching** blade.

![SQL Automated Patching in Azure portal](./media/virtual-machines-windows-sql-automated-patching/azure-sql-arm-patching.png)

For context, see the complete topic on [provisioning a SQL Server virtual machine in Azure](virtual-machines-windows-portal-sql-server-provision.md).

### Existing VMs

[!INCLUDE [windows-virtual-machines-sql-use-new-management-blade](../../../../includes/windows-virtual-machines-sql-new-resource.md)]

For existing SQL Server virtual machines, open your [SQL virtual machines resource](virtual-machines-windows-sql-manage-portal.md#access-sql-virtual-machine-resource) and select **Patching** under **Settings**. 

![SQL Automatic Patching for existing VMs](./media/virtual-machines-windows-sql-automated-patching/azure-sql-rm-patching-existing-vms.png)


When finished, click the **OK** button on the bottom of the **SQL Server configuration** blade to save your changes.

If you are enabling Automated Patching for the first time, Azure configures the SQL Server IaaS Agent in the background. During this time, the Azure portal might not show that Automated Patching is configured. Wait several minutes for the agent to be installed, configured. After that the Azure portal reflects the new settings.

## Configuration with PowerShell
After provisioning your SQL VM, use PowerShell to configure Automated Patching.

In the following example, PowerShell is used to configure Automated Patching on an existing SQL Server VM. The **New-AzVMSqlServerAutoPatchingConfig** command configures a new maintenance window for automatic updates.

    $vmname = "vmname"
    $resourcegroupname = "resourcegroupname"
    $aps = New-AzVMSqlServerAutoPatchingConfig -Enable -DayOfWeek "Thursday" -MaintenanceWindowStartingHour 11 -MaintenanceWindowDuration 120  -PatchCategory "Important"
s
    Set-AzVMSqlServerExtension -AutoPatchingSettings $aps -VMName $vmname -ResourceGroupName $resourcegroupname

> [!IMPORTANT]
> If the extension is not already installed, installing the extension restarts the SQL Server service.

Based on this example, the following table describes the practical effect on the target Azure VM:

| Parameter | Effect |
| --- | --- |
| **DayOfWeek** |Patches installed every Thursday. |
| **MaintenanceWindowStartingHour** |Begin updates at 11:00am. |
| **MaintenanceWindowsDuration** |Patches must be installed within 120 minutes. Based on the start time, they must complete by 1:00pm. |
| **PatchCategory** |The only possible setting for this parameter is **Important**. This installs Windows update marked Important; it does not install any SQL Server updates that are not included in this category. |

It could take several minutes to install and configure the SQL Server IaaS Agent.

To disable Automated Patching, run the same script without the **-Enable** parameter to the **New-AzVMSqlServerAutoPatchingConfig**. The absence of the **-Enable** parameter signals the command to disable the feature.

## Next steps
For information about other available automation tasks, see [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md).

For more information about running SQL Server on Azure VMs, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).


<properties
	pageTitle="Automated Patching for SQL Server VMs (Resource Manager) | Microsoft Azure"
	description="Explains the Automated Patching feature for SQL Server Virtual Machines running in Azure using Resource Manager."
	services="virtual-machines-windows"
	documentationCenter="na"
	authors="rothja"
	manager="jhubbard"
	editor=""
	tags="azure-resource-manager"/>
<tags
	ms.service="virtual-machines-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="05/18/2016"
	ms.author="jroth" />

# Automated Patching for SQL Server in Azure Virtual Machines (Resource Manager)

> [AZURE.SELECTOR]
- [Resource Manager](virtual-machines-windows-sql-automated-patching.md)
- [Classic](virtual-machines-windows-classic-sql-automated-patching.md)

Automated Patching establishes a maintenance window for an Azure Virtual Machine running SQL Server 2012 or 2014. Automated Updates can only be installed during this maintenance window. For SQL Server, this ensures that system updates and any associated restarts occur at the best possible time for the database. Automated Patching depends on the [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md).

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model. To view the classic version of this article, see [Automated Patching for SQL Server in Azure Virtual Machines Classic](virtual-machines-windows-classic-sql-automated-patching.md).

## Configure Automated Patching in the Azure portal

You can use the [Azure portal](http://go.microsoft.com/fwlink/?LinkID=525040&clcid=0x409) to configure Automated Patching when you create a new SQL Server Virtual Machine.

>[AZURE.NOTE] Automated Patching relies on the SQL Server IaaS Agent. To install and configure the agent, you must have the Azure VM Agent running on the target virtual machine. Newer virtual machine gallery images have this option enabled by default, but the Azure VM Agent might be missing on existing VMs. If you are using your own VM image, you will also need to install the SQL Server IaaS Agent. For more information, see [VM Agent and Extensions](https://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/).

The following Azure portal screenshot shows these options under **OPTIONAL CONFIGURATION** | **SQL AUTOMATED PATCHING**.

![SQL Automatic Patching in Azure portal](./media/virtual-machines-windows-classic-sql-automated-patching/IC778484.jpg)

For existing SQL Server 2012 or 2014 virtual machines, select the **Auto patching** settings in the **Configuration** section of the virtual machine properties. In the **Automated patching** window, you can enable the feature, set the maintenance schedule and start hour, and choose the maintenance window duration. This is shown in the following screenshot.

![Automated Patching Configuration in Azure portal](./media/virtual-machines-windows-classic-sql-automated-patching/IC792132.jpg)

>[AZURE.NOTE] When you enable Automated Patching for the first time, Azure configures the SQL Server IaaS Agent in the background. During this time, the Azure portal will not show that Automated Patching is configured. Wait several minutes for the agent to be installed, configured. After that the Azure portal will reflect the new settings.

## Configure Automated Patching with PowerShell

You can also use PowerShell to configure Automated Patching.

In the following example, PowerShell is used to configure Automated Patching on an existing SQL Server VM. The **New-AzureVMSqlServerAutoPatchingConfig** command configures a new maintenance window for automatic updates.

    $aps = New-AzureVMSqlServerAutoPatchingConfig -Enable -DayOfWeek "Thursday" -MaintenanceWindowStartingHour 11 -MaintenanceWindowDuration 120  -PatchCategory "Important"

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension -AutoPatchingSettings $aps | Update-AzureVM

Based on this example, the following table describes the practical effect on the target Azure VM:

|Parameter|Effect|
|---|---|
|**DayOfWeek**|Patches installed every Thursday.|
|**MaintenanceWindowStartingHour**|Begin updates at 11:00am.|
|**MaintenanceWindowsDuration**|Patches must be installed within 120 minutes. Based on the start time, they must complete by 1:00pm.|
|**PatchCategory**|The only possible setting for this parameter is “Important”.|

It could take several minutes to install and configure the SQL Server IaaS Agent.

To disable Automated Patching, run the same script without the -Enable parameter to the New-AzureVMSqlServerAutoPatchingConfig. As with installation, it can take several minutes to disable Automated Patching.

## Compatibility

The following products are compatible with the SQL Server IaaS Agent features for Automated Patching:

- Windows Server 2012

- Windows Server 2012 R2

- SQL Server 2012

- SQL Server 2014

## Next steps

For information about other available automation tasks, see [SQL Server IaaS Agent Extension](virtual-machines-windows-sql-server-agent-extension.md).

For more information about running SQL Server on Azure VMs, see [SQL Server on Azure Virtual Machines overview](virtual-machines-windows-sql-server-iaas-overview.md).

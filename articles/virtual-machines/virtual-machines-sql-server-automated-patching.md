<properties 
   pageTitle="Automated Patching for SQL Server in Azure Virtual Machines"
   description="Explains the Automated Patching feature for SQL Server Virtual Machines running in Azure."
   services="virtual-machines"
   documentationCenter="na"
   authors="rothja"
   manager="jeffreyg"
   editor="monicar" />
<tags 
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows-sql-server"
   ms.workload="infrastructure-services"
   ms.date="08/05/2015"
   ms.author="jroth" />

# Automated Patching for SQL Server in Azure Virtual Machines

Automated Patching establishes a maintenance window for an Azure Virtual Machine running SQL Server 2012 or 2014. Automated Updates can only be installed during this maintenance window. For SQL Server, this ensures that system updates and any associated restarts occur at the best possible time for the database. It depends on the SQL Server IaaS Agent.

>[AZURE.NOTE] Automated Patching relies on the SQL Server IaaS Agent. To install and configure the agent, you must have the Azure VM Agent running on the target virtual machine. Newer virtual machine gallery images have this option enabled by default, but the Azure VM Agent might be missing on existing VMs. If you are using your own VM image, you will also need to install the SQL Server IaaS Agent. For more information, see [VM Agent and Extensions](http://azure.microsoft.com/blog/2014/04/15/vm-agent-and-extensions-part-2/).

## Configure Automated Patching in the Portal

You can use the [Azure Preview Portal](http://go.microsoft.com/fwlink/?LinkID=525040&clcid=0x409) to configure Automated Patching when you create a new SQL Server Virtual Machine. The following screenshot shows these options under **OPTIONAL CONFIGURATION** | **SQL AUTOMATED PATCHING**.

![SQL Automatic Patching in Azure Portal](./media/virtual-machines-sql-server-automated-patching/IC778484.jpg)

For existing SQL Server 2012 or 2014 virtual machines, select the **Auto patching** settings in the **Configuration** section of the virtual machine properties. In the **Automated patching** window, you can enable the feature, set the maintenance schedule and start hour, and choose the maintenance window duration. This is shown in the following screenshot.

![Automated Patching Configuration in Azure Portal](./media/virtual-machines-sql-server-automated-patching/IC792132.jpg)

>[AZURE.NOTE] When you enable Automated Patching for the first time, Azure configures the SQL Server IaaS Agent in the background. During this time, the portal will not show that Automated Patching is configured. Wait several minutes for the agent to be installed, configured. After that the portal will reflect the new settings.

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

## Disabling and Uninstalling the SQL Server IaaS Agent

If you want to disable the SQL Server IaaS Agent for Automated Backup and Patching, use the following command:

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension -Disable | Update-AzureVM

To uninstall the SQL Server IaaS Agent, use the following syntax:

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Set-AzureVMSqlServerExtension –Uninstall | Update-AzureVM

You can also uninstall the extension using the **Remove-AzureVMSqlServerExtension** command:

    Get-AzureVM -ServiceName <vmservicename> -Name <vmname> | Remove-AzureVMSqlServerExtension | Update-AzureVM

## Compatibility

The following products are compatible with the SQL Server IaaS Agent features for Automated Patching:

- Windows Server 2012

- Windows Server 2012 R2

- SQL Server 2012

- SQL Server 2014

## Next Steps

A related feature for SQL Server VMs in Azure is [Automated Backup for SQL Server in Azure Virtual Machines](virtual-machines-sql-server-automated-backup.md).

Review other [resources for running SQL Server in Azure Virtual Machines](virtual-machines-sql-server-infrastructure-services.md).

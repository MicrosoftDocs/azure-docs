---
title: Maintenance control for OS image upgrades on Azure virtual machine scale sets using PowerShell
description: Learn how to control when automatic OS image upgrades are rolled out to your Azure virtual machine scale sets using Maintenance control and PowerShell.
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 09/11/2020
ms.author: jushiman
#pmcontact: shants
---

# Preview: Maintenance control for OS image upgrades on Azure virtual machine scale sets using PowerShell

Maintenance control lets you decide when to apply automatic guest OS image upgrades to your virtual machine scale sets. This topic covers the Azure PowerShell options for Maintenance control. For more information on using Maintenance control, see [Maintenance control for Azure virtual machine scale sets](virtual-machine-scale-sets-maintenance-control.md).

> [!IMPORTANT]
> Maintenance control for OS image upgrades on Azure virtual machine scale sets is currently in Public Preview.
> This preview version is provided without a service level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Enable the PowerShell module

Make sure `PowerShellGet` is up to date.	

```azurepowershell-interactive	
Install-Module -Name PowerShellGet -Repository PSGallery -Force	
```	

Install the `Az.Maintenance` PowerShell module.   	

```azurepowershell-interactive	
Install-Module -Name Az.Maintenance
```	

If you're installing locally, make sure you open your PowerShell prompt as an administrator.

You may also be asked to confirm that you want to install from an *untrusted repository*. Type `Y` or select **Yes to All** to install the module.

## Connect to an Azure account

Connect to your desired Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) and [Set-AzAccount](/powershell/module/az.accounts/set-azcontext).

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext 00a000aa-0a00-0a0a-00aa-a00a000aaa00

$RGName="myMaintenanceRG"
$MaintenanceConfig="myMaintenanceConfig"
$location="eastus2"
$vmss="myMaintenanceVMSS"
```

## Create a maintenance configuration

Create a resource group as a container for your configuration. In this example, a resource group named *myMaintenanceRG* is created in *eastus2*. If you already have a resource group that you want to use, you can skip this part. Just replace the resource group name with your own in the rest of the examples.

```azurepowershell-interactive
New-AzResourceGroup `
   -Location $location `
   -Name $RGName
```

Use [New-AzMaintenanceConfiguration](/powershell/module/az.maintenance/new-azmaintenanceconfiguration) to create a maintenance configuration. This example creates a maintenance configuration named *myConfig* scoped to the OS image. 

```azurepowershell-interactive
$config = New-AzMaintenanceConfiguration `
   -ResourceGroup $RGName `
   -Name $MaintenanceConfig `
   -MaintenanceScope OSImage `
   -Location $location `
   -StartDateTime "2020-10-01 00:00" `
   -TimeZone "Pacific Standard Time" `
   -Duration "05:00" `
   -RecurEvery "Day"
```

> [!IMPORTANT]
> Maintenance **duration** must be *5 hours* or longer. Maintenance **recurrence** must be set to *Day*.

Using `-MaintenanceScope OSImage` ensures that the maintenance configuration is used for controlling updates to the guest OS.

If you try to create a configuration with the same name, but in a different location, you'll get an error. Configuration names must be unique to your resource group.

You can query for available maintenance configurations using [Get-AzMaintenanceConfiguration](/powershell/module/az.maintenance/get-azmaintenanceconfiguration).

```azurepowershell-interactive
Get-AzMaintenanceConfiguration | Format-Table -Property Name,Id
```

## Associate your virtual machine scale set to the maintenance configuration

A virtual machine scale set can be associated to any Maintenance configuration regardless of the region and subscription of the Maintenance configuration. By opting in to the Maintenance configuration, new OS image updates for the scale set will be automatically scheduled on the next available maintenance window.

Use [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment) to associate your virtual machine scale set the maintenance configuration.

```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName $RGName `
   -Location $location `
   -ResourceName $vmss `
   -ResourceType VirtualMachineScaleSets `
   -ProviderName Microsoft.Compute `
   -ConfigurationAssignmentName $config.Name`
   -MaintenanceConfigurationId $config.Id
``` 

## Enable automatic OS upgrade

You can enable automatic OS upgrades for each virtual machine scale set that is going to use maintenance control. Refer to document [Azure virtual machine scale set automatic OS image upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) for enabling automatic OS upgrades on your virtual machine scale set. 


## Next steps

Learn about Maintenance and updates for virtual machines running in Azure.

> [!div class="nextstepaction"]
> [Maintenance and updates](maintenance-and-updates.md)
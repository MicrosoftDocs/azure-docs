---
title: Maintenance control for Azure virtual machines scale sets using PowerShell
description: Learn how to control when maintenance is applied to your Azure virtual machines scale sets using Maintenance control and PowerShell.
author: cynthn
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 09/11/2020
ms.author: cynthn
#pmcontact: shants
---

# Control updates with Maintenance Control and Azure PowerShell

Maintenance control lets you decide when to apply updates to your guest virtual machine scale sets. This topic covers the Azure PowerShell options for Maintenance control. For more about benefits of using Maintenance control, its limitations, and other management options, see [Managing platform updates with Maintenance Control](maintenance-control.md).

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

Connect to your desired Azure account using [Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount?view=azps-4.6.1) and [Set-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/set-azcontext?view=azps-4.6.1).

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext 42c974dd-2c03-4f1b-96ad-b07f050aaa74

$RGName="Ignite2020"
$MaintenanceConfig="MyMaintenanceConfig"
$location="eastus2"
$vmss="ShantSVMSS"
```

## Create a maintenance configuration

Create a resource group as a container for your configuration. In this example, a resource group named *myMaintenanceRG* is created in *eastus*. If you already have a resource group that you want to use, you can skip this part. Just replace the resource group name with your own in the rest of the examples.

```azurepowershell-interactive
New-AzResourceGroup `
   -Location eastus `
   -Name myMaintenanceRG
```

Use [New-AzMaintenanceConfiguration](/powershell/module/az.maintenance/new-azmaintenanceconfiguration) to create a maintenance configuration. This example creates a maintenance configuration named *myConfig* scoped to the OS image. 

```azurepowershell-interactive
$config = New-AzMaintenanceConfiguration `
   -ResourceGroup myMaintenanceRG `
   -Name myConfig `
   -MaintenanceScope OSImage `
   -Location $location `
   -StartDateTime "2020-10-01 00:00" `
   -TimeZone "Pacific Standard Time" `
   -Duration "05:00" `
   -RecurEvery "Day"
```

```azurepowershell-interactive
$config
```

Using `-MaintenanceScope OSImage` ensures that the maintenance configuration is used for controlling updates to the guest OS.

If you try to create a configuration with the same name, but in a different location, you'll get an error. Configuration names must be unique to your subscription.

You can query for available maintenance configurations using [Get-AzMaintenanceConfiguration](/powershell/module/az.maintenance/get-azmaintenanceconfiguration).

```azurepowershell-interactive
Get-AzMaintenanceConfiguration | Format-Table -Property Name,Id
```

## Associate your VMSS to the Maintenance configuration

A virtual machine scale set for a given region should be associated to the corresponding Maintenance configuration for the region. By opting in to the Maintenance configuration, new OS image updates for the scale set will be automatically scheduled on the next available maintenance window.

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
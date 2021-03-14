---
title: Maintenance control for Azure virtual machines using PowerShell
description: Learn how to control when maintenance is applied to your Azure VMs using Maintenance control and PowerShell.
author: cynthn
ms.service: virtual-machines
ms.subservice: maintenance-control
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/19/2020
ms.author: cynthn
#pmcontact: shants
---

# Control updates with Maintenance Control and Azure PowerShell

Maintenance control lets you decide when to apply platform updates to the host infrastructure of your isolated VMs and Azure dedicated hosts. This topic covers the Azure PowerShell options for Maintenance control. For more about benefits of using Maintenance control, its limitations, and other management options, see [Managing platform updates with Maintenance Control](maintenance-control.md).
 
## Enable the PowerShell module

Make sure `PowerShellGet` is up to date.	

```azurepowershell-interactive	
Install-Module -Name PowerShellGet -Repository PSGallery -Force	
```	

Install the `Az.Maintenance` PowerShell module.   	

```azurepowershell-interactive	
Install-Module -Name Az.Maintenance
```	

If you are installing locally, make sure you open your PowerShell prompt as an administrator.

You may also be asked to confirm that you want to install from an *untrusted repository*. Type `Y` or select **Yes to All** to install the module.


## Create a maintenance configuration

Create a resource group as a container for your configuration. In this example, a resource group named *myMaintenanceRG* is created in *eastus*. If you already have a resource group that you want to use, you can skip this part and replace the resource group name with you own in the rest of the examples.

```azurepowershell-interactive
New-AzResourceGroup `
   -Location eastus `
   -Name myMaintenanceRG
```

Use [New-AzMaintenanceConfiguration](/powershell/module/az.maintenance/new-azmaintenanceconfiguration) to create a maintenance configuration. This example creates a maintenance configuration named *myConfig* scoped to the host. 

```azurepowershell-interactive
$config = New-AzMaintenanceConfiguration `
   -ResourceGroup myMaintenanceRG `
   -Name myConfig `
   -MaintenanceScope host `
   -Location  eastus
```

Using `-MaintenanceScope host` ensures that the maintenance configuration is used for controlling updates to the host.

If you try to create a configuration with the same name, but in a different location, you will get an error. Configuration names must be unique to your resource group.

You can query for available maintenance configurations using [Get-AzMaintenanceConfiguration](/powershell/module/az.maintenance/get-azmaintenanceconfiguration).

```azurepowershell-interactive
Get-AzMaintenanceConfiguration | Format-Table -Property Name,Id
```

### Create a maintenance configuration with scheduled window

You can also declare a scheduled window when Azure will apply the updates on your resources. This example creates a maintenance configuration named myConfig with a scheduled window of 5 hours on the fourth Monday of every month. Once you create a scheduled window you no longer have to apply the updates manually.

```azurepowershell-interactive
$config = New-AzMaintenanceConfiguration `
   -ResourceGroup $RGName `
   -Name $MaintenanceConfig `
   -MaintenanceScope Host `
   -Location $location `
   -StartDateTime "2020-10-01 00:00" `
   -TimeZone "Pacific Standard Time" `
   -Duration "05:00" `
   -RecurEvery "Month Fourth Monday"
```
> [!IMPORTANT]
> Maintenance **duration** must be *2 hours* or longer. Maintenance **recurrence** must be set to at least occur once in 35-days.

Maintenance **recurrence** can be expressed as daily, weekly or monthly. Some examples are:
 - **daily**- RecurEvery "Day" **or** "3Days" 
 - **weekly**- RecurEvery "3Weeks" **or** "Week Saturday,Sunday" 
 - **monthly**- RecurEvery "Month day23,day24" **or** "Month Last Sunday" **or** "Month Fourth Monday"  
	  

## Assign the configuration

Use [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment) to assign the configuration to your isolated VM or Azure Dedicated Host.

### Isolated VM

Apply the configuration to a VM using the ID of the configuration. Specify `-ResourceType VirtualMachines` and supply the name of the VM for `-ResourceName`, and the resource group of the VM for `-ResourceGroupName`. 

```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName myResourceGroup `
   -Location eastus `
   -ResourceName myVM `
   -ResourceType VirtualMachines `
   -ProviderName Microsoft.Compute `
   -ConfigurationAssignmentName $config.Name `
   -MaintenanceConfigurationId $config.Id
```

### Dedicated host

To apply a configuration to a dedicated host, you also need to include `-ResourceType hosts`, `-ResourceParentName` with the name of the host group, and `-ResourceParentType hostGroups`. 


```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName myResourceGroup `
   -Location eastus `
   -ResourceName myHost `
   -ResourceType hosts `
   -ResourceParentName myHostGroup `
   -ResourceParentType hostGroups `
   -ProviderName Microsoft.Compute `
   -ConfigurationAssignmentName $config.Name `
   -MaintenanceConfigurationId $config.Id
```

## Check for pending updates

Use [Get-AzMaintenanceUpdate](/powershell/module/az.maintenance/get-azmaintenanceupdate) to see if there are pending updates. Use `-subscription` to specify the Azure subscription of the VM if it is different from the one that you are logged into.

If there are no updates to show, this command will return nothing. Otherwise, it will return a PSApplyUpdate object:

```json
{
   "maintenanceScope": "Host",
   "impactType": "Freeze",
   "status": "Pending",
   "impactDurationInSec": 9,
   "notBefore": "2020-02-21T16:47:44.8728029Z",
   "properties": {
      "resourceId": "/subscriptions/39c6cced-4d6c-4dd5-af86-57499cd3f846/resourcegroups/Ignite2019/providers/Microsoft.Compute/virtualMachines/MCDemo3"
} 
```

### Isolated VM

Check for pending updates for an isolated VM. In this example, the output is formatted as a table for readability.

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
  -ResourceGroupName myResourceGroup `
  -ResourceName myVM `
  -ResourceType VirtualMachines `
  -ProviderName Microsoft.Compute | Format-Table
```


### Dedicated host

To check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability. Replace the values for the resources with your own.

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
   -ResourceGroupName myResourceGroup `
   -ResourceName myHost `
   -ResourceType hosts `
   -ResourceParentName myHostGroup `
   -ResourceParentType hostGroups `
   -ProviderName Microsoft.Compute | Format-Table
```


## Apply updates

Use [New-AzApplyUpdate](/powershell/module/az.maintenance/new-azapplyupdate) to apply pending updates.

### Isolated VM

Create a request to apply updates to an isolated VM.

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName myResourceGroup `
   -ResourceName myVM `
   -ResourceType VirtualMachines `
   -ProviderName Microsoft.Compute
```

On success, this command will return a `PSApplyUpdate` object. You can use the Name attribute in the `Get-AzApplyUpdate` command to check the update status. See [Check update status](#check-update-status).

### Dedicated host

Apply updates to a dedicated host.

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName myResourceGroup `
   -ResourceName myHost `
   -ResourceType hosts `
   -ResourceParentName myHostGroup `
   -ResourceParentType hostGroups `
   -ProviderName Microsoft.Compute
```

## Check update status
Use [Get-AzApplyUpdate](/powershell/module/az.maintenance/get-azapplyupdate) to check on the status of an update. The commands shown below show the status of the latest update by using `default` for the `-ApplyUpdateName` parameter. You can substitute the name of the update (returned by the [New-AzApplyUpdate](/powershell/module/az.maintenance/new-azapplyupdate) command) to get the status of a specific update.

```text
Status         : Completed
ResourceId     : /subscriptions/12ae7457-4a34-465c-94c1-17c058c2bd25/resourcegroups/TestShantS/providers/Microsoft.Comp
ute/virtualMachines/DXT-test-04-iso
LastUpdateTime : 1/1/2020 12:00:00 AM
Id             : /subscriptions/12ae7457-4a34-465c-94c1-17c058c2bd25/resourcegroups/TestShantS/providers/Microsoft.Comp
ute/virtualMachines/DXT-test-04-iso/providers/Microsoft.Maintenance/applyUpdates/default
Name           : default
Type           : Microsoft.Maintenance/applyUpdates
```
LastUpdateTime will be the time when the update got complete, either initiated by you or by the platform in case self-maintenance window was not used. If there has never been an update applied through maintenance control it will show default value.

### Isolated VM

Check for updates to a specific virtual machine.

```azurepowershell-interactive
Get-AzApplyUpdate `
   -ResourceGroupName myResourceGroup `
   -ResourceName myVM `
   -ResourceType VirtualMachines `
   -ProviderName Microsoft.Compute `
   -ApplyUpdateName default
```

### Dedicated host

Check for updates to a dedicated host.

```azurepowershell-interactive
Get-AzApplyUpdate `
   -ResourceGroupName myResourceGroup `
   -ResourceName myHost `
   -ResourceType hosts `
   -ResourceParentName myHostGroup `
   -ResourceParentType hostGroups `
   -ProviderName Microsoft.Compute `
   -ApplyUpdateName myUpdateName
```

## Remove a maintenance configuration

Use [Remove-AzMaintenanceConfiguration](/powershell/module/az.maintenance/remove-azmaintenanceconfiguration) to delete a maintenance configuration.

```azurepowershell-interactive
Remove-AzMaintenanceConfiguration `
   -ResourceGroupName myResourceGroup `
   -Name $config.Name
```

## Next steps
To learn more, see [Maintenance and updates](maintenance-and-updates.md).

---
title: Maintenance Configurations for Azure virtual machines using PowerShell
description: Learn how to control when maintenance is applied to your Azure VMs using Maintenance Configurations and PowerShell.
author: cynthn
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/19/2020
ms.author: cynthn 
ms.custom: devx-track-azurepowershell
#pmcontact: shants
---

# Control updates with Maintenance Configurations and Azure PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Creating a Maintenance Configurations lets you decide when to apply platform updates to various Azure resources. This topic covers the Azure PowerShell options for Dedicated Hosts and Isolated VMs. For more about benefits of using Maintenance Configurations, its limitations, and other management options, see [Managing platform updates with Maintenance Configurations](maintenance-configurations.md).

If you are looking for information about Maintenance Configurations for scale sets, see [Maintenance Control for Virtual Machine Scale Sets](virtual-machine-scale-sets-maintenance-control.md).

> [!IMPORTANT]
> There are different **scopes** which support certain machine types and schedules, so please ensure you are selecting the right scope for your virtual machine.

## Enable the PowerShell module

Make sure `PowerShellGet` is up to date.

```azurepowershell-interactive
Install-Module -Name PowerShellGet -Repository PSGallery -Force
```

Install the `Az.Maintenance` PowerShell module.

```azurepowershell-interactive
Install-Module -Name Az.Maintenance
```

Check that you are running the latest version of `Az.Maintenance` PowerShell module (version 1.2.0)

```azurepowershell-interactive
Get-Module -ListAvailable -Name Az.Maintenance
```

Ensure that you are running the appropriate version of `Az.Maintenance` using

```azurepowershell-interactive
Import-Module -Name Az.Maintenance -RequiredVersion 1.2.0
```

If you are installing locally, make sure you open your PowerShell prompt as an administrator.

You may also be asked to confirm that you want to install from an *untrusted repository*. Type `Y` or select **Yes to All** to install the module.

## Create a maintenance configuration

The first step to creating a maintenance configuration is creating a resource group as a container for your configuration. In this example, a resource group named *myMaintenanceRG* is created in *eastus*. If you already have a resource group that you want to use, you can skip this part and replace the resource group name with your own in the rest of the examples.

```azurepowershell-interactive
New-AzResourceGroup `
   -Location eastus `
   -Name myMaintenanceRG
```

You can declare a scheduled window when Azure will recurrently apply the updates on your resources. Once you create a scheduled window you no longer have to apply the updates manually. Maintenance **recurrence** can be expressed as daily, weekly or monthly. Some examples are:

- **daily**- RecurEvery "Day" **or** "3Days"
- **weekly**- RecurEvery "3Weeks" **or** "Week Saturday,Sunday"
- **monthly**- RecurEvery "Month day23,day24" **or** "Month Last Sunday" **or** "Month Fourth Monday"

### Host

This example creates a maintenance configuration named myConfig scoped to **host** with a scheduled window of 5 hours on the fourth Monday of every month. It is important to note that the **duration** of the schedule for this scope should be at least two hours long. To begin, you will need to define all the parameters needed for `New-AzMaintenanceConfiguration`

```azurepowershell-interactive
$RGName = "myMaintenanceRG"
$configName = "myConfig"
$scope = "Host"
$location = "eastus"
$timeZone = "Pacific Standard Time" 
$duration = "05:00"
$startDateTime = "2022-11-01 00:00"
$recurEvery = "Month Fourth Monday"
```

After you have defined the parameters, you can now use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration.

```azurepowershell-interactive
New-AzMaintenanceConfiguration
   -ResourceGroup $RGName `
   -Name $configName `
   -MaintenanceScope $scope `
   -Location $location `
   -StartDateTime $startDateTime `
   -TimeZone $timeZone `
   -Duration $duration `
   -RecurEvery $recurEvery
```  

Using `$scope = "Host"` ensures that the maintenance configuration is used for controlling updates on host machines. You will need to ensure that you are creating a configuration for the specific scope of machines you are targeting. To read more about scopes check out [maintenance configuration scopes](maintenance-configurations.md#scopes).

### OS Image

In this example, we will create a maintenance configuration named myConfig scoped to **osimage** with a scheduled window of 8 hours every 5 days. It is important to note that the **duration** of the schedule for this scope should be at least 5 hours long. Another key difference to note is that this scope allows a max of 7 days for schedule recurrence.

```azurepowershell-interactive
$RGName = "myMaintenanceRG"
$configName = "myConfig"
$scope = "osimage"
$location = "eastus"
$timeZone = "Pacific Standard Time" 
$duration = "08:00"
$startDateTime = "2022-11-01 00:00"
$recurEvery = "5days"
```

After you have defined the parameters, you can now use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration.

```azurepowershell-interactive
New-AzMaintenanceConfiguration
   -ResourceGroup $RGName `
   -Name $configName `
   -MaintenanceScope $scope `
   -Location $location `
   -StartDateTime $startDateTime `
   -TimeZone $timeZone `
   -Duration $duration `
   -RecurEvery $recurEvery
```  

### Guest

Our most recent addition to the maintenance configuration offering is the **InGuestPatch** scope. This example will show how to create a maintenance configuration for guest scope using PowerShell. To learn more about this scope see [Guest](maintenance-configurations.md#guest).

```azurepowershell-interactive
$RGName = "myMaintenanceRG"
$configName = "myConfig"
$scope = "InGuestPatch"
$location = "eastus"
$timeZone = "Pacific Standard Time" 
$duration = "04:00"
$startDateTime = "2022-11-01 00:00"
$recurEvery = "Week Saturday, Sunday"
$WindowsParameterClassificationToInclude = "FeaturePack","ServicePack";
$WindowParameterKbNumberToInclude = "KB123456","KB123466";
$WindowParameterKbNumberToExclude = "KB123456","KB123466";
$RebootOption = "IfRequired";
$LinuxParameterClassificationToInclude = "Other";
$LinuxParameterPackageNameMaskToInclude = "apt","httpd";
$LinuxParameterPackageNameMaskToExclude = "ppt","userpk";

```

After you have defined the parameters, you can now use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration.

```azurepowershell-interactive
New-AzMaintenanceConfiguration
   -ResourceGroup $RGName `
   -Name $configName `
   -MaintenanceScope $scope `
   -Location $location `
   -StartDateTime $startDateTime `
   -TimeZone $timeZone `
   -Duration $duration `
   -RecurEvery $recurEvery `
   -WindowParameterClassificationToInclude $WindowsParameterClassificationToInclude `
   -WindowParameterKbNumberToInclude $WindowParameterKbNumberToInclude `
   -WindowParameterKbNumberToExclude $WindowParameterKbNumberToExclude `
   -InstallPatchRebootSetting $RebootOption `
   -LinuxParameterPackageNameMaskToInclude $LinuxParameterPackageNameMaskToInclude `
   -LinuxParameterClassificationToInclude $LinuxParameterClassificationToInclude `
   -LinuxParameterPackageNameMaskToExclude $LinuxParameterPackageNameMaskToExclude `
   -ExtensionProperty @{"InGuestPatchMode"="User"}
```  

If you try to create a configuration with the same name, but in a different location, you will get an error. Configuration names must be unique to your resource group.

You can check if you have successfully created the maintenance configurations by using [Get-AzMaintenanceConfiguration](/powershell/module/az.maintenance/get-azmaintenanceconfiguration).

```azurepowershell-interactive
Get-AzMaintenanceConfiguration | Format-Table -Property Name,Id
```

## Assign the configuration

After you have created your configuration, you might want to also assign machines to it using PowerShell. To achieve this we will use [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment).

### Isolated VM

Assign the configuration to a VM using the ID of the configuration. Specify `-ResourceType VirtualMachines` and supply the name of the VM for `-ResourceName`, and the resource group of the VM for `-ResourceGroupName`.

```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVM" `
   -ResourceType "VirtualMachines" `
   -ProviderName "Microsoft.Compute" `
   -ConfigurationAssignmentName "configName" `
   -MaintenanceConfigurationId "configID"
```

### Dedicated host

To apply a configuration to a dedicated host, you also need to include `-ResourceType hosts`, `-ResourceParentName` with the name of the host group, and `-ResourceParentType hostGroups`.

```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myHost" `
   -ResourceType "hosts" `
   -ResourceParentName myHostGroup `
   -ResourceParentType hostGroups `
   -ProviderName "Microsoft.Compute" `
   -ConfigurationAssignmentName "configName" `
   -MaintenanceConfigurationId "configID"
```

### Virtual Machine Scale Sets

```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVMSS" `
   -ResourceType "VirtualMachineScaleSets" `
   -ProviderName "Microsoft.Compute" `
   -ConfigurationAssignmentName "configName" `
   -MaintenanceConfigurationId "configID"
```


### Guest

```azurepowershell-interactive
New-AzConfigurationAssignment `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myGuest" `
   -ResourceType "VirtualMachines" `
   -ProviderName "Microsoft.Compute" `
   -ConfigurationAssignmentName "configName" `
   -MaintenanceConfigurationId "configID"
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
  -ResourceGroupName "myResourceGroup" `
  -ResourceName "myVM" `
  -ResourceType "VirtualMachines" `
  -ProviderName "Microsoft.Compute" | Format-Table
```

### Dedicated host

Check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability.

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
   -ResourceGroupName "myResourceGroup" `
   -ResourceName "myHost" `
   -ResourceType "hosts" `
   -ResourceParentName "myHostGroup" `
   -ResourceParentType "hostGroups" `
   -ProviderName "Microsoft.Compute" | Format-Table
```

### Virtual Machine Scale Sets

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVMSS" `
   -ResourceType "VirtualMachineScaleSets" `
   -ProviderName "Microsoft.Compute" | Format-Table
```

## Apply updates

Use [New-AzApplyUpdate](/powershell/module/az.maintenance/new-azapplyupdate) to apply pending updates. Apply update calls can take up to 2 hours to complete. This cmdlet will only work for *Host* and *OSImage* scopes. It will NOT work for *Guest* scope.

### Isolated VM

Create a request to apply updates to an isolated VM.

```azurepowershell-interactive
New-AzApplyUpdate `
  -ResourceGroupName "myResourceGroup" `
  -ResourceName "myVM" `
  -ResourceType "VirtualMachines" `
  -ProviderName "Microsoft.Compute"
```

On success, this command will return a `PSApplyUpdate` object. You can use the Name attribute in the `Get-AzApplyUpdate` command to check the update status. See [Check update status](#check-update-status).

### Dedicated host

Apply updates to a dedicated host.

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName "myResourceGroup" `
   -ResourceName "myHost" `
   -ResourceType "hosts" `
   -ResourceParentName "myHostGroup" `
   -ResourceParentType "hostGroups" `
   -ProviderName Microsoft.Compute
```

### Virtual Machine Scale Sets

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVMSS" `
   -ResourceType "VirtualMachineScaleSets" `
   -ProviderName "Microsoft.Compute"
```

## Check update status

Use [Get-AzApplyUpdate](/powershell/module/az.maintenance/get-azapplyupdate) to check on the status of an update. The commands shown below show the status of the latest update by using `default` for the `-ApplyUpdateName` parameter. You can substitute the name of the update (returned by the [New-AzApplyUpdate](/powershell/module/az.maintenance/new-azapplyupdate) command) to get the status of a specific update. This cmdlet will only work for *Host* and *OSImage* scopes. It will NOT work for *Guest* scope.

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

LastUpdateTime will be the time when the update got complete, either initiated by you or by the platform in case self-maintenance window was not used. If there has never been an update applied through maintenance configurations it will show default value.

### Isolated VM

Check for updates to a specific virtual machine.

```azurepowershell-interactive
Get-AzApplyUpdate `
  -ResourceGroupName "myResourceGroup" `
  -ResourceName "myVM" `
  -ResourceType "VirtualMachines" `
  -ProviderName "Microsoft.Compute" `
  -ApplyUpdateName "applyUpdateName"
```

### Dedicated host

Check for updates to a dedicated host.

```azurepowershell-interactive
Get-AzApplyUpdate `
   -ResourceGroupName "myResourceGroup" `
   -ResourceName "myHost" `
   -ResourceType "hosts" `
   -ResourceParentName "myHostGroup" `
   -ResourceParentType "hostGroups" `
   -ProviderName "Microsoft.Compute" `
   -ApplyUpdateName "applyUpdateName"
```

### Virtual Machine Scale Sets

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVMSS" `
   -ResourceType "VirtualMachineScaleSets" `
   -ProviderName "Microsoft.Compute" `
   -ApplyUpdateName "applyUpdateName"
```

## Delete a maintenance configuration

Use [Remove-AzMaintenanceConfiguration](/powershell/module/az.maintenance/remove-azmaintenanceconfiguration) to delete a maintenance configuration.

```azurepowershell-interactive
Remove-AzMaintenanceConfiguration `
   -ResourceGroupName "myResourceGroup" `
   -Name "configName"
```

## Next steps

To learn more, see [Maintenance and updates](maintenance-and-updates.md).

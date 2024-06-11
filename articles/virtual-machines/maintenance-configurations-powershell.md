---
title: Maintenance Configurations for Azure virtual machines using Azure PowerShell
description: Learn how to control when maintenance is applied to your Azure VMs by using Maintenance Configurations and Azure PowerShell.
author: ju-shim
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: how-to
ms.date: 11/19/2020
ms.author: jushiman
ms.custom: devx-track-azurepowershell
#pmcontact: shants
---

# Control updates with Maintenance Configurations and Azure PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

You can use the Maintenance Configurations feature to control when to apply platform updates to various Azure resources. This article covers the Azure PowerShell options for dedicated hosts and isolated virtual machines (VMs). For more information about the benefits of using the Maintenance Configurations feature, its limitations, and other management options, see [Managing platform updates with Maintenance Configurations](maintenance-configurations.md).

If you're looking for information about using Maintenance Configurations for scale sets, see [Maintenance control for Azure Virtual Machine Scale Sets](virtual-machine-scale-sets-maintenance-control.md).

> [!IMPORTANT]
> Specific *scopes* support certain machine types and schedules. Be sure to select the right scope for your VM.

## Enable the Azure PowerShell module

Make sure that `PowerShellGet` is up to date:

```azurepowershell-interactive
Install-Module -Name PowerShellGet -Repository PSGallery -Force
```

Install the `Az.Maintenance` Azure PowerShell module:

```azurepowershell-interactive
Install-Module -Name Az.Maintenance
```

Check that you're running the latest version of `Az.Maintenance` (version 1.2.0):

```azurepowershell-interactive
Get-Module -ListAvailable -Name Az.Maintenance
```

Ensure that you're running the appropriate version of `Az.Maintenance`:

```azurepowershell-interactive
Import-Module -Name Az.Maintenance -RequiredVersion 1.2.0
```

If you're installing locally, be sure to open your Azure PowerShell prompt as an administrator.

You might be asked to confirm that you want to install from an untrusted repository. Enter **Y** or select **Yes to All** to install the module.

## Create a maintenance configuration

The first step in creating a maintenance configuration is creating a resource group as a container for your configuration. This example creates a resource group named *myMaintenanceRG* in *eastus*. If you already have a resource group that you want to use, you can skip this part and replace the resource group name with your own in the rest of the examples.

```azurepowershell-interactive
New-AzResourceGroup `
   -Location eastus `
   -Name myMaintenanceRG
```

You can declare a scheduled window when Azure will recurrently apply the updates on your resources. After you create a scheduled window, you no longer have to apply the updates manually.

You can express maintenance recurrence as daily, weekly, or monthly. Here are some examples:

- **Daily**: A `RecurEvery` value of `"Day"` or `"3Days"`.
- **Weekly**: A `RecurEvery` value of `"3Weeks"` or `"Week Saturday,Sunday"`.
- **Monthly**: A `RecurEvery` value of  `"Month day23,day24"` or `"Month Last Sunday"` or `"Month Fourth Monday"`.

### Host

This example creates a maintenance configuration named *myConfig* scoped to `Host`, with a scheduled window of 5 hours on the fourth Monday of every month. The `duration` value of the schedule for this scope should be at least two hours. To begin, define the parameters for `New-AzMaintenanceConfiguration`:

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

After you define the parameters, you can use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration:

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

Using `$scope = "Host"` ensures that the maintenance configuration is used for controlling updates on host machines. Be sure to create a configuration for the specific scope of the machines that you're targeting. [Learn more about scopes](maintenance-configurations.md#scopes).

### OS image

This example creates a maintenance configuration named *myConfig* scoped to `osimage`, with a scheduled window of 8 hours every 5 days. The `duration` value of the schedule for this scope should be at least 5 hours. This scope allows a maximum of 7 days for schedule recurrence.

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

After you define the parameters, you can use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration:

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

The most recent addition to the Maintenance Configurations feature is the `InGuestPatch` scope. This example shows how to create a maintenance configuration for a guest scope by using Azure PowerShell. For more information about this scope, see [Guest](maintenance-configurations.md#guest).

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

After you define the parameters, you can use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration:

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

If you try to create a configuration with the same name but in a different location, you'll get an error. Configuration names must be unique to your resource group.

You can check if you successfully created the maintenance configurations by using [Get-AzMaintenanceConfiguration](/powershell/module/az.maintenance/get-azmaintenanceconfiguration):

```azurepowershell-interactive
Get-AzMaintenanceConfiguration | Format-Table -Property Name,Id
```

## Assign the configuration

After you create your configuration, you might want to also assign machines to it by using Azure PowerShell. You can use the [New-AzConfigurationAssignment](/powershell/module/az.maintenance/new-azconfigurationassignment) cmdlet.

### Isolated VM

Assign the configuration to a VM by using the ID of the configuration. Specify `-ResourceType VirtualMachines`. Supply the name of the VM for `-ResourceName`, and supply the resource group of the VM for `-ResourceGroupName`.

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

To apply a configuration to a dedicated host, you need to include `-ResourceType hosts`, `-ResourceParentName` with the name of the host group, and `-ResourceParentType hostGroups`:

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

### Virtual machine scale sets

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

The check for pending updates, use [Get-AzMaintenanceUpdate](/powershell/module/az.maintenance/get-azmaintenanceupdate). Use `-subscription` to specify the Azure subscription of the VM, if it's different from the one that you're logged in to.

If there are no updates to show, this command returns nothing. Otherwise, it returns a `PSApplyUpdate` object:

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

Check for pending updates for an isolated VM. In this example, the output is formatted as a table for readability:

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
  -ResourceGroupName "myResourceGroup" `
  -ResourceName "myVM" `
  -ResourceType "VirtualMachines" `
  -ProviderName "Microsoft.Compute" | Format-Table
```

### Dedicated host

Check for pending updates for a dedicated host. In this example, the output is formatted as a table for readability:

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
   -ResourceGroupName "myResourceGroup" `
   -ResourceName "myHost" `
   -ResourceType "hosts" `
   -ResourceParentName "myHostGroup" `
   -ResourceParentType "hostGroups" `
   -ProviderName "Microsoft.Compute" | Format-Table
```

### Virtual machine scale sets

```azurepowershell-interactive
Get-AzMaintenanceUpdate `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVMSS" `
   -ResourceType "VirtualMachineScaleSets" `
   -ProviderName "Microsoft.Compute" | Format-Table
```

## Apply updates

Use [New-AzApplyUpdate](/powershell/module/az.maintenance/new-azapplyupdate) to apply pending updates. Applying update calls can take up to 2 hours to complete.

This cmdlet works only for the host and OS image scopes. It doesn't work for the guest scope.

### Isolated VM

Create a request to apply updates to an isolated VM:

```azurepowershell-interactive
New-AzApplyUpdate `
  -ResourceGroupName "myResourceGroup" `
  -ResourceName "myVM" `
  -ResourceType "VirtualMachines" `
  -ProviderName "Microsoft.Compute"
```

On success, this command returns a `PSApplyUpdate` object. You can use the `Name` attribute in the `Get-AzApplyUpdate` command to check the update status, as described [later in this article](#check-update-status).

### Dedicated host

Apply updates to a dedicated host:

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName "myResourceGroup" `
   -ResourceName "myHost" `
   -ResourceType "hosts" `
   -ResourceParentName "myHostGroup" `
   -ResourceParentType "hostGroups" `
   -ProviderName Microsoft.Compute
```

### Virtual machine scale sets

```azurepowershell-interactive
New-AzApplyUpdate `
   -ResourceGroupName "myResourceGroup" `
   -Location "eastus" `
   -ResourceName "myVMSS" `
   -ResourceType "VirtualMachineScaleSets" `
   -ProviderName "Microsoft.Compute"
```

## Check update status

To check the status of an update, use [Get-AzApplyUpdate](/powershell/module/az.maintenance/get-azapplyupdate). The following commands show the status of the latest update by using `default` for the `-ApplyUpdateName` parameter. You can substitute the name of the update (returned by the [New-AzApplyUpdate](/powershell/module/az.maintenance/new-azapplyupdate) command) to get the status of a specific update.

This cmdlet works only for the host and OS image scopes. It doesn't work for the guest scope.

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

`LastUpdateTime` is the time when the update finished, whether you initiated the update or the platform initiated it because you didn't use the self-maintenance window. If an update was never applied through Maintenance Configurations, `LastUpdateTime` shows the default value.

### Isolated VM

Check for updates to a specific virtual machine:

```azurepowershell-interactive
Get-AzApplyUpdate `
  -ResourceGroupName "myResourceGroup" `
  -ResourceName "myVM" `
  -ResourceType "VirtualMachines" `
  -ProviderName "Microsoft.Compute" `
  -ApplyUpdateName "applyUpdateName"
```

### Dedicated host

Check for updates to a dedicated host:

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

### Virtual machine scale sets

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

To delete a maintenance configuration, use [Remove-AzMaintenanceConfiguration](/powershell/module/az.maintenance/remove-azmaintenanceconfiguration):

```azurepowershell-interactive
Remove-AzMaintenanceConfiguration `
   -ResourceGroupName "myResourceGroup" `
   -Name "configName"
```

## Next steps

To learn more, see [Maintenance for virtual machines in Azure](maintenance-and-updates.md).

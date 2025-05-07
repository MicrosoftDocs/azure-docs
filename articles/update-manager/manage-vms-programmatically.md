---
title: Programmatically manage updates for Azure VMs
description: This article tells how to use Azure Update Manager in Azure using REST API with Azure virtual machines.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 10/17/2024
ms.topic: overview
---

# How to programmatically manage updates for Azure VMs

This article walks you through the process of using the Azure REST API to trigger an assessment and an update deployment on your Azure virtual machine with Azure Update Manager in Azure. If you're new to Update Manager and you want to learn more, see [overview of Azure Update Manager](overview.md). To use the Azure REST API to manage Arc-enabled servers, see [How to programmatically work with Arc-enabled servers](manage-arc-enabled-servers-programmatically.md).

Azure Update Manager in Azure enables you to use the [Azure REST API](/rest/api/azure/) for access programmatically. Additionally, you can use the appropriate REST commands from [Azure PowerShell](/powershell/azure/) and [Azure CLI](/cli/azure/).

Support for Azure REST API to manage Azure VMs is available through the Update Manager virtual machine extension.

## Update assessment

To trigger an update assessment on your Azure VM, specify the following POST request:

```rest
POST on `subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.Compute/virtualMachines/virtualMachineName/assessPatches?api-version=2020-12-01`
```

# [Azure CLI](#tab/cli)

To specify the POST request, you can use the Azure CLI [az vm assess-patches](/cli/azure/vm#az-vm-assess-patches) command.

```azurecli
az vm assess-patches -g MyResourceGroup -n MyVm
```


# [Azure PowerShell](#tab/powershell)

To specify the POST request, you can use the Azure PowerShell [Invoke-AzVMPatchAssessment](/powershell/module/az.compute/invoke-azvmpatchassessment) cmdlet.

```azurepowershell
Invoke-AzVMPatchAssessment -ResourceGroupName "myRG" -VMName "myVM"
```

---

## Update deployment

To trigger an update deployment to your Azure VM, specify the following POST request:

```rest
POST on `subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.Compute/virtualMachines/virtualMachineName/installPatches?api-version=2020-12-01`
```

#### Request body

The following table describes the elements of the request body:

| Property | Description |
|----------|-------------|
| `maximumDuration` | Maximum amount of time that the operation runs. It must be an ISO 8601-compliant duration string such as `PT4H` (4 hours). |
| `rebootSetting` | Flag to state if machine should be rebooted and if Guest OS update installation requires it for completion. Acceptable values are: `IfRequired, NeverReboot, AlwaysReboot`. |
| `windowsParameters` | Parameter options for Guest OS update on Azure VMs running a supported Microsoft Windows Server operating system. |
| `windowsParameters - classificationsToInclude` | List of categories/classifications to be used for selecting the updates to be installed on the machine. Acceptable values are: `Critical, Security, UpdateRollup, FeaturePack, ServicePack, Definition, Tools, Updates` |
| `windowsParameters - kbNumbersToInclude` | List of Windows Update KB Ids that should be installed. All updates belonging to the classifications provided in `classificationsToInclude` list will be installed. `kbNumbersToInclude` is an optional list of specific KBs to be installed in addition to the classifications. For example: `1234` |
| `windowsParameters - kbNumbersToExclude` | List of Windows Update KB Ids that should **not** be installed. This parameter overrides `windowsParameters - classificationsToInclude`, meaning a Windows Update KB ID specified here won't be installed even if it belongs to the classification provided under `classificationsToInclude` parameter. |
| `maxPatchPublishDate` | This is used to install patches that were published on or before this given max published date.| 
| `linuxParameters` | Parameter options for Guest OS update on Azure VMs running a supported Linux server operating system. |
| `linuxParameters - classificationsToInclude` | List of categories/classifications to be used for selecting the updates to be installed on the machine. Acceptable values are: `Critical, Security, Other` |
| `linuxParameters - packageNameMasksToInclude` | List of Linux packages that should be installed. All updates belonging to the classifications provided in `classificationsToInclude` list will be installed. `packageNameMasksToInclude` is an optional list of package names to be installed in addition to the classifications. For example: `mysql, libc=1.0.1.1, kernel*` |
| `linuxParameters - packageNameMasksToExclude` | List of updates that should **not** be installed. This parameter overrides `linuxParameters - packageNameMasksToExclude`, meaning a package specified here won't be installed even if it belongs to the classification provided under `classificationsToInclude` parameter. |


# [Azure REST API](#tab/rest)

To specify the POST request, you can use the following Azure REST API call with valid parameters and values. 

```rest
POST on 'subscriptions/{subscriptionId}/resourceGroups/acmedemo/providers/Microsoft.Compute/virtualMachines/ameacr/installPatches?api-version=2020-12-01

{
    "maximumDuration": "PT120M",
    "rebootSetting": "IfRequired",
    "windowsParameters": {
      "classificationsToInclude": [
        "Security",
        "UpdateRollup",
        "FeaturePack",
        "ServicePack"
      ],
      "kbNumbersToInclude": [
        "11111111111",
        "22222222222222"
      ],
      "kbNumbersToExclude": [
        "333333333333",
        "55555555555"
      ]
    }
  }'
```

# [Azure CLI](#tab/azurecli)

To specify the POST request, you can use the Azure CLI [az vm install-patches](/cli/azure/vm#az-vm-install-patches) command.

```azurecli
az vm install-patches -g MyResourceGroup -n MyVm --maximum-duration PT4H --reboot-setting IfRequired --classifications-to-include-linux Critical
```

The format of the request body for version 2020-12-01 is as follows:

```json
{
    "maximumDuration"
    "rebootSetting"
    "windowsParameters": {
      "classificationsToInclude": [
      ],
      "kbNumbersToInclude": [
      ],
      "kbNumbersToExclude": [
      ]
    }
  }
```

# [Azure PowerShell](#tab/azurepowershell)

To specify the POST request, you can use the Azure PowerShell [Invoke-AzVMInstallPatch](/powershell/module/az.accounts/invoke-azrestmethod) cmdlet.

```azurepowershell
Invoke-AzVmInstallPatch -ResourceGroupName 'MyRG' -VmName 'MyVM' -Windows -RebootSetting 'never' -MaximumDuration PT2H -ClassificationToIncludeForWindows Critical
```
---


## Create a maintenance configuration schedule

To create a maintenance configuration schedule, specify the following PUT request:

```rest
PUT on `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Maintenance/maintenanceConfigurations/<maintenanceConfigurationsName>?api-version=2021-09-01-preview`
```

#### Request body

The following table describes the elements of the request body:

| Property | Description |
|----------|-------------|
| `id` | Fully qualified identifier of the resource |
| `location` | Gets or sets location of the resource |
| `name` |	Name of the resource |
| `properties.extensionProperties` | Gets or sets extensionProperties of the maintenanceConfiguration |
| `properties.maintenanceScope` | Gets or sets maintenanceScope of the configuration |
| `properties.maintenanceWindow.duration` | Duration of the maintenance window in HH:MM format. If not provided, default value is used based on maintenance scope provided. Example: 05:00. |
| `properties.maintenanceWindow.expirationDateTime` | Effective expiration date of the maintenance window in YYYY-MM-DD hh:mm format. The window is created in the time zone provided to daylight savings according to that time zone. Expiration date must be set to a future date. If not provided, it's set to the maximum datetime 9999-12-31 23:59:59. |
| `properties.maintenanceWindow.recurEvery` | Rate at which a maintenance window is expected to recur. The rate can be expressed as daily, weekly, or monthly schedules. Daily schedules are formatted as recurEvery: [Frequency as integer]['Day(s)']. If no frequency is provided, the default frequency is 1. Daily schedule examples are recurEvery: Day, recurEvery: 3Days. Weekly schedules are formatted as recurEvery: [Frequency as integer]['Week(s)'] [Optional comma separated list of weekdays Monday-Sunday]. Weekly schedule examples are recurEvery: 3Weeks, recurEvery: Week Saturday, Sunday. Monthly schedules are formatted as [Frequency as integer]['Month(s)'] [Comma separated list of month days] or [Frequency as integer]['Month(s)'] [Week of Month (First, Second, Third, Fourth, Last)] [Weekday Monday-Sunday]. Monthly schedule examples are recurEvery: Month, recurEvery: 2Months, recurEvery: Month day23, day24, recurEvery: Month Last Sunday, recurEvery: Month Fourth Monday. |
| `properties.maintenanceWindow.startDateTime` | 	Effective start date of the maintenance window in YYYY-MM-DD hh:mm format. You can set the start date to either the current date or future date. The window will be created in the time zone provided and adjusted to daylight savings according to that time zone. |
| `properties.maintenanceWindow.timeZone` |	Name of the timezone. List of timezones can be obtained by executing [System.TimeZoneInfo]:GetSystemTimeZones() in PowerShell. Example: Pacific Standard Time, UTC, W. Europe Standard Time, Korea Standard Time, Cen. Australia Standard Time. |
| `properties.namespace` | 	Gets or sets namespace of the resource |
| `properties.visibility` | Gets or sets the visibility of the configuration. The default value is 'Custom' |
| `systemData` | Azure Resource Manager metadata containing createdBy and modifiedBy information. |
| `tags` | Gets or sets tags of the resource |
| `type` | Type of the resource |

# [Azure REST API](#tab/rest)

To specify the POST request, you can use the following Azure REST API call with valid parameters and values. 

```rest
PUT on '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/atscalepatching/providers/Microsoft.Maintenance/maintenanceConfigurations/TestAzureInGuestAdv2?api-version=2021-09-01-preview

{
  "location": "eastus2euap",
  "properties": {
    "namespace": null,
    "extensionProperties": {
      "InGuestPatchMode" : "User"
    },
    "maintenanceScope": "InGuestPatch",
    "maintenanceWindow": {
      "startDateTime": "2021-08-21 01:18",
      "expirationDateTime": "2221-05-19 03:30",
      "duration": "01:30",
      "timeZone": "India Standard Time",
      "recurEvery": "Day"
    },
    "visibility": "Custom",
    "installPatches": {
      "rebootSetting": "IfRequired",
      "windowsParameters": {
        "classificationsToInclude": [
          "Security",
          "Critical",
          "UpdateRollup"
        ]
      },
      "linuxParameters": {
        "classificationsToInclude": [
          "Other"
        ]
      }
    }
  }
}'
```

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az maintenance configuration create \
   --resource-group myMaintenanceRG \
   --resource-name myConfig \
   --maintenance-scope InGuestPatch \
   --location eastus \
   --maintenance-window-duration "02:00" \
   --maintenance-window-recur-every "20days" \
   --maintenance-window-start-date-time "2022-12-30 07:00" \
   --maintenance-window-time-zone "Pacific Standard Time" \
   --install-patches-linux-parameters package-name-masks-to-exclude="ppt" package-name-masks-to-include="apt" classifications-to-include="Other" \
   --install-patches-windows-parameters kb-numbers-to-exclude="KB123456" kb-numbers-to-include="KB123456" classifications-to-include="FeaturePack" \
   --reboot-setting "IfRequired" \
   --extension-properties InGuestPatchMode="User"
```

# [Azure PowerShell](#tab/azurepowershell)

You can use the `New-AzMaintenanceConfiguration` cmdlet to create your configuration.

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
---

## Associate a VM with a schedule

To associate a VM with a maintenance configuration schedule, specify the following PUT request:

```rest
PUT on `<ARC or Azure VM resourceId>/providers/Microsoft.Maintenance/configurationAssignments/<configurationAssignment name>?api-version=2021-09-01-preview`
```

# [Azure REST API](#tab/rest)

To specify the PUT request, you can use the following Azure REST API call with valid parameters and values. 

```rest
PUT on '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/atscalepatching/providers/Microsoft.Compute/virtualMachines/win-atscalepatching-1/providers/Microsoft.Maintenance/configurationAssignments/TestAzureInGuestAdv?api-version=2021-09-01-preview

{
  "properties": {
    "maintenanceConfigurationId": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/atscalepatching/providers/Microsoft.Maintenance/maintenanceConfigurations/TestAzureInGuestIntermediate2"
  },
  "location": "eastus2euap"
}'
```

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az maintenance assignment create \
   --resource-group myMaintenanceRG \
   --location eastus \
   --resource-name myVM \
   --resource-type virtualMachines \
   --provider-name Microsoft.Compute \
   --configuration-assignment-name myConfig \
   --maintenance-configuration-id "/subscriptions/{subscription ID}/resourcegroups/myMaintenanceRG/providers/Microsoft.Maintenance/maintenanceConfigurations/myConfig"
```

# [Azure PowerShell](#tab/azurepowershell)

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
---
## Remove machine from the schedule

To remove a machine from the schedule, get all the configuration assignment names for the machine that were created to associate the machine with the current schedule from the Azure Resource Graph as listed:

```kusto
maintenanceresources
| where type =~ "microsoft.maintenance/configurationassignments"
| where properties.maintenanceConfigurationId =~ "<maintenance configuration Resource ID>"
| where properties.resourceId =~ "<Machine Resource Id>"
| project name, id
```
After you obtain the name from above, delete the configuration assignment by following the DELETE request - 
```rest
DELETE on `<ARC or Azure VM resourceId>/providers/Microsoft.Maintenance/configurationAssignments/<configurationAssignment name>?api-version=2021-09-01-preview`
```

## Next steps

* To view update assessment and deployment logs generated by Update Manager, see [query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot](troubleshoot.md) Update Manager.

---
title: Programmatically manage updates for Azure Arc-enabled servers in Azure Update Manager
description: This article tells how to use Azure Update Manager using REST API with Azure Arc-enabled servers.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 10/17/2024
ms.topic: how-to
---

# How to programmatically manage updates for Azure Arc-enabled servers

This article walks you through the process of using the Azure REST API to trigger an assessment and an update deployment on your Azure Arc-enabled servers with Azure Update Manager in Azure. If you're new to Azure Update Manager and you want to learn more, see [overview of Update Manager](overview.md). To use the Azure REST API to manage Azure virtual machines, see [How to programmatically work with Azure virtual machines](manage-vms-programmatically.md).

Update Manager in Azure enables you to use the [Azure REST API](/rest/api/azure) for access programmatically. Additionally, you can use the appropriate REST commands from [Azure PowerShell](/powershell/azure) and [Azure CLI](/cli/azure).

Support for Azure REST API to manage Azure Arc-enabled servers is available through the Update Manager virtual machine extension.

## Update assessment

To trigger an update assessment on your Azure Arc-enabled server, specify the following POST request:

```rest
POST on `subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.HybridCompute/machines/machineName/assessPatches?api-version=2020-08-15-preview`
{
}
```

# [Azure CLI](#tab/cli)

To specify the POST request, you can use the Azure CLI [az rest](/cli/azure/reference-index#az_rest) command.

```azurecli
az rest --method post --url https://management.azure.com/subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.HybridCompute/machines/machineName/assessPatches?api-version=2020-08-15-preview --body @body.json
```

The format of the request body for version 2020-08-15 is as follows:

```json
{
}
```

# [Azure PowerShell](#tab/powershell)

To specify the POST request, you can use the Azure PowerShell [Invoke-AzRestMethod-Path](/powershell/module/az.accounts/invoke-azrestmethod) cmdlet.

```azurepowershell
Invoke-AzRestMethod-Path
  "/subscriptions/subscriptionId/resourceGroups/resourcegroupname/providers/Microsoft.HybridCompute/machines/machinename/assessPatches?api-version=2020-08-15-preview" 
  -Payload '{}' -Method POST
```
---

## Update deployment

To trigger an update deployment to your Azure Arc-enabled server, specify the following POST request:

```rest
POST on `subscriptions/subscriptionId/resourceGroups/resourceGroupName/providers/Microsoft.HybridCompute/machines/machineName/installPatches?api-version=2020-08-15-preview`
```

#### Request body

The following table describes the elements of the request body:

| Property | Description |
|----------|-------------|
| `maximumDuration` | Maximum amount of time in minutes the OS update operation can take. It must be an ISO 8601-compliant duration string such as `PT100M`. |
| `rebootSetting` | Flag to state if you should reboot the machine and if the Guest OS update installation needs it for completion. Acceptable values are: `IfRequired, NeverReboot, AlwaysReboot`. |
| `windowsParameters` | Parameter options for Guest OS update on machine running a supported Microsoft Windows Server operating system. |
| `windowsParameters - classificationsToInclude` | List of categories or classifications of OS updates to apply, as supported and provided by Windows Server OS. Acceptable values are: `Critical, Security, UpdateRollup, FeaturePack, ServicePack, Definition, Tools, Update` |
| `windowsParameters - kbNumbersToInclude` | List of Windows Update KB IDs that are available to the machine and that you need install. If you've included any 'classificationsToInclude', the KBs available in the category are installed. 'kbNumbersToInclude' is an option to provide list of specific KB IDs over and above that you want to get installed. For example: `1234`  |
| `windowsParameters - kbNumbersToExclude` | List of Windows Update KB Ids that are available to the machine and that should **not** be installed. If you've included any 'classificationsToInclude', the KBs available in the category will be installed. 'kbNumbersToExclude' is an option to provide list of specific KB IDs that you want to ensure don't get installed. For example: `5678`  |
| `maxPatchPublishDate` | This is used to install patches that were published on or before this given max published date.| 
| `linuxParameters` | Parameter options for Guest OS update when machine is running supported Linux distribution |
| `linuxParameters - classificationsToInclude` | List of categories or classifications of OS updates to apply, as supported & provided by Linux OS's package manager used. Acceptable values are: `Critical, Security, Others`. For more information, see [Linux package manager and OS support](support-matrix-updates.md#azure-marketplacepir-images). |
| `linuxParameters - packageNameMasksToInclude` | List of Linux packages that are available to the machine and need to be installed. If you've included any 'classificationsToInclude', the packages available in the category will be installed. 'packageNameMasksToInclude' is an option to provide list of packages over and above that you want to get installed. For example: `mysql, libc=1.0.1.1, kernel*` |
| `linuxParameters - packageNameMasksToExclude` | List of Linux packages that are available to the machine and should **not** be installed. If you've included any 'classificationsToInclude', the packages available in the category will be installed. 'packageNameMasksToExclude' is an option to provide list of specific packages that you want to ensure don't get installed. For example: `mysql, libc=1.0.1.1, kernel*` |


# [Azure REST API](#tab/rest)

To specify the POST request, you can use the following Azure REST API call with valid parameters and values. 

```rest
POST on 'subscriptions/subscriptionI/resourceGroups/resourceGroupName/providers/Microsoft.HybridCompute/machines/machineName/installPatches?api-version=2020-08-15-preview

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

To specify the POST request, you can use the Azure CLI [az rest](/cli/azure/reference-index#az_rest) command.

```azurecli
az rest --method post --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/Test/providers/Microsoft.HybridCompute/machines/WIN-8/installPatches?api-version=2020-08-15-preview @body.json
```

The format of the request body for version 2020-08-15 is as follows:

```json
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
  }
```

# [Azure PowerShell](#tab/azurepowershell)

To specify the POST request, you can use the Azure PowerShell [Invoke-AzRestMethod](/powershell/module/az.accounts/invoke-azrestmethod) cmdlet.

```azurepowershell
Invoke-AzRestMethod
-Path "/subscriptions/subscriptionId/resourceGroups/resourcegroupname/providers/Microsoft.HybridCompute/machines/machinename/installPatches?api-version=2020-08-15-preview"
-Payload '{      
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
  -Method POST
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
| `properties.maintenanceWindow.duration` | Duration of the maintenance window in HH:mm format. If not provided, default value will be used based on maintenance scope provided. Example: 05:00. |
| `properties.maintenanceWindow.expirationDateTime` | Effective expiration date of the maintenance window in YYYY-MM-DD hh:MM format. The window is created in the time zone provided to daylight savings according to that time zone. You must set the expiration date to a future date. If not provided, it will be set to the maximum datetime 9999-12-31 23:59:59. |
| `properties.maintenanceWindow.recurEvery` | Rate at which a Maintenance window is expected to recur. The rate can be expressed as daily, weekly, or monthly schedules. You can format daily schedules as recurEvery: [Frequency as integer]['Day(s)']. If no frequency is provided, the default frequency is 1. Daily schedule examples are recurEvery: Day, recurEvery: 3Days. Weekly schedules are formatted as recurEvery: [Frequency as integer]['Week(s)'] [Optional comma separated list of weekdays Monday-Sunday]. Weekly schedule examples are recurEvery: 3Weeks, recurEvery: Week Saturday, Sunday. You can format monthly schedules as [Frequency as integer]['Month(s)'] [Comma separated list of month days] or [Frequency as integer]['Month(s)'] [Week of Month (First, Second, Third, Fourth, Last)] [Weekday Monday-Sunday]. Monthly schedule examples are recurEvery: Month, recurEvery: 2Months, recurEvery: Month day23, day24, recurEvery: Month Last Sunday, recurEvery: Month Fourth Monday. |
| `properties.maintenanceWindow.startDateTime` | 	Effective start date of the maintenance window in YYYY-MM-DD hh:mm format. You can set the start date to either the current date or future date. The window will be created in the time zone provided and adjusted to daylight savings according to that time zone. |
| `properties.maintenanceWindow.timeZone` |	Name of the timezone. You can obtain the list of timezones by executing [System.TimeZoneInfo]:GetSystemTimeZones() in PowerShell. Example: Pacific Standard Time, UTC, W. Europe Standard Time, Korea Standard Time, Cen. Australia Standard Time. |
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

To remove a machine from the schedule, get all the configuration assignment names for the machine that you have created to associate the machine with the current schedule from the Azure Resource Graph as listed:

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
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) Update Manager.

---
title: Monitor application performance hosted on Azure VM and Azure VMSS | Microsoft Docs
description: Application performance monitoring for Azure VM and Azure VMSS. Chart load and response time, dependency information, and set alerts on performance.
services: application-insights
documentationcenter: .net
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.topic: conceptual
ms.date: 06/27/2019
ms.author: mbullwin

---
# Monitor application performance hosted on Azure VM and Azure VMSS

Enabling monitoring on your .NET and .NET Core based web applications running on [Azure Virtual Machines](https://azure.microsoft.com/en-us/services/virtual-machines/) and [Azure Virtual Machine Scale Sets](https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/) is now easier than ever. Get all the benefits of using Application Insights without modifying your code.

This article will walk you through enabling Application Insights monitoring using ApplicationMonitoringWindows extension as well as provide preliminary guidance for automating the process for large-scale deployments.

> [!IMPORTANT]
> Azure ApplicationMonitoringWindows extension is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Enable Application Insights

There are two ways to enable application monitoring for Azure VM and Azure VMSS hosted applications:

* **Agent-based application monitoring** (ApplicationMonitoringWindows extension).
    * This method is the easiest to enable, and no advanced configuration is required. It is often referred to as "runtime" monitoring. For Azure App Services we recommend at a minimum enabling this level of monitoring, and then based on your specific scenario you can evaluate whether more advanced monitoring through manual instrumentation is needed.
    * Currently only .Net IIS-hosted applications are supported.

* **Manually instrumenting the application through code** by installing the Application Insights SDK.

    * This approach is much more customizable, but it requires [adding a dependency on the Application Insights SDK NuGet packages](https://docs.microsoft.com/azure/azure-monitor/app/asp-net). This method, also means you have to manage the updates to the latest version of the packages yourself.

    * If you need to make custom API calls to track events/dependencies not captured by default with agent-based monitoring, you would need to use this method. Check out the [API for custom events and metrics article](https://docs.microsoft.com/azure/azure-monitor/app/api-custom-events-metrics) to learn more.

> [!NOTE]
> If both agent based monitoring and manual SDK based instrumentation is detected only the manual instrumentation settings will be honored. This is to prevent duplicate data from sent. To learn more about this check out the [troubleshooting section](https://docs.microsoft.com/azure/azure-monitor/app/azure-vm-apps#troubleshooting) below.

## Manage agent-based monitoring for .NET applications on VM using powershell

Install or update the application monitoring extension for VM
```powershell
$publicCfgJsonString = '
{
  "RedfieldConfiguration": {
    "InstrumentationKeyMap": {
      "Filters": [
        {
          "AppFilter": ".*",
          "MachineFilter": ".*",
          "InstrumentationSettings" : {
            "InstrumentationKey": "c65e7690-a7fa-473c-ad41-5f1a26d9c3b0"
          }
        }
      ]
    }
  }
}
';
$privateCfgJsonString = '{}';

Set-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Location "South Central US" -Name "ApplicationMonitoring" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -SettingString $publicCfgJsonString -ProtectedSettingString $privateCfgJsonString
```

Unistall application monitoring extension from VM
```powershell
Remove-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name "ApplicationMonitoring"
```

Query application monitoring extension status for VM
```powershell
Get-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name ApplicationMonitoring -Status
```

Get list of installed extensions for VM
```powershell
Get-AzResource -ResourceId "/subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions"

# Name              : ApplicationMonitoring
# ResourceGroupName : <myVmResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachines/extensions
# Location          : southcentralus
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions/ApplicationMonitoring
```

## Manage agent-based monitoring for .NET applications on VMSS using powershell

Install or update the application monitoring extension for VMSS
```powershell
$publicCfgHashtable =
@{
  "RedfieldConfiguration"= @{
    "InstrumentationKeyMap"= @{
      "Filters"= @(
        @{
          "AppFilter"= ".*";
          "MachineFilter"= ".*";
          "InstrumentationSettings"= @{
            "InstrumentationKey"= "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"; # Application Insights Instrumentation Key, create new Application Insights resource if you don't have one. https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/microsoft.insights%2Fcomponents
          }
        }
      )
    }
  }
};
$privateCfgHashtable = @{};

$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"

Add-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoring" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -TypeHandlerVersion "2.8" -Setting $publicCfgHashtable -ProtectedSetting $privateCfgHashtable

Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss

# Note: depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Unistall application monitoring extension from VMSS
```powershell
$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"

Remove-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoring"

Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss

# Note: depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Query application monitoring extension status for VMSS
```powershell
# Not supported by extensions framework
```

Get list of installed extensions for VMSS
```powershell
Get-AzResource -ResourceId /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions

# Name              : ApplicationMonitoringWindows
# ResourceGroupName : <myResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachineScaleSets/extensions
# Location          :
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions/ApplicationMonitoringWindows
```

## Troubleshooting

Below is our step-by-step troubleshooting guide for extension based monitoring for .NET based applications running on Azure VM and Azure VMSS.

> [!NOTE]
> .Net core, Java and Node.js applications are only supported on Azure VM and Azure VMSS via manual SDK based instrumentation and therefore the steps below do not apply to these scenarios.

Extension execution output is logged to files found in the following directories:
```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.ApplicationMonitoringWindows\<version>\
```

## Next steps
* Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on virtual machine scale sets.
* [Set up Availability web tests](monitor-web-app-availability.md) to be alerted if your endpoint is down.

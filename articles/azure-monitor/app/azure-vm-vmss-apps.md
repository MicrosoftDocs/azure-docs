---
title: Monitor performance on Azure VMs - Application Insights
description: Application performance monitoring for Azure Virtual Machines and Azure Virtual Machine Scale Sets. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 11/15/2022
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-azurepowershell
ms.reviewer: abinetabate
---

# Deploy Application Insights Agent on virtual machines and Virtual Machine Scale Sets

Enabling monitoring for your .NET or Java-based web applications running on [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) and [Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/index.yml) is now easier than ever. Get all the benefits of using Application Insights without modifying your code.

This article walks you through enabling Application Insights monitoring by using Application Insights Agent. It also provides preliminary guidance for automating the process for large-scale deployments.

Java-based applications running on Azure Virtual Machines and Azure Virtual Machine Scale Sets are monitored with the [Application Insights Java 3.0 agent](./java-in-process-agent.md), which is generally available.

> [!IMPORTANT]
> Application Insights Agent for ASP.NET and ASP.NET Core applications running on Azure Virtual Machines and Azure Virtual Machine Scale Sets is currently in public preview. For monitoring your ASP.NET applications running on-premises, use [Application Insights Agent for on-premises servers](./status-monitor-v2-overview.md), which is generally available and fully supported.
>
> The preview version for Azure Virtual Machines and Azure Virtual Machine Scale Sets is provided without a service-level agreement. We don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Enable Application Insights

Auto-instrumentation is easy to enable. Advanced configuration isn't required.

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> Auto-instrumentation is available for ASP.NET, ASP.NET Core IIS-hosted applications, and Java. Use an SDK to instrument Node.js and Python applications hosted on Azure Virtual Machines and Azure Virtual Machine Scale Sets.

### [.NET Framework](#tab/net)

The Application Insights Agent autocollects the same dependency signals out-of-the-box as the SDK. To learn more, see [Dependency autocollection](asp-net-dependencies.md#net).

### [.NET Core/.NET](#tab/core)

The Application Insights Agent autocollects the same dependency signals out-of-the-box as the SDK. To learn more, see [Dependency autocollection](asp-net-dependencies.md#net).

### [Java](#tab/Java)

We recommend [Application Insights Java 3.0 agent](./java-in-process-agent.md) for Java. The most popular libraries, frameworks, logs, and dependencies are [autocollected](./java-in-process-agent.md#autocollected-requests) along with many [other configurations](./java-standalone-config.md).

### [Node.js](#tab/nodejs)

To instrument your Node.js application, use the [SDK](./nodejs.md).

### [Python](#tab/python)

To monitor Python apps, use the [SDK](./opencensus-python.md).

---

## Manage Application Insights Agent for .NET applications on virtual machines by using PowerShell

Before you install Application Insights Agent, you'll need a connection string. [Create a new Application Insights resource](./create-new-resource.md) or copy the connection string from an existing Application Insights resource.

> [!NOTE]
> If you're new to PowerShell, see the [Get Started Guide](/powershell/azure/get-started-azureps).

Install or update Application Insights Agent as an extension for virtual machines:

```powershell
$publicCfgJsonString = '
{
  "redfieldConfiguration": {
    "instrumentationKeyMap": {
      "filters": [
        {
          "appFilter": ".*",
          "machineFilter": ".*",
          "virtualPathFilter": ".*",
          "instrumentationSettings" : {
            "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/" # Application Insights connection string, create new Application Insights resource if you don't have one. https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/microsoft.insights%2Fcomponents
          }
        }
      ]
    }
  }
}
';
$privateCfgJsonString = '{}';

Set-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Location "<myVmLocation>" -Name "ApplicationMonitoring" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -Version "2.8" -SettingString $publicCfgJsonString -ProtectedSettingString $privateCfgJsonString
```

> [!NOTE]
> You can install or update Application Insights Agent as an extension across multiple virtual machines at scale by using a PowerShell loop.

Uninstall Application Insights Agent extension from a virtual machine:

```powershell
Remove-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name "ApplicationMonitoring"
```

Query Application Insights Agent extension status for a virtual machine:

```powershell
Get-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name ApplicationMonitoring -Status
```

Get a list of installed extensions for a virtual machine:

```powershell
Get-AzResource -ResourceId "/subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions"

# Name              : ApplicationMonitoring
# ResourceGroupName : <myVmResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachines/extensions
# Location          : southcentralus
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions/ApplicationMonitoring
```

You can also view installed extensions in the [Azure Virtual Machine section](../../virtual-machines/extensions/overview.md) of the Azure portal.

> [!NOTE]
> Verify installation by selecting **Live Metrics Stream** within the Application Insights resource associated with the connection string you used to deploy the Application Insights Agent extension. If you're sending data from multiple virtual machines, select the target virtual machines under **Server Name**. It might take up to a minute for data to begin flowing.

## Manage Application Insights Agent for .NET applications on Virtual Machine Scale Sets by using PowerShell

Install or update Application Insights Agent as an extension for a Virtual Machine Scale Set:

```powershell
$publicCfgHashtable =
@{
  "redfieldConfiguration"= @{
    "instrumentationKeyMap"= @{
      "filters"= @(
        @{
          "appFilter"= ".*";
          "machineFilter"= ".*";
          "virtualPathFilter"= ".*";
          "instrumentationSettings" = @{
            "connectionString"= "InstrumentationKey=00000000-0000-0000-0000-000000000000;IngestionEndpoint=https://xxxx.applicationinsights.azure.com/" # Application Insights connection string, create new Application Insights resource if you don't have one. https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/microsoft.insights%2Fcomponents
          }
        }
      )
    }
  }
};
$privateCfgHashtable = @{};

$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"

Add-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoringWindows" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -TypeHandlerVersion "2.8" -Setting $publicCfgHashtable -ProtectedSetting $privateCfgHashtable

Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss

# Note: Depending on your update policy, you might need to run Update-AzVmssInstance for each instance.
```

Uninstall the application monitoring extension from Virtual Machine Scale Sets:

```powershell
$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"

Remove-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoring"

Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss

# Note: Depending on your update policy, you might need to run Update-AzVmssInstance for each instance.
```

Query the application monitoring extension status for Virtual Machine Scale Sets:

```powershell
# Not supported by extensions framework
```

Get a list of installed extensions for Virtual Machine Scale Sets:

```powershell
Get-AzResource -ResourceId /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions

# Name              : ApplicationMonitoringWindows
# ResourceGroupName : <myResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachineScaleSets/extensions
# Location          :
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions/ApplicationMonitoringWindows
```

## Troubleshooting

Find troubleshooting tips for the Application Insights Monitoring Agent extension for .NET applications running on Azure virtual machines and Virtual Machine Scale Sets.

> [!NOTE]
> The following steps don't apply to Node.js and Python applications, which require SDK instrumentation.

Extension execution output is logged to files found in the following directories:

```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.ApplicationMonitoringWindows\<version>\
```

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Release notes

### 2.8.44

- Updated Application Insights .NET/.NET Core SDK to 2.20.1 - red field
- Enabled SQL query collection
- Enabled support for Azure Active Directory authentication

### 2.8.42

Updated Application Insights .NET/.NET Core SDK to 2.18.1 - red field

### 2.8.41

Added ASP.NET Core auto-instrumentation feature

## Next steps

* Learn how to [deploy an application to a Virtual Machine Scale Set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-deploy-app.md).
* [Set up availability web tests](monitor-web-app-availability.md) to be alerted if your endpoint is down.

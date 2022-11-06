---
title: Monitor performance on Azure VMs - Azure Application Insights
description: Application performance monitoring for Azure VM and Azure virtual machine scale sets. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 10/31/2022
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-azurepowershell
ms.reviewer: abinetabate
---

# Deploy the Azure Monitor Application Insights Agent on Azure virtual machines and Azure virtual machine scale sets

Enabling monitoring for your .NET or Java based web applications running on [Azure virtual machines](https://azure.microsoft.com/services/virtual-machines/) and [Azure virtual machine scale sets](../../virtual-machine-scale-sets/index.yml) is now easier than ever. Get all the benefits of using Application Insights without modifying your code.

This article walks you through enabling Application Insights monitoring using the Application Insights Agent and provides preliminary guidance for automating the process for large-scale deployments.
> [!IMPORTANT]
> **Java** based applications running on Azure VMs and VMSS are monitored with the **[Application Insights Java 3.0 agent](./java-in-process-agent.md)**, which is generally available.

> [!IMPORTANT]
> Azure Application Insights Agent for ASP.NET and ASP.NET Core applications running on **Azure VMs and VMSS** is currently in public preview. For monitoring your ASP.NET  applications running **on-premises**, use the [Azure Application Insights Agent for on-premises servers](./status-monitor-v2-overview.md), which is generally available and fully supported.
> The preview version for Azure VMs and VMSS is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Enable Application Insights

Auto-instrumentation is easy to enable with no advanced configuration required.

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> Auto-instrumentation is available for ASP.NET, ASP.NET Core IIS-hosted applications and Java. Use an SDK to instrument Node.js and Python applications hosted on an Azure virtual machines and virtual machine scale sets.

### [.NET Framework](#tab/net)

The Application Insights Agent auto-collects the same dependency signals out-of-the-box as the SDK. See [Dependency auto-collection](./auto-collect-dependencies.md#net) to learn more.

### [.NET Core / .NET](#tab/core)

The Application Insights Agent auto-collects the same dependency signals out-of-the-box as the SDK. See [Dependency auto-collection](./auto-collect-dependencies.md#net) to learn more.

### [Java](#tab/Java)

For Java, **[Application Insights Java 3.0 agent](./java-in-process-agent.md)** is the recommended approach. The most popular libraries and frameworks, as well as logs and dependencies are [auto-collected](./java-in-process-agent.md#autocollected-requests), with a multitude of [other configurations](./java-standalone-config.md)

### [Node.js](#tab/nodejs)

To instrument your Node.js application, use the [SDK](./nodejs.md).

### [Python](#tab/python)

To monitor Python apps, use the [SDK](./opencensus-python.md).

---

## Manage Application Insights Agent for .NET applications on Azure virtual machines using PowerShell

> [!NOTE]
> Before installing the Application Insights Agent, you'll need a connection string. [Create a new Application Insights Resource](./create-new-resource.md) or copy the connection string from an existing application insights resource.

> [!NOTE]
> New to PowerShell? Check out the [Get Started Guide](/powershell/azure/get-started-azureps).

Install or update the Application Insights Agent as an extension for Azure virtual machines
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
> You may install or update the Application Insights Agent as an extension across multiple Virtual Machines at-scale using a PowerShell loop.

Uninstall Application Insights Agent extension from Azure virtual machine
```powershell
Remove-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name "ApplicationMonitoring"
```

Query Application Insights Agent extension status for Azure virtual machine
```powershell
Get-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name ApplicationMonitoring -Status
```

Get list of installed extensions for Azure virtual machine
```powershell
Get-AzResource -ResourceId "/subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions"

# Name              : ApplicationMonitoring
# ResourceGroupName : <myVmResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachines/extensions
# Location          : southcentralus
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions/ApplicationMonitoring
```
You may also view installed extensions in the [Azure virtual machine section](../../virtual-machines/extensions/overview.md) in the Portal.

> [!NOTE]
> Verify installation by clicking on Live Metrics Stream within the Application Insights Resource associated with the connection string you used to deploy the Application Insights Agent Extension. If you are sending data from multiple Virtual Machines, select the target Azure virtual machines under Server Name. It may take up to a minute for data to begin flowing.

## Manage Application Insights Agent for .NET applications on Azure virtual machine scale sets using PowerShell

Install or update the Application Insights Agent as an extension for Azure virtual machine scale set
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

# Note: depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Uninstall application monitoring extension from Azure virtual machine scale sets
```powershell
$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"

Remove-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoring"

Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss

# Note: depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Query application monitoring extension status for Azure virtual machine scale sets
```powershell
# Not supported by extensions framework
```

Get list of installed extensions for Azure virtual machine scale sets
```powershell
Get-AzResource -ResourceId /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions

# Name              : ApplicationMonitoringWindows
# ResourceGroupName : <myResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachineScaleSets/extensions
# Location          :
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions/ApplicationMonitoringWindows
```

## Troubleshooting

Find troubleshooting tips for Application Insights Monitoring Agent Extension for .NET applications running on Azure virtual machines and virtual machine scale sets.

> [!NOTE]
> The steps below do not apply to Node.js and Python applications, which require SDK instrumentation.

Extension execution output is logged to files found in the following directories:
```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.ApplicationMonitoringWindows\<version>\
```

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Release notes

### 2.8.44

- Updated ApplicationInsights .NET/.NET Core SDK to 2.20.1 - red field.
- Enabled SQL query collection.
- Enabled support for Azure Active Directory authentication.

### 2.8.42

- Updated ApplicationInsights .NET/.NET Core SDK to 2.18.1 - red field.

### 2.8.41

- Added ASP.NET Core Auto-Instrumentation feature.

## Next steps
* Learn how to [deploy an application to an Azure virtual machine scale set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-deploy-app.md).
* [Set up Availability web tests](monitor-web-app-availability.md) to be alerted if your endpoint is down.

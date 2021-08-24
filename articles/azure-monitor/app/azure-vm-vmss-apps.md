---
title: Monitor performance on Azure VMs - Azure Application Insights
description: Application performance monitoring for Azure VM and Azure virtual machine scale sets. Chart load and response time, dependency information, and set alerts on performance.
ms.topic: conceptual
ms.date: 08/26/2019 
ms.custom: devx-track-azurepowershell

---

# Deploy the Azure Monitor Application Insights Agent on Azure virtual machines and Azure virtual machine scale sets

Enabling monitoring for your .NET or Java based web applications running on [Azure virtual machines](https://azure.microsoft.com/services/virtual-machines/) and [Azure virtual machine scale sets](../../virtual-machine-scale-sets/index.yml) is now easier than ever. Get all the benefits of using Application Insights without modifying your code.

This article walks you through enabling Application Insights monitoring using the Application Insights Agent and provides preliminary guidance for automating the process for large-scale deployments.
> [!IMPORTANT]
> **Java** based applications running on Azure VMs and VMSS are monitored with **[Application Insights Java 3.0 agent](./java-in-process-agent.md)**, which is generally available.

> [!IMPORTANT]
> Azure Application Insights Agent for ASP.NET and ASP.NET Core applications running on **Azure VMs and VMSS** is currently in public preview. For monitoring your ASP.NET  applications running **on-premises**, use the [Azure Application Insights Agent for on-premises servers](./status-monitor-v2-overview.md), which is generally available and fully supported.
> The preview version for Azure VMs and VMSS is provided without a service-level agreement, and we don't recommend it for production workloads. Some features might not be supported, and some might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Enable Application Insights

There are two ways to enable application monitoring for Azure virtual machines and Azure virtual machine scale sets hosted applications:

### Auto-instrumentation via Application Insights Agent

* This method is the easiest to enable, and no advanced configuration is required. It is often referred to as "runtime" monitoring.

* For Azure virtual machines and Azure virtual machine scale sets we recommend at a minimum enabling this level of monitoring. After that, based on your specific scenario, you can evaluate whether manual instrumentation is needed.

> [!NOTE]
> Auto-instrumentation is currently only available for ASP.NET, ASP.NET Core IIS-hosted applications and Java. Use an SDK to instrument Node.js and Python applications hosted on an Azure virtual machines and virtual machine scale sets.


#### ASP.NET / ASP.NET Core

  * The Application Insights Agent auto-collects the same dependency signals out-of-the-box as the .NET SDK. See [Dependency auto-collection](./auto-collect-dependencies.md#net) to learn more.
        
#### Java
  * For Java, **[Application Insights Java 3.0 agent](./java-in-process-agent.md)** is the recommended approach. The most popular libraries and frameworks, as well as logs and dependencies are [auto-collected](./java-in-process-agent.md#auto-collected-requests), with a multitude of [additional configurations](./java-standalone-config.md)

### Code-based via SDK
    
#### ASP.NET / ASP.NET Core
  * For .NET apps, this approach is much more customizable, but it requires [adding a dependency on the Application Insights SDK NuGet packages](./asp-net.md). This method, also means you have to manage the updates to the latest version of the packages yourself.

  * If you need to make custom API calls to track events/dependencies not captured by default with agent-based monitoring, you would need to use this method. Check out the [API for custom events and metrics article](./api-custom-events-metrics.md) to learn more.

    > [!NOTE]
    > For .NET apps only - if both agent based monitoring and manual SDK based instrumentation is detected only the manual instrumentation settings will be honored. This is to prevent duplicate data from being sent. To learn more about this check out the [troubleshooting section](#troubleshooting) below.

#### Java 

If you need additional custom telemetry for Java applications, see what [is available](./java-in-process-agent.md#send-custom-telemetry-from-your-application), add [custom dimensions](./java-standalone-config.md#custom-dimensions), or use [telemetry processors](./java-standalone-telemetry-processors.md). 

#### Node.js

To instrument your Node.js application, use the [SDK](./nodejs.md).

#### Python

To monitor Python apps, use the [SDK](./opencensus-python.md).

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
            "connectionString": "InstrumentationKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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
You may also view installed extensions in the [Azure virtual machine blade](../../virtual-machines/extensions/overview.md) in the Portal.

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
          "virtualPathFilter": ".*",
          "instrumentationSettings" : {
            "connectionString": "InstrumentationKey=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" # Application Insights connection string, create new Application Insights resource if you don't have one. https://ms.portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/microsoft.insights%2Fcomponents
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
> .NET Core, Node.js, and Python applications are only supported on Azure virtual machines and Azure virtual machine scale sets via manual SDK based instrumentation and therefore the steps below do not apply to these scenarios.

Extension execution output is logged to files found in the following directories:
```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.ApplicationMonitoringWindows\<version>\
```

## Next steps
* Learn how to [deploy an application to an Azure virtual machine scale set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-deploy-app.md).
* [Set up Availability web tests](monitor-web-app-availability.md) to be alerted if your endpoint is down.

---
title: Monitor performance on Azure VMs - Azure Application Insights
description: Application performance monitoring for Azure virtual machines and virtual machine scale sets.
ms.topic: conceptual
ms.date: 03/22/2023
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-azurepowershell
ms.reviewer: abinetabate
---

# Application Insights for Azure VMs and virtual machine scale sets

Enabling monitoring for your ASP.NET and ASP.NET Core IIS-hosted applications running on [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/) or [Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/index.yml) is now easier than ever. Get all the benefits of using Application Insights without modifying your code.

This article walks you through enabling Application Insights monitoring by using the Application Insights Agent. It also provides preliminary guidance for automating the process for large-scale deployments.

## Enable Application Insights

Autoinstrumentation is easy to enable. Advanced configuration isn't required.

For a complete list of supported autoinstrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> Autoinstrumentation is available for ASP.NET, ASP.NET Core IIS-hosted applications, and Java. Use an SDK to instrument Node.js and Python applications hosted on Azure virtual machines and virtual machine scale sets.

### [.NET Framework](#tab/net)

The Application Insights Agent autocollects the same dependency signals out of the box as the SDK. To learn more, see [Dependency autocollection](./auto-collect-dependencies.md#net).

### [.NET Core / .NET](#tab/core)

The Application Insights Agent autocollects the same dependency signals out of the box as the SDK. To learn more, see [Dependency autocollection](./auto-collect-dependencies.md#net).

### [Java](#tab/Java)

We recommend the [Application Insights Java 3.0 agent](./opentelemetry-enable.md?tabs=java) for Java. The most popular libraries, frameworks, logs, and dependencies are [autocollected](./java-in-process-agent.md#autocollected-requests), along with many [other configurations](./java-standalone-config.md).

### [Node.js](#tab/nodejs)

To instrument your Node.js application, use the [SDK](./nodejs.md).

### [Python](#tab/python)

To monitor Python apps, use the [SDK](/previous-versions/azure/azure-monitor/app/opencensus-python).

---

Before you install the Application Insights Agent extension, you'll need a connection string. [Create a new Application Insights resource](./create-workspace-resource.md) or copy the connection string from an existing Application Insights resource.

### Enable monitoring for virtual machines

You can use the Azure portal or PowerShell to enable monitoring for VMs.

#### Azure portal
1. In the Azure portal, go to your Application Insights resource. Copy your connection string to the clipboard.

   :::image type="content"source="./media/azure-vm-vmss-apps/connect-string.png" alt-text="Screenshot that shows the connection string." lightbox="./media/azure-vm-vmss-apps/connect-string.png":::

1. Go to your virtual machine. Under the **Settings** section in the menu on the left side, select **Extensions + applications** > **Add**.

   :::image type="content"source="./media/azure-vm-vmss-apps/add-extension.png" alt-text="Screenshot that shows the Extensions + applications pane with the Add button." lightbox="media/azure-vm-vmss-apps/add-extension.png":::

1. Select **Application Insights Agent** > **Next**.

   :::image type="content"source="./media/azure-vm-vmss-apps/select-extension.png" alt-text="Screenshot that shows the Install an Extension pane with the Next button." lightbox="media/azure-vm-vmss-apps/select-extension.png":::

1. Paste the connection string you copied in step 1 and select **Review + create**.

    :::image type="content"source="./media/azure-vm-vmss-apps/install-extension.png" alt-text="Screenshot that shows the Create tab with the Review + create button." lightbox="media/azure-vm-vmss-apps/install-extension.png":::

#### PowerShell

> [!NOTE]
> Are you new to PowerShell? Check out the [Get started guide](/powershell/azure/get-started-azureps).

Install or update the Application Insights Agent as an extension for Azure virtual machines:

```powershell
# define variables to match your environment before running
$ResourceGroup = "<myVmResourceGroup>"
$VMName = "<myVmName>"
$Location = "<myVmLocation>"
$ConnectionString = "<myAppInsightsResourceConnectionString>"

$publicCfgJsonString = @"
{
    "redfieldConfiguration": {
        "instrumentationKeyMap": {
        "filters": [
            {
            "appFilter": ".*",
            "machineFilter": ".*",
            "virtualPathFilter": ".*",
            "instrumentationSettings" : {
                "connectionString": "$ConnectionString"
            }
            }
        ]
        }
    }
    }
"@

$privateCfgJsonString = '{}'
	
Set-AzVMExtension -ResourceGroupName $ResourceGroup -VMName $VMName -Location $Location -Name "ApplicationMonitoringWindows" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -Version "2.8" -SettingString $publicCfgJsonString -ProtectedSettingString $privateCfgJsonString

```
> [!NOTE]
> For more complicated at-scale deployments, you can use a PowerShell loop to install or update the Application Insights Agent extension across multiple VMs.

Query the Application Insights Agent extension status for Azure virtual machines:

```powershell
Get-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name ApplicationMonitoringWindows -Status
```

Get a list of installed extensions for Azure virtual machines:

```powershell
Get-AzResource -ResourceId "/subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions"
```

Uninstall the Application Insights Agent extension from Azure virtual machines:

```powershell
Remove-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name "ApplicationMonitoring"
```

> [!NOTE]
> Verify installation by selecting **Live Metrics Stream** within the Application Insights resource associated with the connection string you used to deploy the Application Insights Agent extension. If you're sending data from multiple virtual machines, select the target Azure virtual machines under **Server Name**. It might take up to a minute for data to begin flowing.

## Enable monitoring for virtual machine scale sets

You can use the Azure portal or PowerShell to enable monitoring for virtual machine scale sets.

#### Azure portal
Follow the prior steps for VMs, but go to your virtual machine scale sets instead of your VM.

#### PowerShell
Install or update Application Insights Agent as an extension for virtual machine scale sets:

```powershell
# Set resource group, vmss name, and connection string to reflect your environment
$ResourceGroup = "<myVmResourceGroup>"
$VMSSName = "<myVmName>"
$ConnectionString = "<myAppInsightsResourceConnectionString>"
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
            "connectionString"= "$ConnectionString"
          }
        }
      )
    }
  }
};
$privateCfgHashtable = @{};
$vmss = Get-AzVmss -ResourceGroupName $ResourceGroup -VMScaleSetName $VMSSName
Add-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoringWindows" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -TypeHandlerVersion "2.8" -Setting $publicCfgHashtable -ProtectedSetting $privateCfgHashtable
Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss
# Note: Depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Get a list of installed extensions for virtual machine scale sets:

```powershell
Get-AzResource -ResourceId "/subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions"
```

Uninstall the application monitoring extension from virtual machine scale sets:

```powershell
# set resource group and vmss name to reflect your environment
$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"
Remove-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoringWindows"
Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss
# Note: Depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

## Troubleshooting

Find troubleshooting tips for the Application Insights Monitoring Agent extension for .NET applications running on Azure virtual machines and virtual machine scale sets.

If you're having trouble deploying the extension, review the execution output that's logged to files found in the following directories:

```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.ApplicationMonitoringWindows\<version>\
```

If your extension deployed successfully but you're unable to see telemetry, it could be one of the following issues covered in [Agent troubleshooting](/troubleshoot/azure/azure-monitor/app-insights/status-monitor-v2-troubleshoot#known-issues):

- Conflicting DLLs in an app's bin directory
- Conflict with IIS shared configuration

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Release notes

### 2.8.44

- Updated Application Insights .NET/.NET Core SDK to 2.20.1 - red field.
- Enabled SQL query collection.
- Enabled support for Microsoft Entra authentication.

### 2.8.42

Updated Application Insights .NET/.NET Core SDK to 2.18.1 - red field.

### 2.8.41

Added the ASP.NET Core autoinstrumentation feature.

## Next steps
* Learn how to [deploy an application to an Azure virtual machine scale set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-deploy-app.md).
* [Availability overview](availability-overview.md)

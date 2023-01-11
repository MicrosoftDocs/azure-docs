---
title: Monitor performance on Azure VMs - Azure Application Insights
description: Application performance monitoring for Azure Virtual Machine and Azure Virtual Machine Scale Sets.
ms.topic: conceptual
ms.date: 01/11/2023
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-azurepowershell
ms.reviewer: abinetabate
---

# Application Insights for Azure VMs and Virtual Machine Scale Sets

Enabling monitoring for your ASP.NET and ASP.NET Core IIS-hosted applications running on [Azure virtual machines](https://azure.microsoft.com/services/virtual-machines/) or [Azure Virtual Machine Scale Sets](../../virtual-machine-scale-sets/index.yml) is now easier than ever. Get all the benefits of using Application Insights without modifying your code.

This article walks you through enabling Application Insights monitoring using the Application Insights Agent and provides preliminary guidance for automating the process for large-scale deployments.

## Enable Application Insights

Auto-instrumentation is easy to enable. Advanced configuration isn't required.

For a complete list of supported auto-instrumentation scenarios, see [Supported environments, languages, and resource providers](codeless-overview.md#supported-environments-languages-and-resource-providers).

> [!NOTE]
> Auto-instrumentation is available for ASP.NET, ASP.NET Core IIS-hosted applications and Java. Use an SDK to instrument Node.js and Python applications hosted on an Azure virtual machines and Virtual Machine Scale Sets.
### [.NET Framework](#tab/net)

The Application Insights Agent auto-collects the same dependency signals out-of-the-box as the SDK. See [Dependency auto-collection](./auto-collect-dependencies.md#net) to learn more.

### [.NET Core / .NET](#tab/core)

The Application Insights Agent auto-collects the same dependency signals out-of-the-box as the SDK. See [Dependency auto-collection](./auto-collect-dependencies.md#net) to learn more.

### [Java](#tab/Java)

We recommend [Application Insights Java 3.0 agent](./java-in-process-agent.md) for Java. The most popular libraries, frameworks, logs, and dependencies are [auto-collected](./java-in-process-agent.md#autocollected-requests), with a multitude of [other configurations](./java-standalone-config.md)

### [Node.js](#tab/nodejs)

To instrument your Node.js application, use the [SDK](./nodejs.md).

### [Python](#tab/python)

To monitor Python apps, use the [SDK](./opencensus-python.md).

---

## Manage Application Insights Agent for .NET applications on Azure virtual machines by using PowerShell

> Before installing the Application Insights Agent, you'll need a connection string. [Create a new Application Insights Resource](./create-workspace-resource.md) or copy the connection string from an existing application insights resource.
### Enable Monitoring for Virtual Machines
### Method 1 - Azure portal / GUI
1. Go to Azure portal and navigate to your Application Insights resource and copy your connection string to the clipboard.

   :::image type="content"source="./media/azure-vm-vmss-apps/connectstring.png" alt-text=" Screenshot of Application Insights tab with enable selected."::: 

2. Navigate to your virtual machine, open the "Extensions + applications" pane under the "Settings" section in the left side navigation menu, and select "+ Add"

   :::image type="content"source="./media/azure-vm-vmss-apps/addextension.png" alt-text=" Screenshot of Application Insights tab with enable selected."::: 

3. Select the "Application Insights Agent" card, and select "Next"

   :::image type="content"source="./media/azure-vm-vmss-apps/selectextension.png" alt-text=" Screenshot of Application Insights tab with enable selected."::: 

4. Paste the connection string you copied at step 1 and select "Review + Create"

    :::image type="content"source="./media/azure-vm-vmss-apps/installextension.png" alt-text=" Screenshot of Application Insights tab with enable selected."::: 

#### Method 2 - PowerShell

> [!NOTE]
> New to PowerShell? Check out the [Get Started Guide](/powershell/azure/get-started-azureps).
```powershell
<# define variables to match your environment #>
$ResourceGroup = "<myVmResourceGroup>"
$VMName = "<myVmName>"
$Location = "<myVmLocation>"
$ConnectionString = "<myAppInsightsResourceConnectionString>"
$publicCfgJsonString = @"
<# Install or update the Application Insights Agent as an extension for Azure virtual machines #>
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
                      "connectionString": "$ConnectionString"
                  }
              }
          ]
      }
  }
}
';
$privateCfgJsonString = '{}'
Set-AzVMExtension -ResourceGroupName $ResourceGroup -VMName $VMName -Location $Location -Name "ApplicationMonitoringWindows" -Publisher "Microsoft.Azure.Diagnostics" -Type "ApplicationMonitoringWindows" -Version "2.8" -SettingString $publicCfgJsonString -ProtectedSettingString $privateCfgJsonString
```

> [!NOTE]
> For more complicated at-scale deployments you can use a PowerShell loop to install or update the Application Insights Agent extension across multiple VMs.
Query Application Insights Agent extension status for Azure Virtual Machine
```powershell
Get-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name ApplicationMonitoringWindows -Status
```

Get list of installed extensions for Azure Virtual Machine
```powershell
Get-AzResource -ResourceId "/subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions"
# Name              : ApplicationMonitoring
# ResourceGroupName : <myVmResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachines/extensions
# Location          : southcentralus
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myVmResourceGroup>/providers/Microsoft.Compute/virtualMachines/<myVmName>/extensions/ApplicationMonitoring
```
Uninstall Application Insights Agent extension from Azure Virtual Machine
```powershell
Remove-AzVMExtension -ResourceGroupName "<myVmResourceGroup>" -VMName "<myVmName>" -Name "ApplicationMonitoring"
```

> [!NOTE]
> Verify installation by selecting **Live Metrics Stream** within the Application Insights resource associated with the connection string you used to deploy the Application Insights Agent extension. If you're sending data from multiple Virtual Machines, select the target Azure virtual machines under **Server Name**. It might take up to a minute for data to begin flowing.
## Enable Monitoring for Virtual Machine Scale Sets

### Method 1 - Azure portal / GUI
Follow the prior steps for VMs, but navigate to your Virtual Machine Scale Sets instead of your VM.

### Method 2 - PowerShell
Install or update the Application Insights Agent as an extension for Azure Virtual Machine Scale Set
```powershell
# set resource group, vmss name, and connection string to reflect your enivornment
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
Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss![image](https://user-images.githubusercontent.com/102200733/181638706-4897df37-9d1e-47a6-ae14-fa65f21fb20f.png)
# Note: Depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Get list of installed extensions for Azure Virtual Machine Scale Sets
```powershell
Get-AzResource -ResourceId /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions
# Name              : ApplicationMonitoringWindows
# ResourceGroupName : <myResourceGroup>
# ResourceType      : Microsoft.Compute/virtualMachineScaleSets/extensions
# Location          :
# ResourceId        : /subscriptions/<mySubscriptionId>/resourceGroups/<myResourceGroup>/providers/Microsoft.Compute/virtualMachineScaleSets/<myVmssName>/extensions/ApplicationMonitoringWindows
```

Uninstall application monitoring extension from Azure Virtual Machine Scale Sets
```powershell
# set resource group and vmss name to reflect your environment
$vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myVmssName>"
Remove-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "ApplicationMonitoringWindows"
Update-AzVmss -ResourceGroupName $vmss.ResourceGroupName -Name $vmss.Name -VirtualMachineScaleSet $vmss
# Note: Depending on your update policy, you might need to run Update-AzVmssInstance for each instance
```

Query application monitoring extension status for Azure Virtual Machine Scale Sets
```powershell
# Not supported by extensions framework
```

## Troubleshooting

Find troubleshooting tips for the Application Insights Monitoring Agent extension for .NET applications running on Azure virtual machines and Virtual Machine Scale Sets.

> [!NOTE]
> The following steps do not apply to Node.js and Python applications, which require SDK instrumentation.
If you are having trouble deploying the extension, then review execution output which is logged to files found in the following directories:
```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.Azure.Diagnostics.ApplicationMonitoringWindows\<version>\
```
If your extension has deployed successfully, but you're unable to see telemetry it could be one of the following issues
-**Conflicting DLLs in an app's bin directory (../app-insights/status-monitor-v2-troubleshoot#conflicting-dlls-in-an-apps-bin-directory)**
-**Conflict with IIS shared configuration (../app-insights/status-monitor-v2-troubleshoot##conflict-with-iis-shared-configuration)**

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Release notes

### 2.8.44

- Updated Application Insights .NET/.NET Core SDK to 2.20.1 - red field.
- Enabled SQL query collection.
- Enabled support for Azure Active Directory authentication.

### 2.8.42

- Updated ApplicationInsights .NET/.NET Core SDK to 2.18.1 - red field.

### 2.8.41

- Added ASP.NET Core auto-instrumentation feature.

## Next steps
* Learn how to [deploy an application to an Azure Virtual Machine Scale Set](../../virtual-machine-scale-sets/virtual-machine-scale-sets-deploy-app.md).
* [Set up Availability web tests](monitor-web-app-availability.md) to be alerted if your endpoint is down.
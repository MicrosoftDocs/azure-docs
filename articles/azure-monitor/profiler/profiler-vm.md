---
title: Enable Profiler for web apps on an Azure virtual machine
description: Profile web apps running on an Azure virtual machine or a virtual machine scale set by using Application Insights Profiler
ms.topic: conceptual
ms.date: 09/22/2023
ms.reviewer: charles.weininger
---

# Enable Profiler for web apps on an Azure virtual machine

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

In this article, you learn how to run Application Insights Profiler on your Azure virtual machine (VM) or Azure virtual machine scale set via three different methods:

- Visual Studio and Azure Resource Manager
- PowerShell
- Azure Resource Explorer

With any of these methods, you:

- Configure the Azure Diagnostics extension to run Profiler.
- Install the Application Insights SDK on a VM.
- Deploy your application.
- View Profiler traces via the Application Insights instance in the Azure portal.

## Prerequisites

- A functioning [ASP.NET Core application](/aspnet/core/getting-started).
- An [Application Insights resource](../app/create-workspace-resource.md).
- To review the Azure Resource Manager templates (ARM templates) for the Azure Diagnostics extension:
  - [VM](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
  - [Virtual machine scale set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)

## Add the Application Insights SDK to your application

1. Open your ASP.NET core project in Visual Studio.

1. Select **Project** > **Add Application Insights Telemetry**.

1. Select **Azure Application Insights** > **Next**.

1. Select the subscription where your Application Insights resource lives and select **Next**.

1. Select where to save the connection string and select **Next**.

1. Select **Finish**.

> [!NOTE]
> For full instructions, including how to enable Application Insights on your ASP.NET Core application without Visual Studio, see the [Application Insights for ASP.NET Core applications](../app/asp-net-core.md).

## Confirm the latest stable release of the Application Insights SDK

1. Go to **Project** > **Manage NuGet Packages**.

1. Select **Microsoft.ApplicationInsights.AspNetCore**.

1. On the side pane, select the latest version of the SDK from the dropdown.

1. Select **Update**.

   :::image type="content" source="../app/media/asp-net-core/update-nuget-package.png" alt-text="Screenshot that shows where to select the Application Insights package for update.":::

## Enable Profiler

You can enable Profiler by any of three ways:

- Within your ASP.NET Core application by using an Azure Resource Manager template and Visual Studio. **Recommended.**
- By using a PowerShell command via the Azure CLI.
- By using Azure Resource Explorer.

# [Visual Studio and ARM template](#tab/vs-arm)

### Install the Azure Diagnostics extension

1. Choose which ARM template to use:
   - [VM](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
   - [Virtual machine scale set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)

1. In the template, locate the resource of type `extension`.

1. In Visual Studio, go to the `arm.json` file in your ASP.NET Core application that was added when you installed the Application Insights SDK.

1. Add the resource type `extension` from the template to the `arm.json` file to set up a VM or virtual machine scale set with Azure Diagnostics.

1. Within the `WadCfg` tag, add your Application Insights instrumentation key to `MyApplicationInsightsProfilerSink`.

        
      ```json
      "WadCfg": {
        "SinksConfig": {
          "Sink": [
            {
              "name": "MyApplicationInsightsProfilerSink",
              "ApplicationInsightsProfiler": "YOUR_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY"
            }
          ]
        }
      }        
      ```

1. Deploy your application.

# [PowerShell](#tab/powershell)

The following PowerShell commands are an approach for existing VMs that touch only the Azure Diagnostics extension.

> [!NOTE]
> If you deploy the VM again, the sink will be lost. You need to update the config you use when you deploy the VM to preserve this setting.

### Install Application Insights via the Azure Diagnostics config

1. Export the currently deployed Azure Diagnostics config to a file:

   ```powershell
   $ConfigFilePath = [IO.Path]::GetTempFileName()
   ```

1. Add the Application Insights Profiler sink to the config returned by the following command:

   ```powershell
   (Get-AzVMDiagnosticsExtension -ResourceGroupName "YOUR_RESOURCE_GROUP" -VMName "YOUR_VM").PublicSettings | Out-File -Verbose $ConfigFilePath
   ```

   Application Insights Profiler `WadCfg`:
   
   ```json
   "WadCfg": {
     "SinksConfig": {
       "Sink": [
         {
           "name": "MyApplicationInsightsProfilerSink",
           "ApplicationInsightsProfiler": "YOUR_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY"
         }
       ]
     }
   }        
   ```
   
1. Run the following command to pass the updated config to the `Set-AzVMDiagnosticsExtension` command.

   ```powershell
   Set-AzVMDiagnosticsExtension -ResourceGroupName "YOUR_RESOURCE_GROUP" -VMName "YOUR_VM" -DiagnosticsConfigurationPath $ConfigFilePath
   ```

   > [!NOTE]
   > `Set-AzVMDiagnosticsExtension` might require the `-StorageAccountName` argument. If your original diagnostics configuration had the `storageAccountName` property in the `protectedSettings` section (which isn't downloadable), be sure to pass the same original value you had in this cmdlet call.

### IIS Http Tracing feature

If the intended application is running through [IIS](https://www.microsoft.com/web/downloads/platform.aspx), enable the `IIS Http Tracing` Windows feature:

1. Establish remote access to the environment.

1. Use the [Add Windows features](/iis/configuration/system.webserver/tracing/) window, or run the following command in PowerShell (as administrator):

    ```powershell
    Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All
    ```

    If establishing remote access is a problem, you can use the [Azure CLI](/cli/azure/get-started-with-azure-cli) to run the following command:

    ```cli
    az vm run-command invoke -g MyResourceGroupName -n MyVirtualMachineName --command-id RunPowerShellScript --scripts "Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All"
    ```

1. Deploy your application.

# [Azure Resource Explorer](#tab/azure-resource-explorer)

### Set the Profiler sink by using Azure Resource Explorer

Because the Azure portal doesn't provide a way to set the Application Insights Profiler sink, you can use [Azure Resource Explorer](https://resources.azure.com) to set the sink.

> [!NOTE]
> If you deploy the VM again, the sink will be lost. You need to update the config you use when you deploy the VM to preserve this setting.

1. Verify that the Microsoft Azure Diagnostics extension is installed by viewing the extensions installed for your virtual machine.

   :::image type="content" source="./media/profiler-vm/wad-extension.png" alt-text="Screenshot that shows checking if the WAD extension is installed.":::

1. Find the VM Diagnostics extension for your VM:
    1. Go to [Azure Resource Explorer](https://resources.azure.com).
    1. Expand **subscriptions** and find the subscription that holds the resource group with your VM.
    1. Drill down to your VM extensions by selecting your resource group. Then select **Microsoft.Compute** > **virtualMachines** > **[your virtual machine]** > **extensions**.

       :::image type="content" source="./media/profiler-vm/azure-resource-explorer.png" alt-text="Screenshot that shows going to WAD config in Azure Resource Explorer.":::

1. Add the Application Insights Profiler sink to the `SinksConfig` node under `WadCfg`. If you don't already have a `SinksConfig` section, you might need to add one. To add the sink:

   - Specify the proper Application Insights iKey in your settings.
   - Switch the Explorer mode to **Read/Write** in the upper-right corner.
   - Select **Edit**.

     :::image type="content" source="./media/profiler-vm/resource-explorer-sinks-config.png" alt-text="Screenshot that shows adding the Application Insights Profiler sink.":::

       ```json
       "WadCfg": {
         "SinksConfig": {
           "Sink": [
             {
               "name": "MyApplicationInsightsProfilerSink",
               "ApplicationInsightsProfiler": "YOUR_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY"
             }
           ]
         }
       }        
       ```

1. After you've finished editing the config, select **PUT**.

1. If the `put` is successful, a green check mark appears in the middle of the screen.

   :::image type="content" source="./media/profiler-vm/resource-explorer-put.png" alt-text="Screenshot that shows sending the PUT request to apply changes.":::

---

## Can Profiler run on on-premises servers?

Currently, Application Insights Profiler isn't supported for on-premises servers.

## Next steps

> [!div class="nextstepaction"]
> [Generate load and view Profiler traces](./profiler-data.md)

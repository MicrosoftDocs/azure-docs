---
title: Enable Profiler for web apps on an Azure virtual machine
description: Profile web apps running on an Azure virtual machine or a virtual machine scale set by using Application Insights Profiler
ms.topic: conceptual
ms.date: 06/22/2022
ms.reviewer: jogrima
---

# Enable Profiler for web apps on an Azure virtual machine

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

In this article, you learn how to run Application Insights Profiler on your Azure virtual machine (VM) or Azure VM scale set. You will: 

- Configure the Azure Diagnostics extension to run Profiler.
- Build the Application Insights SDK into your application.

## Pre-requisites

- A functioning [ASP.NET Core application](https://docs.microsoft.com/aspnet/core/getting-started) 
- An [Application Insights resource](../app/create-workspace-resource.md).
- Review the Azure Resource Manager templates for the Azure Diagnostics extension:
  - [Virtual machine](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
  - [Virtual machine scale set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)

## Add Application Insights SDK to your application

1. Open your ASP.NET core project in Visual Studio.

1. Select **Project** > **Add Application Insights Telemetry**.

1. Select **Azure Application Insights**, then **Next**. 

1. Select your subscription, then **Next**.

1. Select where to save connection string, then **Next**.

1. Select **Finish**.

> [!NOTE]
> For full instructions, including enabling Application Insights without Visual Studio, see the [Application Insights for ASP.NET Core applications](../app/asp-net-core.md).

## Confirm the latest stable release of the Application Insights SDK

1. Go to **Project** > **Manage NuGet Packages**.

1. Select **Microsoft.ApplicationInsights.AspNetCore**.

1. In the side pane, select the latest version of the SDK from the dropdown. 

1. Select **Update**.

  ![Screenshot showing where to select the Application Insights package for update](../app/media/asp-net-core/update-nuget-package.png)

## Install Azure Diagnostics extension

1. Using the Azure Resource Manager template, locate the resource of type `extension` and add to your project.

1. Within the `WadCfg` tag, add your Application Insights instrumentation key to the `MyApplicationInsightsProfilerSink`.
    
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

1. Deploy the modified environment deployment definition.  

   Applying the modifications usually involves a full template deployment or a cloud service-based publish through PowerShell cmdlets or Visual Studio.  

   The following PowerShell commands are an alternate approach for existing VMs that touch only the Azure Diagnostics extension. Add the previously mentioned ProfilerSink to the config that's returned by the Get-AzVMDiagnosticsExtension command. Then pass the updated config to the Set-AzVMDiagnosticsExtension command.

    ```powershell
    $ConfigFilePath = [IO.Path]::GetTempFileName()
    # After you export the currently deployed Diagnostics config to a file, edit it to include the ApplicationInsightsProfiler sink.
    (Get-AzVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM").PublicSettings | Out-File -Verbose $ConfigFilePath
    # Set-AzVMDiagnosticsExtension might require the -StorageAccountName argument
    # If your original diagnostics configuration had the storageAccountName property in the protectedSettings section (which is not downloadable), be sure to pass the same original value you had in this cmdlet call.
    Set-AzVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM" -DiagnosticsConfigurationPath $ConfigFilePath
    ```

  > [!NOTE]
  > If the intended application is running through [IIS](https://www.microsoft.com/web/downloads/platform.aspx), enable the `IIS Http Tracing` Windows feature:
  >
  > 1. Establish remote access to the environment, and then use the [Add Windows features](/iis/configuration/system.webserver/tracing/) window. Or run the following command in PowerShell (as administrator):  
  >
  >   ```powershell
  >   Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All
  >   ```
  >
  > 1. If establishing remote access is a problem, you can use the [Azure CLI](/cli/azure/get-started-with-azure-cli) to run the following command:  
  >
  >   ```azurecli
  >   az vm run-command invoke -g MyResourceGroupName -n MyVirtualMachineName --command-id RunPowerShellScript --scripts "Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All"
  >   ```

1. Deploy your application.

## Set Profiler Sink using Azure Resource Explorer

We don't yet have a way to set the Application Insights Profiler sink from the portal. Instead of using PowerShell as described above, you can use Azure Resource Explorer to set the sink. But note, if you deploy the VM again, the sink will be lost. You'll need to update the config you use when deploying the VM to preserve this setting.

1. Check that the Windows Azure Diagnostics extension is installed by viewing the extensions installed for your virtual machine.  

    ![Check if WAD extension is installed][wadextension]

2. Find the VM Diagnostics extension for your VM. Go to [https://resources.azure.com](https://resources.azure.com). Expand your resource group, Microsoft.Compute virtualMachines, virtual machine name, and extensions.  

    ![Navigate to WAD config in Azure Resource Explorer][azureresourceexplorer]

3. Add the Application Insights Profiler sink to the SinksConfig node under WadCfg. If you don't already have a SinksConfig section, you may need to add one. Be sure to specify the proper Application Insights iKey in your settings. You'll need to switch the explorers mode to Read/Write in the upper right corner and Press the blue 'Edit' button.

    ![Add Application Insights Profiler Sink][resourceexplorersinksconfig]

4. When you're done editing the config, press 'Put'. If the put is successful, a green check will appear in the middle of the screen.

    ![Send put request to apply changes][resourceexplorerput]






## Can Profiler run on on-premises servers?
We have no plan to support Application Insights Profiler for on-premises servers.

## Next steps

- Generate traffic to your application (for example, launch an [availability test](../app/monitor-web-app-availability.md)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json) in the Azure portal.
- For help with troubleshooting Profiler issues, see [Profiler troubleshooting](profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

[azureresourceexplorer]: ./media/profiler-vm/azure-resource-explorer.png
[resourceexplorerput]: ./media/profiler-vm/resource-explorer-put.png
[resourceexplorersinksconfig]: ./media/profiler-vm/resource-explorer-sinks-config.png
[wadextension]: ./media/profiler-vm/wad-extension.png


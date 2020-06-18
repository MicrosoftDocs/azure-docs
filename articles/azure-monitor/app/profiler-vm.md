---
title:  Profile web apps on an Azure VM - Application Insights Profiler
description: Profile web apps on an Azure VM by using Application Insights Profiler.
ms.topic: conceptual
author: cweining
ms.author: cweining
ms.date: 11/08/2019

ms.reviewer: mbullwin
---

# Profile web apps running on an Azure virtual machine or a virtual machine scale set by using Application Insights Profiler

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

You can also deploy Azure Application Insights Profiler on these services:
* [Azure App Service](../../azure-monitor/app/profiler.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric](profiler-vm.md?toc=/azure/azure-monitor/toc.json)

## Deploy Profiler on a virtual machine or a virtual machine scale set
This article shows you how to get Application Insights Profiler running on your Azure virtual machine (VM) or Azure virtual machine scale set. Profiler is installed with the Azure Diagnostics extension for VMs. Configure the extension to run Profiler, and build the Application Insights SDK into your application.

1. Add the Application Insights SDK to your [ASP.NET application](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net).

   To view profiles for your requests, you must send request telemetry to Application Insights.

1. Install Azure Diagnostics extension on your VM. For full Resource Manager template examples, see:  
   * [Virtual machine](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
   * [Virtual machine scale set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)
    
     The key part is the ApplicationInsightsProfilerSink in the WadCfg. To have Azure Diagnostics enable Profiler to send data to your iKey, add another sink to this section.
    
     ```json
     "SinksConfig": {
       "Sink": [
         {
           "name": "ApplicationInsightsSink",
           "ApplicationInsights": "85f73556-b1ba-46de-9534-606e08c6120f"
         },
         {
           "name": "MyApplicationInsightsProfilerSink",
           "ApplicationInsightsProfiler": "85f73556-b1ba-46de-9534-606e08c6120f"
         }
       ]
     },
     ```

1. Deploy the modified environment deployment definition.  

   Applying the modifications usually involves a full template deployment or a cloud service-based publish through PowerShell cmdlets or Visual Studio.  

   The following PowerShell commands are an alternate approach for existing virtual machines that touch only the Azure Diagnostics extension. Add the previously mentioned ProfilerSink to the config that's returned by the Get-AzVMDiagnosticsExtension command. Then pass the updated config to the Set-AzVMDiagnosticsExtension command.

    ```powershell
    $ConfigFilePath = [IO.Path]::GetTempFileName()
    # After you export the currently deployed Diagnostics config to a file, edit it to include the ApplicationInsightsProfiler sink.
    (Get-AzVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM").PublicSettings | Out-File -Verbose $ConfigFilePath
    # Set-AzVMDiagnosticsExtension might require the -StorageAccountName argument
    # If your original diagnostics configuration had the storageAccountName property in the protectedSettings section (which is not downloadable), be sure to pass the same original value you had in this cmdlet call.
    Set-AzVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM" -DiagnosticsConfigurationPath $ConfigFilePath
    ```

1. If the intended application is running through [IIS](https://www.microsoft.com/web/downloads/platform.aspx), enable the `IIS Http Tracing` Windows feature.

   a. Establish remote access to the environment, and then use the [Add Windows features]( https://docs.microsoft.com/iis/configuration/system.webserver/tracing/) window. Or run the following command in PowerShell (as administrator):  

    ```powershell
    Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All
    ```  
   b. If establishing remote access is a problem, you can use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) to run the following command:  

    ```powershell
    az vm run-command invoke -g MyResourceGroupName -n MyVirtualMachineName --command-id RunPowerShellScript --scripts "Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All"
    ```

1. Deploy your application.

## Set Profiler Sink using Azure Resource Explorer
We don't yet have a way to set the Application Insights Profiler sink from the portal. Instead of using powershell like described above, you can use Azure Resource Explorer to set the sink. But note, if you deploy the VM again, the sink will be lost. You'll need to update the config you use when deploying the VM to preserve this setting.

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

- Generate traffic to your application (for example, launch an [availability test](monitor-web-app-availability.md)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json) in the Azure portal.
- For help with troubleshooting Profiler issues, see [Profiler troubleshooting](profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

[azureresourceexplorer]: ./media/profiler-vm/azure-resource-explorer.png
[resourceexplorerput]: ./media/profiler-vm/resource-explorer-put.png
[resourceexplorersinksconfig]: ./media/profiler-vm/resource-explorer-sinks-config.png
[wadextension]: ./media/profiler-vm/wad-extension.png

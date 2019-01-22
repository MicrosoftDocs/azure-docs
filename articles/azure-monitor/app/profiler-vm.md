---
title: Profile web apps running on an Azure VM by using Application Insights Profiler | Microsoft Docs
description: Profile web apps on an Azure VM by using Application Insights Profiler.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.reviewer: cawa
ms.date: 08/06/2018
ms.author: mbullwin
---


# Profile web apps running on an Azure virtual machine or a virtual machine scale set by using Application Insights Profiler

You can also deploy Azure Application Insights Profiler on these services:
* [Azure App Service](../../azure-monitor/app/profiler.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Azure Service Fabric](profiler-vm.md?toc=/azure/azure-monitor/toc.json)

## Deploy Profiler on a virtual machine or a virtual machine scale set
This article shows you how to get Application Insights Profiler running on your Azure virtual machine (VM) or Azure virtual machine scale set. Profiler is installed with the Azure Diagnostics extension for VMs. Configure the extension to run Profiler, and build the Application Insights SDK into your application.

1. Add the Application Insights SDK to your [ASP.NET application](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net) or regular [.NET Application](windows-services.md?toc=/azure/azure-monitor/toc.json).  
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

   The following PowerShell commands are an alternate approach for existing virtual machines that touches only the Azure Diagnostics extension. Add the previously mentioned ProfilerSink to the config that's returned by the Get-AzureRmVMDiagnosticsExtension command, and then pass the updated config to the Set-AzureRmVMDiagnosticsExtension command.

    ```powershell
    $ConfigFilePath = [IO.Path]::GetTempFileName()
    # After you export the currently deployed Diagnostics config to a file, edit it to include the ApplicationInsightsProfiler sink.
    (Get-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM").PublicSettings | Out-File -Verbose $ConfigFilePath
    # Set-AzureRmVMDiagnosticsExtension might require the -StorageAccountName argument
    # If your original diagnostics configuration had the storageAccountName property in the protectedSettings section (which is not downloadable), be sure to pass the same original value you had in this cmdlet call.
    Set-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM" -DiagnosticsConfigurationPath $ConfigFilePath
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

## Can Profiler run on on-premises servers?
We have no plan to support Application Insights Profiler for on-premises servers.

## Next steps

- Generate traffic to your application (for example, launch an [availability test](monitor-web-app-availability.md)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json) in the Azure portal.
- For help with troubleshooting Profiler issues, see [Profiler troubleshooting](profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

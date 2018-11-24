---
title: Profile web apps running on an Azure VM with Application Insights Profiler | Microsoft Docs
description: Profile web apps on an Azure VM with Application Insights Profiler.
services: application-insights
documentationcenter: ''
author: mrbullwinkle
manager: carmonm

ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.reviewer: cawa
ms.date: 08/06/2018
ms.author: mbullwin

---


# Profile web apps running on an Azure virtual machine or virtual machine scale set with Application Insights Profiler
You can also deploy Application Insights profiler on these services:
* [Azure Web Apps](app-insights-profiler.md?toc=/azure/azure-monitor/toc.json)
* [Cloud Services](app-insights-profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Service Fabric](app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)

## Deploy Profiler on a Virtual Machine or Scale set
This page will guide you through the steps needed to get Application Insights profiler running on your Azure VM or Azure virtual machine scale set. Application Insights Profiler is installed with the Windows Azure Diagnostics extension for VMs. The extension needs to be configured to run the profiler and the App Insights SDK must be built into your application.

1. Add application Insights SDK to your [ASP.Net application](https://docs.microsoft.com/azure/application-insights/app-insights-asp-net) or regular [.NET Application.](https://docs.microsoft.com/azure/application-insights/app-insights-windows-services?toc=/azure/azure-monitor/toc.json) You must be sending request telemetry to Application Insights see profiles for your requests.
1. Install Windows Azure Diagnostics extension on your VM. For full Resource Manager template examples, see:  
    * [Virtual machine](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachine.json)
    * [Virtual machine scale set](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/WindowsVirtualMachineScaleSet.json)
    
    The key part is the ApplicationInsightsProfilerSink in the WadCfg. Add another sink to this section to tell WAD to enable the profiler to send data to your iKey.
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

   To apply the modifications, it usually involves a full template deployment or a cloud service based publish through PowerShell cmdlets or Visual Studio.  

   The following powershell commands are an alternate approach for existing virtual machines that touches only the Azure Diagnostics extension. You just need to add the ProfilerSink as noted above to the config that is returned by the Get-AzureRmVMDiagnosticsExtension command. Then pass the updated config to the Set-AzureRmVMDiagnosticsExcension command.

    ```powershell
    $ConfigFilePath = [IO.Path]::GetTempFileName()
    # After you export the currently deployed Diagnostics config to a file, edit it to include the ApplicationInsightsProfiler sink.
    (Get-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM").PublicSettings | Out-File -Verbose $ConfigFilePath
    # Set-AzureRmVMDiagnosticsExtension might require the -StorageAccountName argument
    # If your original diagnostics configuration had the storageAccountName property in the protectedSettings section (which is not downloadable), be sure to pass the same original value you had in this cmdlet call.
    Set-AzureRmVMDiagnosticsExtension -ResourceGroupName "MyRG" -VMName "MyVM" -DiagnosticsConfigurationPath $ConfigFilePath
    ```

1. If the intended application is running through [IIS](https://www.microsoft.com/web/downloads/platform.aspx), enable the `IIS Http Tracing` Windows feature.

   a. Establish remote access to the environment, and then use the [Add Windows features]( https://docs.microsoft.com/iis/configuration/system.webserver/tracing/) window, or run the following command in PowerShell (as administrator):  

    ```powershell
    Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All
    ```  
   b. If establishing remote access is a problem, you can use [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) to run the following command:  

    ```powershell
    az vm run-command invoke -g MyResourceGroupName -n MyVirtualMachineName --command-id RunPowerShellScript --scripts "Enable-WindowsOptionalFeature -FeatureName IIS-HttpTracing -Online -All"
    ```

1. Deploy your application.

## Can profiler run on on-premises servers?
We have no plans to support Application Insights Profiler for on-premises servers.

## Next steps

- Generate traffic to your application (for example, launch an [availability test](https://docs.microsoft.com/azure/application-insights/app-insights-monitor-web-app-availability)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](https://docs.microsoft.com/azure/application-insights/app-insights-profiler-overview?toc=/azure/azure-monitor/toc.json) in the Azure portal.
- Get help with troubleshooting profiler issues in [Profiler troubleshooting](app-insights-profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

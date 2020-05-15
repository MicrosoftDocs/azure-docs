---
title: Profile live Azure Service Fabric apps with Application Insights
description: Enable Profiler for a Service Fabric application
ms.topic: conceptual
author: cweining
ms.author: cweining
ms.date: 08/06/2018

ms.reviewer: mbullwin
---

# Profile live Azure Service Fabric applications with Application Insights

You can also deploy Application Insights Profiler on these services:
* [Azure App Service](profiler.md?toc=/azure/azure-monitor/toc.json)
* [Azure Cloud Services](profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Azure Virtual Machines](profiler-vm.md?toc=/azure/azure-monitor/toc.json)

## Set up the environment deployment definition

Application Insights Profiler is included with Azure Diagnostics. You can install the Azure Diagnostics extension by using an Azure Resource Manager template for your Service Fabric cluster. Get a [template that installs Azure Diagnostics on a Service Fabric Cluster](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json).

To set up your environment, take the following actions:

1. Profiler supports .NET Framework and .Net Core. If you're using .NET Framework, make sure you're using [.NET Framework 4.6.1](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later. It's sufficient to confirm that the deployed OS is `Windows Server 2012 R2` or later. Profiler supports .NET Core 2.1 and newer applications.

1. Search for the [Azure Diagnostics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/azure-diagnostics) extension in the deployment template file.

1. Add the following `SinksConfig` section as a child element of `WadCfg`. Replace the `ApplicationInsightsProfiler` property value with your own Application Insights instrumentation key:  

      ```json
      "SinksConfig": {
        "Sink": [
          {
            "name": "MyApplicationInsightsProfilerSink",
            "ApplicationInsightsProfiler": "00000000-0000-0000-0000-000000000000"
          }
        ]
      }
      ```

      For information about adding the Diagnostics extension to your deployment template, see [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](https://docs.microsoft.com/azure/virtual-machines/windows/extensions-diagnostics-template?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

1. Deploy your Service Fabric cluster by using your Azure Resource Manager template.  
  If your settings are correct, Application Insights Profiler will be installed and enabled when the Azure Diagnostics extension is installed. 

1. Add Application Insights to your Service Fabric application.  
  For Profiler to collect profiles for your requests, your application must be tracking operations with Application Insights. For stateless APIs, you can refer to instructions for [tracking Requests for profiling](profiler-trackrequests.md?toc=/azure/azure-monitor/toc.json). For more information about tracking custom operations in other kinds of apps, see [track custom operations with Application Insights .NET SDK](custom-operations-tracking.md?toc=/azure/azure-monitor/toc.json).

1. Redeploy your application.


## Next steps

* Generate traffic to your application (for example, launch an [availability test](monitor-web-app-availability.md)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
* See [Profiler traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json) in the Azure portal.
* For help with troubleshooting Profiler issues, see [Profiler troubleshooting](profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

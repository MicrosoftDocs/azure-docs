---
title: Profile live Azure Service Fabric applications with Application Insights | Microsoft Docs
description: Enable profiler for a Service Fabric Application
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
# Profile live Azure Service Fabric applications with Application Insights

You can also deploy Application Insights profiler on these services:
* [Azure Web Apps](app-insights-profiler.md?toc=/azure/azure-monitor/toc.json)
* [Cloud Services](app-insights-profiler-cloudservice.md?toc=/azure/azure-monitor/toc.json)
* [Virtual Machines](app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)


## Set up the environment deployment definition

Application Insights Profiler is included with the Windows Azure Diagnostics (WAD). The WAD extension can be installed using an Azure RM template for your Service Fabric cluster. There's an example template here: [**Template that installs WAD on a Service Fabric Cluster.**](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json)

To set up your environment, take the following actions:
1. To ensure that you're using [.NET Framework 4.6.1](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later, it's sufficient to confirm that the deployed OS is `Windows Server 2012 R2` or later.

1. Search for the [Azure Diagnostics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/azure-diagnostics) extension in the deployment template file, and then add the following `SinksConfig` section as a child element of `WadCfg`. Replace the `ApplicationInsightsProfiler` property value with your own Application Insights instrumentation key:  

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
1. Deploy your Service Fabric cluster using your Azure Resource Manager template. If your settings are correct, Application Insights Profiler will be installed and enabled when the WAD extension is installed. 
1. Add Application Insights to your Service Fabric application. Your application must be sending request data to application insights in order for the profiler to collect profiles for your requests. You can find instructions [here.](https://github.com/Microsoft/ApplicationInsights-ServiceFabric)
1. Redeploy your application.

> [TIP]
> For Virtual Machines an alternative to the json based steps above is to navigate in the Azure portal to  **Virtual Machines** > **Diagnostic Settings** > **Sinks** > Set send diagnostic data to Application Insights to **Enabled** and either select an Application Insights account or a specific ikey.

## Next steps

- Generate traffic to your application (for example, launch an [availability test](https://docs.microsoft.com/azure/application-insights/app-insights-monitor-web-app-availability)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](https://docs.microsoft.com/azure/application-insights/app-insights-profiler-overview?toc=/azure/azure-monitor/toc.json) in the Azure portal.
- Get help with troubleshooting profiler issues in [Profiler troubleshooting](app-insights-profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).
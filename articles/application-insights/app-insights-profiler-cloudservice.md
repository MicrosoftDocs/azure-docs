---
title: Profile live Azure cloud services with Application Insights | Microsoft Docs
description: Enable Application Insights Profiler for Cloud Services.
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
# Profile live Azure cloud services with Application Insights

You can also deploy Application Insights profiler on these services:
* [Azure Web Apps](app-insights-profiler.md?toc=/azure/azure-monitor/toc.json)
* [Service Fabric Applications](app-insights-profiler-servicefabric.md?toc=/azure/azure-monitor/toc.json)
* [Virtual Machines](app-insights-profiler-vm.md?toc=/azure/azure-monitor/toc.json)

Application Insights Profiler is installed with the Windows Azure Diagnostics (WAD) extension. You just need to configure WAD to install the profiler and send profiles to your Application Insights resource.

## Enable profiler for your Azure Cloud Service
1. Check to see that you  using [.NET Framework 4.6.1](https://docs.microsoft.com/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later.  It's sufficient to confirm that the *ServiceConfiguration.\*.cscfg* files have an `osFamily` value of "5" or later.
1. Add [Application Insights SDK to cloud service](app-insights-cloudservices.md?toc=/azure/azure-monitor/toc.json).
1. Track requests with Application Insights:

    For ASP.Net web roles, Application Insights can track the requests automatically.

    For Worker Roles, [add code to track requests.](app-insights-profiler-trackrequests.md?toc=/azure/azure-monitor/toc.json)

    

1. Configure Windows Azure Diagnostics (WAD) extension to enable profiler.



    1. Locate the [Azure Diagnostics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/azure-diagnostics) *diagnostics.wadcfgx* file for your application role, as shown here:  

       ![Location of the diagnostics config file](./media/enable-profiler-compute/cloudservice-solutionexplorer.png)  

        If you can't find the file, to learn how to enable the Diagnostics extension in your Azure Cloud Services project, see [Set up diagnostics for Azure Cloud Services and virtual machines](https://docs.microsoft.com/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines#enable-diagnostics-in-cloud-service-projects-before-deploying-them).

    1. Add the following `SinksConfig` section as a child element of `WadCfg`:  

      ```xml
      <WadCfg>
        <DiagnosticMonitorConfiguration>...</DiagnosticMonitorConfiguration>
        <SinksConfig>
          <Sink name="MyApplicationInsightsProfiler">
            <!-- Replace with your own Application Insights instrumentation key. -->
            <ApplicationInsightsProfiler>00000000-0000-0000-0000-000000000000</ApplicationInsightsProfiler>
          </Sink>
        </SinksConfig>
      </WadCfg>
      ```

    >   **NOTE:**
    > If the *diagnostics.wadcfgx* file also contains another sink of type `ApplicationInsights`, all three of the following instrumentation keys must match:  
    >  * The key that's used by your application.  
    >  * The key that's used by the `ApplicationInsights` sink.  
    >  * The key that's used by the `ApplicationInsightsProfiler` sink.  
    >
    > You can find the actual instrumentation key value that's used by the `ApplicationInsights` sink in the     *ServiceConfiguration.\*.cscfg* files.  
    > After the Visual Studio 15.5 Azure SDK release, only the instrumentation keys that are used by the application     and the `ApplicationInsightsProfiler` sink need to match each other.
1. Deploy your service with the new diagnostic configuration and Application Insights Profiler will be configured to run on your service.
 
## Next steps

- Generate traffic to your application (for example, launch an [availability test](https://docs.microsoft.com/azure/application-insights/app-insights-monitor-web-app-availability)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
- See [Profiler traces](https://docs.microsoft.com/azure/application-insights/app-insights-profiler-overview?toc=/azure/azure-monitor/toc.json) in the Azure portal.
- Get help with troubleshooting profiler issues in [Profiler troubleshooting](app-insights-profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).
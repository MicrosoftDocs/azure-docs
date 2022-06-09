---
title: Enable Profiler for Azure Service Fabric applications
description: Profile live Azure Service Fabric apps with Application Insights
ms.topic: conceptual
ms.custom: devx-track-dotnet
ms.date: 05/31/2022
---

# Enable Profiler for Azure Service Fabric applications

Application Insights Profiler is included with Azure Diagnostics. You can install the Azure Diagnostics extension by using an Azure Resource Manager template for your Service Fabric cluster. Get a [template that installs Azure Diagnostics on a Service Fabric Cluster](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json).

In this article, you will:

- Add the Application Insights Profiler property to your Azure Resource Manager template.
- Deploy your Service Fabric cluster using the Azure Resource Manager template.
- Enable Application Insights on your Service Fabric application.
- Redeploy your Service Fabric cluster to enable Profiler.

## Prerequisites

- Profiler supports .NET Framework, .NET Core, and .NET Core [LTS](https://dotnet.microsoft.com/platform/support/policy/dotnet-core) and newer applications.
  - Verify you're using [.NET Framework 4.6.1](/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later. 
  - Confirm that the deployed OS is `Windows Server 2012 R2` or later. 
- [An Azure Service Fabric managed cluster.](../../service-fabric/quickstart-managed-cluster-portal.md).

## Set up the environment deployment definition

1. In your Service Fabric managed cluster, navigate to your [Azure Resource Manager template](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json).
1. Locate `WadCfg` in the [Azure Diagnostics](../agents/diagnostics-extension-overview.md) extension in the deployment template file.

   :::image type="content" source="./media/profiler-servicefabric/search-wadcfg.png" alt-text="Screenshot of where to place the Application Insights instrumentation key." :::

1. Add the following `SinksConfig` section as a child element of `WadCfg`. Replace the `ApplicationInsightsProfiler` property value with your own Application Insights instrumentation key:  

  ```json
  "SinksConfig": {
    "Sink": [
      {
        "name": "MyApplicationInsightsProfilerSink",
        "ApplicationInsightsProfiler": "[Application_Insights_Key]"
      }
    ]
  }
  ```

  For information about adding the Diagnostics extension to your deployment template, see [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](../../virtual-machines/extensions/diagnostics-template.md?toc=/azure/virtual-machines/windows/toc.json).

1. Deploy your Service Fabric cluster by using your Azure Resource Manager template.  
  If your settings are correct, Application Insights Profiler will be installed and enabled when the Azure Diagnostics extension is installed. 

1. Add Application Insights to your Service Fabric application.  

  For Profiler to collect profiles for your requests, your application must be tracking operations with Application Insights. For stateless APIs, you can refer to instructions for [tracking Requests for profiling](profiler-trackrequests.md?toc=/azure/azure-monitor/toc.json). For more information about tracking custom operations in other kinds of apps, see [track custom operations with Application Insights .NET SDK](custom-operations-tracking.md?toc=/azure/azure-monitor/toc.json).

1. Redeploy your application.


## Next steps

* Generate traffic to your application (for example, launch an [availability test](../app/monitor-web-app-availability.md)). Then, wait 10 to 15 minutes for traces to start to be sent to the Application Insights instance.
* See [Profiler traces](profiler-overview.md?toc=/azure/azure-monitor/toc.json) in the Azure portal.
* For help with troubleshooting Profiler issues, see [Profiler troubleshooting](profiler-troubleshooting.md?toc=/azure/azure-monitor/toc.json).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

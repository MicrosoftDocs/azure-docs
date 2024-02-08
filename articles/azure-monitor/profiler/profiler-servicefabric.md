---
title: Enable Profiler for Azure Service Fabric applications
description: Profile live Azure Service Fabric apps with Application Insights.
ms.topic: conceptual
ms.custom:
ms.date: 09/22/2023
---

# Enable Profiler for Azure Service Fabric applications

Application Insights Profiler is included with Azure Diagnostics. You can install the Azure Diagnostics extension by using an Azure Resource Manager template (ARM template) for your Azure Service Fabric cluster. Get a [template that installs Azure Diagnostics on a Service Fabric cluster](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json).

In this article, you:

- Add the Application Insights Profiler property to your ARM template.
- Deploy your Service Fabric cluster with the Application Insights Profiler instrumentation key.
- Enable Application Insights on your Service Fabric application.
- Redeploy your Service Fabric cluster to enable Profiler.

## Prerequisites

- Profiler supports .NET Framework and .NET applications.
  - Verify you're using [.NET Framework 4.6.2](/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or later. 
  - Confirm that the deployed OS is `Windows Server 2012 R2` or later. 
- [An Azure Service Fabric managed cluster](../../service-fabric/quickstart-managed-cluster-portal.md).

## Create a deployment template

1. In your Service Fabric managed cluster, go to where you implemented the [ARM template](https://github.com/Azure/azure-docs-json-samples/blob/master/application-insights/ServiceFabricCluster.json).

1. Locate the `WadCfg` tags in the [Azure Diagnostics](../agents/diagnostics-extension-overview.md) extension in the deployment template file.

1. Add the following `SinksConfig` section as a child element of `WadCfg`. Replace the `ApplicationInsightsProfiler` property value with your own Application Insights instrumentation key:
    
      ```json
      "settings": {
          "WadCfg": {
              "SinksConfig": {
                  "Sink": [
                      {
                          "name": "MyApplicationInsightsProfilerSinkVMSS",
                          "ApplicationInsightsProfiler": "YOUR_APPLICATION_INSIGHTS_INSTRUMENTATION_KEY"
                      }
                  ]
              },
          },
      }  
      ```

  For information about how to add the Diagnostics extension to your deployment template, see [Use monitoring and diagnostics with a Windows VM and Azure Resource Manager templates](../../virtual-machines/extensions/diagnostics-template.md).

## Deploy your Service Fabric cluster

After you update `WadCfg` with your instrumentation key, deploy your Service Fabric cluster.

Application Insights Profiler is installed and enabled when the Azure Diagnostics extension is installed.

## Enable Application Insights on your Service Fabric application

For Profiler to collect profiles for your requests, your application must be tracking operations with Application Insights.

- **For stateless APIs**: See the instructions for [tracking requests for profiling](./profiler-trackrequests.md).
- **For tracking custom operations in other kinds of apps**: See [Track custom operations with Application Insights .NET SDK](../app/custom-operations-tracking.md).

After you enable Application Insights, redeploy your application.

## Generate traffic and view Profiler traces

1. Launch an [availability test](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability) to generate traffic to your application.
1. Wait 10 to 15 minutes for traces to be sent to the Application Insights instance.
1. View the [Profiler traces](./profiler-overview.md) via the Application Insights instance in the Azure portal.

## Next steps

> [!div class="nextstepaction"]
> [Generate load and view Profiler traces](./profiler-data.md)

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

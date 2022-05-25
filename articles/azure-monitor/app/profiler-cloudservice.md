---
title: Enable Profiler for Azure Cloud Services | Microsoft Docs
description: Profile live Azure Cloud Services with Application Insights Profiler.
ms.topic: conceptual
ms.custom: devx-track-dotnet
ms.date: 05/25/2022
---

# Enable Profiler for Azure Cloud Services

Receive performance traces for your [Azure Cloud Service](../../cloud-services-extended-support/overview.md) by enabling the Application Insights Profiler. The Profiler is installed on your Cloud Service via the [Azure Diagnostics extension](../agents/diagnostics-extension-overview.md). 

In this article, you will:

- Enable your Cloud Service to send diagnostics data to Application Insights.
- Configure the Azure Diagnostics extension within your solution to install Profiler.
- Deploy your service and generate traffic to view Profiler traces. 

## Pre-requisites

- Make sure you've [set up diagnostics for Azure Cloud Services](/visualstudio/azure/vs-azure-tools-diagnostics-for-cloud-services-and-virtual-machines).
- Use [.NET Framework 4.6.1](/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed) or newer. 
  - If you are using [OS Family 4](../../cloud-services/cloud-services-guestos-update-matrix.md#family-4-releases), install .NET Framework 4.6.1 or newer with a [startup task](../../cloud-services/cloud-services-dotnet-install-dotnet.md). 
  - [OS Family 5](../../cloud-services/cloud-services-guestos-update-matrix.md#family-5-releases) includes a compatible version of .NET Framework by default. 

## Track requests with Application Insights

When publishing your CloudService to Azure portal, add the [Application Insights SDK to Azure Cloud Services](./cloudservices.md).

:::image type="content" source="./media/profiler-cloudservice/enable-app-insights.png" alt-text="Screenshot showing the checkbox for sending information to Application Insights.":::

Once you've added the SDK and published your Cloud Service to the Azure Portal, track requests using Application Insights.

- **For ASP.NET web roles**, Application Insights tracks the requests automatically.
- **For worker roles**, you need to [add code manually to your application to track requests](profiler-trackrequests.md).

## Configure the Azure Diagnostics extension

Locate the Azure Diagnostics *diagnostics.wadcfgx* file for your application role:  

:::image type="content" source="./media/profiler-cloudservice/diagnostics-file.png" alt-text="Screenshot of the diagnostics file in the Azure Cloud Service solution explorer.":::

Add the following `SinksConfig` section as a child element of `WadCfg`:  

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

> [!NOTE]
> If the *diagnostics.wadcfgx* file also contains another sink of type `ApplicationInsights`, all three of the following instrumentation keys must match:  
> * The key used by your application. 
> * The key used by the `ApplicationInsights` sink. 
> * The key used by the `ApplicationInsightsProfiler` sink. 
>
> You can find the actual instrumentation key value used by the `ApplicationInsights` sink in the *ServiceConfiguration.\*.cscfg* files. 
> After the Visual Studio 15.5 Azure SDK release, only the instrumentation keys that are used by the application and the ApplicationInsightsProfiler sink need to match each other.

Deploy your service with the new Diagnostics configuration. Application Insights Profiler is now configured to run on your Cloud Service.

## Generate traffic to your service

Now that your Azure Cloud Service is deployed with Profiler, you can generate traffic to view Profiler traces.

Generate traffic to your application by setting up an [availability test](monitor-web-app-availability.md)). Wait 10 to 15 minutes for traces to be sent to the Application Insights instance.

Navigate to your Azure Cloud Service's Application Insights resource. In the left side menu, select **Performance**.

:::image type="content" source="./media/profiler-cloudservice/cloud-service-performance.png" alt-text="Screenshot of the Application Insights performance option in the left menu of the Azure portal.":::

Select the **Profiler** for your Cloud Service.

:::image type="content" source="./media/profiler-cloudservice/select-profiler.png" alt-text="Screenshot of selecting the Profiler from the Cloud Service App Insights performance pane.":::

Select **Profile now** to start a profiling session. This will take a few minutes.

:::image type="content" source="./media/profiler-cloudservice/profile-now.png" alt-text="Screenshot of selecting Profile Now to start a profiling session.":::

For more instructions on profiling sessions, see the [Profiler overview](./profiler-overview.md#start-a-profiler-on-demand-session).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]
 
## Next steps

- Learn more about [configuring Profiler](./profiler-settings.md).
- [Troubleshoot Profiler issues](./profiler-troubleshooting.md).
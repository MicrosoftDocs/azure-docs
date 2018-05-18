---
title: Azure Service Fabric Event Analysis with Application Insights | Microsoft Docs
description: Learn about visualizing and analyzing events using Application Insights for monitoring and diagnostics of Azure Service Fabric clusters.
services: service-fabric
documentationcenter: .net
author: srrengar
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/04/2018
ms.author: srrengar

---

# Event analysis and visualization with Application Insights

Azure Application Insights is an extensible platform for application monitoring and diagnostics. It includes a powerful analytics and querying tool, customizable dashboard and visualizations, and further options including automated alerting. It is the recommended platform for monitoring and diagnostics for Service Fabric applications and services. This article helps address the following common questions

* How do I know what is going on inside my application and services and gather telemetry
* How do I troubleshoot my application, especially services communicating with one another
* How do I get metrics about how my services are performing, for example, page load time, http requests

The purpose of this article is to show how to gain insights and troubleshoot from within App Insights. If you'd like to learn how to set up and configure AI with Service Fabric, check out this [tutorial](service-fabric-tutorial-monitoring-aspnet.md).

## Monitoring in App Insights

Application Insights has a rich out of the box experience when using Service Fabric. In the overview page, AI provides key information about your service such as the response time and number of requests processed. By clicking the 'Search' button at the top, you can see a list of recent requests in your application. Additionally, you would be able to see failed requests here and diagnose what errors may have occurred.

![AI Overview](media/service-fabric-diagnostics-event-analysis-appinsights/ai-overview.png)

On the right panel in the preceding image, there are two main types of entries in the list: requests and events. Requests are calls made to the app's API through HTTP requests in this case, and events are custom events, which act as telemetry you can add anywhere in your code. You can further explore instrumenting your applications in [Application Insights API for custom events and metrics](../application-insights/app-insights-api-custom-events-metrics.md). Clicking on a request would display further details as shown in the following image, including data specific to Service Fabric, which is collected in the AI Service Fabric nuget package. This info is useful for troubleshooting and knowing what the state of your application is, and all of this information is searchable within Application Insights

![AI Request Details](media/service-fabric-diagnostics-event-analysis-appinsights/ai-request-details.png)

Application Insights has a designated view for querying against all the data that comes in. Click "Metrics Explorer" on the top of the Overview page to navigate to the AI portal. Here you can run queries against custom events mentioned before, requests, exceptions, performance counters, and other metrics using the Kusto query language. The following example shows all the requests in the last 1 hour.

![AI Request Details](media/service-fabric-diagnostics-event-analysis-appinsights/ai-metrics-explorer.png)

To further explore the capabilities of the App Insights portal, head over to the [Application Insights portal documentation](../application-insights/app-insights-dashboards.md).

### Configuring AI with WAD

>[!NOTE]
>This is only applicable to Windows clusters at the moment.

There are two primary ways to send data from WAD to Azure AI, which is achieved by adding an AI sink to the WAD configuration, as detailed in [this article](../monitoring-and-diagnostics/azure-diagnostics-configure-application-insights.md).

#### Add an AI Instrumentation Key when creating a cluster in Azure portal

![Adding an AIKey](media/service-fabric-diagnostics-event-analysis-appinsights/azure-enable-diagnostics.png)

When creating a cluster, if Diagnostics is turned "On", an optional field to enter an Application Insights Instrumentation key will show. If you paste your AI Key here, the AI sink is automatically configured for you in the Resource Manager template that is used to deploy your cluster.

#### Add the AI Sink to the Resource Manager template

In the "WadCfg" of the Resource Manager template, add a "Sink" by including the following two changes:

1. Add the sink configuration directly after the declaring of the `DiagnosticMonitorConfiguration` is completed:

    ```json
    "SinksConfig": {
        "Sink": [
            {
                "name": "applicationInsights",
                "ApplicationInsights": "***ADD INSTRUMENTATION KEY HERE***"
            }
        ]
    }

    ```

2. Include the Sink in the `DiagnosticMonitorConfiguration` by adding the following line in the `DiagnosticMonitorConfiguration` of the `WadCfg` (right before the `EtwProviders` are declared):

    ```json
    "sinks": "applicationInsights"
    ```

In both the preceding code snippets, the name "applicationInsights" was used to describe the sink. This is not a requirement and as long as the name of the sink is included in "sinks", you can set the name to any string.

Currently, logs from the cluster show up as **traces** in AI's log viewer. Since most of the traces coming from the platform are of level "Informational", you can also consider changing the sink configuration to only send logs of type "Critical" or "Error." This can be done by adding "Channels" to your sink, as demonstrated in [this article](../monitoring-and-diagnostics/azure-diagnostics-configure-application-insights.md).

>[!NOTE]
>If you use an incorrect AI Key either in portal or in your Resource Manager template, you will have to manually change the key and update the cluster / redeploy it.

### Configuring AI with EventFlow

If you are using EventFlow to aggregate events, make sure to import the `Microsoft.Diagnostics.EventFlow.Output.ApplicationInsights`NuGet package. The following code is required in the *outputs* section of the *eventFlowConfig.json*:

```json
"outputs": [
    {
        "type": "ApplicationInsights",
        "instrumentationKey": "***ADD INSTRUMENTATION KEY HERE***"
    }
]
```

Make sure to make the required changes in your filters, as well as include any other inputs (along with their respective NuGet packages).

## AI.SDK

It is recommended to use EventFlow and WAD as aggregation solutions, because they allow for a more modular approach to diagnostics and monitoring, i.e. if you want to change your outputs from EventFlow, it requires no change to your actual instrumentation, just a simple modification to your config file. If, however, you decide to invest in using Application Insights and are not likely to change to a different platform, you should look into using AI's new SDK for aggregating events and sending them to AI. This means that you will no longer have to configure EventFlow to send your data to AI, but instead will install the ApplicationInsight's Service Fabric NuGet package. Details on the package can be found [here](https://github.com/Microsoft/ApplicationInsights-ServiceFabric).

[Application Insights support for Microservices and Containers](https://azure.microsoft.com/blog/app-insights-microservices/) shows you some of the new features that are being worked on (currently still in beta), which allow you to have richer out-of-the-box monitoring options with AI. These include dependency tracking (used in building an AppMap of all your services and applications in a cluster and the communication between them), and better correlation of traces coming from your services (helps in better pinpointing an issue in the workflow of an app or service).

If you are developing in .NET and will likely be using some of Service Fabric's programming models, and are willing to use AI as your platform for visualizing and analyzing event and log data, then we recommend that you go via the AI SDK route as your monitoring and diagnostics workflow. Read [this](../application-insights/app-insights-asp-net-more.md) and [this](../application-insights/app-insights-asp-net-trace-logs.md) to get started with using AI to collect and display your logs.

## Navigating the AI resource in Azure portal

Once you have configured AI as an output for your events and logs, information should start to show up in your AI resource in a few minutes. Navigate to the AI resource, which will take you to the AI resource dashboard. Click **Search** in the AI taskbar to see the latest traces that it has received, and to be able to filter through them.

*Metrics Explorer* is a useful tool for creating custom dashboards based on metrics that your applications, services, and cluster may be reporting. See [Exploring Metrics in Application Insights](../application-insights/app-insights-metrics-explorer.md) to set up a few charts for yourself based on the data you are collecting.

Clicking **Analytics** will take you to the Application Insights Analytics portal, where you can query events and traces with greater scope and optionality. Read more about this at [Analytics in Application Insights](../application-insights/app-insights-analytics.md).

## Next steps

* [Set up Alerts in AI](../application-insights/app-insights-alerts.md) to be notified about changes in performance or usage
* [Smart Detection in Application Insights](../application-insights/app-insights-proactive-diagnostics.md) performs a proactive analysis of the telemetry being sent to AI to warn you of potential performance problems

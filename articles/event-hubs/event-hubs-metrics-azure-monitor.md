---
title: Metrics in Azure Monitor - Azure Event Hubs | Microsoft Docs
description: This article provides information on how to use Azure Monitoring to monitor Azure Event Hubs
ms.topic: article
ms.date: 02/25/2021
---

# Azure Event Hubs metrics in Azure Monitor

Event Hubs metrics give you the state of Event Hubs resources in your Azure subscription. With a rich set of metrics data, you can assess the overall health of your event hubs not only at the namespace level, but also at the entity level. These statistics can be important as they help you to monitor the state of your event hubs. Metrics can also help troubleshoot root-cause issues without needing to contact Azure support.

Azure Monitor provides unified user interfaces for monitoring across various Azure services. For more information, see [Monitoring in Microsoft Azure](../azure-monitor/overview.md) and the [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub.

## Access metrics

Azure Monitor provides multiple ways to access metrics. You can either access metrics through the [Azure portal](https://portal.azure.com), or use the Azure Monitor APIs (REST and .NET) and analysis solutions such as Log Analytics and Event Hubs. For more information, see [Monitoring data collected by Azure Monitor](../azure-monitor/data-platform.md).

Metrics are enabled by default, and you can access the most recent 30 days of data. If you need to keep data for a longer period of time, you can archive metrics data to an Azure Storage account. This setting can be configured in [diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md) in Azure Monitor.


## Access metrics in the portal

You can monitor metrics over time in the [Azure portal](https://portal.azure.com). The following example shows how to view successful requests and incoming requests at the account level:

![View successful metrics][1]

You can also access metrics directly via the namespace. To do so, select your namespace and then select **Metrics**. To display metrics filtered to the scope of the event hub, select the event hub and then select **Metrics**.

For metrics supporting dimensions, you must filter with the desired dimension value as shown in the following example:

![Filter with dimension value][2]

## Billing

Using metrics in Azure Monitor is currently free. However, if you use other solutions that ingest metrics data, you may be billed by these solutions. For example, you are billed by Azure Storage if you archive metrics data to an Azure Storage account. You are also billed by Azure if you stream metrics data to Azure Monitor logs for advanced analysis.

The following metrics give you an overview of the health of your service. 

> [!NOTE]
> We are deprecating several metrics as they are moved under a different name. This might require you to update your references. Metrics marked with the "deprecated" keyword will not be supported going forward.

All metrics values are sent to Azure Monitor every minute. The time granularity defines the time interval for which metrics values are presented. The supported time interval for all Event Hubs metrics is 1 minute.

## Azure Event Hubs metrics
For a list of metrics supported by the service, see [Azure Event Hubs](../azure-monitor/essentials/metrics-supported.md#microsofteventhubnamespaces)

> [!NOTE]
> When a user error occurs, Azure Event Hubs updates the **User Errors** metric, but doesn't log any other diagnostic information. Therefore, you need to capture details on user errors in your applications. Or, you can also convert the telemetry generated when messages are sent or received into application insights. For an example, see [Tracking with Application Insights](../service-bus-messaging/service-bus-end-to-end-tracing.md#tracking-with-azure-application-insights).

## Azure Monitor integration with SIEM tools
Routing your monitoring data (activity logs, diagnostics logs, and so on.) to an event hub with Azure Monitor enables you to easily integrate with Security Information and Event Management (SIEM) tools. For more information, see the following articles/blog posts:

- [Stream Azure monitoring data to an event hub for consumption by an external tool](../azure-monitor/essentials/stream-monitoring-data-event-hubs.md)
- [Introduction to Azure Log Integration](/previous-versions/azure/security/fundamentals/azure-log-integration-overview)
- [Use Azure Monitor to integrate with SIEM tools](https://azure.microsoft.com/blog/use-azure-monitor-to-integrate-with-siem-tools/)

In the scenario where an SIEM tool consumes log data from an event hub, if you see no incoming messages or you see incoming messages but no outgoing messages in the metrics graph, follow these steps:

- If there are **no incoming messages**, it means that the Azure Monitor service isn't moving audit/diagnostics logs into the event hub. Open a support ticket with the Azure Monitor team in this scenario. 
- if there are incoming messages, but **no outgoing messages**, it means that the SIEM application isn't reading the messages. Contact the SIEM provider to determine whether the configuration of the event hub those applications is correct.


## Next steps

* See the [Azure Monitoring overview](../azure-monitor/overview.md).
* [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub. 

For more information about Event Hubs, visit the following links:

- Get started with an Event Hubs tutorial
    - [.NET Core](event-hubs-dotnet-standard-getstarted-send.md)
    - [Java](event-hubs-java-get-started-send.md)
    - [Python](event-hubs-python-get-started-send.md)
    - [JavaScript](event-hubs-node-get-started-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)

[1]: ./media/event-hubs-metrics-azure-monitor/event-hubs-monitor1.png
[2]: ./media/event-hubs-metrics-azure-monitor/event-hubs-monitor2.png

---
title: Azure Event Hubs metrics in Azure Monitor (preview) | Microsoft Docs
description: Use Azure Monitoring to monitor Event Hubs
services: event-hubs
documentationcenter: .NET
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/16/2018
ms.author: shvija

---
# Azure Event Hubs metrics in Azure Monitor (preview)

Event Hubs metrics gives you the state of Event Hubs resources in your Azure subscription. With a rich set of metrics data, you can assess the overall health of your event hubs not only at the namespace level, but also at the entity level. These statistics can be important as they help you to monitor the state of your event hubs. Metrics can also help troubleshoot root-cause issues without needing to contact Azure support.

Azure Monitor provides unified user interfaces for monitoring across various Azure services. For more information, see [Monitoring in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview.md) and the [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub.

## Access metrics

Azure Monitor provides multiple ways to access metrics. You can either access metrics through the [Azure portal](https://portal.azure.com), or use the Azure Monitor APIs (REST and .NET) and analysis solutions such as Operation Management Suite and Event Hubs. For more information, see [Monitoring data collected by Azure Monitor](../monitoring/monitoring-data-collection.md).

Metrics are enabled by default, and you can access the most recent 30 days of data. If you need to retain data for a longer period of time, you can archive metrics data to an Azure Storage account. This is configured in [diagnostic settings](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#diagnostic-settings) in Azure Monitor.

## Access metrics in the portal

You can monitor metrics over time in the [Azure portal](https://portal.azure.com). The following example shows how to view successful requests and incoming requests at the account level:

![][1]

You can also access metrics directly via the namespace. To do so, select your namespace and then click **Metrics (Peview)**. To display metrics filtered to the scope of the event hub, select the event hub and then click **Metrics (preview)**.

For metrics supporting dimensions, you must filter with the desired dimension value as shown in the following example:

![][2]

## Billing

Using metrics in Azure Monitor is currently free while in preview. However, if you use additional solutions that ingest metrics data, you may be billed by these solutions. For example, you are billed by Azure Storage if you archive metrics data to an Azure Storage account. You are also billed by Azure if you stream metrics data to Log Analytics for advanced analysis.

The following metrics give you an overview of the health of your service. 

> [!NOTE]
> We are deprecating several metrics as they are moved under a different name. This might require you to update your references. Metrics marked with the "deprecated" keyword will not be supported going forward.

All metrics values are sent to Azure Monitor every minute. The time granularity defines the time interval for which metrics values are presented. The supported time interval for all Event Hubs metrics is 1 minute.

## Request metrics

Counts the number of data and management operations requests.

| Metric Name | Description |
| ------------------- | ----------------- |
| Incoming Requests (preview) | The number of requests made to the Azure Event Hubs service over a specified period. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName |
| Successful Requests (preview)   | The number of successful requests made to the Azure Event Hubs service over a specified period. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName |
| Server Errors (preview) | The number of requests not processed due to an error in the Azure Event Hubs service over a specified period. <br/><br/>Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName |
|User Errors (preview)|The number of requests not processed due to user errors over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Throttled Requests (preview)|The number of requests that were throttled because the throughput unit usage was exceeded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Quota Exceeded Errors (preview)|The number of requests exceeded the available quota. See [this article](event-hubs-quotas.md) for more information about Event Hubs quotas.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Throughput metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Throttled Requests (preview)|The number of requests that were throttled because the throughput unit usage was exceeded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Message metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Incoming Messages (preview)|The number of events or messages sent to Event Hubs over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Outgoing Messages (preview)|The number of events or messages retrieved from Event Hubs over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Incoming Bytes (preview)|The number of bytes sent to the Azure Event Hubs service over a specified period.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Outgoing Bytes (preview)|The number of bytes retrieved from the Azure Event Hubs service over a specified period.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Connection metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|ActiveConnections (preview)|The number of active connections on a namespace as well as on an entity.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Connections Opened (preview)|The number of open connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Connections Closed (preview)|The number of closed connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Event Hubs Capture metrics

You can monitor Event Hubs Capture metrics when you enable the Capture feature for your event hubs. The following metrics describe what you can monitor with Capture enabled.

| Metric Name | Description |
| ------------------- | ----------------- |
|Capture Backlog (Preview)|The number of bytes that are yet to be captured to the chosen destination.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Captured Messages (Preview)|The number of messages or events that are captured to the chosen destination over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Captured Bytes (Preview)|The number of bytes that are captured to the chosen destination over a specified period.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Metrics dimensions

Azure Event Hubs supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you do not add dimensions, metrics are specified at the namespace level. 

| Metric Name | Description |
| ------------------- | ----------------- |
|EntityName| Event Hubs supports the event hub entities under the namespace.|

## Next steps

* See the [Azure Monitoring overview](../monitoring-and-diagnostics/monitoring-overview.md).
* [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub. 

For more information about Event Hubs, visit the following links:

* Get started with an [Event Hubs tutorial](event-hubs-dotnet-standard-getstarted-send.md)
* [Event Hubs FAQ](event-hubs-faq.md)
* [Sample applications that use Event Hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples)

[1]: ./media/event-hubs-metrics-azure-monitor/event-hubs-monitor1.png
[2]: ./media/event-hubs-metrics-azure-monitor/event-hubs-monitor2.png




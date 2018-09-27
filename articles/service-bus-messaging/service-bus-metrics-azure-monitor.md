---
title: Azure Service Bus metrics in Azure Monitor (preview) | Microsoft Docs
description: Use Azure Monitoring to monitor Service Bus entities
services: service-bus-messaging
documentationcenter: .NET
author: spelluru
manager: timlt

ms.service: service-bus-messaging
ms.topic: article
ms.date: 09/24/2018
ms.author: spelluru

---
# Azure Service Bus metrics in Azure Monitor (preview)

Service Bus metrics give you the state of resources in your Azure subscription. With a rich set of metrics data, you can assess the overall health of your Service Bus resources, not only at the namespace level, but also at the entity level. These statistics can be important as they help you to monitor the state of Service Bus. Metrics can also help troubleshoot root-cause issues without needing to contact Azure support.

Azure Monitor provides unified user interfaces for monitoring across various Azure services. For more information, see [Monitoring in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview.md) and the [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub.

> [!IMPORTANT]
> When there has not been any interaction with an entity for 2 hours, the metrics will start showing "0" as a value until the entity is no longer idle.

## Access metrics

Azure Monitor provides multiple ways to access metrics. You can either access metrics through the [Azure portal](https://portal.azure.com), or use the Azure Monitor APIs (REST and .NET) and analysis solutions such as Log Analytics and Event Hubs. For more information, see [Monitoring data collected by Azure Monitor](../monitoring/monitoring-data-collection.md).

Metrics are enabled by default, and you can access the most recent 30 days of data. If you need to retain data for a longer period of time, you can archive metrics data to an Azure Storage account. This is configured in [diagnostic settings](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#diagnostic-settings) in Azure Monitor.

## Access metrics in the portal

You can monitor metrics over time in the [Azure portal](https://portal.azure.com). The following example shows how to view successful requests and incoming requests at the account level:

![][1]

You can also access metrics directly via the namespace. To do so, select your namespace and then click **Metrics (Preview)**. To display metrics filtered to the scope of the entity, select the entity and then click **Metrics (preview)**.

![][2]

For metrics supporting dimensions, you must filter with the desired dimension value.

## Billing

Using metrics in Azure Monitor is free while in preview. However, if you use additional solutions that ingest metrics data, you may be billed by these solutions. For example, you are billed by Azure Storage if you archive metrics data to an Azure Storage account. You are also billed by Log Analytics if you stream metrics data to Log Analytics for advanced analysis.

The following metrics give you an overview of the health of your service. 

> [!NOTE]
> We are deprecating several metrics as they are moved under a different name. This might require you to update your references. Metrics marked with the "deprecated" keyword will not be supported going forward.

All metrics values are sent to Azure Monitor every minute. The time granularity defines the time interval for which metrics values are presented. The supported time interval for all Service Bus metrics is 1 minute.

## Request metrics

Counts the number of data and management operations requests.

| Metric Name | Description |
| ------------------- | ----------------- |
| Incoming Requests (preview) | The number of requests made to the Service Bus service over a specified period. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Successful Requests (preview)|The number of successful requests made to the Service Bus service over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Server Errors (preview)|The number of requests not processed due to an error in the Service Bus service over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|User Errors (preview - see the following subsection)|The number of requests not processed due to user errors over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Throttled Requests (preview)|The number of requests that were throttled because the usage was exceeded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|

### User errors

The following two types of errors are classified as user errors:

1. Client-side errors (In HTTP that would be 400 errors).
2. Errors that occur while processing messages, such as [MessageLockLostException](/dotnet/api/microsoft.azure.servicebus.messagelocklostexception).


## Message metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Incoming Messages (preview)|The number of events or messages sent to Service Bus over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Outgoing Messages (preview)|The number of events or messages received from Service Bus over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Connection metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|ActiveConnections (preview)|The number of active connections on a namespace as well as on an entity.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Connections Opened (preview)|The number of open connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|Connections Closed (preview)|The number of closed connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName |

## Resource usage metrics

> [!NOTE] 
> The following metrics are available only with the **premium** tier. 

| Metric Name | Description |
| ------------------- | ----------------- |
|CPU usage per namespace (preview)|The percentage CPU usage of the namespace.<br/><br/> Unit: Percent <br/> Aggregation Type: Maximum <br/> Dimension: EntityName|
|Memory size usage per namespace (preview)|The percentage memory usage of the namespace.<br/><br/> Unit: Percent <br/> Aggregation Type: Maximum <br/> Dimension: EntityName|

## Metrics dimensions

Azure Service Bus supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you do not add dimensions, metrics are specified at the namespace level. 

|Dimension name|Description|
| ------------------- | ----------------- |
|EntityName| Service Bus supports messaging entities under the namespace.|

## Next steps

See the [Azure Monitoring overview](../monitoring-and-diagnostics/monitoring-overview.md).

[1]: ./media/service-bus-metrics-azure-monitor/service-bus-monitor1.png
[2]: ./media/service-bus-metrics-azure-monitor/service-bus-monitor2.png



---
title: Azure Service Bus metrics in Azure Monitor (preview) | Microsoft Docs
description: Use Azure Monitoring to monitor Service Bus entities
services: service-bus-messaging
documentationcenter: .NET
author: christianwolf42
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-bus-messaging
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/19/2017
ms.author: sethm

---
# Azure Service Bus metrics in Azure Monitor (preview)

Service Bus metrics gives you the state of resources in your Azure subscription. With a rich set of metrics data, you can assess the overall health of your Service Bus resources, not only at the namespace level, but also at the entity level. These statistics can be important as they help you to monitor the state of Service Bus. Metrics can also help troubleshoot root-cause issues without needing to contact Azure support.

Azure Monitor provides unified user interfaces for monitoring across various Azure services. For more information, see [Monitoring in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview.md).

## Access metrics

Azure Monitor provides multiple ways to access metrics. You can either access metrics through the [Azure portal](https://portal.azure.com), or use the Azure Monitor APIs (REST and .NET) and analysis solutions such as Operation Management Suite and Event Hubs. For more information, see [Azure Monitor metrics](../monitoring-and-diagnostics/monitoring-overview-metrics.md).

Metrics are enabled by default, and you can access the most recent 30 days of data. If you need to retain data for a longer period of time, you can archive metrics data to an Azure Storage account. This is configured in [diagnostic settings](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md#resource-diagnostic-settings) in Azure Monitor.

## Access metrics in the portal

You can monitor metrics over time in the [Azure portal](https://portal.azure.com). The following example shows how to view successful requests and incoming requests at the account level:

![][1]

For metrics supporting dimensions, you must filter with the desired dimension value as shown in the following example:

![][2]

## Billing

Using metrics in Azure Monitor is currently free while in preview. However, if you use additional solutions that ingest metrics data, you may be billed by these solutions. For example, you are billed by Azure Storage if you archive metrics data to an Azure Storage account. You are also billed by Operation Management Suite (OMS) if you stream metrics data to OMS for advanced analysis.

The following metrics give you an overview of the health of your service. 

> [!NOTE]
> We are deprecating several metrics as they are moved under a different name. This might require you to update your references. Metrics marked with the "deprecated" keyword will not be supported going forward.

All metrics values are sent to Azure Monitor every minute. The time granularity defines the time interval for which metrics values are presented. The supported time interval for all Service Bus metrics is 1 minute.

## Request metrics

Counts the number of data and management operations requests.

|Metric name|Description|
|---|---|
|Incoming Requests (preview)|The number of requests made to the Service Bus service over a specified period.
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Successful Requests (preview)|The number of successful requests made to the Service Bus service over a specified period.
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Server Errors (preview)|The number of requests not processed due to an error in the Service Bus service over a specified period.
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|User Errors (preview)|The number of requests not processed due to user errors over a specified period. 
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Throttled Requests (preview)|The number of requests that were throttled because the usage was exceeded. 
Unit: Count
AggregationType: Total
Dimension: EntityName|

## Message metrics

|Metric name|Description|
|---|---|
|Incoming Messages (preview)|The number of events or messages sent to Service Bus over a specified period.
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Outgoing Messages (preview)|The number of events or messages received from Service Bus over a specified period.
Unit: Count
AggregationType: Total
Dimension: EntityName|

## Connection metrics

|Metric name|Description|
|---|---|
|ActiveConnections (preview)|The number of active connections on a namespace as well as on an entity.
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Connections Opened (preview)|The number of open connections.
Unit: Count
AggregationType: Total
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Connections Closed (preview)|The number of closed connections.
Unit: Count
AggregationType: Total
Dimension: EntityName|

## Memory usage metrics

|Metric name|Description|
|---|---|
|CPU usage per namespace (preview)|The percentage CPU usage of the namespace.
Unit: Percent
AggregationType: Maximum
Dimension: EntityName|

|Metric name|Description|
|---|---|
|Memory size usage per namespace (preview)|The percentage memory usage of the namespace.
Unit: Percent
AggregationType: Maximum
Dimension: EntityName|

## Metrics dimensions

Azure Service Bus supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you do not add dimensions, metrics are specified at the namespace level. 

|Dimension name|Description|
|---|---|
|EntityName| Service Bus supports messaging entities under the namespace.|

## Next steps

See the [Azure Monitoring overview](../monitoring-and-diagnostics/monitoring-overview.md).

[1]: ./media/service-bus-metrics-azure-monitor/sb-monitor1.png
[2]: ./media/service-bus-metrics-azure-monitor/sb-monitor2.png




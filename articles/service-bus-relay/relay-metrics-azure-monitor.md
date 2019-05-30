---
title: Azure Relay metrics in Azure Monitor (preview) | Microsoft Docs
description: Use Azure Monitoring to monitor Azure Relay
services: service-bus-relay
documentationcenter: .NET
author: spelluru
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-bus-relay
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2018
ms.author: spelluru

---
# Azure Relay metrics in Azure Monitor (preview)
Azure Relay metrics give you the state of resources in your Azure subscription. With a rich set of metrics data, you can assess the overall health of your Relay resources, not only at the namespace level, but also at the entity level. These statistics can be important as they help you to monitor the state of Azure Relay. Metrics can also help troubleshoot root-cause issues without needing to contact Azure support.

Azure Monitor provides unified user interfaces for monitoring across various Azure services. For more information, see [Monitoring in Microsoft Azure](../monitoring-and-diagnostics/monitoring-overview.md) and the [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub.

> [!IMPORTANT]
> This article applies only to the Hybrid Connections feature of Azure Relay, not to the WCF Relay. 

## Access metrics

Azure Monitor provides multiple ways to access metrics. You can either access metrics through the [Azure portal](https://portal.azure.com), or use the Azure Monitor APIs (REST and .NET) and analysis solutions such as Operation Management Suite and Event Hubs. For more information, see [Monitoring data collected by Azure Monitor](../azure-monitor/platform/data-platform.md).

Metrics are enabled by default, and you can access the most recent 30 days of data. If you need to retain data for a longer period of time, you can archive metrics data to an Azure Storage account. This is configured in [diagnostic settings](../azure-monitor/platform/diagnostic-logs-overview.md#diagnostic-settings) in Azure Monitor.

## Access metrics in the portal

You can monitor metrics over time in the [Azure portal](https://portal.azure.com). The following example shows how to view successful requests and incoming requests at the account level:

![][1]

You can also access metrics directly via the namespace. To do so, select your namespace and then click **Metrics (Preview)**. 

For metrics supporting dimensions, you must filter with the desired dimension value.

## Billing

Using metrics in Azure Monitor is currently free while in preview. However, if you use additional solutions that ingest metrics data, you may be billed by these solutions. For example, you are billed by Azure Storage if you archive metrics data to an Azure Storage account. You are also billed by Azure Monitor logs if you stream metrics data to Azure Monitor logs for advanced analysis.

The following metrics give you an overview of the health of your service. 

> [!NOTE]
> We are deprecating several metrics as they are moved under a different name. This might require you to update your references. Metrics marked with the "deprecated" keyword will not be supported going forward.

All metrics values are sent to Azure Monitor every minute. The time granularity defines the time interval for which metrics values are presented. The supported time interval for all Azure Relay metrics is 1 minute.

## Connection metrics

| Metric Name | Description |
| ------------------- | ----------------- |
| ListenerConnections-Success (preview) | The number of successful listener connections made to Azure Relay over a specified period. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|ListenerConnections-ClientError (preview)|The number of client errors on listener connections over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|ListenerConnections-ServerError (preview)|The number of server errors on the listener connections over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|SenderConnections-Success (preview)|The number of successful sender connections made over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|SenderConnections-ClientError (preview)|The number of client errors on sender connections over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|SenderConnections-ServerError (preview)|The number of server errors on sender connections over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|ListenerConnections-TotalRequests (preview)|The total number of listener connections over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|SenderConnections-TotalRequests (preview)|The connection requests made by the senders over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|ActiveConnections (preview)|The number of active connections over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|ActiveListeners (preview)|The number of active listeners over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|ListenerDisconnects (preview)|The number of disconnected listeners over a specified period.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|
|SenderDisconnects (preview)|The number of disconnected senders over a specified period.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Memory usage metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|BytesTransferred (preview)|The number of bytes transferred over a specified period.<br/><br/> Unit: Bytes <br/> Aggregation Type: Total <br/> Dimension: EntityName|

## Metrics dimensions

Azure Relay supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you do not add dimensions, metrics are specified at the namespace level. 

|Dimension name|Description|
| ------------------- | ----------------- |
|EntityName| Azure Relay supports messaging entities under the namespace.|

## Next steps

See the [Azure Monitoring overview](../monitoring-and-diagnostics/monitoring-overview.md).

[1]: ./media/relay-metrics-azure-monitor/relay-monitor1.png





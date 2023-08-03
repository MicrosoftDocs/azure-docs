---
title: 'Monitoring Azure Time Series Insights data reference | Microsoft Docs'
description: Reference documentation for monitoring Azure Time Series Insights.
author: esung22
ms.author: elsung
manager: cnovak
ms.reviewer: orspodek
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/10/2020
---

# Monitoring Azure Time Series Insights data reference

[!INCLUDE [retirement](../../includes/tsi-retirement.md)]

Learn about the data and resources collected by Azure Monitor from your Azure Time Series Insights environment. See [Monitoring Time Series Insights]( ./how-to-monitor-tsi.md) for details on collecting and analyzing monitoring data.

## Metrics

This section lists all the automatically collected platform metrics collected for Azure Time Series Insights. For a list of all Azure Monitor support metrics (including Azure Time Series Insights), see [Azure Monitor supported metrics](../azure-monitor/essentials/metrics-supported.md).
The resource provider for these metrics is [Microsoft.TimeSeriesInsights/environments/eventsources](../azure-monitor/essentials/metrics-supported.md#microsofttimeseriesinsightsenvironmentseventsources) and [Microsoft.TimeSeriesInsights/environments](../azure-monitor/essentials/metrics-supported.md#microsofttimeseriesinsightsenvironments).

### Ingress

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|IngressReceivedBytes|Ingress Received Bytes|Bytes|Total|Count of bytes read from the event source|
|IngressReceivedInvalidMessages|Ingress Received Invalid Messages|Count|Total|Count of invalid messages read from the event source|
|IngressReceivedMessages|Ingress Received Messages|Count|Total|Count of messages read from the event source|
|IngressReceivedMessagesCountLag|Ingress Received Messages Count Lag|Count|Average|Difference between the sequence number of last enqueued message in the event source partition and sequence number of messages being processed in Ingress|
|IngressReceivedMessagesTimeLag|Ingress Received Messages Time Lag|Seconds|Maximum|Difference between the time that the message is enqueued in the event source and the time it is processed in Ingress|
|IngressStoredBytes|Ingress Stored Bytes|Bytes|Total|Total size of events successfully processed and available for query|
|IngressStoredEvents|Ingress Stored Events|Count|Total|Count of flattened events successfully processed and available for query|

### Storage

|Metric|Metric Display Name|Unit|Aggregation Type|Description|
|---|---|---|---|---|
|WarmStorageMaxProperties|Warm Storage Max Properties|Count|Maximum|Maximum number of properties used allowed by the environment for S1/S2 SKU and maximum number of properties allowed by Warm Store for PAYG SKU|
|WarmStorageUsedProperties|Warm Storage Used Properties |Count|Maximum|Number of properties used by the environment for S1/S2 SKU and number of properties used by Warm Store for PAYG SKU|

## Resource logs

This section lists the types of resource logs you can collect for your Azure Time Series Insights environment.

| Category | Display Name | Description |
|----- |----- |----- |
| Ingress | TSIIngress | The Ingress category tracks errors that occur in the ingress pipeline. This category includes errors that occur when receiving events (such as failures to connect to an Event Source) and processing events (such as errors when parsing an event payload). |

## Schemas

The following schemas are in use by Azure Time Series Insights

### TSIIngress table

| Property | Description |
|----- |----- |
| TimeGenerated | Time (UTC) at which this event is generated. |
| Location | The location of the resource. |
| Category | Category of the log event. |
| OperationName | Operation name of the event. |
| CorrelationId | The correlation ID of the request. |
| Level | The severity level of the event. |
| ResultDescription | Description of the result of the operation, such as 'Received forbidden error'. |
| Message | The message associated with the error. Includes details on what went wrong and how to mitigate the error. |
| ErrorCode | The code associated with the error |
| EventSourceType | The type of event source. It could either be Event hub or IoT hub. |
| EventSourceProperties | A collection of properties specific to your event source. Contains details such as the consumer group and the access key name. |

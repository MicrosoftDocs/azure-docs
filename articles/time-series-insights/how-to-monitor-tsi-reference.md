---
title: 'Monitoring Azure Time Series Insights data reference | Microsoft Docs'
description: Reference documentation for monitoring Azure Time Series Insights.
author: deepakpalled
ms.author: lyranahughes
manager: diviso
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/10/2020
ms.custom: lyrana
---

# Monitoring Azure Time Series Insights data reference

Reference documentation for monitoring Azure Time Series Insights. Learn about the data and resources collected and available in Azure Monitor.

See [Monitoring Time Series Insights]( ./how-to-monitor-tsi.md) for details on collecting and analyzing monitoring data for Azure Time Series Insights.

## Metrics

**Metrics intro paragraph.**

### Ingress

   |Metric  |Unit |Aggregation Type |Description |
   |---------|---------|---------|---------|
   |**Ingress Received Bytes** |  |  |Count of raw bytes read from event sources. Raw count usually includes the property name and value.|
   |**Ingress Received Invalid Messages** |  |  |Count of messages read from all Event Hubs or IoT Hubs event sources. |
   |**Ingress Received Messages** |  |  |Count of invalid messages read from all Azure Event Hubs or Azure IoT Hub event sources. |
   |**Ingress Stored Bytes** |  |  |Total size of events stored and available for query. Size is computed only on the property value. |
   |**Ingress Stored Events** |  |  |Count of flattened events stored and available for query. |
   |**Ingress Received Message Time Lag** |  |  |Difference in seconds between the time that the message is enqueued in the event source and the time it is processed in Ingress. |
   |**Ingress Received Message Count Lag** |  |  |Difference between the sequence number of last enqueued message in the event source partition and sequence number of message being processed in Ingress. |

### Storage

   |Metric Display Name |Unit |Aggregation Type |Description |
   |---------|---------|---------|---------|
   |**Failed twin reads from back end** |Count |Total |The count of all failed back-end-initiated twin reads. |
   |**Failed twin updates from back end** |Count |Total |The count of all failed back-end-initiated twin updates. |
   |**Response size of twin reads from back end** |Bytes |Average |The count of all successful back-end-initiated twin reads. |
   |**Size of twin updates from back end** |Bytes |Average |The total size of all successful back-end-initiated twin updates. |
   |**Successful twin reads from back end** |Count |Total| The count of all successful back-end-initiated twin reads. |
   |**Successful twin updates from back end** |Count |Total |The count of all successful back-end-initiated twin updates. |

## Resource logs

This section lists the types of resource logs you can collect for your Azure Time Series Insights workspace. Resource Providers and Type:  [Microsoft.TimeSeriesInsights/environments](place holder link). [Microsoft.TimeSeriesInsights/environments/eventsources](place holder link).

| Category | Display Name | Description |
|----- |----- |----- |
| Ingress | Ingress | The Ingress category tracks errors that occur in the ingress pipeline. This category includes errors that occur when receiving events (such as failures to connect to an Event Source) and processing events (such as errors when parsing an event payload). |

## Schemas
The following schemas are in use by Azure Time Series Insights

### Ingress table

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

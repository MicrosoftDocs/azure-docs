---
title: Microsoft Azure Service Bus quotas and limits
description: This article lists basic quotas and throttling thresholds in Azure Service Bus messaging. For example, maximum number of namespaces per subscription. 
ms.topic: reference
ms.date: 10/13/2026
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-service-bus
---

# Service Bus quotas
This section lists basic quotas and throttling thresholds in Azure Service Bus messaging.

## Messaging quotas
[!INCLUDE [service-bus-quotas-table](../../includes/service-bus-quotas-table.md)]

> [!NOTE]
> The **Number of topics or queues per namespace** limit is a maximum quota, not a performance-sizing target. Namespace requirements depend on the active entity count and workload characteristics. For more information, see [Plan namespace capacity by workload](service-bus-performance-improvements.md#plan-namespace-capacity-by-workload).

## Monitor quota usage and throttling

Use Azure Monitor metrics to track usage and identify throttling. Some metrics measure usage that you can compare with a quota, while others indicate resource pressure or rejected requests. The following table maps quota and capacity concerns to metric display names and their REST API names.

| Quota or capacity concern | Metric display name | Name in REST API | How to interpret the metric |
| --- | --- | --- | --- |
| Concurrent connections on a namespace | ActiveConnections | `ActiveConnections` | Tracks active connections on the namespace. The metric has no protocol dimension, so it doesn't separate usage for the protocol-specific connection limits. `ConnectionsOpened` and `ConnectionsClosed` track connection activity over time rather than concurrent usage. |
| Queue or topic size | Size | `Size` | Measures the entity size in bytes. Use the `EntityName` dimension to select the queue or topic, and compare its size with its configured maximum size. This metric measures entity storage, not the size of an individual message. |
| Operations per second and Standard tier credit-based throttling | Incoming Requests; Throttled Requests | `IncomingRequests`; `ThrottledRequests` | Tracks request volume and throttled requests. Request counts don't measure credit consumption or remaining credits. Management operations and topic filter evaluations have different credit costs. For details, see [Credit limits](service-bus-throttling.md#what-are-the-credit-limits). |
| Premium namespace resource capacity | CPU; Memory Usage; Throttled Requests | `NamespaceCpuUsage`; `NamespaceMemoryUsage`; `ThrottledRequests` | CPU and memory percentages help identify resource pressure; throttled requests show when requests are throttled. Premium throughput depends on the allocated resources and workload rather than a fixed operations-per-second quota. See [Throttling in Premium tier](service-bus-throttling.md#throttling-in-premium-tier). |
| Premium pending checkpoint operations | Pending Checkpoint Operations Count | `PendingCheckpointOperationCount` | Tracks pending checkpoint operations on the namespace. Compare with the messaging-unit-dependent threshold described in [Request metrics](monitor-service-bus-reference.md#request-metrics). |

For supported units, dimensions, aggregations, and sampling intervals, see the [Service Bus monitoring data reference](monitor-service-bus-reference.md#supported-metrics-for-microsoftservicebusnamespaces). Choose a time range and aggregation appropriate to the metric; counts over a time interval and point-in-time usage have different meanings.

### Limits without a dedicated usage metric

The [supported metric catalog](monitor-service-bus-reference.md#supported-metrics-for-microsoftservicebusnamespaces) doesn't list a dedicated usage metric for every quota:

- **Namespace size**: `Size` measures a queue or topic, not total namespace storage usage.
- **Concurrent receive requests**: `ActiveConnections` measures connections, not in-flight receive requests. For the limit and mitigation guidance, see [Throttling when concurrent receive requests exceed the limit](service-bus-throttling.md#throttling-when-concurrent-receive-requests-exceed-the-limit).
- **Resource counts and configuration limits**: Namespace, queue, topic, subscription, filter, and authorization-rule counts; name lengths; message and property sizes; session-state counts; and per-transaction message counts have no dedicated quota-usage metric in the catalog. Check the relevant resource configuration or operation result against the quota tables.

Use `UserErrors`, `ServerErrors`, and `ThrottledRequests` to identify failed or throttled requests, then inspect the operation's error details to determine the cause. These metrics alone don't identify which quota, if any, a request exceeds.

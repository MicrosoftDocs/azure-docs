---
title: Metrics in Azure Web PubSub service
description: Metrics in Azure Web PubSub service.
author: zackliu
ms.service: azure-web-pubsub
ms.topic: conceptual
ms.date: 04/08/2022
ms.author: chenyl
---
# Metrics in Azure Web PubSub Service

Azure Web PubSub service has some built-in metrics and you and sets up [alerts](../azure-monitor/alerts/alerts-overview.md) base on metrics.

## Understand metrics

Metrics provide the running info of the service. The available metrics are:

|Metric|Unit|Recommended Aggregation Type|Description|Dimensions|
|---|---|---|---|---|
|Connection Close Count|Count|Sum|The count of connections closed by various reasons.|ConnectionCloseCategory|
|Connection Count|Count|Max / Avg|The number of connections to the service.|No Dimensions|
|Connection Open Count|Count|Sum|The count of new connections opened.|No Dimensions|
|Connection Quota Utilization|Percent|Max / Avg|The percentage of connections relative to connection quota.|No Dimensions|
|Inbound Traffic|Bytes|Sum|The inbound traffic to the service.|No Dimensions|
|Outbound Traffic|Bytes|Sum|The outbound traffic from the service.|No Dimensions|
|Server Load|Percent|Max / Avg|The percentage of server load.|No Dimensions|

### Understand Dimensions

Dimensions of a metric are name/value pairs that carry extra data to describe the metric value.

The dimension available in some metrics:

* ConnectionCloseCategory: Describe the categories of why connection getting closed. Including dimension values: 
    - Normal: Normal closure.
    - Throttled: With traffic or connection throttling, check Connection Count and Outbound Traffic usage and your resource limits.
    - SendEventFailed: Event handler invokes failed.
    - EventHandlerNotFound: Event handler not found.
    - SlowClient: Too many messages queued up at service side, which needed to be sent.
    - ServiceTransientError: Internal server error.
    - BadRequest: Caused by an invalid hub name, wrong payload, etc.
    - ServiceReload: Triggered when a connection is dropped due to an internal service component reload. This event doesn't indicate a malfunction and is part of normal service operation.
    - Unauthorized: The connection is unauthorized.

Learn more about [multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics)

## Related resources

- [Aggregation types in Azure Monitor](../azure-monitor/essentials/metrics-supported.md#microsoftsignalrservicewebpubsub)

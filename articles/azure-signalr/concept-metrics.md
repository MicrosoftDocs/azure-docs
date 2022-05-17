---
title: Metrics in Azure SignalR Service
description: Metrics in Azure SignalR Service.
author: zackliu
ms.service: signalr
ms.topic: conceptual
ms.date: 04/12/2022
ms.author: chenyl
---
# Metrics in Azure SignalR Service

Azure SignalR Service Defines a set of metrics that can be used to set up [alerts](../azure-monitor/alerts/alerts-overview.md) and [autoscale conditions](./signalr-howto-scale-autoscale.md).

## Understand metrics

Metrics provide insights into the operational state of the service. The available metrics are:

> [!CAUTION]
> The aggregation type "Count" is meaningless for all the metrics. Please DO NOT use it.

|Metric|Unit|Recommended Aggregation Type|Description|Dimensions|
|---|---|---|---|---|
|Connection Close Count|Count|Sum|The count of connections closed by various reasons.|Endpoint, ConnectionCloseCategory|
|Connection Count|Count|Max / Avg|The amount of connection.|Endpoint|
|Connection Open Count|Count|Sum|The count of new connections opened.|Endpoint|
|Connection Quota Utilization|Percent|Max / Avg|The percentage of connection connected relative to connection quota.|No Dimensions|
|Inbound Traffic|Bytes|Sum|The inbound traffic of service|No Dimensions|
|Message Count|Count|Sum|The total number of messages.|No Dimensions|
|Outbound Traffic|Bytes|Sum|The outbound traffic of service|No Dimensions|
|System Errors|Percent|Avg|The percentage of system errors|No Dimensions|
|User Errors|Percent|Avg|The percentage of user errors|No Dimensions|
|Server Load|Percent|Max / Avg|The percentage of server load|No Dimensions|

### Understand Dimensions

Dimensions of a metric are name/value pairs that carry extra data to describe the metric value.

The dimensions available in some metrics:

* Endpoint: Describe the type of connection. Including dimension values: Client, Server, LiveTrace
* ConnectionCloseCategory: Describe the categories of why connection getting closed. Including dimension values:
    - Normal: Normal closure.
    - Throttled: With (Message count/rate or connection) throttling, check Connection Count and Message Count current usage and your resource limits.
    - PingTimeout: Connection ping timeout.
    - NoAvailableServerConnection: Client connection can't be established (won't even pass handshake) as no available server connection.
    - InvokeUpstreamFailed: Upstream invoke failed.
    - SlowClient: Too many messages queued up at service side, which needed to be sent.
    - HandshakeError: Terminate connection in handshake phase, could be caused by the remote party closed the WebSocket connection without completing the close handshake. Mostly, it's caused by network issue. Otherwise, check if the client is able to create websocket connection due to some browser settings.
    - ServerConnectionNotFound: Target hub server not available. Nothing need to be done for improvement, it's is by-design and reconnection should be done after this drop.
    - ServerConnectionClosed: Client connection aborted because the corresponding server connection is dropped. When app server uses Azure SignalR Service SDK, in the background, it initiates server connections to the remote Azure SignalR service. Each client connection to the service is associated with one of the server connections to route traffic between client and app server. Once a server connection is closed, all the client connections it serves will be closed with ServerConnectionDropped message.
    - ServiceTransientError: Internal server error
    - BadRequest: A bad request is caused by an invalid hub name, wrong payload, &c.
    - ClosedByAppServer: App server asks the service to close the client.
    - ServiceReload: Service reload is triggered when a connection is dropped due to an internal service component reload. This event doesn't indicate a malfunction and is part of normal service operation.
    - ServiceModeSwitched: Connection closed after service mode switched like from serverless mode to default mode
    - Unauthorized: The connection is unauthorized

Learn more about [multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics)

### Understand the minimum grain of message count

The minimum grain of message count showed in metric is one (1), which means two KB of outbound data traffic. If user sending a small number of messages,  such as several bytes in a sampling time period, the message count will be zero (0).

The way to check out a small number of messages is using metrics *Outbound Traffic*, which is count by bytes.

### Understand system errors and user errors

The errors are the percentage of failure operations. Operations consist of connecting, sending a message, and so on. The difference between system error and User Error is that the former is the failure caused by our internal service error and the latter is caused by users. In normal case, the system errors should be very low and near to zero.

> [!IMPORTANT]
> In some cases, the user error will be always very high, especially in serverless case. In some browsers, when user closes the web page, the SignalR client doesn't close gracefully. The service will finally close it because of timeout. The timeout closure will be counted in the User Error metric. 

### Metrics suitable for autoscaling

Connection Quota Utilization and Server load are percentage metrics which show the usage **under current unit** configuration. So they could be used to set autoscaling rules. For example, you could set a rule to scale up if the server load is greater than 70%.

Learn more about [autoscale](./signalr-howto-scale-autoscale.md)

## Related resources

- [Aggregation types in Azure Monitor](../azure-monitor/essentials/metrics-supported.md#microsoftsignalrservicesignalr )

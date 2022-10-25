---
title: Metrics in Azure SignalR Service
description: Metrics in Azure SignalR Service.
author: zackliu
ms.service: signalr
ms.topic: conceptual
ms.date: 06/03/2022
ms.author: chenyl
---
# Metrics in Azure SignalR Service

Metrics in SignalR Service is an implementation of [Azure Monitor Metrics](../azure-monitor/essentials/data-platform-metrics.md). Understanding how Azure Monitor collects and displays metrics is helpful for using metrics in SignalR Service. Azure SignalR Service defines a collection of  metrics that can be used to set up [alerts](../azure-monitor/alerts/alerts-overview.md) and [autoscale conditions](./signalr-howto-scale-autoscale.md).

## SignalR Service metrics

Metrics provide insights into the operational state of the service. The available metrics are:

|Metric|Unit|Recommended Aggregation Type|Description|Dimensions|
|---|---|---|---|---|
|**Connection Close Count**|Count|Sum|The count of connections closed for various reasons; see ConnectionCloseCategory for details.|Endpoint, ConnectionCloseCategory|
|**Connection Count**|Count|Max or Avg|The number of connections.|Endpoint|
|**Connection Open Count**|Count|Sum|The count of new connections opened.|Endpoint|
|**Connection Quota Utilization**|Percent|Max or Avg|The percentage of connections to the server relative to the available quota.|No Dimensions|
|**Inbound Traffic**|Bytes|Sum|The volume of inbound traffic to the service.|No Dimensions|
|**Message Count**|Count|Sum|The total number of messages.|No Dimensions|
|**Outbound Traffic**|Bytes|Sum|The volume of outbound traffic from the service.|No Dimensions|
|**System Errors**|Percent|Avg|The percentage of system errors.|No Dimensions|
|**User Errors**|Percent|Avg|The percentage of user errors.|No Dimensions|
|**Server Load**|Percent|Max or Avg|The percentage of server load.|No Dimensions|

> [!NOTE]
> The aggregation type **Count** is the count of sampling data received. Count is defined as a general metrics aggregation type and can't be excluded from the list of available aggregation types. It's not generally useful for SignalR Service but it can sometimes be used to check if the sampling data has been sent to metrics.

### Metrics dimensions

A *dimension* is a name-value pair with extra data to describe the metric value. Some metrics don't have dimensions; others have multiple dimensions.

The following two sections describe the dimensions available in SignalR Service metrics.

#### Endpoint

Describes the type of connection. Includes dimension values: **Client**, **Server**, and **LiveTrace**.

#### ConnectionCloseCategory

Gives the reason for closing the connection. Includes the following dimension values.

|  Value | Description |
|---------|--------|
| **Normal** | Connection closed normally.|
|**Throttled**|With (Message count/rate or connection) throttling, check Connection Count and Message Count current usage and your resource limits.|
|**PingTimeout**|Connection ping timeout.|
|**NoAvailableServerConnection**|Client connection can't be established (won't even pass handshake) because there's no available server connection.|
|**InvokeUpstreamFailed**|Upstream invoke failed.|
|**SlowClient**|Too many unsent messages queued up at service side.|
|**HandshakeError**|Connection terminated in the handshake phase, could be caused by the remote party closing the WebSocket connection without completing the close handshake. HandshakeError is caused by a network issue. Check browser settings to see if the client is able to create a websocket connection.|
|**ServerConnectionNotFound**|Target hub server not available. Nothing need to be done for improvement, it's by design and reconnection should be done after this drop.|
|**ServerConnectionClosed**|Client connection closed because the corresponding server connection was dropped. When app server uses Azure SignalR Service SDK, in the background, it initiates server connections to the remote Azure SignalR Service. Each client connection to the service is associated with one of the server connections to route traffic between the client and app server. Once a server connection is closed, all the client connections it serves will be closed with the **ServerConnectionDropped** message.|
|**ServiceTransientError**|Internal server error.|
|**BadRequest**|A bad request is caused by an invalid hub name, wrong payload, or a malformed request.|
|**ClosedByAppServer**|App server asked the service to close the client.|
|**ServiceReload**|Service reload is triggered when a connection is dropped due to an internal service component reload. This event doesn't indicate a malfunction and is part of normal service operation.|
|**ServiceModeSwitched**|Connection closed after service mode switched, such as from Serverless mode to Default mode.|
|**Unauthorized**|The connection is unauthorized.|

For more information, see [multi-dimensional metrics](../azure-monitor/essentials/data-platform-metrics.md#multi-dimensional-metrics) in Azure Monitor.

### Message Count granularity

The minimum Message Count granularity is two KB of outbound data traffic. Every two KB is one unit for Message Count. If a client is sending small or infrequent messages totaling less than one unit in a sampling time period, the message count will be zero (0). The count is zero even though messages were sent. The way to check for a small number/size of messages is by using the metric **Outbound Traffic**, which is a count of bytes sent.

### System errors and user errors

The **User Errors** and **System Errors** metrics are the percentage of attempted operations (connecting, sending a message, and so on) that failed. A system error is a failure in the internal system logic. A user error is generally an application error, often related to networking. Normally, the percentage of system errors should be low, near zero.

> [!IMPORTANT]
> In some situations, the user errors rate will be very high, especially in Serverless mode. In some browsers, when a user closes the web page the SignalR client doesn't shut down gracefully. A connection may remain open but unresponsive, until SignalR Service will finally close it because of timeout. The timeout closure will be counted in the User Error metric.

### Metrics suitable for autoscaling

>[!NOTE]
> Autoscaling is a Premium Tier feature only.

**Connection Quota Utilization** and **Server Load** show the percentage of utilization or load compared to the currently allocated unit count. These metrics are commonly used in autoscaling rules.

For example, if the current allocation is one unit and there are 750 connections to the service, the Connection Quota Utilization is 750/1000 = 0.75. Server Load is calculated similarly, using values for compute capacity.

To learn more about autoscaling, see [Automatically scale units of an Azure SignalR Service](./signalr-howto-scale-autoscale.md)

## Related resources

- [Automatically scale units of an Azure SignalR Service](signalr-howto-scale-autoscale.md)
- [Azure Monitor Metrics](../azure-monitor/essentials/data-platform-metrics.md)
- [Understanding metrics aggregation](../azure-monitor/essentials/metrics-aggregation-explained.md)
- [Use diagnostic logs to monitor SignalR Service](signalr-howto-diagnostic-logs.md)
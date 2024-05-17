---
title: Monitoring data reference for Azure SignalR Service
description: This article contains important reference material you need when you monitor Azure SignalR Service.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: reference
author: vicancy
ms.author: lianwei
ms.service: signalr
---

# Azure SignalR Service monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

See [Monitor Azure SignalR Service](monitor-signalr.md) for details on the data you can collect for Azure SignalR Service and how to use it.

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

Metrics for Azure SignalR Service are in the **Errors**, **Saturation**, or **Traffic** categories.

### Supported metrics for Microsoft.SignalRService/SignalR
The following table lists the metrics available for the Microsoft.SignalRService/SignalR resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.SignalRService/SignalR](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-signalrservice-signalr-metrics-include.md)]

### Supported metrics for Microsoft.SignalRService/SignalR/replicas
The following table lists the metrics available for the Microsoft.SignalRService/SignalR/replicas resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]
[!INCLUDE [Microsoft.SignalRService/SignalR/replicas](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-signalrservice-signalr-replicas-metrics-include.md)]

For more details about the metrics for Azure SignalR Service, see [Azure SignalR Service metrics](monitor-signalr.md#azure-signalr-service-metrics).

> [!NOTE]
> The metrics aggregation types appear in metrics explorer in the Azure portal as **Count**, **Avg**, **Min**, **Max**, and **Sum**.
> 
> **Count** is the count of sampling data received. Count is defined as a general metrics aggregation type and can't be excluded from the list of available aggregation types. It's not generally useful for SignalR Service but can sometimes be used to check if the sampling data has been sent to metrics.

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions.md)]

### Endpoint

Describes the type of connection. Includes dimension values: **Client**, **Server**, and **LiveTrace**.

### ConnectionCloseCategory

Gives the reason for closing the connection. Includes the following dimension values.

|  Value | Description |
|---------|--------|
|**Normal** | Connection closed normally.|
|**Throttled**|With Message count/rate or connection throttling, check Connection Count and Message Count current usage and your resource limits.|
|**PingTimeout**|Connection ping timeout.|
|**NoAvailableServerConnection**|Client connection can't be established and doesn't pass handshake because there's no available server connection.|
|**InvokeUpstreamFailed**|Upstream invoke failed.|
|**SlowClient**|Too many unsent messages queued up at service side.|
|**HandshakeError**|Connection terminated in the handshake phase, which could be caused by the remote party closing the WebSocket connection without completing the close handshake. HandshakeError is caused by a network issue. Check browser settings to see if the client is able to create a websocket connection.|
|**ServerConnectionNotFound**|Target hub server not available. This value is by design and reconnection should be done after this drop.|
|**ServerConnectionClosed**|Client connection closed because the corresponding server connection was dropped. When app server uses Azure SignalR Service SDK, in the background, it initiates server connections to the remote Azure SignalR Service. Each client connection to the service is associated with one of the server connections to route traffic between the client and app server. Once a server connection is closed, all the client connections it serves are closed with the **ServerConnectionDropped** message.|
|**ServiceTransientError**|Internal server error.|
|**BadRequest**|A bad request is caused by an invalid hub name, wrong payload, or a malformed request.|
|**ClosedByAppServer**|App server asked the service to close the client.|
|**ServiceReload**|Service reload is triggered when a connection is dropped due to an internal service component reload. This event doesn't indicate a malfunction and is part of normal service operation.|
|**ServiceModeSwitched**|Connection closed after service mode switched, such as from Serverless mode to Default mode.|
|**Unauthorized**|The connection is unauthorized.|

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.SignalRService/SignalR
[!INCLUDE [Microsoft.SignalRService/SignalR](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-signalrservice-signalr-logs-include.md)]

### Supported resource logs for Microsoft.SignalRService/SignalR/replicas
[!INCLUDE [Microsoft.SignalRService/SignalR/replicas](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-signalrservice-signalr-replicas-logs-include.md)]

## Resource Log table mapping

Field names for Log Analytics vary slightly from field names for Storage destinations.

### Archive log schema for a storage account

Archive log JSON strings include the following elements:

**Format**

Name | Description
------- | -------
time | Log event time.
level | Log event level.
resourceId | Resource ID of the Azure SignalR Service.
location | Location of the Azure SignalR Service.
category | Category of the log event.
operationName | Operation name of the event.
callerIpAddress | IP address of the server/client.
properties | Detailed properties related to this log event, as listed in the following table.

**Properties**

Name | Description
------- | -------
type | Type of the log event. Currently, `ConnectivityLogs` type is available, to provide information about connectivity to the Azure SignalR Service.
collection | Collection of the log event. Allowed values are `Connection`, `Authorization`, or `Throttling`.
connectionId | Identity of the connection.
transportType | Transport type of the connection. Allowed values are `Websockets`, `ServerSentEvents`, or `LongPolling`.
connectionType | Type of the connection. Allowed values are `Server` or `Client`. `Server` is connection from server side and `Client` is connection from client side.
userId | Identity of the user.
message | Detailed message of log event.

### Archive logs schema for Log Analytics

Archive log columns include the following elements:

Name | Description
------- | ------- 
TimeGenerated | Log event time.
Collection | Collection of the log event. Allowed values are: `Connection`, `Authorization`, and `Throttling`.
OperationName | Operation name of the event.
Location | Location of the Azure SignalR Service.
Level | Log event level.
CallerIpAddress | IP address of the server/client.
Message | Detailed message of log event.
UserId | Identity of the user.
ConnectionId | Identity of the connection.
ConnectionType | Type of the connection. Allowed values are: `Server` or `Client`. `Server` is connection from server side and `Client` is connection from client side.
TransportType | Transport type of the connection. Allowed values are: `Websockets`, `ServerSentEvents`, or `LongPolling`

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### SignalR
Microsoft.SignalRService/SignalR

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [SignalRServiceDiagnosticLogs](/azure/azure-monitor/reference/tables/SignalRServiceDiagnosticLogs#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.SignalRService resource provider operations](/azure/role-based-access-control/permissions/web-and-mobile#microsoftsignalrservice)

## Related content

- See [Monitor Azure SignalR Service](monitor-signalr.md) for a description of monitoring Azure SignalR Service.
- See [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for details on monitoring Azure resources.
- See [Use diagnostic logs to monitor SignalR Service](signalr-howto-diagnostic-logs.md) for detailed instructions on how to enable, query, and troubleshoot with Azure SignalR Service logs.
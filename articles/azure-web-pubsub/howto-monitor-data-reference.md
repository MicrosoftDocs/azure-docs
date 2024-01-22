---
title: Monitoring Azure Web PubSub data reference
description: Important reference material needed when you monitor logs and metrics in Azure Web PubSub.
author: wanlwanl
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 05/15/2023
ms.author: wanl
---

# Monitoring Azure Web PubSub data reference

This article provides a reference of log and metric data collected to analyze the performance and availability of Azure Web PubSub. See the [Monitor Azure Web PubSub](howto-azure-monitor.md) article for details on collecting and analyzing monitoring data for Azure Web PubSub.

## Metrics

Metrics provide insights into the operational state of the service. The available metrics are:

|Metric|Unit|Recommended Aggregation Type|Description|Dimensions|
|---|---|---|---|---|
|Connection Close Count|Count|Sum|The count of connections closed by various reasons.|ConnectionCloseCategory|
|Connection Count|Count|Max / Avg|The number of connections to the service.|No Dimensions|
|Connection Open Count|Count|Sum|The count of new connections opened.|No Dimensions|
|Connection Quota Utilization|Percent|Max / Avg|The percentage of connections relative to connection quota.|No Dimensions|
|Inbound Traffic|Bytes|Sum|The inbound traffic to the service.|No Dimensions|
|Outbound Traffic|Bytes|Sum|The outbound traffic from the service.|No Dimensions|
|Server Load|Percent|Max / Avg|The percentage of server load.|No Dimensions|

For more information, see [Metrics](concept-metrics.md).

## Resource Logs

### Archive to a storage account

Archive log JSON strings include elements listed in the following tables:

**Format**

Name | Description
------- | -------
time | Log event time
level | Log event level
resourceId | Resource ID of your Azure SignalR Service
location | Location of your Azure SignalR Service
category | Category of the log event
operationName | Operation name of the event
callerIpAddress | IP address of your server or client
properties | Detailed properties related to this log event. For more detail, see the properties table below

**Properties Table**

Name | Description
------- | -------
collection | Collection of the log event. Allowed values are: `Connection`, `Authorization` and `Throttling`
connectionId | Identity of the connection
userId | Identity of the user
message | Detailed message of log event
hub | User-defined Hub Name |
routeTemplate | The route template of the API |
httpMethod | The Http method (POST/GET/PUT/DELETE) |
url | The uniform resource locator |
traceId | The unique identifier to the invocation |
statusCode | The Http response code |
duration | The duration between the request is received and processed |
headers | The additional information passed by the client and the server with an HTTP request or response |

The following code is an example of an archive log JSON string:

```json
{
  "properties": {
    "message": "Connection started",
    "collection": "Connection",
    "connectionId": "LW61bMG2VQLIMYIVBMmyXgb3c418200",
    "userId": null
  },
  "operationName": "ConnectionStarted",
  "category": "ConnectivityLogs",
  "level": "Informational",
  "callerIpAddress": "167.220.255.79",
  "resourceId": "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/MYGROUP/PROVIDERS/MICROSOFT.SIGNALRSERVICE/WEBPUBSUB/MYWEBPUBSUB",
  "time": "2021-09-17T05:25:05Z",
  "location": "westus"
}
```

### Archive logs schema for Log Analytics

Archive log columns include elements listed in the following table.

Name | Description
------- | ------- 
TimeGenerated | Log event time
Collection | Collection of the log event. Allowed values are: `Connection`, `Authorization` and `Throttling`
OperationName | Operation name of the event
Location | Location of your Azure SignalR Service
Level | Log event level
CallerIpAddress | IP address of your server/client
Message | Detailed message of log event
UserId | Identity of the user
ConnectionId | Identity of the connection
ConnectionType | Type of the connection. Allowed values are: `Server` \| `Client`. `Server`: connection from server side; `Client`: connection from client side
TransportType | Transport type of the connection. Allowed values are: `Websockets` \| `ServerSentEvents` \| `LongPolling`

## Azure Monitor Logs tables

Azure Web PubSub uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a list of Kusto tables Azure Web PubSub uses, see the [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype#signalr-service-webpubsub) article.

## See also


- See [Monitoring Azure Web PubSub](howto-azure-monitor.md) for a description of monitoring Azure Web PubSub.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
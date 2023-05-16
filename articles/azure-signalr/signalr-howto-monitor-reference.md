---
title: Monitoring Azure SignalR Service data reference

description: Important reference material needed when you monitor logs and metrics in Azure SignalR service.
author: wanlwanl
ms.service: signalr
ms.topic: how-to
ms.date: 05/15/2023
ms.author: wanl
---

# Monitoring Azure SignalR Service data reference


This article provides a reference of log and metric data collected to analyze the performance and availability of Azure SignalR service. See the [Use diagnostics logs to monitor SignalR Service](signalr-howto-diagnostic-logs.md) article for details on collecting and analyzing monitoring data for Azure SignalR service.

## Metrics

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
callerIpAddress | IP address of your server/client
properties | Detailed properties related to this log event. For more detail, see the properties table below

**Properties Table**

Name | Description
------- | -------
type | Type of the log event. Currently, we provide information about connectivity to the Azure SignalR Service. Only `ConnectivityLogs` type is available
collection | Collection of the log event. Allowed values are: `Connection`, `Authorization` and `Throttling`
connectionId | Identity of the connection
transportType | Transport type of the connection. Allowed values are: `Websockets` \| `ServerSentEvents` \| `LongPolling`
connectionType | Type of the connection. Allowed values are: `Server` \| `Client`. `Server`: connection from server side; `Client`: connection from client side
userId | Identity of the user
message | Detailed message of log event

The following code is an example of an archive log JSON string:

```json
{
    "properties": {
        "message": "Entered Serverless mode.",
        "type": "ConnectivityLogs",
        "collection": "Connection",
        "connectionId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "userId": "User",
        "transportType": "WebSockets",
        "connectionType": "Client"
    },
    "operationName": "ServerlessModeEntered",
    "category": "AllLogs",
    "level": "Informational",
    "callerIpAddress": "xxx.xxx.xxx.xxx",
    "time": "2019-01-01T00:00:00Z",
    "resourceId": "/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/XXXX/PROVIDERS/MICROSOFT.SIGNALRSERVICE/SIGNALR/XXX",
    "location": "xxxx"
}
```

### Archive logs schema for Log Analytics

Archive log columns include elements listed in the following table:

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

Azure SignalR service uses Kusto tables from Azure Monitor Logs. You can query these tables with Log analytics. For a list of Kusto tables Azure SignalR service uses, see the [Azure Monitor Logs table reference](/azure/azure-monitor/reference/tables/tables-resourcetype#signalr) article.

## See also


- See [Monitoring Azure SignalR](signalr-howto-diagnostic-logs.md) for a description of monitoring Azure SignalR service.
- See [Monitoring Azure resources with Azure Monitor](../azure-monitor/essentials/monitor-azure-resource.md) for details on monitoring Azure resources.
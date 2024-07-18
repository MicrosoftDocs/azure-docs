---
title: Monitor Azure SignalR Service
description: Start here to learn how to monitor Azure SignalR Service.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
author: vicancy
ms.author: lianwei
ms.service: signalr
---

# Monitor Azure SignalR Service

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]
For more information about the resource types for Azure SignalR Service, see [Azure SignalR Service monitoring data reference](monitor-signalr-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

Azure SignalR Service logs are stored in the storage account configured in diagnostic settings. A container named `insights-logs-alllogs` is created automatically to store resource logs. Inside the container, logs are stored in the file *resourceId=/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/XXXX/PROVIDERS/MICROSOFT.SIGNALRSERVICE/SIGNALR/XXX/y=YYYY/m=MM/d=DD/h=HH/m=00/PT1H.json*. Basically, the path is a combination of `resource ID` and `Date Time`. The log files are split by `hour`. Therefore, the minutes are always `m=00`.

All logs are stored in JavaScript Object Notation (JSON) format. The following code is an example of an archive log JSON string:

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

Field names for Storage destinations differ slightly from field names for Log Analytics. For details about the field name mapping between Storage and Log Analytics tables, see [Resource Log table mapping](monitor-signalr-reference.md#resource-log-table-mapping).

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

### Azure SignalR Service metrics

For the list of all available metrics for Azure SignalR Service, see [Azure SignalR Service monitoring data reference](monitor-signalr-reference.md#metrics).

#### Message Count granularity

The minimum **Message Count** granularity is 2 KB of outbound data traffic. If a client sends small or infrequent messages totaling less than 2 KB in a sampling time period, the message count is zero (0) even though messages were sent. The way to check for a small number or size of messages is by using the metric **Outbound Traffic**, which is a count of bytes sent.

#### System Errors and User Errors

The **User Errors** and **System Errors** metrics are the percentage of attempted operations, such as connecting or sending a message, that failed. A system error is a failure in the internal system logic. A user error is generally an application error, often related to networking. Normally, the percentage of system errors should be low, near zero.

> [!IMPORTANT]
> In some situations, the **User errors** rate is very high, especially in Serverless mode. In some browsers, the SignalR client doesn't shut down gracefully when a user closes the web page. A connection may remain open but unresponsive until Azure SignalR Service finally closes it because of timeout. The timeout closure is counted in the User Errors metric.

#### Metrics suitable for autoscaling

**Connection Quota Utilization** and **Server Load** show the percentage of utilization or load compared to the currently allocated unit count. These metrics are commonly used in autoscaling rules. For example, if the current allocation is one unit and there are 750 connections to the service, the Connection Quota Utilization is 750/1000 = 0.75. Server Load is calculated similarly, using values for compute capacity. For more information, see [Automatically scale units of an Azure SignalR Service](signalr-howto-scale-autoscale.md).

>[!NOTE]
> Autoscaling is a Premium Tier feature only.

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

- For detailed instructions on how to enable, query, and troubleshoot with Azure SignalR Service resource logs, see [Monitor and troubleshoot Azure SignalR Service logs](signalr-howto-diagnostic-logs.md).
- For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure SignalR Service, see [Azure SignalR Service monitoring data reference](monitor-signalr-reference.md).

### Resource log categories

Resource logs are grouped into category groups. Category groups are a collection of different logs to help you achieve different monitoring goals. Azure SignalR supports connectivity logs, messaging logs, and Http request logs.

#### Connectivity logs

Connectivity logs provide detailed information for SignalR hub connections. For example:

- Basic information like user ID, connection ID, and transport type
- Event information like connect, disconnect, and abort events

Therefore, the connectivity log is helpful to troubleshoot connection related issues. For typical connection related troubleshooting, see [connection related issues](signalr-howto-diagnostic-logs.md#connection-related-issues).

#### Messaging logs

Messaging logs provide tracing information for the SignalR hub messages received and sent via SignalR service, for example tracing ID and message type of the message. The tracing ID and message type is also logged in app server. Typically the message is recorded when it arrives at or leaves from service or server. Therefore messaging logs are helpful for troubleshooting message related issues. For typical message related troubleshooting, see [message related issues](signalr-howto-diagnostic-logs.md#message-related-issues).

> [!NOTE]
> This type of log is generated for every message. If the messages are sent frequently, messaging logs might impact the performance of the SignalR service. However, you can choose different collecting behaviors to minimize the performance impact. See [resource logs collecting behaviors](#resource-logs-collecting-behaviors).

#### Http request logs

Http request logs provide detailed information for the HTTP requests received by Azure SignalR, for example status code and URL of the request. Http request log is helpful to troubleshoot request-related issues.

For the available resource log categories, their associated Log Analytics tables, and the log schemas for Azure SignalR Service, see [Azure SignalR Service monitoring data reference](monitor-signalr-reference.md#resource-logs).

### Resource logs collecting behaviors

There are two typical scenarios for using resource logs, especially for messaging logs.

- **Message quality** logs whether the message was sent or received successfully, or records every message that is delivered via SignalR service.
- **Performance** logs message latency, or tracks the message in a few connections instead of all the connections.

Therefore, SignalR service provides two kinds of collecting behaviors:

- **Collect all** collects logs in all connections.
- **Collect partially** collects logs in some specific connections.

For more details about resource log collecting behaviors and how to configure them, see [Resource logs collecting behaviors](signalr-howto-diagnostic-logs.md#resource-logs-collecting-behaviors).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

For example Kusto queries for Azure SignalR Service, see [Queries for the SignalRServiceDiagnosticLogs table](/azure/azure-monitor/reference/queries/signalrservicediagnosticlogs).

> [!NOTE]
> Query field names for Storage destinations differ slightly from field names for Log Analytics. For details about the field name mappings between Storage and Log Analytics tables, see [Resource Log table mapping](monitor-signalr-reference.md#resource-log-table-mapping).

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

### Azure SignalR Service alert rules

The following table lists some suggested alert rules for Azure SignalR Service. These alerts are just examples. You can set alerts for any metric, log entry, or activity log entry listed in the [Azure SignalR Service monitoring data reference](monitor-signalr-reference.md).

| Alert type | Condition | Description  |
|:---|:---|:---|
| Platform metrics | Connection Quota Utilization | Whenever the maximum Connection Quota Utilization is greater than dynamic threshold |
| Platform metrics | Delete SignalR | Whenever the Activity Log has an event with Category='Administrative', Signal name='Delete SignalR (SignalR)' |

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- For a reference listing the metrics, resource logs, and other important monitoring features for Azure SignalR Service, see [Azure SignalR Service monitoring data reference](monitor-signalr-reference.md).
- For general details on monitoring Azure resources, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).
- For detailed instructions on how to enable, query, and troubleshoot with Azure SignalR Service logs, see [Monitor and troubleshoot Azure SignalR Service logs](signalr-howto-diagnostic-logs.md).
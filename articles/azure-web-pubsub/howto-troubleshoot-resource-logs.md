---
title: How to troubleshoot with Azure Web PubSub service resource logs
description: Learn how to get and troubleshoot with resource logs
author: wanlwanl
ms.author: wanl
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 04/01/2022
---

# How to troubleshoot with resource logs

This how-to guide shows you the options to get the resource logs and how to troubleshoot with them.

## What's the resource logs?

The resource logs provide richer view of connectivity, messaging and HTTP request information to the Azure Web PubSub service instance. They can be used for issue identification, connection tracking, message tracing, HTTP request tracing and analysis.

There are three types of logs: connectivity log, messaging log and HTTP request logs.

### Connectivity logs

Connectivity logs provide detailed information for Azure Web PubSub hub connections. For example, basic information (user ID, connection ID, and so on) and event information (connect, disconnect, and abort event, and so on). That's why the connectivity log is helpful to troubleshoot connection-related issues.

### Messaging logs

Messaging logs provide tracing information for the Azure Web PubSub hub messages received and sent via Azure Web PubSub service. For example, tracing ID and message type of the message. Typically the message is recorded when it arrives at or leaves from service. So messaging logs are helpful for troubleshooting message-related issues.

### HTTP request logs

Http request logs provide tracing information for HTTP requests to the Azure Web PubSub service. For example, HTTP method and status code. Typically the HTTP request is recorded when it arrives at or leave from service. So HTTP request logs are helpful for troubleshooting request-related issues.

## Capture resource logs with live trace tool 

The Azure Web PubSub service live trace tool has ability to collect resource logs in real time, and is helpful to trace with customer's development environment. The live trace tool could capture connectivity logs, messaging logs and HTTP request logs.

> [!NOTE]
> The real-time resource logs captured by live trace tool will be billed as messages (outbound traffic).

> [!NOTE]
> The Azure Web PubSub service instance created as free tier has the daily limit of messages (outbound traffic).

### Launch the live trace tool

1. Go to the Azure portal. 
2. On the **Live trace settings** page of your Azure Web PubSub service instance, check **Enable Live Trace** if it's disabled.
3. Check any log category you need.
4. Click **Save** button and wait until the settings take effect.
5. Click *Open Live Trace Tool*

    :::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-logs-with-live-trace-tool.png" alt-text="Screenshot of launching the live trace tool.":::

> Azure Active Directory access to live trace tool is not yet supported, please enable `Access Key` in `Keys` menu.

### Capture the resource logs

The live trace tool provides some fundamental functionalities to help you capture the resource logs for troubleshooting.

* **Capture**: Begin to capture the real-time resource logs from Azure Web PubSub instance with live trace tool.
* **Clear**: Clear the captured real-time resource logs.
* **Log filter**: The live trace tool allows you filtering the captured real-time resource logs with one specific key word. The common separator (for example, space, comma, semicolon, and so on) will be treated as part of the key word. 
* **Status**: The status shows whether the live trace tool is connected or disconnected with the specific instance.

:::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/live-trace-tool-capture.png" alt-text="Screenshot of capturing resource logs with live trace tool.":::

The real-time resource logs captured by live trace tool contain detailed information for troubleshooting. 

| Name | Description |
| ------------ |  ------------------------ | 
| Time | Log event time |
| Log Level | Log event level (Trace/Debug/Informational/Warning/Error) |
| Event Name | Operation name of the event |
| Message | Detailed message of log event |
| Exception | The run-time exception of Azure Web PubSub service |
| Hub | User-defined Hub Name |
| Connection ID | Identity of the connection |
| User ID | Identity of the user |
| IP | The IP address of client |
| Route Template | The route template of the API |
| Http Method | The Http method (POST/GET/PUT/DELETE) |
| URL | The uniform resource locator |
| Trace ID | The unique identifier to the invocation |
| Status Code | The Http response code |
| Duration | The duration between the request is received and processed |
| Headers | The additional information passed by the client and the server with an HTTP request or response |

After the Azure Web PubSub service is GA, the live trace tool will also support to export the logs as a specific format and then help you share with others for troubleshooting. 

## Capture resource logs with Azure Monitor

### How to enable resource logs

Currently Azure Web PubSub supports integrate with [Azure Storage](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage).

1. Go to Azure portal.
2. On **Diagnostic settings** page of your Azure Web PubSub service instance, click **+ Add diagnostic setting** link.
3. In **Diagnostic setting name**, input the setting name.
4. In **Category details**, select any log category you need.
5. In **Destination details**, check **Archive to a storage account**.
6. Click **Save** button to save the diagnostic setting.

:::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-settings-list.png" alt-text="Screenshot of viewing diagnostic settings and create a new one":::

:::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-settings-details.png" alt-text="Screenshot of configuring diagnostic setting detail":::

> [!NOTE]
> The storage account should be the same region to Azure Web PubSub service.

### Archive to Azure Storage Account

Logs are stored in the storage account that configured in **Diagnostics setting** pane. A container named `insights-logs-<CATEGORY_NAME>` is created automatically to store resource logs. Inside the container, logs are stored in the file `resourceId=/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/XXXX/PROVIDERS/MICROSOFT.SIGNALRSERVICE/SIGNALR/XXX/y=YYYY/m=MM/d=DD/h=HH/m=00/PT1H.json`. Basically, the path is combined by `resource ID` and `Date Time`. The log files are split by `hour`. Therefore, the minutes always be `m=00`.

All logs are stored in JavaScript Object Notation (JSON) format. Each entry has string fields that use the format described in the following sections.

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

### Archive to Azure Log Analytics

Once you check `Send to Log Analytics`, and select target Azure Log Analytics, the logs will be stored in the target. To view resource logs, follow these steps:

1. Select `Logs` in your target Log Analytics.

    :::image type="content" alt-text="Log Analytics menu item" source="./media/howto-troubleshoot-diagnostic-logs/log-analytics-menu-item.png" lightbox="./media/howto-troubleshoot-diagnostic-logs/log-analytics-menu-item.png":::

2. Enter `WebPubSubConnectivity`, `WebPubSubMessaging` or `WebPubSubHttpRequest` and select time range to query [connectivity log](#connectivity-logs), [messaging log](#messaging-logs) or [http request logs](#http-request-logs) correspondingly. For advanced query, see [Get started with Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-tutorial.md)

    :::image type="content" alt-text="Query log in Log Analytics" source="./media/howto-troubleshoot-diagnostic-logs/query-log-in-log-analytics.png" lightbox="./media/howto-troubleshoot-diagnostic-logs/query-log-in-log-analytics.png":::

To use sample query for SignalR service, please follow the steps below:
1. Select `Logs` in your target Log Analytics.
2. Select `Queries` to open query explorer.
3. Select `Resource type` to group sample queries in resource type.
4. Select `Run` to run the script.
    :::image type="content" alt-text="Sample query in Log Analytics" source="./media/howto-troubleshoot-diagnostic-logs/log-analytics-sample-query.png" lightbox="./media/howto-troubleshoot-diagnostic-logs/log-analytics-sample-query.png":::


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

## Troubleshoot with the resource logs

When finding connection unexpected growing or dropping situation, you can take advantage of resource logs to troubleshoot. Typical issues are often about connections' unexpected quantity changes, connections reach connection limits and authorization failure.

### Unexpected connection number changes

#### Unexpected connection dropping

If a connection disconnects, the resource logs will record this disconnecting event with `ConnectionAborted` or `ConnectionEnded` in `operationName`.

The difference between `ConnectionAborted` and `ConnectionEnded` is that `ConnectionEnded` is an expected disconnecting which is triggered by client or server side. While the `ConnectionAborted` is usually an unexpected connection dropping event, and aborting reason will be provided in `message`.

The abort reasons are listed in the following table:

| Reason | Description |
| ------- | ------- |
| Connection count reaches limit | Connection count reaches limit of your current price tier. Consider scale up service unit
| Service reloading, reconnect | Azure Web PubSub service is reloading. You need to implement your own reconnect mechanism or manually reconnect to Azure Web PubSub service |
| Internal server transient error | Transient error occurs in Azure Web PubSub service, should be auto recovered

#### Unexpected connection growing

To troubleshoot about unexpected connection growing, the first thing you need to do is to filter out the extra connections. You can add unique test user ID to your test client connection. Then verify it in with resource logs, if you see more than one client connections have the same test user ID or IP, then it is likely the client side create and establish more connections than expectation. Check your client side.

### Authorization failure

If you get 401 Unauthorized returned for client requests, check your resource logs. If you meet `Failed to validate audience. Expected Audiences: <valid audience>. Actual Audiences: <actual audience>`, it means all audiences in your access token are invalid. Try to use the valid audiences suggested in the log.

### Throttling

If you find that you cannot establish client connections to Azure Web PubSub service, check your resource logs. If you meet `Connection count reaches limit` in resource log, you establish too many connections to Azure Web PubSub service, which reach the connection count limit. Consider scaling up your Azure Web PubSub service instance. If you meet `Message count reaches limit` in resource log, it means you use free tier, and you use up the quota of messages. If you want to send more messages, consider changing your Azure Web PubSub service instance to standard tier to send additional messages. For more information, see [Azure Web PubSub service Pricing](https://azure.microsoft.com/pricing/details/web-pubsub/).

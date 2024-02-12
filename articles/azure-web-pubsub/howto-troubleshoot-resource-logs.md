---
title: How to troubleshoot with Azure Web PubSub service resource logs
description: Learn what resource logs are and how to use them for troubleshooting common problems.
author: wanlwanl
ms.author: wanl
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 07/21/2022
---

# How to troubleshoot with resource logs

This how-to guide provides an overview of Azure Web PubSub resource logs and some tips for using the logs to troubleshoot certain problems. Logs can be used for issue identification, connection tracking, message tracing, HTTP request tracing, and analysis.

## What are resource logs?

There are three types of resource logs: _Connectivity_, _Messaging_, and _HTTP requests_.

- **Connectivity** logs provide detailed information for Azure Web PubSub hub connections. For example, basic information (user ID, connection ID, and so on) and event information (connect, disconnect, and so on).
- **Messaging** logs provide tracing information for the Azure Web PubSub hub messages received and sent via Azure Web PubSub service. For example, tracing ID and message type of the message.
- **HTTP requests** logs provide tracing information for HTTP requests to the Azure Web PubSub service. For example, HTTP method and status code. Typically the HTTP request is recorded when it arrives at or leave from service.

## Capture resource logs by using the live trace tool

The Azure Web PubSub service live trace tool has ability to collect resource logs in real time, which is helpful for troubleshooting problems in your development environment. The live trace tool can capture connectivity logs, messaging logs, and HTTP request logs.

> [!NOTE]
> The following considerations apply to using the live trace tool:
>
> - The real-time resource logs captured by live trace tool will be billed as messages (outbound traffic).
> - The live trace tool does not currently support Microsoft Entra authorization. You must enable access keys to use live trace. Under **Settings**, select **Keys**, and then enable **Access Key**.
> - The Azure Web PubSub service Free Tier instance has a daily limit of 20,000 messages (outbound traffic). Live trace can cause you to unexpectedly reach the daily limit.

## Launch the live trace tool

> [!NOTE]
> When enable access key, you'll use access token to authenticate live trace tool.
> Otherwise, you'll use Microsoft Entra ID to authenticate live trace tool.
> You can check whether you enable access key or not in your SignalR Service's Keys page in Azure portal.

### Steps for access key enabled

1. Go to the Azure portal and your SignalR Service page.
1. From the menu on the left, under **Monitoring** select **Live trace settings**.
1. Select **Enable Live Trace**.
1. Select **Save** button. It will take a moment for the changes to take effect.
1. When updating is complete, select **Open Live Trace Tool**.

    :::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-logs-with-live-trace-tool.png" alt-text="Screenshot of launching the live trace tool.":::

### Steps for access key disabled

#### Assign live trace tool API permission to yourself
1. Go to the Azure portal and your SignalR Service page.
1. Select **Access control (IAM)**.
1. In the new page, Click **+Add**, then click **Role assignment**.
1. In the new page, focus on **Job function roles** tab, Select **SignalR Service Owner** role, and then click **Next**.
1. In **Members** page, click **+Select members**.
1. In the new panel, search and select members, and then click **Select**.
1. Click **Review + assign**, and wait for the completion notification.

#### Visit live trace tool
1. Go to the Azure portal and your SignalR Service page.
1. From the menu on the left, under **Monitoring** select **Live trace settings**.
1. Select **Enable Live Trace**.
1. Select **Save** button. It will take a moment for the changes to take effect.
1. When updating is complete, select **Open Live Trace Tool**.

    :::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-logs-with-live-trace-tool.png" alt-text="Screenshot of launching the live trace tool.":::

#### Sign in with your Microsoft account

1. The live trace tool will pop up a Microsoft sign in window. If no window is pop up, check and allow pop up windows in your browser.
1. Wait for **Ready** showing in the status bar. 

### Capture the resource logs

The live trace tool provides functionality to help you capture the resource logs for troubleshooting.

- **Capture**: Begin to capture the real-time resource logs from Azure Web PubSub.
- **Clear**: Clear the captured real-time resource logs.
- **Log filter**: The live trace tool lets you filter the captured real-time resource logs with one specific key word. The common separators (for example, space, comma, semicolon, and so on) will be treated as part of the key word.
- **Status**: The status shows whether the live trace tool is connected or disconnected with the specific instance.

:::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/live-trace-tool-capture.png" alt-text="Screenshot of capturing resource logs with live trace tool.":::

The real-time resource logs captured by live trace tool contain detailed information for troubleshooting.

| Name           | Description                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Time           | Log event time                                                                                  |
| Log Level      | Log event level, can be [Trace \| Debug \| Informational \| Warning \| Error]                   |
| Event Name     | Operation name of the event                                                                     |
| Message        | Detailed message for the event                                                                  |
| Exception      | The run-time exception of Azure Web PubSub service                                              |
| Hub            | User-defined hub name                                                                           |
| Connection ID  | Identity of the connection                                                                      |
| User ID        | User identity                                                                                   |
| IP             | Client IP address                                                                               |
| Route Template | The route template of the API                                                                   |
| Http Method    | The Http method (POST/GET/PUT/DELETE)                                                           |
| URL            | The uniform resource locator                                                                    |
| Trace ID       | The unique identifier to the invocation                                                         |
| Status Code    | The Http response code                                                                          |
| Duration       | The duration between receiving the request and processing the request                           |
| Headers        | The additional information passed by the client and the server with an HTTP request or response |

## Capture resource logs with Azure Monitor

### How to enable resource logs

Currently Azure Web PubSub supports integration with [Azure Storage](../azure-monitor/essentials/resource-logs.md#send-to-azure-storage).

1. Go to Azure portal.
1. On **Diagnostic settings** page of your Azure Web PubSub service instance, select **+ Add diagnostic setting**.
   :::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-settings-list.png" alt-text="Screenshot of viewing diagnostic settings and create a new one":::
1. In **Diagnostic setting name**, input the setting name.
1. In **Category details**, select any log category you need.
1. In **Destination details**, check **Archive to a storage account**.

   :::image type="content" source="./media/howto-troubleshoot-diagnostic-logs/diagnostic-settings-details.png" alt-text="Screenshot of configuring diagnostic setting detail":::

1. Select **Save** to save the diagnostic setting.
   > [!NOTE]
   > The storage account should be in the same region as Azure Web PubSub service.

### Archive to an Azure Storage Account

Logs are stored in the storage account that's configured in the **Diagnostics setting** pane. A container named `insights-logs-<CATEGORY_NAME>` is created automatically to store resource logs. Inside the container, logs are stored in the file `resourceId=/SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/XXXX/PROVIDERS/MICROSOFT.SIGNALRSERVICE/SIGNALR/XXX/y=YYYY/m=MM/d=DD/h=HH/m=00/PT1H.json`. The path is combined by `resource ID` and `Date Time`. The log files are split by `hour`. The minute value is always `m=00`.

All logs are stored in JavaScript Object Notation (JSON) format. Each entry has string fields that use the format described in the following sections.

Archive log JSON strings include elements listed in the following tables:

#### Format

| Name            | Description                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------- |
| time            | Log event time                                                                                 |
| level           | Log event level                                                                                |
| resourceId      | Resource ID of your Azure SignalR Service                                                      |
| location        | Location of your Azure SignalR Service                                                         |
| category        | Category of the log event                                                                      |
| operationName   | Operation name of the event                                                                    |
| callerIpAddress | IP address of your server or client                                                            |
| properties      | Detailed properties related to this log event. For more detail, see the properties table below |

#### Properties Table

| Name          | Description                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------- |
| collection    | Collection of the log event. Allowed values are: `Connection`, `Authorization` and `Throttling` |
| connectionId  | Identity of the connection                                                                      |
| userId        | Identity of the user                                                                            |
| message       | Detailed message of log event                                                                   |
| hub           | User-defined Hub Name                                                                           |
| routeTemplate | The route template of the API                                                                   |
| httpMethod    | The Http method (POST/GET/PUT/DELETE)                                                           |
| url           | The uniform resource locator                                                                    |
| traceId       | The unique identifier to the invocation                                                         |
| statusCode    | The Http response code                                                                          |
| duration      | The duration between the request is received and processed                                      |
| headers       | The additional information passed by the client and the server with an HTTP request or response |

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

To send logs to a Log Analytics workspace:

1. On the **Diagnostic setting** page, under **Destination details**, select \*\*Send to Log Analytics workspace.
1. Select the **Subscription** you want to use.
1. Select the **Log Analytics workspace** to use as the destination for the logs.

To view the resource logs, follow these steps:

1. Select `Logs` in your target Log Analytics.

   :::image type="content" alt-text="Log Analytics menu item" source="./media/howto-troubleshoot-diagnostic-logs/log-analytics-menu-item.png" lightbox="./media/howto-troubleshoot-diagnostic-logs/log-analytics-menu-item.png":::

1. Enter `WebPubSubConnectivity`, `WebPubSubMessaging` or `WebPubSubHttpRequest`, and then select the time range to query the log. For advanced queries, see [Get started with Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-tutorial.md).

   :::image type="content" alt-text="Query log in Log Analytics" source="./media/howto-troubleshoot-diagnostic-logs/query-log-in-log-analytics.png" lightbox="./media/howto-troubleshoot-diagnostic-logs/query-log-in-log-analytics.png":::

To use a sample query for SignalR service, follow the steps below.

1. Select `Logs` in your target Log Analytics.
1. Select `Queries` to open query explorer.
1. Select `Resource type` to group sample queries in resource type.
1. Select `Run` to run the script.
   :::image type="content" alt-text="Sample query in Log Analytics" source="./media/howto-troubleshoot-diagnostic-logs/log-analytics-sample-query.png" lightbox="./media/howto-troubleshoot-diagnostic-logs/log-analytics-sample-query.png":::

Archive log columns include elements listed in the following table.

| Name            | Description                                                                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| TimeGenerated   | Log event time                                                                                                                                 |
| Collection      | Collection of the log event. Allowed values are: `Connection`, `Authorization` and `Throttling`                                                |
| OperationName   | Operation name of the event                                                                                                                    |
| Location        | Location of your Azure SignalR Service                                                                                                         |
| Level           | Log event level                                                                                                                                |
| CallerIpAddress | IP address of your server/client                                                                                                               |
| Message         | Detailed message of log event                                                                                                                  |
| UserId          | Identity of the user                                                                                                                           |
| ConnectionId    | Identity of the connection                                                                                                                     |
| ConnectionType  | Type of the connection. Allowed values are: `Server` \| `Client`. `Server`: connection from server side; `Client`: connection from client side |
| TransportType   | Transport type of the connection. Allowed values are: `Websockets` \| `ServerSentEvents` \| `LongPolling`                                      |

## Troubleshoot with the resource logs

If you find unexpected changes in the number of connections, either increasing or decreasing, you can take advantage of resource logs to troubleshoot the problem. Typical issues are often about connections' unexpected quantity changes, connections reach connection limits, and authorization failure.

### Unexpected changes in number of connections

#### Unexpected connection dropping

If a connection disconnects, the resource logs will record the disconnection event with `ConnectionAborted` or `ConnectionEnded` in `operationName`.

The difference between `ConnectionAborted` and `ConnectionEnded` is that `ConnectionEnded` is an expected disconnection that is triggered by the client or server side. While the `ConnectionAborted` is usually an unexpected connection dropping event, and the reason for disconnection will be provided in `message`.

The abort reasons are listed in the following table:

| Reason                          | Description                                                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Connection count reaches limit  | Connection count reaches limit of your current price tier. Consider scale up service unit                                                   |
| Service reloading, reconnect    | Azure Web PubSub service is reloading. You need to implement your own reconnect mechanism or manually reconnect to Azure Web PubSub service |
| Internal server transient error | Transient error occurs in Azure Web PubSub service, should be auto recovered                                                                |

#### Unexpected increase in connections

When the number of client connections unexpectedly increases, the first thing you need to do is to filter out the superfluous connections. Add a unique test user ID to your test client connection. Then check the resource logs; if you see more than one client connection has the same test user ID or IP, then it's likely the client is creating more connections than expected. Check your client code to find the source of the extra connections.

### Authorization failure

If you get 401 Unauthorized returned for client requests, check your resource logs. If you find `Failed to validate audience. Expected Audiences: <valid audience>. Actual Audiences: <actual audience>`, it means all audiences in your access token are invalid. Try to use the valid audiences suggested in the log.

### Throttling

If you find that you can't establish client connections to Azure Web PubSub service, check your resource logs. If you see `Connection count reaches limit` in the resource log, you established too many connections to Azure Web PubSub service and reached the connection count limit. Consider scaling up your Azure Web PubSub service instance. If you see `Message count reaches limit` in the resource log and you're using the Free tier, it means you used up the quota of messages. If you want to send more messages, consider changing your Azure Web PubSub service instance to Standard tier. For more information, see [Azure Web PubSub service Pricing](https://azure.microsoft.com/pricing/details/web-pubsub/).

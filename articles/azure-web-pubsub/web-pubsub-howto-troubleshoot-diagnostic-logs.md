---
title: How to troubleshoot with Azure Web PubSub service diagnostic logs
description: Learn how to get and troubleshoot with diagnostic logs
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 03/22/2021
---

# How to troubleshoot with diagnostic logs

This how-to guide shows you the options to get the diagnostic logs and how to troubleshoot with them.

## What's the diagnostic logs?

The diagnostic logs provide richer view of connectivity and messaging information to the Azure Web PubSub service instance. They can be used for issue identification, connection tracking, message tracing, and analysis.

There are two types of logs: connectivity log and messaging log.

### Connectivity logs

Connectivity logs provide detailed information for Azure Web PubSub hub connections. For example, basic information (user ID, connection ID, and so on) and event information (connect, disconnect, and abort event, and so on). That's why the connectivity log is helpful to troubleshoot connection-related issues. 

### Messaging logs

Messaging logs provide tracing information for the Azure Web PubSub hub messages received and sent via Azure Web PubSub service. For example, tracing ID and message type of the message. Typically the message is recorded when it arrives at or leaves from service. So messaging logs are helpful for troubleshooting message-related issues. 

## Capture diagnostic logs with Azure Web PubSub service live trace tool 

The Azure Web PubSub service live trace tool has ability to collect diagnostic logs in real time, and is helpful to trace with customer's development environment. The live trace tool could capture both connectivity logs and messaging logs.

> [!NOTE]
> The real-time diagnostic logs captured by live trace tool will be billed as messages (outbound traffic).

> [!NOTE]
> The Azure Web PubSub service instance created as free tier has the daily limit of messages (outbound traffic).

### Launch the live trace tool

1. Go to the Azure portal. 
1. On the **Diagnostic Settings** page of your Azure Web PubSub service instance, select **Open Live Trace Tool**. 

    :::image type="content" source="./media/web-pubsub-howto-troubleshoot-diagnostic-logs/diagnostic-logs-with-live-trace-tool.png" alt-text="Launch the live trace tool.":::

### Capture the diagnostic logs

The live trace tool provides some fundamental functionalities to help you capture the diagnostic logs for troubleshooting.

* **Capture**: Begin to capture the real-time diagnostic logs from Azure Web PubSub instance with live trace tool.
* **Clear**: Clear the captured real-time diagnostic logs.
* **Log filter**: The live trace tool allows you filtering the captured real-time diagnostic logs with one specific key word. The common separator (for example, space, comma, semicolon, and so on) will be treated as part of the key word. 
* **Status**: The status shows whether the live trace tool is connected or disconnected with the specific instance.

:::image type="content" source="./media/web-pubsub-howto-troubleshoot-diagnostic-logs/live-trace-tool-capture.png" alt-text="Capture diagnostic logs with live trace tool.":::

The real-time diagnostic logs captured by live trace tool contain detailed information for troubleshooting. 

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

After the Azure Web PubSub service is GA, the live trace tool will also support to export the logs as a specific format and then help you share with others for troubleshooting. 

## Troubleshoot with the diagnostic logs

When finding connection unexpected growing or dropping situation, you can take advantage of diagnostic logs to troubleshoot. Typical issues are often about connections' unexpected quantity changes, connections reach connection limits and authorization failure.

### Unexpected connection number changes

#### Unexpected connection dropping

If a connection disconnects, the diagnostic logs will record this disconnecting event with `ConnectionAborted` or `ConnectionEnded` in `operationName`.

The difference between `ConnectionAborted` and `ConnectionEnded` is that `ConnectionEnded` is an expected disconnecting which is triggered by client or server side. While the `ConnectionAborted` is usually an unexpected connection dropping event, and aborting reason will be provided in `message`.

The abort reasons are listed in the following table:

| Reason | Description |
| ------- | ------- |
| Connection count reaches limit | Connection count reaches limit of your current price tier. Consider scale up service unit
| Service reloading, reconnect | Azure Web PubSub service is reloading. You need to implement your own reconnect mechanism or manually reconnect to Azure Web PubSub service |
| Internal server transient error | Transient error occurs in Azure Web PubSub service, should be auto recovered

#### Unexpected connection growing

To troubleshoot about unexpected connection growing, the first thing you need to do is to filter out the extra connections. You can add unique test user ID to your test client connection. Then verify it in with diagnostic logs, if you see more than one client connections have the same test user ID or IP, then it is likely the client side create and establish more connections than expectation. Check your client side.

### Authorization failure

If you get 401 Unauthorized returned for client requests, check your diagnostic logs. If you meet `Failed to validate audience. Expected Audiences: <valid audience>. Actual Audiences: <actual audience>`, it means all audiences in your access token are invalid. Try to use the valid audiences suggested in the log.

### Throttling

If you find that you cannot establish client connections to Azure Web PubSub service, check your diagnostic logs. If you meet `Connection count reaches limit` in diagnostic log, you establish too many connections to Azure Web PubSub service, which reach the connection count limit. Consider scaling up your Azure Web PubSub service instance. If you meet `Message count reaches limit` in diagnostic log, it means you use free tier, and you use up the quota of messages. If you want to send more messages, consider changing your Azure Web PubSub service instance to standard tier to send additional messages. For more information, see [Azure Web PubSub service Pricing](https://azure.microsoft.com/pricing/details/web-pubsub/).


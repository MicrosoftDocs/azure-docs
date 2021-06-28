---
title: How to use live trace tool
description: Learn how to use live trace tool
author: wanl
ms.author: wanl
ms.service: signalr
ms.topic: conceptual 
ms.date: 06/30/2021
---

# How to use live trace tool

Live trace tool is a single web application for capturing and displaying live traces in SignalR service in real-time without any dependency on other services.
You can enable and disable the live trace feature with a single click. You can also choose any log category that you are interested.

> Please note that the live traces will be counted as outbound messages.

## Launch the live trace tool

1. Go to the Azure portal.
2. Check **Enable Live Trace**.
3. click **Save** button in tool bar and wait for the changes take effect.
4. On the **Diagnostic Settings** page of your Azure Web PubSub service instance, select **Open Live Trace Tool**. 

    :::image type="content" source="./media/signlar-howto-troubleshoot-livetrace/live-traces-with-live-trace-tool.png" alt-text="Launch the live trace tool.":::

## Capture live traces

The live trace tool provides some fundamental functionalities to help you capture the live traces for troubleshooting.

* **Capture**: Begin to capture the real-time live traces from Azure Web PubSub instance with live trace tool.
* **Clear**: Clear the captured real-time live traces.
* **Export**: Export live traces to a file. The current supported file format is CSV file.
* **Log filter**: The live trace tool allows you filtering the captured real-time live traces with one specific key word. The common separator (for example, space, comma, semicolon, and so on) will be treated as part of the key word. 
* **Status**: The status shows whether the live trace tool is connected or disconnected with the specific instance.

:::image type="content" source="./media/signlar-howto-troubleshoot-livetrace/live-trace-tool-capture.png" alt-text="Capture live traces with live trace tool.":::

The real-time live traces captured by live trace tool contain detailed information for troubleshooting. 

| Name | Description |
| ------------ |  ------------------------ | 
| Time | Log event time |
| Log Level | Log event level (Trace/Debug/Informational/Warning/Error) |
| Event Name | Operation name of the event |
| Message | Detailed message of log event |
| Exception | The run-time exception of Azure Web PubSub service |
| Hub | User-defined Hub Name |
| Connection ID | Identity of the connection |
| Connection ID | Type of the connection. Allowed values are `Server` (connections between server and service) and `Client` (connections between client and service)|
| User ID | Identity of the user |
| IP | The IP address of client |
| Server Sticky | Routing mode of client. Allowed values are `Disabled`, `Preferred` and `Required`. For more details, please refer to [ServerStickyMode](https://github.com/Azure/azure-signalr/blob/master/docs/run-asp-net-core.md#serverstickymode) |
| Transport | The transport that the client can use to send HTTP requests. Allowed values are `WebSockets`, `ServerSentEvents` and `LongPolling`. For more details, please refer to [HttpTransportType](https://docs.microsoft.com/dotnet/api/microsoft.aspnetcore.http.connections.httptransporttype) |

## Troubleshooting guides

For how to troubleshoot typical issues based on live traces, please refer to our [troubleshooting guide](./signalr-howto-troubleshoot-guide.md).
For self-diagnosis to find the root cause directly or narrow down the issue, please refer to our [troubleshooting methods introduction](./signalr-howto-troubleshoot-method.md).

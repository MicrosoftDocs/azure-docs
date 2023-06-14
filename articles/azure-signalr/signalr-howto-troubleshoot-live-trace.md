---
title: How to use live trace tool for Azure SignalR service
description: Learn how to use live trace tool for Azure SignalR service
author: vicancy
ms.author: lianwei
ms.service: signalr
ms.topic: how-to 
ms.date: 07/14/2022
---

# How to use live trace tool for Azure SignalR service

Live trace tool is a single web application for capturing and displaying live traces in Azure SignalR Service. The live traces can be collected in real time without any dependency on other services. You can enable and disable the live trace feature with a single select. You can also choose any log category that you're interested.

> [!NOTE]
> Note that the live traces will be counted as outbound messages.
> Azure Active Directory access to live trace tool is not supported. You will need to enable **Access Key** in **Keys** settings.

## Launch the live trace tool

1. Go to the Azure portal and your SignalR Service page.
1. From the menu on the left, under **Monitoring** select **Live trace settings**.
1. Select **Enable Live Trace**.
1. Select **Save** button. It will take a moment for the changes to take effect.
1. When updating is complete, select **Open Live Trace Tool**.

    :::image type="content" source="media/signalr-howto-troubleshoot-live-trace/signalr-enable-live-trace.png" alt-text="Screenshot of launching the live trace tool.":::

## Capture live traces

The live trace tool provides functionality to help you capture the live traces for troubleshooting.

* **Capture**: Begin to capture the real time live traces from SignalR Service instance with live trace tool.
* **Clear**: Clear the captured real time live traces.
* **Export**: Export live traces to a file. The current supported file format is CSV file.
* **Log filter**: The live trace tool allows you to filter the captured real time live traces with one specific key word. Separators (for example, space, comma, semicolon, and so on), if present, will be treated as part of the key word.

:::image type="content" source="./media/signalr-howto-troubleshoot-live-trace/live-trace-tool-capture.png" alt-text="Screenshot of capturing live traces with live trace tool.":::

The real time live traces captured by live trace tool contain detailed information for troubleshooting.

| Name | Description |
| ------------ |  ------------------------ | 
| Time | Log event time |
| Log Level | Log event level (Trace/Debug/Informational/Warning/Error) |
| Event Name | Operation name of the event |
| Message | Detailed message of log event |
| Exception | The run-time exception of Azure Web PubSub service |
| Hub | User-defined Hub Name |
| Connection ID | Identity of the connection |
| Connection Type | Type of the connection. Allowed values are `Server` (connections between server and service) and `Client` (connections between client and service)|
| User ID | Identity of the user |
| IP | The IP address of client |
| Server Sticky | Routing mode of client. Allowed values are `Disabled`, `Preferred` and `Required`. For more information, see [ServerStickyMode](https://github.com/Azure/azure-signalr/blob/master/docs/run-asp-net-core.md#serverstickymode) |
| Transport | The transport that the client can use to send HTTP requests. Allowed values are `WebSockets`, `ServerSentEvents` and `LongPolling`. For more information, see [HttpTransportType](/dotnet/api/microsoft.aspnetcore.http.connections.httptransporttype) |
| Message Tracing ID | The unique identifier for a message |
| Route Template | The route template of the API |
| Http Method | The Http method (POST/GET/PUT/DELETE) |
| URL | The uniform resource locator |
| Trace ID | The unique identifier to represent a request |
| Status Code | the Http response code |
| Duration | The duration between the request is received and processed |
| Headers | The additional information passed by the client and the server with an HTTP request or response |
| Invocation ID | The unique identifier to represent an invocation (only available for ASP.NET SignalR) |
| Message Type | The type of the message (BroadcastDataMessage\|JoinGroupMessage\|LeaveGroupMessage\|...) |

## Next Steps

In this guide, you learned about how to use live trace tool. Next, learn how to handle the common issues:
* Troubleshooting guides: How to troubleshoot typical issues based on live traces, see [troubleshooting guide](./signalr-howto-troubleshoot-guide.md).
* Troubleshooting methods: For self-diagnosis to find the root cause directly or narrow down the issue, see  [troubleshooting methods introduction](./signalr-howto-troubleshoot-method.md).
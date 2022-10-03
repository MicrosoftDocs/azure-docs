---
title: "Troubleshooting practice for Azure SignalR Service"
description: Learn how to troubleshoot connectivity and message delivery issues
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 07/18/2022
ms.author: lianwei
---

# How to troubleshoot connectivity and message delivery issues

This guidance introduces several ways to help do self-diagnosis to find the root cause directly or narrow down the issue. The self-diagnosis result is also useful when reporting it to us for further investigation.

First, you need to check from the Azure portal which [ServiceMode](./concept-service-mode.md) is the Azure SignalR Service (also known as **ASRS**) configured to.

:::image type="content" source="./media/signalr-howto-troubleshoot-method/service-mode.png" alt-text="ServiceMode":::

* For `Default` mode, refer to [default mode troubleshooting](#default_mode_tsg)

* For `Serverless` mode, refer to [serverless mode troubleshooting](#serverless_mode_tsg)

* For `Classic` mode, refer to [classic mode troubleshooting](#classic_mode_tsg)

Second, you need to capture service traces to troubleshoot. For how to capture traces, refer to [How to capture service traces](#how-to-capture-service-traces).

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

## How to capture service traces

To simplify troubleshooting process, Azure SignalR service provides **live trace tool** to expose service traces on **connectivity** and **messaging** categories. The traces include but aren't limited to connection connected/disconnected events and message received/left events. With **live trace tool**, you can capture, view, sort, filter and export live traces. For more information, see [How to use live trace tool](./signalr-howto-troubleshoot-live-trace.md).

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

<a name="default_mode_tsg"></a>

## Default mode troubleshooting

When **ASRS** is in *Default* mode, there are **three** roles: *Client*, *Server*, and *Service*:

* *Client*: *Client* stands for the clients connected to **ASRS**. The persistent connections connecting client and **ASRS** are called *Client Connections* in this guidance.

* *Server*: *Server* stands for the server that serves client negotiation and hosts SignalR `Hub` logic. And the persistent connections between *Server* and **ASRS** are called *Server Connections* in this guidance.

* *Service*: *Service* is the short name for **ASRS** in this guidance.

Refer to [Internals of Azure SignalR Service](https://github.com/Azure/azure-signalr/blob/dev/docs/internal.md) for the detailed introduction of the whole architecture and workflow.

There are several ways that can help you narrow down the issue. 

* If the issue happens right in the way or is repro-able, the straight-forward way is to view the on-going traffic. 

* If the issue is hard to repro, traces and logs can help.

### How to view the traffic and narrow down the issue

Capturing the on-going traffic is the most straight-forward way to narrow down the issue. You can capture the [Network traces](/aspnet/core/signalr/diagnostics#network-traces) using the options described below:

* [Collect a network trace with Fiddler](/aspnet/core/signalr/diagnostics#network-traces)

* [Collect a network trace with tcpdump](/aspnet/core/signalr/diagnostics#collect-a-network-trace-with-tcpdump-macos-and-linux-only)

* [Collect a network trace in the browser](/aspnet/core/signalr/diagnostics#collect-a-network-trace-in-the-browser)

<a name="view_traffic_client"></a>

#### Client requests

For a SignalR persistent connection, it first `/negotiate` to your hosted app server and then redirected to the Azure SignalR service and then establishes the real persistent connection to Azure SignalR service. Refer to [Internals of Azure SignalR Service](https://github.com/Azure/azure-signalr/blob/dev/docs/internal.md) for the detailed steps.

With the client-side network trace in hand, check which request fails with what status code and what response, and look for solutions inside [Troubleshooting Guide](./signalr-howto-troubleshoot-guide.md).

#### Server requests

SignalR *Server* maintains the *Server Connection* between *Server* and *Service*. When the app server starts, it starts the **WebSocket** connection to Azure SignalR service. All the client traffics are routed through Azure SignalR service to these *Server Connection*s and then dispatched to the `Hub`. When a *Server Connection* drops, the clients routed to this *Server Connection* will be impacted. Our Azure SignalR SDK has a logic "Always Retry" to reconnect the *Server Connection* with at most 1-minute delay to minimize the effects.

*Server Connection*s can drop because of network instability or regular maintenance of Azure SignalR Service, or your hosted app server updates/maintainance. As long as client-side has the disconnect/reconnect mechanism, the effect is minimal like any client-side caused disconnect-reconnect.

View the server-side network trace to find the status code and error detail why *Server Connection* drops or is rejected by the *Service*. Look for the root cause inside [Troubleshooting Guide](./signalr-howto-troubleshoot-guide.md).

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

### How to add logs

Logs can be useful to diagnose issues and monitor the running status.

<a name="add_logs_client"></a>

#### How to enable client-side log

Client side logging experience is exactly the same as when using self-hosted SignalR.

##### Enable client-side logging for `ASP.NET Core SignalR`

* [JavaScript client logging](/aspnet/core/signalr/diagnostics#javascript-client-logging)

* [.NET client logging](/aspnet/core/signalr/diagnostics#net-client-logging)


##### Enable client-side logging for `ASP.NET SignalR`

* [.NET client](/aspnet/signalr/overview/testing-and-debugging/enabling-signalr-tracing#enabling-tracing-in-the-net-client-windows-desktop-apps)

* [Enabling tracing in Windows Phone 8 clients](/aspnet/signalr/overview/testing-and-debugging/enabling-signalr-tracing#enabling-tracing-in-windows-phone-8-clients)

* [Enabling tracing in the JavaScript client](/aspnet/signalr/overview/testing-and-debugging/enabling-signalr-tracing#enabling-tracing-in-the-javascript-client)

<a name="add_logs_server"></a>

#### How to enable server-side log

##### Enable server-side logging for `ASP.NET Core SignalR`

Server-side logging for `ASP.NET Core SignalR` integrates with the `ILogger` based [logging](/aspnet/core/fundamentals/logging/?tabs=aspnetcore2x&preserve-view=true&view=aspnetcore-2.1) provided in the `ASP.NET Core` framework. You can enable server-side logging by using `ConfigureLogging`, a sample usage as follows:

```cs
.ConfigureLogging((hostingContext, logging) =>
        {
            logging.AddConsole();
            logging.AddDebug();
        })
```

Logger categories for Azure SignalR always start with `Microsoft.Azure.SignalR`. To enable detailed logs from Azure SignalR, configure the preceding prefixes to `Information` level in your **appsettings.json** file like below:

```JSON
{
    "Logging": {
        "LogLevel": {
            ...
            "Microsoft.Azure.SignalR": "Information",
            ...
        }
    }
}
```

Check if there are any abnormal warning/error logs recorded. 


##### Enable server-side traces for `ASP.NET SignalR`

When using SDK version >= `1.0.0`, you can enable traces by adding the following to `web.config`: ([Details](https://github.com/Azure/azure-signalr/issues/452#issuecomment-478858102))

```xml
<system.diagnostics>
    <sources>
      <source name="Microsoft.Azure.SignalR" switchName="SignalRSwitch">
        <listeners>
          <add name="ASRS" />
        </listeners>
      </source>
    </sources>
    <!-- Sets the trace verbosity level -->
    <switches>
      <add name="SignalRSwitch" value="Information" />
    </switches>
    <!-- Specifies the trace writer for output -->
    <sharedListeners>
      <add name="ASRS" type="System.Diagnostics.TextWriterTraceListener" initializeData="asrs.log.txt" />
    </sharedListeners>
    <trace autoflush="true" />
  </system.diagnostics>
```

Check if there are any abnormal warning/error logs recorded. 


#### How to enable logs inside Azure SignalR service

You can also [enable diagnostic logs](./signalr-howto-diagnostic-logs.md) for Azure SignalR service, these logs provide detailed information of every connection connected to the Azure SignalR service.

<a name="serverless_mode_tsg"></a>

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

## Serverless mode troubleshooting

When **ASRS** is in *Serverless* mode, only **ASP.NET Core SignalR** supports `Serverless` mode, and **ASP.NET SignalR** does **NOT** support this mode.

To diagnose connectivity issues in `Serverless` mode, the most straight forward way is to [view client side traffic](#view_traffic_client). Enable [client-side logs](#add_logs_client) and [service-side logs](#add_logs_server) can also be helpful.

<a name="classic_mode_tsg"></a>

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

## Classic mode troubleshooting

`Classic` mode is obsoleted and isn't encouraged to use. When in Classic mode, Azure SignalR service uses the connected *Server Connections* to determine if current service is in `default` mode or `serverless` mode. Classic mode can lead to intermediate client connectivity issues because, when there's a sudden drop of all the connected *Server Connection*, for example due to network instability, Azure SignalR believes it's now switched to `serverless` mode, and clients connected during this period will never be routed to the hosted app server. Enable [service-side logs](#add_logs_server) and check if there are any clients recorded as `ServerlessModeEntered` if you have hosted app server, however, some clients never reach the app server side. If you see any of these clients, [abort the client connections](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md#API), and then let the clients restart.

Troubleshooting `classic` mode connectivity and message delivery issues are similar to [troubleshooting default mode issues](#default_mode_tsg).

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

## Service health

You can check the health api for service health.

* Request: GET `https://{instance_name}.service.signalr.net/api/v1/health`

* Response status code:
  * 200: healthy.
  * 503: your service is unhealthy. You can:
    * Wait several minutes for autorecover.
    * Check the ip-address is same as the ip from portal.
    * Or restart instance.
    * If all above options don't work, contact us by adding new support request in Azure portal.

More about [disaster recovery](./signalr-concept-disaster-recovery.md).

[Having issues or feedback about the troubleshooting? Let us know.](https://aka.ms/asrs/survey/troubleshooting)

## Next steps

In this guide, you learned about how to troubleshoot connectivity and message delivery issues. You could also learn how to handle the common issues. 

> [!div class="nextstepaction"]
> [Troubleshooting guide](./signalr-howto-troubleshoot-guide.md)
---
title: How to integrate Azure SignalR with reverse proxies
description: This article provides information about the general practice integrating Azure SignalR with reverse proxies
author: vicancy
ms.author: lianwei
ms.date: 06/16/2023
ms.service: signalr
ms.topic: how-to
---

# How to integrate Azure SignalR with reverse proxies

A reverse proxy server can be used in front of Azure SignalR Service. Reverse proxy servers sit in between the clients and the Azure SignalR service and other services can help in various scenarios. For example, reverse proxy servers can load balance different client requests to different backend services, you can usually configure different routing rules for different client requests, and provide seamless user experience for users accessing different backend services. They can also protect your backend servers from common exploits vulnerabilities with centralized protection control. Services such as [Azure Application Gateway](../application-gateway/overview.md), [Azure API Management](../api-management/api-management-key-concepts.md) or [Akamai](https://www.akamai.com) can act as reverse proxy servers.

A common architecture using a reverse proxy server with Azure SignalR is as below:

:::image type="content" source="./media/signalr-howto-reverse-proxy-overview/architecture.png" alt-text="Diagram that shows the architecture using Azure SignalR with a reverse proxy server.":::   

## General practices
There are several general practices to follow when using a reverse proxy in front of SignalR Service.

* Make sure to rewrite the incoming HTTP [HOST header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) with the Azure SignalR service URL, e.g. `https://demo.service.signalr.net`. Azure SignalR is a multi-tenant service, and it relies on the `HOST` header to resolve to the correct endpoint. For example, when [configuring Application Gateway](./signalr-howto-work-with-app-gateway.md#create-an-application-gateway-instance) for Azure SignalR, select **Yes** for the option *Override with new host name*.

* When your client goes through your reverse proxy to Azure SignalR, set `ClientEndpoint` as your reverse proxy URL. When your client *negotiate*s with your hub server, the hub server will return the URL defined in `ClientEndpoint` for your client to connect. [Check here for more details.](./concept-connection-string.md#provide-client-and-server-endpoints)

  There are two ways to configure `ClientEndpoint`:
  * Add a `ClientEndpoint` section to your ConnectionString: `Endpoint=...;AccessKey=...;ClientEndpoint=<reverse-proxy-URL>`
  * Configure `ClientEndpoint` when calling `AddAzureSignalR`:
    
      ```cs
      services.AddSignalR().AddAzureSignalR(o =>
      {
          o.Endpoints = new Microsoft.Azure.SignalR.ServiceEndpoint[1]
          {
              new Microsoft.Azure.SignalR.ServiceEndpoint("<azure-signalr-connection-string>")
              {
                  ClientEndpoint = new Uri("<reverse-proxy-URL>")
              }
          };
      })
      ```

* When a client goes through your reverse proxy to Azure SignalR, there are two types of requests:
  * HTTP post request to `<reverse-proxy-URL>/client/negotiate/`, which we call as **negotiate request**
  * WebSocket/SSE/LongPolling connection request depending on your transport type to `<reverse-proxy-URL>/client/`, which we call as **connect request**.
  
  Make sure that your reverse proxy supports both transport types for `/client/` subpath. For example, when your transport type is WebSocket, make sure your reverse proxy supports both HTTP and WebSocket for `/client/` subpath.

  If you have configured multiple SignalR services behind your reverse proxy, make sure `negotiate` request and `connect` request with the same `asrs_request_id` query parameter(meaning they are for the same connection) are routed to the same SignalR service instance.
  
* When reverse proxy is used, you can further secure your SignalR service by [disabling public network access](./howto-network-access-control.md) and using [private endpoints](howto-private-endpoints.md) to allow only private access from your reverse proxy to your SignalR service through VNet.

## Next steps

- Learn [how to work with Application Gateway](./signalr-howto-work-with-app-gateway.md).

- Learn [how to work with API Management](./signalr-howto-work-with-apim.md).

- Learn more about [the internals of Azure SignalR](./signalr-concept-internals.md).
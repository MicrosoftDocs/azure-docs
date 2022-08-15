---
title: How to integrate Azure SignalR with reverse proxies
description: This article provides information about the general practice integrating Azure SignalR with reverse proxies
author: vicancy
ms.author: lianwei
ms.date: 08/08/2022
ms.service: signalr
ms.topic: how-to
---

# How to integrate Azure SignalR with reverse proxies

A reverse proxy server can be used in front of Azure SignalR. Reverse proxy servers sit in between the clients and the Azure SignalR service and other services can help in various scenarios. For example, reverse proxy servers can load balance different client requests to different backend services, you can usually configure different routing rules for different client requests, and provide seamless user experience for users accessing different backend services. They can also protect your backend servers from common exploits vulnerabilities with centralized protection control. Services such as [Azure Application Gateway](/azure/application-gateway/overview), [Azure API Management](/azure/api-management/api-management-key-concepts), [Akamai](https://www.akamai.com), or [Amazon API Gateway](https://aws.amazon.com/api-gateway/) can act as reverse proxy servers.

A common architecture using a reverse proxy server with Azure SignalR is as below:

:::image type="content" source="./media/signalr-howto-reverse-proxy-overview/arch.png" alt-text="Architecture using  Azure SignalR with a reverse proxy server.":::   

When using a reverse proxy in front of Azure SignalR, there are several general practices to follow:

* Make sure to rewrite the incoming HTTP `HOST` header with Azure SignalR host name. Azure SignalR is a multi-tenant service, and it relies on the `HOST` header to resolve to the correct endpoint. For example, when [configuring Application Gateway](./signalr-howto-work-with-app-gateway.md#create-an-application-gateway-instance) for Azure SignalR, select **Yes** for the option *Override with new host name*.

* When your client goes through your reverse proxy to Azure SignalR, set `ClientEndpoint` as your reverse proxy host name. When your client **_negotiate_**s with your hub server, the hub server will return the URL defined in `ClientEndpoint` for your client to connect. [Check here for more details.](./concept-connection-string.md#client-and-server-endpoints)

  There are 2 ways to configure `ClientEndpoint`:
  1. Add `ClientEndpoint` section to your ConnectionString: `Endpoint=...;AccessKey=...;ClientEndpoint=<reverse-proxy-host>`
  2. Or configure `ClientEndpoint` when `AddAzureSignalR`:
    
      ```cs
      services.AddSignalR().AddAzureSignalR(o =>
      {
          o.Endpoints = new Microsoft.Azure.SignalR.ServiceEndpoint[1]
          {
              new Microsoft.Azure.SignalR.ServiceEndpoint("<azure-signalr-connection-string>")
              {
                  ClientEndpoint = new Uri("<reverse-proxy-host>")
              }
          };
      })
      ```

* When your server goes through your reverse proxy to Azure SignalR, set `ServerEndpoint` as your reverse proxy host name. Your app server will use the URL defined in `ServerEndpoint` to start the server connections or REST API calls. [Check here for more details.](./concept-connection-string.md#client-and-server-endpoints)

  There are 2 ways to configure `ServerEndpoint`:
    1. Add `ServerEndpoint` section to your ConnectionString: `Endpoint=...;AccessKey=...;ServerEndpoint=<reverse-proxy-host>`
    2. Or configure `ServerEndpoint` when `AddAzureSignalR`:
    
        ```cs
        services.AddSignalR().AddAzureSignalR(o =>
        {
            o.Endpoints = new Microsoft.Azure.SignalR.ServiceEndpoint[1]
            {
                new Microsoft.Azure.SignalR.ServiceEndpoint("<azure-signalr-connection-string>")
                {
                    ServerEndpoint = new Uri("<reverse-proxy-host>")
                }
            };
        })
        ```

* When your client goes through your reverse proxy to Azure SignalR, there are 2 types of requests:
  1. HTTP post request to `<reverse-proxy-host>/client/negotiate`
  2. WebSocket/SSE/LongPolling connection request depending on your transport type to `<reverse-proxy-host>/client`
  
  When your transport type is WebSocket for example, make sure your reverse proxy supports both HTTP and WebSocket for `/client` subpath.

## Next steps

- Learn [how to work with Application Gateway](./signalr-howto-work-with-app-gateway.md).

- Learn more about [the internals of Azure SignalR](./signalr-concept-internals.md).
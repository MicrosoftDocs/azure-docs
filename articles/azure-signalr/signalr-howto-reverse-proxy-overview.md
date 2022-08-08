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

A reverse proxy server can be used in front of Azure SignalR. When using a reverse proxy in front of Azure SignalR, there are several general practices to follow:

* Make sure to rewrite the incoming HTTP `HOST` header with Azure SignalR host name. Azure SignalR is a multi-tenant service, and it relies on the `HOST` header to resolve to the correct endpoint.

* When your client goes through your reverse proxy to Azure SignalR, set `ClientEndpoint` as your reverse proxy host name
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

* When your server goes through your reverse proxy to Azure SignalR, set `ServerEndpoint` as your reverse proxy host name
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
  2. WebSocket/SSE/Longpolling connection request depending on your transport type to `<reverse-proxy-host>/client`
  When your transport type is WebSocket for example, make sure your reverse proxy supports both HTTP and WebSocket for `/client` subpath.

## Next steps

- Learn [how to integrate Azure SignalR with App Gateway](./signalr-howto-app-gateway-integration.md).

- Learn more about [the internals of Azure SignalR](./signalr-concept-internals.md).
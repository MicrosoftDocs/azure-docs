---
title: Service mode in Azure SignalR Service
description: An overview of different service modes in Azure SignalR Service, explain their differences and applicable user scenarios
author: chenkennt
ms.service: signalr
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: kenchen
---
# Service mode in Azure SignalR Service

Service mode is an important concept in Azure SignalR Service. When you create a new SignalR resource, you will be asked to specify a service mode:

:::image type="content" source="media/concept-service-mode/create.png" alt-text="Choose service mode when create":::

You can also change it later in the settings menu:

:::image type="content" source="media/concept-service-mode/update.png" alt-text="Update service mode":::

Azure SignalR Service currently supports three service modes: **default**, **serverless** and **classic**. Your SignalR resource will behave differently in different modes. In this article, you'll learn their differences and how to choose the right service mode based on your scenario.

## Default mode

Default mode is the default value for service mode when you create a new SignalR resource. In this mode, your application works as a typical ASP.NET Core (or ASP.NET) SignalR application, where you have a web server that hosts a hub (called hub server hereinafter) and clients can have duplex real-time communication with the hub server. The only difference is instead of connecting client and server directly, client and server both connect to SignalR service and use the service as a proxy. Below is a diagram that illustrates the typical application structure in default mode:

:::image type="content" source="media/concept-service-mode/default.png" alt-text="Application structure in default mode":::

So if you have a SignalR application and want to integrate with SignalR service, default mode should be the right choice for most cases.

### Connection routing in default mode

In default mode, there will be websocket connections between hub server and SignalR service (called server connections). These connections are used to transfer messages between server and client. When a new client is connected, SignalR service will route the client to one hub server (assume you have more than one server) through existing server connections. Then the client connection will stick to the same hub server during its lifetime. When client sends messages, they always go to the same hub server. With this behavior, you can safely maintain some states for individual connections on your hub server. For example, if you want to stream something between server and client, you don't need to consider the case that data packets go to different servers.

> [!IMPORTANT]
> This also means in default mode client cannot connect without server being connected first. If all your hub servers are disconnected due to network interruption or server reboot, your client connect will get an error telling you no server is connected. So it's your responsibility to make sure at any time there is at least one hub server connected to SignalR service (for example, have multiple hub servers and make sure they won't go offline at the same time for things like maintenance).

This routing model also means when a hub server goes offline, the connections routed that server will be dropped. So you should expect connection drop when your hub server is offline for maintenance and handle reconnect properly so that it won't have negative impact to your application.

## Serverless mode

Serverless mode, as its name implies, is a mode that you cannot have any hub server. Comparing to default mode, in this mode client doesn't require hub server to get connected. All connections are connected to service in a "serverless" mode and service is responsible for maintaining client connections like handling client pings (in default mode this is handled by hub servers).

Also there is no server connection in this mode (if you try to use service SDK to establish server connection, you will get an error). Therefore there is also no connection routing and server-client stickiness (as described in the default mode section). But you can still have server-side application to push messages to clients. This can be done in two ways, use [REST APIs](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) for one-time send, or through a websocket connection so that you can send multiple messages more efficiently (note this websocket connection is different than server connection).

> [!NOTE]
> Both REST API and websocket way are supported in SignalR service [management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md). If you're using a language other than .NET, you can also manually invoke the REST APIs following this [spec](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md).
>
> If you're using Azure Functions, you can use [SignalR service bindings for Azure Functions](../azure-functions/functions-bindings-signalr-service.md) (hereinafter called function binding) to send messages as an output binding.

It's also possible for your server application to receive messages and connection events from clients. Service will deliver messages and connection events to preconfigured endpoints (called Upstream) using webhooks. Comparing to default mode, there is no guarantee of stickiness and HTTP requests may be less efficient than websocket connections.

For more information about how to configure upstream, see this [doc](./concept-upstream.md).

Below is a diagram that illustrates how serverless mode works:

:::image type="content" source="media/concept-service-mode/serverless.png" alt-text="Application structure in serverless mode":::

> [!NOTE]
> Please note in default mode you can also use REST API/management SDK/function binding to directly send messages to client if you don't want to go through hub server. But in default mode client connections are still handled by hub servers and upstream won't work in that mode.

## Classic mode

Classic is a mixed mode of default and serverless mode. In this mode, connection mode is decided by whether there is hub server connected when client connection is established. If there is hub server, client connection will be routed to a hub server. Otherwise it will enter a serverless mode where client to server message cannot be delivered to hub server. This will cause some discrepancies, for example if all hub servers are unavailable for a short time, all client connections created during that time will be in serverless mode and cannot send messages to hub server.

> [!NOTE]
> Classic mode is mainly for backward compatibility for those applications created before there is default and serverless mode. It's strongly recommended to not use this mode anymore. For new applications, please choose default or serverless based on your scenario. For existing applications, it's also recommended to review your use cases and choose a proper service mode.

Classic mode also doesn't support some new features like upstream in serverless mode.

## Choose the right service mode

Now you should understand the differences between service modes and know how to choose between them. As you already learned in the previous section, classic mode is not encouraged and you should only choose between default and serverless. Here are some more tips that can help you make the right choice for new applications and retire classic mode for existing applications.

* If you're already familiar with how SignalR library works and want to move from a self-hosted SignalR to use Azure SignalR Service, choose default mode. Default mode works exactly the same way as self-hosted SignalR (and you can use the same programming model in SignalR library), SignalR service just acts as a proxy between clients and hub servers.

* If you're creating a new application and don't want to maintain hub server and server connections, choose serverless mode. This mode usually works together with Azure Functions so you don't need to maintain any server at all. You can still have duplex communications (with REST API/management SDK/function binding + upstream) but the programming model will be different than SignalR library.

* If you have both hub servers to serve client connections and backend application to directly push messages to clients (for example through REST API), you should still choose default mode. Keep in mind that the key difference between default and serverless mode is whether you have hub servers and how client connections are routed. REST API/management SDK/function binding can be used in both modes.

* If you really have a mixed scenario, for example, you have two different hubs on the same SignalR resource, one used as a traditional SignalR hub and the other one used with Azure Functions and doesn't have hub server, you should really consider to separate them into two SignalR resources, one in default mode and one in serverless mode.

## Next steps

To learn more about how to use default and serverless mode, read the following articles:

* [Azure SignalR Service internals](signalr-concept-internals.md)

* [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
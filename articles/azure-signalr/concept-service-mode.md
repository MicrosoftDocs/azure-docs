---
title: Service mode in Azure SignalR Service
description: An overview of service modes in Azure SignalR Service.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.date: 09/01/2022
ms.author: lianwei
---
# Service mode in Azure SignalR Service

Service mode is an important concept in Azure SignalR Service. SignalR Service currently supports three service modes: *Default*, *Serverless*, and *Classic*. Your SignalR Service resource will behave differently in each mode. In this article, you'll learn how to choose the right service mode based on your scenario.

## Setting the service mode

You'll be asked to specify a service mode when you create a new SignalR resource in the Azure portal.

:::image type="content" source="media/concept-service-mode/create.png" alt-text="Azure portal – Choose service mode when creating a SignalR Service":::

You can also change the service mode later in the settings menu.

:::image type="content" source="media/concept-service-mode/update.png" alt-text="Update service mode":::

Use `az signalr create` and `az signalr update` to set or change the service mode by using the [Azure SignalR CLI](/cli/azure/service-page/azure%20signalr).

## Default mode

As the name implies, *Default* mode is the default service mode for SignalR Service. In Default mode, your application works as a typical [ASP.NET Core SignalR](/aspnet/core/signalr/introduction) or ASP.NET SignalR (deprecated) application. You have a web server application that hosts a hub, called a *hub server*, and clients have full duplex communication with the hub server. The difference between ASP.NET Core SignalR and Azure SignalR Service is instead of connecting client and hub server directly, client and server both connect to SignalR Service and use the service as a proxy. The following diagram shows the typical application structure in Default mode.

:::image type="content" source="media/concept-service-mode/default.png" alt-text="Application structure in Default mode":::

Default mode is usually the right choice when you have a SignalR application that you want to use with SignalR Service.

### Connection routing in Default mode

In Default mode, there are WebSocket connections between hub server and SignalR Service called *server connections*. These connections are used to transfer messages between a server and client. When a new client is connected, SignalR Service will route the client to one hub server (assume you've more than one server) through existing server connections. The client connection will stick to the same hub server during its lifetime. This property is referred to as *connection stickiness*. When the client sends messages, they always go to the same hub server. With stickiness behavior, you can safely maintain some states for individual connections on your hub server. For example, if you want to stream something between server and client, you don't need to consider the case where data packets go to different servers.

> [!IMPORTANT]
> In Default mode a client cannot connect without a hub server being connected to the service first. If all your hub servers are disconnected due to network interruption or server reboot, your client connections will get an error telling you no server is connected. It's your responsibility to make sure there is always at least one hub server connected to SignalR service. For example, you can design your application with multiple hub servers, and then make sure they won't all go offline at the same time.

The default routing model also means when a hub server goes offline, the connections routed to that server will be dropped. You should expect connections to drop when your hub server is offline for maintenance, and handle  reconnection to minimize the effects on your application.

> [!NOTE]
> In Default mode you can also use REST API, management SDK, and function binding to directly send messages to a client if you don't want to go through a hub server. In Default mode client connections are still handled by hub servers and upstream endpoints won't work in that mode.

## Serverless mode

Unlike Default mode, Serverless mode doesn't require a hub server to be running, which is why this mode is named "serverless." SignalR Service is responsible for maintaining client connections. There's no guarantee of connection stickiness and HTTP requests may be less efficient than WebSockets connections.

Serverless mode works with Azure Functions to provide real time messaging capability. Clients work with [SignalR Service bindings for Azure Functions](../azure-functions/functions-bindings-signalr-service.md), called *function binding*, to send messages as an output binding.

Because there's no server connection, if you try to use a server SDK to establish a server connection you'll get an error. SignalR Service will reject server connection attempts in Serverless mode.

Serverless mode doesn't have connection stickiness, but you can still have a server-side application push messages to clients. There are two ways to push messages to clients in Serverless mode:

- Use [REST APIs](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md) for a one-time send event, or 
- Use a WebSocket connection so that you can send multiple messages more efficiently. This WebSocket connection is different than a server connection.

> [!NOTE]
> Both REST API and WebSockets are supported in SignalR service [management SDK](https://github.com/Azure/azure-signalr/blob/dev/docs/management-sdk-guide.md). If you're using a language other than .NET, you can also manually invoke the REST APIs following this [specification](https://github.com/Azure/azure-signalr/blob/dev/docs/rest-api.md).

It's also possible for your server application to receive messages and connection events from clients. SignalR Service will deliver messages and connection events to pre-configured endpoints (called *upstream endpoints*) using web hooks. Upstream endpoints can only be configured in Serverless mode. For more information, see [Upstream endpoints](concept-upstream.md).



The following diagram shows how Serverless mode works.

:::image type="content" source="media/concept-service-mode/serverless.png" alt-text="Application structure in Serverless mode":::

## Classic mode

> [!NOTE]
> Classic mode is mainly for backward compatibility for applications created before the Default and Serverless modes were introduced. Don't use Classic mode except as a last resort. Use Default or Serverless for new applications, based on your scenario. You should consider redesigning existing applications to eliminate the need for Classic mode.

Classic is a mixed mode of Default and Serverless modes. In Classic mode, connection type is decided by whether there's a hub server connected when the client connection is established. If there's a hub server, the client connection will be routed to a hub server. If a hub server isn't available, the client connection will be made in a limited serverless mode where client-to-server messages can't be delivered to a hub server. Classic mode serverless connections don't support some features such as upstream endpoints.

If all your hub servers are offline for any reason, connections will be made in Serverless mode. It's your responsibility to ensure that at least one hub server is always available. 

## Choose the right service mode

Now you should understand the differences between service modes and know how to choose between them. As previously discussed, Classic mode isn't recommended for new or existing applications. Here are some more tips that can help you make the right choice for service mode and help you retire Classic mode for existing applications.

- Choose Default mode if you're already familiar with how SignalR library works and want to move from a self-hosted SignalR to use Azure SignalR Service. Default mode works exactly the same way as self-hosted SignalR, and you can use the same programming model in SignalR library. SignalR Service acts as a proxy between clients and hub servers.

- Choose Serverless mode if you're creating a new application and don't want to maintain hub server and server connections. Serverless mode works together with Azure Functions so that you don't need to maintain any server at all. You can still have full duplex communications with REST API, management SDK, or function binding + upstream endpoint, but the programming model will be different than SignalR library.

- Choose Default mode if you have *both* hub servers to serve client connections and a backend application to directly push messages to clients. The key difference between Default and Serverless mode is whether you have hub servers and how client connections are routed. REST API/management SDK/function binding can be used in both modes.

- If you really have a mixed scenario, you should consider separating use cases into multiple SignalR Service instances with service mode set according to use. An example of a mixed scenario that requires Classic mode is where you have two different hubs on the same SignalR resource. One hub is used as a traditional SignalR hub and the other hub is used with Azure Functions. This example should be split into two resources, with one instance in Default mode and one in Serverless mode.

## Next steps

See the following articles to learn more about how to use Default and Serverless modes.

- [Azure SignalR Service internals](signalr-concept-internals.md)

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)

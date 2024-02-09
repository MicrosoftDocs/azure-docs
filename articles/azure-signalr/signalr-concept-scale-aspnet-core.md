---
title: Scale SignalR Apps with Azure SignalR
description: An overview of using Azure SignalR service to scale SignalR applications.
author: vicancy
ms.service: signalr
ms.topic: conceptual
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.date: 11/11/2023
ms.author: lianwei
---
# Scale ASP.NET Core SignalR applications with Azure SignalR Service

## Developing SignalR apps

Currently, there are [two versions](/aspnet/core/signalr/version-differences) of SignalR you can use with your web applications: ASP.NET SignalR, and the new ASP.NET Core SignalR. ASP.NET Core SignalR is a rewrite of the previous version. As a result, ASP.NET Core SignalR isn't backward compatible with the earlier SignalR version. The APIs and behaviors are different. The Azure SignalR Service supports both versions.

With Azure SignalR Service, you have the ability to run your actual web application on multiple platforms (Windows, Linux, and macOS) while hosting with [Azure App Service](../app-service/overview.md), [IIS](/aspnet/core/host-and-deploy/iis/index), [Nginx](/aspnet/core/host-and-deploy/linux-nginx), [Apache](/aspnet/core/host-and-deploy/linux-apache), [Docker](/aspnet/core/host-and-deploy/docker/index). You can also use self-hosting in your own process.

If the goals for your application include: supporting the latest functionality for updating web clients with real-time content updates, running across multiple platforms (Azure, Windows, Linux, and macOS), and hosting in different environments, then the best choice could be using the Azure SignalR Service.

## Why not deploy SignalR myself?

It's still a valid approach to deploy your own Azure web app supporting SignalR as a backend component to your overall web application.

One of the key reasons to use the Azure SignalR Service is simplicity. With Azure SignalR Service, you don't need to handle problems like performance, scalability, availability. These issues are handled for you with a 99.9% service-level agreement.

Also, WebSockets are typically the preferred technique to support real-time content updates. However, load balancing a large number of persistent WebSocket connections becomes a complicated problem to solve as you scale. Common solutions use: DNS load balancing, hardware load balancers, and software load balancing. Azure SignalR Service handles this problem for you.

For ASP.NET Core SignalR, another reason might be you have no requirements to actually host a web application at all. The logic of your web application might use [Serverless computing](https://azure.microsoft.com/overview/serverless-computing/). For example, maybe your code is only hosted and executed on demand with [Azure Functions](../azure-functions/index.yml) triggers. This scenario can be tricky because your code only runs on-demand and doesn't maintain long connections with clients. Azure SignalR Service can handle this situation since the service already manages connections for you. For more information, see [overview on how to use SignalR Service with Azure Functions](signalr-concept-azure-functions.md). Since ASP.NET SignalR uses a different protocol, such Serverless mode isn't supported for ASP.NET SignalR.

## How does it scale?

It's common to scale SignalR with SQL Server, Azure Service Bus, or Azure Cache for Redis. Azure SignalR Service handles the scaling approach for you. The performance and cost is comparable to these approaches without the complexity of dealing with these other services. All you have to do is update the unit count for your service. Each unit supports up to 1000 client connections.

## Next steps

* [Quickstart: Create a chat room with Azure SignalR](signalr-quickstart-dotnet-core.md)
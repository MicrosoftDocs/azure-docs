---
title: Scale ASP.NET Core SignalR with Azure SignalR | Microsoft Docs
description: An overview of using Azure SignalR service to scale ASP.NET Core SignalR applications.
services: signalr
documentationcenter: ''
author: sffamily
manager: cfowler
editor: 

ms.service: signalr
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 09/13/2018
ms.author: zhshang
---

# Scale ASP.NET Core SignalR applications with Azure SignalR Service

## Developing SignalR apps

Currently, there are [two versions](https://docs.microsoft.com/en-us/aspnet/core/signalr/version-differences) of SignalR you can use with your web applications: SignalR for ASP.NET, and ASP.NET Core SignalR, which is the newest version. The Azure SignalR Service is an Azure-managed service built on ASP.NET Core SignalR. 

ASP.NET Core SignalR is a rewrite of the previous version. As a result, ASP.NET Core SignalR is not backward compatible with the earlier SignalR version. The APIs and behaviors are different. The ASP.NET Core SignalR SDK targets .NET Standard so you can still use it with the .NET Framework. However, you must use the new APIs instead of old ones. If you're using SignalR and want to move to ASP.NET Core SignalR, or Azure SignalR Service, you'll need to change your code to handle differences in the APIs.

With Azure SignalR Service, the server-side component of ASP.NET Core SignalR is hosted in Azure. However, since the technology is built on top of ASP.NET Core, you have the ability to run your actual web application on multiple platforms (Windows, Linux, and MacOS) while hosting with [Azure App Service](../app-service/app-service-web-overview.md), [IIS](https://docs.microsoft.com/aspnet/core/host-and-deploy/iis/index), [Nginx](https://docs.microsoft.com/aspnet/core/host-and-deploy/linux-nginx), [Apache](https://docs.microsoft.com/aspnet/core/host-and-deploy/linux-apache), [Docker](https://docs.microsoft.com/aspnet/core/host-and-deploy/docker/index). You can also use self-hosting in your own process.

If the goals for your application include: supporting the latest functionality for updating web clients with real-time content updates, running across multiple platforms (Azure, Windows, Linux, and macOS), and hosting in different environments, then the best choice could be leveraging the Azure SignalR Service.


## Why not deploy SignalR myself?

It is still a valid approach to deploy your own Azure web app supporting ASP.NET Core SignalR as a backend component to your overall web application.

One of the key reasons to use the Azure SignalR Service is simplicity. With Azure SignalR Service, you don't need to handle problems like performance, scalability, availability. These issues are handled for you with a 99.9% service-level agreement.

Also, WebSockets are typically the preferred technique to support real-time content updates. However, load balancing a large number of persistent WebSocket connections becomes a complicated problem to solve as you scale. Common solutions leverage: DNS load balancing, hardware load balancers, and software load balancing. Azure SignalR Service handles this problem for you.

Another reason may be you have no requirements to actually host a web application at all. The logic of your web application may leverage [Serverless computing](https://azure.microsoft.com/overview/serverless-computing/). For example, maybe your code is only hosted and executed on demand with [Azure Functions](https://docs.microsoft.com/azure/azure-functions/) triggers. This scenario can be tricky because your code only runs on-demand and doesn't maintain long connections with clients. Azure SignalR Service can handle this situation since the service already manages connections for you. See the [overview on how to use SignalR Service with Azure Functions](signalr-overview-azure-functions.md) for more details. 

## How does it scale?

It is common to scale SignalR with SQL Server, Azure Service Bus, or Redis Cache. Azure SignalR Service handles the scaling approach for you. The performance and cost is comparable to these approaches without the complexity of dealing with these other services. All you have to do is update the unit count for your service. Each unit supports up to 1000 client connections.

## Next steps
* [Quickstart: Create a chat room with Azure SignalR](signalr-quickstart-dotnet-core.md)  
  


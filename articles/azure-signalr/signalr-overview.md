---
title: What is Azure SignalR | Microsoft Docs
description: An overview of the Azure SignalR service.
services: signalr
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: 

ms.service: signalr
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 04/17/2018
ms.author: wesmc
#Customer intent: As a developer, I want to push real-time data in my ASP.NET apps. So that my clients are updated without the need to poll, or request updates.
---

# What is Azure SignalR Service

The Azure SignalR Service is an Azure-managed service based on [*ASP.NET Core SignalR (SignalR Core)*](https://docs.microsoft.com/aspnet/core/signalr/introduction). ASP.NET Core SignalR is an [open source library](https://github.com/aspnet/signalr) that simplifies the process of adding real-time web functionality to applications over HTTP. This real-time functionality allows the web server to push content updates to connected clients. As a result, clients are updated without the need to poll the server, or submit new HTTP requests for updates.

This topic provides an overview of the Azure SignalR Service. If you want to get started, start with the [ASP.NET Core quickstart](signalr-quickstart-dotnet-core.md).

## What is SignalR Service used for? 

The Azure SignalR Service simplifies the process of adding real-time web functionality to applications over HTTP. There are many application types that require real-time content updates. The following application types are good candidates for using the Azure SignalR Service:

* Apps that require high frequency updates from the server. Examples are gaming, social networks, voting, auction, maps, and GPS apps.
* Dashboards and monitoring apps. Examples include company dashboards, instant sales updates, or travel alerts.
* Collaborative apps. Whiteboard apps and team meeting software are examples of collaborative apps.
* Apps that require notifications. Social networks, email, chat, games, travel alerts, and many other apps use notifications.

Internally, SignalR is an abstraction over a number of techniques used for building real-time web applications. [WebSockets](https://wikipedia.org/wiki/WebSocket) is the optimal transport, but other techniques like [Server-Sent Events (SSE)](https://wikipedia.org/wiki/Server-sent_events) and Long Polling are used when other options aren't available. SignalR automatically detects and initializes the appropriate transport based on the features supported on the server and client.

## Developing SignalR apps

Currently, there are two versions of SignalR you can use with your web applications: *SignalR (for ASP.NET)*, and *ASP.NET Core SignalR (SignalR Core)*, which is the newest version. The Azure SignalR Service, also called *SignalR Service*, is an Azure-managed service built on SignalR Core. SignalR Core is not a simple .NET Core port of previous SignalR version, but a rewrite of the original version. As a result, SignalR Core is not backward compatible with the earlier SignalR version. The APIs and behaviors are different. The SignalR Core SDK is .NET Standard so you can still use it with the .NET Framework. You must use the new APIs instead of old ones. If you're using SignalR and want to move to SignalR Core, or Azure SignalR Service, you'll need to change your code to handle differences in the APIs.

With Azure SignalR Service, the server-side component of SignalR Core is hosted in Azure. However, since the technology is built on top of ASP.NET Core, you have the ability to run your actual web application on multiple platforms (Azure, Windows, Linux, and MacOS) while hosting with [IIS](https://docs.microsoft.com/aspnet/core/host-and-deploy/iis/index), [Nginx](https://docs.microsoft.com/aspnet/core/host-and-deploy/linux-nginx), [Apache](https://docs.microsoft.com/aspnet/core/host-and-deploy/linux-apache), [Docker](https://docs.microsoft.com/aspnet/core/host-and-deploy/docker/index), or self-hosting in your own process.

If goal for your application include: supporting the latest functionality for updating web clients with real-time content updates, running across multiple platforms (Azure, Windows, Linux, and MacOS), ans hosting in different environments, then the best choice could be leveraging the Azure SignalR Service.


## Why not deploy SignalR myself?

It is still a valid approach to deploy your own Azure web app supporting SignalR Core as a backend component to your overall web application.

One of the obvious key reasons to use Azure SignalR Service instead of deploying your own Azure web app hosting SignalR is simplicity. With Azure SignalR Service, you don't need to handle problems like performance, scalability, availability. These are handled for you with a 99.9% service-level agreement.

Depending on the scenario, another reason may be you have no requirements to actually host a web application at all. The logic of your web application may leverage [Serverless computing](https://azure.microsoft.com/overview/serverless-computing/). For example, maybe your code is only hosted and executed on demand with [Azure Functions](https://docs.microsoft.com/azure/azure-functions/) triggers. This scenario can be tricky because your code only runs on-demand and doesn't maintain long connections with clients. Azure SignalR Service can handle this since the service already manages connections for you.

## How does it scale?

There are three common patterns typically used to scale out with SignalR:

* [SignalR Scaleout with SQL Server](https://docs.microsoft.com/aspnet/signalr/overview/performance/scaleout-with-sql-server)
* [SignalR Scaleout with Azure Service Bus](https://docs.microsoft.com/aspnet/signalr/overview/performance/scaleout-with-windows-azure-service-bus)
* [SignalR Scaleout with Redis Cache](https://docs.microsoft.com/aspnet/signalr/overview/performance/scaleout-with-redis)

Azure SignalR Service, handles the scaling approach automatically for you. The performance and cost is comparable to these approaches without the complexity of dealing with these other services. All you have to do is update the unit count for your service. Each service unit supports up to 1000 client connections.

## Next steps
* [Quickstart: Create a chat room with Azure SignalR](signalr-quickstart-dotnet-core.md)  
  Create your first ASP.NET Core app that uses the Azure SignalR Service. 


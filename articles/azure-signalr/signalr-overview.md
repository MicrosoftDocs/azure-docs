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

The Azure SignalR Service is an Azure managed service based on [ASP.NET Core SignalR](https://docs.microsoft.com/aspnet/core/signalr/introduction?view=aspnetcore-2.1). SignalR for ASP.NET Core is an [open source library](https://github.com/aspnet/signalr) that simplifies the process of adding real-time web functionality to applications over HTTP. This real-time functionality allows the web server to push content updates to connected clients. As a result, clients are updated without the need to poll the server, or submit new HTTP requests for updates. There are many application types that need real-time content updates. The following application types are good candidates for using the Azure SignalR Service:

* Apps that require high frequency updates from the server. Examples are gaming, social networks, voting, auction, maps, and GPS apps.
* Dashboards and monitoring apps. Examples include company dashboards, instant sales updates, or travel alerts.
* Collaborative apps. Whiteboard apps and team meeting software are examples of collaborative apps.
* Apps that require notifications. Social networks, email, chat, games, travel alerts, and many other apps use notifications.


Currently, there are two versions of SignalR: SignalR (for ASP.NET), and SignalR Core (for ASP.NET Core). The Azure SignalR Service is based on SignalR Core, which is the newest version. SignalR Core is not a simple .NET Core port of SignalR, but a rewrite of the original version. As a result, SignalR Core is not backward compatible with the earlier SignalR version. The API interfaces and behaviors are different. The SignalR Core SDK is .NET Standard so you can still use it with the .NET Framework. You use the new APIs instead of old ones. If you're using SignalR and want to move to SignalR Core, or Azure SignalR Service, you'll need to change your code to handle differences in the APIs.

SignalR Core has broader platform reach than SignalR since .NET Core can be employed on Windows, MacOS, and Linux?


## Why use it over deploying an Azure web app with SignalR Core

I think we should add some comments to help customers understand how the Azure SignalR Service offering compares to these other alternatives. However, I'm not sure of the key factors are that are favorable to Azure SignalR Service, except maybe simplicity.

 * What key reasons would compel customers to use the Azure SignalR Service instead of building SignalR into their backend as an App Service?  
 * Could the 99% SLA for Azure SignalR Service offer more coverage and potentially less down time compared to building SignalR into a backend myself?

## How does it scale?

When talking about scaling looks like there are actually quite a few comparative approaches if they decide to build SignalR into their backend:

* [SignalR Scaleout with SQL Server](https://docs.microsoft.com/aspnet/signalr/overview/performance/scaleout-with-sql-server)
* [SignalR Scaleout with Azure Service Bus](https://docs.microsoft.com/aspnet/signalr/overview/performance/scaleout-with-windows-azure-service-bus)
* [SignalR Scaleout with Redis Cache](https://docs.microsoft.com/aspnet/signalr/overview/performance/scaleout-with-redis)

I would expect Redis Cache might have a performance advantage over these other two.  

* Do we know how Azure SignalR Server performance compares to these approaches? I think it is obviously a more simple approach.  

* Will it be cheaper or at least similar priced at the same scale?

If I understand correctly, with DS2 Basic tier, I can scale to 128 instances with 1000 connection per instance for a total of 128,000 connections. I'm not sure how common it would be for customers to require this many connections or possibly more.  

* Is this a temporary limitation which will change after we make more tiers available? I guess if the answer is yes, then we would probably offer comparative scaling extents to these other approaches. Should we comment on any of this at this time?

## Next steps
* [Quickstart: Create a chat room with Azure SignalR](signalr-quickstart-dotnet-core.md)  
  Create your your first .NET Core app that uses the Azure SignalR Service. 


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

# What is Azure SignalR

Azure SignalR Service is an Azure managed service based on [SignalR for ASP.NET Core](https://docs.microsoft.com/aspnet/core/signalr/introduction?view=aspnetcore-2.1). SignalR for ASP.NET Core is an open source library that simplifies the process of adding real-time web functionality to applications. This real-time functionality allows the server to push content updates to connected clients. As a result, clients are updated without the need to poll the server, or submit new requests for updates. There are many application types that require real-time content updates. These can include games, stock tickers, monitoring applications, and communication or chat applications.

There are two versions of SignalR: SignalR (for ASP.NET), and SignalR Core (for ASP.NET Core). Azure SignalR Service is based on SignalR Core, which is the newest version. SignalR Core is not a simple .NET Core port of SignalR, but a rewrite of the original version. As a result, SignalR Core is not backward compatible. The API interfaces and behaviors are different. This doesn't mean you cannot use the service with the .NET Framework. Our SDK is .NET Standard so you can still use it with the .NET Framework. You just use the new APIs instead of old ones. If you're using SignalR and want to move to SignalR Core, or Azure SignalR Service, you'll need to change your code to handle these differences.

, therefore you can only use SignalR Core SDK when using the service. 






## Next steps
* [Enable cache diagnostics](cache-how-to-monitor.md#enable-cache-diagnostics) so you can [monitor](cache-how-to-monitor.md) the health of your cache.
* Read the official [Redis documentation](http://redis.io/documentation).


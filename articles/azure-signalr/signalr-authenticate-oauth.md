---
title: Tutorial for authenticating Azure SignalR Service clients with OAuth | Microsoft Docs
description: Learn how to authenticate Azure SignalR Service clients with OAuth
services: signalr
documentationcenter: ''
author: wesmc7777
manager: cfowler
editor: ''

ms.assetid: 
ms.service: signalr
ms.workload: tbd
ms.devlang: na
ms.topic: tutorial
ms.custom: mvc
ms.date: 04/17/2018
ms.author: wesmc
#Customer intent: As an ASP.NET Core developer, I want to provide real authentication for my clients to push content updates.
---
# Tutorial: Azure SignalR Service authentication with OAuth


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Improve data throughput and reduce database load by storing and retrieving data using Azure Redis Cache.
> * Use a Redis sorted set to retrieve the top five teams.
> * Provision the Azure resources for the application using a Resource Manager template.
> * Publish the application to Azure using Visual Studio.


## Prerequisites

To complete this tutorial, you must have the following prerequisites:

* This tutorial continues to update the *ContosoTeamStats* ASP.NET web app created in the [ASP.NET quickstart for Azure Redis Cache](cache-web-app-howto.md). If you have not completed those steps to set up your cache and Azure App service, complete that first.
* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
    * ASP.NET and web development
    * Azure Development
    * .NET desktop development with SQL Server Express LocalDB or [SQL Server 2017 Express edition](https://www.microsoft.com/sql-server/sql-server-editions-express).
* You need an Azure account to complete the quickstart. You can [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features.


## Next steps

In this tutorial, you added authentication with OAuth to provide a better approach to authentication with Azure SignalR Service. To learn more about using Azure SignalR Server, continue to the next tutorial that demonstrates integration with Azure Functions.

> [!div class="nextstepaction"]
> [Integrate Azure Functions with Azure SignalR Service](./signalr-integrate-functions.md)



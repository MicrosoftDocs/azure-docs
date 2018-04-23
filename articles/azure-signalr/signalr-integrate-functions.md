---
title: Tutorial for integrating Azure functions with Azure SignalR Service | Microsoft Docs
description: Learn how to use Azure Functions with Azure SignalR Service
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
#Customer intent: As an ASP.NET Core developer, I want to integrate my app with Azure Functions to push content updates triggered by my functions.
---

# Tutorial: Integrate Azure Functions with Azure SignalR Service


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Improve data throughput and reduce database load by storing and retrieving data using Azure Redis Cache.
> * Use a Redis sorted set to retrieve the top five teams.
> * Provision the Azure resources for the application using a Resource Manager template.
> * Publish the application to Azure using Visual Studio.


## Prerequisites

To complete this tutorial, you must have the following prerequisites:

* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the following workloads:
    * ASP.NET and web development
    * Azure Development
    * .NET desktop development with SQL Server Express LocalDB or [SQL Server 2017 Express edition](https://www.microsoft.com/sql-server/sql-server-editions-express).
* You need an Azure account to complete the quickstart. You can [Open an Azure account for free](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=redis_cache_hero). You get credits that can be used to try out paid Azure services. Even after the credits are used up, you can keep the account and use free Azure services and features.


## Clean up resources


## Next steps

In this tutorial, you learned how to intergrate with Azure Function to push updates based on Azure Function triggers. To learn more about using Azure SignalR Server, continue to the next tutorial that demonstrates authentication with OAuth.

> [!div class="nextstepaction"]
> [Azure SignalR Service authentication with OAuth](./signalr-authenticate-oauth.md)




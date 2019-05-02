---
title: Azure App Configuration point-in-time snapshot | Microsoft Docs
description: An overview of how point-in-time snapshot works in Azure App Configuration
services: azure-app-configuration
documentationcenter: ''
author: yegu-ms
manager: balans
editor: ''

ms.service: azure-app-configuration
ms.devlang: na
ms.topic: overview
ms.workload: tbd
ms.date: 02/24/2019
ms.author: yegu
---

# Point-in-time snapshot

Azure App Configuration keeps records of the precise times when a new key-value pair is created and then modified. These records form a complete timeline in key-value changes. An app configuration store can reconstruct the history of any key value and replay its past value at any given moment, up to the present. With this feature, you can “time-travel” backward and retrieve an old key value. For example, you can get yesterday's configuration settings, just before the most recent deployment, in order to recover a previous configuration and roll back the application.

## Key-value retrieval

To retrieve past key values, specify a time at which key values are snapshot in the HTTP header of a REST API call. For example:

        GET /kv HTTP/1.1
        Accept-Datetime: Sat, 1 Jan 2019 02:10:00 GMT

Currently, App Configuration keeps seven days of change history.

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET Core web app](./quickstart-aspnet-core-app.md)  

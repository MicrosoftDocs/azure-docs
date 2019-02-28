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

Azure App Configuration keeps records of the precise times when a new key-value pair is created and subsequently modified. These records form a complete timeline in key-value changes. An app configuration store can reconstruct the history of any key-value and replay its past value at any given moment, up to the present. This feature allows you to “time-travel” backward and retrieve an old key-value. For example, you can get the configuration settings for yesterday, just before the most recent deployment so that you can recover a previous configuration in case that you need to roll back the application.

## Key-value retrieval

To retrieve past key-values, you need to specify a time at which key-values are snapshot in the HTTP header of a REST API call. For example:

        GET /revisions HTTP/1.1
        Accept-Datetime: Sat, 1 Jan 2019 02:10:00 GMT

Currently, App Configuration will retain 7 days of change history.

## Next steps

* [Quickstart: Create an ASP.NET web app](quickstart-aspnet-core-app.md)  

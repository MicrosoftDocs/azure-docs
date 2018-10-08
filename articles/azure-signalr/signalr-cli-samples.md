---
title: Azure CLI Samples - Azure SignalR Service | Microsoft Docs
description: Azure CLI Samples - Azure SignalR Service
services: signalr
documentationcenter: signalr
author: sffamily
manager: cfowler
editor: 
tags: azure-service-management

ms.service: signalr
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: signalr
ms.date: 04/20/2018
ms.author: zhshang
ms.custom: mvc
---

# Azure CLI Samples

The following table includes links to bash scripts for the Azure SignalR Service using the Azure CLI.

| | |
|-|-|
|**Create**||
| [Create a new SignalR Service and resource group](scripts/signalr-cli-create-service.md) | Creates a new Azure SignalR Service resource in a new resource group with a random name.  |
|**Integrate**||
| [Create a new SignalR Service and Web App configured to use SignalR](scripts/signalr-cli-create-with-app-service.md) | Creates a new Azure SignalR Service resource in a new resource group with a random name. Also adds a new Web App and App Service plan to host a ASP.NET Core Web App that uses the SignalR Service. The web app is configured with an App Setting to connect to the new SignalR service resource. |
| [Create a new SignalR Service and Web App configured to use SignalR, and GitHub OAuth](scripts/signalr-cli-create-with-app-service-github-oauth.md) | Creates a new Azure SignalR Service resource in a new resource group with a random name. Also adds a new Azure Web App and hosting plan to host a ASP.NET Core Web App that uses the SignalR Service. The web app is configured with app settings for the connection string to the new SignalR service resource, and client secrets to support [GitHub authentication](https://developer.github.com/v3/guides/basics-of-authentication/) as demonstrated in the [authentication tutorial](signalr-authenticate-oauth.md). The web app is also configured to use a local git repository deployment source. |
| | |

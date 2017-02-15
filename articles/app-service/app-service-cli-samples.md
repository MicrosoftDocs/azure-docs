---
title: Azure CLI Samples | Microsoft Docs
description: Azure CLI Samples
services: app-service
documentationcenter: app-service
author: syntaxc4
manager: erikre
editor: ggailey777
tags: azure-service-management

ms.assetid:
ms.service: app-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: app-service
ms.date: 02/13/2017
ms.author: cfowler

---
# Azure CLI Samples - bash

The following table includes links to bash scripts built using the Azure CLI.

| Sample | Description  |
|---|---|
|**Deploy a web app**||
| [Continuously deploy web app from GitHub](../app-service-web/app-service-web-cli-continuous-deployment-github.md)| Creates and deploys a web app which pulls code from GitHub|
| [Deploy a web app from a local Git repository](../app-service-web/app-service-web-cli-deploy-local-git.md) | Creates and deploys a web app in which code can be pushed from a local git repository|
| [Deploy a web app to a staging environment](../app-service-web/app-service-web-cli-deploy-staging-environment.md) | Creates and deploys a web app with a deployment slot for staging code changes and swapping into production|
| [Deploy an ASP.NET Core App in a Docker Container](./scripts/app-service-cli-linux-docker-aspnetcore.md)| Creates and deploys a Linux web app from a Docker container on Docker Hub |
|**Scale a web app**||
| [Scale a web app manually](./scripts/app-service-cli-scale-manual.md) | Creates and scales a web app across two instances |
| [Scale a web app worldwide with a high-availabilty architecture](./scripts/app-service-cli-scale-high-availability.md) | Creates two web apps in two different geographies and ties them together with Traffic Manager to expose a single endpoint |
|**Connect to web app**||
| [Connect a storage account to a web app](./scripts/app-service-cli-app-service-storage.md)| Creates a web app and a storage account, then adds the storage connection string to the app settings. |
|**Monitor a web app**||
| [Monitor a web app with Web Server Logs](./scripts/app-service-cli-monitor.md) | Creates a web app enables logging, then downloads the logs to your local machine |
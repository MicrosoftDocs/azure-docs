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
|**Deploy to app service**||
| [Continuously deploy web app from GitHub](../app-service-web/app-service-web-cli-continuous-deployment-github.md)| Creates a Web App which pulls code from GitHub|
| [Deploy a web app from a local Git repository](../app-service-web/app-service-web-cli-deploy-local-git.md) | Creates a Web App which allows to code to be pushed from a local git repository|
| [Deploy a web app to a staging environment](../app-service-web/app-service-web-cli-deploy-staging-environment.md) | Creates a Web App with a Deployment Slot for staging code changes |
| [Deploy an ASP.NET Core App in a Docker Container](./scripts/app-service-cli-linux-docker-aspnetcore.md)| Creates a Linux Web App loading code contained in a Docker container on Docker Hub |
|**Scale app service**||
| [Scale a Web App manually](./scripts/app-service-cli-scale-manual.md) | Creates and scales a Web App across 2 instances |
| [Scale a web app worldwide with a high-availabilty architecture](./scripts/app-service-cli-scale-high-availability.md) | Creates two Web Apps in two different geographies and makes them available through a single endpoint using Traffic Manager |
|**Connect to app service**||
| [Connect a storage account to a web app](./scripts/app-service-cli-app-service-storage.md)| Creates a Web App and a storage account, then adds the storage connection string to the app settings. |
|**Monitor app service**||
| [Monitor a web app with Web Server Logs](./scripts/app-service-cli-monitor.md) | Creates a Web App enables logging, then downloads the logs to your local machine |
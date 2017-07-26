---
title: Azure CLI Samples - App Service | Microsoft Docs
description: Azure CLI Samples - App Service
services: app-service
documentationcenter: app-service
author: syntaxc4
manager: erikre
editor: ggailey777
tags: azure-service-management

ms.assetid: 53e6a15a-370a-48df-8618-c6737e26acec
ms.service: app-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: app-service
ms.date: 03/08/2017
ms.author: cfowler
ms.custom: mvc

---
# Azure CLI Samples

The following table includes links to bash scripts built using the Azure CLI.

| | |
|-|-|
|**Create app**||
| [Create a web app and deploy code from GitHub](./scripts/app-service-cli-deploy-github.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app and deploys code from a public GitHub repository. |
| [Create a web app with continuous deployment from GitHub](./scripts/app-service-cli-continuous-deployment-github.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app with continuous publishing from a GitHub repository you own. |
| [Create a web app and deploy code from a local Git repository](./scripts/app-service-cli-deploy-local-git.md?toc=%2fcli%2fazure%2ftoc.json) | Creates an Azure web app and configures code push from a local Git repository. |
| [Create a web app and deploy code to a staging environment](./scripts/app-service-cli-deploy-staging-environment.md?toc=%2fcli%2fazure%2ftoc.json) | Creates an Azure web app with a deployment slot for staging code changes. |
| [Create an ASP.NET Core web app in a Docker container](./scripts/app-service-cli-linux-docker-aspnetcore.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app on Linux and loads a Docker image from Docker Hub. |
|**Configure app**||
| [Map a custom domain to a web app](./scripts/app-service-cli-configure-custom-domain.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app and maps a custom domain name to it. |
| [Bind a custom SSL certificate to a web app](./scripts/app-service-cli-configure-ssl-certificate.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app and binds the SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale a web app manually](./scripts/app-service-cli-scale-manual.md?toc=%2fcli%2fazure%2ftoc.json) | Creates an Azure web app and scales it across 2 instances. |
| [Scale a web app worldwide with a high-availability architecture](./scripts/app-service-cli-scale-high-availability.md?toc=%2fcli%2fazure%2ftoc.json) | Creates two Azure web apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Connect app to resources**||
| [Connect a web app to a SQL Database](./scripts/app-service-cli-app-service-sql.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app and a SQL database, then adds the database connection string to the app settings. |
| [Connect a web app to a storage account](./scripts/app-service-cli-app-service-storage.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure web app and a storage account, then adds the storage connection string to the app settings. |
| [Connect a web app to a redis cache](./scripts/app-service-cli-app-service-redis.md?toc=%2fcli%2fazure%2ftoc.json) | Creates an Azure web app and a redis cache, then adds the redis connection details to the app settings.) |
| [Connect a web app to Cosmos DB](./scripts/app-service-cli-app-service-documentdb.md?toc=%2fcli%2fazure%2ftoc.json) | Creates an Azure web app and a Cosmos DB, then adds the Cosmos DB connection details to the app settings. |
|**Monitor app**||
| [Monitor a web app with web server logs](./scripts/app-service-cli-monitor.md?toc=%2fcli%2fazure%2ftoc.json) | Creates an Azure web app, enables logging for it, and downloads the logs to your local machine. |
| | |
---
title: Azure CLI Samples for Azure App Service | Microsoft Docs
description: Find Azure CLI samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
tags: azure-service-management

ms.assetid: 53e6a15a-370a-48df-8618-c6737e26acec
ms.topic: sample
ms.date: 04/21/2022
ms.custom: mvc, devx-track-azurecli, seo-azure-cli, ignite-2022
keywords: azure cli samples, azure cli examples, azure cli code samples
ms.author: msangapu
author: msangapu-msft
---
# CLI samples for Azure App Service

The following table includes links to bash scripts built using the Azure CLI.

| Script | Description |
|-|-|
|**Create app**||
| [Create an app and deploy files with FTP](./scripts/cli-deploy-ftp.md)| Creates an App Service app and deploys a file to it using FTP. |
| [Create an app and deploy code from GitHub](./scripts/cli-deploy-github.md)| Creates an App Service app and deploys code from a public GitHub repository. |
| [Create an app with continuous deployment from GitHub](./scripts/cli-continuous-deployment-github.md)| Creates an App Service app with continuous publishing from a GitHub repository you own. |
| [Create an app and deploy code into a local Git repository](./scripts/cli-deploy-local-git.md) | Creates an App Service app and configures code push into a local Git repository. |
| [Create an app and deploy code to a staging environment](./scripts/cli-deploy-staging-environment.md) | Creates an App Service app with a deployment slot for staging code changes. |
| [Create an ASP.NET Core app in a Docker container](./scripts/cli-linux-docker-aspnetcore.md) | Creates an App Service app on Linux and loads a Docker image from Docker Hub. |
| [Create an app with a Private Endpoint](./scripts/cli-deploy-privateendpoint.md) | Creates an App Service app and a Private Endpoint |
|**Configure app**||
| [Map a custom domain to an app](./scripts/cli-configure-custom-domain.md)| Creates an App Service app and maps a custom domain name to it. |
| [Bind a custom TLS/SSL certificate to an app](./scripts/cli-configure-ssl-certificate.md)| Creates an App Service app and binds the TLS/SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale an app manually](./scripts/cli-scale-manual.md) | Creates an App Service app and scales it across 2 instances. |
| [Scale an app worldwide with a high-availability architecture](./scripts/cli-scale-high-availability.md) | Creates two App Service apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Protect app**||
| [Integrate with Azure Application Gateway](./scripts/cli-integrate-app-service-with-application-gateway.md) | Creates an App Service app and integrates it with Application Gateway using service endpoint and access restrictions. |
|**Connect app to resources**||
| [Connect an app to a SQL Database](./scripts/cli-connect-to-sql.md)| Creates an App Service app and a database in Azure SQL Database, then adds the database connection string to the app settings. |
| [Connect an app to a storage account](./scripts/cli-connect-to-storage.md)| Creates an App Service app and a storage account, then adds the storage connection string to the app settings. |
| [Connect an app to an Azure Cache for Redis](./scripts/cli-connect-to-redis.md) | Creates an App Service app and an Azure Cache for Redis, then adds the redis connection details to the app settings.) |
| [Connect an app to Azure Cosmos DB](./scripts/cli-connect-to-documentdb.md) | Creates an App Service app and an Azure Cosmos DB, then adds the Azure Cosmos DB connection details to the app settings. |
|**Backup and restore app**||
| [Backup and restore app](./scripts/cli-backup-schedule-restore.md) | Creates an App Service app and creates a one-time backup for it, creates a backup schedule for it, and then restores an App Service app from a backup. |
|**Monitor app**||
| [Monitor an app with web server logs](./scripts/cli-monitor.md) | Creates an App Service app, enables logging for it, and downloads the logs to your local machine. |
| | |

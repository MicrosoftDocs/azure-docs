---
title: Azure CLI Samples for Azure App Service
description: Find Azure CLI samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
tags: azure-service-management

ms.assetid: 53e6a15a-370a-48df-8618-c6737e26acec
ms.topic: sample
ms.date: 11/21/2025
ms.custom: mvc, devx-track-azurecli, seo-azure-cli
keywords: azure cli samples, azure cli examples, azure cli code samples
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service
---
# CLI samples for Azure App Service

The following table includes links to bash scripts built using the Azure CLI.

| Script | Description |
|-|-|
|**Create app**||
| [Create an app and deploy files with FTP](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/deploy-ftp/deploy-ftp.sh)| Creates an App Service app and deploys a file to it using FTP. |
| [Create an app with continuous deployment from GitHub](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/deploy-github/deploy-github.sh)| Creates an App Service app with continuous publishing from a GitHub repository you own. |
| [Create an app and deploy code to a staging environment](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/deploy-deployment-slot/deploy-deployment-slot.sh) | Creates an App Service app with a deployment slot for staging code changes. |
| [Create an ASP.NET Core app in a Docker container](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/deploy-linux-docker/deploy-linux-docker-webapp-only.sh) | Creates an App Service app on Linux and loads a Docker image from Docker Hub. |
|**Configure app**||
| [Map a custom domain to an app](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/configure-custom-domain/configure-custom-domain-webapp-only.sh)| Creates an App Service app and maps a custom domain name to it. |
| [Bind a custom TLS/SSL certificate to an app](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/configure-ssl-certificate/configure-ssl-certificate-webapp-only.sh)| Creates an App Service app and binds the TLS/SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale an app manually](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/scale-manual/scale-manual.sh) | Creates an App Service app and scales it across two instances. |
| [Scale an app worldwide with a high-availability architecture](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/scale-geographic/scale-geographic.sh) | Creates two App Service apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Protect app**||
| [Integrate with Azure Application Gateway](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/integrate-with-app-gateway/integrate-with-app-gateway.sh) | Creates an App Service web app, an Azure Virtual Network, and an Application Gateway. |
|**Connect app to resources**||
| [Connect an app to a SQL Database](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/connect-to-sql/connect-to-sql.sh)| Creates an App Service app and a database in Azure SQL Database, then adds the database connection string to the app settings. |
| [Connect an app to a storage account](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/connect-to-storage/connect-to-storage.sh)| Creates an App Service app and a storage account, then adds the storage connection string to the app settings. |
| [Connect an app to an Azure Cache for Redis](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/connect-to-redis/connect-to-redis.sh) | Creates an App Service app and an Azure Cache for Redis, then adds the Redis connection details to the app settings. |
| [Connect an app to Azure Cosmos DB](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/connect-to-documentdb/connect-to-documentdb.sh) | Creates an Azure Cosmos DB account and an App Service app, then links a MongoDB connection string to the web app using app settings. |
|**Backup and restore app**||
| [Backup and restore app](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/backup-one-time-schedule-restore/backup-restore.sh) | Creates an App Service app and creates a one-time backup for it, creates a backup schedule for it, and then restores an App Service app from a backup. |
|**Monitor app**||
| [Monitor an app with web server logs](https://github.com/Azure-Samples/azure-cli-samples/blob/master/app-service/monitor-with-logs/monitor-with-logs.sh) | Creates an App Service app, enables logging for it, and downloads the logs to your local machine. |

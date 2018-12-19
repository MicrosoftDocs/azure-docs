---
title: Azure PowerShell Samples - App Service | Microsoft Docs
description: Azure PowerShell Samples - App Service
services: app-service
documentationcenter: app-service
author: syntaxc4
manager: erikre
editor: ggailey777
tags: azure-service-management

ms.assetid: b48d1137-8c04-46e0-b430-101e07d7e470
ms.service: app-service
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm: na
ms.workload: app-service
ms.date: 03/08/2017
ms.author: cfowler
ms.custom: mvc
---
# Azure PowerShell Samples

The following table includes links to PowerShell scripts built using the Azure PowerShell.

| | |
|-|-|
|**Create app**||
| [Create an app with deployment from GitHub](./scripts/app-service-powershell-deploy-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app that pulls code from GitHub. |
| [Create an app with continuous deployment from GitHub](./scripts/app-service-powershell-continuous-deployment-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app that continuously deploys code from GitHub. |
| [Create an app and deploy code with FTP](./scripts/app-service-powershell-deploy-ftp.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and upload files from a local directory using FTP. |
| [Create an app and deploy code from a local Git repository](./scripts/app-service-powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and configures code push from a local Git repository. |
| [Create an app and deploy code to a staging environment](./scripts/app-service-powershell-deploy-staging-environment.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app with a deployment slot for staging code changes. |
|**Configure app**||
| [Map a custom domain to an app](./scripts/app-service-powershell-configure-custom-domain.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and maps a custom domain name to it. |
| [Bind a custom SSL certificate to an app](./scripts/app-service-powershell-configure-ssl-certificate.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and binds the SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale an app manually](./scripts/app-service-powershell-scale-manual.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and scales it across 2 instances. |
| [Scale an app worldwide with a high-availability architecture](./scripts/app-service-powershell-scale-high-availability.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates two Azure web apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Connect app to resources**||
| [Connect an app to a SQL Database](./scripts/app-service-powershell-connect-to-sql.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and a SQL database, then adds the database connection string to the app settings. |
| [Connect an app to a storage account](./scripts/app-service-powershell-connect-to-storage.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and a storage account, then adds the storage connection string to the app settings. |
|**Back up and restore app**||
| [Back up an app](./scripts/app-service-powershell-backup-onetime.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and creates a one-time backup for it. |
| [Create a scheduled backup for an app](./scripts/app-service-powershell-backup-scheduled.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and creates a scheduled backup for it. |
| [Delete a backup for an app](./scripts/app-service-powershell-backup-delete.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Deletes an existing backup for an app. |
| [Restore an app from backup](./scripts/app-service-powershell-backup-restore.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Restores an app from a previously completed backup. |
| [Restore a backup across subscriptions](./scripts/app-service-powershell-backup-restore-diff-sub.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Restores a web app from a backup in another subscription. |
|**Monitor app**||
| [Monitor an app with web server logs](./scripts/app-service-powershell-monitor.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app, enables logging for it, and downloads the logs to your local machine. |
| | |

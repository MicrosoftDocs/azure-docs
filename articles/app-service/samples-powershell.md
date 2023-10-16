---
title: PowerShell samples
description: Find Azure PowerShell samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
tags: azure-service-management

ms.assetid: b48d1137-8c04-46e0-b430-101e07d7e470
ms.topic: sample
ms.date: 12/06/2022
ms.custom: mvc, devx-track-azurepowershell
ms.author: msangapu
author: msangapu-msft
---
# PowerShell samples for Azure App Service

The following table includes links to PowerShell scripts built using the Azure PowerShell.

| Script | Description |
|-|-|
|**Create app**||
| [Create an app with deployment from GitHub](./scripts/powershell-deploy-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app that pulls code from GitHub. |
| [Create an app with continuous deployment from GitHub](./scripts/powershell-continuous-deployment-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app that continuously deploys code from GitHub. |
| [Create an app and deploy code with FTP](./scripts/powershell-deploy-ftp.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and upload files from a local directory using FTP. |
| [Create an app and deploy code from a local Git repository](./scripts/powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and configures code push from a local Git repository. |
| [Create an app and deploy code to a staging environment](./scripts/powershell-deploy-staging-environment.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app with a deployment slot for staging code changes. |
|  [Create an app and expose your app with a Private Endpoint](./scripts/powershell-deploy-private-endpoint.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app with a Private Endpoint. |
|**Configure app**||
| [Map a custom domain to an app](./scripts/powershell-configure-custom-domain.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app and maps a custom domain name to it. |
| [Bind a custom TLS/SSL certificate to an app](./scripts/powershell-configure-ssl-certificate.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app and binds the TLS/SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale an app manually](./scripts/powershell-scale-manual.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and scales it across 2 instances. |
| [Scale an app worldwide with a high-availability architecture](./scripts/powershell-scale-high-availability.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates two App Service apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Connect app to resources**||
| [Connect an app to a SQL Database](./scripts/powershell-connect-to-sql.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app and a database in Azure SQL Database, then adds the database connection string to the app settings. |
| [Connect an app to a storage account](./scripts/powershell-connect-to-storage.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app and a storage account, then adds the storage connection string to the app settings. |
|**Back up and restore app**||
| [Back up an app](./scripts/powershell-backup-onetime.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and creates a one-time backup for it. |
| [Create a scheduled backup for an app](./scripts/powershell-backup-scheduled.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and creates a scheduled backup for it. |
| [Delete a backup for an app](./scripts/powershell-backup-delete.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Deletes an existing backup for an app. |
| [Restore an app from backup](./scripts/powershell-backup-restore.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Restores an app from a previously completed backup. |
| [Restore a backup across subscriptions](./scripts/powershell-backup-restore-diff-sub.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Restores a web app from a backup in another subscription. |
|**Monitor app**||
| [Monitor an app with web server logs](./scripts/powershell-monitor.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app, enables logging for it, and downloads the logs to your local machine. |
| | |

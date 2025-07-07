---
title: PowerShell Samples
description: Find Azure PowerShell samples for some of the common App Service scenarios. Learn how to automate your App Service deployment or management tasks.
tags: azure-service-management

ms.assetid: b48d1137-8c04-46e0-b430-101e07d7e470
ms.topic: sample
ms.date: 05/05/2025
ms.custom:
  - mvc
  - devx-track-azurepowershell
  - build-2025
ms.author: msangapu
author: msangapu-msft
---
# PowerShell samples for Azure App Service

The following table lists PowerShell scripts built for use with Azure PowerShell.

| Script | Description |
|-|-|
|**Create app**||
| [Create a web app and deploy code from GitHub](./scripts/powershell-deploy-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a web app in App Service that pulls code from GitHub. |
| [Create a web app with continuous deployment from GitHub](./scripts/powershell-continuous-deployment-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a web app in App Service, then sets up continuous deployment from GitHub. |
| [Upload files to a web app using FTP](./scripts/powershell-deploy-ftp.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a web app in App Service and upload files from a local directory using FTP. |
| [Create a web app and deploy code from a local Git repository](./scripts/powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a web app in App Service, and then deploys code from a local Git repository. |
| [Create a web app and deploy code to a staging environment](./scripts/powershell-deploy-staging-environment.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a web app in App Service with a deployment slot for staging code changes. |
| [Create an App Service app and deploy Private Endpoint using PowerShell](./scripts/powershell-deploy-private-endpoint.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app with a private endpoint. |
|**Configure app**||
| [Assign a custom domain to a web app using PowerShell](./scripts/powershell-configure-custom-domain.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a web app in App Service and maps a custom domain name to it. |
| [Bind a custom TLS/SSL certificate to a web app using PowerShell](./scripts/powershell-configure-ssl-certificate.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates a web app in App Service and binds the TLS/SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale a web app manually using PowerShell](./scripts/powershell-scale-manual.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates a web app and scales the App Service plan across multiple instances. |
| [Scale an app worldwide with a high-availability architecture](./scripts/powershell-scale-high-availability.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates two App Service apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Connect app to resources**||
| [Connect an app to a SQL Database](./scripts/powershell-connect-to-sql.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app and a database in Azure SQL Database, then adds the database connection string to the app settings. |
| [Connect an app to a storage account](./scripts/powershell-connect-to-storage.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an App Service app and a storage account, then adds the storage connection string to the app settings. |
|**Back up and restore app**||
| [Back up a web app using PowerShell](./scripts/powershell-backup-onetime.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and creates a one-time backup for it. |
| [Create a scheduled backup for a web app using PowerShell](./scripts/powershell-backup-scheduled.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app and creates a scheduled backup for it. |
| [Delete a backup for a web app using Azure PowerShell](./scripts/powershell-backup-delete.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Deletes an existing backup for an app. |
| [Restore a web app from a backup using Azure PowerShell](./scripts/powershell-backup-restore.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Restores an app from a previously completed backup. |
| [Restore a web app from a backup in another subscription](./scripts/powershell-backup-restore-diff-sub.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Restores a web app from a backup in another subscription. |
|**Monitor app**||
| [Monitor a web app with web server logs](./scripts/powershell-monitor.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an App Service app, enables logging for it, and downloads the logs to your local machine. |
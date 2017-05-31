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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: app-service
ms.date: 03/08/2017
ms.author: cfowler

---
# Azure PowerShell Samples

The following table includes links to bash scripts built using the Azure PowerShell.

| | |
|-|-|
|**Create app**||
| [Create a web app with deployment from GitHub](./scripts/app-service-powershell-deploy-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app which pulls code from GitHub. |
| [Create a web app with continuous deployment from GitHub](./scripts/app-service-powershell-continuous-deployment-github.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app which continuously deploys code from GitHub. |
| [Create a web app and deploy code with FTP](./scripts/app-service-powershell-deploy-ftp.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and upload files from a local directory using FTP. |
| [Create a web app and deploy code from a local Git repository](./scripts/app-service-powershell-deploy-local-git.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and configures code push from a local Git repository. |
| [Create a web app and deploy code to a staging environment](./scripts/app-service-powershell-deploy-staging-environment.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app with a deployment slot for staging code changes. |
|**Configure app**||
| [Map a custom domain to a web app](./scripts/app-service-powershell-configure-custom-domain.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and maps a custom domain name to it. |
| [Bind a custom SSL certificate to a web app](./scripts/app-service-powershell-configure-ssl-certificate.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and binds the SSL certificate of a custom domain name to it. |
|**Scale app**||
| [Scale a web app manually](./scripts/app-service-powershell-scale-manual.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app and scales it across 2 instances. |
| [Scale a web app worldwide with a high-availability architecture](./scripts/app-service-powershell-scale-high-availability.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates two Azure web apps in two different geographical regions and makes them available through a single endpoint using Azure Traffic Manager. |
|**Connect app to resources**||
| [Connect a web app to a SQL Database](./scripts/app-service-powershell-connect-to-sql.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and a SQL database, then adds the database connection string to the app settings. |
| [Connect a web app to a storage account](./scripts/app-service-powershell-connect-to-storage.md?toc=%2fpowershell%2fmodule%2ftoc.json)| Creates an Azure web app and a storage account, then adds the storage connection string to the app settings. |
|**Monitor app**||
| [Monitor a web app with web server logs](./scripts/app-service-powershell-monitor.md?toc=%2fpowershell%2fmodule%2ftoc.json) | Creates an Azure web app, enables logging for it, and downloads the logs to your local machine. |
| | |

---
title: Introduction to Azure Web App on Linux | Microsoft Docs
description: Learn about Azure Web App on Linux.
keywords: azure app service, linux, oss
services: app-service
documentationcenter: ''
author: naziml
manager: erikre
editor: ''

ms.assetid: bc85eff6-bbdf-410a-93dc-0f1222796676
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2017
ms.author: naziml;wesmc

---
# Introduction to Azure Web App on Linux

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]

## Overview
Customers can use Web App on Linux to host web apps natively on Linux for supported application stacks. The following section lists the application stacks that are currently supported. 

## Features
Web App on Linux currently supports the following application stacks:

* Node.js
	* 4.4
	* 4.5
	* 6.2
	* 6.6
	* 6.9
	* 6.10
* PHP
	* 5.6
	* 7.0
* .Net Core
	* 1.0
    * 1.1
* Ruby
	* 2.3

Customers can deploy their applications by using:

* FTP
* Local Git
* GitHub
* Bitbucket

For application scaling:

* Customers can scale web apps up and down by changing the tier in their App Service plan
* Customers can scale out applications and run multiple app instances within the confines of their SKU

For Kudu, some of the basic functionality:

* Environments
* Deployments
* Basic consoles
* SSH

For devops:

* Staging environments
* DockerHub CI/CD

## Limitations
The Azure portal shows only features that currently work for Web App on Linux and hides the rest. As we enable more features, they will be visible on the portal.

Some features, such as virtual network integration, Azure Active Directory/third-party authentication, or Kudu site extensions, are not available yet. Once these features are available, we will update our documentation and blog about the changes.

This public preview is currently only available in the following regions:

* West US
* West Europe 
* Southeast Asia
* Australia East

Web Apps on Linux is only supported in the Dedicated app service plans and does not have a Free or Shared tier. Also, App Service plans for regular and Linux web apps are mutually exclusive, so you cannot create a Linux web app in a non-Linux app service plan.

Web Apps on Linux must be created in a resource group that does not contain non-Linux web apps in the same region.

## Next steps
See the following links to get started with App Service on Linux. You can post questions and concerns on [our forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazurewebsitespreview).

* [Creating Web Apps in Azure Web App on Linux](app-service-linux-how-to-create-web-app.md)
* [How to use a custom Docker image for Azure Web App on Linux](app-service-linux-using-custom-docker-image.md)
* [Using PM2 Configuration for Node.js in Azure Web App on Linux](app-service-linux-using-nodejs-pm2.md)
* [Using .NET Core in Azure App Service Web App on Linux](app-service-linux-using-dotnetcore.md)
* [Using Ruby in Azure App Service Web App on Linux](app-service-linux-ruby-get-started.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)
* [SSH support for Azure Web App on Linux](./app-service-linux-ssh-support.md)
* [Set up staging environments in Azure App Service](./web-sites-staged-publishing.md)
* [Docker Hub Continuous Deployment with Azure Web App on Linux](./app-service-linux-ci-cd.md)


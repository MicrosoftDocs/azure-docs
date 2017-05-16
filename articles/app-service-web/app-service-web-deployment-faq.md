---
title: Deployment | Microsoft Docs
description: Deployment
services: azure-service-management, web-apps
documentationcenter: ''
author: simonxjx
manager: cshepard
editor: ''
tags: top-support-issue

ms.assetid: 529157eb-e4a1-4388-aa2b-09e8b923af74
ms.service: web-apps
ms.workload: na
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 5/16/2017
ms.author: v-six

---
# Frequently asked questions for Deployment in Azure Web Apps
This topic provides answers to some of the most common questions about Deployment in [Azure Web Apps](https://azure.microsoft.com/services/app-service/web/).

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## How can I resolve FTP Error 550 'There is not enough space on the disk' when I try to FTP files?

You are likely running into disk quota on the pricing Tier your web app is using.

You may need to scale up to a higher pricing tier based on your disk space needs.

Please refer to this [link](https://azure.microsoft.com/en-us/pricing/details/app-service/) for info on Pricing tiers and resource limits.

## How can I deploy an Asp.Net application from Visual Studio to Azure App Service?

This [tutorial](https://azure.microsoft.com/en-us/documentation/articles/web-sites-dotnet-get-started/) shows how to deploy an ASP.NET web application to a web app in Azure App Service by using Visual Studio 2015.

## What are the different types of deployment credentials? How do I configure them?

Azure App Service supports two types of credentials for local Git deployment and FTP/S deploment. More detail including how to configure deployment credentials can be found at this [link](https://docs.microsoft.com/azure/app-service-web/app-service-deployment-credentials).

## What is the file\directory structure of my Azure App Service web app?

The File Structure for your Azure App Service is documented [here](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure).

## How can I set up continuous deployment for my Azure App Service?

You can set up continuous deployment from several resources including Visual Studio Team Services, Microsoft OneDrive, GitHub, Bitbucket, Dropbox and other Git repositories. These options are available in the portal and the following tutorial explains how to set it up: [click here](https://azure.microsoft.com/en-us/documentation/articles/app-service-continuous-deployment/).

## How can I troubleshoot issues with continuous deployment from Github and Bit Bucket?

The information in this [link](https://github.com/projectkudu/kudu/wiki/Investigating-continuous-deployment) provides guidance for investigating issues with continuous deployment from GitHub or Bitbucket.

## I am not able to FTP to my site and publish my code. How can I resolve the issue?

1. 1.Please check that you are entering the correct host name and credentials. Detailed information about different types of credentials and usage can be found at this [link](https://github.com/projectkudu/kudu/wiki/Deployment-credentials).
2. Please check that the FTP ports are not blocked by a firewall.
 * FTP control connection port: 21
 * FTP data connection port: 989 , 10001-10300

## How do I publish my code to Azure App Service?

The Quickstart experience is designed to guide you to deploy your app using the deployment stack and method of your choice. You can locate Quickstart under the App Deployment section of the **Settings** menu.

## I am running into errors while trying to deploy from Visual Studio. How can I fix it?

If you are running into an error with a message “Error during deployment for resource 'YourResourceName' in resource group 'YourResourceGroup': MissingRegistrationForLocation: The subscription is not registered for the resource type 'components' in the location 'Central US'. Please re-register for this provider in order to have access to this location”, you may be using an older version of SDK.

You can resolve this error by upgrading to the latest SDK, which can be downloaded from [here](https://azure.microsoft.com/en-us/downloads/). If you continue to run into the issue even after upgrading to the latest SDK, please proceed to create a support incident.

## When does my application restart after deployment to Azure App Service?

The article at this [link](https://github.com/projectkudu/kudu/wiki/Deployment-vs-runtime-issues#deployments-and-web-app-restarts">) shows you the circumstances under which an application deployment may result in a restart. As discussed in this article “The reality is that deployment pretty much does only one thing: **it deploys files into the wwwroot folder. It never directly does anything to restart the App.**”

## How can I integrate Visual Studio Team Services code into Azure App Services?

There are two approaches to Continuous deployment with Visual Studio Team Services.

1. Use a Git Project and connect via Azure App Services via Deployment Options to that repo.
2. Use a TFVC Project and Deploy via the Build agent to Azure App Services.

Both approaches will still allow Continuous Deployment of your code and it will depend on their existing developer workflow and check-in procedures. More information can be found at the links below.

https://www.visualstudio.com/docs/release/examples/azure/azure-web-apps-from-build-and-release-hubs

https://github.com/projectkudu/kudu/wiki/Setting-up-a-VSTS-account-so-it-can-deploy-to-a-Web-App

## How do I deploy my app to Azure App Service using FTP/FTPS?

Step by step guidance on how to use FTP or FTPS to deploy your web app to Azure App Service can be found at this [link](https://docs.microsoft.com/azure/app-service-web/app-service-deploy-ftp).

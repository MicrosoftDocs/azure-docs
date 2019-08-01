---
title: Deployment Best Practices - Azure App Service | Microsoft Docs 
description: 
services: app-service
documentationcenter: ''
author: 
manager: 
editor: 

ms.assetid: bb51e565-e462-4c60-929a-2ff90121f41d
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/31/2019
ms.author: 
ms.custom: 
---

# Deployment Best Practices

Every development team has unique needs that can make implementing an efficient deployment pipeline difficult on any cloud service. This document introduces the three main components of deploying to App Service: deployment sources, build pipelines, and deployment mechanisms. ....sjfbsdkf ..........x.x.x.x.x.xx

## Deployment Components

### Deployment Source

A deployment source is the location of your application code. For production apps, the deployment source will be version control software such as GitHub, BitBucket, or Azure Repos. App Service also supports OneDrive and Dropbox folders as deployment sources. While cloud folders can make it easy to get started with App Service, we do not typically recommend this source for enterprise production applications.

### Build Pipeline

Once the deployment source has been decided, a team must choose a build pipeline. The specific actions performed by the build pipeline will depend on your language stack. In any case, a build pipeline will read source code from the deployment source and perform a series of actions (such as compiling code, minifying HTML and JavaScript, and packaging components) to get the application in a runnable state.

### Deployment Mechanism

The deployment mechanism is the action used to put your built application into the /home/site/wwwroot directory of your web app. The /wwwroot directory is a mounted storage location shared by all instances of your web app. When the deployment mechanism puts your application in this directory, your instances will receive a notification to sync the new files. App Service supports the following deployment mechanisms:

- Kudu endpoints: [Kudu](https://github.com/projectkudu/kudu/wiki) is the open-source developer productivity tool that runs as a separate process in Windows App Service, and runs as a separate container in Linux App Service. Kudu handles continuous deployments and provides HTTP endpoints for deployment, such as zipdeploy.
- Cloud sync: 
- FTP and WebDeploy: Using your site or user credentials, you can upload files via FTP and deploy content via WebDeploy. These mechanisms do not go through Kudu.  

Tools such as Azure Pipelines, Jenkins, and the Maven plugin all hook into one of these three deployment mechanisms.

## Language-Specific Considerations

### Java

Use the Kudu [zipdeploy/](deploy-zip.md) API for deploying JAR applications, and [wardeploy/](deploy-zip.md#deploy-war-file) for WAR apps. If you are using Jenkins, you can use those APIs directly in your deployment phase. See this article for more information.

### Node

By default, Kudu will execute the build steps for your Node application (`npm install`). If you are using a build service such as Azure Devops, then the Kudu build is unnecessary. Create an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT` with a value of `false` to disable the Kudu build.

### .NET 

By default, Kudu will execute the build steps for your Node application (`dotnet build`). If you are using a build service such as Azure Devops, then the Kudu build is unnecessary. Create an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT` with a value of `false` to disable the Kudu build.

## Other Deployment Considerations

## Local Cache

----- define local cache here ------- blahg blah blah, take these into consideration:

- If your site content is over 2GB, you should not use local cache
- When you deploy with local cache enabled, a restart is required to pick up new files. Use [deployment slots]() to avoid downtime.
- local cache + application initialization/warmup + the recommendation to run on at least (2) worker instances.

## High CPU or Memory

If your App Service Plan is using over 90% of available CPU or memory, the underlying virtual machine may have trouble processing your deployment. If this happens, temporarily scale up your instance count to perform the deployment. Once the deployment has finished, you can return the instance count to its previous value.
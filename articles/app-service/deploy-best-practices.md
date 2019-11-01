---
title: Deployment best practices - Azure App Service | Microsoft Docs 
description: Learn about the key components of deploying to Azure App Service.
keywords: azure app service, web app, deploy, deployment, pipelines, build
services: app-service
documentationcenter: ''
author: jasonfreeberg
manager: 
editor: 

ms.assetid: bb51e565-e462-4c60-929a-2ff90121f41d
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 07/31/2019
ms.author: jafreebe
ms.custom: 
---

# Deployment Best Practices

Every development team has unique requirements that can make implementing an efficient deployment pipeline difficult on any cloud service. This article introduces the three main components of deploying to App Service: deployment sources, build pipelines, and deployment mechanisms. This article also covers some best practices and tips for specific language stacks.

## Deployment Components

### Deployment Source

A deployment source is the location of your application code. For production apps, the deployment source is usually a repository hosted by version control software such as [GitHub, BitBucket, or Azure Repos](deploy-continuous-deployment.md). For development and test scenarios, the deployment source may be [a project on your local machine](deploy-local-git.md). App Service also supports [OneDrive and Dropbox folders](deploy-content-sync.md) as deployment sources. While cloud folders can make it easy to get started with App Service, it is not typically recommended to use this source for enterprise-level production applications. 

### Build Pipeline

Once you decide on a deployment source, your next step is to choose a build pipeline. A build pipeline reads your source code from the deployment source and executes a series of steps (such as compiling code, minifying HTML and JavaScript, running tests, and packaging components) to get the application in a runnable state. The specific commands executed by the build pipeline depend on your language stack. These operations can be executed on a build server such as Azure Pipelines, or executed locally.

### Deployment Mechanism

The deployment mechanism is the action used to put your built application into the */home/site/wwwroot* directory of your web app. The */wwwroot* directory is a mounted storage location shared by all instances of your web app. When the deployment mechanism puts your application in this directory, your instances receive a notification to sync the new files. App Service supports the following deployment mechanisms:

- Kudu endpoints: [Kudu](https://github.com/projectkudu/kudu/wiki) is the open-source developer productivity tool that runs as a separate process in Windows App Service, and as a second container in Linux App Service. Kudu handles continuous deployments and provides HTTP endpoints for deployment, such as zipdeploy.
- FTP and WebDeploy: Using your [site or user credentials](deploy-configure-credentials.md), you can upload files [via FTP](deploy-ftp.md) or WebDeploy. These mechanisms do not go through Kudu.  

Deployment tools such as Azure Pipelines, Jenkins, and editor plugins use one of these deployment mechanisms.

## Language-Specific Considerations

### Java

Use the Kudu [zipdeploy/](deploy-zip.md) API for deploying JAR applications, and [wardeploy/](deploy-zip.md#deploy-war-file) for WAR apps. If you are using Jenkins, you can use those APIs directly in your deployment phase. For more information, see [this article](../jenkins/execute-cli-jenkins-pipeline.md).

### Node

By default, Kudu executes the build steps for your Node application (`npm install`). If you are using a build service such as Azure DevOps, then the Kudu build is unnecessary. To disable the Kudu build, create an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT`, with a value of `false`.

### .NET 

By default, Kudu executes the build steps for your .Net application (`dotnet build`). If you are using a build service such as Azure DevOps, then the Kudu build is unnecessary. To disable the Kudu build, create an app setting, `SCM_DO_BUILD_DURING_DEPLOYMENT`, with a value of `false`.

## Other Deployment Considerations

### Use deployment slots

Whenever possible, use [deployment slots](deploy-staging-slots.md) when deploying a new production build. When using a Standard App Service Plan tier or better, you can deploy your app to a staging environment, validate your changes, and do smoke tests. When you are ready, you can swap your staging and production slots. The swap operation warms up the necessary worker instances to match your production scale, thus eliminating downtime. 

### Local Cache

Azure App Service content is stored on Azure Storage and is surfaced up in a durable manner as a content share. However, some apps just need a high-performance, read-only content store that they can run with high availability. These apps can benefit from using [local cache](overview-local-cache.md). Local cache is not recommended for content management sites such as WordPress.

Always use local cache in conjunction with [deployment slots](deploy-staging-slots.md) to prevent downtime. See [this section](overview-local-cache.md#best-practices-for-using-app-service-local-cache) for information on using these features together.

### High CPU or Memory

If your App Service Plan is using over 90% of available CPU or memory, the underlying virtual machine may have trouble processing your deployment. When this happens, temporarily scale up your instance count to perform the deployment. Once the deployment has finished, you can return the instance count to its previous value.

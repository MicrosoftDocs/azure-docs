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
[Web App](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-overview) is a fully managed compute platform that is optimized for hosting websites and web applications. Customers can use Web App on Linux to host web apps natively on Linux for supported application stacks. The following sections lists the application stacks that are currently supported. 

### Languages

|Node.js|PHP|.NET Core|Ruby|
|:------------------:|:---:|:---------:|:----:|
|4.4, 4.5|5.6|1.0-1.1|2.3|
|6.2, 6.6, 6.9-6.11|7.0|||
|8.0-8.1||||

### Deployments

* FTP
* Local Git
* GitHub
* Bitbucket

### DevOps

* Staging environments
* [Azure Container Registry](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-intro) and DockerHub CI/CD

### Console, Publishing, and Debugging

* Environments
* Deployments
* Basic console
* SSH

### Scaling

* Customers can scale web apps up and down by changing the tier of their [App Service plan](https://docs.microsoft.com/en-us/azure/app-service/azure-web-sites-web-hosting-plans-in-depth-overview?toc=%2fazure%2fapp-service-web%2ftoc.json)

## Limitations
The Azure portal shows only features that currently work for Web App on Linux. As we enable more features, they will become visible on the portal.

Some features, such as virtual network integration, Azure Active Directory/third-party authentication, or Kudu site extensions, are not available yet. Once these features are available, we will update our documentation and blog about the changes.

This public preview is currently only available in the following regions:

|Americas|Asia Pacific|Europe|
|:----------------:|:--------------:|:------------:|
|Brazil South|Australia East|North Europe|
|East US|East Asia|West Europe|
|North Central US|Japan East||
|South Central US|South India||
|West US|Southeast Asia||

Check the [Azure Status Dashboard](https://azure.microsoft.com/status) to see when additonal regions become available.

Web App on Linux is only supported with [Basic, Standard, and Premium](https://azure.microsoft.com/en-us/pricing/details/app-service/plans/) app service plans and does not have a [Free or Shared](https://azure.microsoft.com/en-us/pricing/details/app-service/plans/) tier. The following are also important restrictions for Web App on Linux:

* You cannot create Web App on Linux in an App Service plan already hosting non-Linux Web Apps.
* When creating Web App on Linux in a resource group containing non-Linux Web Apps, you must create an App Service plan in a different region than the existing App Service plan.

## Troubleshooting ##

When your application fails to start or you want to check the logging from your app, check the Docker logs in the LogFiles directory. You can access this directory either through your SCM site or via FTP.
To log the `stdout` and `stderr` from your container, you need to enable **Docker Container logging** under **Diagnostics Logs**.

![Enabling Logging][2]

![Using Kudu to view Docker logs][1]

You can access the SCM site from **Advanced Tools** in the **Development Tools** menu.

## Next steps
See the following links to get started with App Service on Linux. You can post questions and concerns on [our forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazurewebsitespreview).

* [How to use a custom Docker image for Azure Web App on Linux](app-service-linux-using-custom-docker-image.md)
* [Using PM2 Configuration for Node.js in Azure Web App on Linux](app-service-linux-using-nodejs-pm2.md)
* [Using .NET Core in Azure App Service Web App on Linux](app-service-linux-using-dotnetcore.md)
* [Using Ruby in Azure App Service Web App on Linux](app-service-linux-ruby-get-started.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)
* [SSH support for Azure Web App on Linux](./app-service-linux-ssh-support.md)
* [Set up staging environments in Azure App Service](./web-sites-staged-publishing.md)
* [Docker Hub Continuous Deployment with Azure Web App on Linux](./app-service-linux-ci-cd.md)

<!--Image references-->
[1]: ./media/app-service-linux-intro/kudu-docker-logs.png
[2]: ./media/app-service-linux-intro/logging.png

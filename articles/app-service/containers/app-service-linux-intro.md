---
title: Introduction to App Service on Linux - Azure | Microsoft Docs
description: Learn about Azure App Service on Linux.
keywords: azure app service, linux, oss
services: app-service
documentationcenter: ''
author: msangapu
manager: jeconnoc
editor: ''

ms.assetid: bc85eff6-bbdf-410a-93dc-0f1222796676
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 1/11/2019
ms.author: msangapu
ms.custom: mvc
ms.custom: seodec18

---
# Introduction to Azure App Service on Linux

[Azure App Service](../overview.md) is a fully managed compute platform that is optimized for hosting websites and web applications. Customers can use App Service on Linux to host web apps natively on Linux for supported application stacks. The [Languages](#languages) section lists the application stacks that are currently supported.

## Languages

App Service on Linux supports a number of Built-in images in order to increase developer productivity. If the runtime your application requires is not supported in the built-in images, there are instructions on how to [build your own Docker image](tutorial-custom-docker-image.md) to deploy to Web App for Containers.

| Language | Supported Versions |
|---|---|
| Node.js | 4.4, 4.5, 4.8, 6.2, 6.6, 6.9, 6.10, 6.11, 8.0, 8.1, 8.2, 8.8, 8.9, 8.11, 8.12, 9.4, 10.1, 10.10, 10.14 |
| Java * | Tomcat 8.5, 9.0, Java SE, WildFly 14 (all running JRE 8) |
| PHP | 5.6, 7.0, 7.2, 7.3 |
| Python | 2.7, 3.6, 3.7 |
| .NET Core | 1.0, 1.1, 2.0, 2.1, 2.2 |
| Ruby | 2.3, 2.4, 2.5, 2.6 |

## Deployments

* FTP
* Local Git
* GitHub
* Bitbucket

## DevOps

* Staging environments
* [Azure Container Registry](https://docs.microsoft.com/azure/container-registry/container-registry-intro) and DockerHub CI/CD

## Console, Publishing, and Debugging

* Environments
* Deployments
* Basic console
* SSH

## Scaling

* Customers can scale web apps up and down by changing the tier of their [App Service plan](https://docs.microsoft.com/azure/app-service/overview-hosting-plans?toc=%2fazure%2fapp-service-web%2ftoc.json)

## Locations

Check the [Azure Status Dashboard](https://azure.microsoft.com/status).

## Limitations

The Azure portal shows only features that currently work for Web App for Containers. As we enable more features, they will become visible on the portal.

App Service on Linux is only supported with [Free, Basic, Standard, and Premium](https://azure.microsoft.com/pricing/details/app-service/plans/) app service plans and does not have a [Shared](https://azure.microsoft.com/pricing/details/app-service/plans/) tier. You cannot create a Linux Web App in an App Service plan already hosting non-Linux Web Apps.  

Based on a current limitation, for the same resource group you cannot mix Windows and Linux apps in the same region.

## Troubleshooting

When your application fails to start or you want to check the logging from your app, check the Docker logs in the LogFiles directory. You can access this directory either through your SCM site or via FTP. To log the `stdout` and `stderr` from your container, you need to enable **Docker Container logging** under **App Service Logs**. The setting takes effect immediately. App Service detects the change and restarts the container automatically.

You can access the SCM site from **Advanced Tools** in the **Development Tools** menu.

![Using Kudu to view Docker logs][1]

## Next steps

The following articles get you started with App Service on Linux with web apps written in a variety of languages:

* [.NET Core](quickstart-dotnetcore.md)
* [PHP](https://docs.microsoft.com/azure/app-service/containers/quickstart-php)
* [Node.js](quickstart-nodejs.md)
* [Java](quickstart-java.md)
* [Python](quickstart-python.md)
* [Ruby](quickstart-ruby.md)
* [Go](quickstart-docker-go.md)
* [Multi-container apps](quickstart-multi-container.md)

For more information on App Service on Linux, see:

* [App Service for Linux FAQ](app-service-linux-faq.md)
* [SSH support for App Service on Linux](app-service-linux-ssh-support.md)
* [Set up staging environments in App Service](../../app-service/deploy-staging-slots.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
* [Docker Hub continuous deployment](app-service-linux-ci-cd.md)

You can post questions and concerns on [our forum](https://social.msdn.microsoft.com/forums/azure/home?forum=windowsazurewebsitespreview).

<!--Image references-->
[1]: ./media/app-service-linux-intro/kudu-docker-logs.png
[2]: ./media/app-service-linux-intro/logging.png

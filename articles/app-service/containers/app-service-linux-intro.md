---
title: Run code on default Linux containers
description: Azure App Service can run your code on pre-built Linux containers. Find out how you can run your Linux web applications on Azure.
keywords: azure app service, linux, oss
author: msangapu-msft

ms.assetid: bc85eff6-bbdf-410a-93dc-0f1222796676
ms.topic: overview
ms.date: 1/11/2019
ms.author: msangapu
ms.custom: mvc, seodec18
---

# Introduction to Azure App Service on Linux

[Azure App Service](../overview.md) is a fully managed compute platform that is optimized for hosting websites and web applications. Customers can use App Service on Linux to host web apps natively on Linux for supported application stacks.

## Languages

App Service on Linux supports a number of Built-in images in order to increase developer productivity. Languages include: Node.js, Java (JRE 8 & JRE 11), PHP, Python, .NET Core and Ruby. Run [`az webapp list-runtimes --linux`](https://docs.microsoft.com/cli/azure/webapp?view=azure-cli-latest#az-webapp-list-runtimes) to view the latest languages and supported versions. If the runtime your application requires is not supported in the built-in images, there are instructions on how to [build your own Docker image](tutorial-custom-docker-image.md) to deploy to Web App for Containers.

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

App Service on Linux is only supported with [Free, Basic, Standard, Premium and Isolated](https://azure.microsoft.com/pricing/details/app-service/plans/) app service plans and does not have a [Shared](https://azure.microsoft.com/pricing/details/app-service/plans/) tier. You cannot create a Linux Web App in an App Service plan already hosting non-Linux Web Apps.  

Based on a current limitation, for the same resource group you cannot mix Windows and Linux apps in the same region.

## Troubleshooting

> [!NOTE]
> There's new integrated logging capability with [Azure Monitoring (preview)](https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs#send-logs-to-azure-monitor-preview) . 
>
>

When your application fails to start or you want to check the logging from your app, check the Docker logs in the LogFiles directory. You can access this directory either through your SCM site or via FTP. To log the `stdout` and `stderr` from your container, you need to enable **Application Logging** under **App Service Logs**. The setting takes effect immediately. App Service detects the change and restarts the container automatically.

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

You can post questions and concerns on [our forum](https://docs.microsoft.com/answers/topics/azure-webapps.html).

<!--Image references-->
[1]: ./media/app-service-linux-intro/kudu-docker-logs.png
[2]: ./media/app-service-linux-intro/logging.png

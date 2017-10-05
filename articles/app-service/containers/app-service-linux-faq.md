---
title: Azure App Service Web App for Containers FAQ | Microsoft Docs
description: Azure App Service Web App for Containers FAQ.
keywords: azure app service, web app, faq, linux, oss
services: app-service
documentationCenter: ''
author: ahmedelnably
manager: erikre
editor: ''

ms.assetid:
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/04/2017
ms.author: aelnably;wesmc

---
# Azure App Service Web App for Containers FAQ

With the release of Web App for Containers, we're working on adding features and making improvements to our platform. This article provides answers to questions that our customers have been asking us recently.

If you have a question, comment on the article and we'll answer it as soon as possible.

## Built-in images

**I want to fork the built-in Docker containers that the platform provides. Where can I find those files?**

You can find all Docker files on [GitHub](https://github.com/azure-app-service). You can find all Docker containers on [Docker Hub](https://hub.docker.com/u/appsvc/).

**What are the expected values for the Startup File section when I configure the runtime stack?**

For Node.js, you specify the PM2 configuration file or your script file. For .NET Core, specify your compiled DLL name. For Ruby, you can specify the Ruby script that you want to initialize your app with.

## Management

**What happens when I press the restart button in the Azure portal?**

This action is the same as a Docker restart.

**Can I use Secure Shell (SSH) to connect to the app container virtual machine (VM)?**

Yes, you can do that through the source control management (SCM) site.

**How can I create a Linux App Service plan through an SDK or an Azure Resource Manager template?**

You need to set the **reserved** field of the app service to *true*.

## Continuous integration and deployment

**My web app still uses an old Docker container image after I've updated the image on Docker Hub. Do you support continuous integration and deployment of custom containers?**

To set up continuous integration and deployment for Azure Container Registry or Docker Hub images, see [Continuous deployment with Azure Web App for Containers](./app-service-linux-ci-cd.md). For private registries, you can refresh the container by stopping and then starting your web app. Or you can change or add a dummy application setting to force a refresh of your container.

**Do you support staging environments?**

Yes.

**Can I use *web deploy* to deploy my web app?**

Yes, you need to set an app setting called `WEBSITE_WEBDEPLOY_USE_SCM` to *false*.

## Language support

**Do you support uncompiled .NET Core apps?**

Yes.

**Do you support Composer as a dependency manager for PHP apps?**

Yes. During a Git deployment, Kudu should detect that you are deploying a PHP application (thanks to the presence of a composer.lock file), and Kudu will then trigger a composer install for you.

## Custom containers

**I'm using my own custom container. I want the platform to mount an SMB share to the `/home/` directory.**

You can do that by setting the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting to *true* or by removing the app setting entirely. Keep in mind that doing this will cause container restarts when the platform storage goes through a change. 

>[!NOTE]
>If the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` setting is *false*, the `/home/` directory will not be shared across scale instances, and files that are written there will not be persisted across restarts.

**My custom container takes a long time to start, and the platform restarts the container before it finishes starting up.**

You can configure the amount of time the platform will wait before it restarts your container. To do so, set the `WEBSITES_CONTAINER_START_TIME_LIMIT` app setting to the value you want. The default value is 230 seconds, and the maximum value is 600 seconds.

**What is the format for the private registry server URL?**

Provide the full registry URL, including `http://` or `https://`.

**What is the format for the image name in the private registry option?**

Add the full image name, including the private registry URL (for example, myacr.azurecr.io/dotnet:latest). Image names that use a custom port [cannot be entered through the portal](https://feedback.azure.com/forums/169385-web-apps/suggestions/31304650). To set `docker-custom-image-name`, use the [`az` command-line tool](https://docs.microsoft.com/en-us/cli/azure/webapp/config/container?view=azure-cli-latest#az_webapp_config_container_set).

**Can I expose more than one port on my custom container image?**

We do not currently support exposing more than one port.

**Can I bring my own storage?**

We do not currently support bringing your own storage.

**Why can't I browse my custom container's file system or running processes from the SCM site?**

The SCM site runs in a separate container. You can't check the file system or running processes of the app container.

**My custom container listens to a port other than port 80. How can I configure my app to route requests to that port?**

We have automatic port detection. You can also specify an app setting called *WEBSITES_PORT* and give it the value of the expected port number. Previously, the platform used the *PORT* app setting. We are planning to deprecate this app setting and to use *WEBSITES_PORT* exclusively.

**Do I need to implement HTTPS in my custom container?**

No, the platform handles HTTPS termination at the shared front ends.

## Pricing and SLA

**What is the pricing, now that the service is generally available?**

You are charged the normal Azure App Service pricing for the number of hours that your app runs.

## Other questions

**What are the supported characters in application settings names?**

You can use only letters (A-Z, a-z), numbers (0-9), and the underscore character (_) for application settings.

**Where can I request new features?**

You can submit your idea at the [Web Apps feedback forum](https://aka.ms/webapps-uservoice). Add "[Linux]" to the title of your idea.

## Next steps

* [What is Azure Web App for Containers?](app-service-linux-intro.md)
* [Set up staging environments in Azure App Service](../../app-service-web/web-sites-staged-publishing.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
* [Continuous deployment with Azure Web App for Containers](./app-service-linux-ci-cd.md)

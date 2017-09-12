---
title: Azure App Service Web Apps for Containers FAQ | Microsoft Docs
description: Azure App Service Web Apps for Containers FAQ.
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
# Azure App Service Web Apps for Containers FAQ

With the release of Web Apps for Containers, we're working on adding features and making improvements to our platform. Here are some frequently asked questions (FAQ) that our customers have been asking us over the last months.
If you have a question, comment on the article and we'll answer it as soon as possible.

## Built-in images

**Q:** I want to fork the built-in Docker containers that the platform provides. Where can I find those files?

**A:** You can find all Docker files on [GitHub](https://github.com/azure-app-service). You can find all Docker containers on [Docker Hub](https://hub.docker.com/u/appsvc/).

**Q:** What are the expected values for the Startup File section when I configure the runtime stack?

**A:** For Node.Js, you specify the PM2 configuration file or your script file. For .NET Core, specify your compiled DLL name. For Ruby, you can specify the Ruby script that you want to initialize your app with.

## Management

**Q:** What happens when I press the restart button in the Azure portal?

**A:** This is the equivalent of Docker restart.

**Q:** Can I use Secure Shell (SSH) to connect to the app container virtual machine (VM)?

**A:** Yes, you can do that through the SCM site.

**Q:** I want to create a Linux App Service plane through SDK or an ARM template, how can I achieve this?

**A:** You need to set the `reserved` field of the app service to `true`.

## Continuous integration/deployment

**Q:** My web app still uses an old Docker container image after I've updated the image on Docker Hub. Do you support continuous integration/deployment of custom containers?

**A:** To set up continuous integration/deployment for Azure Container Registry or DockerHub images by check the following article [Continuous Deployment with Azure Web Apps for Containers](./app-service-linux-ci-cd.md). For private registries, you can refresh the container by stopping and then starting your web app. Or you can change or add a dummy application setting to force a refresh of your container.

**Q:** Do you support staging environments?

**A:** Yes.

**Q:** Can I use **web deploy** to deploy my web app?

**A:** Yes, you need to set an app setting called `WEBSITE_WEBDEPLOY_USE_SCM` to `false`.

## Language support

**Q:** Do you support uncompiled .NET Core apps?

**A:** Yes.

**Q:** Do you support Composer as a dependency manager for PHP apps?

**A:** Yes. During a Git deployment, Kudu should detect that you are deploying a PHP application (thanks to the presence of a composer.lock file) and will trigger a composer install for you.

## Custom containers

**Q:** I'm using my own custom container. My app resides in the `/home/` directory, but I can't find my files when I browse the content by using the [SCM site](https://github.com/projectkudu/kudu) or an FTP client. Where are my files?

**A:** We mount an SMB share to the `/home/` directory. This will override any content that's there.

**Q:** I'm using my own custom container. I want the platform to mount an SMB share to the `/home/` directory.

**A:** You can do that by setting the `WEBSITES_ENABLE_APP_SERVICE_STORAGE` app setting to `true` or by removing the app setting entirely. Keep in mind that doing this will cause container restarts when the platform storage goes through a change. 

Note that if WEBSITES_ENABLE_APP_SERVICE_STORAGE is 'false', the /home/ directory will not be shared across scale instances, and files written there will not be persisted across restarts.

**Q:** My custom container takes a long time to start, and the platform restart the container before it finishes starting up.

**A:** You can configure the time the platform will wait before restarting your container. This can be done by setting the `WEBSITES_CONTAINER_START_TIME_LIMIT` app setting to the desired value in seconds. The default is 230 seconds, and the max is 600 seconds.

**Q:** What is the format for private registry server url?

**A:** You need to provide the full registry url including `http://` or `https://`.

**Q:** What is the format for the image name in private registry option?

**A:** You need to add the full image name including the private registry url (eg. myacr.azurecr.io/dotnet:latest). Image names using a custom port [cannot be entered through the portal](https://feedback.azure.com/forums/169385-web-apps/suggestions/31304650)
. Use the [`az` command line tool](https://docs.microsoft.com/en-us/cli/azure/webapp/config/container?view=azure-cli-latest#az_webapp_config_container_set) to set `docker-custom-image-name`.

**Q:** I want to expose more than one port on my custom container image. Is that possible?

**A:** Currently, that isn't supported.

**Q:** Can I bring my own storage?

**A:** Currently that isn't supported.

**Q:** I can't browse my custom container's file system or running processes from the SCM site. Why is that?

**A:** The SCM site runs in a separate container. You can't check the file system or running processes of the app container.

**Q:** My custom container listens to a port other than port 80. How can I configure my app to route the requests to that port?

**A:** We have auto port detection, also you can specify an application setting called **WEBSITES_PORT**, and give it the value of the expected port number. Previously the platform was using `PORT` app setting, we are planning to deprecate the use this app setting and move to using `WEBSITES_PORT` exclusively.

**Q:** Do I need to implement HTTPS in my custom container.

**A:** No, the platform handles HTTPS termination at the shared frontends.

## Pricing and SLA

**Q:** What's the pricing now that the service is generally available?

**A:** You are charged for the number of hours that your app runs, with the normal Azure App Service pricing.

## Other

**Q:** What are the supported characters in application settings names?

**A:** You can only use A-Z, a-z, 0-9, and the underscore for application settings.

**Q:** Where can I request new features?

**A:** You can submit your idea at the [Web Apps feedback forum](https://aka.ms/webapps-uservoice). Add "[Linux]" to the title of your idea.

## Next steps

* [What is Azure Web Apps for Containers?](app-service-linux-intro.md)
* [Set up staging environments in Azure App Service](../../app-service-web/web-sites-staged-publishing.md?toc=%2fazure%2fapp-service%2fcontainers%2ftoc.json)
* [Continuous Deployment with Azure Web Apps for Containers](./app-service-linux-ci-cd.md)

---
title: Azure App Service Web App on Linux FAQ | Microsoft Docs
description: Azure App Service Web App on Linux FAQ.
keywords: azure app service, web app, faq, linux, oss
services: app-service
documentationCenter: ''
authors: ahmedelnably
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

# Azure App Service Web App on Linux FAQ

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]


With the release of Web App on Linux, we're working on adding features and making improvements to our platform. Here are some frequently asked questions (FAQ) that our customers have been asking us over the last months.
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

**A:** Yes, you can do that through the SCM site, check the following article for more information [SSH support for Web App on Linux](./app-service-linux-ssh-support.md)

## Continuous integration/deployment

**Q:** My web app still uses an old Docker container image after I've updated the image on Docker Hub. Do you support continuous integration/deployment of custom containers?

**A:** To set up continuous integration/deployment for DockerHub images by check the following article [Docker Hub Continuous Deployment with Web App on Linux](./app-service-linux-ci-cd.md). For private registries, you can refresh the container by stopping and then starting your web app. Or you can change or add a dummy application setting to force a refresh of your container.

**Q:** Do you support staging environments?

**A:** Yes.

**Q:** Can I use **web deploy** to deploy my web app?

**A:** Yes, you need to set an app setting called `UseWebDeployScm` to `false`.

## Language support

**Q:** Do you support uncompiled .NET Core apps?

**A:** Yes.

**Q:** Do you support Composer as a dependency manager for PHP apps?

**A:** Yes. During a Git deployment, Kudu should detect that you are deploying a PHP application (thanks to the presence of a composer.json file) and will trigger a composer install for you.

## Custom containers

**Q:** I'm using my own custom container. My app resides in the `\home\` directory, but I can't find my files when I browse the content by using the [SCM site](https://github.com/projectkudu/kudu) or an FTP client. Where are my files?

**A:** We mount an SMB share to the `\home\` directory. This will override any content that's there.

**Q:** What is the format for private registry server url?

**A:** You need to provide the full registry url including `http://` or `https://`.

**Q:** What is the format for the image name in private registry option?

**A:** You need to add the full image name including the private registry url (eg. myacr.azurecr.io/dotnet:latest)

**Q:** I want to expose more than one port on my custom container image. Is that possible?

**A:** Currently, that isn't supported.

**Q:** Can I bring my own storage?

**A:** Currently that isn't supported.

**Q:** I can't browse my custom container's file system or running processes from the SCM site. Why is that?

**A:** The SCM site runs in a separate container. You can't check the file system or running processes of the app container.

**Q:** My custom container listens to a port other than port 80. How can I configure my app to route the requests to that port?

**A:** We have auto port detection, also you can specify an application setting called **PORT**, and give it the value of the expected port number.

**Q:** Do I need to implement HTTPS in my custom container.

**A:** No, the platform handles HTTPS termination at the shared frontends.

## Pricing and SLA

**Q:** What's the pricing while you're using the public preview?

**A:** You are charged half the number of hours that your app runs, with the normal Azure App Service pricing. This means that you get a 50 percent discount on normal Azure App Service pricing.

## Other

**Q:** What are the supported characters in application settings names?

**A:** You can only use A-Z, a-z, 0-9, and the underscore for application settings.

**Q:** Where can I request new features?

**A:** You can submit your idea at the [Web Apps feedback forum](https://aka.ms/webapps-uservoice). Add "[Linux]" to the title of your idea.

## Next steps
* [What is Azure Web App on Linux?](app-service-linux-intro.md)
* [Creating web apps in Azure Web App on Linux](app-service-linux-how-to-create-web-app.md)
* [SSH support for Azure Web App on Linux](./app-service-linux-ssh-support.md)
* [Set up staging environments in Azure App Service](./web-sites-staged-publishing.md)
* [Docker Hub Continuous Deployment with Azure Web App on Linux](./app-service-linux-ci-cd.md)

---
title: Azure App Service Web Apps on Linux FAQ | Microsoft Docs
description: Azure App Service Web Apps on Linux FAQ.
keywords: azure app service, web app, faq, linux, oss
services: app-service
documentationCenter: ''
authors: aelnably
manager: wpickett
editor: ''

ms.assetid: 
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2017
ms.author: aelnably

---

# Azure App Service Web Apps on Linux FAQ #

With the release of Azure App Service on Linux (Currently in preview), we are working on adding features and making improvements to our platform. Here are number of frequently asked question that our customer have been asking us over the last months.
If you have a question, please comment on the article and we will answer it as soon as possible.

## Built-in Images ##

**Q:** I want to fork the built-in Docker containers that the platform provides. Where can I find those files?

**A:** All Docker files can be found here: https://github.com/azure-app-service. All Docker containers can be found here: https://hub.docker.com/u/appsvc/.

## Management ##

**Q:** I press the restart button in the portal but my webapp did not restart, why is that?

**A:** We are working on enabling the reset button in the near future, right now you have two options.
1. Add or change a dummy application setting, this will force your webapp to restart. 
2. Stop and then Start your webapp.

**Q:** Can I SSH to the VM?

**A:** No, we will be providing a way to SSH into your app container in a future release.

## Continous Integration / Deployment ##

**Q:** My webapp still uses an old Docker Container image after updating the image on DockerHub? Do you support continuous integration/deployment of custom containers?

**A:** you can refresh the container either by stopping and then starting your web app or changing/adding a dummy application setting to force a refresh of your container, we will be having a CI/CD feature for custom containers in a future release.

## Language Support ##

**Q:** Do you support uncompiled .net core apps?

**A:** No, you need to deploy the compiled .net core app with all the dependencies, a full deploy and build experience will be coming in a future release.

## Built-in Images ##

**Q:** What is the expected values for the Startup File section, when I configure the Runtime Stack

**A:** For Node.Js, you can specify the PM2 configuration file or your script file. For .Net Core, you should specify your compiled dll name. For Ruby, you can specify a Ruby script that you want to initialize your app with.

## Custom Containers ##

**Q:** I am using my own custom container. My app resides in the \home\ directory, but I can't find my files when I browse the content using the SCM site or a ftp client. Where are my files?

**A:** We mount an SMB share to \home\ directory; thus overriding any content there.

**Q:** I want to expose more than one port on my custom container image. Is that possible?

**A:** Currently that is not supported.

**Q:** Can I bring my own storage?

**A:** Currently that is not supported.

**Q:** I can't browse my custom container's file system or running processes from the SCM site. Why is that?

**A:** The SCM site runs in a separate container, you can't check the file system or running processes of the app container.

**Q:** My custom container listen to a port other than port 80. How can I configure my app to route the requests to that port?

**A:** You can specify an Application setting called **PORT** and give it the value of the expected port number.

## Pricing and SLA ##

**Q:** What is the pricing while in public preview?

**A:** You will be charged half the number of hours your app runs, with the normal Azure App Service pricing; effectively meaning a 50% discount on normal Azure App Service pricing.

## Other ##

**Q:** What are the supported characters in application settings names?

**A:** You can only use A-Z, a-z, 0-9 and underscore for application settings.

**Q:** Where can I request new features?

**A:** You can submit your idea here: https://aka.ms/webapps-uservoice. Please add [Linux] to the title of your idea.

## Next steps
* [What is App Service on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](app-service-linux-how-to-create-a-web-app.md)

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
ms.date: 02/16/2017
ms.author: aelnably;wesmc

---

# Azure App Service Web Apps on Linux FAQ #

With the release of Azure App Service on Linux (Currently in preview), we are working on adding features and making improvements to our platform. Here are some of the frequently asked questions that our customers have been asking over the last months.
If you have a question, add a comment at the bottom of the article. We do monitor these comments and reply as soon as possible.

## Built-in Images ##

**Q:** I want to fork the built-in Docker containers that the platform provides. Where can I find those files?

**A:** All Docker files can be found here: https://github.com/azure-app-service. All Docker containers can be found here: https://hub.docker.com/u/appsvc/.

## Management ##

**Q:** I press the restart button in the portal but my webapp did not restart, why is that?

**A:** We are working on enabling the reset button. Right now you have two options.
1. Add or change a dummy application setting to force your webapp to restart. 
2. Stop and then start your webapp.

**Q:** Can I SSH to the VM?

**A:** No, we will provide a way to SSH into your app container soon.

## Continuous Integration / Deployment ##

**Q:** My webapp still uses an old Docker Container image after updating the image on DockerHub? Do you support continuous integration/deployment of custom containers?

**A:** You can refresh the container either by stopping and then starting your web app. You can also refresh it by changing/adding a dummy application setting. We will have a CI/CD feature for custom containers soon to address this.

## Language Support ##

**Q:** Do you support uncompiled .Net core apps?

**A:** No, you need to deploy a compiled .Net core app with all the dependencies. A full deploy and build experience will be coming soon.

## Custom Containers ##

**Q:** I am using my own custom container. My app resides in the \home\ directory, but I can't find my files when I browse the content using the SCM site or an ftp client. Where are my files?

**A:** We mount an SMB share to \home\ directory; thus overriding any content there.

**Q:** I want to expose more than one port on my custom container image. Is that possible?

**A:** Currently that is not supported.

**Q:** Can I bring my own storage?

**A:** Currently that is not supported. We are planning to support additional storage options soon.

**Q:** I can't browse my custom container's file system or running processes from the SCM site. Why is that?

**A:** The SCM site runs in a separate container, you can't check the file system or running processes of the app container.

## Pricing and SLA ##

**Q:** What is the pricing while in public preview?

**A:** You are charged for half the number of hours your app runs, based on the normal Azure App Service pricing. Effectively this pricing is a 50% discount on normal Azure App Service pricing.

## Other ##

**Q:** What are the supported characters in application settings names?

**A:** You can only use A-Z, a-z, 0-9 and underscore for application settings.

**Q:** Where can I request new features?

**A:** You can submit your idea here: https://aka.ms/webapps-uservoice. Make sure to add [Linux] to the title of your idea.

## Next steps
* [What is App Service on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](app-service-linux-how-to-create-a-web-app.md)


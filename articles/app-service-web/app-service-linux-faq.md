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
ms.date: 02/13/2017
ms.author: aelnably

---

# Azure App Service Web Apps on Linux FAQ #

**Q:** I want to fork the built-in Docker containers that the platform provides. Where can I find those?

**A:** All Docker files can be found here: https://github.com/azure-app-service. All Docker containers can be found here: https://hub.docker.com/u/appsvc/.

**Q:** I press the restart button in the portal but my webapp did not restart, why is that?

**A:** We are working on enabling the reset button in the near future, right now you have two options, 1- Add or change a dummy application setting, that will force your webapp to restart, 2- Stop and then Start your webapp.

**Q:** My webapp still uses an old Docker Container image after updating the image on DockerHub? Do you support continuous integration/deployment of custom containers?

**A:** you can refresh the container either by stopping and then starting your web app or changing/adding a dummy application setting to force a refresh of your container, we will be having a CI/CD feature for custom containers in the near future.

**Q:** Do you support uncompiled .net core apps?

**A:** No, you need to deploy the compiled .net core app with all the dependencies, a full deploy and build experience will be coming in the near future.

**Q:** I am using my own custom container, my app resides in the \home\ directory, but I can't find my files when I browse the content using the scm site or a ftp client. Where are my files?

**A:** We mount an SMB share to \home\ directory; thus overriding any content there.

**Q:** I want to expose more than one port on my custom container image. Is that possible?

**A:** Currently that is not supported.

**Q:** Can I bring my own storage?

**A:** Currently that is not supported, planning to support that in the near future.

**Q:** What is the pricing while in public preview?

**A:** You will be charged half the number of hours your app runs, with the normal Azure App Service pricing; effectively meaning a 50% discount on normal Azure App Service pricing.

**Q:** Can I SSH to the VM?

**A:** No, we will providing a way to SSH into your app container in the near future.


## Next steps
* [Introduction to App Service on Linux](./app-service-linux-intro.md) 
* [What is App Service on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](./app-service-linux-how-to-create-a-web-app.md)

---
title: Using Ruby in Azure App Service Web App on Linux | Microsoft Docs
description: Using Ruby in Azure App Service Web App on Linux.
keywords: azure app service, web app, faq, linux, oss, ruby
services: app-service
documentationCenter: ''
authors: aelnably
manager: erikre
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

# Using Ruby in Web App on Linux #

With the latest update to our backend, we introduced support for Ruby v.2.3. By setting the configuration of your Linux web app, you can change the application stack.

## Using the Azure portal ##

From the new menu in the [Azure portal](https://portal.azure.com), you can choose to create a Web App on Linux from the Web + Mobile option as shown in the following image:

![Start creating a web app on the Azure portal][1]

Next, the **Create blade** opens as shown in the following image:

![The Create blade][2]

1. Give your web app a name.
2. Choose an existing resource group or create a new one. (See available regions in the [limitations section](app-service-linux-intro.md).)
3. Choose an existing Azure App Service plan or create a new one. (See App Service plan notes in the [limitations section](app-service-linux-intro.md).)
4. Choose the Ruby from the Built-in Runtime stacks.

After your Ruby web app gets created, you can deploy to it using Git or FTP.

To learn more about creating a Ruby app, check the [get started guide](app-service-linux-ruby-get-started.md)

## Next steps
* [What is Web App on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in Web App on Linux](app-service-linux-how-to-create-web-app.md)
* [Local Git Deployment to Azure App Service](app-service-deploy-local-git.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)
* [Create a Ruby App with Azure Web App on Linux](app-service-linux-ruby-get-started.md)

<!--Image references-->
[1]: ./media/app-service-linux-using-ruby/New-Linux.png
[2]: ./media/app-service-linux-using-ruby/Ruby-UX.png
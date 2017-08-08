---
title: Create an Azure web app running on Linux | Microsoft Docs
description: Web app creation workflow for Azure Web App on Linux.
keywords: azure app service, web app, linux, oss
services: app-service
documentationcenter: ''
author: naziml
manager: erikre
editor: ''

ms.assetid: 3a71d10a-a0fe-4d28-af95-03b2860057d5
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/16/2017
ms.author: naziml;wesmc

---
# Create an Azure web app running on Linux

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]


## Use the Azure portal to create your web app
You can start creating your web app on Linux from the [Azure portal](https://portal.azure.com) as shown in the following image:

![Start creating a web app on the Azure portal][1]

Next, the **Create blade** opens as shown in the following image:

![The Create blade][2]

1. Give your web app a name.
2. Choose an existing resource group or create a new one. (See available regions in the [limitations section](app-service-linux-intro.md).)
3. Choose an existing Azure App Service plan or create a new one. (See App Service plan notes in the [limitations section](app-service-linux-intro.md).)
4. Choose the application stack that you intend to use. You can choose between several versions of Node.js, PHP, .Net Core, and Ruby.

Once you have created the app, you can change the application stack from the application settings as shown in the following image:

![Application settings][3]

## Deploy your web app
Choosing **deployment options** from the management portal gives you the option to use local Git or GitHub repository to deploy your application. The rest of the instructions are similar to those for a non-Linux web app. You can follow the instructions in [local Git deployment](app-service-deploy-local-git.md) or [continuous deployment](app-service-continuous-deployment.md) to deploy your app.

You can also use FTP to upload your application to your site. You can get the FTP endpoint for your web app from the diagnostics logs section as shown in the following image:

![Diagnostics logs][4]

## Next steps
* [What is Azure Web App on Linux?](app-service-linux-intro.md)
* [Using PM2 Configuration for Node.js in Azure Web App on Linux](app-service-linux-using-nodejs-pm2.md)
* [Using Ruby in Azure App Service Web App on Linux](app-service-linux-ruby-get-started.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)

<!--Image references-->
[1]: ./media/app-service-linux-how-to-create-a-web-app/top-level-create.png
[2]: ./media/app-service-linux-how-to-create-a-web-app/create-blade.png
[3]: ./media/app-service-linux-how-to-create-a-web-app/application-settings-change-stack.png
[4]: ./media/app-service-linux-how-to-create-a-web-app/diagnostic-logs-ftp.png

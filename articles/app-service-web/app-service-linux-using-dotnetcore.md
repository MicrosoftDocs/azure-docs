---
title: Using .NET Core in Azure App Service Web Apps on Linux | Microsoft Docs
description: Using .NET Core in Azure App Service Web Apps on Linux.
keywords: azure app service, web app, dotnet, core, linux, oss
services: app-service
documentationCenter: ''
authors: aelnably
manager: wpickett
editor: ''

ms.assetid: c02959e6-7220-496a-a417-9b2147638e2e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2016
ms.author: aelnably

---

# Using .NET Core in Web Apps on Linux #

With the latest update to our back end, we introduced support for .NET Core v.1.0. By setting the configuration of your Linux web app, you can change the application stack.


## Using XPlat CLI ##

Using the latest Azure Cross Platform CLI, you can use the **azure webapp config set** command to change the application stack. Here is an example of that:

        azure webapp config set --name ContosoAppServicePlan --resource-group ContosoLinuxAzureResourceGroup --netframeworkversion v1.0 --appcommandline aspnetcore.dll

Note that the **aspnetcore.dll** file is the dll of your app. You can use any name you like in you app.

This will load the .Net Core image and start your web app. You can check that the settings have been correctly set by using the **azure webapp config show**. Here is an example of that:

        azure webapp config show --name ContosoAppServicePlan --resource-group ContosoLinuxAzureResourceGroup

## Next steps
* [Introduction to App Service on Linux](./app-service-linux-intro.md) 
* [What is App Service on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](./app-service-linux-how-to-create-a-web-app.md)
* [Azure Web App Cross Platform CLI](app-service-web-app-azure-resource-manager-xplat-cli.md)

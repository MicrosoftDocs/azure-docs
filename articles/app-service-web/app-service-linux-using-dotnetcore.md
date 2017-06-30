---
title: Using .NET Core in Azure App Service Web App on Linux | Microsoft Docs
description: Using .NET Core in Azure App Service Web App on Linux.
keywords: azure app service, web app, dotnet, core, linux, oss
services: app-service
documentationCenter: ''
authors: aelnably
manager: erikre
editor: ''

ms.assetid: c02959e6-7220-496a-a417-9b2147638e2e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2017
ms.author: aelnably;wesmc

---

# Using .NET Core in Azure Web App on Linux #

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]


With the latest update to our back end, we introduced support for .NET Core v.1.0. By setting the configuration of your Linux web app, you can change the application stack.


## Using the Azure CLI ##

Using the [latest Azure Command-Line Interface (CLI)](https://docs.microsoft.com/cli/azure/install-azure-cli), you can use the **azure webapp config set** command to change the application stack. Here is an example:

        azure webapp config set --name ContosoAppServicePlan --resource-group ContosoLinuxAzureResourceGroup --netframeworkversion v1.0 --appcommandline aspnetcore.dll

The **aspnetcore.dll** file is the dll of your app. You can use any name you like in your app.

This loads the .Net Core image and starts your web app. You can check that the settings have been correctly set by using the **azure webapp config show**. Here is an example:

        azure webapp config show --name ContosoAppServicePlan --resource-group ContosoLinuxAzureResourceGroup

## Next steps
* [What is Azure Web App on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in Azure Web App on Linux](./app-service-linux-how-to-create-web-app.md)
* [Azure Web App Cross Platform CLI](app-service-web-app-azure-resource-manager-xplat-cli.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)
<properties
	pagetitle: "Using .NET Core in Azure App Service Web Apps on Linux | Microsoft Docs"
	description: "Using .NET Core in Azure App Service Web Apps on Linux"
	keywords: "azure app service, web app, dotnet, core, linux, oss"
	services="app-service"
	documentationCenter=""
	authors="aelnably"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="app-service"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/16/2016"
	ms.author="aelnably"/>

---
# Using .NET Core in Web Apps on Linux #

With the latest update to our back end, we introduced support for .NET Core v.1.0, after [Creating a new Web App on Linux](app-service-linux-how-to-create-a-web-app.md) using app settings you can change the application stack using [Azure Web App Cross Platform CLI](app-service-web-app-azure-resource-manager-xplat-cli.md)


## Using XPlat CLI ##

using the latest Azure Cross Platform CLI using the **azure webapp config set** command, here is an example of that:

        azure webapp config set --name ContosoAppServicePlan --resource-group ContosoLinuxAzureResourceGroup --netframeworkversion v1.0 --appcommandline aspnetcore.dll

This will load the .Net Core image and start your web app, you can check that the settings have been correctly set by using the **azure webapp config show**, here is an example of that:

        azure webapp config show --name ContosoAppServicePlan --resource-group ContosoLinuxAzureResourceGroup

## Next steps
* [Introduction to App Service on Linux](./app-service-linux-intro.md) 
* [What is App Service on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in App Service on Linux](./app-service-linux-how-to-create-a-web-app.md)
* [Azure Web App Cross Platform CLI](app-service-web-app-azure-resource-manager-xplat-cli.md)

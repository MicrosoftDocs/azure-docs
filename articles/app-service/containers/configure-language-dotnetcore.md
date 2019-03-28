---
title: Configure ASP.NET Core apps - Azure App Service | Microsoft Docs 
description: Learn how to configure ASP.NET Core apps to work in Azure App Service
services: app-service
documentationcenter: ''
author: cephalin
manager: jpconnock
editor: ''

ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 03/28/2019
ms.author: cephalin

---

# Configure a Linux ASP.NET Core app for Azure App Service

ASP.NET Core apps need be deployed as compiled binaries. The Visual Studio publishing tool builds the solution and then deploys the compiled binaries directly, whereas the App Service deployment engine deploys the code repository first and then compiles the binaries.

This guide provides key concepts and instructions for ASP.NET Core developers who use a built-in Linux container in App Service. If you've never used Azure App Service, you should follow the [ASP.NET Core quickstart](quickstart-dotnetcore.md) and [ASP.NET Core with SQL Database tutorial](tutorial-dotnetcore-sqldb-app.md) first.

## Show .NET Core version

To show the current .NET Core version, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query linuxFxVersion
```

To show all supported .NET Core versions, run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp list-runtimes --linux | grep DOTNETCORE
```

## Set .NET Core version

Run the following command in the [Cloud Shell](https://shell.azure.com) to set the .NET Core version to 2.1:

```azurecli-interactive
az webapp config set --name <app-name> --resource-group <resource-group-name> --linux-fx-version "DOTNETCORE|2.1"
```

## Access environment variables

In App Service, you can set either app settings or connection strings outside of your app code (see [Set environment variables](../web-sites-configure.md)). Then you can access them using the standard ASP.NET pattern:

```csharp
include Microsoft.Extensions.Configuration;
// retrieve App Service app setting
System.Configuration.ConfigurationManager.AppSettings["MySetting"]
// retrieve App Service connection string
Configuration.GetConnectionString("MyDbConnection")
```

If you configure an app setting with the same name in App Service and in *Web.config*, the App Service value takes precedence over the Web.config value. The Web.config value lets you debug the app locally, but the App Service value lets your run the app in product with production settings. Connection strings work in the same way. This way, you can keep your application secrets outside of your code repository and access the appropriate values without changing your code.

## Get detailed exceptions page

When your ASP.NET app generates an exception in the Visual Studio debugger, the browser displays a detailed exception page, but in App Service that page is replaced by a generic **HTTP 500** error or **An error occurred while processing your request.** message. To display the detailed exception page in App Service, Add the `ASPNETCORE_ENVIRONMENT` app setting to your app by running the following command in the <a target="_blank" href="https://shell.azure.com" >Cloud Shell</a>.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings ASPNETCORE_ENVIRONMENT="Development"
```

## Deploy multi-project solutions

When you deploy an ASP.NET repository to the deployment engine with a .csproj file in the root directory, the engine deploys the project. When you deploy an ASP.NET repository with an .sln file in the root directory, the engine picks the first Web Site or Web Application Project it finds as the App Service app. It's possible for the engine not to pick the project you want.

To deploy a multi-project solution, you can specify the project to use in App Service in two different ways:

### Using .deployment file

Add a *.deployment* file to the repository root and add the following code:

```
[config]
project = <project-name>/<project-name>.csproj
```

### Using app settings

In the <a target="_blank" href="https://shell.azure.com">Azure Cloud Shell</a>, add an app setting to your App Service app by running the following CLI command. Replace *\<app-name>*, *\<resource-group-name>*, and *\<project-name>* with the appropriate values.

```azurecli-interactive
az webapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings PROJECT="<project-name>/<project-name>.csproj"
```

## Access diagnostic logs

[!INCLUDE [Access diagnostic logs](../../../includes/app-service-web-logs-access-no-h.md)]

## Next steps

> [!div class="nextstepaction"]
> [ASP.NET Core app with SQL Database](tutorial-dotnetcore-sqldb-app.md)

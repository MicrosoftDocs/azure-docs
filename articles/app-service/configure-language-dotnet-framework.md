---
title: Configure ASP.NET apps
description: Learn how to configure an ASP.NET app in Azure App Service. This article shows the most common configuration tasks. 

ms.devlang: csharp
ms.custom: devx-track-csharp, devx-track-azurecli, devx-track-dotnet
ms.topic: article
ms.date: 06/02/2020
author: cephalin
ms.author: cephalin
---

# Configure an ASP.NET app for Azure App Service

> [!NOTE]
> For ASP.NET Core, see [Configure an ASP.NET Core app for Azure App Service](configure-language-dotnetcore.md). If your ASP.NET app runs in a custom Windows or Linux container, see [Configure a custom container for Azure App Service](configure-custom-container.md).

ASP.NET apps must be deployed to Azure App Service as compiled binaries. The Visual Studio publishing tool builds the solution and then deploys the compiled binaries directly, whereas the App Service deployment engine deploys the code repository first and then compiles the binaries.

This guide provides key concepts and instructions for ASP.NET developers. If you've never used Azure App Service, follow the [ASP.NET quickstart](./quickstart-dotnetcore.md?tabs=netframework48) and [ASP.NET with SQL Database tutorial](app-service-web-tutorial-dotnet-sqldatabase.md) first.

## Show supported .NET Framework runtime versions

In App Service, the Windows instances already have all the supported .NET Framework versions installed. To show the .NET Framework runtime and SDK versions available to you, navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and run the appropriate command in the browser-based console:

For CLR 4 runtime versions (.NET Framework 4 and above):

```CMD
ls "D:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework"
```

Latest .NET Framework version may not be immediately available.

For CLR 2 runtime versions (.NET Framework 3.5 and below):

```CMD
ls "D:\Program Files (x86)\Reference Assemblies\Microsoft\Framework"
```

## Show current .NET Framework runtime version

Run the following command in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config show --resource-group <resource-group-name> --name <app-name> --query netFrameworkVersion
```

A value of `v4.0` means the latest CLR 4 version (.NET Framework 4.x) is used. A value of `v2.0` means a CLR 2 version (.NET Framework 3.5) is used.

## Set .NET Framework runtime version

By default, App Service uses the latest supported .NET Framework version to run your ASP.NET app. To run your app using .NET Framework 3.5 instead, run the following command in the [Cloud Shell](https://shell.azure.com) (v2.0 signifies CLR 2):

```azurecli-interactive
az webapp config set --resource-group <resource-group-name> --name <app-name> --net-framework-version v2.0
```

## Access environment variables

In App Service, you can [set app settings](configure-common.md#configure-app-settings) and connection strings outside of your app code. Then you can access them in any class using the standard ASP.NET pattern:

```csharp
using System.Configuration;
...
// Get an app setting
ConfigurationManager.AppSettings["MySetting"];
// Get a connection string
ConfigurationManager.ConnectionStrings["MyConnection"];
}
```

If you configure an app setting with the same name in App Service and in *web.config*, the App Service value takes precedence over the *web.config* value. The local *web.config* value lets you debug the app locally, but the App Service value lets your run the app in product with production settings. Connection strings work in the same way. This way, you can keep your application secrets outside of your code repository and access the appropriate values without changing your code.

## Deploy multi-project solutions

When a Visual Studio solution includes multiple projects, the Visual Studio publish process already includes selecting the project to deploy. When you deploy to the App Service deployment engine, such as with Git, or with ZIP deploy [with build automation enabled](deploy-zip.md#enable-build-automation-for-zip-deploy), the App Service deployment engine picks the first Web Site or Web Application Project it finds as the App Service app. You can specify which project App Service should use by specifying the `PROJECT` app setting. For example, run the following in the [Cloud Shell](https://shell.azure.com):

```azurecli-interactive
az webapp config appsettings set --resource-group <resource-group-name> --name <app-name> --settings PROJECT="<project-name>/<project-name>.csproj"
```

## Get detailed exceptions page

When your ASP.NET app generates an exception in the Visual Studio debugger, the browser displays a detailed exception page, but in App Service that page is replaced by a generic error message. To display the detailed exception page in App Service, open the *Web.config* file and add the `<customErrors mode="Off"/>` element under the `<system.web>` element. For example:

```xml
<system.web>
    <customErrors mode="Off"/>
</system.web>
```

Redeploy your app with the updated *Web.config*. You should now see the same detailed exception page.

## Access diagnostic logs

You can add diagnostic messages in your application code using [System.Diagnostics.Trace](/dotnet/api/system.diagnostics.trace). For example: 

```csharp
Trace.TraceError("Record not found!"); // Error trace
Trace.TraceWarning("Possible data loss"); // Warning trace
Trace.TraceInformation("GET /Home/Index"); // Information trace
```

[!INCLUDE [Access diagnostic logs](../../includes/app-service-web-logs-access-no-h.md)]

## More resources

- [Tutorial: Build an ASP.NET app in Azure with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)
- [Environment variables and app settings reference](reference-app-settings.md)

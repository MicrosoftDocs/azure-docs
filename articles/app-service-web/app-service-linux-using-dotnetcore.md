---
title: Use .NET Core in Azure App Service Web App on Linux | Microsoft Docs
description: Use .NET Core in Azure App Service Web App on Linux.
keywords: azure app service, web app, dotnet, core, linux, oss
services: app-service
documentationCenter: ''
authors: ahmedelnably, michimune, rachelappel
manager: erikre
editor: ''

ms.assetid: c02959e6-7220-496a-a417-9b2147638e2e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2017
ms.author: aelnably;wesmc;mikono;rachelap

---

# Use .NET Core in an Azure Web App on Linux #

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]

[.NET Core](https://www.microsoft.com/net/core/platform) is a lightweight and modular platform for creating cross platform web applications and services. This tutorial contains step-by-step instructions showing how to create a .NET Core app on Azure Web App on Linux. You can follow the steps below using a Mac, Windows, or Linux machine.

## Prerequisites ##

To complete this tutorial: 

* Install the [*.NET Core SDK*](https://www.microsoft.com/net/download/core) on your local machine.
* Install [*Git*](https://git-scm.com/downloads) locally.

[!INCLUDE [Free trial note](../../includes/quickstarts-free-trial-note.md)]

## Create a local .NET Core application ##

Start a new terminal session. Create a directory named `hellodotnetcore`, and change the current directory to it. Then type the following: 

```
dotnew new web
``` 

  The previous command creates three files (*hellodotnetcore.csproj*, *Program.cs*, and *Startup.cs*) and one empty folder (*wwwroot/*) under the current directory. The content of `.csproj` file should look like the following: 

  >[!NOTE]
  >Empty lines are omitted.

  ```xml
  <Project Sdk="Microsoft.NET.Sdk.Web">
        <PropertyGroup>
        <TargetFramework>netcoreapp1.1</TargetFramework>
        </PropertyGroup>
        <ItemGroup>
        <Folder Include="wwwroot\" />
        </ItemGroup>
        <ItemGroup>
        <PackageReference Include="Microsoft.AspNetCore" Version="1.1.2" />
        </ItemGroup>
  </Project>
  ```
To find out which operating systems and versions are supported by .NET Core, visit the [.NET Core Roadmap](https://github.com/dotnet/core/blob/master/roadmap.md).

Since this app is a web application, a reference to an ASP.NET Core package was automatically added to the *hellodotnetcore.csproj* file. The version number of the package is set according to the chosen framework. This example is referencing ASP.NET Core version 1.1.2 because .NET Core 1.1 is used.

## Build and test the application locally ##

Test your application locally before deploying it to cloud. So, let's build it on your local machine.

Build your .NET Core app by resolving depending on packages followed by building it, as shown here: 

```
dotnet restore && dotnet build
``` 

Once built, run it on your local machine to confirm it works. In the previous case, you can do it by typing `dotnet bin/Debug/netcoreapp1.1/hellodotnetcore.dll` because the DLL was built under *bin/Debug/netcoreapp1.1/*. This directory structure is consistent across operating systems.

```bash
dotnet bin/Debug/netcoreapp1.1/hellodotnetcore.dll
```

When the application starts, you see a message indicating the app is listening to incoming requests at a port. 

![Testing .NET Core application locally][5]

Test it by browsing to `http://localhost:5000/` with your browser. If everything works fine, you see "Hello World!" as the result text.

![Test with browser][7]

## Create a .NET Core app in the Azure Portal ##

First you need to create an empty web app. Log in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) and navigate to create a new [Web App on Linux](https://portal.azure.com/#create/Microsoft.AppSvcLinux).

![Creating a web app][1]

When the Create page opens, you must provide details about your web app to create it:

![Choosing a .NET Core runtime stack][2]

Use the following table as a guide to fill out the Create page, then select **OK** and **Create** to create the app.

| Setting      | Suggested value  | Description                                        |
| ------------ | ---------------- | -------------------------------------------------- |
| App name | hellodotnetcore  | The name of your app. This name must be unique. |
| Subscription | Choose an existing subscription | The Azure subscription. |
| Resource Group | myResourceGroup |  The Azure resource group to contain the function. |
| App Service Plan | Existing App Service Plan name |  The function's App Service plan.  |
| Configure Container | Choose a Container | The type of container for this web app: Built-in, Docker, or Private registry. |
| Image source  | Choose Built-in  |  The source of the image. |
| Runtime Stack  | Choose .NET Core 1.1  | The runtime stack and version.  |

## Deploy your application via Git ##

Use Git to deploy the .NET Core application to Azure App Service Web App on Linux.

The new Azure website already has a Git deployment configured. You will find the Git deployment URL by navigating to the following URL after inserting your web app name:

```https://{your web app name}.scm.azurewebsites.net/api/scm/info```

The Git URL has the following form based on your web app name:

```https://{your web app name}.scm.azurewebsites.net/{your web app name}.git```

Run the following commands to deploy the local application to your Azure website: 
 
```bash
git init
git remote add azure <Git deployment URL from above>
git add *.csproj *.cs
git commit -m "Initial deployment commit"
git push master
```

You don't need to push any files under *bin/* or *obj/* directories because your application is built in the cloud when pushing your application. After the build process is complete, binary files are copied into the application's directory at */home/site/wwwroot/*.

Confirm that the remote deployment operations report success. Push operations may take a while since package resolution and build process run in the cloud.

![Pushing the application to the cloud][8]

Once the deployment has completed, restart your web app for the deployment to take effect. To do this, go to the Azure portal and navigate to the **Overview** page of your web app. Select the **Restart** button in the page. When a popup window shows up, select **Yes** to confirm. You can then browse your web app, as shown here:

![Browsing .NET Core app deployed to Azure App Service on Linux][10]

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal.md)]

## Next steps
* [Creating Web Apps in Azure Web App on Linux](./app-service-linux-how-to-create-web-app.md)

[1]: ./media/app-service-linux-using-dotnetcore/top-level-create.png
[2]: ./media/app-service-linux-using-dotnetcore/dotnet-new-webapp.png
[3]: ./media/app-service-linux-using-dotnetcore/dotnet-new.png
[4]: ./media/app-service-linux-using-dotnetcore/dotnet-restore-and-build.png
[5]: ./media/app-service-linux-using-dotnetcore/dotnet-run-local.png
[6]: ./media/app-service-linux-using-dotnetcore/dotnet-local-http.png
[7]: ./media/app-service-linux-using-dotnetcore/dotnet-browse-local.png
[8]: ./media/app-service-linux-using-dotnetcore/dotnet-git-push.png
[9]: ./media/app-service-linux-using-dotnetcore/dotnet-update-startup-file.png
[10]: ./media/app-service-linux-using-dotnetcore/dotnet-browse-azure.png

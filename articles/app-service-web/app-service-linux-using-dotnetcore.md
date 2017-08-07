---
title: Use .NET Core in Web App on Linux | Microsoft Docs
description: Use .NET Core in Web App on Linux.
keywords: azure app service, web app, dotnet, core, linux, oss
services: app-service
documentationCenter: ''
authors: michimune, rachelappel
manager: erikre
editor: ''

ms.assetid: c02959e6-7220-496a-a417-9b2147638e2e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: aelnably;wesmc;mikono;rachelap

---

# Use .NET Core in an Azure web app on Linux #

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]

[Web App](https://docs.microsoft.com/azure/app-service-web/app-service-linux-intro) on Linux provides a highly scalable, self-patching web hosting service using the Linux operating system. This tutorial contains step-by-step instructions showing how to create a [.NET Core](https://docs.microsoft.com/aspnet/core/) app on Azure web app on Linux. 

![Web App on Linux][10]

You can follow the steps below using a Mac, Windows, or Linux machine.

## Prerequisites ##

To complete this tutorial: 

* Install the [.NET Core SDK](https://www.microsoft.com/net/download/core).
* Install [Git](https://git-scm.com/downloads).

[!INCLUDE [Free trial note](../../includes/quickstarts-free-trial-note.md)]

## Create a local .NET Core application ##

Start a new terminal session. Create a directory named `hellodotnetcore`, and change the current directory to it. Then type the following: 

```
dotnew new web
``` 

  This command creates three files (*hellodotnetcore.csproj*, *Program.cs*, and *Startup.cs*) and one empty folder (*wwwroot/*) under the current directory. The content of `.csproj` file should look like the following: 

```xml
  <!-- Empty lines are omitted. -->

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

Since this app is a web application, a reference to an ASP.NET Core package was automatically added to the *hellodotnetcore.csproj* file. The version number of the package is set according to the chosen framework. This example is referencing ASP.NET Core version 1.1.2 because .NET Core 1.1 is used.

## Build and test the application locally ##

You can build and run your .NET Core app with the `dotnet restore` command followed by the `dotnet run` command, as shown here:

```
dotnet restore
dotnet run
```


When the application starts, it displays a message indicating the app is listening to incoming requests at a port. 

```bash
Hosting environment: Production
Content root path: C:\hellodotnetcore
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

Test it by browsing to `http://localhost:5000/` with your browser. If everything works fine, you see "Hello World!" as the result text.

![Test with browser][7]

## Create a .NET Core app in the Azure Portal ##

First you need to create an empty web app. Log in to the [Azure portal](https://portal.azure.com/) and create a new [Web App on Linux](https://portal.azure.com/#create/Microsoft.AppSvcLinux).

![Creating a web app][1]

When the **Create** page opens, provide details about your web app:

![Choosing a .NET Core runtime stack][2]

Use the following table as a guide to fill out the **Create** page, then select **OK** and **Create** to create the app.

| Setting      | Suggested value  | Description                                        |
| ------------ | ---------------- | -------------------------------------------------- |
| App name | hellodotnetcore  | The name of your app. This name must be unique. |
| Subscription | Choose an existing subscription | The Azure subscription. |
| Resource Group | myResourceGroup |  The Azure resource group to contain the web app. |
| App Service Plan | Existing App Service Plan name |  The App Service plan.  |
| Configure Container | .NET Core 1.1 | The type of container for this web app: Built-in, Docker, or Private registry. |
| Image source  | Built-in  |  The source of the image. |
| Runtime Stack  | .NET Core 1.1  | The runtime stack and version.  |

## Deploy your application via Git ##

Use Git to deploy the .NET Core application to Azure App Service Web App on Linux.

The new Azure web app already has Git deployment configured. You will find the Git deployment URL by navigating to the following URL after inserting your web app name:

```https://{your web app name}.scm.azurewebsites.net/api/scm/info```

The Git URL has the following form based on your web app name:

```https://{your web app name}.scm.azurewebsites.net/{your web app name}.git```

Run the following commands to deploy the local application to your Azure web app: 
 
```bash
git init
git remote add azure <Git deployment URL from above>
git add *.csproj *.cs
git commit -m "Initial deployment commit"
git push azure master
```

You don't need to push any files under *bin/* or *obj/* directories because your application is built in the cloud when the application's source files are pushed to Azure. After the build process is complete, binary files are copied into the application's directory at */home/site/wwwroot/*.

Confirm that the remote deployment operations report success. Push operations may take a while since package resolution and build process run in the cloud. You will see several status messages, including ones stating that files have been copied. The output should look similar to the following:

```bash
/* some output has been removed for brevity */
remote: Copying file: 'System.Net.Websockets.dll' 
remote: Copying file: 'System.Runtime.CompilerServices.Unsafe.dll' 
remote: Copying file: 'System.Runtime.Serialization.Primitives.dll' 
remote: Copying file: 'System.Text.Encodings.Web.dll' 
remote: Copying file: 'hellodotnetcore.deps.json' 
remote: Copying file: 'hellodotnetcore.dll' 
remote: Omitting next output lines...
remote: Finished successfully.
remote: Running post deployment commands...
remote: Deployment successful.
To https://hellodotnetcore.scm.azurewebsites.net/
 * [new branch]           master -> master

```

Once the deployment has completed, restart your web app for the deployment to take effect. To do this, go to the Azure portal and navigate to the **Overview** page of your web app. Select the **Restart** button in the page. When a popup window shows up, select **Yes** to confirm. You can then browse your web app, as shown here:

![Browsing .NET Core app deployed to Azure App Service on Linux][10]

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal.md)]

## Next steps
* [Azure App Service Web App on Linux FAQ](./app-service-linux-faq.md)

[1]: ./media/app-service-linux-using-dotnetcore/top-level-create.png
[2]: ./media/app-service-linux-using-dotnetcore/dotnet-new-webapp.png
[7]: ./media/app-service-linux-using-dotnetcore/dotnet-browse-local.png
[10]: ./media/app-service-linux-using-dotnetcore/dotnet-browse-azure.png

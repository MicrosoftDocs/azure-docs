---
title: Using .NET Core in Azure App Service Web App on Linux | Microsoft Docs
description: Using .NET Core in Azure App Service Web App on Linux.
keywords: azure app service, web app, dotnet, core, linux, oss
services: app-service
documentationCenter: ''
authors: ahmedelnably, michimune
manager: erikre
editor: ''

ms.assetid: c02959e6-7220-496a-a417-9b2147638e2e
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/07/2017
ms.author: aelnably;wesmc;mikono

---

# Using .NET Core in Azure Web App on Linux #

[!INCLUDE [app-service-linux-preview](../../includes/app-service-linux-preview.md)]


With the latest update to our back end, we introduced support for .NET Core v.1.0 and .NET Core v.1.1. We will support .NET Core v.2.0 in the near future. By setting the configuration of your Linux web app, you can change the application stack.

## Prerequisites ##

* **.NET Core SDK** is installed from [Download .NET Core](https://www.microsoft.com/net/download/core) to your local machine.

* [Git](https://git-scm.com/downloads) is installed on your development machine
* An [active Azure subscription](https://azure.microsoft.com/pricing/free-trial/)

## Step 1 - Creating a new .NET Core app ##

First you will need to create an empty web app. Open [Azure Portal](https://portal.azure.com) and navigate through as shown in the following image:

![Creating a web app on the Azure portal][1]

When the Create blade opens, click on **Configuration container** and choose either .Net Core 1.0 or 1.1 from **Runtime Stack**, depending on which runtime stack that your app is using:

![Choosing a .NET Core runtime stack][2]

Click on **OK** to close the Docker Container blade and fill out the Create blade. Press **Create** to start creating a new app.

## Step 2 - Create a local .NET Core application (from Command Line) ##

1. Start a new command line session. If your machine is Windows, press **Windows** + **R** key, followed by typing either `cmd` or `powershell`. If your machine is Linux or Mac, start a terminal session.

1. Create a directory named your project and change the current directory to it. Then type `dotnew new web`. The following example is creating a new project named **hellodotnetcore**.

![Creating a new .NET Core app][3]

The above command will create three files (`hellodotnetcore.csproj`, `Program.cs` and `Startup.cs`) and one empty folder (`wwwroot/`) under the current directory. The content of the .csproj file is something like the following (Note: empty lines are omitted):

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

In the above example, .NET Core 1.1 is specified as the framework version with the `<TargetFramework>` tag at line 3. If you want a specific framework version, use `--framework` option (Not available to all platforms):

        dotnet new web --framework netcoreapp1.0

To find out which operating systems and versions are supported by .NET Core, visit [.NET Core Roadmap](https://github.com/dotnet/core/blob/master/roadmap.md).

Since this is a web application, a reference to an ASP.NET Core package is automatically added to the .csproj file. The version number of the package is set according to the chosen framework. For example, the above example is referencing ASP.NET Core version 1.1.2 because .NET Core 1.1 is used.

## Step 3 - Building and testing the application locally (Optional) ##

Although it is not mandatory, it is always better to test your application locally before deploying it to cloud. So, let's build it on your local machine.

First, build your .NET Core app by resolving depending packages followed by building it. Type `dotnet restore` and if it succeeds then type `dotnet build`. The following screenshot shows a command line doing the two commands together:

![Building your .NET Core application][4]

Once built, run it on your local machine to confirm it works. In the above case, you can do it by typing `dotnet bin/Debug/netcoreapp1.1/hellodotnetcore.dll` because the DLL was built under `bin/Debug/netcoreapp1.1/`. This is consistent across operating systems except that you need to use backslash characters instead of forward slashes if your machine is Windows, as you know.

Unix/Linux/Mac:

        dotnet bin/Debug/netcoreapp1.1/hellodotnetcore.dll

Windows:

        dotnet bin\Debug\netcoreapp1.1\hellodotnetcore.dll

When the application starts, you will see a message indicating the app is listening to incoming requests at a port. Please test it by executing curl in another terminal session, or browse *http://localhost:5000/* with your browser. If everything works fine, you will see "Hello World!" as the result text of curl.

![Testing .NET Core application locally][5]

![Executing CURL to test your application][6]

## Step 4 - Deploying your application via git ##

In this tutorial, we use Git to deploy the .NET Core application to Azure.

1. The new Azure website already has a Git deployment configured. You will find the Git deployment URL by navigating to the following URL after inserting your web app name:

		https://{your web app name}.scm.azurewebsites.net/api/scm/info

	The Git URL has the following form based on your web app name:

		https://{your web app name}.scm.azurewebsites.net/{your web app name}.git

1. Run the following commands to deploy the local application to your Azure website. Note that you don't need to push any files under **bin/** or **obj/** directories because your application will be built in the cloud when pushing your application and copied into the applicatoin's directory at **/home/site/wwwroot/**. 

        git init
        git remote add azure <Git deployment URL from above>
        git add *.csproj *.cs
        git commit -m "Initial deployment commit"
        git push master

1. Confirm that the remote deployment operations report success. Note that push operations may take a while since package resolution and build process run in the cloud.

1. Browse your web app or refresh the web app. If your application isn't displayed correctly, Azure may have failed to locate your DLL. In this case, you will need to manually provide the main DLL filename from the Azure Portal. Navigate to **Docker Container** of your web app on [Azure Portal](https://azure.portal.com), update **Startup File** and press **Save**.

        dotnet your_application_name.dll

![Changing the Startup File setting][7]

## Next steps
* [What is Azure Web App on Linux?](app-service-linux-intro.md)
* [Creating Web Apps in Azure Web App on Linux](./app-service-linux-how-to-create-web-app.md)
* [Azure Web App Cross Platform CLI](app-service-web-app-azure-resource-manager-xplat-cli.md)
* [Azure App Service Web App on Linux FAQ](app-service-linux-faq.md)

[1]: ./media/app-service-linux-using-dotnetcore/top-level-create.png
[2]: ./media/app-service-linux-using-dotnetcore/New-DotNetCore.png
[3]: ./media/app-service-linux-using-dotnetcore/dotnet-new.png
[4]: ./media/app-service-linux-using-dotnetcore/dotnet-restore-and-build.png
[5]: ./media/app-service-linux-using-dotnetcore/dotnet-run-local.png
[6]: ./media/app-service-linux-using-dotnetcore/dotnet-local-http.png
[7]: ./media/app-service-linux-using-dotnetcore/dotnet-update-startup-file.png

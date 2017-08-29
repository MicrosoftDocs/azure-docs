---
title: Create a .NET Core web app in a Linux container in Azure | Microsoft Docs
description: Deploy your first .NET Core Hello World app to Web Apps for Containers in minutes.
keywords: azure app service, web app, dotnet, core, linux, oss
services: app-service
documentationCenter: ''
authors: cephalin
manager: syntaxc4
editor: ''

ms.assetid: c02959e6-7220-496a-a417-9b2147638e2e
ms.service: app-service
ms.workload: web
ms.tgt_pltfrm: linux
ms.devlang: na
ms.topic: quickstart
ms.date: 08/29/2017
ms.author: aelnably;wesmc;mikono;rachelap;cephalin;cfowler
---
# Create a .NET Core web app in a Linux container in Azure

[!INCLUDE [app-service-linux-preview](../../../includes/app-service-linux-preview.md)]

[Web App](app-service-linux-intro.md) on Linux provides a highly scalable, self-patching web hosting service using the Linux operating system. This quickstart shows how to create a [.NET Core](https://docs.microsoft.com/aspnet/core/) app on Azure web app on Linux. You create the web app using the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli), and you use Git to deploy the .NET Core code to the web app.

![Web App on Linux][10]

You can follow the steps below using a Mac, Windows, or Linux machine. 

## Prerequisites

To complete this quickstart:

* [Install Git](https://git-scm.com/)
* [Install the .NET Core SDK](https://www.microsoft.com/net/download/core)

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Create the app locally ##

In a new terminal session, create a directory named `hellodotnetcore` and change the current directory to it. 

```
md hellodotnetcore
cd hellodotnetcore
``` 

Create a new .NET Core web app.

```
dotnet new web
``` 

## Run the app locally

Restore the NuGet packages and run the app.

```
dotnet restore
dotnet run
```

Open a web browser, and navigate to the app at http://localhost:5000.

You see the **Hello World** message from the sample app displayed in the page.

![Test with browser](media/quickstart-dotnetcore/dotnet-browse-local.png)

In your terminal window, press **Ctrl+C** to exit the web server.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)] 

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group.md)] 

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)] 

## Create a web app

Create a [web app](../../app-service-web/app-service-web-overview.md) in the `myAppServicePlan` App Service plan with the [az webapp create](/cli/azure/webapp#create) command. Don't forget to replace `<app name>` with a unique app name.

Notice that the runtime is set to `DOTNETCORE|1.1.0`. 

```azurecli-interactive
  az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app name> --runtime "DOTNETCORE|1.1.0" --deployment-local-git
```
> [!TIP]
> Setting the runtime this way uses a default container provided by the platform. You can bring your own docker container using the [az webapp config container set](/cli/azure/webapp/config/container#set) command.

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-result.md)] 

![Empty web app page](media/quickstart-dotnetcore/app-service-web-service-created.png)

You’ve created an empty new web app in a Linux container, with git deployment enabled.

[!INCLUDE [Push to Azure](../../../includes/app-service-web-git-push-to-azure.md)] 

```bash
Counting objects: 23, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (21/21), done.
Writing objects: 100% (23/23), 3.71 KiB | 0 bytes/s, done.
Total 23 (delta 8), reused 7 (delta 1)
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id 'bf114df591'.
remote: Generating deployment script.
remote: Generating deployment script for node.js Web Site
remote: Generated deployment script files
remote: Running deployment command...
remote: Handling node.js deployment.
remote: Kudu sync from: '/home/site/repository' to: '/home/site/wwwroot'
remote: Copying file: '.gitignore'
remote: Copying file: 'LICENSE'
remote: Copying file: 'README.md'
remote: Copying file: 'index.js'
remote: Copying file: 'package.json'
remote: Copying file: 'process.json'
remote: Deleting file: 'hostingstart.html'
remote: Ignoring: .git
remote: Using start-up script index.js from package.json.
remote: Node.js versions available on the platform are: 4.4.7, 4.5.0, 6.2.2, 6.6.0, 6.9.1.
remote: Selected node.js version 6.9.1. Use package.json file to choose a different version.
remote: Selected npm version 3.10.8
remote: Finished successfully.
remote: Running post deployment command(s)...
remote: Deployment successful.
To https://<app_name>.scm.azurewebsites.net:443/<app_name>.git
 * [new branch]      master -> master
```

## Browse to the app

Browse to the deployed application using your web browser.

```bash
http://<app_name>.azurewebsites.net
```

The Node.js sample code is running in an Azure App Service web app.

![Sample app running in Azure](media/quickstart-dotnetcore/dotnet-browse-azure.png)

**Congratulations!** You've deployed your first Node.js app to App Service.

## Update and redeploy the code

In the local directory, open the _Startup.cs_ file. In line 33, make a small change to the text in the call to `context.Response.WriteAsync`:

```csharp
await context.Response.WriteAsync("Hello Azure!");
```

Commit your changes in Git, and then push the code changes to Azure.

```bash
git commit -am "updated output"
git push azure master
```

Once deployment has completed, switch back to the browser window that opened in the **Browse to the app** step, and hit refresh.

![Updated sample app running in Azure](media/quickstart-dotnetcore/dotnet-browse-azure.png)

## Manage your new Azure web app

Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the web app you created.

From the left menu, click **App Services**, and then click the name of your Azure web app.

![Portal navigation to Azure web app](./media/quickstart-nodejs/nodejs-docs-hello-world-app-service-list.png)

You see your web app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete. 

![App Service blade in Azure portal](media/quickstart-nodejs/nodejs-docs-hello-world-app-service-detail.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Node.js with MongoDB](tutorial-nodejs-mongodb-app.md)

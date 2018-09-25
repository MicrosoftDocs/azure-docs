---
title: Create a C# ASP.NET Core web app in Azure | Microsoft Docs
description: Learn how to run web apps in Azure App Service by deploying the default C# ASP.NET web app.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.assetid: b1e6bd58-48d1-4007-9d6c-53fd6db061e3
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 09/05/2018
ms.author: cephalin
ms.custom: mvc, devcenter, vs-azure
---
# Create an ASP.NET Core web app in Azure

> [!NOTE]
> This article deploys an app to App Service on Windows. To deploy to App Service on _Linux_, see [Create a .NET Core web app in App Service on Linux](./containers/quickstart-dotnetcore.md).
>

[Azure Web Apps](app-service-web-overview.md) provides a highly scalable, self-patching web hosting service.  This quickstart shows how to deploy your first ASP.NET Core web app to Azure Web Apps. When you're finished, you'll have a resource group that consists of an App Service plan and an Azure web app with a deployed web application.

![](./media/app-service-web-get-started-dotnet/web-app-running-live.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this tutorial, install <a href="https://www.visualstudio.com/downloads/" target="_blank">Visual Studio 2017</a> with the **ASP.NET and web development** workload.

If you've installed Visual Studio 2017 already:

- Install the latest updates in Visual Studio by clicking **Help** > **Check for Updates**.
- Add the workload by clicking **Tools** > **Get Tools and Features**.

## Create an ASP.NET Core web app

In Visual Studio, create a project by selecting **File > New > Project**. 

In the **New Project** dialog, select **Visual C# > Web > ASP.NET Core Web Application**.

Name the application _myFirstAzureWebApp_, and then select **OK**.
   
![New Project dialog box](./media/app-service-web-get-started-dotnet/new-project.png)

You can deploy any type of ASP.NET Core web app to Azure. For this quickstart, select the **Web Application** template, and make sure authentication is set to **No Authentication** and no other option is selected.
      
Select **OK**.

![New ASP.NET Project dialog box](./media/app-service-web-get-started-dotnet/razor-pages-aspnet-dialog.png)

From the menu, select **Debug > Start without Debugging** to run the web app locally.

![Run app locally](./media/app-service-web-get-started-dotnet/razor-web-app-running-locally.png)

## Launch the publish wizard

In the **Solution Explorer**, right-click the **myFirstAzureWebApp** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-get-started-dotnet/right-click-publish.png)

The publish wizard is automatically launched. Select **App Service** > **Publish** to open the **Create App Service** dialog.

![Publish from project overview page](./media/app-service-web-get-started-dotnet/publish-to-app-service.png)

## Sign in to Azure

In the **Create App Service** dialog, click **Add an account**, and sign in to your Azure subscription. If you're already signed in, select the account you want from the dropdown.

> [!NOTE]
> If you're already signed in, don't select **Create** yet.
>
   
![Sign in to Azure](./media/app-service-web-get-started-dotnet/sign-in-azure.png)

## Create a resource group

[!INCLUDE [resource group intro text](../../includes/resource-group.md)]

Next to **Resource Group**, select **New**.

Name the resource group **myResourceGroup** and select **OK**.

## Create an App Service plan

[!INCLUDE [app-service-plan](../../includes/app-service-plan.md)]

Next to **Hosting Plan**, select **New**. 

In the **Configure Hosting Plan** dialog, use the settings in the table following the screenshot.

![Create App Service plan](./media/app-service-web-get-started-dotnet/configure-app-service-plan.png)

| Setting | Suggested Value | Description |
|-|-|-|
|App Service Plan| myAppServicePlan | Name of the App Service plan. |
| Location | West Europe | The datacenter where the web app is hosted. |
| Size | Free | [Pricing tier](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) determines hosting features. |

Select **OK**.

## Create and publish the web app

In **App Name**, type a unique app name (valid characters are `a-z`, `0-9`, and `-`), or accept the automatically generated unique name. The URL of the web app is `http://<app_name>.azurewebsites.net`, where `<app_name>` is your app name.

Select **Create** to start creating the Azure resources.

![Configure app name](./media/app-service-web-get-started-dotnet/web-app-name.png)

Once the wizard completes, it publishes the ASP.NET Core web app to Azure, and then launches the app in the default browser.

![Published ASP.NET web app in Azure](./media/app-service-web-get-started-dotnet/web-app-running-live.png)

The app name specified in the [create and publish step](#create-and-publish-the-web-app) is used as the URL prefix in the format `http://<app_name>.azurewebsites.net`.

Congratulations, your ASP.NET Core web app is running live in Azure App Service.

## Update the app and redeploy

From the **Solution Explorer**, open _Pages/Index.cshtml_.

Replace the two `<div>` tags with the following code:

```HTML
<div class="jumbotron">
    <h1>ASP.NET in Azure!</h1>
    <p class="lead">This is a simple app that we’ve built that demonstrates how to deploy a .NET app to Azure App Service.</p>
</div>
```

To redeploy to Azure, right-click the **myFirstAzureWebApp** project in **Solution Explorer** and select **Publish**.

In the publish summary page, select **Publish**.
![Visual Studio publish summary page](./media/app-service-web-get-started-dotnet/publish-summary-page.png)

When publishing completes, Visual Studio launches a browser to the URL of the web app.

![Updated ASP.NET web app in Azure](./media/app-service-web-get-started-dotnet/web-app-running-live-updated.png)

## Manage the Azure web app

Go to the <a href="https://portal.azure.com" target="_blank">Azure portal</a> to manage the web app.

From the left menu, select **App Services**, and then select the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-get-started-dotnet/access-portal.png)

You see your web app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete. 

![App Service blade in Azure portal](./media/app-service-web-get-started-dotnet/web-app-blade.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [ASP.NET Core with SQL Database](app-service-web-tutorial-dotnetcore-sqldb.md)

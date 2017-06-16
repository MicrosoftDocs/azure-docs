---
title: Create an ASP.NET web app in Azure | Microsoft Docs
description: Learn how to run web apps in Azure App Service by deploying the default ASP.NET web app.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: wpickett
editor: ''

ms.assetid: b1e6bd58-48d1-4007-9d6c-53fd6db061e3
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 06/14/2017
ms.author: cephalin
ms.custom: mvc
---
# Create an ASP.NET web app in Azure

[Azure Web Apps](https://docs.microsoft.com/azure/app-service-web/app-service-web-overview) provides a highly scalable, self-patching web hosting service.  This quickstart shows how to deploy your first ASP.NET web app to Azure Web Apps. When you're finished, you'll have a resource group that consists of an App Service plan and an Azure web app with a deployed web application.

![ASP.NET web app in Azure App Service](./media/app-service-web-get-started-dotnet/updated-azure-web-app.png)

## Prerequisites

To complete this tutorial:

* Install [Visual Studio 2017](https://www.visualstudio.com/en-us/visual-studio-homepage-vs.aspx) with the following workloads:
    - **ASP.NET and web development**
    - **Azure development**

    ![ASP.NET and web development and Azure development (under Web & Cloud)](media/app-service-web-tutorial-dotnet-sqldatabase/workloads.png)

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create an ASP.NET web app

In Visual Studio, create a project by selecting **File > New > Project**. 

In the **New Project** dialog, select **Visual C# > Web > ASP.NET Web Application (.NET Framework)**.

Name the application _myFirstAzureWebApp_, and then select **OK**.
   
![New Project dialog box](./media/app-service-web-get-started-dotnet/new-project.png)

You can deploy any type of ASP.NET web app to Azure. For this quickstart, select the **MVC** template, and make sure authentication is set to **No Authentication**.
      
Select **OK**.

![New ASP.NET Project dialog box](./media/app-service-web-get-started-dotnet/select-mvc-template.png)

From the menu, select **Debug > Start without Debugging** to run the web app locally.

![Run app locally](./media/app-service-web-get-started-dotnet/local-web-app.png)

## Publish to Azure

In the **Solution Explorer**, right-click the **myFirstAzureWebApp** project and select **Publish**.

![Publish from Solution Explorer](./media/app-service-web-get-started-dotnet/solution-explorer-publish.png)

Make sure that **Microsoft Azure App Service** is selected and select **Publish**.

![Publish from project overview page](./media/app-service-web-get-started-dotnet/publish-to-app-service.png)

This opens the **Create App Service** dialog, which helps you create all the necessary Azure resources to run the ASP.NET web app in Azure.

## Sign in to Azure

In the **Create App Service** dialog, select **Add an account**, and then sign in to your Azure subscription. If you're already signed in, make sure that the account has your Azure subscription. You can select the signed-in account to add the correct account.
   
![Sign in to Azure](./media/app-service-web-get-started-dotnet/sign-in-azure.png)

Once signed in, you're ready to create all the necessary resources for an Azure web app in this dialog.

## Create a resource group

[!INCLUDE [resource group intro text](../../includes/resource-group.md)]

Next to **Resource Group**, select **New**.

Name the resource group **myResourceGroup** and select **OK**.

## Create an App Service plan

[!INCLUDE [app-service-plan](../../includes/app-service-plan.md)]

Next to **App Service Plan**, select **New**. 

In the **Configure App Service Plan** dialog, use the settings in the table following the screenshot.

![Create App Service plan](./media/app-service-web-get-started-dotnet/configure-app-service-plan.png)

| Setting | Suggested Value | Description |
|-|-|-|
|App Service Plan| myAppServicePlan | Name of the App Service plan. |
| Location | West Europe | The datacenter where the web app is hosted. |
| Size | Free | [Pricing tier](https://azure.microsoft.com/pricing/details/app-service/) determines hosting features. |

Select **OK**.

## Create and publish the web app

In **Web App Name**, type a unique app name. The URL of the web app is `http://<app_name>.azurewebsites.net`. 

You can accept the automatically generated name, which is unique.

Select **Create** to start creating the Azure resources.

![Configure web app name](./media/app-service-web-get-started-dotnet/web-app-name.png)

Once the wizard completes, it publishes the ASP.NET web app to Azure, and then launches the app in the default browser.

![Published ASP.NET web app in Azure](./media/app-service-web-get-started-dotnet/published-azure-web-app.png)

The URL uses the web app name that you specified earlier, with the format `http://<app_name>.azurewebsites.net`. 

Congratulations, your ASP.NET web app is running live in Azure App Service.

## Update the app and redeploy

From the **Solution Explorer**, open _Views\Home\Index.cshtml_.

Find the `<div class="jumbotron">` HTML tag near the top, and replace the entire element with the following code:

```HTML
<div class="jumbotron">
    <h1>ASP.NET in Azure!</h1>
    <p class="lead">This is a simple app that we’ve built that demonstrates how to deploy a .NET app to Azure App Service.</p>
</div>
```

To redeploy to Azure, right-click the **myFirstAzureWebApp** project in **Solution Explorer** and select **Publish**.

In the publish page, select **Publish**.

When publishing completes, Visual Studio launches a browser to the URL of the web app.

![Updated ASP.NET web app in Azure](./media/app-service-web-get-started-dotnet/updated-azure-web-app.png)

## Manage the Azure web app

Go to the [Azure portal](https://portal.azure.com) to manage the web app.

From the left menu, select **App Services**, and then select the name of your Azure web app.

![Portal navigation to Azure web app](./media/app-service-web-get-started-dotnet/access-portal.png)

You see your web app's Overview page. Here, you can perform basic management tasks like browse, stop, start, restart, and delete. 

![App Service blade in Azure portal](./media/app-service-web-get-started-dotnet/web-app-blade.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [Clean-up section](../../includes/clean-up-section-portal.md)]

## Next steps

> [!div class="nextstepaction"]
> [ASP.NET with SQL Database](app-service-web-tutorial-dotnet-sqldatabase.md)

---
title: include file
description: include file
services: app-service
author: ggailey777
ms.service: app-service
ms.topic: include
ms.date: 02/19/2019
ms.author: glenga
ms.custom: include file
---
1. In **Solution Explorer**, right-click the project and select **Publish**.

1. In the **Publish** dialog, select **Microsoft Azure App Service**, choose **Create New**, and then select **Publish**.

   ![Pick publish target](./media/webjobs-publish-netcore/pick-publish-target.png)

1. In the **Create App Service** dialog, use the hosting settings as specified in the table below the image:

    ![Create App Service dialog](./media/webjobs-publish-netcore/app-service-dialog.png)

    | Setting      | Suggested value  | Description                                |
    | ------------ |  ------- | -------------------------------------------------- |
    | **App Name** | Globally unique name | Name that uniquely identifies your new function app. |
    | **Subscription** | Choose your subscription | The Azure subscription to use. |
    | **[Resource Group](../articles/azure-resource-manager/management/overview.md)** | myResourceGroup |  Name of the resource group in which to create your function app. Choose **New** to create a new resource group.|
    | **[Hosting Plan](../articles/app-service/overview-hosting-plans.md)** | App Service plan | An [App Service plan](../articles/app-service/overview-hosting-plans.md) specifies the location, size, and features of the web server farm that hosts your app. You can save money when hosting multiple apps by configuring the web apps to share a single App Service plan. App Service plans define the region, instance size, scale count, and SKU (Free, Shared, Basic, Standard, or Premium). Choose **New** to create a new App Service plan. |

1. Click **Create** to create a WebJob and related resources in Azure with these settings and deploy your project code.
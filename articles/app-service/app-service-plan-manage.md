---
title: Manage an App Service plan in Azure | Microsoft Docs
description: Learn how to App Service plans perform different tasks to manage an App Service plan.
keywords: app service, azure app service, scale, app service plan, change, create, manage, management
services: app-service
documentationcenter: ''
author: cephalin
manager: cfowler
editor: ''

ms.assetid: 4859d0d5-3e3c-40cc-96eb-f318b2c51a3d
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/09/2017
ms.author: cephalin

---
# Manage an App Service plan in Azure

An [App Service plan](azure-web-sites-web-hosting-plans-in-depth-overview.md) provides the resources an App Service app needs to run. This how-to guide shows how to manage an App Service plan. 

## Create an App Service plan

> [!TIP]
> If you have an App Service Environment, see [Create an App Service plan in an App Service Environment](environment/app-service-web-how-to-create-a-web-app-in-an-ase.md#createplan).

You can create an empty App Service plan or as part of app creation.

In the [Azure portal](https://portal.azure.com), click **New** > **Web + mobile**, and then select **Web App** or other App Service app kind.

![Create an app in the Azure portal.][createWebApp]

You can then select an existing App Service plan or create a plan for the new app.

 ![Create an App Service plan.][createASP]

To create an App Service plan, click **[+] Create New**, type the **App Service plan** name, and then select an appropriate **Location**. Click **Pricing tier**, and then select an appropriate pricing tier for the service. Select **View all** to view more pricing options, such as **Free** and **Shared**. 

After you have selected the pricing tier, click the **Select** button.

<a name="move"></a>

## Move an app to another App Service plan

You can move an app to another App Service plan as long as the source plan and the target plan are in the _same resource group and geographical region_.

To move an app to another plan, navigate to the app that you want to move in the [Azure portal](https://portal.azure.com).

In the **Menu**, look for the **App Service Plan** section.

Select **Change App Service plan** to start the process.

**Change App Service plan** opens the **App Service plan** selector. Select an existing plan to move this app into. Only plans in the same resource group and region are displayed. If you just created an App Service plan in the same resource group and region, but it is not displayed in the list, try refreshing your browser page.

![App Service plan selector.][change]

Each plan has its own pricing tier. For example, moving a site from a **Free** tier to a **Standard** tier, enables all apps assigned to it to use the features and resources of the **Standard** tier. However, moving an app from a higher tiered plan to a lower tiered plan means that you no longer have access to certain features. If your app uses a feature that is not available in the target plan, you get an error that shows which feature is in use that is not available. For example, if one of your apps uses SSL certificates, you might see the error message: `Cannot update the site with hostname '<app_name>' because its current SSL configuration 'SNI based SSL enabled' is not allowed in the target compute mode. Allowed SSL configuration is 'Disabled'.`In this case, you need to scale up the pricing tier of the target plan to **Basic** or higher, or you need to remove all SSL connections to your app, before you can move the app to the target plan.

## Move an app to a different region

The region in which your app runs is the region of the App Service plan it's in. However, you cannot change an App Service plan's region. If you want to run your app in a different region, one alternative is app cloning. Cloning makes a copy of your app in a new or existing App Service plan in any region.

You can find **Clone App** in the **Development Tools** section of the menu.

> [!IMPORTANT]
> Cloning has some limitations that you can read about at [Azure App Service App cloning](app-service-web-app-cloning.md).

## Scale an App Service plan

To scale up ah App Service plan's pricing tier, see [Scale up an app in Azure](web-sites-scale.md).

To scale out an app's instance count, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md).

<a name="delete"></a>

## Delete an App Service plan

To avoid unexpected charges, when you delete the last app in an App Service plan, App Service also deletes the plan by default. If choose to keep the plan instead, you should change the plan to **Free** tier so that you don't get charged.

> [!IMPORTANT]
> **App Service plans** that have no apps associated to them still incur charges since they continue to reserve the configured VM instances.

## Next steps

> [!div class="nextstepaction"]
> [Scale up an app in Azure](web-sites-scale.md)

[change]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png
[createASP]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png
[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png

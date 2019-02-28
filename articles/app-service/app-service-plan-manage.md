---
title: Manage App Service plan - Azure | Microsoft Docs
description: Learn how to perform different tasks to manage an App Service plan.
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
ms.custom: seodec18

---
# Manage an App Service plan in Azure

An [Azure App Service plan](overview-hosting-plans.md) provides the resources that an App Service app needs to run. This guide shows how to manage an App Service plan.

## Create an App Service plan

> [!TIP]
> If you have an App Service Environment, see [Create an App Service plan in an App Service Environment](environment/app-service-web-how-to-create-a-web-app-in-an-ase.md#createplan).

You can create an empty App Service plan, or you can create a plan as part of app creation.

1. In the [Azure portal](https://portal.azure.com), select **New** > **Web + mobile**, and then select **Web App** or another kind of App Service app.

2. Select an existing App Service plan or create a plan for the new app.

   ![Create an app in the Azure portal.][createWebApp]

   To create a plan:

   a. Select **[+] Create New**.

      ![Create an App Service plan.][createASP] 

   b. For **App Service plan**, enter the name of the plan.

   c. For **Location**, select an appropriate location.

   d. For **Pricing tier**, select an appropriate pricing tier for the service. Select **View all** to view more pricing options, such as **Free** and **Shared**. After you have selected the pricing tier, click the **Select** button.

<a name="move"></a>

## Move an app to another App Service plan

You can move an app to another App Service plan, as long as the source plan and the target plan are in the _same resource group and geographical region_.

> [!NOTE]
> Azure deploys each new App Service plan into a deployment unit, internally called a webspace. Each region can have many webspaces, but your app can only move between plans that are created in the same webspace. An App Service Environment is an isolated webspace, so apps can be moved between plans in the same App Service Environment, but not between plans in different App Service Environments.
>
> You can’t specify the webspace you want when creating a plan, but it’s possible to ensure that a plan is created in the same webspace as an existing plan. In brief, all plans created with the same resource group and region combination are deployed into the same webspace. For example, if you created a plan in resource group A and region B, then any plan you subsequently create in resource group A and region B is deployed into the same webspace. Note that plans can’t move webspaces after they’re created, so you can’t move a plan into “the same webspace” as another plan by moving it to another resource group.
> 

1. In the [Azure portal](https://portal.azure.com), browse to the app that you want to move.

1. On the menu, look for the **App Service Plan** section.

1. Select **Change App Service plan** to open the **App Service plan** selector.

   ![App Service plan selector.][change] 

1. In the **App Service plan** selector, select an existing plan to move this app into.   

The **Select App Service plan** page shows only plans that are in the same resource group and geographical region as the current app's App Service plan.

Each plan has its own pricing tier. For example, moving a site from a **Free** tier to a **Standard** tier enables all apps assigned to it to use the features and resources of the **Standard** tier. However, moving an app from a higher-tiered plan to a lower-tiered plan means that you no longer have access to certain features. If your app uses a feature that is not available in the target plan, you get an error that shows which feature is in use that is not available. 

For example, if one of your apps uses SSL certificates, you might see this error message:

`Cannot update the site with hostname '<app_name>' because its current SSL configuration 'SNI based SSL enabled' is not allowed in the target compute mode. Allowed SSL configuration is 'Disabled'.`

In this case, before you can move the app to the target plan, you need to either:
- Scale up the pricing tier of the target plan to **Basic** or higher.
- Remove all SSL connections to your app.

## Move an app to a different region

The region in which your app runs is the region of the App Service plan it's in. However, you cannot change an App Service plan's region. If you want to run your app in a different region, one alternative is app cloning. Cloning makes a copy of your app in a new or existing App Service plan in any region.

You can find **Clone App** in the **Development Tools** section of the menu.

> [!IMPORTANT]
> Cloning has some limitations. You can read about them in [Azure App Service App cloning](app-service-web-app-cloning.md).

## Scale an App Service plan

To scale up an App Service plan's pricing tier, see [Scale up an app in Azure](web-sites-scale.md).

To scale out an app's instance count, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md).

<a name="delete"></a>

## Delete an App Service plan

To avoid unexpected charges, when you delete the last app in an App Service plan, App Service also deletes the plan by default. If you choose to keep the plan instead, you should change the plan to **Free** tier so you're not charged.

> [!IMPORTANT]
> App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

## Next steps

> [!div class="nextstepaction"]
> [Scale up an app in Azure](web-sites-scale.md)

[change]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png
[createASP]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png
[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png

---
title: Manage App Service plan
description: Learn how to perform different tasks to manage an App Service plan, such as create, move, scale, and delete.
keywords: app service, azure app service, scale, app service plan, change, create, manage, management
ms.assetid: 4859d0d5-3e3c-40cc-96eb-f318b2c51a3d
ms.topic: article
ms.date: 10/24/2019
ms.custom: seodec18

---
# Manage an App Service plan in Azure

An [Azure App Service plan](overview-hosting-plans.md) provides the resources that an App Service app needs to run. This guide shows how to manage an App Service plan.

## Create an App Service plan

> [!TIP]
> If you have an App Service Environment, see [Create an App Service plan in an App Service Environment](environment/app-service-web-how-to-create-a-web-app-in-an-ase.md#createplan).

You can create an empty App Service plan, or you can create a plan as part of app creation.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.

   ![Create a resource in the Azure portal.][createResource] 

1. Select **New** > **Web App** or another kind of App service app.

   ![Create an app in the Azure portal.][createWebApp] 

2. Configure the **Instance Details** section before configuring the App Service plan. Settings such as **Publish** and **Operating Systems** can change the available pricing tiers for your App Service plan. **Region** determines where your App Service plan is created. 
   
3. In the **App Service Plan** section, select an existing plan, or create a plan by selecting **Create new**.

   ![Create an App Service plan.][createASP] 

4. When creating a plan, you can select the pricing tier of the new plan. In **Sku and size**, select **Change size** to change the pricing tier. 

<a name="move"></a>

## Move an app to another App Service plan

You can move an app to another App Service plan, as long as the source plan and the target plan are in the _same resource group and geographical region_.

> [!NOTE]
> Azure deploys each new App Service plan into a deployment unit, internally called a webspace. Each region can have many webspaces, but your app can only move between plans that are created in the same webspace. An App Service Environment is an isolated webspace, so apps can be moved between plans in the same App Service Environment, but not between plans in different App Service Environments.
>
> You can’t specify the webspace you want when creating a plan, but it’s possible to ensure that a plan is created in the same webspace as an existing plan. In brief, all plans created with the same resource group and region combination are deployed into the same webspace. For example, if you created a plan in resource group A and region B, then any plan you subsequently create in resource group A and region B is deployed into the same webspace. Note that plans can’t move webspaces after they’re created, so you can’t move a plan into “the same webspace” as another plan by moving it to another resource group.
> 

1. In the [Azure portal](https://portal.azure.com), search for and select **App services** and select the app that you want to move.

2. From the left menu, select **Change App Service plan**.

3. In the **App Service plan** dropdown, select an existing plan to move the app to. The dropdown shows only plans that are in the same resource group and geographical region as the current App Service plan. If no such plan exists, it lets you create a plan by default. You can also create a new plan manually by selecting **Create new**.

4. If you create a plan, you can select the pricing tier of the new plan. In **Pricing Tier**, select the existing tier to change it. 
   
   > [!IMPORTANT]
   > If you're moving an app from a higher-tiered plan to a lower-tiered plan, such as from **D1** to **F1**, the app may lose certain capabilities in the target plan. For example, if your app uses TLS/SSL certificates, you might see this error message:
   >
   > `Cannot update the site with hostname '<app_name>' because its current SSL configuration 'SNI based SSL enabled' is not allowed in the target compute mode. Allowed SSL configuration is 'Disabled'.`

5. When finished, select **OK**.
   
   ![App Service plan selector.][change] 

## Move an app to a different region

The region in which your app runs is the region of the App Service plan it's in. However, you cannot change an App Service plan's region. If you want to run your app in a different region, one alternative is app cloning. Cloning makes a copy of your app in a new or existing App Service plan in any region.

You can find **Clone App** in the **Development Tools** section of the menu.

> [!IMPORTANT]
> Cloning has some limitations. You can read about them in [Azure App Service App cloning](app-service-web-app-cloning.md).

## Scale an App Service plan

To scale up an App Service plan's pricing tier, see [Scale up an app in Azure](manage-scale-up.md).

To scale out an app's instance count, see [Scale instance count manually or automatically](../monitoring-and-diagnostics/insights-how-to-scale.md).

<a name="delete"></a>

## Delete an App Service plan

To avoid unexpected charges, when you delete the last app in an App Service plan, App Service also deletes the plan by default. If you choose to keep the plan instead, you should change the plan to **Free** tier so you're not charged.

> [!IMPORTANT]
> App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

## Next steps

> [!div class="nextstepaction"]
> [Scale up an app in Azure](manage-scale-up.md)

[change]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png
[createASP]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png
[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png
[createResource]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-a-resource.png

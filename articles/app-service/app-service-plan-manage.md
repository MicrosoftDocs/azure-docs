---
title: Manage App Service plan
description: Learn how to perform different tasks to manage an App Service plan, such as create, move, scale, and delete.
keywords: app service, azure app service, scale, app service plan, change, create, manage, management
ms.assetid: 4859d0d5-3e3c-40cc-96eb-f318b2c51a3d
ms.topic: article
ms.author: msangapu
ms.date: 07/31/2023
ms.custom: "UpdateFrequency3"

---
# Manage an App Service plan in Azure

An [Azure App Service plan](overview-hosting-plans.md) provides the resources that an App Service app needs to run. This guide shows how to manage an App Service plan.

## Create an App Service plan

> [!TIP]
> If you want to create a plan in an App Service Environment, you can select it in the **Region** and follow the rest of the steps as described below.

You can create an empty App Service plan, or you can create a plan as part of app creation.

1. To start creating an App Service Plan, browse to [https://ms.portal.azure.com/#create/Microsoft.AppServicePlanCreate](https://ms.portal.azure.com/#create/Microsoft.AppServicePlanCreate).

   :::image type="content" source="./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png" alt-text="Create an App Service Plan in the Azure portal.":::

2. Configure the **Project Details** section before configuring the App Service plan. 
  
3. In the **App Service Plan details** section, name the App Service Plan, then select the **Operating System** and **Region**. Region determines where your App Service plan is created.

4. When creating a plan, you can select the pricing tier of the new plan. In **Pricing Tier**, select a **Pricing plan** or select **Explore pricing plans** to view additional details. 

5. In the **Zone redundancy** section, select whether the App Service Plan zone redundancy should be enabled or disabled.

6. Select **Review + create** to create the App Service Plan.

> [!IMPORTANT]
> When creating an new App Service Plan in an existing Resource Group, certain conditions with existing apps can trigger these errors:
> - `The pricing tier is not allowed in this resource group`
> - `<SKU_NAME> workers are not available in resource group <RESOURCE_GROUP_NAME>`
> 
> This can happen due to incompatibilities with pricing tiers, regions, operating systems, Availability Zones, existing Function apps, or existing web apps. If this error occurs, create your App Service Plan in a **new** Resource Group.
>


<a name="move"></a>

## Move an app to another App Service plan

You can move an app to another App Service plan, as long as the source plan and the target plan are in the _same resource group, geographical region, and of the same OS type_. Any change in type such as Windows to Linux or any type that is different from the originating type is not supported.


> [!NOTE]
> Azure deploys each new App Service plan into a deployment unit, internally called a webspace. Each region can have many webspaces, but your app can only move between plans that are created in the same webspace. An App Service Environment can have multiple webspaces, but your app can only move between plans that are created in the same webspace.
>
> You can’t specify the webspace you want when creating a plan, but it’s possible to ensure that a plan is created in the same webspace as an existing plan. In brief, all plans created with the same resource group, region combination and operating system are deployed into the same webspace. For example, if you created a plan in resource group A and region B, then any plan you subsequently create in resource group A and region B is deployed into the same webspace. Note that plans can’t move webspaces after they’re created, so you can’t move a plan into “the same webspace” as another plan by moving it to another resource group.
> 

1. In the [Azure portal](https://portal.azure.com), search for and select **App services** and select the app that you want to move.

2. From the left menu, under **App Service Plan**, select **Change App Service plan**.

    :::image type="content" source="./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png" alt-text="Screenshot of App Service Plan selector.":::

3. In the **App Service plan** dropdown, select an existing plan to move the app to. The dropdown shows only plans that are in the same resource group and geographical region as the current App Service plan. If no such plan exists, it lets you create a plan by default. You can also create a new plan manually by selecting **Create new**.

4. If you create a plan, you can select the pricing tier of the new plan. In **Pricing Tier**, select the existing tier to change it. 
   
   > [!IMPORTANT]
   > If you're moving an app from a higher-tiered plan to a lower-tiered plan, such as from **D1** to **F1**, the app may lose certain capabilities in the target plan. For example, if your app uses TLS/SSL certificates, you might see this error message:
   >
   > `Cannot update the site with hostname '<app_name>' because its current TLS/SSL configuration 'SNI based SSL enabled' is not allowed in the target compute mode. Allowed TLS/SSL configuration is 'Disabled'.`
   >

5. When finished, select **OK**.

## Move an app to a different region

The region in which your app runs is the region of the App Service plan it's in. However, you cannot change an App Service plan's region. If you want to run your app in a different region, one alternative is app cloning. Cloning makes a copy of your app in a new or existing App Service plan in any region.

You can find **Clone App** in the **Development Tools** section of the menu.

> [!IMPORTANT]
> Cloning has some limitations. You can read about them in [Azure App Service App cloning](app-service-web-app-cloning.md).

## Scale an App Service plan

To scale up an App Service plan's pricing tier, see [Scale up an app in Azure](manage-scale-up.md).

To scale out an app's instance count, see [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md).

<a name="delete"></a>

## Delete an App Service plan

To avoid unexpected charges, when you delete the last app in an App Service plan, App Service also deletes the plan by default. If you choose to keep the plan instead, you should change the plan to **Free** tier so you're not charged.

> [!IMPORTANT]
> App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

## Next steps

> [!div class="nextstepaction"]
> [Scale up an app in Azure](manage-scale-up.md)

[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png
[createResource]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-a-resource.png

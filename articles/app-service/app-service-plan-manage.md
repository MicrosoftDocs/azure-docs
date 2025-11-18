---
title: Manage an App Service Plan
description: Learn how to perform different tasks to manage an App Service plan, such as create, move, scale, and delete.
keywords: app service, azure app service, scale, app service plan, change, create, manage, management
ms.assetid: 4859d0d5-3e3c-40cc-96eb-f318b2c51a3d
ms.topic: how-to
ms.author: msangapu
author: msangapu-msft
ms.date: 11/17/2025
ms.update-cycle: 1095-days
ms.custom: "UpdateFrequency3"

ms.service: azure-app-service
---
# Manage an App Service plan in Azure

An [Azure App Service plan](overview-hosting-plans.md) provides the resources that an App Service app needs to run. This article describes how to manage an App Service plan.

## Create an App Service plan

> [!TIP]
> If you want to create a plan in an App Service Environment, you can select it in the **Region** list and follow the rest of the steps as described in this section.

You can create an empty App Service plan, or you can create a plan as part of app creation.

1. To start creating an App Service plan, go to [Create App Service Plan](https://ms.portal.azure.com/#create/Microsoft.AppServicePlanCreate) in the Azure portal.

   :::image type="content" source="./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-appserviceplan.png" alt-text="Screenshot that shows the Create App Service Plan page in the Azure portal.":::

1. Configure the **Project Details** section before configuring the App Service plan. 
  
1. In the **App Service Plan details** section, name the App Service plan, and then select the **Operating System** and **Region**. The region specifies where your App Service plan is created.

1. When you create a plan, you can select the pricing tier of the new plan. In **Pricing Tier**, select a **Pricing plan**, or select **Explore pricing plans** to view additional details. 

1. In the **Zone redundancy** section, select **Enabled** or **Disabled**, depending on your needs.

1. Select **Review + create**, and then select **Create**.

> [!IMPORTANT]
> When you create a new App Service plan in an existing resource group, certain conditions with existing apps can trigger these errors:
> - `The pricing tier is not allowed in this resource group`
> - `<SKU_NAME> workers are not available in resource group <RESOURCE_GROUP_NAME>`
> 
> These errors can occur due to incompatibilities with pricing tiers, regions, operating systems, availability zones, existing function apps, or existing web apps. If one of these errors occurs, create your App Service plan in a new resource group.
>


<a name="move"></a>

## Move an app to another App Service plan

You can move an app to another App Service plan, as long as the source plan and the target plan are in the same resource group and geographical region and of the same OS type. Any change in type, such as Windows to Linux or any type that's different from the originating type, isn't supported. 

You must disable any virtual network integration that's configured on the app before you change App Service plans. 


> [!NOTE]
> Azure deploys each new App Service plan into a deployment unit, internally called a *webspace*. Each region can have many webspaces, but your app can only move between plans that are created in the same webspace. An App Service Environment can have multiple webspaces, but your app can only move between plans that are created in the same webspace.
>
> You can't specify the webspace you want when you create a plan, but it's possible to ensure that a plan is created in the same webspace as an existing plan. All plans created with the same resource group, region combination, and operating system are deployed into the same webspace. For example, if you created a plan in resource group A and region B, any plan you subsequently create in resource group A and region B is deployed into the same webspace. Note that plans can't move webspaces after they're created, so you can't move a plan into "the same webspace" as another plan by moving it to another resource group.
> 

1. In the [Azure portal](https://portal.azure.com), search for and select **App services**, and then select the app that you want to move.

1. In the left pane, under **App Service Plan**, select **App Service plan**.

1. On the **App Service plan** page, select **Change plan**.

    :::image type="content" source="./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png" alt-text="Screenshot of the App Service plan page." lightbox="./media/azure-web-sites-web-hosting-plans-in-depth-overview/change-appserviceplan.png":::

1. In the **Change App Service plan** pane, in the **App Service plan** list, select an existing plan to move the app to. The list shows only plans that are in the same resource group and geographical region as the current App Service plan. If no such plan exists, it lets you create a plan by default. You can also create a new plan manually by selecting **New plan** and then selecting **Create new**.

1. When you're done, select **Save**. 

If you create a new plan, you can change its pricing tier. For more information, see the [Scale an App Service plan](#scale-an-app-service-plan) section later in this article. 
   
   > [!IMPORTANT]
   > If you move an app from a higher-tiered plan to a lower-tiered plan, such as from **D1** to **F1**, the app might lose certain capabilities in the target plan. For example, if your app uses TLS/SSL certificates, you might see this error message:
   >
   > `Cannot update the site with hostname '<app_name>' because its current TLS/SSL configuration 'SNI based SSL enabled' is not allowed in the target compute mode. Allowed TLS/SSL configuration is 'Disabled'.`
   >

## Move an app to a different region

The region in which your app runs is the region of the App Service plan that it's in. However, you can't change the region of an App Service plan. If you want to run your app in a different region, one alternative is app cloning. Cloning makes a copy of your app in a new or existing App Service plan in any region.

You can find **Clone App** in the **Development Tools** section of the left pane.

> [!IMPORTANT]
> Cloning has some limitations. You can read about them in [Azure App Service App cloning](app-service-web-app-cloning.md#current-restrictions).

## Scale an App Service plan

For information about scaling up the pricing tier of an App Service plan, see [Scale up an app in Azure](manage-scale-up.md).

For information about scaling out an app's instance count, see [Scale instance count manually or automatically](/azure/azure-monitor/autoscale/autoscale-get-started).

## Scale an App Service Plan Asynchronously (Preview)

When creating or manually scaling out an App Service Plan you may experience situations where you're advised to retry with lower instance counts than you originally requested, for example potentially you have asked to scale out to 15 instances but are told only 6 are available, so you must scale to 6 then wait and retry to get to your target 15 instances.

The preview of App Service Plan Asynchronous enables you to request your target number of instances and the platform scales out to the target number, without you having to modify your original request and retrying. The platform scales to the number of available instances and then triggers the underlying platform to make more instances available. You can make use of this functionality during scale-out operations or at plan creation time.  This functionality is supported for all Basic, Standard, and Premium pricing plans.

### [Scale-out (CLI)](#tab/asyncscaleout)
```azurecli-interactive
az appservice plan update -g <resourceGroupName> -n <App Service Plan Name> --async-scaling-enabled true --number-of-workers <number of workers to scale out to>
```

### [Create (CLI)](#tab/asynccreate)
```azurecli-interactive
az appservice plan create -g asyncasp -n asyncasplinuxexample --number-of-workers 25 --sku p1v3 --async-scaling-enabled true --location northeurope
```

---

<a name="delete"></a>

## Delete an App Service plan

To avoid unexpected charges, when you delete the last app in an App Service plan, by default, App Service also deletes the plan. If you choose to keep the plan, you should change the plan to the **Free** tier so that you're not charged.

> [!IMPORTANT]
> App Service plans that have no apps associated with them still incur charges because they continue to reserve the configured VM instances.

## Next step

> [!div class="nextstepaction"]
> [Scale up an app in Azure](manage-scale-up.md)

[createWebApp]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-web-app.png
[createResource]: ./media/azure-web-sites-web-hosting-plans-in-depth-overview/create-a-resource.png

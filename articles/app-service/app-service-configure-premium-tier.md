---
title: Configure Premium V3 tier
description: Learn how to better performance for your web, mobile, and API app in Azure App Service by scaling to the new Premium V3 pricing tier.
keywords: app service, azure app service, scale, scalable, app service plan, app service cost
ms.assetid: ff00902b-9858-4bee-ab95-d3406018c688
ms.topic: article
ms.date: 05/08/2023
ms.author: msangapu
ms.custom: seodec18, devx-track-azurecli, devx-track-azurepowershell

---

# Configure Premium V3 tier for Azure App Service

The new Premium V3 pricing tier gives you faster processors, SSD storage, and quadruple the memory-to-core ratio of the existing pricing tiers (double the Premium V2 tier). With the performance advantage, you could save money by running your apps on fewer instances. In this article, you learn how to create an app in Premium V3 tier or scale up an app to Premium V3 tier.

## Prerequisites

To scale-up an app to Premium V3, you need to have an Azure App Service app that runs in a pricing tier lower than Premium V3, and the app must be running in an App Service deployment that supports Premium V3.

<a name="availability"></a>

## Premium V3 availability

The Premium V3 tier is available for both native and custom containers, including both Windows containers and Linux containers.

Premium V3 is available in some Azure regions and availability in additional regions is being added continually. To see if it's available in your region, run the following Azure CLI command in the [Azure Cloud Shell](../cloud-shell/overview.md):

```azurecli-interactive
az appservice list-locations --sku P1V3
```

<a name="create"></a>

## Create an app in Premium V3 tier

The pricing tier of an App Service app is defined in the [App Service plan](overview-hosting-plans.md) that it runs on. You can create an App Service plan by itself or create it as part of app creation.

When configuring the new App Service plan in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, select **Pricing plan** and pick one of the **Premium V3** tiers.

To see all the Premium V3 options, select **Explore pricing plans**, then select one of the Premium V3 plans and select **Select**.

:::image type="content" source="media/app-service-configure-premium-tier/explore-pricing-plans.png" alt-text="Screenshot showing the Explore pricing plans page with a Premium V3 plan selected.":::

> [!IMPORTANT] 
> If you don't see a Premium V3 plan as an option, or if the options are greyed out, then Premium V3 likely isn't available in the underlying App Service deployment that contains the App Service plan. See [Scale up from an unsupported resource group and region combination](#unsupported) for more details.

## Scale up an existing app to Premium V3 tier

Before scaling an existing app to Premium V3 tier, make sure that Premium V3 is available. For information, see [Premium V3 availability](#availability). If it's not available, see [Scale up from an unsupported resource group and region combination](#unsupported).

Depending on your hosting environment, scaling up may require extra steps. 

In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, open your App Service app page.

In the left navigation of your App Service app page, select **Scale up (App Service plan)**.

![Screenshot showing how to scale up your app service plan.](media/app-service-configure-premium-tier/scale-up-tier-portal.png)

Select one of the Premium V3 plans and select **Select**.

:::image type="content" source="media/app-service-configure-premium-tier/explore-pricing-plans.png" alt-text="Screenshot showing the Explore pricing plans page with a Premium V3 plan selected.":::

If your operation finishes successfully, your app's overview page shows that it's now in a Premium V3 tier.

![Screenshot showing the Premium V3 pricing tier on your app's overview page.](media/app-service-configure-premium-tier/finished.png)

### If you get an error

Some App Service plans can't scale up to the Premium V3 tier, or to a newer SKU within Premium V3, if the underlying App Service deployment doesn’t support the requested Premium V3 SKU. See [Scale up from an unsupported resource group and region combination](#unsupported) for more details.

<a name="unsupported"></a>

## Scale up from an unsupported resource group and region combination

If your app runs in an App Service deployment where Premium V3 isn't available, or if your app runs in a region that currently does not support Premium V3, you need to re-deploy your app to take advantage of Premium V3.  You have two options:

- Create an app in a new resource group and with a new App Service plan. When creating the App Service plan, select a Premium V3 tier. This step ensures that the App Service plan is deployed into a deployment unit that supports Premium V3. Then, redeploy your application code into the newly created app. Even if you scale the App Service plan down to a lower tier to save costs, you can always scale back up to Premium V3 because the deployment unit supports it.
- If your app already runs in an existing **Premium** tier, then you can clone your app with all app settings, connection strings, and deployment configuration into a new resource group on a new app service plan that uses Premium V3.

    ![Screenshot showing how to clone your app.](media/app-service-configure-premium-tier/clone-app.png)

    In the **Clone app** page, you can create an App Service plan using Premium V3 in the region you want, and specify the app settings and configuration that you want to clone.
 
## Automate with scripts

You can automate app creation in the Premium V3 tier with scripts, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

### Azure CLI

The following command creates an App Service plan in _P1V3_. You can run it in the Cloud Shell. The options for `--sku` are _P0V3_, _P1V3_, _P2V3_, _P3V3_, _P1mV3_, _P2mV3_, _P3mV3_, _P4mV3_, and _P5mV3_.

```azurecli-interactive
az appservice plan create \
    --resource-group <resource_group_name> \
    --name <app_service_plan_name> \
    --sku P1V3
```

### Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The following command creates an App Service plan in _P1V3_. The options for `-WorkerSize` are _Small_, _Medium_, and _Large_.

```powershell
New-AzAppServicePlan -ResourceGroupName <resource_group_name> `
    -Name <app_service_plan_name> `
    -Location <region_name> `
    -Tier "Premium V3" `
    -WorkerSize "Small"
```

## More resources

* [Scale up an app in Azure](manage-scale-up.md)
* [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md)
* [Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)

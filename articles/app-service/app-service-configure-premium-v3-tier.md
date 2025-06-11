---
title: Configure Premium V3 tier
description: Learn how to better performance for your web, mobile, and API app in Azure App Service by scaling to the new Premium V3 pricing tier.
keywords: app service, azure app service, scale, scalable, app service plan, app service cost
ms.assetid: ff00902b-9858-4bee-ab95-d3406018c688
ms.topic: article
ms.date: 02/21/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: devx-track-azurecli, devx-track-azurepowershell
#customer intent: As a deployment engineer, I want to understand the process and the benefits of scaling up apps to the Premium V3 pricing tier in Azure App Service.
---

# Configure Premium V3 tier for Azure App Service

The new Premium V3 pricing tier gives you faster processors, SSD storage, and memory-optimized options. It offers to quadruple the memory-to-core ratio of the existing pricing tiers. The memory-to-core ratio is double the Premium V2 tier. With the performance advantage, you could save money by running your apps on fewer instances. In this article, you learn how to create an app in Premium V3 tier or scale up an app to Premium V3 tier.

## Prerequisites

To scale-up an app to Premium V3:

- An Azure App Service app that runs in a pricing tier lower than Premium V3.
- The app must run in an App Service deployment that supports Premium V3.
- The App Service deployment must support the desired SKU in Premium V3.

<a name="availability"></a>

## Premium V3 availability

The Premium V3 tier is available for both native and custom containers, including both Windows containers and Linux containers.

Premium V3 and specific Premium V3 SKUs are available in some Azure regions. Microsoft is adding availability in other regions continually. To see if a specific PremiumV3 offering is available in your region, run the following Azure CLI command in the [Azure Cloud Shell](../cloud-shell/overview.md). Substitute *P1v3* with the desired SKU:

**Windows** SKU availability

```azurecli-interactive
az appservice list-locations --sku P1V3
```
**Linux** SKU availability

```azurecli-interactive
az appservice list-locations --linux-workers-enabled --sku P1V3
```

<a name="create"></a>

## Create an app in Premium V3 tier

The pricing tier of an App Service app is defined in the [App Service plan](overview-hosting-plans.md) that it runs on. You can create an App Service plan by itself or create it as part of app creation.

When you configure the new App Service plan in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, select **Pricing plan** and choose one of the **Premium V3** tiers.

To see all the Premium V3 options, select **Explore pricing plans**, then select one of the Premium V3 plans and select **Select**.

:::image type="content" source="media/app-service-configure-premium-tier/explore-pricing-plans.png" alt-text="Screenshot showing the Explore pricing plans page with a Premium V3 plan selected.":::

> [!IMPORTANT]
> You might not see **P0V3**, **P1V3**, **P2V3**, **P3V3**, **P1mV3**, **P2mV3**, **P3mV3**, **P4mV3**, and **P5mV3** as options or some options might be grayed out. If so, either **Premium V3** or an individual SKU in **Premium V3** isn't available in the underlying App Service deployment. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

## Scale up an existing app to Premium V3 tier

Before you scale an existing app to Premium V3 tier, make sure that both Premium V3 and the specific SKU in Premium V3 are available. For more information, see [PremiumV3 availability](#availability). If it's not available, see [Scale up from an unsupported resource group and region combination](#unsupported).

Depending on your hosting environment, scaling up can require extra steps.

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, open your App Service app page.

1. In the left navigation of your App Service app page, select **Settings** > **Scale up (App Service plan)**.

   :::image type="content" source="media/app-service-configure-premium-tier/scale-up-tier-portal.png" alt-text="Screenshot showing how to scale up your app service plan.":::

1. Select one of the Premium V3 plans and select **Select**.

   :::image type="content" source="media/app-service-configure-premium-tier/explore-pricing-plans.png" alt-text="Screenshot showing the Explore pricing plans page with a Premium V3 plan selected.":::

   If your operation finishes successfully, your app's overview page shows that it's now in a Premium V3 tier.

   :::image type="content" source="media/app-service-configure-premium-tier/finished.png" alt-text="Screenshot showing the Premium V3 pricing tier on your app's overview page.":::

### If you get an error

If the underlying App Service deployment doesn't support the requested Premium V3 SKU, some App Service plans can't scale up to the Premium V3 tier, or to a newer SKU in Premium V3. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

<a name="unsupported"></a>

## Scale up from an unsupported resource group and region combination

If your app runs in an App Service deployment where Premium V3 isn't available or in a region that doesn't support Premium V3, redeploy your app to take advantage of Premium V3. If newer Premium V3 SKUs aren't available, you also need to redeploy your app to use newer SKUs in Premium V3. You have two options:

- Create an app in a new resource group and with a new App Service plan.

  When creating the App Service plan, select the desired Premium V3 tier. This step ensures that the App Service plan is deployed into a deployment unit that supports Premium V3 and the specific SKU in Premium V3. Then, redeploy your application code into the newly created app. Even if you scale the new App Service plan down to a lower tier to save costs, you can always scale up again to Premium V3 and the desired SKU in Premium V3 because the deployment unit supports it.

- In the **Development tools** > **Clone app** page, you can create an App Service plan using Premium V3 in the region you want, and specify the app settings and configuration that you want to clone.

  :::image type="content" source="media/app-service-configure-premium-tier/clone-app.png" alt-text="Screenshot showing how to clone your app.":::

## Automate with scripts

You can automate app creation in the Premium V3 tier with scripts, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

### Azure CLI

The following command creates an App Service plan in *P1V3*. You can run it in the Cloud Shell. The options for `--sku` are *P0V3*, *P1V3*, *P2V3*, *P3V3*, *P1mV3*, *P2mV3*, *P3mV3*, *P4mV3*, and *P5mV3*.

```azurecli
az appservice plan create \
    --resource-group <resource_group_name> \
    --name <app_service_plan_name> \
    --sku P1V3
```

### Azure PowerShell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

The following command creates an App Service plan in _P1V3_. The options for `-WorkerSize` are *Small*, *Medium*, and *Large*.

```powershell
New-AzAppServicePlan -ResourceGroupName <resource_group_name> `
    -Name <app_service_plan_name> `
    -Location <region_name> `
    -Tier "Premium V3" `
    -WorkerSize "Small"
```

## Related content

- [Scale up an app in Azure App Service](manage-scale-up.md)
- [Get started with autoscale in Azure](/azure/azure-monitor/autoscale/autoscale-get-started)
- [Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)

---
title: Configure Premium V4 tier
description: Learn how to better performance for your web, mobile, and API app in Azure App Service by scaling to the new Premium V4 pricing tier.
keywords: app service, azure app service, scale, scalable, app service plan, app service cost
ms.assetid: ff00902b-9858-4bee-ab95-d3406018c688
ms.topic: article
ms.date: 02/21/2025
ms.author: msangapu
author: msangapu-msft
ms.custom: devx-track-azurecli, devx-track-azurepowershell
#customer intent: As a deployment engineer, I want to understand the process and the benefits of scaling up apps to the Premium V4 pricing tier in Azure App Service.
---

# Configure Premium V4 tier for Azure App Service

The new Premium V4 pricing tier gives you faster processors, NVMe local storage, and memory-optimized options. It offers up to double the memory-to-core ratio of older pricing tiers. With the performance advantage, you could save money by running your apps on fewer instances. In this article, you learn how to create an app in Premium V4 tier or scale up an app to Premium V4 tier.

## Prerequisites

To scale-up an app to Premium V4:

- An Azure App Service app that runs in a pricing tier lower than Premium V4.
- The app must run in an App Service deployment that supports Premium V4.

<a name="availability"></a>

## Premium V4 availability

The Premium V4 tier is available for source code based applications on Windows, and both source code based applications and custom containers on Linux.  The Premium V4 tier is not available for Windows containers.

> [!NOTE]
> The Premium V4 tier does not provide a stable set of outbound IP addresses.  This behavior is intentional.  Although applications running on the Premium V4 tier can make outbound calls to internet-facing endpoints, the App Service platform does not provide a stable set of outbound IP addresses for the Premium V4 tier.  This is a change in behavior from previous App Service pricing tiers.  The portal will show "Dynamic" for "Outbound IP addresses" and "Additional Outbound IP addresses" information for applications using Premium V4.  ARM and CLI calls will return empty strings for the values of *outboundIpAddresses* and *possibleOutboundIpAddresses*.  If applications running on Premium V4 require a stable outbound IP address(es), developers will need to use a solution like [Azure NAT Gateway](https://learn.microsoft.com/azure/app-service/overview-nat-gateway-integration) to get a predictable IP address for outbound internet-facing traffic.

Premium V4 and specific Premium V4 SKUs are available in some Azure regions. Microsoft is adding availability in other regions continually. To see if a specific PremiumV4 offering is available in your region, run the following Azure CLI command in the [Azure Cloud Shell](../cloud-shell/overview.md). Substitute *P1V4* with the desired SKU:

**Windows** SKU availability

```azurecli-interactive
az appservice list-locations --sku P1V4
```
**Linux** SKU availability

```azurecli-interactive
az appservice list-locations --linux-workers-enabled --sku P1V4
```

<a name="create"></a>

## Create an app in Premium V4 tier

The pricing tier of an App Service app is defined in the [App Service plan](overview-hosting-plans.md) that it runs on. You can create an App Service plan by itself or create it as part of app creation.

When you configure the new App Service plan in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, select **Pricing plan** and choose one of the **Premium V4** tiers.

To see all the Premium V4 options, select **Explore pricing plans**, then select one of the Premium V4 plans and select **Select**.

:::image type="content" source="media/app-service-configure-premium-tier/explore-pricing-plans-TBD.png" alt-text="Screenshot showing the Explore pricing plans page with a Premium V4 plan selected.":::

> [!IMPORTANT]
> You might not see **P0V4**, **P1V4**, **P2V4**, **P3V4**, **P1mV4**, **P2mV4**, **P3mV4**, **P4mV4**, and **P5mV4** as options or some options might be grayed out. If so, **Premium V4** isn't available in the underlying App Service deployment. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

## Scaling out an app service plan on the Premium V4 tier

Although Premium V4 is fully integrated with auto-scale, during the public preview of Premium V4 is recommended to limit individual scale-out requests to low single digits (two or less instances for each synchronous scale out operation).  For scale-out scenarios with higher target counts, developers should iterate though incremental requests to reach the desired target count.  For example, if an additional ten instances are desired, loop through five separate scale-out requests of two instances each until all five scale-out requests succeed.  If an individual scale-out request fails, wait five minutes and then re-attempt the failed scale-out request.

## Scale up an existing app to Premium V4 tier

Before you scale up an existing app to Premium V4 tier, make sure that Premium V4 is available. For more information, see [PremiumV4 availability](#availability). If it's not available, see [Scale up from an unsupported resource group and region combination](#unsupported).

Depending on your hosting environment, scaling up can require extra steps.

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, open your App Service app page.

1. In the left navigation of your App Service app page, select **Settings** > **Scale up (App Service plan)**.

   :::image type="content" source="media/app-service-configure-premium-tier/scale-up-tier-portal.png" alt-text="Screenshot showing how to scale up your app service plan.":::

1. Select one of the Premium V4 plans and select **Select**.

   :::image type="content" source="media/app-service-configure-premium-tier/explore-pricing-plans-TBD.png" alt-text="Screenshot showing the Explore pricing plans page with a Premium V4 plan selected.":::

   If your operation finishes successfully, your app's overview page shows that it's now in a Premium V4 tier.

   :::image type="content" source="media/app-service-configure-premium-tier/finished-TBD.png" alt-text="Screenshot showing the Premium V4 pricing tier on your app's overview page.":::

### If you get an error

If the underlying App Service deployment doesn't support the requested Premium V4 SKU, some App Service plans can't scale up to the Premium V4 tier. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

<a name="unsupported"></a>

## Regions

Premium V4 is available in the following regions:

### Azure Public

- Australia East
- Brazil South
- Canada Central
- Central India
- Central US
- East Asia
- East US
- East US 2
- France Central
- Germany West Central
- Italy North
- Japan East
- Korea Central
- North Central US
- North Europe
- Norway East
- Poland Central
- South Africa North
- Southeast Asia
- Spain Central
- Sweden Central
- Switzerland North
- UAE North
- UK South
- West Central US
- West Europe
- West US
- West US 3

### Azure Government

- US Gov Virginia

### Microsoft Azure operated by 21Vianet

- China North 3

## Scale up from an unsupported resource group and region combination

If your app runs in an App Service deployment where Premium V4 isn't available or in a region that doesn't support Premium V4, redeploy your app to take advantage of Premium V4. You have two options:

- Create an app in a new resource group and with a new App Service plan.

  When creating the App Service plan, select the desired Premium V4 tier. This step ensures that the App Service plan is deployed into a deployment unit that supports Premium V4. Then, redeploy your application code into the newly created app. Even if you scale the new App Service plan down to a lower tier to save costs, you can always scale up again to Premium V4 and the desired SKU in Premium V4 because the deployment unit supports it.

- In the **Development tools** > **Clone app** page, you can create an App Service plan using Premium V4 in the region you want, and specify the app settings and configuration that you want to clone.

  :::image type="content" source="media/app-service-configure-premium-tier/clone-app.png" alt-text="Screenshot showing how to clone your app.":::

## Automate with scripts

You can automate app creation in the Premium V4 tier with scripts, using the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).

### Azure CLI

The following command creates an App Service plan in *P1V4*. You can run it in the Cloud Shell. The options for `--sku` are *P0V4*, *P1V4*, *P2V4*, *P3V4*, *P1mV4*, *P2mV4*, *P3mV4*, *P4mV4*, and *P5mV4*.

```azurecli
az appservice plan create \
    --resource-group <resource_group_name> \
    --name <app_service_plan_name> \
    --sku P1V4
```

### Azure PowerShell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

The following command creates an App Service plan in _P1V4_. The options for `-WorkerSize` are *Small*, *Medium*, and *Large*.

```powershell
New-AzAppServicePlan -ResourceGroupName <resource_group_name> `
    -Name <app_service_plan_name> `
    -Location <region_name> `
    -Tier "PremiumV4" `
    -WorkerSize "Small"
```

## Related content

- [Scale up an app in Azure App Service](manage-scale-up.md)
- [Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)

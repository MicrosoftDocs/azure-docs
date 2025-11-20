---
title: Configure Premium v4 Tier
description: Learn how to better performance for your web, mobile, and API app in Azure App Service by scaling to the new Premium V4 pricing tier.
keywords: app service, azure app service, scale, scalable, app service plan, app service cost
ms.topic: how-to
ms.date: 09/24/2025
ms.author: msangapu
author: msangapu-msft
ms.custom:
  - references_regions
  - devx-track-azurecli
  - devx-track-azurepowershell
  - build-2025
#customer intent: As a deployment engineer, I want to understand the process and the benefits of scaling up apps to the Premium V4 pricing tier in Azure App Service.
ms.service: azure-app-service
---

# Configure Premium v4 tier for Azure App Service

The new Premium v4 pricing tier provides faster processors, NVMe local storage, and memory-optimized options. It offers up to double the memory-to-core ratio of previous tiers. This performance advantage can save money by running apps on fewer instances. This article explains how to create or scale up an app to the Premium v4 tier.

> [!NOTE]
> Managed Instance on Azure App Service (preview) is a new hosting option that extends the capabilities of App Service plans, providing advanced customization and isolation. See [Managed Instance on Azure App Service](overview-hosting-plans.md) for details.
>

## Prerequisites

To scale-up an app to Premium V4:

- An Azure App Service app running in a tier lower than Premium V4.
- The app must be in an App Service deployment supporting Premium V4.

<a name="availability"></a>

## Premium v4 availability

The Premium v4 tier is available for source code applications on Windows, and both source code applications and custom containers on Linux. The Premium v4 tier isn't available for Windows containers.

> [!NOTE]
> The Premium v4 tier lacks stable outbound IP addresses. This behavior is intentional. Although Premium v4 apps can make outbound calls, the platform doesn't provide stable outbound IPs for this tier. This differs from previous App Service tiers. The portal shows "Dynamic" for outbound IP addresses for Premium v4 apps. ARM and CLI calls return empty strings for *outboundIpAddresses* and *possibleOutboundIpAddresses*. If Premium v4 apps need stable outbound IPs, use [Azure NAT Gateway](overview-nat-gateway-integration.md) for predictable outbound IPs.

Premium v4 and its SKUs are available in select Azure regions. Microsoft continually adds availability to other regions. To check regional availability for a specific Premium v4 offering, run the following Azure CLI command in [Azure Cloud Shell](../cloud-shell/overview.md). Use Azure CLI version 2.73.0 or above. Substitute *P1V4* with the desired SKU:

**Windows** SKU availability

```azurecli-interactive
az appservice list-locations --sku P1V4
```
**Linux** SKU availability

```azurecli-interactive
az appservice list-locations --linux-workers-enabled --sku P1V4
```

<a name="create"></a>

## Create an app in Premium v4 tier

An App Service app's pricing tier is defined by its [App Service plan](overview-hosting-plans.md). You can create an App Service plan alone or during app creation.

When configuring the App Service plan in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, select **Pricing plan** and choose a **Premium V4** tier.

To see all the Premium v4 options, select **Explore pricing plans**, then select one of the Premium v4 plans and select **Select**.

> [!IMPORTANT]
> You might not see **P0V4**, **P1V4**, **P2V4**, **P3V4**, **P1mV4**, **P2mV4**, **P3mV4**, **P4mV4**, and **P5mV4** as options or some options might be grayed out. If so, **Premium V4** isn't available in the underlying App Service deployment. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

## Scaling out an app service plan on the Premium v4 tier

Although Premium v4 fully integrates with autoscale, limit individual scale-out requests to two or fewer instances per synchronous operation. For higher target counts, iterate through incremental requests. For example, to add 10 instances, loop through five separate scale-out requests of two instances each until all succeed. If a scale-out request fails, wait five minutes and retry.

## Scale up an existing app to Premium v4 tier

Before scaling up an existing app to the Premium v4 tier, ensure Premium v4 is available. See [Premiumv4 availability](#availability). If unavailable, see [Scale up from an unsupported resource group and region combination](#unsupported).

Scaling up might require extra steps depending on your hosting environment.

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, open your App Service app page.

1. In the left navigation of your App Service app page, select **Settings** > **Scale up (App Service plan)**.

   :::image type="content" source="media/app-service-configure-premium-tier/scale-up-tier-portal.png" alt-text="Screenshot showing how to scale up your app service plan.":::

1. Select one of the Premium v4 plans and select **Select**.

   If the operation succeeds, your app's overview page shows it's now in a Premium v4 tier.

### If you get an error

If the underlying App Service deployment doesn't support the requested Premium v4 SKU, some App Service plans can't scale up to the Premium v4 tier. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

<a name="unsupported"></a>

## Regions

Premium v4 is available in the following regions:

### Azure Public

>[!IMPORTANT]
> Not all Premium V4 regions offer availability zone support. Regions marked with an (*) below currently support availability zones.
- Australia East<sup>*</sup>
- Canada Central<sup>*</sup>
- Central India
- Central US
- East Asia
- East US
- East US 2<sup>*</sup>
- France Central<sup>*</sup>
- Germany West Central<sup>*</sup>
- Indonesia Central<sup>*</sup>
- Italy North<sup>*</sup>
- Japan East
- Japan West<sup>*</sup>
- Korea Central<sup>*</sup>
- Mexico Central
- North Central US
- North Europe
- Norway East<sup>*</sup>
- Poland Central<sup>*</sup>
- South Africa North<sup>*</sup>
- Southeast Asia
- Spain Central<sup>*</sup>
- Sweden Central<sup>*</sup>
- Switzerland North<sup>*</sup>
- UAE North<sup>*</sup>
- UK South<sup>*</sup>
- West Central US
- West Europe
- West US
- West US 2
- West US 3

<sup>*</sup> Region supports Premium v4 with availability zones.

## Scale up from an unsupported resource group and region combination

If your app runs where Premium v4 isn't available (either the deployment or the region), redeploy it to use Premium V4. Two options exist:

- Create an app in a new resource group with a new App Service plan.

  When creating the plan, select the desired Premium v4 tier. This ensures the plan is in a deployment unit supporting Premium V4. Then, redeploy your application code to the new app. Even if you scale the new plan down to save costs, you can always scale back up to Premium v4 because the deployment unit supports it.

- Use the **Development tools** > **Clone app** page to create an App Service plan with Premium v4 in your desired region, specifying the app settings and configuration to clone.

  :::image type="content" source="media/app-service-configure-premium-tier/clone-app.png" alt-text="Screenshot showing how to clone your app.":::

## Automate with scripts

You can automate Premium v4 app creation using [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/) scripts.

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

The following command creates an App Service plan in *P1V4*. The options for `-WorkerSize` are *Small*, *Medium*, and *Large*.

```powershell
New-AzAppServicePlan -ResourceGroupName <resource_group_name> `
    -Name <app_service_plan_name> `
    -Location <region_name> `
    -Tier "PremiumV4" `
    -WorkerSize "Small"
```

## Related content

- [Scale up an app in Azure App Service](manage-scale-up.md)
- [Run a load test to identify performance bottlenecks in a web app](../app-testing/load-testing/tutorial-identify-bottlenecks-azure-portal.md)

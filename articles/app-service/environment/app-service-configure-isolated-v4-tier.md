---
title: Configure Isolated v4 Tier
description: Learn how to get better performance for your web, mobile, and API apps running in an App Service Environment by scaling to the new Isolated v4 pricing tier.
keywords: app service, azure app service, scale, scalable, app service plan, app service cost, app service environment, ase
ms.topic: how-to
ms.date: 05/13/2026
ms.author: jordanselig
author: seligj95
ms.custom:
  - references_regions
  - devx-track-azurecli
  - devx-track-azurepowershell
ms.service: azure-app-service
#customer intent: As a deployment engineer, I want to understand the process and the benefits of scaling up apps running in an App Service Environment to the Isolated v4 pricing tier.
---

# Configure Isolated v4 tier for App Service Environment

The new Isolated v4 (Iv4) pricing tier for [App Service Environment v3](overview.md) provides faster processors, NVMe local storage, and memory-optimized options. Iv4 uses the same underlying hardware as the [Premium v4 tier](../app-service-configure-premium-v4-tier.md) for multitenant App Service, and offers up to double the memory-to-core ratio of previous Isolated tiers. This performance advantage can save money by running apps on fewer instances. This article explains how to create or scale up an app to the Isolated v4 tier in your App Service Environment.

## Prerequisites

To scale up an app to Isolated v4:

- An App Service Environment v3.
- An Azure App Service app running in an Isolated v2 tier (or lower) in your App Service Environment.
- The App Service Environment must be in a deployment supporting Isolated v4.

<a name="availability"></a>

## Isolated v4 availability

The Isolated v4 tier is available in App Service Environment v3. It supports Windows code apps, Linux code apps, Linux custom containers, and Windows containers.

> [!NOTE]
> Windows containers don't support large SKUs (`I4V4` and larger, and the memory-optimized `I1mV4`–`I5mV4` SKUs) in some regions. This behavior matches Isolated v2.

Isolated v4 and its SKUs are available in select Azure regions. Microsoft continually adds availability to other regions. To check regional availability for a specific Isolated v4 offering, run the following Azure CLI command in [Azure Cloud Shell](../../cloud-shell/overview.md). Use Azure CLI version 2.73.0 or later. Substitute *I1V4* with the desired SKU:

**Windows** SKU availability

```azurecli-interactive
az appservice list-locations --sku I1V4
```

**Linux** SKU availability

```azurecli-interactive
az appservice list-locations --linux-workers-enabled --sku I1V4
```

<a name="create"></a>

## Create an app in the Isolated v4 tier

The [App Service plan](../overview-hosting-plans.md) defines an App Service app's pricing tier. When you create an App Service plan inside an App Service Environment v3, you can select an Isolated v4 SKU at creation time.

When configuring the App Service plan in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, select **Pricing plan** and choose an **Isolated V4** tier.

To see all the Isolated v4 options, select **Explore pricing plans**, then select one of the Isolated v4 plans and select **Select**.

> [!IMPORTANT]
> You might not see **I1V4**, **I2V4**, **I3V4**, **I4V4**, **I5V4**, **I6V4**, **I1mV4**, **I2mV4**, **I3mV4**, **I4mV4**, and **I5mV4** as options, or some options might be grayed out. If so, **Isolated V4** isn't available in the underlying App Service Environment deployment. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

## Scaling out an App Service plan on the Isolated v4 tier

Although Isolated v4 fully integrates with autoscale, limit individual scale-out requests to two or fewer instances per synchronous operation. For higher target counts, iterate through incremental requests. For example, to add 10 instances, loop through five separate scale-out requests of two instances each until all succeed. If a scale-out request fails, wait five minutes and retry.

## Scale up an existing app to Isolated v4 tier

Before scaling up an existing app to the Isolated v4 tier, make sure Isolated v4 is available in your App Service Environment. For details, see [Isolated v4 availability](#availability). If Isolated v4 isn't available, follow the steps in [Scale up from an unsupported resource group and region combination](#unsupported).

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a>, open your App Service app page.

1. In the left navigation of your App Service app page, select **Settings** > **Scale up (App Service plan)**.

   :::image type="content" source="../media/app-service-configure-premium-tier/scale-up-tier-portal.png" alt-text="Screenshot showing how to scale up your app service plan.":::

1. Select one of the Isolated v4 plans and select **Select**.

   If the operation succeeds, your app's overview page shows it's now in an Isolated v4 tier.

### If you get an error

If the underlying App Service Environment deployment doesn't support the requested Isolated v4 SKU, some App Service plans can't scale up to the Isolated v4 tier. For more information, see [Scale up from an unsupported resource group and region combination](#unsupported).

## Regions

> [!IMPORTANT]
> Isolated v4 has limited regional capacity at launch. If you see an error such as *"The requested SKU isn't available in the selected region"* or *"Insufficient quota"* when attempting to deploy, scale, or create an App Service Environment using an Isolated v4 SKU, [open an Azure support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) to request Isolated v4 capacity in your target region.

Isolated v4 is available in the following regions:

### Azure Public

- Australia East
- Canada Central
- Central US
- East US
- East US 2
- France Central
- North Central US
- North Europe
- Norway East
- Southeast Asia
- Switzerland North
- West Central US
- West Europe
- West US
- West US 3

<a name="unsupported"></a>

## Scale up from an unsupported resource group and region combination

If your app runs in an App Service Environment where Isolated v4 isn't available (either the App Service Environment or the region), you need to redeploy it to use Isolated v4. Two options exist:

- **Create an app in a new resource group with a new App Service plan inside a new App Service Environment.**

  Create a new App Service Environment v3 in a region where Isolated v4 is supported, then create an App Service plan in the desired Isolated v4 tier inside that App Service Environment. This ensures the plan is in a deployment unit supporting Isolated v4. Then, redeploy your application code to the new app. Even if you scale the new plan down to save costs, you can always scale back up to Isolated v4 because the deployment unit supports it.

- **Use the Development tools > Clone app page to create an App Service plan in Isolated v4 in your target App Service Environment**, specifying the app settings and configuration to clone. Refer to the [current restrictions](../app-service-web-app-cloning.md#current-restrictions) for app cloning before you proceed.

  :::image type="content" source="../media/app-service-configure-premium-tier/clone-app.png" alt-text="Screenshot showing how to clone your app.":::

  > [!IMPORTANT]
  > App cloning has several restrictions that are especially relevant for App Service Environment workloads:
  >
  > - **Linux apps aren't supported by cloning.** Linux App Service Environment customers must use the new resource group + plan option instead.
  > - **Function apps aren't supported by cloning.**
  > - **Outbound IP addresses change** when you clone to a different App Service Environment.
  > - The following aren't cloned and must be reconfigured on the destination app: autoscale settings, backup schedules, Application Insights, Easy Auth settings, Kudu extensions, TiP rules, managed identities, and database content.

## Automate with scripts

You can automate Isolated v4 app creation using [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/) scripts.

### Azure CLI

The following command creates an App Service plan in *I1V4* inside an existing App Service Environment. You can run it in the Cloud Shell. The options for `--sku` are *I1V4*, *I2V4*, *I3V4*, *I4V4*, *I5V4*, *I6V4*, *I1mV4*, *I2mV4*, *I3mV4*, *I4mV4*, and *I5mV4*.

```azurecli
az appservice plan create \
    --resource-group <resource_group_name> \
    --name <app_service_plan_name> \
    --app-service-environment <app_service_environment_name> \
    --sku I1V4
```

### Azure PowerShell

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

The following command creates an App Service plan in *I1V4* inside an existing App Service Environment. The options for `-WorkerSize` are *Small*, *Medium*, and *Large*.

```powershell
New-AzAppServicePlan -ResourceGroupName <resource_group_name> `
    -Name <app_service_plan_name> `
    -Location <region_name> `
    -AppServicePlan <app_service_environment_name> `
    -Tier "IsolatedV4" `
    -WorkerSize "Small"
```

## Related content

- [App Service Environment overview](overview.md)
- [Configure Premium v4 tier for Azure App Service](../app-service-configure-premium-v4-tier.md)
- [Upgrade preference for planned maintenance](how-to-upgrade-preference.md)
- [Scale up an app in Azure App Service](../manage-scale-up.md)

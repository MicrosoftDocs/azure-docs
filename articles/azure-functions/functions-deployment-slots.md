---
title: Azure Functions deployment slots
description: Use Azure Functions deployment slots to test changes in staging, swap them into production with minimal downtime, and roll back by using the portal or Azure CLI.
ms.topic: concept-article
ms.date: 09/08/2026
ms.custom: sfi-image-nochange
zone_pivot_groups: functions-hosting-plan
---
# Azure Functions deployment slots

On hosting plans that support deployment slots, your function app can run separate instances called *slots*. Each slot is a separate environment with its own host name. Access to a slot's endpoint depends on the networking and access restrictions you configure for that slot. One slot is always the production slot, and you can swap an available staging slot with the production slot on demand.

The number of available slots depends on your specific hosting option:

| Hosting option | Slots (including production) |
| ---- | ---- |
| [Consumption plan](consumption-plan.md) | 2 (one production slot and one staging slot) |
| [Flex Consumption plan](flex-consumption-plan.md) | Not currently supported. For zero-downtime deployments, see [Site update strategies in Flex Consumption](flex-consumption-site-updates.md). |
| [Premium plan](functions-premium-plan.md) | 3 |
| [Dedicated (App Service) plan](dedicated-plan.md) | [1-20](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits) |
| [Azure Container Apps](../container-apps/functions-overview.md) | Deployment slots don't apply. Use [revisions](../container-apps/revisions.md). |

Select your hosting plan at the top of this article to view the guidance that applies to your function app.

::: zone pivot="flex-consumption-plan"

## Deploy without slots on Flex Consumption

The Flex Consumption plan doesn't support deployment slots. For controlled releases and zero-downtime deployments, use [rolling updates as the site update strategy](flex-consumption-site-updates.md).

::: zone-end
::: zone pivot="container-apps"

## Deploy with revisions on Azure Container Apps

Azure Functions on Azure Container Apps doesn't use deployment slots. Use [revisions](../container-apps/revisions.md) to manage and direct traffic between versions of your function app.

::: zone-end
::: zone pivot="consumption-plan,premium-plan,dedicated-plan"

On the Consumption, Premium, and Dedicated plans, deployment slots behave as follows:

- During the routing switch, new function trigger invocations are routed to the swapped slot without requiring an explicit application restart.
- Slot swaps don't guarantee zero downtime. Currently executing functions can be terminated and degraded availability can occur on scaled apps during slot swap operations. To learn how to write stateless and defensive functions, see [Improve the performance and reliability of Azure Functions](performance-reliability.md#write-functions-to-be-stateless). If zero-downtime deployments are a requirement, consider the [Flex Consumption plan](flex-consumption-plan.md) with [rolling updates as the site update strategy](flex-consumption-site-updates.md).

## Why use slots?

There are many advantages to using deployment slots, including:

- **Different environments for different purposes**: By using different slots, you can differentiate app instances before swapping to production or a staging slot.
- **Prewarming**: Deploy to a slot instead of directly to production to warm up the app before it goes live. Also, using slots reduces latency for HTTP-triggered workloads. Instances are warmed up before deployment, which reduces the cold start for newly deployed functions.
- **Easy fallbacks**: After a swap with production, the slot with a previously staged app now has the previous production app. If the changes you swapped into the production slot aren't what you expect, you can immediately reverse the swap to get your "last known good instance" back.
- **Minimize restarts**: Changing app settings in a production slot requires a restart of the running app. You can instead change settings in a staging slot and swap the settings change into production with a prewarmed instance. Slots are the recommended way to migrate between Functions runtime versions while maintaining the highest availability. To learn more, see [Minimum downtime update](migrate-version-3-version-4.md#minimum-downtime-update).

## Swap operations

During a swap, one slot is the source and the other is the target. The source slot has the instance of the application that you apply to the target slot. The following steps help reduce the downtime on the target slot during a swap:

1. **Apply settings:** Apply settings from the target slot to all instances of the source slot. For example, apply the production settings to the staging instance. The applied settings include the following categories:

   - [Slot-specific](#manage-settings) app settings and connection strings (if applicable)
   - [Continuous deployment](../app-service/deploy-continuous-deployment.md) settings (if enabled)
   - [App Service authentication](../app-service/overview-authentication-authorization.md) settings (if enabled)

1. **Wait for restarts and availability:** The swap waits for every instance in the source slot to complete its restart and to be available for requests. If any instance fails to restart, the swap operation reverts all changes to the source slot and stops the operation.

1. **Update routing:** If all instances on the source slot warm up successfully, the two slots complete the swap by switching routing rules. After this step, the target slot (for example, the production slot) has the app that was previously warmed up in the source slot.

1. **Repeat operation:** Now that the source slot has the preswap app previously in the target slot, complete the same operation by applying all settings and restarting the instances for the source slot.

Keep in mind the following points:

- At any point of the swap operation, initialization of the swapped apps happens on the source slot. The target slot remains online while the source slot is prepared, whether the swap succeeds or fails.

- To swap a staging slot with the production slot, ensure that the production slot is *always* the target slot. This way, the swap operation doesn't affect your production app.

- Configure settings related to event sources and bindings as [deployment slot settings](#manage-settings) *before you start a swap*. Marking them as "sticky" ahead of time ensures events and outputs are directed to the proper instance.

- When you create a new staging slot, the portal creates all existing settings from the production slot in the new slot, regardless of the *stickiness* of the setting.

## Manage settings

Some configuration settings are specific to a slot. The following lists detail which settings change when you swap slots, and which settings remain the same.

**Slot-specific settings**:

- Publishing endpoints
- Custom domain names
- Nonpublic certificates and TLS/SSL settings
- Scale settings
- IP restrictions
- Always On
- Diagnostic settings
- Cross-origin resource sharing (CORS)
- Private endpoints

**Non slot-specific settings**:

- General settings, such as framework version, 32/64-bit, and web sockets
- App settings (can be configured to stick to a slot)
- Connection strings (can be configured to stick to a slot)
- Handler mappings
- Public certificates
- Hybrid connections *
- Virtual network integration *
- Service endpoints *
- Azure Content Delivery Network *

Features marked with an asterisk (*) don't get swapped, by design.

> [!NOTE]
> Certain app settings that apply to unswapped settings aren't swapped. For example, since diagnostic settings aren't swapped, related app settings like `WEBSITE_HTTPLOGGING_RETENTION_DAYS` and `DIAGNOSTICS_AZUREBLOBRETENTIONDAYS` aren't swapped, even if they don't show up as slot settings.
>

### Create a deployment setting

You can mark settings as a deployment setting, which makes it *sticky*. A sticky setting doesn't swap with the app instance.

If you create a deployment setting in one slot, ensure you create the same setting with a unique value in any other slot that is involved in a swap. This way, while a setting's value doesn't change, the setting names remain consistent among slots. This name consistency ensures your code doesn't try to access a setting that is defined in one slot but not another.

Use the following steps to create a deployment setting:

1. Go to **Deployment slots** in the function app, and then select the slot name.

    :::image type="content" source="./media/functions-deployment-slots/functions-navigate-slots.png" alt-text="Screenshot shows the deployments slots in the Azure portal." border="true":::

1. Select **Configuration**, and then select the setting name you want to stick with the current slot.

    :::image type="content" source="./media/functions-deployment-slots/functions-configure-deployment-slot.png" alt-text="Screenshot shows where to configure the application setting for a slot in the Azure portal." border="true":::

1. Select **Deployment slot setting**, and then select **OK**.

    :::image type="content" source="./media/functions-deployment-slots/functions-deployment-slot-setting.png" alt-text="Screenshot shows where to configure the deployment slot setting." border="true":::

1. After the setting section closes, select **Save** to keep the changes.

    :::image type="content" source="./media/functions-deployment-slots/functions-save-deployment-slot-setting.png" alt-text="Screenshot shows how to save the deployment slot setting." border="true":::

## Deploy an app to a slot

Slots are empty when you create a slot. You can use any of the [supported deployment technologies](./functions-deployment-technologies.md) to deploy your application to a slot.

## How deployment slots scale

All slots scale to the same number of workers as the production slot.

- For Consumption plans, the slot scales as the function app scales.
- For App Service plans, the app scales to a fixed number of workers. Slots run on the same number of workers as the app plan.

## View slots

You can view information about existing slots by using either the [Azure CLI](/cli/azure) or the [Azure portal](https://portal.azure.com).

### [Azure portal](#tab/azure-portal)

Use these steps to view existing slots in the portal:

1. Go to your function app.

1. Select **Deployment slots** and view the existing slots.

### [Azure CLI](#tab/azure-cli)

Run this [az functionapp deployment slot list](/cli/azure/functionapp/deployment/slot#az-functionapp-deployment-slot-list) command to list the existing slots in your function app:

```azurecli
az functionapp deployment slot list --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>"
```

---

## Add a slot

You can add a slot by using either the [Azure CLI](/cli/azure) or the [Azure portal](https://portal.azure.com).

### [Azure portal](#tab/azure-portal)

Use these steps to create a slot in the portal:

1. Go to your function app.

1. Select **Deployment slots**, and then select **+ Add Slot**.

    :::image type="content" source="./media/functions-deployment-slots/functions-deployment-slots-add.png" alt-text="Screenshot shows adding an Azure Functions deployment slot." border="true":::

1. Type the name of the slot and select **Add**.

    :::image type="content" source="./media/functions-deployment-slots/functions-deployment-slots-add-name.png" alt-text="Screenshot shows naming the Azure Functions deployment slot." border="true":::

### [Azure CLI](#tab/azure-cli)

Run the [az functionapp deployment slot create](/cli/azure/functionapp/deployment/slot#az-functionapp-deployment-slot-create) command to create a slot named `staging` in your function app:

```azurecli
az functionapp deployment slot create --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot staging
```

---

You can also create a slot by using Azure Resource Manager (ARM) templates or Bicep files. For an example of how to create a function app in a Consumption plan with a deployment slot, see this [Azure Resource Manager quickstart](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.web/function-app-create-dynamic-slot).

## Access slot resources

You access resources (HTTP triggers and administrator endpoints) in a staging slot in the same way as the production slot. However, instead of the function app host name you use the slot-specific host name in the request URL, along with any slot-specific keys. Because staging slots are live apps, you must [secure your functions](./security-concepts.md) in a staging slot as you would in the production slot.  

## Swap slots

You can swap slots in and out of production by using either the [Azure CLI](/cli/azure) or the [Azure portal](https://portal.azure.com).

### [Azure portal](#tab/azure-portal)

Use these steps to swap a staging slot into production:

1. Go to the function app.

1. Select **Deployment slots**, and then select **Swap**.

    :::image type="content" source="./media/functions-deployment-slots/functions-swap-deployment-slot.png" alt-text="Screenshot that shows the Deployment slot page with the Add Slot action selected." border="true":::

1. Verify the configuration settings for your swap and select **Swap**.

    :::image type="content" source="./media/functions-deployment-slots/azure-functions-deployment-slots-swap-config.png" alt-text="Screenshot showing swapping the deployment slot." border="true":::

The swap operation can take a few seconds.

### [Azure CLI](#tab/azure-cli)

Run this [az functionapp deployment slot swap](/cli/azure/functionapp/deployment/slot#az-functionapp-deployment-slot-swap) command to swap between a slot named `staging` and the production slot in your function app:

```azurecli
az functionapp deployment slot swap --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot staging --target-slot production
```
---

## Roll back a swap

If a swap results in an error or you want to undo a swap, you can roll back to the initial state. To return to the preswapped state, do another swap to reverse the swap.

## Remove a slot

You can remove a slot by using either the [Azure CLI](/cli/azure) or the [Azure portal](https://portal.azure.com).

### [Azure portal](#tab/azure-portal)

Use these steps to remove a slot from your app in the portal:

1. Go to **Deployment slots** in the function app, and then select the slot name.

    :::image type="content" source="./media/functions-deployment-slots/functions-navigate-slots.png" alt-text="Screenshot show the page where you find slots in the Azure portal." border="true":::

1. Select **Delete**.

    :::image type="content" source="./media/functions-deployment-slots/functions-delete-deployment-slot.png" alt-text="Screenshot that shows the Overview page with the Delete action selected." border="true":::

1. Type the name of the deployment slot you want to delete, and then select **Delete**.

    :::image type="content" source="./media/functions-deployment-slots/functions-delete-deployment-slot-details.png" alt-text="Screenshot shows deleting the deployment slot in the Azure portal." border="true":::

1. Close the confirmation pane.

    :::image type="content" source="./media/functions-deployment-slots/functions-deployment-slot-deleted.png" alt-text="Screenshot shows the deployment slot deletion confirmation." border="true":::

### [Azure CLI](#tab/azure-cli)

Run the [az functionapp deployment slot delete](/cli/azure/functionapp/deployment/slot#az-functionapp-deployment-slot-delete) command to remove a slot named `staging` from your function app:

```azurecli
az functionapp deployment slot delete --name "<APP_NAME>" --resource-group "<RESOURCE_GROUP>" --slot staging
```

---

::: zone-end
::: zone pivot="premium-plan,dedicated-plan"

## Change App Service plan

With a function app that runs under an App Service plan, you can change the underlying App Service plan for a slot.

Use the following steps to change a slot's App Service plan:

1. Go to **Deployment slots** in the function app, and then select the slot name.

    :::image type="content" source="./media/functions-deployment-slots/functions-navigate-slots.png" alt-text="Screenshot shows the slots in the Azure portal." border="true":::

1. Under **App Service plan**, select **Change App Service plan**.

1. Select the plan you want to upgrade to, or create a new plan.

    :::image type="content" source="./media/functions-deployment-slots/azure-functions-deployment-slots-change-app-service-apply.png" alt-text="Screenshot shows where to change the App Service plan in the Azure portal." border="true":::

1. Select **OK**.

::: zone-end
::: zone pivot="consumption-plan,premium-plan,dedicated-plan"

## Considerations

Azure Functions deployment slots have the following considerations:

- The number of slots available to an app depends on the plan. The Consumption plan supports two slots total: the production slot and one staging slot. More slots are available for apps running under other plans. For details, see [Service limits](functions-scale.md#service-limits).
- Swapping a slot resets keys for apps that have an `AzureWebJobsSecretStorageType` app setting equal to `files`.
- When you enable slots, the portal sets your function app to read-only mode.
- Slot swaps might fail when your function app uses a [secured storage account](configure-networking-how-to.md) as its default storage account (set in `AzureWebJobsStorage`). For more information, see the [`WEBSITE_OVERRIDE_STICKY_DIAGNOSTICS_SETTINGS`](functions-app-settings.md#website_override_sticky_diagnostics_settings) reference.
- Use function app names shorter than 32 characters. Names longer than 32 characters can cause [host ID collisions](storage-considerations.md#host-id-considerations).

::: zone-end

## Next steps

- [Deployment technologies in Azure Functions](./functions-deployment-technologies.md)

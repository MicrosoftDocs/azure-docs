---
title: Set Up Staging Environments
description: Learn how to deploy apps to a nonproduction slot and automatically swap into production. Increase the reliability and eliminate app downtime from deployments.
ms.assetid: e224fc4f-800d-469a-8d6a-72bcde612450
ms.topic: how-to
ms.date: 03/28/2025
author: cephalin
ms.author: cephalin
ms.custom: fasttrack-edit, devx-track-azurepowershell, devx-track-azurecli, ai-video-demo
ai-usage: ai-assisted
#customer intent: As a web app developer, I want to understand deployment slots and how to swap and automatically swap into production in Azure App Service.
---

# Set up staging environments in Azure App Service
<a name="Overview"></a>

When you deploy your web app, web app on Linux, mobile back end, or API app to [Azure App Service](./overview.md), you can use a separate deployment slot instead of the default production slot. This approach is available if you run in the Standard, Premium, or Isolated tier of an App Service plan. Deployment slots are live apps with their own host names. App content and configuration elements can be swapped between two deployment slots, including the production slot.

Deploying your application to a nonproduction slot has the following benefits:

- You can validate app changes before you swap the slot into production.
- You can make sure that all instances of the slot are warmed up before you swap it into production. This approach eliminates downtime when you deploy your app. The traffic redirection is seamless. No requests are dropped because of swap operations.

  You can automate this entire workflow by configuring [auto swap](#Auto-Swap) when pre-swap validation isn't needed.
- After a swap, the slot with previously staged app now has the previous production app. If the changes swapped into the production slot aren't as you expect, you can perform the same swap immediately to get your *last known good site* back.

There's no extra charge for using deployment slots. Each App Service plan tier supports a different number of deployment slots. To find out the number of slots that your app's tier supports, see [App Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-app-service-limits).

To scale your app to a different tier, make sure that the target tier supports the number of slots that your app already uses. For example, if your app has more than five slots, you can't scale it down to the Standard tier. The Standard tier supports only five deployment slots.

The following video complements the steps in this article by illustrating how to set up staging environments in Azure App Service.

> [!VIDEO 99aaff5e-fd3a-4568-b03a-a65745807d0f]

## Prerequisites

- Permissions to perform the slot operation that you want. For information on the required permissions, see [Resource provider operations](../role-based-access-control/resource-provider-operations.md#microsoftweb). Search for **slot**, for example.

<a name="Add"></a>

## Add a slot

For you to enable multiple deployment slots, the app must be running in the Standard, Premium, or Isolated tier.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your app's management page.

1. On the left menu, select **Deployment** > **Deployment slots**. Then select **Add**.

   > [!NOTE]
   > If the app isn't already in the Standard, Premium, or Isolated tier, select **Upgrade**. Go to the **Scale** tab of your app before continuing.

1. In the **Add Slot** dialog, give the slot a name, and select whether to clone an app configuration from another deployment slot. Select **Add** to continue.

    :::image type="content" source="media/web-sites-staged-publishing/configure-new-slot.png" alt-text="Screenshot that shows selections for configuring a new deployment slot called 'staging' in the portal." lightbox="media/web-sites-staged-publishing/configure-new-slot.png":::

    You can clone a configuration from any existing slot. Settings that can be cloned include app settings, connection strings, language framework versions, web sockets, HTTP version, and platform bitness.

    > [!NOTE]
    > Currently, a private endpoint isn't cloned across slots.

1. After you enter the settings, select **Close** to close the dialog. The new slot now appears on the **Deployment slots** page. By default, **Traffic %** is set to **0** for the new slot, with all customer traffic routed to the production slot.

1. Select the new deployment slot to open its resource page.

    :::image type="content" source="media/web-sites-staged-publishing/open-deployment-slot.png" alt-text="Screenshot that shows how to open a deployment slot's management page in the portal." lightbox="media/web-sites-staged-publishing/open-deployment-slot.png":::

    The staging slot has a management page just like any other App Service app. You can change the slot's configuration. To remind you that you're viewing the deployment slot, the app name and the slot name appear in the URL. The app type is **App Service (Slot)**. You can also see the slot as a separate app in your resource group, with the same designations.

1. On the slot's resource page, select the app URL. The deployment slot has its own host name and is also a live app. To limit public access to the deployment slot, see [Set up Azure App Service access restrictions](app-service-ip-restrictions.md).

# [Azure CLI](#tab/cli)

Run the following command in a terminal:

```azurecli-interactive
az webapp deployment slot create --name <app-name> --resource-group <group-name> --slot <slot-name>
```

For more information, see [az webapp deployment slot create](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-create).

# [Azure PowerShell](#tab/powershell)

Run the following cmdlet in an Azure PowerShell terminal:

```azurepowershell-interactive
New-AzWebAppSlot -ResourceGroupName <group-name> -Name <app-name> -Slot <slot-name> -AppServicePlan <plan-name>
```

For more information, see [New-AzWebAppSlot](/powershell/module/az.websites/new-azwebappslot).

-----

The new deployment slot has no content, even if you clone the settings from a different slot. For example, you can [publish to this slot with Git](./deploy-local-git.md). You can deploy to the slot from a different repository branch or a different repository. The article [Get a publish profile from Azure App Service](/visualstudio/azure/how-to-get-publish-profile-from-azure-app-service) can provide the required information for deploying to the slot. Visual Studio can import the profile to deploy contents to the slot.

The slot's URL has the format `http://sitename-slotname.azurewebsites.net`. To keep the URL length within necessary DNS limits, the site name is truncated at 40 characters. The combined site name and slot name must be fewer than 59 characters.

<a name="AboutConfiguration"></a>

## Understand what happens during a swap

### Swap operation steps

When you swap two slots, App Service does the following to ensure that the target slot doesn't experience downtime:

1. Apply the following settings from the target slot (for example, the production slot) to all instances of the source slot:

   - [Slot-specific](#which-settings-are-swapped) app settings and connection strings, if applicable
   - [Continuous deployment](deploy-continuous-deployment.md) settings, if enabled
   - [App Service authentication](overview-authentication-authorization.md) settings, if enabled

   When any of the settings is applied to the source slot, the change triggers all instances in the source slot to restart. During a [swap with preview](#Multi-Phase), this action marks the end of the first phase. The swap operation is paused. You can validate that the source slot works correctly with the target slot's settings.

1. Wait for every instance in the source slot to complete its restart. If any instance fails to restart, the swap operation reverts all changes to the source slot and stops the operation.

1. If [local cache](overview-local-cache.md) is enabled, trigger local cache initialization by making an HTTP request to the application root (`/`) on each instance of the source slot. Wait until each instance returns any HTTP response. Local cache initialization causes another restart on each instance.

1. If [auto swap](#Auto-Swap) is enabled with [custom warm-up](#Warm-up), trigger the custom [application initialization](/iis/get-started/whats-new-in-iis-8/iis-80-application-initialization) on each instance of the source slot.

   If `applicationInitialization` isn't specified, trigger an HTTP request to the application root of the source slot on each instance.

   If an instance returns any HTTP response, it's considered to be warmed up.

1. If all instances on the source slot are warmed up successfully, swap the two slots by switching their routing rules. After this step, the target slot (for example, the production slot) has the app that's previously warmed up in the source slot.

1. Now that the source slot has the pre-swap app that was previously in the target slot, perform the same operation by applying all settings and restarting the instances.

At any point in the swap operation, all work of initializing the swapped apps happens on the source slot. The target slot remains online while the source slot is being prepared and warmed up, regardless of whether the swap succeeds or fails. To swap a staging slot with the production slot, make sure that the production slot is always the target slot. This way, the swap operation doesn't affect your production app.

> [!NOTE]
> Your former production instances are swapped into staging after this swap operation. Those instances are recycled in the last step of the swap process. If you have any long-running operations in your application, they're abandoned when the workers recycle. This fact also applies to function apps. Make sure that your application code is written in a fault-tolerant way.

### <a name = "which-settings-are-swapped"></a> Steps for making a slot unswappable

[!INCLUDE [app-service-deployment-slots-settings](../../includes/app-service-deployment-slots-settings.md)]

To configure an app setting or connection string to stick to a specific slot that isn't swapped:

1. Go to **Settings** > **Environment Variable** for that slot.

1. Add or edit a setting, and then select **Deployment slot setting**. Selecting this checkbox tells App Service that the setting isn't swappable.

1. Select **Apply**.

:::image type="content" source="media/web-sites-staged-publishing/set-slot-app-setting.png" alt-text="Screenshot that shows the checkbox for configuring an app setting as a slot setting in the Azure portal.":::

<a name="Swap"></a>

## <a name = "swap-two-slots"></a> Swap deployment slots

You can swap deployment slots on your app's **Deployment slots** page and the **Overview** page.

Before you swap an app from a deployment slot into production, make sure that production is your target slot and that all settings in the source slot are configured exactly as you want to have them in production.

# [Azure portal](#tab/portal)

1. Go to your app's **Deployment slots** page and select **Swap**.

    :::image type="content" source="media/web-sites-staged-publishing/swap-initiate.png" alt-text="Screenshot that shows selections for initiating a swap operation in the portal." lightbox="media/web-sites-staged-publishing/swap-initiate.png":::

    The **Swap** dialog shows settings in the selected source and target slots to be changed.

1. Select the desired **Source** and **Target** slots. Usually, the target is the production slot. Also, select the **Source slot changes** and **Target slot changes** tabs and verify that the configuration changes are expected. When you finish, you can swap the slots immediately by selecting **Start Swap**.

    :::image type="content" source="media/web-sites-staged-publishing/swap-configure-source-target-slots.png" alt-text="Screenshot that shows selections for configuring and completing a swap in the portal.":::

    To see how your target slot would run with the new settings before the swap happens, don't select **Start Swap**. Follow the instructions in [Swap with preview](#Multi-Phase) later in this article.

1. Select **Close** to close the dialog.

# [Azure CLI](#tab/cli)

Run the following command in a terminal:

```azurecli-interactive
az webapp deployment slot swap --resource-group <group-name> --name <app-name> --slot <source-slot-name> --target-slot production
```

For more information, see [az webapp deployment slot swap](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-swap).

# [Azure PowerShell](#tab/powershell)

Run the following cmdlet in an Azure PowerShell terminal:

```azurepowershell-interactive
Switch-AzWebAppSlot -SourceSlotName "<source-slot-name>" -DestinationSlotName "production" -ResourceGroupName "<group-name>" -Name "<app-name>"
```

For more information, see [Switch-AzWebAppSlot](/powershell/module/az.websites/switch-azwebappslot).

-----

If you have any problems, see [Troubleshoot swaps](#troubleshoot-swaps) later in this article.

<a name="Multi-Phase"></a>

### Swap with preview (multiple-phase swap)

Before you swap into production as the target slot, validate that the app runs with the swapped settings. The source slot is also warmed up before the swap completion, which is desirable for mission-critical applications.

When you perform a swap with preview, App Service performs the same [swap operation](#AboutConfiguration) but pauses after the first step. You can then verify the result on the staging slot before completing the swap.

If you cancel the swap, App Service reapplies configuration elements to the source slot.

> [!NOTE]
> You can't use swap with preview when site authentication is enabled in one of the slots.

# [Azure portal](#tab/portal)

1. Follow the steps in the [Swap deployment slots](#Swap) section, but select **Perform swap with preview**.

   The dialog shows you how the configuration in the source slot changes in the first phase, and how the source and target slot change in the second phase.

1. When you're ready to start the swap, select **Start Swap**.

   When the first phase finishes, the dialog notifies you.

1. When you're ready to complete the pending swap, select **Complete Swap** in **Swap action**, and then select the **Complete Swap** button.

   :::image type="content" source="media/web-sites-staged-publishing/swap-with-preview.png" alt-text="Screenshot that shows how to configure a swap with preview in the portal.":::

   To cancel a pending swap, select **Cancel Swap** instead, and then select the **Cancel Swap** button.

1. When you finish, select **Close** to close the dialog.

# [Azure CLI](#tab/cli)

To swap a slot into production with preview, run the following command in a terminal:

```azurecli-interactive
az webapp deployment slot swap --resource-group <group-name> --name <app-name> --slot <source-slot-name> --target-slot production --action preview
```

To complete the swap, run this command:

```azurecli-interactive
az webapp deployment slot swap --resource-group <group-name> --name <app-name> --slot <source-slot-name> --target-slot production --action swap
```

To cancel the swap, run this command:

```azurecli-interactive
az webapp deployment slot swap --resource-group <group-name> --name <app-name> --slot <source-slot-name> --target-slot production --action reset
```

For more information, see [az webapp deployment slot swap](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-swap).

# [Azure PowerShell](#tab/powershell)

To swap a slot into production with preview, run the following cmdlet in an Azure PowerShell terminal:

```azurepowershell-interactive
Switch-AzWebAppSlot -SourceSlotName "<source-slot-name>" -DestinationSlotName "production" -ResourceGroupName "<group-name>" -Name "<app-name>" -SwapWithPreviewAction ApplySlotConfig
```

To complete the swap, run the following cmdlet:

```azurepowershell-interactive
Switch-AzWebAppSlot -SourceSlotName "<source-slot-name>" -DestinationSlotName "production" -ResourceGroupName "<group-name>" -Name "<app-name>" -SwapWithPreviewAction CompleteSlotSwap
```

To cancel the swap, run the following cmdlet:

```azurepowershell-interactive
Switch-AzWebAppSlot -SourceSlotName "<source-slot-name>" -DestinationSlotName "production" -ResourceGroupName "<group-name>" -Name "<app-name>" -SwapWithPreviewAction ResetSlotSwap
```

For more information, see [Switch-AzWebAppSlot](/powershell/module/az.websites/switch-azwebappslot).

-----

If you have any problems, see [Troubleshoot swaps](#troubleshoot-swaps) later in this article.

<a name="Rollback"></a>

## Roll back a swap

If any errors occur in the target slot (for example, the production slot) after a slot swap, restore the slots to their pre-swap states by swapping the same two slots immediately.

<a name="Auto-Swap"></a>

## Configure auto swap

Auto swap streamlines Azure DevOps scenarios where you want to deploy your app continuously with zero cold starts and zero downtime for customers of the app. When auto swap is enabled from a slot into production, every time you push your code changes to that slot, App Service automatically [swaps the app into production](#swap-operation-steps) after it's warmed up in the source slot.

> [!NOTE]
> Auto swap isn't supported in web apps on Linux and in Web App for Containers.
>
> Before you configure auto swap for the production slot, consider testing it on a nonproduction target slot.

# [Azure portal](#tab/portal)

1. Go to your app's resource page. Select **Deployment** > **Deployment slots**, and then select the desired source slot.

1. On the left menu, select **Settings** > **Configuration** > **General settings**.

1. For **Auto swap enabled**, select **On**. For **Auto swap deployment slot**, select the target slot. Then select **Save** on the command bar.

    :::image type="content" source="media/web-sites-staged-publishing/auto-swap.png" alt-text="Screenshot that shows selections for configuring auto swap into the production slot in the portal.":::

1. Run a code push to the source slot. Auto swap happens after a short time. The update is reflected at your target slot's URL.

# [Azure CLI](#tab/cli)

To configure auto swap into the production slot, run the following command in a terminal:

```azurecli-interactive
az webapp deployment slot auto-swap --name <app-name> --resource-group <group-name> --slot <source-slot-name>
```

To disable auto swap, run the following command:

```azurecli-interactive
az webapp deployment slot auto-swap --name <app-name> --resource-group <group-name> --slot <source-slot-name> --disable
```

For more information, see [az webapp deployment slot auto-swap](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-auto-swap).

# [Azure PowerShell](#tab/powershell)

Run the following command in an Azure PowerShell terminal:

```azurepowershell-interactive
Set-AzWebAppSlot -ResourceGroupName "<group-name>" -Name "<app-name>" -Slot "<source-slot-name>" -AutoSwapSlotName "production"
```

For more information, see [Set-AzWebAppSlot](/powershell/module/az.websites/set-azwebappslot).

-----

If you have any problems, see [Troubleshoot swaps](#troubleshoot-swaps) later in this article.

<a name="Warm-up"></a>

## Specify custom warm-up

Some apps might require custom warm-up actions before the swap. You can specify these custom actions by using the `applicationInitialization` configuration element in `Web.config`. The [swap operation](#AboutConfiguration) waits for this custom warm-up to finish before swapping with the target slot. Here's a sample `Web.config` fragment:

```xml
<system.webServer>
    <applicationInitialization>
        <add initializationPage="/" hostName="[app hostname]" />
        <add initializationPage="/Home/About" hostName="[app hostname]" />
    </applicationInitialization>
</system.webServer>
```

For more information on customizing the `applicationInitialization` element, see the blog post [Most common deployment slot swap failures and how to fix them](https://ruslany.net/2017/11/most-common-deployment-slot-swap-failures-and-how-to-fix-them/).

You can also customize the warm-up behavior by using the following [app settings](configure-common.md):

- `WEBSITE_SWAP_WARMUP_PING_PATH`: The path to ping over HTTP to warm up your site. Add this app setting by specifying a custom path that begins with a slash as the value. An example is `/statuscheck`. The default value is `/`.
- `WEBSITE_SWAP_WARMUP_PING_STATUSES`: Valid HTTP response codes for the warm-up operation. Add this app setting with a comma-separated list of HTTP codes. An example is `200,202`. If the returned status code isn't in the list, the warm-up and swap operations are stopped. By default, all response codes are valid.
- `WEBSITE_WARMUP_PATH`: A relative path on the site that should be pinged whenever the site restarts (not only during slot swaps). Example values include `/statuscheck` or the root path, `/`.

The `<applicationInitialization>` configuration element is part of each app startup, whereas the app settings for warm-up behavior apply only to slot swaps.

If you have any problems, see [Troubleshoot swaps](#troubleshoot-swaps) later in this article.

## Monitor a swap

If the [swap operation](#AboutConfiguration) takes a long time to complete, you can get information on the swap operation in the [activity log](/azure/azure-monitor/essentials/platform-logs-overview).

# [Azure portal](#tab/portal)

1. On your app's resource page in the portal, on the left menu, select **Activity log**.

1. A swap operation appears in the log query as `Swap Web App Slots`. To view the details, you can expand it and select one of the suboperations or errors.

# [Azure CLI](#tab/cli)

Run the following command:

```azurecli-interactive
az monitor activity-log list --resource-group <group-name> --query "[?contains(operationName.value,'Microsoft.Web/sites/slots/slotsswap/action')]"
```

For more information, see [az monitor activity-log list](/cli/azure/monitor/activity-log#az-monitor-activity-log-list).

# [Azure PowerShell](#tab/powershell)

Run the following Azure PowerShell command:

```azurepowershell-interactive
Get-AzLog -ResourceGroup <group-name> -StartTime 2025-01-01 | where{$_.OperationName -eq 'Swap Web App Slots'}
```

For more information, see [Get-AzLog](/powershell/module/az.monitor/get-azlog).

-----

## Route production traffic automatically

By default, all client requests to the app's production URL are routed to the production slot. You can route a portion of the traffic to another slot. This feature is useful if you need user feedback for a new update but you're not ready to release it to production.

# [Azure portal](#tab/portal)

1. Go to your web app's resource page and select **Deployment** > **Deployment slots**.

1. In the **Traffic %** column of the slot that you want to route to, specify a percentage (between 0 and 100) to represent the amount of total traffic that you want to route. Then select **Save**.

   :::image type="content" source="media/web-sites-staged-publishing/route-traffic-to-slot.png" alt-text="Screenshot that shows portal selections for routing a percentage of request traffic to a deployment slot." lightbox="media/web-sites-staged-publishing/route-traffic-to-slot.png":::

After you save the setting, the specified percentage of clients is randomly routed to the nonproduction slot.

# [Azure CLI](#tab/cli)

To add a routing rule on a slot and transfer 15% of production traffic to it, run the following command:

```azurecli-interactive
az webapp traffic-routing set --resource-group <group-name> --name <app-name> --distribution <slot-name>=15
```

For more information, see [az webapp traffic-routing set](/cli/azure/webapp/traffic-routing#az-webapp-traffic-routing-set).

# [Azure PowerShell](#tab/powershell)

To add a routing rule on a slot and transfer 15% of production traffic to it, run the following command:

```azurepowershell-interactive
Add-AzWebAppTrafficRouting -ResourceGroupName "<group-name>" -WebAppName "<app-name>" -RoutingRule @{ActionHostName='<URL>';ReroutePercentage='15';Name='<slot-name>'}
```

Get the URL for that deployment slot from the **Deployment slots** page in the Azure portal.

For more information, see [Add-AzWebAppTrafficRouting](/powershell/module/az.websites/add-azwebapptrafficrouting). To update an existing rule, use [Update-AzWebAppTrafficRouting](/powershell/module/az.websites/update-azwebapptrafficrouting).

-----

After a client is automatically routed to a specific slot, it's *pinned* to that slot for one hour or until the cookies are deleted. On the client browser, you can see which slot your session is pinned to by looking at the `x-ms-routing-name` cookie in your HTTP headers. A request that's routed to the staging slot has the cookie `x-ms-routing-name=staging`. A request that's routed to the production slot has the cookie `x-ms-routing-name=self`.

## Route production traffic manually

In addition to automatic traffic routing, App Service can route requests to a specific slot. This option is useful when you want your users to be able to opt in to or opt out of your beta app. To route production traffic manually, you use the `x-ms-routing-name` query parameter.

To let users opt out of your beta app, for example, you can put this link on your webpage:

```html
<a href="<webappname>.azurewebsites.net/?x-ms-routing-name=self">Go back to production app</a>
```

The string `x-ms-routing-name=self` specifies the production slot. After the client browser accesses the link, it's redirected to the production slot. Every subsequent request has the `x-ms-routing-name=self` cookie that pins the session to the production slot.

To let users opt in to your beta app, set the same query parameter to the name of the nonproduction slot. Here's an example:

```html
<webappname>.azurewebsites.net/?x-ms-routing-name=staging
```

By default, new slots have a routing rule of `0%`, shown in gray. When you explicitly set this value to `0%` (shown in black text), your users can access the staging slot manually by using the `x-ms-routing-name` query parameter. They won't be routed to the slot automatically because the routing percentage is set to `0`. This configuration is an advanced scenario where you can hide your staging slot from the public while allowing internal teams to test changes on the slot.

<a name="Delete"></a>

## Delete a slot

# [Azure portal](#tab/portal)

1. Search for and select your app.

1. Select **Deployment** > **Deployment slots** > *slot to delete* > **Overview**. The app type appears as **App Service (Slot)** to remind you that you're viewing a deployment slot.

1. Stop the slot and set the traffic in the slot to zero.

1. On the command bar, select **Delete**.  

:::image type="content" source="media/web-sites-staged-publishing/delete-slot.png" alt-text="Screenshot that shows selections for deleting a deployment slot in the portal." lightbox="media/web-sites-staged-publishing/delete-slot.png":::

# [Azure CLI](#tab/cli)

Run the following command in a terminal:

```azurecli-interactive
az webapp deployment slot delete --name <app-name> --resource-group <group-name> --slot <slot-name>
```

For more information, see [az webapp deployment slot delete](/cli/azure/webapp/deployment/slot#az-webapp-deployment-slot-delete).

# [Azure PowerShell](#tab/powershell)

Run the following cmdlet in an Azure PowerShell terminal:

```azurepowershell-interactive
Remove-AzWebAppSlot -ResourceGroupName "<group-name>" -Name "<app-name>" -Slot "<slot-name>"
```

For more information, see [Remove-AzWebAppSlot](/powershell/module/az.websites/remove-azwebappslot).

-----

## Automate with Resource Manager templates

[Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) are declarative JSON files for automating the deployment and configuration of Azure resources. To swap slots by using Resource Manager templates, you set two properties on the `Microsoft.Web/sites/slots` and `Microsoft.Web/sites` resources:

- `buildVersion`: A string property that represents the current version of the app deployed in the slot. For example: `v1`, `1.0.0.1`, or `2019-09-20T11:53:25.2887393-07:00`.
- `targetBuildVersion`: A string property that specifies what `buildVersion` value the slot should have. If the `targetBuildVersion` value doesn't equal the current `buildVersion` value, it triggers the swap operation by finding the slot with the specified `buildVersion` value.

### Example Resource Manager template

The following Resource Manager template swaps two slots by updating the `buildVersion` value of the `staging` slot and setting the `targetBuildVersion` value on the production slot. You must have a slot called `staging`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "my_site_name": {
            "defaultValue": "SwapAPIDemo",
            "type": "String"
        },
        "sites_buildVersion": {
            "defaultValue": "v1",
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Web/sites/slots",
            "apiVersion": "2018-02-01",
            "name": "[concat(parameters('my_site_name'), '/staging')]",
            "location": "East US",
            "kind": "app",
            "properties": {
                "buildVersion": "[parameters('sites_buildVersion')]"
            }
        },
        {
            "type": "Microsoft.Web/sites",
            "apiVersion": "2018-02-01",
            "name": "[parameters('my_site_name')]",
            "location": "East US",
            "kind": "app",
            "dependsOn": [
                "[resourceId('Microsoft.Web/sites/slots', parameters('my_site_name'), 'staging')]"
            ],
            "properties": {
                "targetBuildVersion": "[parameters('sites_buildVersion')]"
            }
        }        
    ]
}
```

This Resource Manager template is idempotent. You can run it repeatedly and produce the same state of the slots. Without any change to the template, subsequent runs of the same template don't trigger any slot swap because the slots are already in the desired state.

## Troubleshoot swaps

If any error occurs during a [slot swap](#AboutConfiguration), the error appears in `D:\home\LogFiles\eventlog.xml`. It's also logged in the application-specific error log.

Here are some common swap errors:

- An HTTP request to the application root is timed. The swap operation waits for 90 seconds for each HTTP request, and it retries up to five times. If all retries are timed out, the swap operation is stopped.

- Local cache initialization might fail when the app content exceeds the local disk quota that's specified for the local cache. For more information, see [Azure App Service local cache overview](overview-local-cache.md).

- During a site update operation, the following error can occur: "The slot cannot be changed because its configuration settings have been prepared for swap." This error can occur if the first phase in a multiple-phase swap finishes but the second phase hasn't happened. It can also occur if a swap failed. There are two ways to resolve this problem:

  - Cancel the swap operation, which resets the site back to the old state.
  - Complete the swap operation, which updates the site to the desired new state.

  To learn how to cancel or complete the swap operation, see [Swap with preview (multiple-phase swap)](#swap-with-preview-multiple-phase-swap) earlier in this article.

- During [custom warm-up](#Warm-up), the HTTP requests are made internally without going through the external URL. They can fail with certain URL rewrite rules in `Web.config`. For example, rules for redirecting domain names or enforcing HTTPS can prevent warm-up requests from reaching the app code. To work around this problem, modify your rewrite rules by adding the following two conditions:

    ```xml
    <conditions>
      <add input="{WARMUP_REQUEST}" pattern="1" negate="true" />
      <add input="{REMOTE_ADDR}" pattern="^100?\." negate="true" />
      ...
    </conditions>
    ```

- Without a custom warm-up, the URL rewrite rules can still block HTTP requests. To work around this problem, modify your rewrite rules by adding the following condition:

    ```xml
    <conditions>
      <add input="{REMOTE_ADDR}" pattern="^100?\." negate="true" />
      ...
    </conditions>
    ```

- After slot swaps, the app might experience unexpected restarts. The restarts happen because after a swap, the host-name binding configuration goes out of sync. This situation by itself doesn't cause restarts. However, certain underlying storage events, such as storage volume failovers, might detect these discrepancies and force all worker processes to restart.

  To minimize these types of restarts, set the [`WEBSITE_ADD_SITENAME_BINDINGS_IN_APPHOST_CONFIG=1` app setting](https://github.com/projectkudu/kudu/wiki/Configurable-settings#disable-the-generation-of-bindings-in-applicationhostconfig) on *all slots*. However, this app setting doesn't work with Windows Communication Foundation (WCF) apps.

## Next step

> [!div class="nextstepaction"]
> [Set up Azure App Service access restrictions](app-service-ip-restrictions.md)

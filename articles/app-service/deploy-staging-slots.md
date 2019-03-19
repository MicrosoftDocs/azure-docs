---
title: Set up staging environments for web apps in Azure App Service | Microsoft Docs 
description: Learn how to use staged publishing for web apps in Azure App Service.
services: app-service
documentationcenter: ''
author: cephalin
writer: cephalin
manager: jpconnoc
editor: mollybos

ms.assetid: e224fc4f-800d-469a-8d6a-72bcde612450
ms.service: app-service
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/03/2019
ms.author: cephalin

---
# Set up staging environments in Azure App Service
<a name="Overview"></a>

> [!NOTE]
> This how-to guide shows how to manage slots using a new preview management page. Customers used to the existing management page can continue to use the existing slot management page as before. 
>

When you deploy your web app, web app on Linux, mobile back end, and API app to [App Service](https://go.microsoft.com/fwlink/?LinkId=529714), you can deploy to a separate deployment slot instead of the default production slot when running in the **Standard**, **Premium**, or **Isolated** App Service plan tier. Deployment slots are actually live apps with their own hostnames. App content and configurations elements can be swapped between two deployment slots, including the production slot. Deploying your application to a non-production slot has the following benefits:

* You can validate app changes in a staging deployment slot before swapping it with the production slot.
* Deploying an app to a slot first and swapping it into production makes sure that all instances of the slot are warmed up before being swapped into production. This eliminates downtime when you deploy your app. The traffic redirection is seamless, and no requests are dropped because of swap operations. This entire workflow can be automated by configuring [Auto Swap](#Auto-Swap) when pre-swap validation isn't needed.
* After a swap, the slot with previously staged app now has the previous production app. If the changes swapped into the production slot aren't as you expect, you can perform the same swap immediately to get your "last known good site" back.

Each App Service plan tier supports a different number of deployment slots. To find out the number of slots your app's tier supports, see [App Service Limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#app-service-limits). To scale your app to a different tier, the target tier must support the number of slots your app already uses. For example, if your app has more than five slots, you can't scale it down to **Standard** tier, because **Standard** tier only supports five deployment slots.

<a name="Add"></a>

## Add slot
The app must be running in the **Standard**, **Premium**, or **Isolated** tier in order for you to enable multiple deployment slots.

1. In the [Azure portal](https://portal.azure.com/), open your app's [resource page](../azure-resource-manager/manage-resources-portal.md#manage-resources).

2. In the left navigation, choose the **Deployment slots (Preview)** option, then click **Add Slot**.
   
    ![Add a new deployment slot](./media/web-sites-staged-publishing/QGAddNewDeploymentSlot.png)
   
   > [!NOTE]
   > If the app isn't already in the **Standard**, **Premium**, or **Isolated** tier, you receive a message indicating the supported tiers for enabling staged publishing. At this point, you have the option to select **Upgrade** and navigate to the **Scale** tab of your app before continuing.
   > 

3. In the **Add a slot** dialog, give the slot a name, and select whether to clone app configuration from another existing deployment slot. Click **Add** to continue.
   
    ![Configuration Source](./media/web-sites-staged-publishing/ConfigurationSource1.png)
   
    You can clone configuration from any existing slot. Settings that can be cloned include app settings, connection strings, language framework versions, web sockets, HTTP version, and platform bitness.

4. After the slot is added, click **Close** to close the dialog. The new slot is now shown in the **Deployment slots (Preview)** page. By default, the **Traffic %** is set to 0 for the new slot, with all customer traffic routed to the production slot.

5. Click the new deployment slot to open that slot's resource page.
   
    ![Deployment Slot Title](./media/web-sites-staged-publishing/StagingTitle.png)

    The staging slot has a management page just like any other App Service app. You can change the slot's configuration. The name of the slot is shown at the top of the page to remind you that you're viewing the deployment slot.

6. Click the app URL in the slot's resource page. The deployment slot has its own hostname and is also a live app. To limit public access to the deployment slot, see [Azure App Service IP Restrictions](app-service-ip-restrictions.md).

The new deployment slot has no content, even if you clone the settings from a different slot. For example, you can [publish to this slot with git](app-service-deploy-local-git.md). You can deploy to the slot from a different repository branch or a different repository. 

<a name="AboutConfiguration"></a>

## Which settings are swapped?
When you clone configuration from another deployment slot, the cloned configuration is editable. Furthermore, some configuration elements follow the content across a swap (not slot specific) while other configuration elements stay in the same slot after a swap (slot specific). The following lists show the settings that change when you swap slots.

**Settings that are swapped**:

* General settings - such as framework version, 32/64-bit, Web sockets
* App settings (can be configured to stick to a slot)
* Connection strings (can be configured to stick to a slot)
* Handler mappings
* Monitoring and diagnostic settings
* Public certificates
* WebJobs content
* Hybrid connections

**Settings that aren't swapped**:

* Publishing endpoints
* Custom Domain Names
* Private certificates and SSL bindings
* Scale settings
* WebJobs schedulers

<!-- VNET, IP restrictions, CORS, hybrid connections? -->

To configure an app setting or connection string to stick to a specific slot (not swapped), navigate to the **Application settings** page for that slot, then select the **Slot Setting** box for the configuration elements that should stick to the slot. Marking a configuration element as slot specific tells App Service that it's not swappable.

![Slot setting](./media/web-sites-staged-publishing/SlotSetting.png)

<a name="Swap"></a>

## Swap two slots 
You can swap deployment slots in your app's **Deployment slots (Preview)** page. 

You can also swap slots from the **Overview** and **Deployment slots** pages, but currently it gives you the old experience. This guide shows us how to use the new user interface in the **Deployment slots (Preview)** page.

> [!IMPORTANT]
> Before you swap an app from a deployment slot into production, make sure that all settings are configured exactly as you want to have it in the swap target.
> 
> 

To swap deployment slots, follow these steps:

1. Navigate to your app's **Deployment slots (Preview)** page and click **Swap**.
   
    ![Swap Button](./media/web-sites-staged-publishing/SwapButtonBar.png)

    The **Swap** dialog shows settings in the selected source and target slots that will be changed.

2. Select the desired **Source** and **Target** slots. Usually, the target is the production slot. Also, click the **Source Changes** and **Target Changes** tabs and verify that the configuration changes are expected. When finished, you can swap the slots immediately by clicking **Swap**.

    ![Complete swap](./media/web-sites-staged-publishing/SwapImmediately.png)

    To see how your target slot would run with the new settings before the swap actually happens, don't click **Swap**, but follow the instructions in [Swap with preview](#Multi-Phase).

3. When you're finished, close the dialog by clicking **Close**.

<a name="Multi-Phase"></a>

### Swap with preview (multi-phase swap)

> [!NOTE]
> Swap with preview isn't supported in web apps on Linux.

Before swapping into production as the target slot, validate the app runs with the swapped settings before the swap happens. The source slot is also warmed up before the swap completion, which is also desirable for mission-critical applications.

When you perform a swap with preview, App Service does the following when you start the swap:

- Keeps the target slot unchanged so existing workload on that slot (such as production) isn't affected.
- Applies the configuration elements of the target slot to the source slot, including the slot-specific connection strings and app settings.
- Restarts the worker processes on the source slot using these configuration elements. You can browse the source slot and see the app run with the configuration changes.

If you complete the swap in a separate step, App Service moves the warmed-up source slot into the target slot, and the target slot into the source slot. If you cancel the swap, App Service reapplies the configuration elements of the source slot to the source slot.

To swap with preview, follow these steps.

1. follow the steps in [Swap deployment slots](#Swap) but select **Perform swap with preview**.

    ![Swap with preview](./media/web-sites-staged-publishing/SwapWithPreview.png)

    The dialog shows you how the configuration in the source slot changes in phase 1, and how the source and target slot change in phase 2.

2. When ready to start the swap, click **Start Swap**.

    When phase 1 completes, you're notified in the dialog. Preview the swap in the source slot by navigating to `https://<app_name>-<source-slot-name>.azurewebsites.net`. 

3. When ready to complete the pending swap, select **Complete Swap** in **Swap action** and click **Complete Swap**.

    To cancel a pending swap, select **Cancel Swap** instead and click **Cancel Swap**.

4. When you're finished, close the dialog by clicking **Close**.

To automate a multi-phase swap, see Automate with PowerShell.

<a name="Rollback"></a>

## Roll back swap
If any errors occur in the target slot (for example, the production slot) after a slot swap, restore the slots to their pre-swap states by swapping the same two slots immediately.

<a name="Auto-Swap"></a>

## Configure Auto Swap

> [!NOTE]
> Auto Swap isn't supported in web apps on Linux.

Auto Swap streamlines DevOps scenarios where you want to deploy your app continuously with zero cold start and zero downtime for end customers of the app. When a slot autoswaps into production, every time you push your code changes to that slot, App Service automatically swaps the app into production after it's warmed up in the source slot.

   > [!NOTE]
   > Before configuring Auto Swap for the production slot, consider testing Auto Swap on a non-production target slot first.
   > 

To configure Auto Swap, follow these steps:

1. Navigate to your app's resource page. Select **Deployment slots (Preview)** > *\<desired source slot>* > **Application settings**.
   
2. In **Auto Swap**, select **On**, then select the desired target slot in **Auto Swap Slot**, and click **Save** in the command bar. 
   
    ![](./media/web-sites-staged-publishing/AutoSwap02.png)

3. Execute a code push to the source slot. Auto Swap happens after a short time and the update is reflected at your target slot's URL.

<a name="Warm-up"></a>

## Custom warm-up
When using [Auto-Swap](#Auto-Swap), some apps may require custom warm-up actions before the swap. The `applicationInitialization` configuration element in web.config lets you specify custom initialization actions to be performed. The swap operation waits for this custom warm-up to complete before swapping with the target slot. Here is a sample web.config fragment.

    <system.webServer>
        <applicationInitialization>
            <add initializationPage="/" hostName="[app hostname]" />
            <add initializationPage="/Home/About" hostName="[app hostname]" />
        </applicationInitialization>
    </system.webServer>

For more information on customizing the `applicationInitialization` element, see [Most common deployment slot swap failures and how to fix them](https://ruslany.net/2017/11/most-common-deployment-slot-swap-failures-and-how-to-fix-them/).

You can also customize the warm-up behavior with one or more of the following [app settings](web-sites-configure.md):

- `WEBSITE_SWAP_WARMUP_PING_PATH`: The path to ping to warmup your site. Add this app setting by specifying a custom path that begins with a slash as the value. For example, `/statuscheck`. The default value is `/`. 
- `WEBSITE_SWAP_WARMUP_PING_STATUSES`: Valid HTTP response codes for the warm-up operation. Add this app setting with a comma-separated list of HTTP codes. For example: `200,202` . If the returned status code is not in the list, the warmup and swap operations are stopped. By default, all response codes are valid.

## Monitor swap

If the swap operation takes a long time to complete, you can get information on the swap operation in the [activity log](../monitoring-and-diagnostics/monitoring-overview-activity-logs.md).

In your app's resource page in the portal, in the left-hand navigation, select **Activity log**.

A swap operation appears in the log query as `Swap Web App Slots`. You can expand it and select one of the suboperations or errors to see the details.

## Route traffic

By default, all client requests to the app's production URL (`http://<app_name>.azurewebsites.net`) are routed to the production slot. You can route a portion of the traffic to another slot. This feature is useful if you need user feedback for a new update, but you're not ready to release it to production.

### Route production traffic automatically

To route production traffic automatically, follow these steps:

1. Navigate to your app's resource page and select **Deployment slots (Preview)**.

2. In the **Traffic %** column of the slot you want to route to, specify a percentage (between 0 and 100) to represent the amount of total traffic you want to route. Click **Save**.

    ![](./media/web-sites-staged-publishing/RouteTraffic.png)

Once the setting is saved, the specified percentage of clients is randomly routed to the non-production slot. 

Once a client is automatically routed to a specific slot, it's "pinned" to that slot for the life of that client session. On the client browser, you can see which slot your session is pinned to by looking at the `x-ms-routing-name` cookie in your HTTP headers. A request that's routed to the "staging" slot has the cookie `x-ms-routing-name=staging`. A request that's routed to the production slot has the cookie `x-ms-routing-name=self`.

### Route production traffic manually

In addition to automatic traffic routing, App Service can route requests to a specific slot. This is useful when you want your users to be able to opt-into or opt-out of your beta app. To route production traffic manually, you use the `x-ms-routing-name` query parameter.

To let users opt out of your beta app, for example, you can put this link in your web page:

```HTML
<a href="<webappname>.azurewebsites.net/?x-ms-routing-name=self">Go back to production app</a>
```

The string `x-ms-routing-name=self` specifies the production slot. Once the client browser accesses the link, not only is it redirected to the production slot, but every subsequent request has the `x-ms-routing-name=self` cookie that pins the session to the production slot.

To let users opt in to your beta app, set the same query parameter to the name of the non-production slot, for example:

```
<webappname>.azurewebsites.net/?x-ms-routing-name=staging
```

<a name="Delete"></a>

## Delete slot

Navigate to your app's resource page. Select **Deployment slots (Preview)** > *\<slot to delete>* > **Overview**. Click **Delete** in the command bar.  

![Delete a Deployment Slot](./media/web-sites-staged-publishing/DeleteStagingSiteButton.png)

<!-- ======== AZURE POWERSHELL CMDLETS =========== -->

<a name="PowerShell"></a>

## Automate with PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell, including support for managing deployment slots in Azure App Service.

For information on installing and configuring Azure PowerShell, and on authenticating Azure PowerShell with your Azure subscription, see [How to install and configure Microsoft Azure PowerShell](/powershell/azure/overview).  

- - -
### Create web app
```PowerShell
New-AzWebApp -ResourceGroupName [resource group name] -Name [app name] -Location [location] -AppServicePlan [app service plan name]
```

- - -
### Create slot
```PowerShell
New-AzWebAppSlot -ResourceGroupName [resource group name] -Name [app name] -Slot [deployment slot name] -AppServicePlan [app service plan name]
```

- - -
### Initiate swap with preview (multi-phase swap) and apply destination slot configuration to source slot
```PowerShell
$ParametersObject = @{targetSlot  = "[slot name – e.g. “production”]"}
Invoke-AzResourceAction -ResourceGroupName [resource group name] -ResourceType Microsoft.Web/sites/slots -ResourceName [app name]/[slot name] -Action applySlotConfig -Parameters $ParametersObject -ApiVersion 2015-07-01
```

- - -
### Cancel pending swap (swap with review) and restore source slot configuration
```PowerShell
Invoke-AzResourceAction -ResourceGroupName [resource group name] -ResourceType Microsoft.Web/sites/slots -ResourceName [app name]/[slot name] -Action resetSlotConfig -ApiVersion 2015-07-01
```

- - -
### Swap deployment slots
```PowerShell
$ParametersObject = @{targetSlot  = "[slot name – e.g. “production”]"}
Invoke-AzResourceAction -ResourceGroupName [resource group name] -ResourceType Microsoft.Web/sites/slots -ResourceName [app name]/[slot name] -Action slotsswap -Parameters $ParametersObject -ApiVersion 2015-07-01
```

### Monitor swap events in the activity Log
```PowerShell
Get-AzLog -ResourceGroup [resource group name] -StartTime 2018-03-07 -Caller SlotSwapJobProcessor  
```

- - -
### Delete slot
```powershell
Remove-AzResource -ResourceGroupName [resource group name] -ResourceType Microsoft.Web/sites/slots –Name [app name]/[slot name] -ApiVersion 2015-07-01
```

- - -
<!-- ======== Azure CLI =========== -->

<a name="CLI"></a>

## Automate with CLI

For [Azure CLI](https://github.com/Azure/azure-cli) commands for deployment slots, see [az webapp deployment slot](/cli/azure/webapp/deployment/slot).

## Next steps
[Block access to non-production slots](app-service-ip-restrictions.md)

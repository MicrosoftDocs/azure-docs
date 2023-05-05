---
title: Automatic scaling
description: Learn how to scale automatically in Azure App Service with zero configuration.
ms.topic: article
ms.date: 05/05/2023
ms.author: msangapu

---
# Automatic scaling in Azure App Service

> [!NOTE]
> Automatic scaling is in preview. It's available for Premium Pv2 and Pv3 pricing tiers, and supported for all app types: Windows, Linux, and Windows container.
>

App Service offers automatic scaling that adjusts the number of instances based on incoming HTTP requests. Automatic scaling guarantees that your web apps can manage different levels of traffic. You can adjust scaling settings, like setting the minimum and maximum number of instances per web app, to enhance performance. The platform tackles cold start issues by prewarming instances that act as a buffer when scaling out, resulting in smooth performance transitions. Billing is calculated per second using existing meters, and prewarmed instances are also charged per second.

## How automatic scaling works

It's common to deploy multiple web apps to a single App Service Plan. You can enable automatic scaling for an App Service Plan and configure a range of instances for each of the web apps. As your web app starts receiving incoming HTTP traffic, App Service monitors the load and adds instances. Resources may be shared when multiple web apps within an App Service Plan are required to scale out simultaneously.

Here are a few scenarios where you should scale out automatically:

- You don't want to set up autoscale rules based on resource metrics.
- You want your web apps within the same App Service Plan to scale differently and independently of each other.
- Your web app is connected to a databases or legacy system, which may not scale as fast as the web app. Scaling automatically allows you to set the maximum number of instances your App Service Plan can scale to. This setting helps the web app to not overwhelm the backend.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use automatic scaling.
>

## Enable automatic scaling

__Maximum burst__ is the highest number of instances that your App Service Plan can increase to based on incoming HTTP requests. For Premium v2 & v3 plans, you can set a maximum burst of up to 30 instances. The maximum burst must be equal to or greater than the number of workers specified for the App Service Plan.

#### [Azure portal](#tab/azure-portal)

To enable automatic scaling in the Azure portal, select **Scale out (App Service Plan)** in the web app's left menu. Select **Automatic (preview)**, update the __Maximum burst__ value, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-automatic-scaling.png" alt-text="Automatic scaling in Azure portal" :::

#### [Azure CLI](#tab/azure-cli)

The following command enables automatic scaling for your existing App Service Plan and web apps within this plan:

```azurecli-interactive
az appservice plan update --name <APP_SERVICE_PLAN> --resource-group <RESOURCE_GROUP> --elastic-scale true --max-elastic-worker-count <YOUR_MAX_BURST> 
```

>[!NOTE]
> If you receive an error message `Operation returned an invalid status 'Bad Request'`, try using a different resource group or create a new one.
>

--- 

## Set minimum number of web app instances

__Always ready instances__ is an app-level setting to specify the minimum number of instances. If load exceeds what the always ready instances can handle, additional instances are added (up to the specified __maximum burst__ for the App Service Plan).

#### [Azure portal](#tab/azure-portal)

To set the minimum number of instances in the Azure portal, select **Scale out (App Service Plan)** in the web app's left menu, update the **Always ready instances** value, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-always-ready-instances.png" alt-text="Always ready instances in Automatic scaling" :::

#### [Azure CLI](#tab/azure-cli)
```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --minimum-elastic-instance-count <ALWAYS_READY_COUNT> 
```

---

## Set maximum number of web app instances

The __maximum scale limit__ sets the maximum number of instances a web app can scale to. The maximum scale limit helps when a downstream component like a database has limited throughput. The per-app maximum can be between 1 and the __maximum burst__.

#### [Azure portal](#tab/azure-portal)

To set the maximum number of web app instances in the Azure portal, select **Scale out (App Service Plan)** in the web app's left menu, select **Enforce scale out limit**, update the **Maximum scale limit**, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-maximum-scale-limit.png" alt-text="Maximum scale limit in Azure app Service" :::

#### [Azure CLI](#tab/azure-cli)

You can't change the maximum scale limit in Azure CLI, you must instead use the Azure portal.

---

## Update prewarmed instances

The __prewarmed instance__ setting provides warmed instances as a buffer during HTTP scale and activation events. Prewarmed instances continue to buffer until the maximum scale-out limit is reached. The default prewarmed instance count is 1 and, for most scenarios, this value should remain as 1.

#### [Azure portal](#tab/azure-portal)

You can't change the prewarmed instance setting in the portal, you must instead use the Azure CLI.

#### [Azure CLI](#tab/azure-cli)

You can modify the number of prewarmed instances for an app using the Azure CLI.

```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --prewarmed-instance-count <PREWARMED_COUNT>
```

---

## Disable automatic scaling

#### [Azure portal](#tab/azure-portal)

To disable automatic scaling in the Azure portal, select **Scale out (App Service Plan)** in the web app's left menu, select **Manual**, and select the **Save** button.   

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-manual-scaling.png" alt-text="Manual scaling in Azure app Service" :::

#### [Azure CLI](#tab/azure-cli)
The following command disables automatic scaling for your existing App Service Plan and all web apps within this plan:

```azurecli-interactive
az appservice plan update --resource-group <RESOURCE_GROUP> --name <APP_SERVICE_PLAN> --elastic-scale false 
```

--- 

## Frequently asked questions
- [How is automatic scaling different than autoscale?](#how-is-automatic-scaling-different-than-autoscale)
- [How does automatic scaling work with existing Auto scale rules?](#how-does-automatic-scaling-work-with-existing-autoscale-rules)
- [Does automatic scaling support Azure Function apps?](#does-automatic-scaling-support-azure-function-apps)
- [How to monitor the current instance count and instance history?](#how-to-monitor-the-current-instance-count-and-instance-history)


### How is automatic scaling different than autoscale?
Automatic scaling is a new scaling option in App Service that automatically handles web app scaling decisions for you. **[Azure autoscale](../azure-monitor/autoscale/autoscale-overview.md)** is a pre-existing Azure capability for defining schedule-based and resource-based scaling rules for your App Service Plans. 

A comparison of scale out and scale in options available on App Service:

| | **Manual scaling** | **Auto scaling** | **Automatic scaling** |
| --- | --- | --- | --- |
| Available pricing tiers	| Basic and Up | Standard and Up | Premium v2 and Premium v3 |
|Rule-based scaling	|No	|Yes	|No, the platform manages the scale out and in based on HTTP traffic. |
|Schedule-based scaling	|No	|Yes	|No|
|Always ready instances | No, your web app runs on the number of manually scaled instances.	| No, your web app runs on other instances available during the scale out operation, based on threshold defined for autoscale rules. | Yes (minimum 1) |
|Prewarmed instances	|No	|No	|Yes (default 1) |
|Per-app maximum	|No	|No	|Yes|

### How does automatic scaling work with existing autoscale rules?
Once automatic scaling is configured, existing Azure autoscale rules and schedules are disabled. Applications can use either automatic scaling, or autoscale, but not both.

### Does automatic scaling support Azure Function apps?
No, you can only have Azure App Service web apps in the App Service Plan where you wish to enable automatic scaling. If you have existing Azure Functions apps in the same App Service Plan, or if you create new Azure Functions apps, then automatic scaling is disabled. For Functions, it's recommended to use the [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md) instead.

### How to monitor the current instance count and instance history?
Use Application Insights [Live Metrics](../azure-monitor/app/live-stream.md) to check the current instance count, and [performanceCounters](../azure-functions/analyze-telemetry-data.md#query-telemetry-data) to check the instance count history.

<a name="Next Steps"></a>

## More resources

* [Get started with autoscale in Azure](../azure-monitor/autoscale/autoscale-get-started.md)
* [Configure PremiumV3 tier for App Service](app-service-configure-premium-tier.md)
* [Scale up server capacity](manage-scale-up.md)
* [High-density hosting](manage-scale-per-app.md)

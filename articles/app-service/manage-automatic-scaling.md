---
title: Automatic scaling
description: Learn how to scale automatically in Azure App Service with zero configuration.
ms.topic: article
ms.date: 05/04/2023
ms.author: msangapu

---
# Automatic scaling in Azure App Service

> [!NOTE]
> Automatic scaling is in preview. It's available for Premium Pv2 and Pv3 pricing tiers, and supported for all app types: Windows, Linux, and Windows container.
>

App Service now offers automatic scaling that adjusts the number of instances based on incoming HTTP requests. This guarantees that your web apps can manage different levels of traffic. You can adjust scaling settings, like setting the minimum and maximum number of instances per web app, to enhance performance and prevent blockages. The platform tackles cold start issues by pre-warming instances that act as a buffer when scaling out, resulting in smooth performance transitions. Automatic scaling is available for the Premium Pv2 and Pv3 pricing tiers. Billing is calculated per second using existing meters, and pre-warmed instances are also charged per second.

## How automatic scaling works

It's common to deploy multiple web apps to a single App Service Plan. You can enable automatic scaling for an App Service Plan and configure a range of instances for each of the web apps. As your web app starts receiving incoming HTTP traffic, App Service monitors the load and adds instances. Your web app can scale out to the maximum number of instances defined for the App Service Plan (maximum burst) or a fewer instances if a web app minimum is defined (always ready instances). Resources may be shared when multiple web apps within an App Service Plan are required to scale out simultaneously.

Here are a few scenarios where you should use scale automatically:

- You don't want to set up autoscale rules based on resource metrics.
- You want your web apps within the same App Service Plan to scale differently and independently of each other.
- A web app is connected to backend data sources like databases or legacy systems, which may not be able to scale as fast as the web app. Scaling automatically allows you to set the maximum number of instances your App Service Plan can scale to. This setting helps where the backend is a bottleneck to scaling and is overwhelmed by the web app.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use automatic scaling.
>

## Enable automatic scaling

When you turn on automatic scaling, you can set the highest number of instances that your App Service Plan can increase to based on incoming HTTP requests. This is known as the __maximum burst__. All web apps in the App Service Plan can increase up to the maximum burst set for the plan. For Premium v2 & v3 App Service Plans, you can set a maximum burst value of up to 30 instances. The maximum burst value must be equal to or greater than the number of workers specified for the App Service Plan.

#### [Azure portal](#tab/azure-portal)

1. In your App Service web app's left menu, select **Scale out (App Service Plan)**.

![Automatic scaling in Azure portal](./media/manage-automatic-scaling/azure-portal-automatic-scaling.png)

2. Select **Automatic (preview)**, update the __maximum burst__ value, and select the **Save** button.

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

1. In your App Service web app's left menu, select **Scale out (App Service Plan)**.

![Always ready instances in Automatic scaling](./media/manage-automatic-scaling/azure-portal-always-ready-instances.png)

2. Update the **Always ready instances** number and then select the **Save** button.

#### [Azure CLI](#tab/azure-cli)
```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --minimum-elastic-instance-count <ALWAYS_READY_COUNT> 
```

---

## Update pre-warmed instances

The __pre-warmed instance__ setting provides warmed instances as a buffer during HTTP scale and activation events. Pre-warmed instances continue to buffer until the maximum scale-out limit is reached. The default pre-warmed instance count is 1 and, for most scenarios, this value should remain as 1.

#### [Azure portal](#tab/azure-portal)

You can't change the pre-warmed instance setting in the portal, you must instead use the Azure CLI.

#### [Azure CLI](#tab/azure-cli)

You can modify the number of pre-warmed instances for an app using the Azure CLI.

```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --prewarmed-instance-count <PREWARMED_COUNT>
```

---

## Set maximum number of web app instances

The __maximum scale limit__ sets the maximum number of instances a web app can scale to. This is most common for cases where a downstream component like a database has limited throughput. The per-app maximum by default is unrestricted up to the app maximum, but you can set a value between 1 and the __maximum burst__ defined for the App Service Plan.

#### [Azure portal](#tab/azure-portal)

1. In your App Service web app's left menu, select **Scale out (App Service Plan)**.

![Maximum scale limit in Azure app Service](./media/manage-automatic-scaling/azure-portal-maximum-scale-limit.png)

2. Select **Enforce scale out limit** and update the **maximum scale limit**.

3. Select the **Save** button.

#### [Azure CLI](#tab/azure-cli)

You can't change the maximum scale limit in Azure CLI, you must instead use the Azure portal.

---

## Disable automatic scaling

#### [Azure portal](#tab/azure-portal)

1. In your App Service web app's left menu, select **Scale out (App Service Plan)**.

![Manual scaling in Azure app Service](./media/manage-automatic-scaling/azure-portal-manual-scaling.png)

2. Select **Manual** and then select the **Save** button.   

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

A quick comparison of various scale out and scale in options available for App Service web apps:

| | **Manual scaling** | **Auto scaling** | **Automatic scaling** |
| --- | --- | --- | --- |
| Available pricing Tiers	| Basic and Up | Standard and Up | Premium v2 and Premium v3 |
|Rule Based Scaling	|No	|Yes	|No(Scale out & in managed by the platform based on incoming HTTP traffic)|
|Schedule Based Scaling	|No	|Yes	|No|
|Always Ready Instances | No. Your web app will always run on the number of manually scaled instances.	| No. Your web app will run on other instances available during the scale out operation, based on threshold defined for auto scale rules. | Yes (Minimum of 1) |
|Prewarmed Instances	|No	|No	|Yes (Defaulted to 1) |
|Per-App Maximum	|No	|No	|Yes|

### How does automatic scaling work with existing autoscale rules?
Once automatic scaling for web apps is configured, existing Azure autoscale rules and schedules will not work. Applications can use either automatic scaling, or autoscale, but not both.

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

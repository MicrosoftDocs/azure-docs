---
title: How to enable automatic scaling
description: Learn how to scale automatically in Azure App Service with zero configuration.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/01/2024
ms.author: msangapu
author: msangapu-msft
---
# Automatic scaling in Azure App Service

> [!NOTE]
> Automatic scaling is available for all app types: Windows and Linux (deploy as code and container). Automatic scaling is not supported for deployment slot traffic.
>

Automatic scaling is a new scale-out option that automatically handles scaling decisions for your web apps and App Service Plans. It's different from the pre-existing **[Azure autoscale](../azure-monitor/autoscale/autoscale-overview.md)**, which lets you define scaling rules based on schedules and resources. With automatic scaling, you can adjust scaling settings to improve your app's performance and avoid cold start issues. The platform prewarms instances to act as a buffer when scaling out, ensuring smooth performance transitions. You're charged per second for every instance, including prewarmed instances. 

A comparison of scale-out and scale in options available on App Service:

| | **Manual** | **Autoscale** | **Automatic scaling** |
| --- | --- | --- | --- |
| Available pricing tiers	| Basic and Up | Standard and Up | Premium V2 (P1V2, P2V2, P3V2) and Premium V3 (P0V3, P1V3, P2V3, P3V3, P1MV3, P2MV3, P3MV3, P4MV3, P5MV3) pricing tiers|
|Rule-based scaling	|No	|Yes	|No, the platform manages the scale-out and in based on HTTP traffic. |
|Schedule-based scaling	|No	|Yes	|No|
|Always ready instances | No, your web app runs on the number of manually scaled instances.	| No, your web app runs on other instances available during the scale-out operation, based on threshold defined for autoscale rules. | Yes (minimum 1) |
|Prewarmed instances	|No	|No	|Yes (default 1) |
|Per-app maximum	|No	|No	|Yes|

## How automatic scaling works

You enable automatic scaling for an App Service Plan and configure a range of instances for each of the web apps. As your web app starts receiving HTTP traffic, App Service monitors the load and adds instances. Resources may be shared when multiple web apps within an App Service Plan are required to scale-out simultaneously.




Here are a few scenarios where you should scale-out automatically:

- You don't want to set up autoscale rules based on resource metrics.
- You want your web apps within the same App Service Plan to scale differently and independently of each other.
- Your web app is connected to a databases or legacy system, which may not scale as fast as the web app. Scaling automatically allows you to set the maximum number of instances your App Service Plan can scale to. This setting helps the web app to not overwhelm the backend.




## Enable automatic scaling

__Maximum burst__ is the highest number of instances that your App Service Plan can increase to based on incoming HTTP requests. For Premium v2 & v3 plans, you can set a maximum burst of up to 30 instances. The maximum burst must be equal to or greater than the number of workers specified for the App Service Plan.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use automatic scaling.
>

#### [Azure portal](#tab/azure-portal)

To enable automatic scaling, navigate to the web app's left menu and select **scale-out (App Service Plan)**. Select **Automatic**, update the __Maximum burst__ value, and select the **Save** button.

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

To set the minimum number of web app instances, navigate to the web app's left menu and select **scale-out (App Service Plan)**. Update the **Always ready instances** value, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-always-ready-instances.png" alt-text="Screenshot of always ready instances" :::

#### [Azure CLI](#tab/azure-cli)
```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --minimum-elastic-instance-count <ALWAYS_READY_COUNT> 
```

---

## Set maximum number of web app instances

The __maximum scale limit__ sets the maximum number of instances a web app can scale to. The maximum scale limit helps when a downstream component like a database has limited throughput. The per-app maximum can be between 1 and the __maximum burst__.

#### [Azure portal](#tab/azure-portal)

To set the maximum number of web app instances, navigate to the web app's left menu and select **scale-out (App Service Plan)**. Select **Enforce scale-out limit**, update the **Maximum scale limit**, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-maximum-scale-limit.png" alt-text="Screenshot of maximum scale limit" :::

#### [Azure CLI](#tab/azure-cli)

Currently, you can't change the maximum scale limit in Azure CLI, you must instead use the Azure portal.

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

To disable automatic scaling, navigate to the web app's left menu and select **scale-out (App Service Plan)**. Select **Manual**, and select the **Save** button.   

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-manual-scaling.png" alt-text="Screenshot of manual scaling" :::

#### [Azure CLI](#tab/azure-cli)
The following command disables automatic scaling for your existing App Service Plan and all web apps within this plan:

```azurecli-interactive
az appservice plan update --resource-group <RESOURCE_GROUP> --name <APP_SERVICE_PLAN> --elastic-scale false 
```

--- 

## Does automatic scaling support Azure Function apps?
> [!CAUTION]
> Automatic Scaling is disabled when App Service web apps and Azure Function apps are in the same App Service Plan.
>
No, you can only have Azure App Service web apps in the App Service Plan where you wish to enable automatic scaling. For Functions, it's recommended to use the [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md) instead.

## How does automatic scaling work behind the scenes?
Applications set to automatically scale are continuously monitored, with worker health assessments occurring at least once every few seconds. If the system detects increased load on the application, health checks become more frequent. In the event of deteriorating worker health and slowing requests, additional instances are requested. The speed at which instances are added varies based on the individual application's load pattern and startup time. Applications with brief startup times and intermittent bursts of load may see one virtual machine added every few seconds to a minute.

Once the load subsides, the platform initiates a review for potential scaling in. This process typically begins approximately 5-10 minutes after the load stops increasing. During scaling in, instances are removed at a maximum rate of one every few seconds to a minute.

Moreover, if multiple web applications are deployed within the same app service plan, the platform endeavors to allocate resources across available instances based on the load of each individual web application.

## How do I get billed for prewarmed instances?

To understand how you're billed for prewarmed instances, consider this scenario: Let's say your web app has five instances that are always ready, along with one prewarmed instance set as the default.

When your web app is idle and not receiving any HTTP requests, it runs with the five always-ready instances. During this time, you aren't billed for a prewarmed instance because the always-ready instances aren't being used, and thus no prewarmed instance is allocated.

However, as soon as your web app starts receiving HTTP requests and the five always-ready instances become active, a prewarmed instance is allocated, and billing for it begins.

If the rate of HTTP requests keeps increasing and App Service decides to scale beyond the initial five instances, it will start utilizing the prewarmed instance. This means that when there are six active instances, a seventh instance is immediately provisioned to fill the prewarmed buffer.

This process of scaling and prewarming continues until the maximum instance count for the app is reached. It's important to note that no instances are prewarmed or activated beyond the maximum instance count.

## Why does AppServiceHTTPLogs have log entries similar to "/admin/host/ping" with a 404 status?
 
App Service Automatic Scaling periodically checks the `/admin/host/ping` endpoint along with other health check mechanisms inherent to the platform. These checks are specifically implemented features. Occasionally, due to existing platform configurations, 404 errors may be returned by these pings. However, it's important to note that these 404 errors shouldn't affect your app's availability or scaling performance.

If your web app returns a 5xx status, these endpoint pings may result in intermittent restarts, though this is uncommon. We are currently implementing enhancements to address these intermittent restarts. Until then, please ensure that your web app doesn't return a 5xx status at this endpoint. Please be aware that these ping endpoints can't be customized.

## How do I track the number of scaled-out instances during the Automatic Scaling event?
 
**AutomaticScalingInstanceCount** metric will report the number of virtual machines on which the app is running including the prewarmed instance if it is deployed. This metric can also be used to track the maximum number of instances your web app scaled out during an Automatic Scaling event. This metric is available only for the apps that have Automatic Scaling enabled.

<a name="Next Steps"></a>

## More resources

* [Get started with autoscale in Azure](../azure-monitor/autoscale/autoscale-get-started.md)
* [Configure PremiumV3 tier for App Service](app-service-configure-premium-tier.md)
* [Scale up server capacity](manage-scale-up.md)
* [High-density hosting](manage-scale-per-app.md)

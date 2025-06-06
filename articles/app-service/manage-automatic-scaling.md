---
title: How to Enable Automatic Scaling
description: Learn how to scale automatically in Azure App Service with no configuration.
author: msangapu-msft
ms.author: msangapu
ms.topic: how-to
ms.date: 04/18/2025
ms.custom: devx-track-azurecli

---

# Automatic scaling in Azure App Service

> [!NOTE]
> Automatic scaling is available for all app types: Windows and Linux (deploy as code and container). Automatic scaling isn't supported for deployment slot traffic.
>

Automatic scaling is a scale-out option that automatically handles scaling decisions for your web apps and App Service plans. It's different from **[Azure autoscale](/azure/azure-monitor/autoscale/autoscale-overview)**, which lets you define scaling rules based on schedules and resources.

With automatic scaling, you can adjust scaling settings to improve your app's performance and avoid cold start issues. The platform prewarms instances to act as a buffer when scaling out, ensuring smooth performance transitions. You're charged per second for every instance, including prewarmed instances.

The following table compares scale-out and scale-in options available on App Service:

| | **Manual** | **Autoscale** | **Automatic scaling** |
| --- | --- | --- | --- |
| Available pricing tiers | Basic and up | Standard and up | Premium V2 (P1V2, P2V2, and P3V2) pricing tiers. Premium V3 (P0V3, P1V3, P2V3, P3V3, P1MV3, P2MV3, P3MV3, P4MV3, and P5MV3) pricing tiers.|
|Rule-based scaling |No |Yes   |No, the platform manages the scale-out and scale-in based on HTTP traffic. |
|Schedule-based scaling |No |Yes |No |
|Always-ready instances | No, your web app runs on the number of manually scaled instances. | No, your web app runs on other instances available during the scale-out operation, based on the threshold defined for autoscale rules. | Yes (minimum 1) |
|Prewarmed instances |No |No |Yes (default 1) |
|Per-app maximum |No |No |Yes |

## How automatic scaling works

You enable automatic scaling for an App Service plan and configure a range of instances for each of the web apps. As your web app starts receiving HTTP traffic, App Service monitors the load and adds instances. Resources might be shared when multiple web apps within an App Service plan are required to scale out simultaneously.

Here are a few scenarios where you should scale out automatically:

- You don't want to set up autoscale rules based on resource metrics.
- You want your web apps within the same App Service plan to scale differently and independently of each other.
- Your web app is connected to a database or legacy system, which might not scale as fast as the web app. Scaling automatically allows you to set the maximum number of instances your App Service plan can scale to. This setting helps the web app to not overwhelm the back end.

## Enable automatic scaling

The **Maximum burst** setting represents the highest number of instances that your App Service plan can increase to based on incoming HTTP requests. For Premium v2 & v3 plans, you can specify up to 30 instances. The maximum burst number must be equal to or greater than the number of workers specified for the App Service plan.

#### [Azure portal](#tab/azure-portal)

To enable automatic scaling, go to the web app's left menu. Under **Settings**, select **Scale-out (App Service plan)**. Select **Automatic**, update the **Maximum burst** value, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-automatic-scaling.png" alt-text="Screenshot that shows automatic scaling in Azure portal" :::

#### [Azure CLI](#tab/azure-cli)

The following command turns on automatic scaling for your existing App Service plan and web apps within this plan:

```azurecli-interactive
az appservice plan update --name <APP_SERVICE_PLAN> --resource-group <RESOURCE_GROUP> --elastic-scale true --max-elastic-worker-count <YOUR_MAX_BURST> 
```

>[!NOTE]
> If you receive the error message `Operation returned an invalid status 'Bad Request'`, try using a different resource group or create a new one.
>

---

## Set the minimum number of web app instances

The app-level setting **Always ready instances** specifies the minimum number of instances. If the load exceeds the minimum number set in **Always ready instances**, additional instances are added, up to the specified **Maximum burst** value for the App Service plan.

#### [Azure portal](#tab/azure-portal)

To set the minimum number of web app instances, go to the web app's left menu and select **Scale-out (App Service plan)**. Update the **Always ready instances** value, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-always-ready-instances.png" alt-text="Screenshot of always-ready instances." :::

#### [Azure CLI](#tab/azure-cli)

To set the minimum number of web app instances, use the following command:

```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --minimum-elastic-instance-count <ALWAYS_READY_COUNT> 
```

---

## Set the maximum number of web app instances

The **Maximum scale limit** value sets the maximum number of instances a web app can scale to. The **Maximum scale limit** is helpful when a downstream component like a database has limited throughput. The per-app maximum can be between 1 and the maximum burst value.

#### [Azure portal](#tab/azure-portal)

To set the maximum number of web app instances, go to the web app's left menu and select **Scale-out (App Service plan)**. Select **Enforce scale-out limit**, update the **Maximum scale limit**, and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-maximum-scale-limit.png" alt-text="Screenshot of maximum scale limit." :::

#### [Azure CLI](#tab/azure-cli)

Currently, you can't change the **Maximum scale limit** in the Azure CLI. You must instead use the Azure portal.

---

## Update prewarmed instances

The prewarmed instance setting provides warmed instances as a buffer during HTTP scale and activation events. Prewarmed instances continue to buffer until the maximum scale-out limit is reached. The default prewarmed instance count is *1* and, for most scenarios, this value should remain as 1.

#### [Azure portal](#tab/azure-portal)

You can't change the prewarmed instance setting in the portal. You must instead use the Azure CLI.

#### [Azure CLI](#tab/azure-cli)

You can modify the number of prewarmed instances for an app by using the Azure CLI.

```azurecli-interactive
 az webapp update --resource-group <RESOURCE_GROUP> --name <APP_NAME> --prewarmed-instance-count <PREWARMED_COUNT>
```

---

## Disable automatic scaling

#### [Azure portal](#tab/azure-portal)

To disable automatic scaling, go to the web app's left menu and select **Scale-out (App Service plan)**. Select **Manual** and select the **Save** button.

:::image type="content" source="./media/manage-automatic-scaling/azure-portal-manual-scaling.png" alt-text="Screenshot of manual scaling." :::

#### [Azure CLI](#tab/azure-cli)
The following command disables automatic scaling for your existing App Service plan and all web apps within this plan:

```azurecli-interactive
az appservice plan update --resource-group <RESOURCE_GROUP> --name <APP_SERVICE_PLAN> --elastic-scale false 
```

--- 

## Frequently asked questions

### Does automatic scaling support Azure Functions apps?

No, you can only have Azure App Service web apps in the App Service plan in which you wish to enable automatic scaling. For Azure Functions apps, we recommend that you use the [Azure Functions Premium plan](../azure-functions/functions-premium-plan.md) instead.

> [!CAUTION]
> Automatic scaling is disabled when App Service web apps and Azure Functions apps are in the same App Service plan.
>

### How does automatic scaling work behind the scenes?

Applications set to automatically scale are continuously monitored, with worker health assessments occurring at least once every few seconds. If the system detects increased load on the application, health checks become more frequent. If worker health deteriorates and requests slow down, other instances are requested. The speed at which instances are added varies based on the individual application's load pattern and startup time. Applications with brief startup times and intermittent bursts of load might see one virtual machine added every few seconds to a minute.

Once the load subsides, the platform initiates a review for potential scaling in. This process typically begins about 5-10 minutes after the load stops increasing. During scaling in, instances are removed at a maximum rate of one every few seconds to a minute.

If multiple web applications are deployed within the same App Service plan, the platform tries to allocate resources across available instances. This allocation is based on the load of each individual web application.

### How do I get billed for prewarmed instances?

To understand how you're billed for prewarmed instances, consider this scenario: Let's say your web app has five instances that are always ready, along with one prewarmed instance set as the default.

When your web app is idle and not receiving any HTTP requests, it runs with the five always-ready instances. During this time, you aren't billed for a prewarmed instance because the always-ready instances aren't being used, and thus no prewarmed instance is allocated.

However, as soon as your web app starts receiving HTTP requests and the five always-ready instances become active, a prewarmed instance is allocated. Billing for it begins at this point.

If the rate of HTTP requests keeps increasing and App Service decides to scale beyond the initial five instances, it starts utilizing the prewarmed instance. This means that when there are six active instances, a seventh instance is immediately provisioned to fill the prewarmed buffer.

This process of scaling and prewarming continues until the maximum instance count for the app is reached. It's important to note that no instances are prewarmed or activated beyond the maximum instance count.

### Why does `AppServiceHTTPLogs` have log entries similar to `/admin/host/ping` with a 404 status?

App Service automatic scaling periodically checks the `/admin/host/ping` endpoint along with other health check mechanisms that are inherent to the platform. Occasionally, due to existing platform configurations, these pings might return 404 errors. However, it's important to note that these 404 errors shouldn't affect your app's availability or scaling performance.

If your web app returns a 5xx status, these endpoint pings might result in intermittent restarts, though this scenario is uncommon. Ensure that your web app doesn't return a 5xx status at this endpoint. These ping endpoints can't be customized.

### How do I track the number of scaled-out instances during the automatic scaling event?

The `AutomaticScalingInstanceCount` metric reports the number of virtual machines on which the app is running, including the prewarmed instance if it's deployed. This metric can also be used to track the maximum number of instances your web app scaled out during an automatic scaling event. This metric is available only for the apps that have **Automatic Scaling** enabled.

### How does ARR Affinity affect automatic scaling?

Azure App Service uses Application Request Routing cookies known as an ARR Affinity. ARR Affinity cookies restrict scaling because they send requests only to servers associated with the cookie, rather than any available instance. For apps that store state, it's better to scale up (increase resources on a single instance). For stateless apps, scaling out (adding more instances) offers more flexibility and scalability. ARR Affinity cookies are enabled by default on App Service. Depending on your application needs, you might choose to disable ARR affinity cookies when using automatic scaling.

To disable ARR Affinity cookies: select your App Service app, and under **Settings**, select **Configuration**. Next select the **General settings** tab. Under **Session affinity**, select **Off** and then select the **Save** button.

<a name="Related content"></a>

## Related content

* [Get started with autoscale in Azure](/azure/azure-monitor/autoscale/autoscale-get-started)
* [Configure the PremiumV3 tier for App Service](app-service-configure-premium-tier.md)
* [Scale up server capacity](manage-scale-up.md)
* [Learn about high-density hosting](manage-scale-per-app.md)

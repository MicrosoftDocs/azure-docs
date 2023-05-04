---
title: Automatic scaling
description: Learn how to scale automatically in Azure App Service with zero configuration.
ms.topic: article
ms.date: 04/21/2023
ms.author: msangapu

---
# Automatic scaling in Azure App Service

> [!NOTE]
> Automatic scaling is in preview.
>

App Service has an automatic scaling capability that adjusts the number of running instances of your application based on incoming HTTP requests. This ensures that your web applications can handle varying levels of traffic. You have control over scaling settings, such as defining the minimum and maximum number of instances per web app, to optimize performance and avoid bottlenecks. The platform also addresses cold start issues with prewarmed instances that act as a buffer when scaling out, ensuring smooth performance transitions. automatic scaling is available for the Premium Pv2 and Pv3 pricing tiers, and charges are calculated per second using existing billing meters. Prewarmed instances are also charged per second.

## How automatic scaling works

It's common to deploy multiple web apps to a single App Service plan. You can enable automatic scaling for an App Service plan and configure a range of instances for each of the web apps. As your web app starts receiving incoming HTTP traffic, the App Service monitors the load on the web apps and adds instances. Your web app can scale out to the maximum number of instances defined for the App Service plan or a fewer instances if a web app minimum is defined. Resources may be shared when multiple web apps within the App Service plan are required to scale out simultaneously.

Here are a few scenarios where you should use scale automatically:

- You don't want to set up autoscale rules based on resource metrics.
- You want your web apps within the same App Service plan to scale differently and independently of each other.
- A web app is connected to backend data sources like databases or legacy systems, which may not be able to scale as fast as the web app. Scaling automatically allows you to set the maximum number of instances your App Service plan can scale to. This setting helps where the backend is a bottleneck to scaling and is overwhelmed by the web app.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use automatic scaling.
>

## Enable automatic scaling

#### [Azure CLI](#tab/azure-cli)

The following command enables automatic scaling for your existing App Service plan and web apps within this plan:

```azurecli-interactive
az appservice plan update --name <AppServicePlan> --resource-group <ResourceGroup> --elastic-scale true --max-elastic-worker-count <elastic-count> 
```
 
- Replace `<AppServicePlan>` with the App Service plan name.
- Replace `<ResourceGroup>` with the Resource Group name.
- Set the `--elastic-scale` argument to true to enable automatic scaling.
- `<elastic-count>` should be equal to or greater than NumberOfWorkers in your App Service plan, and less than or equal to the maximum instances allowed for your App Service plan.

>[!NOTE]
> If you receive an error message `Operation returned an invalid status 'Bad Request'`, try using a different resource group or create a new one.
>

#### [Azure portal](#tab/azure-portal)

1. In your App Service web app's left menu, select **Scale out (App Service plan)**.

![Automatic scaling in Azure portal](./media/manage-automatic-scaling/azure-portal-automatic-scaling.png)

2. Select **Automatic (preview)** and then select the **Save** button.

--- 

## Set minimum number of instances

This enables the minimum number of instances available to your web app (per app scaling).

#### [Azure CLI](#tab/azure-cli)
```azurecli-interactive
 az webapp update --resource-group <ResourceGroup> --name <app-name> --minimum-elastic-instance-count <elastic-count> 
```
 
- Replace `<ResourceGroup>` with the Resource Group name.
- Replace `<app-name>` with the App Service app name.
- Replace `<elastic-count>` with the minimum number of instances available to your web app for scaling.
- To update  prewarmed instances, use `--prewarmed-instance-count <prewarmed-count>` and update `<prewarmed-count>` with the number of prewarmed instances.
#### [Azure portal](#tab/azure-portal)

1. In your App Service web app's left menu, select **Scale out (App Service plan)**.

![Always ready instances in Automatic scaling](./media/manage-automatic-scaling/azure-portal-always-ready-instances.png)

2. Update the **Always ready instances** number and then select the **Save** button.

---


## Disable automatic scaling

#### [Azure CLI](#tab/azure-cli)
The following command disables automatic scaling for your existing App Service plan and all web apps within this plan:

```azurecli-interactive
az appservice plan update --resource-group <ResourceGroup> --name <AppServicePlan> --elastic-scale false 
```

- Replace `<ResourceGroup>` with the Resource Group name.
- Replace `<AppServicePlan>` with the App Service plan name.
- Set the `--elastic-scale` argument to false to disable automatic scaling.

#### [Azure portal](#tab/azure-portal)

1. In your App Service web app's left menu, select **Scale out (App Service plan)**.

![Manual scaling in Azure app Service](./media/manage-automatic-scaling/azure-portal-manual-scaling.png)

2. Select **Manual** and then select the **Save** button.   
--- 

## Automatic scaling concepts

This table describes the terms used in automatic scaling:

| **Concept** | **Description** | **Scope** | **Range** | **Default** | **Configurable** |
| --- | --- | --- | --- | --- | --- |
|**Maximum Burst**| The number of instances your App Service plan can scale to. <br><br>The maximum burst limit should be equal to or greater than the number of workers for the App Service plan.<br><br>The number of workers is determined as the highest number of __always ready instances__ for any app within the plan.|App Service Plan | 1 - 30 | 1 | CLI & Azure portal |
|**Always ready instances**|Minimum number of instances for your web app.<br><br>The same setting also determines the minimum number of instances your entire App Service plan needs. So, if you have multiple web apps in the same plan and some have a setting of 1 always-ready instance while others have 5, the minimum number of instances you'll be charged for will be 5.| Web app | Range | 1 | CLI & Azure portal |
|**Prewarmed Instances**| To avoid cold-start issues, you can set a prewarmed instance count. | Web app | Range | 1 | CLI only. |
|**Maximum scale limit**| The maximum number of instances a web app can scale to.| Web app | 1 - Maximum burst | | CLI & Azure portal|


## Frequently asked questions
- [What App Service platforms are supported?](#what-app-service-platforms-support-automatic-scaling)
- [How is automatic scaling different than autoscale?](#how-is-automatic-scaling-different-than-autoscale)
- [How does automatic scaling work with existing Auto scale rules?](#how-does-automatic-scaling-work-with-existing-auto-scale-rules)
- [Does automatic scaling support Azure Function apps?](#does-automatic-scaling-support-azure-function-apps)
- [How to monitor the current instance count and instance history?](#how-to-monitor-the-current-instance-count-and-instance-history)

### What App Service platforms support automatic scaling?
- Automatic scaling is currently supported for all app types in Azure App Service. It's supported in Windows, Linux and Windows container.
- Automatic scaling is available only for Azure App Services Premium Pv2 and Pv3 pricing tiers.     

### How is automatic scaling different than autoscale?
Automatic scaling is a new scaling option in App Service that automatically handles web app scaling decisions for you. **[Azure autoscale](../azure-monitor/autoscale/autoscale-overview.md)** is a pre-existing Azure capability for defining schedule-based and resource-based scaling rules for your App Service plans. 

A quick comparison of various scale out and scale in options available for App Service web apps:

| | **Manual scaling** | **Auto scaling** | **Automatic scaling** |
| --- | --- | --- | --- |
| Available pricing Tiers	| Basic and Up | Standard and Up | Premium v2 and Premium v3 |
|Rule Based Scaling	|No	|Yes	|No(Scale out & in managed by the platform based on incoming HTTP traffic)|
|Schedule Based Scaling	|No	|Yes	|No|
|Always Ready Instances | No. Your web app will always run on the number of manually scaled instances.	| No. Your web app will run on other instances available during the scale out operation, based on threshold defined for auto scale rules. | Yes (Minimum of 1) |
|Prewarmed Instances	|No	|No	|Yes (Defaulted to 1) |
|Per-App Maximum	|No	|No	|Yes|

### How does automatic scaling work with existing Auto scale rules?
Once automatic scaling for web apps is configured, existing Azure autoscale rules and schedules will not work. Applications can use either automatic scaling, or autoscale, but not both.

### Does automatic scaling support Azure Function apps?
No. You can only have Azure App Service web apps in the App Service plan where you wish to enable automatic scaling. If you have existing Azure Functions apps in the same App Service plan, or if you create new Azure Functions apps, then automatic scaling is disabled. For Functions, it's recommended to use the Azure Functions Premium plan instead.

### How to monitor the current instance count and instance history?
Use Application Insights [Live Metrics](../azure-monitor/app/live-stream.md) to check the current instance count, and [performanceCounters](../azure-functions/analyze-telemetry-data.md#query-telemetry-data) to check the instance count history.

<a name="Next Steps"></a>

## More resources

* [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md)
* [Configure PremiumV3 tier for App Service](app-service-configure-premium-tier.md)
* [Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)
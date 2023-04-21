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

App Service has an Automatic scaling capability that adjusts the number of running instances of your application based on incoming HTTP requests. This ensures that your web applications can handle varying levels of traffic. You have control over scaling settings, such as defining the minimum and maximum number of instances per web app, to optimize performance and avoid bottlenecks. The platform also addresses cold start issues with pre-warmed instances that act as a buffer when scaling out, ensuring smooth performance transitions. Automatic scaling is available for the Premium Pv2 and Pv3 SKUs, and charges are calculated per second using existing billing meters. Pre-warmed instances are also charged per second.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use Automatic scaling.
>

## How Automatic scaling works

It's common to deploy multiple web apps to a single App Service plan. You can enable Automatic scaling for an App Service plan and configure different "always ready instances" and "per-app maximum" values for each of the web apps. As your web app starts receiving incoming HTTP traffic, the App Service monitors the load on the web apps and adds additional instances. Your web app may scale out to maximum burst defined for the App Service plan or a fewer number of instances if per-app maximum is defined. Resources may be share when multiple web apps within the App Service plan are required to scale out simultaneously.

Here's a few scenarios when you should use Automatic scaling:

- You want your web app to scale automatically without setting up an auto-scale schedule or set of auto-scale rules based on various resource metrics.
- You want your web apps within the same App Service plan to scale differently and independently of each other.
- A web app is connected to backend data sources like databases or legacy systems which may not be able to scale as fast as the web app. Automatic scaling allows you to set the maximum number of instances your App Service plan can scale to. This helps avoid scenarios where a backend is a bottleneck to scaling and is overwhelmed by the web app.

## Enable Automatic scaling

#### [Azure CLI](#tab/azure-cli)

The command below enables Automatic scaling for your existing App Service plan and web apps within this plan:

```azurecli-interactive
az appservice plan update --name <AppServicePlan> --resource-group <ResourceGroup> --elastic-scale true --max-elastic-worker-count <elastic-count> 
```
 
- Replace `<AppServicePlan>` with the App Service plan name.
- Replace `<ResourceGroup>` with the Resource Group name.
- Set the `--elastic-scale` argument to true to enable Automatic scaling.
- `<elastic-count>` should be equal to or greater than NumberOfWorkers in your App Service plan, and less than or equal to the maximum instances allowed for your App Service plan.

>[!NOTE]
> If you receive an error message `Operation returned an invalid status 'Bad Request'`, try using a different resource group or create a new one.
>

#### [Azure Portal](#tab/azure-portal)

![Automatic scaling in Azure app Service](./media/manage-automatic-scaling/azure-portal-automatic-scaling.png)

--- 

## Automatic scaling concepts

The table below describes a few important concepts in Automatic scaling.

| **Concept** | **Description** |
| --- | --- |
|**Maximum Burst** (App Service plan)|You have the ability to set a limit on how many instances your App Service plan can expand to based on incoming HTTP requests. This means that all web apps within your App Service plan can grow up to the maximum limit that you set.<br><br>For premium v2 & v3 App Service plans, you can set a maximum burst limit of up to 30 instances. The maximum burst limit should be equal to or greater than the number of workers for the App Service plan.<br><br>The number of workers is determined as the highest number of "always ready instances" for any app within the plan. It's important to note that every App Service plan always has at least one active (billed) instance.|
|**Always ready instances**|You can make sure your web app is always running smoothly by setting an app-level setting that specifies the number of instances it should use. If the number of people trying to use your app is too high for the instances you've set up, additional instances will be added up to a maximum limit you've set.<br><br>The same setting also determines the minimum number of instances your entire App Service plan needs. So, if you have multiple web apps in the same plan and some have a setting of 1 always-ready instance while others have 5, the minimum number of instances you'll be charged for will be 5. Keep in mind that you're charged for every instance, regardless of whether your web app is actually being used or not.<br><br>By default, the always-ready instances setting is 1. It's important to understand that this setting affects the minimum number of instances you're billed for.|
|**Pre-warmed Instances**|To ensure your web app can handle an increase in traffic, you can set a pre-warmed instance count. This means that some instances will be kept "warm" and ready to handle traffic before it arrives. By default, this count is set to 1, which is usually enough.<br><br>Here's an example: if you've set your "Always ready instances" setting to 2, your web app will run on 2 instances even when there's no traffic. You're billed for these 2 instances but not for a pre-warmed instance, because none is allocated.<br><br>When your app starts getting HTTP traffic, requests will be split between the 2 always-ready instances. Once they're both processing requests, an extra instance will be added to the pre-warmed buffer. Now you're running on 3 instances, including the 2 always-ready ones and the extra pre-warmed one, and you'll be billed for all 3.<br><br>This process of pre-warming and scaling continues until you reach the maximum number of instances or the traffic decreases. You can't change the pre-warmed instance count setting through the Azure portal; you have to use the Azure CLI or PowerShell.|
|**Per-App Maximum**|You can set the maximum number of instances a web app can scale to. This is most common for cases where a downstream component like a database has limited throughput. The per-app maximum by default is unrestricted up to the app maximum, but you can set a value between 1 and the maximum burst defined for the App Service plan.|
 
## Frequently asked questions
- [How to monitor the current instance count and instance history?](#how-to-monitor-the-current-instance-count-and-instance-history)
- [What App Service platforms are supported?](#what-app-service-platforms-support-automatic-scaling)
- [Does App Service Environment support Automatic scaling?](#does-app-service-environment-support-automatic-scaling)
- [How is Automatic scaling different than Auto scale?](#how-is-automatic-scaling-different-than-auto-scale)
- [How does Automatic scaling work with existing Auto scale rules?](#how-does-automatic-scaling-work-with-existing-auto-scale-rules)
- [Should Always-on be enabled?](#should-always-on-be-enabled)
- [Can you use Automatic scaling with both Azure Functions and App Service web apps in the same App Service plan?](#can-automatic-scaling-be-used-with-both-azure-functions-and-app-service-web-apps-in-the-same-app-service-plan)
- [How do I set the minimum number of Automatic scaling instances](#how-do-i-set-the-minimum-number-of-instances)
- [How do I disable Automatic scaling](#how-do-i-disable-automatic-scaling)

### How to monitor the current instance count and instance history?
Use Application Insights [Live Metrics](../azure-monitor/app/live-stream.md) to check the current instance count, and [performanceCounters](../azure-functions/analyze-telemetry-data.md#query-telemetry-data) to check the instance count history.

### What App Service platforms support Automatic scaling?
- Automatic scaling is currently supported for Azure App Service for Windows, Linux and Windows container.
- Automatic scaling is available only for Azure App Services Premium Pv2 and Pv3 SKUs.     

### Does App Service Environment support Automatic scaling?
No, App Service Environment doesn't support Automatic scaling.

### How is Automatic scaling different than Auto scale?
App Service's Automatic scaling is different than Azure Autoscale.  Automatic scaling is a new built-in feature of the App Service platform that automatically handles web app scaling decisions for you. Azure Autoscale is a pre-existing Azure feature for defining schedule-based and resource-based scaling rules for your App Service plans. 

A quick comparison of various scale out and scale in options available for App Service web apps:

| | **Manual scaling** | **Auto scaling** | **Automatic scaling** |
| --- | --- | --- | --- |
| Available pricing Tiers	| Basic and Up | Standard and Up | Premium v2 and Premium v3 |
|Rule Based Scaling	|No	|Yes	|No(Scale out & in managed by the platform based on incoming HTTP traffic)|
|Schedule Based Scaling	|No	|Yes	|No|
|Always Ready Instances | No.(Your web app will always be running on number of manually scaled instances)	| No. (Your web app will be running on additional instances available during the scale out operation based on threshold defined for auto scale rules.	| Yes (Minimum of 1) |
|Pre-warmed Instances	|No	|No	|Yes (Defaulted to 1) |
|Per-App Maximum	|No	|No	|Yes|

### How does Automatic scaling work with existing Auto scale rules?
Once Automatic scaling for web apps is configured, existing Azure Autoscale rules and schedules (if any) will not be honored. Applications can use either Automatic scaling, or Azure Autoscale, but not both.

### Should Always-on be enabled?
Always-on should not be enabled on web apps with this Automatic scaling feature is turned on. App service scaling feature manages this once Automatic scaling is turned-on 

### Can Automatic scaling be used with both Azure Functions and App Service web apps in the same App Service plan?
You can only have Azure App Service web apps in the App Service plan where you wish to enable Automatic scaling. If you have existing Azure Functions apps in the same App Service plan, or if you create new Azure Functions apps, then Automatic scaling will be disabled. For Functions it is advised to use the Azure Functions Premium plan instead.

### How do I set the minimum number of instances

This enables the minimum number of instances available to your web app (per app scaling) and also enables the number of pre-warmed instances readily available (buffer instances).

```azurecli-interactive
 az webapp update -g <ResourceGroup> -n <app-name>  --minimum-elastic-instance-count <elastic-count> --prewarmed-instance-count <prewarmed-count>
```
 
- Replace `<ResourceGroup>` with the Resource Group name.
- Replace `<elastic-count>` with the minimum number of instances available to your web app for scaling.
- Replace `<prewarmed-count>`that your web app will always be available on (per app scaling) and also configures 1 as the number of pre-warmed instances readily available for your web app to scale (buffer instances). The default is 1 (as should be for most scenarios).

### How do I disable Automatic scaling?

The command below disables Automatic scaling for your existing App Service plan and all web apps within this plan:

```azurecli-interactive
az appservice plan update --name sampleAppServicePlan --resource-group sampleResourceGroup --elastic-scale false 
```

<a name="Next Steps"></a>

## More resources

* [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md)
* [Configure PremiumV3 tier for App Service](app-service-configure-premium-tier.md)
* [Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)
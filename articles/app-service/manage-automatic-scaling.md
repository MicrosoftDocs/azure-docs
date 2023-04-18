---
title: Automatic scaling
description: Learn how to scale automatically in Azure App Service with zero configuration.
ms.topic: article
ms.date: 04/13/2023
ms.author: msangapu

---
# Automatic scaling in Azure App Service

> [!NOTE]
> Automatic scaling is in preview.
>

The App Service platform offers an advanced Automatic scaling feature that ensures your web applications can handle varying levels of incoming HTTP requests. It automatically adjusts the number of running instances of your application based on the flow of incoming requests, scaling out to meet high traffic and scaling in during low traffic periods. Developers have granular control over scaling settings, including defining the minimum and maximum number of instances per web app, to optimize performance and avoid potential bottlenecks. Additionally, the platform addresses cold start issues with pre-warmed instances that act as a buffer when scaling out, ensuring smooth performance transitions. Automatic scaling is available for the Premium Pv2 and Pv3 SKUs and is billed on a per-second basis, using existing billing meters. Pre-warmed instances are also charged on a per-second basis.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use Automatic scaling.
>

### How Automatic scaling works

It's common to deploy multiple web apps to a single App Service plan. You may enable Automatic scaling for this App Service plan and configure different "always ready instances" and "per-app maximum" values for each of the web app. As your web app starts receiving incoming HTTP traffic , the platform monitors the load on the web apps and adds additional instances. Your web app may scale out to maximum burst defined for the App Service plan or a fewer number of instances if per-app maximum is defined. If multiple web apps within the App Service plan are required to scale out simultaneously they may share VM resources.

#### Automatic scaling concepts

The table below describes a few important concepts in Automatic scaling.

| **Concept** | **Description** |
| --- | --- |
|**Maximum Burst** (App Service plan)|You have the ability to set a limit on how many instances your App Service plan can expand to based on incoming HTTP requests. This means that all web apps within your App Service plan can grow up to the maximum limit that you set.<br><br>For premium v2 & v3 App Service plans, you can set a maximum burst limit of up to 30 instances. The maximum burst limit should be equal to or greater than the number of workers for the App Service plan.<br><br>The number of workers is determined as the highest number of "always ready instances" for any app within the plan. It's important to note that every App Service plan always has at least one active (billed) instance.|
|**Always ready instances**|You can set an app-level setting for your web app to ensure it's always ready and running on a specified number of instances. If the load on your web app exceeds the capacity of the always ready instances, additional instances are automatically added, up to the maximum burst limit you set for your App Service plan.<br><br>This app-level setting also determines the minimum number of instances allocated for your entire App Service plan. For example, if you have 3 web apps in the same App Service plan, and 2 of them have always ready instances set to one while the third web app has it set to 5, the minimum number of allocated instances for your App Service plan will be 5, and you will be billed for 5 instances. So it's important to remember that the always ready instances setting impacts the minimum number of instances for which you are billed.<br><br>The default minimum value for always ready instances of a web app is set to 1. It's important to note that you are charged for each instance allocated for your App Service plan, regardless of whether the web app is receiving incoming HTTP traffic or not.|
|**Pre-warmed Instances**|The pre-warmed instance count setting helps to buffer instances during HTTP scale events, providing a buffer of warmed instances. These pre-warmed instances continue to buffer until the maximum scale-out limit is reached. By default, the pre-warmed instance count is set to 1, and for most scenarios, it's recommended to keep it at 1.
<br><br>Let's consider an example scenario where you have set the "Always ready instances" for your web app to 2. When your web app is idle and not receiving any HTTP traffic, it's provisioned and running on 2 instances, and you're billed for these 2 always-ready instances, but not for a pre-warmed instance as no pre-warmed instance is allocated at this time.<br><br>As soon as your web app starts receiving HTTP traffic, incoming requests will be load balanced across the 2 always-ready instances. Once these 2 instances start processing events, an additional instance gets added to fill the pre-warmed buffer. Now, your app is running with 3 provisioned instances: the 2 always-ready instances and the third pre-warmed but inactive buffer, and you'll be billed for all 3 instances.<br><br>This sequence of scaling and pre-warming continues until the maximum instance count for the web app is reached or the load decreases, causing the platform to scale back in after a certain period of time. It's important to note that you cannot change the pre-warmed instance count setting in the portal; you must use the Azure CLI or Azure PowerShell|
|**Per-App Maximum**|You can set the maximum number of instances a web app can scale to. This is most common for cases where a downstream component like a database has limited throughput. The per-app maximum by default is unrestricted up to the app maximum, but you can set a value between 1 and the maximum burst defined for the App Service plan.|

## Scenarios for Automatic scaling:

Here's a few scenarios when you should use Automatic scaling:

- You want your web app to scale automatically without setting up an auto-scale schedule or set of auto-scale rules based on various resource metrics.
- You want your web apps within the same App Service plan to scale differently and independently of each other.
- A web app is connected to backend data sources like databases or legacy systems which may not be able to scale as fast as the web app. Automatic scaling allows you to set the maximum number of instances your App Service plan can scale to. This helps avoid scenarios where a backend is a bottleneck to scaling and is overwhelmed by the web app.


## Enable Automatic scaling using Azure CLI:

With Azure CLI, we've simplified Automatic scaling configuration:

### 1 - Enable Automatic scaling

This step enables Automatic scaling for your existing App Service plan and web apps within this plan.

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

### 2 - Set the minimum number of instances

This step enables minimum number of instances available to your web app (per app scaling) and also enables the number of pre-warmed instances readily available (buffer instances).

```azurecli-interactive
 az webapp update -g <ResourceGroup> -n <app-name>  --minimum-elastic-instance-count <elastic-count> --prewarmed-instance-count <prewarmed-count>
```
 
- Replace `<ResourceGroup>` with the Resource Group name.
- Replace `<elastic-count>` with the minimum number of instances available to your web app for scaling.
- Replace `<prewarmed-count>`that your web app will always be available on (per app scaling) and also configures 1 as the number of pre-warmed instances readily available for your web app to scale (buffer instances). The default is 1 (as should be for most scenarios).
 
## Frequently asked questions
- [How to monitor the current instance count and instance history?](#how-to-monitor-the-current-instance-count-and-instance-history)
- [What App Service platforms are supported?](#what-app-service-platforms-support-automatic-scaling)
- [Does App Service Environment support Automatic scaling?](#does-app-service-environment-support-automatic-scaling)
- [How is Automatic scaling different than Auto scale?](#how-is-automatic-scaling-different-than-auto-scale)
- [How does Automatic scaling work with existing Auto scale rules?](#how-does-automatic-scaling-work-with-existing-auto-scale-rules)
- [Should Always-on be enabled?](#should-always-on-be-enabled)
- [Can you use Automatic scaling with both Azure Functions and App Service web apps in the same App Service plan?](#can-automatic-scaling-be-used-with-both-azure-functions-and-app-service-web-apps-in-the-same-app-service-plan)
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
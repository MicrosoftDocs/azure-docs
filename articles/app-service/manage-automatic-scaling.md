---
title: Automatic scaling
description: Learn how to scale automatically in Azure App Service with zero configuration.
ms.topic: article
ms.date: 04/13/2023
ms.author: msangapu

---
# Automatic scaling in Azure App Service

The App Service platform offers an advanced automatic scaling feature that ensures your web applications can handle varying levels of incoming HTTP requests. It automatically adjusts the number of running instances of your application based on the flow of incoming requests, scaling out to meet high traffic and scaling in during low traffic periods. Developers have granular control over scaling settings, including defining the minimum and maximum number of instances per web app, to optimize performance and avoid potential bottlenecks. Additionally, the platform addresses cold start issues with pre-warmed instances that act as a buffer when scaling out, ensuring smooth performance transitions. Automatic scaling is available for the Premium Pv2 and Pv3 SKUs and is billed on a per-second basis, using existing billing meters. Pre-warmed instances are also charged on a per-second basis.

> [!IMPORTANT]
> [`Always ON`](./configure-common.md?tabs=portal#configure-general-settings) needs to be disabled to use Automatic scaling.
>

### How Automatic scaling works

It's common to deploy multiple web apps to a single app service plan. You may enable automatic scaling for this app service plan and configure different "always ready instances" and "per-app maximum" values for each of the web app. As your web app starts receiving incoming HTTP traffic , the platform monitors the load on the web apps and adds additional instances. Your web app may scale out to maximum burst defined for the app service plan or a fewer number of instances if per-app maximum is defined. If multiple web apps within the app service plan are required to scale out simultaneously they may share VM resources.

## Suggested scenarios for automatic scaling:

Here's a few scenarios when you should use Automatic scaling:

- You want your web app to scale automatically without setting up an auto-scale schedule or set of auto-scale rules based on various resource metrics.
- You want your web apps within the same app service plan to scale differently and independently of each other.
- A web app is connected to backend data sources like databases or legacy systems which may not be able to scale as fast as the web app. Automatic scaling allows you to set the maximum number of instances your app service plan can scale to. This helps avoid scenarios where a backend is a bottleneck to scaling and is overwhelmed by the web app.


## Enable Automatic scaling using Azure CLI:

With latest version of AZ CLI we have simplified configuring automatic scaling (Option 1 described below) :

### Step 1: Enable automatic scaling

This step enables automatic scaling for your existing app service plan and web apps within this plan. We also set the value of maximum automatic scale for the app service plan using this step.

```azurecli-interactive
az appservice plan update --name <<app service plan name>> --resource-group "resource group name" --elastic-scale true | false --max-elastic-worker-count <<max number of workers for app service plan automatic scale >>
```

```azurecli-interactive
az appservice plan update --name sampleAppServicePlan --resource-group sampleResourceGroup --elastic-scale true --max-elastic-worker-count 10 [This enables automatic scaling for the app service plan and sets the max automatic scale out limit of the app service plan as 10]
```
 

*** Value of max-elastic-worker-count should be less than or equal to Maximum instances that a premium SKU app service plan can scale out

 

*** Value of max-elastic-worker-count should be greater than or equal to current instance count (NumberOfWorkers) for your app service plan

 

*** In some scenarios while setting the value of "--elastic-scale true" for an existing app service plan for App service Linux you may receive an error message (“Operation returned an invalid status 'Bad Request'”). In such scenarios follow below mentioned steps:

 

Execute above step using the -- debug flag to return details about the error
 

You can now view detailed error message which should be similar to "Message":"Requested feature is not available in resource group <<Your Resource Group Name>>. Please try using a different resource group or create a new one."

 

You should now create a new resource group and an app service plan (It is recommended to use PV3 SKU for the new app service plan) and then perform step 1
 

### Step 2: Set the minimum number of instances

This step enables minimum number of instances that your web app will always be available on (per app scaling) and also enables the number of pre-warmed instances readily available for your web app to scale (buffer instances).

 
```azurecli-interactive
az webapp update -g <<resource group name>> -n <<web app name>> --minimum-elastic-instance-count <<number of always available instances for the web app>> --prewarmed-instance-count <<number of buffer instances available for the web app >>

 az webapp update -g sampleResourceGroup -n sampleWebApp  --minimum-elastic-instance-count 5 --prewarmed-instance-count 1 [This configures 5 as the minimum number of instances that your web app will always be available on (per app scaling) and also configures 1 as the number of pre-warmed instances readily available for your web app to scale (buffer instances).
```
 > [!NOTE]
> Default value of prewarmed-instance-count is set as 1 and for most scenarios this value should remain as 1
>
 

*** Assuming that your web app has five always ready instances (minimum-elastic-instance-count 5) and the default of one pre-warmed instance. When your web app is idle and no HTTP requests are received, the app is provisioned and running with five instances. At this time, you aren't billed for a pre-warmed instance as the always-ready instances aren't used, and no pre-warmed instance is allocated. Once your web app starts receiving HTTP Requests and the five always-ready instances become active, and a pre-warmed instance is allocated and the billing for it starts. If the rate of HTTP Requests received by your web app continues to increase, the five active instances are eventually used and when App services decides to scale beyond five instances, it scales into the pre-warmed instance. When that happens, there are now six active instances, and a seventh instance is instantly provisioned and fill the pre-warmed buffer. This sequence of scaling and pre-warming continues until the maximum instance count for the app is reached. No instances are pre-warmed or activated beyond the maximum.

 

## Disable Automatic scaling

This step disables automatic scaling for your existing app service plan and web apps within this plan

 
```azurecli-interactive
az appservice plan update --name <<app service plan name>> --resource-group "resource group name" --elastic-scale true | false
```
 
```azurecli-interactive
az appservice plan update --name sampleAppServicePlan --resource-group sampleResourceGroup --elastic-scale false  [This disables automatic scaling for the app service plan]
```

## Automatic scaling concepts

### Maximum Burst (App service Plan)

You can define maximum number of instances your app service plan can scale out to based on incoming HTTP requests. All web apps within this App service plan can scale out up to the maximum burst defined for the App service plan. For a premium v2 & v3 app service plans you can define a value of up to 30 instances as the maximum burst. Maximum burst value should be greater than or equal to the value of number of workers for the app service plan. Number of workers is determined as the maximum value of “always ready instances” for any app within this plan.

PS: Every app service plan has at least one active (billed) instance at all times.

### Always ready instances

This is an app level setting using which you can have your web app always ready and running on a specified number of instances. If load exceeds what your always ready instances can handle, additional instances are added as necessary, up to your specified maximum burst for the app service plan. This app-level setting also controls your plan's minimum instances. For example, consider having three web apps in the same App service plan, when two of the web apps have always ready instances set to one and the third web app has always ready instances set to five, the minimum number of allocated instances for your whole app service plan is five and you will be billed for 5 instances. So it’s important to remember that always ready instances impacts the minimum number of instances for which your plan is billed. The minimum value for always ready instance of a web app is defaulted to 1. 

PS: You are charged for each instance allocated for your app service plan regardless of web app receiving or not receiving incoming HTTP traffic.

### Pre-warmed Instances

The pre-warmed instance count setting provides warmed instances as a buffer during HTTP scale events. Pre-warmed instances continue to buffer until the maximum scale-out limit is reached. The default pre-warmed instance count is 1 and, for most scenarios, this value should remain as 1. Consider an example scenario wherein you have defined “Always ready instances” for your web app as two. When this web app is idle and no HTTP traffic is received ,the web app is provisioned and running on two instances. At this time, you're billed for the two always ready instances but aren't billed for a pre-warmed instance as no pre-warmed instance is allocated. As your web app starts receiving HTTP traffic, incoming requests will be load balanced across the two always-ready instances. As soon as those two instances start processing events, an instance gets added to fill the pre-warmed buffer. The app is now running with three provisioned instances: the two always ready instances, and the third pre-warmed and inactive buffer. You're billed for the three instances. This sequence of scaling and pre-warming continues until the maximum instance count for the web app is reached or load decreases causing the platform to scale back in after a period.

PS: You can't change the pre-warmed instance count setting in the portal, you must instead use the Azure CLI or Azure PowerShell.

### Per-App Maximum

You can set the maximum number of instances a web app can scale to. This is most common for cases where a downstream component like a database has limited throughput.. The per-app maximum by default is unrestricted up to the app maximum ,but you can set a value between 1 and the maximum burst defined for the app service plan.

## Manual scaling vs. Auto scaling vs. Automatic scaling

Quick comparison of various scale out & in options available for App service web apps:

| | Manual scaling | Auto scaling | Automatic scaling |
| --- | --- | --- | --- |
| Available pricing Tiers	| Basic and Up | Standard and Up | Premium v2 and Premium v3 |
|Rule Based Scaling	|No	|Yes	|No(Scale out & in managed by the platform based on incoming HTTP traffic)|
|Schedule Based Scaling	|No	|Yes	|No|
|Always Ready Instances | No.(Your web app will always be running on number of manually scaled instances)	| No. (Your web app will be running on additional instances available during the scale out operation based on threshold defined for auto scale rules.	| Yes (Minimum of 1) |
|Pre-warmed Instances	|No	|No	|Yes (Defaulted to 1) |
|Per-App Maximum	|No	|No	|Yes|


## FAQ:
-	The App Service automatic scaling feature is currently in preview.
-	Automatic scaling is currently supported for Azure App Service for Windows, Linux and Windows container
-	App Service Environments do not support automatic scalingAutomatic scaling is available only for Azure App Services Premium Pv2 and Pv3 SKUs.     
-	App Service’s automatic scaling feature is different than Azure Autoscale.  Automatic scaling is a new built-in feature of the App Service platform that automatically handles web app scaling decisions for you. Azure Autoscale is a pre-existing Azure feature for defining schedule-based and resource-based scaling rules for your app service plans. 
-	Once automatic scaling for web apps is configured, existing Azure Autoscale rules and schedules (if any) will not be honored. Applications can use either automatic scaling, or Azure Autoscale, but not both. 
-	Always-on should not be enabled on web apps with this automatic scaling feature is turned on. App service scaling feature manages this once automatic scaling is turned-on 
-	You can only have Azure App Service web apps in the app service plan where you wish to enable automatic scaling. If you have existing Azure Functions apps in the same app service plan, or if you create new Azure Functions apps, then automatic scaling will be disabled. For Functions it is advised to use the Azure Functions Premium plan instead.

<a name="Next Steps"></a>

## More resources

* [Scale instance count manually or automatically](../azure-monitor/autoscale/autoscale-get-started.md)
* [Configure PremiumV3 tier for App Service](app-service-configure-premium-tier.md)
* [Tutorial: Run a load test to identify performance bottlenecks in a web app](../load-testing/tutorial-identify-bottlenecks-azure-portal.md)
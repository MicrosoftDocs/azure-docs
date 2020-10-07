---
title: Azure Functions Premium plan 
description: Details and configuration options (VNet, no cold start, unlimited execution duration) for the Azure Functions Premium plan.
author: jeffhollan
ms.topic: conceptual
ms.date: 08/28/2020
ms.author: jehollan
ms.custom:
- references_regions 
- fasttrack-edit

---

# Azure Functions Premium plan

The Azure Functions Premium plan (sometimes referred to as Elastic Premium plan)  is a hosting option for function apps. The Premium plan provides features like VNet connectivity, no cold start, and premium hardware.  Multiple function apps can be deployed to the same Premium plan, and the plan allows you to configure compute instance size, base plan size, and maximum plan size.  For a comparison of the Premium plan and other plan and hosting types, see [function scale and hosting options](functions-scale.md).

## Create a Premium plan

[!INCLUDE [functions-premium-create](../../includes/functions-premium-create.md)]

You can also create a Premium plan using [az functionapp plan create](/cli/azure/functionapp/plan#az-functionapp-plan-create) in the Azure CLI. The following example creates an _Elastic Premium 1_ tier plan:

```azurecli-interactive
az functionapp plan create --resource-group <RESOURCE_GROUP> --name <PLAN_NAME> \
--location <REGION> --sku EP1
```

In this example, replace `<RESOURCE_GROUP>` with your resource group and `<PLAN_NAME>` with a name for your plan that is unique in the resource group. Specify a [supported `<REGION>`](https://azure.microsoft.com/global-infrastructure/services/?products=functions). To create a Premium plan that supports Linux, include the `--is-linux` option.

With the plan created, you can use [az functionapp create](/cli/azure/functionapp#az-functionapp-create) to create your function app. In the portal, both the plan and the app are created at the same time. For an example of a complete Azure CLI script, see [Create a function app in a Premium plan](scripts/functions-cli-create-premium-plan.md).

## Features

The following features are available to function apps deployed to a Premium plan.

### Always ready instances

If no events and executions occur today in the Consumption plan, your app may scale in to zero instances. When new events come in, a new instance needs to be specialized with your app running on it.  Specializing new instances may take some time depending on the app.  This additional latency on the first call is often called app cold start.

In the Premium plan, you can have your app always ready on a specified number of instances.  The maximum number of always ready instances is 20.  When events begin to trigger the app, they are routed to the always ready instances first.  As the function becomes active, additional instances will be warmed as a buffer.  This buffer prevents cold start for new instances required during scale.  These buffered instances are called [pre-warmed instances](#pre-warmed-instances).  With the combination of the always ready instances and a pre-warmed buffer, your app can effectively eliminate cold start.

> [!NOTE]
> Every premium plan will have at least one active (billed) instance at all times.

You can configure the number of always ready instances in the Azure portal by selected your **Function App**, going to the **Platform Features** tab, and selecting the **Scale Out** options. In the function app edit window, always ready instances are specific to that app.

![Elastic Scale Settings](./media/functions-premium-plan/scale-out.png)

You can also configure always ready instances for an app with the Azure CLI.

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.minimumElasticInstanceCount=<desired_always_ready_count> --resource-type Microsoft.Web/sites 
```

#### Pre-warmed instances

Pre-warmed instances are the number of instances warmed as a buffer during scale and activation events.  Pre-warmed instances continue to buffer until the maximum scale-out limit is reached.  The default pre-warmed instance count is 1, and for most scenarios should remain as 1.  If an app has a long warm up (like a custom container image), you may wish to increase this buffer.  A pre-warmed instance will become active only after all active instances have been sufficiently utilized.

Consider this example of how always ready instances and pre-warmed instances work together.  A premium function app has five always ready instances configured, and the default of one pre-warmed instance.  When the app is idle and no events are triggering, the app will be provisioned and running on five instances.  At this time, you will not be billed for a pre-warmed instance as the always ready instances aren't used, and no pre-warmed instance is even allocated.

As soon as the first trigger comes in, the five always ready instances become active, and a pre-warmed instance is allocated.  The app is now running with six provisioned instances: the five now-active always ready instances, and the sixth pre-warmed and inactive buffer.  If the rate of executions continues to increase, the five active instances will eventually be utilized.  When the platform decides to scale beyond five instances, it will scale into the pre-warmed instance.  When that happens, there will now be six active instances, and a seventh instance will instantly be provisioned and fill the pre-warmed buffer.  This sequence of scaling and pre-warming will continue until the maximum instance count for the app is reached.  No instances will be pre-warmed or activated beyond the maximum.

You can modify the number of pre-warmed instances for an app using the Azure CLI.

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.preWarmedInstanceCount=<desired_prewarmed_count> --resource-type Microsoft.Web/sites 
```

#### Maximum instances for an app

In addition to the [plan maximum instance count](#plan-and-sku-settings), you can configure a per-app maximum.  The app maximum can be configured using the [app scale limit](./functions-scale.md#limit-scale-out).

### Private network connectivity

Azure Functions deployed to a Premium plan takes advantage of [new VNet integration for web apps](../app-service/web-sites-integrate-with-vnet.md).  When configured, your app can communicate with resources within your VNet or secured via service endpoints.  IP restrictions are also available on the app to restrict incoming traffic.

When assigning a subnet to your function app in a Premium plan, you need a subnet with enough IP addresses for each potential instance. We require an IP block with at least 100 available addresses.

For more information, see [integrate your function app with a VNet](functions-create-vnet.md).

### Rapid elastic scale

Additional compute instances are automatically added for your app using the same rapid scaling logic as the Consumption plan. Apps in the same App Service Plan scale independently from one another based on the needs of an individual app. However, Functions apps in the same App Service Plan share VM resources to help reduce costs, when possible. The number of apps associated with a VM depends on the footprint of each app and the size of the VM.

To learn more about how scaling works, see [Function scale and hosting](./functions-scale.md#how-the-consumption-and-premium-plans-work).

### Longer run duration

Azure Functions in a Consumption plan are limited to 10 minutes for a single execution.  In the Premium plan, the run duration defaults to 30 minutes to prevent runaway executions. However, you can [modify the host.json configuration](./functions-host-json.md#functiontimeout) to make the duration unbounded for Premium plan apps (guaranteed 60 minutes).

## Plan and SKU settings

When you create the plan, there are two plan size settings: the minimum number of instances (or plan size) and the maximum burst limit.

If your app requires instances beyond the always ready instances, it can continue to scale out until the number of instances hits the maximum burst limit.  You are billed for instances beyond your plan size only while they are running and allocated to you, on a per-second basis.  We will make a best effort at scaling your app out to its defined maximum limit.

You can configure the plan size and maximums in the Azure portal by selecting the **Scale Out** options in the plan or a function app deployed to that plan (under **Platform Features**).

You can also increase the maximum burst limit from the Azure CLI:

```azurecli-interactive
az resource update -g <resource_group> -n <premium_plan_name> --set properties.maximumElasticWorkerCount=<desired_max_burst> --resource-type Microsoft.Web/serverfarms 
```

The minimum for every plan will be at least one instance.  The actual minimum number of instances will be autoconfigured for you based on the always ready instances requested by apps in the plan.  For example, if app A requests five always ready instances, and app B requests two always ready instances in the same plan, the minimum plan size will be calculated as five.  App A will be running on all 5, and app B will only be running on 2.

> [!IMPORTANT]
> You are charged for each instance allocated in the minimum instance count regardless if functions are executing or not.

In most circumstances this autocalculated minimum should be sufficient.  However, scaling beyond the minimum occurs at a best effort.  It is possible, though unlikely, that at a specific time scale-out could be delayed if additional instances are unavailable.  By setting a minimum higher than the autocalculated minimum, you reserve instances in advance of scale-out.

Increasing the calculated minimum for a plan can be done using the Azure CLI.

```azurecli-interactive
az resource update -g <resource_group> -n <premium_plan_name> --set sku.capacity=<desired_min_instances> --resource-type Microsoft.Web/serverfarms 
```

### Available instance SKUs

When creating or scaling your plan, you can choose between three instance sizes.  You will be billed for the total number of cores and memory provisioned, per second that each instance is allocated to you.  Your app can automatically scale out to multiple instances as needed.  

|SKU|Cores|Memory|Storage|
|--|--|--|--|
|EP1|1|3.5GB|250GB|
|EP2|2|7GB|250GB|
|EP3|4|14GB|250GB|

### Memory utilization considerations
Running on a machine with more memory does not always mean that your function app will use all available memory.

For example, a JavaScript function app is constrained by the default memory limit in Node.js. To increase this fixed memory limit, add the app setting `languageWorkers:node:arguments` with a value of `--max-old-space-size=<max memory in MB>`.

## Region Max Scale Out

Below are the currently supported maximum scale-out values for a single plan in each region and OS configuration. To request an increase, please open a support ticket.

See the complete regional availability of Functions here: [Azure.com](https://azure.microsoft.com/global-infrastructure/services/?products=functions)

|Region| Windows | Linux |
|--| -- | -- |
|Australia Central| 100 | Not Available |
|Australia Central 2| 100 | Not Available |
|Australia East| 100 | 20 |
|Australia Southeast | 100 | 20 |
|Brazil South| 100 | 20 |
|Canada Central| 100 | 20 |
|Central US| 100 | 20 |
|China East 2| 100 | 20 |
|China North 2| 100 | 20 |
|East Asia| 100 | 20 |
|East US | 100 | 20 |
|East US 2| 100 | 20 |
|France Central| 100 | 20 |
|Germany West Central| 100 | Not Available |
|Japan East| 100 | 20 |
|Japan West| 100 | 20 |
|Korea Central| 100 | 20 |
|Korea South| Not Available | 20 |
|North Central US| 100 | 20 |
|North Europe| 100 | 20 |
|Norway East| 100 | 20 |
|South Central US| 100 | 20 |
|South India | 100 | Not Available |
|Southeast Asia| 100 | 20 |
|Switzerland North| 100 | Not Available |
|Switzerland West| 100 | Not Available |
|UK South| 100 | 20 |
|UK West| 100 | 20 |
|USGov Arizona| 100 | 20 |
|USGov Virginia| 100 | 20 |
|USNat East| 100 | Not Available |
|USNat West| 100 | Not Available |
|West Europe| 100 | 20 |
|West India| 100 | 20 |
|West Central US| 100 | 20 |
|West US| 100 | 20 |
|West US 2| 100 | 20 |

## Next steps

> [!div class="nextstepaction"]
> [Understand Azure Functions scale and hosting options](functions-scale.md)

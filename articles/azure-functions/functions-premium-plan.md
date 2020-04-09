---
title: Azure Functions Premium plan 
description: Details and configuration options (VNet, no cold start, unlimited execution duration) for the Azure Functions Premium plan.
author: jeffhollan
ms.topic: conceptual
ms.date: 10/16/2019
ms.author: jehollan

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

### Pre-warmed instances

If no events and executions occur today in the Consumption plan, your app may scale in to zero instances. When new events come in, a new instance needs to be specialized with your app running on it.  Specializing new instances may take some time depending on the app.  This additional latency on the first call is often called app cold start.

In the Premium plan, you can have your app pre-warmed on a specified number of instances, up to your minimum plan size.  Pre-warmed instances also let you pre-scale an app before high load. As the app scales out, it first scales into the pre-warmed instances. Additional instances continue to buffer out and warm immediately in preparation for the next scale operation. By having a buffer of pre-warmed instances, you can effectively avoid cold start latencies.  Pre-warmed instances is a feature of the Premium plan, and you need to keep at least one instance running and available at all times the plan is active.

You can configure the number of pre-warmed instances in the Azure portal by selected your **Function App**, going to the **Platform Features** tab, and selecting the **Scale Out** options. In the function app edit window, pre-warmed instances is specific to that app, but the minimum and maximum instances apply to your entire plan.

![Elastic Scale Settings](./media/functions-premium-plan/scale-out.png)

You can also configure pre-warmed instances for an app with the Azure CLI.

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.preWarmedInstanceCount=<desired_prewarmed_count> --resource-type Microsoft.Web/sites
```

### Private network connectivity

Azure Functions deployed to a Premium plan takes advantage of [new VNet integration for web apps](../app-service/web-sites-integrate-with-vnet.md).  When configured, your app can communicate with resources within your VNet or secured via service endpoints.  IP restrictions are also available on the app to restrict incoming traffic.

When assigning a subnet to your function app in a Premium plan, you need a subnet with enough IP addresses for each potential instance. We require an IP block with at least 100 available addresses.

For more information, see [integrate your function app with a VNet](functions-create-vnet.md).

### Rapid elastic scale

Additional compute instances are automatically added for your app using the same rapid scaling logic as the Consumption plan.  To learn more about how scaling works, see [Function scale and hosting](./functions-scale.md#how-the-consumption-and-premium-plans-work).

### Longer run duration

Azure Functions in a Consumption plan are limited to 10 minutes for a single execution.  In the Premium plan, the run duration defaults to 30 minutes to prevent runaway executions. However, you can [modify the host.json configuration](./functions-host-json.md#functiontimeout) to make this unbounded for Premium plan apps (guaranteed 60 minutes).

## Plan and SKU settings

When you create the plan, you configure two settings: the minimum number of instances (or plan size) and the maximum burst limit.  Minimum instances are reserved and always running.

> [!IMPORTANT]
> You are charged for each instance allocated in the minimum instance count regardless if functions are executing or not.

If your app requires instances beyond your plan size, it can continue to scale out until the number of instances hits the maximum burst limit.  You are billed for instances beyond your plan size only while they are running and rented to you.  We will make a best effort at scaling your app out to its defined maximum limit, whereas the minimum plan instances are guaranteed for your app.

You can configure the plan size and maximums in the Azure portal by selecting the **Scale Out** options in the plan or a function app deployed to that plan (under **Platform Features**).

You can also increase the maximum burst limit from the Azure CLI:

```azurecli-interactive
az resource update -g <resource_group> -n <premium_plan_name> --set properties.maximumElasticWorkerCount=<desired_max_burst> --resource-type Microsoft.Web/serverfarms 
```

### Available instance SKUs

When creating or scaling your plan, you can choose between three instance sizes.  You will be billed for the total number of cores and memory consumed per second.  Your app can automatically scale out to multiple instances as needed.  

|SKU|Cores|Memory|Storage|
|--|--|--|--|
|EP1|1|3.5GB|250GB|
|EP2|2|7GB|250GB|
|EP3|4|14GB|250GB|

### Memory utilization considerations
Running on a machine with more memory does not always mean that your function app will use all available memory.

For example, a JavaScript function app is constrained by the default memory limit in Node.js. To increase this fixed memory limit, add the app setting `languageWorkers:node:arguments` with a value of `--max-old-space-size=<max memory in MB>`.

## Region Max Scale Out

Below are the currently supported maximum scale out values for a single plan in each region and OS configuration. To request an increase please open a support ticket.

See the complete regional availability of Functions here: [Azure.com](https://azure.microsoft.com/global-infrastructure/services/?products=functions)

|Region| Windows | Linux |
|--| -- | -- |
|Australia Central| 20 | Not Available |
|Australia Central 2| 20 | Not Available |
|Australia East| 100 | 20 |
|Australia Southeast | 100 | 20 |
|Brazil South| 60 | 20 |
|Canada Central| 100 | 20 |
|Central US| 100 | 20 |
|East Asia| 100 | 20 |
|East US | 100 | 20 |
|East US 2| 100 | 20 |
|France Central| 100 | 20 |
|Germany West Central| 100 | Not Available |
|Japan East| 100 | 20 |
|Japan West| 100 | 20 |
|Korea Central| 100 | 20 |
|North Central US| 100 | 20 |
|North Europe| 100 | 20 |
|Norway East| 20 | 20 |
|South Central US| 100 | 20 |
|South India | 100 | Not Available |
|Southeast Asia| 100 | 20 |
|UK South| 100 | 20 |
|UK West| 100 | 20 |
|West Europe| 100 | 20 |
|West India| 100 | 20 |
|West Central US| 20 | 20 |
|West US| 100 | 20 |
|West US 2| 100 | 20 |

## Next steps

> [!div class="nextstepaction"]
> [Understand Azure Functions scale and hosting options](functions-scale.md)

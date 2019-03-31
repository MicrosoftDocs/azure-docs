---
title: Azure Functions premium plan (preview) | Microsoft Docs
description: Details and configuration options (VNet, no cold start, unlimited execution duration) for the Azure Functions premium plan.
services: functions
author: jeffhollan
manager: jeconnoc

ms.assetid:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 01/25/2019
ms.author: jehollan

---

# Azure Functions premium plan (preview)

The Azure Functions premium plan is a hosting option for function apps. The premium plan provides features like VNet connectivity, no cold start, and premium hardware.  Multiple function apps can be deployed to the same premium plan, and the plan allows you to configure compute instance size, base plan size, and maximum plan size.  For a comparison of the premium plan and other plan and hosting types, see [function scale and hosting options](functions-scale.md)

> [!NOTE]
> You can move between consumption and premium plan for an app that is already created by modifying the serverFarmId property of the function site resource.

## Create a premium plan

[!INCLUDE [functions-premium-create](../../includes/functions-premium-create.md)]

## Features

The following features are available to apps deployed to an Azure Function premium plan.

### Pre-warmed instances

If no events and executions occur today in the consumption plan, your app may scale down to zero instances. When new events come in, a new instance needs to be specialized with your app running on it.  Specializing new instances may take some time depending on the app.  This additional latency on the first call is often called app cold start.

In the Azure Functions premium plan, you can have your app pre-warmed on a specified number of instances.  Pre-warmed  instances allow you to avoid cold start.  Pre-warmed instances also give you the ability to pre-scale an app before high load. As the app scales out, it will first scale into the pre-warmed instances. The plan will immediately continue to buffer out and warm additional instances in preparation for the next scale operation. By having a buffer of pre-warmed instances, you can effectively avoid cold start.  Pre-warmed instances is a feature of the premium plan, and as such you need at least one instance running and available at all times the plan is active.

You can configure the number of pre-warmed instances in the Azure portal by selecting  **Scale Out** in the **Platform Features** tab.

![Elastic Scale Settings](./media/functions-premium-plan/scale-out.png)

You can also configure pre-warmed instances for an app with the Azure CLI

```azurecli-interactive
az resource update -g <resource_group> -n <function_app_name>/config/web --set properties.preWarmedInstanceCount=<desired_prewarmed_count> --resource-type Microsoft.Web/sites
```

### Private network connectivity

Azure Functions deployed to a premium plan take advantage of [new VNet integration for web apps](../app-service/web-sites-integrate-with-vnet.md#new-vnet-integration).  When configured, your app can communicate with resources within your VNet or secured via service endpoints.  IP restrictions are also available on the app to restrict incoming traffic.

When assigning a subnet to your premium function app, you need a subnet with enough IP addresses for each potential instance. Though the maximum number of instances may vary during the preview, we require an IP block with at least 100 available addresses.

More information can be found on how to [integrate your function app with a VNet](functions-create-vnet.md)

### Rapid elastic scale

Additional compute instances will be added for your app automatically using the same rapid scaling logic as the consumption plan.  More info on how scaling works can be found in [function scale and hosting](./functions-scale.md#How-the-consumption-and-premium-plans-work).

### Unbounded run duration

Azure Functions in a consumption plan are limited to 10 minutes for a single execution.  In the premium plan, the run duration is unbounded.  By default an app is limited to 30 minutes (to prevent runaway executions), but you can [modify the host.json configuration](./functions-host-json.md#functiontimeout) to make this unbounded.

## Plan and SKU settings

When you create the plan, you configure two settings: the minimum number of instances (or plan size) and the maximum burst limit.  The minimum instances for a premium plan is 1, and the maximum burst during the preview is 20.  Minimum instances are reserved and always running.

> [!IMPORTANT]
> You are charged for each instance allocated in the minimum instance count regardless if functions are executing or not.

If your app requires instances beyond your plan size, it can continue to scale out until the number of instances hits the maximum burst limit.  You are billed for instances beyond your plan size only while they are running and rented to you.  We will make a best effort at scaling your app out to its defined maximum limit, whereas the minimum plan instances are guaranteed for your app.

You can configure the plan size and maximums in the Azure portal by selected the **Scale Out** options in the plan or a function app deployed to that plan (under **Platform Features**).

You can also increase the maximum burst limit from the Azure CLI:

```azurecli-interactive
az resource update -g <resource_group> -n <premium_plan_name> --set properties.maximumElasticWorkerCount=<desired_max_burst> --resource-type Microsoft.Web/serverfarms 
```

### Available instance SKUs

When creating our scaling your plan, you can choose between three instance sizes.  You will be billed for the total number of cores and memory consumed per second.  Your app can automatically scale out to multiple instances as needed.  

|SKU|Cores|Memory|Storage|
|--|--|--|--|
|EP1|1|3.5GB|250GB|
|EP2|2|7GB|250GB|
|EP3|4|14GB|250GB|

## Regions

Below are the currently supported regions for the public preview.

|Region|
|--|
|Australia East|
|Australia Souteast|
|Canada Central|
|Central India|
|Central US|
|East Asia|
|East US 2|
|France Central|
|Japan West|
|Korea Central|
|North Europe|
|South Central US|
|South India|
|Southeast Asia|
|UK West|
|West Europe|
|West India|
|West US|

## Known Issues

You can track the status of known issues of the [public preview on GitHub](https://github.com/Azure/Azure-Functions/wiki/Premium-plan-known-issues).

## Next steps

> [!div class="nextstepaction"]
> [Understand Azure Functions scale and hosting options](functions-scale.md)
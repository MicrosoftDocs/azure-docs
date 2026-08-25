---
title: Event-driven scaling in Azure Functions
description: Learn how Azure Functions automatically scales your function apps based on event demand in the Flex Consumption, Premium, and Consumption hosting plans.
ms.date: 08/03/2026
ms.topic: concept-article
ms.service: azure-functions
zone_pivot_groups: functions-hosting-plan
ms.custom:
  - build-2024
  - ignite-2024
---
# Event-driven scaling in Azure Functions

Azure Functions automatically scales out your function app by adding instances based on the number of incoming events. How your app scales, including the rate of scale-out, maximum instances, and whether functions scale independently, depends on your hosting plan:

| Hosting plan | Event-driven scaling | Details |
| --- | --- | --- |
| [Flex Consumption plan](flex-consumption-plan.md) | ✓ Per-function scaling | Select **Flex Consumption plan** above |
| [Premium plan](functions-premium-plan.md) | ✓ App-level scaling | Select **Premium plan** above |
| [Consumption plan](consumption-plan.md) (legacy) | ✓ App-level scaling | Select **Consumption plan** above |
| [Dedicated (App Service) plan](dedicated-plan.md) | Not applicable | Uses [App Service scaling](../app-service/manage-scale-up.md) |
| [Container Apps](functions-container-apps-hosting.md) | Not applicable | Uses [Container Apps scaling](../container-apps/scale-app.md) |

::: zone pivot="dedicated-plan"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

Event-driven scaling doesn't apply to the Dedicated (App Service) plan. The Dedicated plan doesn't scale dynamically based on events. For scaling options in the Dedicated plan, see [Scale up an app in Azure App Service](../app-service/manage-scale-up.md).

::: zone-end

::: zone pivot="container-apps"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

Event-driven scaling doesn't apply when running functions on Azure Container Apps. When hosted on Container Apps, scaling is managed by the Container Apps environment. For more information, see [Set scaling rules in Azure Container Apps](../container-apps/scale-app.md).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,consumption-plan"

## Runtime scaling

Azure Functions uses a component called the *scale controller* to monitor the rate of events and determine whether to scale out or scale in. The scale controller uses heuristics for each trigger type. For example, when you're using an Azure Queue storage trigger, it uses [target-based scaling](functions-target-based-scaling.md).

:::image type="content" source="./media/functions-scale/central-listener.png" alt-text="Diagram showing the scale controller monitoring events and creating instances.":::

::: zone-end

::: zone pivot="consumption-plan,premium-plan"

The unit of scale for Azure Functions is the function app. When the function app scales out, it allocates more resources to run multiple instances of the Azure Functions host. Conversely, as compute demand decreases, the scale controller removes function host instances. The number of instances is eventually "scaled in" when no functions are running within a function app.

::: zone-end

::: zone pivot="consumption-plan"

Each instance of the Functions host in the Consumption plan is limited, typically to 1.5 GB of memory and one CPU. An instance of the host supports the entire function app, so all functions in an app share resources and scale at the same time. When function apps share the same Consumption plan, they still scale independently.

::: zone-end

::: zone pivot="premium-plan"

The specific size of the Premium plan determines the available memory and CPU for all apps in that plan on that instance. The plan scales out its instances based on the scaling needs of the apps in the plan, and the apps scale within the plan as needed.

::: zone-end

::: zone pivot="flex-consumption-plan"

Unlike the other dynamic plans, the Flex Consumption plan uses a deterministic per-function scaling model. In this model, each function is independently scaled based on the number of events and concurrency settings, except for HTTP, Blob, and orchestration (Durable) triggered functions which scale in their own groups. For more information, see [Per-function scaling](#per-function-scaling).

The platform manages the *rate* at which it adds instances (the scale curve), separately from the [maximum instance count](#limit-scale-out). For more information about how the scale curve works, throttling behavior, and best practices for high-rate scaling, see [Scale-out rate](flex-consumption-plan.md#scale-out-rate).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,consumption-plan"

## Cold start

If your function app stays idle for a few minutes, the platform might scale the number of instances running your app down to zero. The next request experiences the added latency of scaling from zero to one. This latency is referred to as a *cold start*. The number of dependencies your function app requires can affect the cold start time. Cold start is more of an issue for synchronous operations, such as HTTP triggers that must return a response. If cold starts are impacting your functions, consider using a plan that supports mitigation strategies:

| Plan | Cold start mitigation | Details |
| --- | --- | --- |
| [Flex Consumption plan](flex-consumption-plan.md#always-ready-instances) | Always ready instances | Configurable per function group |
| [Premium plan](functions-premium-plan.md#eliminate-cold-starts) | Prewarmed and always ready instances | Minimum of one instance always running |
| [Consumption plan](consumption-plan.md) (legacy) | None | Cold starts are expected in this plan |
| [Dedicated plan](./dedicated-plan.md#always-on) | Always on setting | App runs continuously; no dynamic scaling |

As you can see in this table, both Flex Consumption and Premium plans provide ways to eliminate cold starts in your apps. 

## Understanding scaling behaviors

Scaling can vary based on several factors. Apps scale differently based on the triggers and language selected. Be aware of these intricacies of scaling behaviors:

* **Maximum instances:** A single function app scales out to a [maximum allowed by the plan](functions-scale.md#scale). However, a single instance [can process more than one message or request at a time](functions-concurrency.md#concurrency-in-azure-functions). You can [specify a lower maximum](#limit-scale-out) to throttle scale as required.

::: zone-end

::: zone pivot="consumption-plan,premium-plan"

* **New instance rate:** For HTTP triggers, the platform allocates new instances at most once per second. For non-HTTP triggers, the platform allocates new instances at most once every 30 seconds. Scaling is faster when running in a [Premium plan](functions-premium-plan.md).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,consumption-plan"

* **Target-based scaling:** Target-based scaling provides a fast and intuitive scaling model for customers. Currently, this scaling method is supported for Service Bus queues and topics, Storage queues, Event Hubs, Apache Kafka, and Azure Cosmos DB extensions. Make sure to review [target-based scaling](./functions-target-based-scaling.md) to understand their scaling behavior.

::: zone-end

::: zone pivot="flex-consumption-plan"

* **Per-function scaling:** With some notable exceptions, functions running in the Flex Consumption plan scale on independent instances. The exceptions include HTTP triggers and Blob storage (Event Grid) triggers. Each of these trigger types scale together as a group on the same instances. Likewise, the triggers of all Durable Functions also share instances and scale together. For more information, see [per-function scaling](#per-function-scaling).

::: zone-end

::: zone pivot="consumption-plan,premium-plan"

* **Maximum monitored triggers:** Currently, the scale controller can only monitor up to 100 triggers to make scaling decisions. When your app has more than 100 event-based triggers, scale decisions are based on only the first 100 triggers that execute. For more information, see [Best practices and patterns for scalable apps](#best-practices-and-patterns-for-scalable-apps).  

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,consumption-plan"

## Limit scale-out

You might decide to restrict the maximum number of instances an app can use for scale-out. This limitation is most common for cases where a downstream component like a database has limited throughput. For the maximum scale limits when running the various hosting plans, see [Scale limits](functions-scale.md#scale). 

::: zone-end

::: zone pivot="flex-consumption-plan"

By default, apps running in a Flex Consumption plan have limit of `100` overall instances. Currently the lowest maximum instance count value is `1`, and the highest supported maximum instance count value is `1000`. When you use the [`az functionapp create`](/cli/azure/functionapp#az-functionapp-create) command to create a function app in the Flex Consumption plan, use the `--maximum-instance-count` parameter to set this maximum instance count for of your app. 

The maximum instance count applies to on-demand instances in each [per-function scale group](flex-consumption-plan.md#per-function-scaling) (function group) rather than to the app's combined instances. [Always ready instances](flex-consumption-plan.md#always-ready-instances) aren't limited by the maximum instance count and don't count toward it.

While you can change the maximum instance count of Flex Consumption apps up to 1000, the quota limit for your apps is reached before reaching that number. Review [Regional subscription memory quotas](flex-consumption-plan.md#regional-subscription-memory-quotas) for more details.

This example creates an app with a maximum instance count of `200`:

```azurecli
az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_ACCOUNT_NAME> --runtime <LANGUAGE_RUNTIME> --runtime-version <RUNTIME_VERSION> --flexconsumption-location <REGION> --maximum-instance-count 200
```

This example uses the [`az functionapp scale config set`](/cli/azure/functionapp/scale/config#az-functionapp-scale-config-set) command to change the maximum instance count for an existing app to `150`:

```azurecli
az functionapp scale config set --resource-group <RESOURCE_GROUP> --name <APP_NAME> --maximum-instance-count 150
```

::: zone-end

::: zone pivot="consumption-plan,premium-plan"

In a Consumption or Elastic Premium plan, you can specify a lower maximum limit for your app by modifying the value of the `functionAppScaleLimit` site configuration setting. The `functionAppScaleLimit` can be set to `0` or `null` for unrestricted, or a valid value between `1` and the app maximum.

#### [Azure CLI](#tab/azure-cli)

```azurecli
az resource update --resource-type Microsoft.Web/sites -g <RESOURCE_GROUP> -n <FUNCTION_APP-NAME>/config/web --set properties.functionAppScaleLimit=<SCALE_LIMIT>
```

#### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$resource = Get-AzResource -ResourceType Microsoft.Web/sites -ResourceGroupName <RESOURCE_GROUP> -Name <FUNCTION_APP-NAME>/config/web
$resource.Properties.functionAppScaleLimit = <SCALE_LIMIT>
$resource | Set-AzResource -Force
```

---

::: zone-end

::: zone pivot="flex-consumption-plan"

## Scale-out rate

In the [Flex Consumption plan](flex-consumption-plan.md), the platform also manages the *rate* at which it adds instances (the scale curve), separately from the [maximum instance count](#limit-scale-out). For how the scale curve works, throttling behavior, and best practices for high-rate scaling, see [Scale-out rate](flex-consumption-plan.md#scale-out-rate).

::: zone-end

::: zone pivot="consumption-plan,premium-plan"

## Scale-out rate

In the Consumption and Premium plans, the scale controller manages the rate at which new instances are added. For HTTP triggers, new instances are allocated at most once per second. For non-HTTP triggers, new instances are allocated at most once every 30 seconds. Scaling is faster when running in a [Premium plan](functions-premium-plan.md).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,consumption-plan"

## Scale-in behaviors

Event-driven scaling automatically reduces capacity when demand for your functions is reduced. It makes this reduction by draining instances of their current function executions and then removes those instances. This behavior is logged as drain mode. The grace period for functions that are currently executing can extend up to 10 minutes for Consumption plan apps and up to 60 minutes for Flex Consumption and Premium plan apps. Event-driven scaling and this behavior don't apply to Dedicated plan apps. 

The following considerations apply for scale-in behaviors: 

* For apps running on Windows in a Consumption plan, only apps created after May 2021 have drain mode behaviors enabled by default.
* To enable graceful shutdown for functions using the Service Bus trigger, use version 4.2.0 or a later version of the [Service Bus Extension](functions-bindings-service-bus.md).

::: zone-end

::: zone pivot="flex-consumption-plan"

## Per-function scaling

The [Flex Consumption plan] is unique in that it implements a *per-function scaling* behavior. In per-function scaling, except for HTTP triggers, Blob (Event Grid) triggers, and Durable Functions, all other function trigger types in your app scale on independent instances. HTTP triggers in your app all scale together as a group on the same instances, as do all Blob (Event Grid), and all Durable Functions triggers, which have their own shared instances.

Consider a function app hosted by a Flex Consumption plan that has the following functions:

| function1 | function2 | function3 | function4 | function5 | function6 | function7 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | 
| HTTP trigger | HTTP trigger | Orchestration trigger (Durable) | Activity trigger (Durable) | Service Bus trigger | Service Bus trigger | Event Hubs trigger |

In this example:

- The two HTTP triggered functions (`function1` and `function2`) both run together on their own instances and scale together according to [HTTP concurrency settings](flex-consumption-how-to.md#set-http-concurrency-limits).
- The two Durable functions (`function3` and `function4`) both run together on their own instances and scale together based on [configured concurrency throttles](../durable-task/durable-functions/durable-functions-perf-and-scale.md#concurrency-throttles).
- The Service bus triggered function `function5` runs in its own and is scaled independently according to the [target-based scaling rules for Service Bus queues and topics](functions-target-based-scaling.md#service-bus-queues-and-topics).
- The Service bus triggered function `function6` runs in its own and is scaled independently according to the [target-based scaling rules for Service Bus queues and topics](functions-target-based-scaling.md#service-bus-queues-and-topics).
- The Event Hubs trigger (`function7`) runs in its own instances and is scaled independently according to the [target-based scaling rules for Event Hubs](functions-target-based-scaling.md#event-hubs).

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan,consumption-plan"

## Best practices and patterns for scalable apps

Many aspects of a function app impact how it scales, including host configuration, runtime footprint, and resource efficiency. For more information, see the [scalability section of the performance considerations article](performance-reliability.md#scalability-best-practices). You should also be aware of how connections behave as your function app scales. For more information, see [How to manage connections in Azure Functions](manage-connections.md).

If your app has more than 100 functions that use event-based triggers, consider breaking the app into one or more apps, where each app has fewer than 100 event-based functions.

For more information on scaling in Python and Node.js, see the **Scaling and performance** section of the [Azure Functions Python developer guide](functions-reference-python.md) and the **Scaling and concurrency** section of the [Azure Functions Node.js developer guide](functions-reference-node.md).

::: zone-end

## Next steps

To learn more, see the following articles:

- [Improve the performance and reliability of Azure Functions](./performance-reliability.md)
- [Azure Functions reliable event processing](./functions-reliable-event-processing.md)
- [Azure Functions hosting options](functions-scale.md)

[Flex Consumption plan]: flex-consumption-plan.md
[Consumption plan]: consumption-plan.md
[Premium plan]: functions-premium-plan.md
[Azure Functions pricing page]: https://azure.microsoft.com/pricing/details/functions

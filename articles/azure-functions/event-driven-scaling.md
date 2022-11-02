---
title: Event-driven scaling in Azure Functions
description: Explains the scaling behaviors of Consumption plan and Premium plan function apps.
ms.date: 10/29/2020
ms.topic: conceptual
ms.service: azure-functions

---
# Event-driven scaling in Azure Functions

In the Consumption and Premium plans, Azure Functions scales CPU and memory resources by adding additional instances of the Functions host. The number of instances is determined on the number of events that trigger a function. 

Each instance of the Functions host in the Consumption plan is limited to 1.5 GB of memory and one CPU.  An instance of the host is the entire function app, meaning all functions within a function app share resource within an instance and scale at the same time. Function apps that share the same Consumption plan scale independently.  In the Premium plan, the plan size determines the available memory and CPU for all apps in that plan on that instance.  

Function code files are stored on Azure Files shares on the function's main storage account. When you delete the main storage account of the function app, the function code files are deleted and cannot be recovered.

## Runtime scaling

Azure Functions uses a component called the *scale controller* to monitor the rate of events and determine whether to scale out or scale in. The scale controller uses heuristics for each trigger type. For example, when you're using an Azure Queue storage trigger, it scales based on the queue length and the age of the oldest queue message.

The unit of scale for Azure Functions is the function app. When the function app is scaled out, additional resources are allocated to run multiple instances of the Azure Functions host. Conversely, as compute demand is reduced, the scale controller removes function host instances. The number of instances is eventually "scaled in" to zero when no functions are running within a function app.

![Scale controller monitoring events and creating instances](./media/functions-scale/central-listener.png)

## Cold Start

After your function app has been idle for a number of minutes, the platform may scale the number of instances on which your app runs down to zero. The next request has the added latency of scaling from zero to one. This latency is referred to as a _cold start_. The number of dependencies required by your function app can impact the cold start time. Cold start is more of an issue for  synchronous operations, such as HTTP triggers that must return a response. If cold starts are impacting your functions, consider running in a Premium plan or in a Dedicated plan with the **Always on** setting enabled.   

## Understanding scaling behaviors

Scaling can vary on a number of factors, and scale differently based on the trigger and language selected. There are a few intricacies of scaling behaviors to be aware of:

* **Maximum instances:** A single function app only scales out to a maximum of 200 instances. A single instance may process more than one message or request at a time though, so there isn't a set limit on number of concurrent executions.  You can [specify a lower maximum](#limit-scale-out) to throttle scale as required.
* **New instance rate:** For HTTP triggers, new instances are allocated, at most, once per second. For non-HTTP triggers, new instances are allocated, at most, once every 30 seconds. Scaling is faster when running in a [Premium plan](functions-premium-plan.md).
* **Scale efficiency:** For Service Bus triggers, use _Manage_ rights on resources for the most efficient scaling. With _Listen_ rights, scaling isn't as accurate because the queue length can't be used to inform scaling decisions. To learn more about setting rights in Service Bus access policies, see [Shared Access Authorization Policy](../service-bus-messaging/service-bus-sas.md#shared-access-authorization-policies). For Event Hub triggers, see the [this scaling guidance](#event-hubs-trigger). 

## Limit scale out

You may wish to restrict the maximum number of instances an app used to scale out.  This is most common for cases where a downstream component like a database has limited throughput.  By default, Consumption plan functions scale out to as many as 200 instances, and Premium plan functions will scale out to as many as 100 instances.  You can specify a lower maximum for a specific app by modifying the `functionAppScaleLimit` value.  The `functionAppScaleLimit` can be set to `0` or `null` for unrestricted, or a valid value between `1` and the app maximum.

```azurecli
az resource update --resource-type Microsoft.Web/sites -g <RESOURCE_GROUP> -n <FUNCTION_APP-NAME>/config/web --set properties.functionAppScaleLimit=<SCALE_LIMIT>
```

```azurepowershell
$resource = Get-AzResource -ResourceType Microsoft.Web/sites -ResourceGroupName <RESOURCE_GROUP> -Name <FUNCTION_APP-NAME>/config/web
$resource.Properties.functionAppScaleLimit = <SCALE_LIMIT>
$resource | Set-AzResource -Force
```

## Scale-in behaviors

Event-driven scaling automatically reduces capacity when demand for your functions is reduced. It does this by shutting down worker instances of your function app. Before an instance is shut down, new events stop being sent to the instance. Also, functions that are currently executing are given time to finish executing. This behavior is logged as drain mode. This shut-down period can extend up to 10 minutes for Consumption plan apps and up to 60 minutes for Premium plan apps. Event-driven scaling and this behavior don't apply to Dedicated plan apps. 

The following considerations apply for scale-in behaviors: 

* For Consumption plan function apps running on Windows, only apps created after May 2021 have drain mode behaviors enabled by default.
* To enable graceful shutdown for functions using the Service Bus trigger, use version 4.2.0 or a later version of the [Service Bus Extension](functions-bindings-service-bus.md).

## Event Hubs trigger

This section describes how scaling behaves when your function uses an [Event Hubs trigger](functions-bindings-event-hubs-trigger.md) or an [IoT Hub trigger](functions-bindings-event-iot-trigger.md). In these cases, each instance of an event triggered function is backed by a single [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor) instance. The trigger (powered by Event Hubs) ensures that only one [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor) instance can get a lease on a given partition.

For example, consider an Event Hub as follows:

* 10 partitions
* 1,000 events distributed evenly across all partitions, with 100 messages in each partition

When your function is first enabled, there is only one instance of the function. Let's call the first function instance `Function_0`. The `Function_0` function has a single instance of [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor) that holds a lease on all ten partitions. This instance is reading events from partitions 0-9. From this point forward, one of the following happens:

* **New function instances are not needed**: `Function_0` is able to process all 1,000 events before the Functions scaling logic take effect. In this case, all 1,000 messages are processed by `Function_0`.

* **An additional function instance is added**: If the Functions scaling logic determines that `Function_0` has more messages than it can process, a new function app instance (`Function_1`) is created. This new function also has an associated instance of [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor). As the underlying Event Hubs detect that a new host instance is trying read messages, it load balances the partitions across the host instances. For example, partitions 0-4 may be assigned to `Function_0` and partitions 5-9 to `Function_1`.

* **N more function instances are added**: If the Functions scaling logic determines that both `Function_0` and `Function_1` have more messages than they can process, new `Functions_N` function app instances are created.  Apps are created to the point where `N` is greater than the number of event hub partitions. In our example, Event Hubs again load balances the partitions, in this case across the instances `Function_0`...`Functions_9`.

As scaling occurs, `N` instances is a number greater than the number of event hub partitions. This pattern is used to ensure [EventProcessorHost](/dotnet/api/microsoft.azure.eventhubs.processor) instances are available to obtain locks on partitions as they become available from other instances. You are only charged for the resources used when the function instance executes. In other words, you are not charged for this over-provisioning.

When all function execution completes (with or without errors), checkpoints are added to the associated storage account. When check-pointing succeeds, all 1,000 messages are never retrieved again.

## Best practices and patterns for scalable apps

There are many aspects of a function app that impacts how it scales, including host configuration, runtime footprint, and resource efficiency.  For more information, see the [scalability section of the performance considerations article](performance-reliability.md#scalability-best-practices). You should also be aware of how connections behave as your function app scales. For more information, see [How to manage connections in Azure Functions](manage-connections.md).

For more information on scaling in Python and Node.js, see [Azure Functions Python developer guide - Scaling and concurrency](functions-reference-python.md#scaling-and-performance) and [Azure Functions Node.js developer guide - Scaling and concurrency](functions-reference-node.md#scaling-and-concurrency).

## Billing model

Billing for the different plans is described in detail on the [Azure Functions pricing page](https://azure.microsoft.com/pricing/details/functions/). Usage is aggregated at the function app level and counts only the time that function code is executed. The following are units for billing:

* **Resource consumption in gigabyte-seconds (GB-s)**. Computed as a combination of memory size and execution time for all functions within a function app. 
* **Executions**. Counted each time a function is executed in response to an event trigger.

Useful queries and information on how to understand your consumption bill can be found [on the billing FAQ](https://github.com/Azure/Azure-Functions/wiki/Consumption-Plan-Cost-Billing-FAQ).

[Azure Functions pricing page]: https://azure.microsoft.com/pricing/details/functions

## Next steps

+ [Azure Functions hosting options](functions-scale.md)


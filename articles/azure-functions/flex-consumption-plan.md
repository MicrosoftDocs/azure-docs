---
title: Azure Functions Flex Consumption plan hosting
description: Running your function code in the Azure Functions Flex Consumption plan provides VNET support with dynamic scale (to zero) and reduced cold starts.
ms.service: azure-functions
ms.topic: concept-article 
ms.date: 04/19/2024
ms.custom: references_regions

# Customer intent: As a developer, I want to understand the benefits of using the Flex Consumption plan so I can get the scalability benefits of Azure Functions without having to pay for resources I don't need.
---

# Azure Functions Flex Consumption plan hosting

When you're using the Flex Consumption plan, instances of the Azure Functions host are dynamically added and removed based on the number of incoming events. The Flex Consumption plan, along with the standard [Consumption plan](consumption-plan.md), is a fully <em>serverless</em> hosting option for Azure Functions. 

For a little extra cost, Flex Consumption provides you benefits above and beyond what yout get with a regular Consumption plan. 

> [!IMPORTANT]
> The Flex Consumption plan is currently in preview. For a list of current limitations when using this hosting plan, see [Considerations](#considerations). For current information about billing during the preview, see [Billing](#billing).

## Benefits

The Flex Consumption plan builds on the strenths of the Consumption plan, which include dynamic scaling and execution-based billing. With Flex Consumption, you also get get these additional features:

+ [Always-ready instances](#always-ready-instances) 
+ [Virtual network integration](#virtual-network-integration)
+ More control over scale using instance mmemory and concurrency settings
+ Unlimited<sup>1</sup> timeouts 

This table helps you directly compare the features of Flex Consumption with the Consumption hosting plan:

| Feature | Consumption | Flex Consumption |
| ----- | ---- | ---- |
| Scaling | [Event driven](event-driven-scaling.md)  | [Event driven](event-driven-scaling.md) |
| Billing | Execution-time only | Execution-time + always-ready instances |
| Timeout (max) | 10 min | Unlimited<sup>1</sup>  |
| Start-up | From zero instances | Always ready instances |
| Virtual networks | Not supported | Supported | 

<sup>1</sup>60 minutes guaranteed.

For a complete comparison of the Flex Consumption plan against the Consumption plan and all other plan and hosting types, see [function scale and hosting options](functions-scale.md).

## Virtual network integration

Flex Consumption expands on the traditional benefits of Consumption plan by adding support for virtual network integration. By running in a Flex Consumption plan, you apps can connect to other Azure services secured inside a virtual network. All while still allowing you to take advantage of serverless billing and scale, together with the scale and throughput benefits of the Flex Consumption plan.

## Instance memory

When you create your function app in a Flex Consumption plan, you can select the memory size of the instances on which your app runs. This _instance memory_ setting directly affects the costs of your function executions and the cost of maintaining alwsays ready instances. 

Currently, Flex Consumption offers these instance memory size options: 512 MB, 2048 MB, and 4096 MB.

When deciding on which instance memory size to use with your apps, here are some things to consider:

+ The 2048 MB instance memory size is used when creating new apps, unless a different option is specifically requested. For more information, see [Configure instance memory](flex-consumption-how-to.md#configure-instance-memory). 
+ You can change the instance memory size at any time. For more information, see [Configure instance memory](flex-consumption-how-to.md#configure-instance-memory).
+ Instance memory is shared between your function code and the Functions host.
+ The larger the size you set, the heavier the load (executions and concurrency) your instance can handle before it might need to scale. Specific scale decisions are workload-specific.
+ The default concurrency of HTTP triggers depends on the instance memory size. For more information, see [HTTP trigger concurrency](functions-concurrency.md#http-trigger-concurrency). 
+ Available CPUs and network bandwidth are provided proportional to a specific instance size.
+ When your instance count scales from one to two instances, the total execution cost of running your functions doubles. For more information, see [Billing](#billing).   

## Always ready instances

Flex Consumption includes an _always ready_ feature that lets you choose a number of instances to be always running and assigned to each of your per-function scale groups or functions. This is a great option for scenarios where you need to have a minimum number of instances always ready to handle requests, for example, to reduce your application's cold start latency. The default is 0 (zero).

For example, if you set always ready to 2 for your HTTP group of functions, the platform will keep 2 instances always running and assigned to your app for your HTTP functions in the app. Those instances will be processing your function executions, but depending on concurrency settings, the platform will scale beyond those two instances with on-demand instances.

## Per-function scaling

Concurrency is a key factor that determines how function apps scale. Because your function app can include different kinds of triggers, it can difficult for the host to determine how to most efficiently scale your app based on which functions are receiving demands. To improve the scale performance of apps with various trigger types, the Flex Consumption plan provides a more deterministic way of scaling your app on a per-function basis. 

This _per-function scaling_ behavior is a part of the hosting platform, so you don't need to configure your app or change the code. For more information, see [Per-function scaling](event-driven-scaling.md#per-function-scaling) in the Event-driven scaling article.

In per function scaling, HTTP and Durable triggers are special cases. All HTTP triggered functions in the app will be grouped and scaled together in the same instances, and all Durable triggered functions (Orchestration, Activity, or Entity triggers) will be grouped and scaled together in the same instances. Any other function in the app will be treated and scaled individually.

## Concurrency

Concurrency refers to the number of parallel executions of a function on an instance of your app. You can set a maximum number of concurrent executions that each instance should handle at any given time. Concurrency has a direct impact on how your app scales because at lower concurrency levels, you need more instances to handle the event-driven demand for a function. While you can control and fine tune the concurrency, we’ll provide defaults that work for most cases.

## Deployment storage account

Unlike other plans, project code is deployed to apps in a Flex Consumption plan from a container in a Blob storage account. By default, the same storage account used to store internal host metadata (AzureWebJobsStorage) is also used as the deployment container. However, you can define a second storage account in which to maintain the deployment container. For more information, see [Configure the deployment storage account](flex-consumption-how-to.md#configure-the-deployment-storage-account).

## Billing

:::image type="content" source="media/flex-consumption-plan/billing-graph.png" alt-text="Chart that represents Flex Consumption plan on-demand billing based on both load and time.":::

## Supported language stack versions

This table shows the language stack versions that are currently supported for Flex Consumption apps:

| Language stack  | Required version  |
| --- | :-----: |
| C# (isolated process mode)<sup>1</sup> | .NET 8<sup>2</sup> |
| Java | Java 17 |:::image type="content" source="media/flex-consumption-plan/billing-graph.png" alt-text="Graph of Flex Consumption plan on-demand billing as a function of both load and time.":::
| Node.js | Node 18   |
| PowerShell | PowerShell 7.2   |
| Python | Python 3.10   | 

<sup>1</sup>[C# in-process mode](./functions-dotnet-class-library.md) isn't currently supported.  
<sup>2</sup>Requires version `1.20.0` or later of [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker) and version `1.16.2` or later of [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk).

## Considerations

Keep these considerations in mind when using Flex Consumption plan during the current preview:

+ **Triggers**: All triggers are fully supported except for Kafka, Azure SQL, and SignalR triggers. The Blob storage trigger only supports the [Event Grid source](./functions-event-grid-blob-trigger.md). Non-C# apps must use extension bundle `[4.0.0, 5.0.0)`, or a later version. 
+ **Regions**: To find the list of supported regions, see [View currently supported regions](flex-consumption-how-to.md#view-currently-supported-regions). 

 | Feature                       | Values |
 | :---------------------------: | :----: |
 | App scale                     | Apps scale to zero unless Always Ready is configured. The lowest maximum scale we recommend in private preview is 40. The highest value that can be set is 1000.  |
 | Triggers                      | All triggers except Kafka, Azure SQL, and SignalR are supported. The Blob storage trigger only supports the [Event Grid source](./functions-event-grid-blob-trigger.md). |
 | HTTP Concurrency              | Current default is 16. Minimum of 1. |
 | Non-HTTP Concurrency          | As per [Target Based Scaling](https://learn.microsoft.com/azure/azure-functions/functions-target-based-scaling?#customizing-target-based-scaling) |
 | Durable Functions Concurrency | As per [Durable Functions configurations](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-perf-and-scale#configuration-of-throttles) |


Further restrictions:

- Apps There is limited support for Flex Consumption apps after they have been created via the CLI.
- The available capacity for the 4096 instance size is more limited than 512 and 2048. Likewise, the available capacity for Node and PowerShell is more limited. If you are running larger scale testing of the 4096 instance size, or are planning scale testing of Node or PowerShell apps, please contact the team at [flexconsumptionprev@microsoft.com](mailto:flexconsumptionprev@microsoft.com).
- Both `Microsoft.Web` and `Microsoft.App` resource providers [must be enabled](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider) on your subscription.


## Deprecated properties and settings

In Flex Consumption, many of the standard application settings and site configuration properties used in Bicep and ARM template deployments are deprecated and shouldn't be used when automating function app resource creation. For more information, see [Flex Consumption plan deprecations](functions-app-settings.md#flex-consumption-plan-deprecations). 

## Next step
TODO: Add your next step link(s)
> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

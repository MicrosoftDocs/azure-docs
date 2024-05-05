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

## Instance memory

When you create your function app in a Flex Consumption plan, you can select the memory size of the instances on which your app runs. This _instance memory_ setting directly affects the costs of your function executions and the cost of maintaining alwsays ready instances. 

Currently, Flex Consumption offers these instance memory size options: 512 MB, 2048 MB, and 4096 MB.

When deciding on which instance memory size to use with your apps, here are some things to consider:

+ The 2048 MB instance memory size is used when creating new apps, unless a different option is specifically requested. For more information, see [Configure instance memory](flex-consumption-how-to.md#configure-instance-memory). 
+ You can change the instance memory size at any time. For more information, see [Configure instance memory](flex-consumption-how-to.md#configure-instance-memory).
+ Instance memory is shared between your function code and the Functions host.
+ The larger the size you set, the heavier the load (executions and concurrency) your instance can handle before it might need to scale. Specific scale decisions are workload-specific.
+ Available CPUs and network bandwidth are provided proportional to a specific instance size.
+ When your instance count scales from one to two instances, the total execution cost of running your functions doubles. For more information, see [Billing](#billing).   

## Virtual network integration

Flex Consumption expands on the traditional benefits of Consumption plan by adding support for virtual network integration. By running in a Flex Consumption plan, you apps can connect to other Azure services secured inside a virtual network. All while still allowing you to take advantage of serverless billing and scale, together with the scale and throughput benefits of the Flex Consumption plan.

## Always ready instances

Flex Consumption includes an _always ready_ feature that lets you choose a number of instances to be always running and assigned to each of your per-function scale groups or functions. This is a great option for scenarios where you need to have a minimum number of instances always ready to handle requests, for example, to reduce your application's cold start latency. The default is 0 (zero).

For example, if you set always ready to 2 for your HTTP group of functions, the platform will keep 2 instances always running and assigned to your app for your HTTP functions in the app. Those instances will be processing your function executions, but depending on concurrency settings, the platform will scale beyond those two instances with on-demand instances.

## Billing



## Supported language stack versions

This table shows the language stack versions that are currently supported for Flex Consumption apps:

| Runtime/language stack  | Required version  |
| --- | :-----: |
| C# (isolated process mode)<sup>*</sup> | .NET 8 |
| Java | Java 17 |
| Node.js | Node 18   |
| PowerShell | PowerShell 7.2   |
| Python | Python 3.10   | 

<sup>1</sup>[C# in-process mode](./functions-dotnet-class-library.md) isn't currently supported.  
<sup>2</sup>[C# in-process mode](./functions-dotnet-class-library.md) isn't currently supported.

## Considerations

The following are considerations when using Flex Consumption plan during the current preview:

 | Feature                       | Values |
 | :---------------------------: | :----: |
 | .NET Worker                   | The .NET Isolated worker [Microsoft.Azure.Functions.Worker version 1.20.0](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/1.20.0) and the .NET Isolated worker SDK [Microsoft.Azure.Functions.Worker.Sdk version 1.16.2](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/1.16.2) or newer are required |
 | App scale                     | Apps scale to zero unless Always Ready is configured. The lowest maximum scale we recommend in private preview is 40. The highest value that can be set is 1000.  |
 | Triggers                      | All triggers except Kafka, Azure SQL, and SignalR are supported. The Blob storage trigger only supports the [Event Grid source](./functions-event-grid-blob-trigger.md). |
 | HTTP Concurrency              | Current default is 16. Minimum of 1. |
 | Non-HTTP Concurrency          | As per [Target Based Scaling](https://learn.microsoft.com/azure/azure-functions/functions-target-based-scaling?#customizing-target-based-scaling) |
 | Durable Functions Concurrency | As per [Durable Functions configurations](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-perf-and-scale#configuration-of-throttles) |
 | Regions                       | North Europe, East US |
 | Extension Bundles             | Only the latest `[4.0.0, 5.0.0)` is supported |

Further restrictions:

- Apps There is limited support for Flex Consumption apps after they have been created via the CLI.
- The available capacity for the 4096 instance size is more limited than 512 and 2048. Likewise, the available capacity for Node and PowerShell is more limited. If you are running larger scale testing of the 4096 instance size, or are planning scale testing of Node or PowerShell apps, please contact the team at [flexconsumptionprev@microsoft.com](mailto:flexconsumptionprev@microsoft.com).
- For private preview, only Azure Storage is supported as the backend for Durable Functions.
- The [private Azure CLI and Functions Core Tools](./flex-consumption-create-deploy.md) and [Bicep/ARM templates](./samples/) are initially the only supported ways to create and deploy/publish your app. Azure Pipelines and GitHub Actions support will be added in the future.
- Both `Microsoft.Web` and `Microsoft.App` resource providers [must be enabled](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider) on your subscription.


## Deprecated properties and settings

In Flex Consumption, these site properties and application settings are deprecated and shouldn't be used when creating resources for function apps in a Flex Consumption plan:

| Property/setting | Reason | 
| ----- | ----- | 
| `properties.ftpsState` | FTPS not supported | 
| `properties.use32BitWorkerProcess` |32-bit not supported |
| `properties.isReserved` |Not valid|
| `properties.IsXenon` |Not valid|
| `properties.windowsFxVersion` |Not valid|
| `properties.alwaysOn` |Not valid|
| `properties.siteConfig.preWarmedInstanceCount` | Renamed as `` |
| `properties.siteConfig.functionAppScaleLimit` |Renamed as `maximumInstanceCount`|
| `properties.containerSize` |Renamed as `instanceMemoryMB`|
| `properties.javaVersion` | Replaced by `version` in `properties.functionAppConfig.runtime`|
| `properties.powerShellVersion` |Replaced by `version` in `properties.functionAppConfig.runtime`|
| `properties.netFrameworkVersion` |Replaced by `version` in `properties.functionAppConfig.runtime`|
| `properties.LinuxFxVersion` |Replaced by `properties.functionAppConfig.runtime`|
| `WEBSITE_NODE_DEFAULT_VERSION` |Replaced by `version` in `properties.functionAppConfig.runtime`|
| `FUNCTIONS_EXTENSION_VERSION` |App Setting will be set by the backend to the right value|
| `FUNCTIONS_WORKER_RUNTIME` |Replaced by `name` in `properties.functionAppConfig.runtime`|
| `FUNCTIONS_WORKER_RUNTIME_VERSION` |Replaced by `version` in `properties.functionAppConfig.runtime`|
| `FUNCTIONS_MAX_HTTP_CONCURRENCY` |App Setting replaced by scale and concurrency's trigger section|
| `FUNCTIONS_WORKER_PROCESS_COUNT` |Setting not valid|
| `FUNCTIONS_WORKER_DYNAMIC_CONCURRENCY_ENABLED` |Setting not valid|
| `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` |App Setting replaced by functionAppConfig's deployment section|
| `WEBSITE_CONTENTSHARE` |App Setting replaced by functionAppConfig's deployment section|

## Next step
TODO: Add your next step link(s)
> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

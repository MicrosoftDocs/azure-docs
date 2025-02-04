---
title: Azure Functions Flex Consumption plan hosting
description: Running your function code in the Azure Functions Flex Consumption plan provides virtual network integration, dynamic scale (to zero), and reduced cold starts.
ms.service: azure-functions
ms.topic: concept-article
ms.date: 11/01/2024
ms.custom: references_regions, build-2024, ignite-2024
# Customer intent: As a developer, I want to understand the benefits of using the Flex Consumption plan so I can get the scalability benefits of Azure Functions without having to pay for resources I don't need.
---

# Azure Functions Flex Consumption plan hosting

Flex Consumption is a Linux-based Azure Functions hosting plan that builds on the Consumption _pay for what you use_ serverless billing model. It gives you more flexibility and customizability by introducing private networking, instance memory size selection, and fast/large scale-out features still based on a <em>serverless</em> model.

You can review end-to-end samples that feature the Flex Consumption plan in the [Flex Consumption plan samples repository](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples).

## Benefits

The Flex Consumption plan builds on the strengths of the Consumption plan, which include dynamic scaling and execution-based billing. With Flex Consumption, you also get these extra features:

+ [Always-ready instances](#always-ready-instances) 
+ [Virtual network integration](#virtual-network-integration)
+ Fast scaling based on concurrency for both HTTP and non-HTTP apps
+ Multiple choices for instance memory sizes

This table helps you directly compare the features of Flex Consumption with the Consumption hosting plan:

| Feature | Consumption | Flex Consumption |
| ----- | ---- | ---- |
| Scale to zero| ✅ Yes | ✅ Yes   |
| Scale behavior | [Event driven](event-driven-scaling.md) | [Event driven](event-driven-scaling.md) (fast) |
| Virtual networks |❌ Not supported | ✅ Supported | 
| Dedicated compute (mitigate cold starts) | ❌ None | ✅ Always ready instances (optional) | 
| Billing | Execution-time only | Execution-time + always-ready instances |
| Scale-out instances (max) | 200 | 1000 |

For a complete comparison of the Flex Consumption plan against the Consumption plan and all other plan and hosting types, see [function scale and hosting options](functions-scale.md).

## Virtual network integration

Flex Consumption expands on the traditional benefits of Consumption plan by adding support for [virtual network integration](./functions-networking-options.md#virtual-network-integration). When your apps run in a Flex Consumption plan, they can connect to other Azure services secured inside a virtual network. All while still allowing you to take advantage of serverless billing and scale, together with the scale and throughput benefits of the Flex Consumption plan. For more information, see [Enable virtual network integration](./flex-consumption-how-to.md#enable-virtual-network-integration).

## Instance memory

When you create your function app in a Flex Consumption plan, you can select the memory size of the instances on which your app runs. See [Billing](#billing) to learn how instance memory sizes affect the costs of your function app. 

Currently, Flex Consumption offers instance memory size options of both 2,048 MB and 4,096 MB.

When deciding on which instance memory size to use with your apps, here are some things to consider:

+ The 2,048-MB instance memory size is the default and should be used for most scenarios. Use the 4,096-MB instance memory size for scenarios where your app requires more concurrency or higher processing power. For more information, see [Configure instance memory](flex-consumption-how-to.md#configure-instance-memory). 
+ You can change the instance memory size at any time. For more information, see [Configure instance memory](flex-consumption-how-to.md#configure-instance-memory).
+ Instance resources are shared between your function code and the Functions host.
+ The larger the instance memory size, the more each instance can handle as far as concurrent executions or more intensive CPU or memory workloads. Specific scale decisions are workload-specific.
+ The default concurrency of HTTP triggers depends on the instance memory size. For more information, see [HTTP trigger concurrency](functions-concurrency.md#http-trigger-concurrency). 
+ Available CPUs and network bandwidth are provided proportional to a specific instance size.

## Per-function scaling

[Concurrency](#concurrency) is a key factor that determines how Flex Consumption function apps scale. To improve the scale performance of apps with various trigger types, the Flex Consumption plan provides a more deterministic way of scaling your app on a per-function basis. 

This _per-function scaling_ behavior is a part of the hosting platform, so you don't need to configure your app or change the code. For more information, see [Per-function scaling](event-driven-scaling.md#per-function-scaling) in the Event-driven scaling article.

In per-function scaling, decisions are made for certain function triggers based on group aggregations. This table shows the defined set of function scale groups:  

| Scale groups | Triggers in group | Settings value |
| ---- | ---- | --- |
| HTTP triggers |[HTTP trigger](functions-bindings-http-webhook-trigger.md)<br/>[SignalR trigger](functions-bindings-signalr-service-trigger.md) | `http` |
| Blob storage triggers<br/>(Event Grid-based) |  [Blob storage trigger](functions-bindings-storage-blob-trigger.md) | `blob`|
| Durable Functions | [Orchestration trigger](./durable/durable-functions-bindings.md#orchestration-trigger)<br/>[Activity trigger](./durable/durable-functions-bindings.md#activity-trigger)<br/>[Entity trigger](./durable/durable-functions-bindings.md#entity-trigger) | `durable` |

All other functions in the app are scaled individually in their own set of instances, which are referenced using the convention `function:<NAMED_FUNCTION>`.

## Always ready instances

Flex Consumption includes an _always ready_ feature that lets you choose instances that are always running and assigned to each of your per-function scale groups or functions. Always ready is a great option for scenarios where you need to have a minimum number of instances always ready to handle requests. For example, to reduce your application's cold start latency. The default is 0 (zero).

For example, if you set always ready to 2 for your HTTP group of functions, the platform keeps two instances always running and assigned to your app for your HTTP functions in the app. Those instances are processing your function executions, but depending on concurrency settings, the platform scales beyond those two instances with on-demand instances.

To learn how to configure always ready instances, see [Set always ready instance counts](flex-consumption-how-to.md#set-always-ready-instance-counts).

## Concurrency

Concurrency refers to the number of parallel executions of a function on an instance of your app. You can set a maximum number of concurrent executions that each instance should handle at any given time. Concurrency has a direct effect on how your app scales because at lower concurrency levels, you need more instances to handle the event-driven demand for a function. While you can control and fine tune the concurrency, we provide defaults that work for most cases. 

To learn how to set concurrency limits for HTTP trigger functions, see [Set HTTP concurrency limits](flex-consumption-how-to.md#set-http-concurrency-limits). To learn how to set concurrency limits for non-HTTP trigger functions, see [Target Base Scaling](./functions-target-based-scaling.md).

## Deployment

Deployments in the Flex Consumption plan follow a single path, and there's no longer the need for app settings to influence deployment behavior. After your project code is built and zipped into an application package, it's deployed to a blob storage container. On startup, your app gets the package and runs your function code from this package. By default, the same storage account used to store internal host metadata (AzureWebJobsStorage) is also used as the deployment container. However, you can use an alternative storage account or choose your preferred authentication method by [configuring your app's deployment settings](flex-consumption-how-to.md#configure-deployment-settings).

## Billing

[!INCLUDE [functions-flex-consumption-billing-table](../../includes/functions-flex-consumption-billing-table.md)]

The minimum billable execution period for both execution modes is 1,000 ms. Past that, the billable activity period is rounded up to the nearest 100 ms. You can find details on the Flex Consumption plan billing meters in the [Monitoring reference](monitor-functions-reference.md?tab=flex-consumption-plan#metrics).

For details about how costs are calculated when you run in a Flex Consumption plan, including examples, see [Consumption-based costs](functions-consumption-costs.md?tabs=flex-consumtion-plan#consumption-based-costs).   

## Supported language stack versions

This table shows the language stack versions that are currently supported for Flex Consumption apps:

| Language stack  | Required version |
| --- | :-----: |
| C# (isolated process mode)<sup>1</sup> | .NET 8<sup>2</sup> |
| Java | Java 11, Java 17 |
| Node.js | Node 20   |
| PowerShell | PowerShell 7.4   |
| Python | Python 3.10, Python 3.11  | 

<sup>1</sup>[C# in-process mode](./functions-dotnet-class-library.md) isn't supported. You instead need to [migrate your .NET code project to run in the isolated worker model](migrate-dotnet-to-isolated-model.md).  
<sup>2</sup>Requires version `1.20.0` or later of [Microsoft.Azure.Functions.Worker](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker) and version `1.16.2` or later of [Microsoft.Azure.Functions.Worker.Sdk](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk).

## Regional subscription memory quotas

Currently, each region in a given subscription has a memory limit of `512,000 MB` for all instances of apps running on Flex Consumption plans. This quota means that, in a given subscription and region, you could have any combination of instance memory sizes and counts, as long as they stay under the quota limit. For example, each the following examples would mean the quota is reached and the apps would stop scaling:

+ You have one 2,048 MB app scaled to 100 and a second 2,048 MB app scaled to 150 instances
+ You have one 2,048 MB app that scaled out to 250 instances
+ You have one 4,096 MB app that scaled out to 125 instances
+ You have one 4,096 MB app scaled to 100 and one 2,048 MB app scaled to 50 instances

Flex Consumption apps scaled to zero, or instances marked to be scaled in and deleted, don't count against the quota. This quota can be increased to allow your Flex Consumption apps to scale further, depending on your requirements. If your apps require a larger quota, create a support ticket.

## Deprecated properties and settings

In Flex Consumption many of the standard application settings and site configuration properties are deprecated or have moved and shouldn't be used when automating function app resource creation. For more information, see [Flex Consumption plan deprecations](functions-app-settings.md#flex-consumption-plan-deprecations).

## Considerations

Keep these other considerations in mind when using Flex Consumption plan:

+ **Host**: There's a 30-second time out for app initialization. When your function app takes longer than 30 seconds to start, you might see gRPC-related `System.TimeoutException` entries logged. You can't currently configure this time out. For more information, see [this host work item](https://github.com/Azure/azure-functions-host/issues/10482).
+ **Durable Functions**: Azure Storage is currently the only supported [storage provider](./durable/durable-functions-storage-providers.md) for Durable Functions when hosted in the Flex Consumption plan. See [recommendations](./durable/durable-functions-azure-storage-provider.md#flex-consumption-plan) when hosting Durable Functions in the Flex Consumption plan.
+ **Virtual network integration** Ensure that the `Microsoft.App` Azure resource provider is enabled for your subscription by [following these instructions](/azure/azure-resource-manager/management/resource-providers-and-types#register-resource-provider). The subnet delegation required by Flex Consumption apps is `Microsoft.App/environments`.
+ **Triggers**: All triggers are fully supported except for Kafka and Azure SQL triggers. The Blob storage trigger only supports the [Event Grid source](./functions-event-grid-blob-trigger.md). Non-C# function apps must use version `[4.0.0, 5.0.0)` of the [extension bundle](./functions-bindings-register.md#extension-bundles), or a later version. 
+ **Regions**: Not all regions are currently supported. To learn more, see [View currently supported regions](flex-consumption-how-to.md#view-currently-supported-regions).
+ **Deployments**: Deployment slots aren't currently supported.
+ **Scale**: The lowest maximum scale is currently `40`. The highest currently supported value is `1000`. 
+ **Managed dependencies**: [Managed dependencies in PowerShell](functions-reference-powershell.md#managed-dependencies-feature) aren't supported by Flex Consumption. You must instead [upload modules with app content](functions-reference-powershell.md#including-modules-in-app-content).
+ **Diagnostic settings**: Diagnostic settings aren't currently supported.
+ **Certificates**: Loading certificates with the WEBSITE_LOAD_CERTIFICATES app setting is currently not supported.
+ **Key Vault References**: Key Vault references in app settings don't work when Key Vault is network access restricted, even if the function app has Virtual Network integration. The current workaround is to directly reference the Key Vault in code and read the required secrets.

## Related articles

[Azure Functions hosting options](functions-scale.md)
[Create and manage function apps in the Flex Consumption plan](flex-consumption-how-to.md)

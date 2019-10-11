---
title: Zero downtime deployment for Durable Functions
description: Learn how to enable zero downtime deployment 
services: functions
author: tsushi
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: overview
ms.date: 04/15/2019
ms.author: azfuncdf
#Customer intent: As a Durable Functions user, I want to deploy with zero downtime so that updates don't interrupt my function app's execution.
--- 
# Zero downtime deployment for Durable Functions
Durable Functions' [reliable execution model](durable-functions-checkpointing-and-replay.md) requires that orchestrations be deterministic. This creates an additional challenge to consider when deploying updates. If a deployment contains changes to activity function signatures or orchestrator logic, in-flight orchestration instances will fail. This is especially a problem for instances of long-running orchestrations, which may represent hours or days of work.

To prevent this behavior, you need to either delay your deployment until all running orchestration instances have completed, or ensure that any running orchestration instances use the existing versions of your functions. For more details about versioning, refer to [Versioning in Durable Functions](durable-functions-versioning.md).

# Three Strategies
There are three main strategies for zero downtime deployment for Durable Functions: 

* [Versioning strategy](#versioning-strategy)
* [Status check with slot](#status-check-with-slot)
* [Application routing](#application-routing)

# Versioning Strategy
Define new versions of your functions and leave the old versions in your function app. As you can see on the diagram, a function's version becomes part of its name. Because previous versions of functions are preserved, in-flight orchestration instances can continue to reference them. Meanwhile, requests for new orchestration instances call for the latest version, which your orchestration client function can reference from an app setting.

![Versioning Strategy](media/durable-functions-zero-downtime-deployment/versioning-strategy.png)

## Use case
Applications that don't experience frequent [breaking changes.](durable-functions-versioning.md)

## Pros
* Simple
## Cons
* Increased function app size in memory and number of functions
* Code duplication
* Every function must be copied and its references to other functions updated. You can make it easier by writing a script. Here is a [sample project](https://github.com/TsuyoshiUshio/DurableVersioning) with a migration script.

>[!NOTE]
>This strategy uses deployment slots to avoid downtime during deployment. For more detailed information about how to create and use new deployment slots refer to [Deployment technologies in Azure Functions](../functions-deployment-technologies.md#deployment-slots)

# Status Check with Slot
While the current version of your function app is running in your production slot, deploy the new version of your function app to your staging slot. Before you swap your production and staging slots, check if there are running orchestration instances. If all orchestration instances are completed, you can perform the swap. This strategy works when you have predictable periods when no orchestration instances are in-flight - for example, if you don't have long-running orchestrations, or orchestrations whose executions frequently overlap.


## Function App Configuration

1. Add deployment slots to your function app for staging and production.
2. For each slot, set the [AzureWebJobsStorage application setting](../functions-app-settings.md#azurewebjobsstorage) to the connection string of a shared storage account. This will be used by the Azure Functions runtime. This account will be used by the Azure Functions runtime and manages the function's keys.
3. For each slot, create a new app setting (ex. DurableManagementStorage) and set its value to the connection string of different storage accounts. These storage accounts will be used by the Durable Functions extension for [reliable execution](durable-functions-checkpointing-and-replay.md). Use a separate storage account for each slot. Do not mark this setting as a deployment slot setting.
4. In your function app's [host.json file's durableTask section](durable-functions-bindings.md#hostjson-settings), specify azureStorageConnectionStringName as the name of the app setting you created in step 3.

The diagram below shows illustrates the described configuration of deployment slots and storage accounts. In this potential pre-deployment scenario, version 2 of a function app is running in the production slot, while version 1 remains in the staging slot.

![Deployment slot](media/durable-functions-zero-downtime-deployment/deployment-slot.png)

### host.json Examples

#### Functions 1.x

```
{
  "durableTask": {
    "azureStorageConnectionStringName": "DurableManagementStorage"
  }
}
```

#### Functions 2.x

```
{
  "version": 2.0,
  "extensions": {
    "durableTask": {
      "azureStorageConnectionStringName": "DurableManagementStorage"
    }
  }
}
```

## CI/CD pipeline configurationn
Configure your CI/CD pipeline to deploy only if your function app has no pending or running orchestration instances. If you're using Azure DevOps, you can create a function to check for these conditions:

```csharp
[FunctionName("StatusCheck")]
public static async Task<IActionResult> StatusCheck(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestMessage req,
    [OrchestrationClient] DurableOrchestrationClient client,
    ILogger log)
{
    var runtimeStatus = new List<OrchestrationRuntimeStatus>();

    runtimeStatus.Add(OrchestrationRuntimeStatus.Pending);
    runtimeStatus.Add(OrchestrationRuntimeStatus.Running);

    var status = await client.GetStatusAsync(new DateTime(2015,10,10), null, runtimeStatus);
    return (ActionResult) new OkObjectResult(new Status() {HasRunning = (status.Count != 0)});
}
```

Then configure the staging gate to wait until no orchestrations are running. For more details, refer to [Release deployment control using gates](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates?view=azure-devops

![Deployment gate](media/durable-functions-zero-downtime-deployment/deployment-gate.png)

You will see Azure DevOps check your function app for running orchestration instances before your deployment starts.

![Deployment gate (Running)](media/durable-functions-zero-downtime-deployment/deployment-gate-2.png)

Now the new version of your function app should be deployed to the staging slot.

![Deployment slot](media/durable-functions-zero-downtime-deployment/deployment-slot-2.png)

Then swap slots. Application settings that aren't marked as deployment slot settings will also be swapped, so the version 2 app keeps its reference to storage account A. Because orchestration state is tracked in the storage account, any orchestrations running on the version 2 app will continue to run in the new slot without interruption.

![Deployment slot](media/durable-functions-zero-downtime-deployment/deployment-slot-3.png)

If you want to use the same storage account for both slots, you can change the names of your task hubs. In this case, you need to manage the state of your slots and your apps' TaskHubName settings.
For more details, [Task hubs in Durable Functions (Azure Functions)](durable-functions-task-hubs.md) 

## Usage 
A system that doesn't have long-running orchestrations lasting more than 24 hours or frequently overlapping orchestrations.

## Pros
* Simple code base
* Doesn't require additional function app management
## Cons
* Requires additional storage account or task hub management
* Requires periods of time when no orchestrations are running

# Application Routing
This strategy is the most complex; however, it can be used for function apps which don't have time between running orchestrations.

It works by creating an application router in front of your Durable Functions. The router can be implemented with Durable Functions and has the following responsibilities:

* Deploy Function App
* Manage the version of Durable Functions 
* Route orchestration requests to function apps

The first time an orchestration request is received, the application router:

1. Creates a new function app in Azure.
2. Deploys your function app's code to the new function app in Azure.
3. Forwards the orchestration request to the new app.

The router manages the state of which version of your app's code is deployed to which function app in Azure.

![Application Routing (frist time)](media/durable-functions-zero-downtime-deployment/application-routing.png)

The application router directs deployment and orchestration requests to the appropriate function app based on the `version` sent with the request, ignoring patch version.

When you deploy a new version of your app *without* a breaking change, you can increment the patch version. The application router will deploy to your existing function app, and sends requests for the old and new versions of the code are routed to same function app.

![Application Routing (no breaking change)](media/durable-functions-zero-downtime-deployment/application-routing-2.png)

When you deploy a new version of your app with a breaking change, you can increment the major or minor version. Then the application router creates a new function app in Azure, deploys to it, and routes requests for the new version of your app to it. In the diagram below, running orchestrations on the 1.0.1 version of the app will keep running, but requests for the 1.1.0 version will be routed to the new function app.

![Application Routing (breaking change)](media/durable-functions-zero-downtime-deployment/application-routing-3.png)

The application router monitoring the status of orchestrations on the 1.0.1 version and removing apps once all orchestrations have been finished.  

## Tracking store settings

Each function app should use separate scheduling queues, possibly in separate storage accounts. However, if you want to be able to query all orchestrations instances across all versions of your application, you can share instance and history tables across your function apps. Do this by configuring your apps' trackingStoreConnectionStringName and trackingStoreNamePrefix [host.json settings](durable-functions-bindings.md#host-json) so that they all share the same values.

For more details, [Manage instances in Durable Functions in Azure](durable-functions-instance-management.md).

![Tracking store settings](media/durable-functions-zero-downtime-deployment/tracking-store-settings.png)

## Usage 
A system that doesn't have periods of time when no orchestrations are running, ex. those with long-running orchestrations lasting more than 24 hours or frequently overlapping orchestrations.

## Pros
Handles new versions of systems with continually running orchestrations that have breaking changes

## Cons
* Need to develop an intelligent application router
* Need to take care not to the maximum number of function apps allowed by your subscription (default 100)

# Summary
![Comparison](media/durable-functions-zero-downtime-deployment/compare.png)

## Next steps

> [!div class="nextstepaction"]
> [Versioning in Durable Functions - Azure](durable-functions-versioning.md)

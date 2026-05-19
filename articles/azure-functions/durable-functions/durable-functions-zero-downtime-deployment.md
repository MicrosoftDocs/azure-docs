---
title: "Zero-Downtime Deployment for Durable Functions"
description: "Learn how to achieve zero-downtime deployment for Durable Functions using orchestration versioning, slot swaps, and application routing. Explore strategies to deploy updates without interrupting running orchestrations."
author: tsushi
ms.topic: concept-article
ms.service: azure-functions
ms.date: 04/23/2026
ms.author: azfuncdf
ms.custom: fasttrack-edit
#Customer intent: As a Durable Functions user, I want to deploy with zero downtime so that updates don't interrupt my Durable Functions orchestration execution.
---

# Zero-downtime deployment for Durable Functions

The [reliable execution model](../../durable-task/common/durable-task-orchestrations.md) of Durable Functions requires that orchestrations be deterministic, which creates a challenge when you deploy updates. When a deployment contains [breaking changes](durable-functions-versioning.md) — such as modified activity function signatures or altered orchestrator logic — in-flight orchestration instances fail. This situation is especially a problem for long-running orchestrations, which might represent hours or days of work.

> [!NOTE]
> The strategies in this article assume you're using the default Azure Storage provider for Durable Functions. If you're using a different storage provider, the guidance may not apply. The [orchestration versioning](#orchestration-versioning) strategy is the exception — it works with any storage backend. For more information on storage provider options, see [Durable Functions storage providers](../../durable-task/common/durable-task-storage-providers.md).

The following table compares four strategies for achieving zero-downtime deployment. Choose the strategy that best matches your workload:

| Strategy | When to use | Pros | Cons |
| -------- | ----------- | ---- | ---- |
| [Orchestration versioning](#orchestration-versioning) (recommended) | Applications with [breaking changes](durable-functions-versioning.md) that need multiple orchestration versions running concurrently. | Enables zero-downtime deployments with breaking changes.<br/>Built-in feature requiring minimal configuration.<br/>Works with any storage backend. | Requires careful orchestrator code modifications for version compatibility. |
| [Name-based versioning](#name-based-versioning) | Applications with infrequent [breaking changes](durable-functions-versioning.md) where simplicity is preferred. | Simple to implement. | Increased function app size in memory and number of functions.<br/>Code duplication. |
| [Status check with slot](#status-check-with-slot) | Systems with short-lived orchestrations (under 24 hours) and predictable gaps between executions. | Simple code base.<br/>Doesn't require additional function app management. | Requires additional storage account or task hub management.<br/>Requires periods of time when no orchestrations are running. |
| [Application routing](#application-routing) | Systems with continuously running orchestrations (over 24 hours) or frequently overlapping executions with no idle windows. | Handles new versions of systems with continually running orchestrations that have breaking changes. | Requires an intelligent application router.<br/>Could max out the number of function apps allowed by your subscription (default is 100). |

## Orchestration versioning

The [orchestration versioning](../../durable-task/common/durable-orchestration-versioning.md) feature is the recommended strategy for zero-downtime deployments with breaking changes. It enables different versions of orchestrations to coexist and execute concurrently without conflicts.

With orchestration versioning:
- Each orchestration instance gets a version permanently associated with it when created.
- Workers running newer orchestrator versions can continue executing older version instances.
- Workers running older orchestration versions _can't_ execute newer version instances.
- Orchestrator functions can examine their version and branch execution accordingly.

This approach facilitates rolling upgrades where workers running different versions of your application can coexist safely. Unlike the other strategies in this article, orchestration versioning is **[backend agnostic](../../durable-task/common/durable-task-storage-providers.md)** and works with any storage provider.

For full implementation steps — including how to configure versioning, handle version branching in orchestrator code, and manage rolling upgrades — see [Orchestration versioning](../../durable-task/common/durable-orchestration-versioning.md).

The remaining strategies are alternatives for scenarios where orchestration versioning isn't suitable.

## Name-based versioning

With this strategy, you create new versions of your functions alongside the old versions in the same function app. Each function's version becomes part of its name (for example, `MyOrchestrator_v1`, `MyOrchestrator_v2`). Because previous versions are preserved, in-flight orchestration instances can continue to reference them. Requests for new orchestration instances call the latest version, which your orchestration client function can reference from an app setting. The following diagram illustrates this approach.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/versioning-strategy.png" alt-text="Screenshot of the name-based versioning strategy diagram showing how function versions coexist in a Durable Functions app.":::

In this strategy, every function must be copied, and its references to other functions must be updated. You can make it easier by writing a script. Here's a [sample project](https://github.com/TsuyoshiUshio/DurableVersioning) with a migration script.

> [!NOTE]
> This strategy uses deployment slots to avoid downtime during deployment. For more detailed information about how to create and use new deployment slots, see [Azure Functions deployment slots](../functions-deployment-slots.md).

## Status check with slot

While the current version of your function app is running in your production slot, deploy the new version of your function app to your staging slot. Before you swap your production and staging slots, check to see if there are any running orchestration instances. After all orchestration instances are complete, you can do the swap. This strategy works when you have predictable periods when no orchestration instances are in flight. This is the best approach when your orchestrations aren't long-running and when your orchestration executions don't frequently overlap.

### Function app configuration

Use the following procedure to set up this scenario.

1. [Add deployment slots](../functions-deployment-slots.md#add-a-slot) to your function app for staging and production.

1. For each slot, set the [AzureWebJobsStorage application setting](../functions-app-settings.md#azurewebjobsstorage) to the connection of a shared storage account. This storage account connection is used by the Azure Functions runtime to securely store the [functions' access keys](../function-keys-how-to.md). For the highest level of security, you should use a [managed identity connection](../../app-service/overview-managed-identity.md) to your storage account.

1. For each slot, create a new app setting, for example, `DurableManagementStorage`. Set its value to the connection string of different storage accounts. These storage accounts are used by the Durable Functions extension for [reliable execution](../../durable-task/common/durable-task-orchestrations.md). Use a separate storage account for each slot. Don't mark this setting as a deployment slot setting. Again, managed identity-based connections are the most secure.

1. In your function app's [host.json file's durableTask section](durable-functions-host-json-settings.md), specify `connectionStringName` (Durable 2.x) or `azureStorageConnectionStringName` (Durable 1.x) as the name of the app setting you created in step 3.

The following diagram shows the described configuration of deployment slots and storage accounts. In this potential predeployment scenario, version 2 of a function app is running in the production slot, while version 1 remains in the staging slot.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/deployment-slot.png" alt-text="Screenshot of deployment slots and storage accounts configuration before slot swap for Durable Functions zero-downtime deployment.":::

### host.json example

The following JSON fragment shows the connection string setting in the *host.json* file.

```json
{
  "version": 2.0,
  "extensions": {
    "durableTask": {
      "hubName": "MyTaskHub",
      "storageProvider": {
        "connectionStringName": "DurableManagementStorage"
      }
    }
  }
}
```

> [!NOTE]
> For legacy Functions 1.x apps, use the `azureStorageConnectionStringName` property directly in the `durableTask` section instead of `storageProvider.connectionStringName`.

### CI/CD pipeline configuration

Configure your CI/CD pipeline to deploy only when your function app has no pending or running orchestration instances. When you're using Azure Pipelines, you can create a function that checks for these conditions, as in the following C# example. The same pattern applies to other languages — query for orchestration instances with `Pending` or `Running` status and return whether any exist.

```csharp
[FunctionName("StatusCheck")]
public static async Task<IActionResult> StatusCheck(
    [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestMessage req,
    [DurableClient] IDurableOrchestrationClient client,
    ILogger log)
{
    var runtimeStatus = new List<OrchestrationRuntimeStatus>();

    runtimeStatus.Add(OrchestrationRuntimeStatus.Pending);
    runtimeStatus.Add(OrchestrationRuntimeStatus.Running);

    var result = await client.ListInstancesAsync(new OrchestrationStatusQueryCondition() { RuntimeStatus = runtimeStatus }, CancellationToken.None);
    return (ActionResult)new OkObjectResult(new { HasRunning = result.DurableOrchestrationState.Any() });
}
```

Next, configure the staging gate to wait until no orchestrations are running. For more information, see [Release deployment control using gates](/azure/devops/pipelines/release/approvals/gates)

:::image type="content" source="media/durable-functions-zero-downtime-deployment/deployment-gate.png" alt-text="Screenshot of an Azure Pipelines deployment gate configuration for Durable Functions zero-downtime deployment.":::

Azure Pipelines checks your function app for running orchestration instances before your deployment starts.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/deployment-gate-2.png" alt-text="Screenshot of a running Azure Pipelines deployment gate check for orchestration instances.":::

Now the new version of your function app should be deployed to the staging slot.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/deployment-slot-2.png" alt-text="Screenshot of the new Durable Functions app version deployed to the staging slot during zero-downtime deployment.":::

Finally, swap slots. 

Application settings that aren't marked as deployment slot settings are also swapped, so the version 2 app keeps its reference to storage account A. Because orchestration state is tracked in the storage account, any orchestrations running on the version 2 app continue to run in the new slot without interruption.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/deployment-slot-3.png" alt-text="Screenshot of slot swap completion with Durable Functions app settings moved to production.":::

To use the same storage account for both slots, you can change the names of your task hubs. In this case, you need to manage the state of your slots and your app's HubName settings. To learn more, see [Task hubs in Durable Functions](../../durable-task/common/durable-task-hubs.md).

## Application routing

This strategy is the most complex, but it's the only option for systems with continuously running orchestrations that never have an idle window for slot swaps.

For this strategy, you create an *application router* in front of your Durable Functions — for example, an Azure Function with HTTP triggers or an API Management instance that routes based on version headers. The router is responsible for:

* Deploying the function app.
* Managing which version of the app is active.
* Routing orchestration requests to the correct function app based on version.

The first time an orchestration request is received, the router does the following tasks:

1. Creates a new function app in Azure.
2. Deploys your function app's code to the new function app in Azure.
3. Forwards the orchestration request to the new app.

The router manages the state of which version of your app's code is deployed to which function app in Azure.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/application-routing.png" alt-text="Screenshot of first-time application routing and deployment flow for Durable Functions zero-downtime deployment.":::

The router directs deployment and orchestration requests to the appropriate function app based on the version sent with the request. It ignores the patch version.

When you deploy a new version of your app without a breaking change, you can increment the patch version. The router deploys to your existing function app and sends requests for the old and new versions of the code, which are routed to the same function app.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/application-routing-2.png" alt-text="Screenshot of application routing when there is no breaking change in a Durable Functions deployment.":::

When you deploy a new version of your app with a breaking change, you can increment the major or minor version. Then the application router creates a new function app in Azure, deploys to it, and routes requests for the new version of your app to it. In the following diagram, running orchestrations on the 1.0.1 version of the app keep running, but requests for the 1.1.0 version are routed to the new function app.

:::image type="content" source="media/durable-functions-zero-downtime-deployment/application-routing-3.png" alt-text="Screenshot of application routing for a Durable Functions deployment with breaking changes.":::

The router monitors the status of orchestrations on the 1.0.1 version and removes apps after all orchestrations are finished. 

### Tracking store settings

Each function app should use separate scheduling queues, possibly in separate storage accounts. If you want to query all orchestrations instances across all versions of your application, you can share instance and history tables across your function apps. You can share tables by configuring the `trackingStoreConnectionStringName` and `trackingStoreNamePrefix` settings in the [host.json settings](durable-functions-host-json-settings.md) file so that they all use the same values.

For more information, see [Manage instances in Durable Functions in Azure](../../durable-task/common/durable-task-instance-management.md).

:::image type="content" source="media/durable-functions-zero-downtime-deployment/tracking-store-settings.png" alt-text="Screenshot of shared tracking store settings across versioned Durable Functions apps.":::

## Next steps

> [!div class="nextstepaction"]
> [Versioning Durable Functions](durable-functions-versioning.md)

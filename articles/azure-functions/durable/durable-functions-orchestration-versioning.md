---
title: Orchestration versioning in Durable Functions - Azure
description: Learn how to use the orchestration versioning feature in Durable Functions for zero-downtime deployments involving breaking changes.
author: AnatoliB
ms.topic: conceptual
ms.date: 07/03/2025
ms.author: azfuncdf
ms.custom: fasttrack-edit
#Customer intent: As a Durable Functions developer, I want to deploy breaking changes to my orchestrations without interrupting in-flight instances, so that I can maintain zero-downtime deployments.
---

# Orchestration versioning in Durable Functions (Azure Functions)

Orchestration versioning addresses [the core challenge](durable-functions-versioning.md) of deploying changes to orchestrator functions while maintaining the deterministic execution model that Durable Functions requires. Without this feature, breaking changes to orchestrator logic or activity function signatures would cause in-flight orchestration instances to fail during replay because they would break the [determinism requirement](durable-functions-code-constraints.md) that ensures reliable orchestration execution. This built-in feature provides automatic version isolation with minimal configuration. It's backend agnostic, so it can be used by apps leveraging any of the Durable Function's [storage providers](durable-functions-storage-providers.md).

## Terminology

This article uses two related but distinct terms:
- **Orchestrator function** (or simply "orchestrator"): Refers to the function code that defines the workflow logic - the template or blueprint for how a workflow should execute.
- **Orchestration instance** (or simply "orchestration"): Refers to a specific running execution of an orchestrator function, with its own state, instance ID, and inputs. Multiple orchestration instances can run concurrently from the same orchestrator function.

Understanding this distinction is crucial for orchestration versioning, where the orchestrator function code contains version-aware logic, while orchestration instances are permanently associated with a specific version when created.

## How it works

The orchestration versioning feature operates on these core principles:

- **Version Association**: When an orchestration instance is created, it gets a version permanently associated with it.

- **Version-aware Execution**: Orchestrator function code can examine the version value associated with the current orchestration instance and branch execution accordingly.

- **Backward Compatibility**: Workers running newer orchestrator versions can continue executing orchestration instances created by older orchestrator versions.

- **Forward Protection**: The runtime automatically prevents workers running older orchestrator versions from executing orchestrations started by newer orchestrator versions.

> [!IMPORTANT]
> Orchestration versioning is currently in public preview for apps running in the .NET isolated model. Use `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` package version **>=1.5.0**.

## Basic usage

The most common use case for orchestration versioning is when you need to make breaking changes to your orchestrator logic while keeping existing in-flight orchestration instances running with their original version. All you need to do is update the `defaultVersion` in your `host.json` and modify your orchestrator code to check the orchestration version and branch execution accordingly. Let's walk through the required steps.

> [!NOTE]
> The behavior described in this section targets the most common situations, and this is what the default configuration provides. However, it can be modified if needed (see [Advanced usage](#advanced-usage) for details).

### Step 1: defaultVersion configuration

To configure the default version for your orchestrations, you need to add or update the `defaultVersion` setting in the `host.json` file in your Azure Functions project:

```json
{
  "extensions": {
    "durableTask": {
      "defaultVersion": "<version>"
    }
  }
}
```

The version string can follow any format that suits your versioning strategy:
- Multi-part versioning: `"1.0.0"`, `"2.1.0"`
- Simple numbering: `"1"`, `"2"`
- Date-based: `"2025-01-01"`
- Custom format: `"v1.0-release"`

After you set the `defaultVersion`, all new orchestration instances will be permanently associated with that version.

#### Version comparison rules

When the `Strict` or `CurrentOrOlder` strategy is selected (see [Version matching](#version-matching)), the runtime compares the orchestration instance's version with the `defaultVersion` value of the worker using the following rules:

- Empty or null versions are treated as equal.
- An empty or null version is considered older than any defined version.
- If both versions can be parsed as `System.Version`, the `CompareTo` method is used.
- Otherwise, case-insensitive string comparison is performed.

### Step 2: Orchestrator function logic

To implement version-aware logic in your orchestrator function, you can use the context parameter passed to the orchestrator to access the current orchestration instance's version, which allows you to branch your orchestrator logic based on the version.

> [!IMPORTANT]
> When implementing version-aware logic, it's **critically important** to preserve the exact orchestrator logic for older versions. Any changes to the sequence, order, or signature of activity calls for existing versions may break deterministic replay and cause in-flight orchestrations to fail or produce incorrect results. The old version code paths must remain unchanged once deployed.

```csharp
[Function("MyOrchestrator")]
public static async Task<string> RunOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    if (context.Version == "1.0")
    {
        // Original logic for version 1.0
        ...
    }
    else if (context.Version == "2.0")
    {
        // New logic for version 2.0
        ...
    }
    ...
}
```

> [!NOTE]
> The `context.Version` property is **read-only** and reflects the version that was permanently associated with the orchestration instance when it was created. You cannot modify this value during orchestration execution. If you want to specify a version through means other than `host.json`, you can do so when starting an orchestration instance with the orchestration client APIs (see [Starting New Orchestrations with Specific Versions](#starting-new-orchestrations-with-specific-versions)).

> [!TIP]
> If you're just starting to use orchestration versioning and you already have in-flight orchestrations that were created before you specified a `defaultVersion`, you can still add the `defaultVersion` setting to your `host.json` now. For all previously created orchestrations, `context.Version` returns `null` (or an equivalent language-dependent value), so you can structure your orchestrator logic to handle both the legacy (null version) and new versioned orchestrations accordingly. In C#, you can check for `context.Version == null` or `context.Version is null` to handle the legacy case. Please also note that specifying `"defaultVersion": null` in `host.json` is equivalent to not specifying it at all.

> [!TIP]
> Depending on your situation, you may prefer branching on different levels. You can make a local change precisely where this change is required, like the example shows. Alternatively, you can branch at a higher level, even at the entire orchestrator implementation level, which introduces some code duplication, but may keep the execution flow clear. It's up to you to choose the approach that best fits your scenario and coding style.

### What happens after deployment

Here's what to expect once you deploy your updated orchestrator function with the new version logic:

- **Worker Coexistence**: Workers containing the new orchestrator function code will start, while some workers with the old code are potentially still active.

- **Version Assignment for New Instances**: All new orchestrations and sub-orchestrations created by the new workers will get the version from `defaultVersion` assigned to them.

- **New Worker Compatibility**: New workers will be able to process both the newly created orchestrations and the previously existing orchestrations because the changes performed in Step 2 of the previous section ensure backward compatibility through version-aware branching logic.

- **Old Worker Restrictions**: Old workers will be allowed to process only the orchestrations with a version _equal to or lower_ than the version specified in their own `defaultVersion` in `host.json`, because they aren't expected to have orchestrator code compatible with newer versions. This restriction prevents execution errors and unexpected behavior.

> [!NOTE]
> Orchestration versioning doesn't influence worker lifecycle. The Azure Functions platform manages worker provisioning and decommissioning based on regular rules depending on hosting options.

### Example: Replacing an activity in the sequence

This example shows how to replace one activity with a different activity in the middle of a sequence using orchestration versioning.

#### Version 1.0

**host.json configuration:**
```json
{
  "extensions": {
    "durableTask": {
      "defaultVersion": "1.0"
    }
  }
}
```

**Orchestrator function:**

```csharp
[Function("ProcessOrderOrchestrator")]
public static async Task<string> ProcessOrder(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var orderId = context.GetInput<string>();
    
    await context.CallActivityAsync("ValidateOrder", orderId);
    await context.CallActivityAsync("ProcessPayment", orderId);
    await context.CallActivityAsync("ShipOrder", orderId);
    
    return "Order processed successfully";
}
```

#### Version 2.0 with discount processing

**host.json configuration:**
```json
{
  "extensions": {
    "durableTask": {
      "defaultVersion": "2.0"
    }
  }
}
```

**Orchestrator function:**

```csharp
using DurableTask.Core.Settings;

[Function("ProcessOrderOrchestrator")]
public static async Task<string> ProcessOrder(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var orderId = context.GetInput<string>();

    await context.CallActivityAsync("ValidateOrder", orderId);

    if (VersioningSettings.CompareVersions(context.Version, "1.0") <= 0)
    {
        // Preserve original logic for existing instances
        await context.CallActivityAsync("ProcessPayment", orderId);
    }
    else // a higher version (including 2.0)
    {
        // New logic with discount processing (replaces payment processing)
        await context.CallActivityAsync("ApplyDiscount", orderId);
        await context.CallActivityAsync("ProcessPaymentWithDiscount", orderId);
    }
    
    await context.CallActivityAsync("ShipOrder", orderId);

    return "Order processed successfully";
}
```

## Advanced usage

For more sophisticated versioning scenarios, you can configure other settings to control how the runtime handles version matches and mismatches.

> [!TIP]
> Use the default configuration (`CurrentOrOlder` with `Reject`) for most scenarios to enable safe rolling deployments while preserving orchestration state during version transitions. We recommend proceeding with the advanced configuration only if you have specific requirements that can't be met with the default behavior.

### Version matching

The `versionMatchStrategy` setting determines how the runtime matches orchestration versions when loading orchestrator functions. It controls which orchestration instances a worker can process based on version compatibility.

#### Configuration

```json
{
  "extensions": {
    "durableTask": {
      "defaultVersion": "<version>",
      "versionMatchStrategy": "CurrentOrOlder"
    }
  }
}
```

#### Available strategies

- **`None`** (not recommended): Ignore orchestration version completely. All work received is processed regardless of version. This strategy effectively disables version checking and allows any worker to process any orchestration instance.

- **`Strict`**: Only process tasks from orchestrations with the exact same version as the version specified by `defaultVersion` in the worker's `host.json`. This strategy provides the highest level of version isolation but requires careful deployment coordination to avoid orphaned orchestrations. The consequences of version mismatch are described in the [Version mismatch handling](#version-mismatch-handling) section.

- **`CurrentOrOlder`** (default): Process tasks from orchestrations whose version is less than or equal to the version specified by `defaultVersion` in the worker's `host.json`. This strategy enables backward compatibility, allowing newer workers to handle orchestrations started by older orchestrator versions while preventing older workers from processing newer orchestrations. The consequences of version mismatch are described in the [Version mismatch handling](#version-mismatch-handling) section.

### Version mismatch handling

The `versionFailureStrategy` setting determines what happens when an orchestration instance version doesn't match the current `defaultVersion`.

**Configuration:**
```json
{
  "extensions": {
    "durableTask": {
      "defaultVersion": "<version>",
      "versionFailureStrategy": "Reject"
    }
  }
}
```

**Available strategies:**

- **`Reject`** (default): Don't process the orchestration. The orchestration instance remains in its current state and can be retried later when a compatible worker becomes available. This strategy is the safest option as it preserves orchestration state.

- **`Fail`**: Fail the orchestration. This strategy immediately terminates the orchestration instance with a failure state, which may be appropriate in scenarios where version mismatches indicate serious deployment issues.

### Starting new orchestrations with specific versions

By default, all new orchestration instances are created with the current `defaultVersion` specified in your `host.json` configuration. However, you may have scenarios where you need to create orchestrations with a specific version, even if it differs from the current default.

**When to use specific versions:**
- **Gradual migration**: You want to keep creating orchestrations with an older version even after deploying a newer version.
- **Testing scenarios**: You need to test specific version behavior in production.
- **Rollback situations**: You need to temporarily revert to creating instances with a previous version.
- **Version-specific workflows**: Different business processes require different orchestration versions.

You can override the default version by providing a specific version value when creating new orchestration instances using the orchestration client APIs. This allows fine-grained control over which version each new orchestration instance uses.

```csharp
[Function("HttpStart")]
public static async Task<HttpResponseData> HttpStart(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req,
    [DurableClient] DurableTaskClient client,
    FunctionContext executionContext)
{
    var options = new StartOrchestrationOptions
    {
        Version = "1.0"
    };
    
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync("ProcessOrderOrchestrator", orderId, options);

    // ...
}
```

### Removing legacy code paths

Over time, you may want to remove legacy code paths from your orchestrator functions to simplify maintenance and reduce technical debt. However, removing code must be done carefully to avoid breaking existing orchestration instances.

**When it's safe to remove legacy code:**
- All orchestration instances using the old version have completed (succeeded, failed, or been terminated)
- No new orchestration instances will be created with the old version
- You have verified through monitoring or querying that no instances are running with the legacy version
- A sufficient time period has passed since the old version was last deployed (considering your business continuity requirements)

**Best practices for removal:**
- **Monitor actively running instances**: Use the Durable Functions management APIs to query for instances using specific versions.
- **Set retention policies**: Define how long you intend to maintain backward compatibility for each version.
- **Remove incrementally**: Consider removing one version at a time rather than multiple versions simultaneously.
- **Document removal**: Maintain clear records of when versions were removed and why.

> [!WARNING]
> Removing legacy code paths while orchestration instances are still running those versions may cause deterministic replay failures or unexpected behavior. Always verify that no instances are using the legacy version before removing the code.

## Best practices

### Version management

- **Use multi-part versioning**: Adopt a consistent versioning scheme like `major.minor.patch`.
- **Document breaking changes**: Clearly document what changes require a new version.
- **Plan version lifecycle**: Define when to remove legacy code paths.

### Code organization

- **Separate version logic**: Use clear branching or separate methods for different versions.
- **Preserve determinism**: Avoid modifying existing version logic once deployed. If changes are absolutely necessary (such as critical bug fixes), ensure they maintain deterministic behavior and don't alter the sequence of operations, or expect the newer orchestrator versions to fail when processing older orchestrations.
- **Test thoroughly**: Test all version paths, especially during transitions.

### Monitoring and observability

- **Log version information**: Include version in your logging for easier debugging.
- **Monitor version distribution**: Track which versions are actively running.
- **Set up alerts**: Monitor for any version-related errors.

## Troubleshooting

### Common issues

- **Issue**: Orchestration instances created with version 1.0 are failing after deploying version 2.0
   - **Solution**: Ensure the version 1.0 code path in your orchestrator remains exactly the same. Any changes to the execution sequence may break deterministic replay.

- **Issue**: Workers running older orchestrator versions can't execute new orchestrations
   - **Solution**: This is expected behavior. The runtime intentionally prevents older workers from executing orchestrations with newer versions to maintain safety. Ensure all workers are updated to the latest orchestrator version and their `defaultVersion` setting in `host.json` is updated accordingly. You can modify this behavior if needed using the advanced configuration options (see [Advanced usage](#advanced-usage) for details).

- **Issue**: Version information isn't available in orchestrator (`context.Version` is null, regardless of the `defaultVersion` setting)
   - **Solution**: Verify that you're using a supported language and a Durable Functions extension version that supports orchestration versioning:
     - For .NET Isolated, use `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` version **1.5.0** or later.

- **Issue**: Orchestrations of a newer version are making very slow progress or are completely stuck
   - **Solution**: The problem can have different root causes:
     1. **Insufficient newer workers**: Make sure that a sufficient number of workers containing an equal or higher version in `defaultVersion` are deployed and active to handle the newer orchestrations.
     2. **Orchestration routing interference from older workers**: Old workers can interfere with the orchestration routing mechanism, making it harder for new workers to pick up orchestrations for processing. This can be especially noticeable when using certain storage providers (Azure Storage or MSSQL). Normally, the Azure Functions platform ensures that old workers are disposed of soon after a deployment, so any delay is typically not significant. However, if you are using a configuration that allows you to control the lifecycle of older workers, make sure the older workers are eventually shut down. Alternatively, consider using the [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md), as it provides an improved routing mechanism that is less susceptible to this issue.

## Next steps

> [!div class="nextstepaction"]
> [Learn about zero-downtime deployment strategies](durable-functions-zero-downtime-deployment.md)

> [!div class="nextstepaction"]
> [Learn about general versioning strategies](durable-functions-versioning.md)

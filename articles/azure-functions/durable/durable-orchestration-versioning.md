---
title: Orchestration versioning
description: Learn how to version orchestrations for safe deployments with Durable Functions and Durable Task SDKs.
ms.topic: concept-article
ms.date: 02/25/2026
author: AnatoliB
ms.author: azfuncdf
ms.reviewer: hannahhunter
zone_pivot_groups: azure-durable-approach
---

# Orchestration versioning

Deploying changes to orchestrator logic is a key consideration when working with durable orchestration systems. If an orchestration is interrupted and later resumed (for instance, during a host update), the runtime replays the events of the orchestration, ensuring all previous steps execute successfully before taking the next step. If the orchestration code changed between deployments, the steps it takes might no longer be the same. In that case, the system throws a nondeterminism error instead of allowing the orchestration to continue.

_Orchestration versioning_ prevents problems related to nondeterminism, allowing you to work seamlessly with new (or old) orchestrations while maintaining the deterministic execution model that durable orchestrations require.

::: zone pivot="durable-functions"

This built-in feature provides automatic version isolation with minimal configuration. It's backend agnostic, so any app using any of the Durable Functions [storage providers](durable-functions-storage-providers.md), including the [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md), can use it.

::: zone-end

::: zone pivot="durable-task-sdks"

Durable Task SDKs support two styles of versioning, which you can use separately or together:

- [Client/context-based conditional versioning](#setting-the-default-version)—set a version on the client and branch logic in the orchestrator.
- [Worker-based versioning](#version-matching)—let the worker decide which orchestration versions it can process.

::: zone-end


## Terminology

This article uses two related but distinct terms:

- **Orchestrator function** (or simply "orchestrator"): The function code that defines the workflow logic — the template or blueprint for how a workflow should execute.
- **Orchestration instance** (or simply "orchestration"): A specific running execution of an orchestrator function, with its own state, instance ID, and inputs. Multiple orchestration instances can run concurrently from the same orchestrator function.

Understanding this distinction is crucial for orchestration versioning. The orchestrator function code contains version-aware logic, while orchestration instances are permanently associated with a specific version when created.

## How it works

Orchestration versioning operates on these core principles:

- **Version association**: When an orchestration instance is created, it gets a version permanently associated with it.
- **Version-aware execution**: Orchestrator code examines the version value associated with the current orchestration instance and branches execution accordingly.
- **Backward compatibility**: Workers running newer orchestrator versions continue to execute orchestration instances created by older versions.
- **Forward protection**: The runtime prevents workers running older orchestrator versions from executing orchestrations started by newer versions.

::: zone pivot="durable-functions"

## Prerequisites

Before you use orchestration versioning, ensure you have the required package versions for your programming language.

If you're using a non-.NET language (JavaScript, Python, PowerShell, or Java) with [extension bundles](../extension-bundles.md), your function app must reference **Extension Bundle version 4.30.0 or later**. Configure the `extensionBundle` range in `host.json` so that the minimum version is at least `4.30.0`. For example:

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[4.30.0, 5.0.0)"
    }
}
```

For details on choosing and updating bundle versions, see the [extension bundle configuration documentation](../extension-bundles.md).

In addition to the extension bundle requirement for non-.NET languages, you also need to use the minimum version of the language-specific SDK package listed below. Both the extension bundle and the SDK package are required for orchestration versioning to work correctly.

# [C#](#tab/csharp)

Use `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` version [1.14.0](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/1.14.0) or later.

# [JavaScript](#tab/javascript)

Use `durable-functions` version [3.3.0](https://www.npmjs.com/package/durable-functions/v/3.3.0) or later.

# [Python](#tab/python)

Use `azure-functions-durable` version [1.5.0](https://pypi.org/project/azure-functions-durable/1.5.0/) or later.

# [PowerShell](#tab/powershell)

Use `AzureFunctions.PowerShell.Durable.SDK` version [2.2.0](https://www.powershellgallery.com/packages/AzureFunctions.PowerShell.Durable.SDK/2.2.0) or later. Ensure you're using the standalone [Durable Functions PowerShell SDK](durable-functions-powershell-v2-sdk-migration-guide.md).

# [Java](#tab/java)

Use `durabletask-azure-functions` version [1.6.3](https://mvnrepository.com/artifact/com.microsoft/durabletask-azure-functions/1.6.3) or later.

---

::: zone-end

## Setting the default version

To use orchestration versioning, first configure a default version for new orchestration instances.

::: zone pivot="durable-functions"

Add or update the `defaultVersion` setting in the `host.json` file in your Azure Functions project:

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

After you set `defaultVersion`, all new orchestration instances are permanently associated with that version.

::: zone-end

::: zone pivot="durable-task-sdks"

Set the default version in the client builder when configuring your application.

# [C#](#tab/csharp)

> [!NOTE]
> Available in the .NET SDK (`Microsoft.DurableTask.Client.AzureManaged`) since v1.9.0.

```csharp
builder.Services.AddDurableTaskClient(builder =>
{
    builder.UseDurableTaskScheduler(connectionString);
    builder.UseDefaultVersion("1.0.0");
});
```

The version is a simple string and accepts any value. The SDK tries to convert it to .NET's `System.Version`. If successful, that library is used for comparison. Otherwise, a simple string comparison is used.

# [JavaScript](#tab/javascript)

```javascript
const client = new DurableTaskAzureManagedClientBuilder()
    .connectionString(connectionString)
    .logger(logger)
    .build();

// Schedule an orchestration with an explicit version
const instanceId = await client.scheduleNewOrchestration(
    myOrchestrator, undefined, { version: "1.0.0" });
```

The version is a simple string. The SDK uses semantic versioning comparison via `compareVersionTo()` on the orchestration context.

# [Python](#tab/python)

```python
c = DurableTaskSchedulerClient(
    host_address=endpoint,
    secure_channel=secure_channel,
    taskhub=taskhub_name,
    token_credential=credential,
    default_version="1.0.0",
)
```

The version is a simple string parsed using `packaging.version`, which supports semantic versioning comparison.

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

> [!NOTE]
> Available in the Java SDK (`com.microsoft:durabletask-client`) since v1.6.0.

```java
public DurableTaskClient durableTaskClient(DurableTaskProperties properties) {
    return DurableTaskSchedulerClientExtensions
        .createClientBuilder(properties.getConnectionString())
        .defaultVersion("1.0")
        .build();
}
```

The version is a simple string and accepts any value.

---

After you set the default version on the client, any orchestration started by this client is permanently associated with that version. The version is also available in the orchestration context, allowing you to use it in conditional statements.

::: zone-end

### Version comparison rules

::: zone pivot="durable-functions"

When the `Strict` or `CurrentOrOlder` strategy is selected (see [Version matching](#version-matching)), the runtime compares the orchestration instance's version with the `defaultVersion` value of the worker using the following rules:

- Empty or null versions are treated as equal.
- An empty or null version is considered older than any defined version.
- If both versions are numeric (for example, `"1.0"` and `"2.0"`), they're compared as version numbers, so `"2.0"` is newer than `"1.0"`.
- Otherwise, case-insensitive string comparison is performed.

The following examples illustrate how version comparison works:

| Version A | Version B | Result |
| --- | --- | --- |
| `"1.0"` | `"2.0"` | A is older |
| `null` | `"1.0"` | A is older |
| `null` | `null` | Equal |
| `"v1-release"` | `"v2-release"` | A is older (alphabetical) |

::: zone-end

::: zone pivot="durable-task-sdks"

When the `Strict` or `CurrentOrOlder` match strategy is selected (see [Version matching](#version-matching)), version comparison depends on the language:

- **.NET**: The SDK tries to parse the version as `System.Version`. If both parse successfully, comparison uses `CompareTo`. Otherwise, the SDK uses string comparison.
- **Python**: The SDK uses `packaging.version` for semantic versioning comparison.
- **Java**: The SDK compares the version as a simple string.

::: zone-end

## Version-aware orchestrator logic

To implement version-aware logic, use the context parameter to access the current orchestration instance's version and branch execution.

> [!IMPORTANT]
> When implementing version-aware logic, it's **critical** to preserve the exact orchestrator logic for older versions. Any changes to the sequence, order, or signature of activity calls for existing versions can break deterministic replay and cause in-flight orchestrations to fail or produce incorrect results. Keep old version code paths unchanged after deployment.

::: zone pivot="durable-functions"

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestrator(function* (context) {
    if (context.df.version === "1.0") {
        // Original logic for version 1.0
        // ...
    } else if (context.df.version === "2.0") {
        // New logic for version 2.0
        // ...
    }
    // ...
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.FUNCTION)

@myApp.orchestration_trigger(context_name="context")
def orchestrator_function(context: df.DurableOrchestrationContext):
    if context.version == "1.0":
        # Original logic for version 1.0
        # ...
    elif context.version == "2.0":
        # New logic for version 2.0
        # ...
    # ...
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

if ($Context.Version -eq "1.0") {
    # Original logic for version 1.0
    # ...
} elseif ($Context.Version -eq "2.0") {
    # New logic for version 2.0
    # ...
}
# ...
```

# [Java](#tab/java)

```java
@FunctionName("MyOrchestrator")
public String myOrchestrator(
    @DurableOrchestrationTrigger(name = "context") 
    TaskOrchestrationContext context) {
    
    String version = context.getVersion();
    if ("1.0".equals(version)) {
        // Original logic for version 1.0
        // ...
    } else if ("2.0".equals(version)) {
        // New logic for version 2.0
        // ...
    }
    // ...
}
```

---

::: zone-end

::: zone pivot="durable-task-sdks"

# [C#](#tab/csharp)

```csharp
[DurableTask]
class HelloCities : TaskOrchestrator<string, List<string>>
{
    private readonly string[] Cities = ["Seattle", "Amsterdam", "Hyderabad"];

    public override async Task<List<string>> RunAsync(
        TaskOrchestrationContext context, string input)
    {
        List<string> results = [];
        foreach (var city in Cities)
        {
            results.Add(await context.CallSayHelloAsync($"{city} v{context.Version}"));
            if (context.CompareVersionTo("2.0.0") >= 0)
            {
                results.Add(await context.CallSayGoodbyeAsync($"{city} v{context.Version}"));
            }
        }
        return results;
    }
}
```

# [JavaScript](#tab/javascript)

```javascript
const versionedOrchestrator = async function* (ctx) {
    const comparison = ctx.compareVersionTo("2.0.0");

    let result;
    if (comparison >= 0) {
        // v2.0.0 or newer — uses new logic
        result = yield ctx.callActivity(doWork, `v2-logic (version=${ctx.version})`);
    } else {
        // Older than v2.0.0 — uses legacy logic
        result = yield ctx.callActivity(doWork, `v1-logic (version=${ctx.version})`);
    }

    return { version: ctx.version, result, comparedTo2: comparison };
};
```

# [Python](#tab/python)

```python
def orchestrator(ctx: task.OrchestrationContext, _):
    if ctx.version == "1.0.0":
        result: int = yield ctx.call_activity(activity_v1, input="input for v1")
    elif ctx.version == "2.0.0":
        result: int = yield ctx.call_activity(activity_v2, input="input for v2")
    else:
        raise ValueError(f"Unsupported version: {ctx.version}")
    return {"result": result}
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
public TaskOrchestration create() {
    return ctx -> {
        List<String> results = new ArrayList<>();
        for (String city : new String[]{"Seattle", "Amsterdam", "Hyderabad"}) {
            results.add(ctx.callActivity("SayHello", city, String.class).await());
            if (VersionUtils.compareVersions(ctx.getVersion(), "2.0.0") >= 0) {
                results.add(ctx.callActivity("SayGoodbye", city, String.class).await());
            }
        }
        ctx.complete(results);
    };
}
```

---

::: zone-end

> [!NOTE]
> The `context.Version` property is **read-only** and reflects the version permanently associated with the orchestration instance at creation time. This value can't be modified during orchestration execution.

> [!TIP]
> If you already have in-flight orchestrations created before you specified a default version, `context.Version` returns null (or a language-dependent equivalent) for those instances. Structure your orchestrator logic to handle both the legacy (null version) and new versioned orchestrations.

::: zone pivot="durable-functions"

## Deployment behavior

Here's what to expect when you deploy your updated orchestrator function with the new version logic:

- **Worker coexistence**: Workers containing the new orchestrator function code start, while some workers with the old code are potentially still active.
- **Version assignment for new instances**: All new orchestrations and sub-orchestrations created by the new workers get the version from `defaultVersion` assigned to them.
- **New worker compatibility**: New workers can process both the newly created orchestrations and the previously existing orchestrations because the version-aware branching logic ensures backward compatibility.
- **Old worker restrictions**: Old workers can process only the orchestrations with a version equal to or lower than the version specified in their own `defaultVersion` in `host.json`, because they aren't expected to have orchestrator code compatible with newer versions.

> [!NOTE]
> Orchestration versioning doesn't affect worker lifecycle. The Azure Functions platform manages worker setup and decommissioning based on regular rules depending on hosting models.

## Example: Replace an activity in the sequence

This example shows how to replace an activity in the middle of a sequence by using orchestration versioning.

### Version 1.0

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

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

df.app.orchestrator(function* (context) {
    const orderId = context.df.getInput();
    
    yield context.df.callActivity("ValidateOrder", orderId);
    yield context.df.callActivity("ProcessPayment", orderId);
    yield context.df.callActivity("ShipOrder", orderId);
    
    return "Order processed successfully";
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.FUNCTION)

@myApp.orchestration_trigger(context_name="context")
def orchestrator_function(context: df.DurableOrchestrationContext):
    order_id = context.get_input()
    
    yield context.call_activity("ValidateOrder", order_id)
    yield context.call_activity("ProcessPayment", order_id)
    yield context.call_activity("ShipOrder", order_id)
    
    return "Order processed successfully"
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$orderId = $Context.Input

Invoke-DurableActivity -FunctionName "ValidateOrder" -Input $orderId
Invoke-DurableActivity -FunctionName "ProcessPayment" -Input $orderId
Invoke-DurableActivity -FunctionName "ShipOrder" -Input $orderId

return "Order processed successfully"
```

# [Java](#tab/java)

```java
@FunctionName("ProcessOrderOrchestrator")
public String processOrder(
    @DurableOrchestrationTrigger(name = "context") 
    TaskOrchestrationContext context) {
    
    String orderId = context.getInput(String.class);
    
    context.callActivity("ValidateOrder", orderId).await();
    context.callActivity("ProcessPayment", orderId).await();
    context.callActivity("ShipOrder", orderId).await();
    
    return "Order processed successfully";
}
```

---

### Version 2.0 with discount processing

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

# [C#](#tab/csharp)

```csharp
[Function("ProcessOrderOrchestrator")]
public static async Task<string> ProcessOrder(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var orderId = context.GetInput<string>();

    await context.CallActivityAsync("ValidateOrder", orderId);

    if (TaskOrchestrationVersioningUtils.CompareVersions(context.Version, "1.0") <= 0)
    {
        // Preserve original logic for existing instances
        await context.CallActivityAsync("ProcessPayment", orderId);
    }
    else
    {
        // New logic with discount processing
        await context.CallActivityAsync("ApplyDiscount", orderId);
        await context.CallActivityAsync("ProcessPaymentWithDiscount", orderId);
    }
    
    await context.CallActivityAsync("ShipOrder", orderId);

    return "Order processed successfully";
}
```

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");
const semver = require('semver');

df.app.orchestrator(function* (context) {
    const orderId = context.df.getInput();

    yield context.df.callActivity("ValidateOrder", orderId);

    if (compareVersions(context.df.version, "1.0") <= 0) {
        // Preserve original logic for existing instances
        yield context.df.callActivity("ProcessPayment", orderId);
    } else {
        // New logic with discount processing
        yield context.df.callActivity("ApplyDiscount", orderId);
        yield context.df.callActivity("ProcessPaymentWithDiscount", orderId);
    }
    
    yield context.df.callActivity("ShipOrder", orderId);

    return "Order processed successfully";
});

function compareVersions(version1, version2) {
  const v1 = semver.coerce(version1);
  const v2 = semver.coerce(version2);

  if (!v1 || !v2) {
    throw new Error(`Invalid version string(s): "${version1}" vs "${version2}"`);
  }
  return semver.compare(v1, v2);
}
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from packaging import version

myApp = df.DFApp(http_auth_level=func.AuthLevel.FUNCTION)

@myApp.orchestration_trigger(context_name="context")
def orchestrator_function(context: df.DurableOrchestrationContext):
    order_id = context.get_input()

    yield context.call_activity("ValidateOrder", order_id)

    if compare_versions(context.version, "1.0") <= 0:
        # Preserve original logic for existing instances
        yield context.call_activity("ProcessPayment", order_id)
    else:
        # New logic with discount processing
        yield context.call_activity("ApplyDiscount", order_id)
        yield context.call_activity("ProcessPaymentWithDiscount", order_id)
    
    yield context.call_activity("ShipOrder", order_id)

    return "Order processed successfully"

def compare_versions(version1, version2):
    v1 = version.parse(version1)
    v2 = version.parse(version2)

    if v1 < v2:
        return -1
    elif v1 > v2:
        return 1
    return 0
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$orderId = $Context.Input

Invoke-DurableActivity -FunctionName "ValidateOrder" -Input $orderId

if ((Compare-Version $Context.Version "1.0") -le 0) {
    # Preserve original logic for existing instances
    Invoke-DurableActivity -FunctionName "ProcessPayment" -Input $orderId
} else {
    # New logic with discount processing
    Invoke-DurableActivity -FunctionName "ApplyDiscount" -Input $orderId
    Invoke-DurableActivity -FunctionName "ProcessPaymentWithDiscount" -Input $orderId
}

Invoke-DurableActivity -FunctionName "ShipOrder" -Input $orderId

return "Order processed successfully"

function Compare-Version([string]$version1, [string]$version2) {
    $v1 = [Version]$version1
    $v2 = [Version]$version2

    if ($v1 -lt $v2) { return -1 }
    elseif ($v1 -gt $v2) { return 1 }
    else { return 0 }
}
```

# [Java](#tab/java)

```java
import org.apache.maven.artifact.versioning.ComparableVersion;

@FunctionName("ProcessOrderOrchestrator")
public String processOrder(
    @DurableOrchestrationTrigger(name = "taskOrchestrationContext") 
    TaskOrchestrationContext context) {
    
    String orderId = context.getInput(String.class);

    context.callActivity("ValidateOrder", orderId).await();

    if (compareVersions(context.getVersion(), "1.0") <= 0) {
        // Preserve original logic for existing instances
        context.callActivity("ProcessPayment", orderId).await();
    } else {
        // New logic with discount processing
        context.callActivity("ApplyDiscount", orderId).await();
        context.callActivity("ProcessPaymentWithDiscount", orderId).await();
    }
    
    context.callActivity("ShipOrder", orderId).await();

    return "Order processed successfully";
}

private int compareVersions(String version1, String version2) {
    ComparableVersion v1 = new ComparableVersion(version1);
    ComparableVersion v2 = new ComparableVersion(version2);
    return v1.compareTo(v2);
}
```

---

::: zone-end

## Version matching

The version matching strategy determines which orchestration instances a worker processes based on version compatibility.

The following table describes the available strategies:

| Strategy | Description |
| --- | --- |
| **None** | Version isn't considered when processing work. All work is processed regardless of version. |
| **Strict** | The orchestration version and the worker version must match exactly. |
| **CurrentOrOlder** | The orchestration version must be equal to or less than the worker version. This is the default strategy. |

::: zone pivot="durable-functions"

### Configuration

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

- **`None`** (not recommended): Disables version checking. Any worker processes any orchestration instance.
- **`Strict`**: Processes tasks only from orchestrations with the exact same version as `defaultVersion`. Requires careful deployment coordination to avoid orphaned orchestrations.
- **`CurrentOrOlder`** (default): Processes tasks from orchestrations with a version less than or equal to `defaultVersion`. Enables backward compatibility while preventing older workers from processing newer orchestrations.

::: zone-end

::: zone pivot="durable-task-sdks"

Configure the match strategy through the worker builder.

# [C#](#tab/csharp)

> [!NOTE]
> Available in the .NET SDK (Microsoft.DurableTask.Worker.AzureManaged) since v1.9.0.

```csharp
builder.Services.AddDurableTaskWorker(builder =>
{
    builder.AddTasks(r => r.AddAllGeneratedTasks());
    builder.UseDurableTaskScheduler(connectionString);
    builder.UseVersioning(new DurableTaskWorkerOptions.VersioningOptions
    {
        Version = "1.0.0",
        DefaultVersion = "1.0.0",
        MatchStrategy = DurableTaskWorkerOptions.VersionMatchStrategy.Strict,
        FailureStrategy = DurableTaskWorkerOptions.VersionFailureStrategy.Reject,
    });
});
```

# [JavaScript](#tab/javascript)

```javascript
const worker = new DurableTaskAzureManagedWorkerBuilder()
    .connectionString(connectionString)
    .logger(logger)
    .versioning({
        version: "2.0.0",
        matchStrategy: VersionMatchStrategy.Strict,
        failureStrategy: VersionFailureStrategy.Fail,
    })
    .addOrchestrator(myOrchestrator)
    .addActivity(doWork)
    .build();
```

# [Python](#tab/python)

```python
with DurableTaskSchedulerWorker(
    host_address=endpoint,
    secure_channel=secure_channel,
    taskhub=taskhub_name,
    token_credential=credential,
) as w:
    w.use_versioning(worker.VersioningOptions(
        version="2.0.0",
        default_version="2.0.0",
        match_strategy=worker.VersionMatchStrategy.CURRENT_OR_OLDER,
        failure_strategy=worker.VersionFailureStrategy.FAIL,
    ))
    w.add_orchestrator(orchestrator)
    w.add_activity(activity_v1)
    w.add_activity(activity_v2)
    w.start()
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

> [!NOTE]
> Available in the Java SDK (com.microsoft:durabletask-client) since v1.6.0.

```java
DurableTaskGrpcWorkerBuilder builder = new DurableTaskGrpcWorkerBuilder();
builder.useVersioning(new DurableTaskGrpcWorkerVersioningOptions(
    "1.0",
    "1.0",
    DurableTaskGrpcWorkerVersioningOptions.VersionMatchStrategy.CURRENTOROLDER,
    DurableTaskGrpcWorkerVersioningOptions.VersionFailureStrategy.REJECT));
```

---

::: zone-end

## Version mismatch handling

The version mismatch handling strategy determines what happens when an orchestration instance version doesn't match the worker version.

The following table describes the available strategies:

| Strategy | Description |
| --- | --- |
| **Reject** | The orchestration is rejected and returned to the work queue. Another worker can attempt it later. This strategy is the default. |
| **Fail** | The orchestration is failed and removed from the work queue. |

::: zone pivot="durable-functions"

### Configuration

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

- **`Reject`** (default): The orchestration instance remains in its current state and can be retried later when a compatible worker becomes available. This strategy is the safest option because it preserves orchestration state.
- **`Fail`**: Immediately terminates the orchestration instance with a failure state. This option might be appropriate when version mismatches indicate serious deployment issues.

::: zone-end

::: zone pivot="durable-task-sdks"

### When to use each strategy

**Reject**: Use this strategy when you want the orchestration to retry later or on a different worker. During a `Reject` failure:

1. The orchestration is rejected and returned to the work queue.
1. Another worker dequeues the orchestration.
1. The dequeued orchestration could land on a different worker or the same one again.

The process repeats until a worker that can handle the orchestration is available. This strategy seamlessly handles rolling deployments where workers are updated progressively.

**Fail**: Use this strategy when no other version of the worker is expected to process the orchestration. The orchestration fails and enters a terminal state.

::: zone-end

::: zone pivot="durable-functions"

## Starting orchestrations with specific versions

By default, all new orchestration instances use the current `defaultVersion` specified in your `host.json` configuration. However, you might have scenarios where you need to create orchestrations with a specific version that differs from the current default.

**When to use specific versions**
- **Gradual migration**: Keep creating orchestrations with an older version even after deploying a newer version.
- **Testing scenarios**: Test specific version behavior in production.
- **Rollback situations**: Temporarily revert to creating instances with a previous version.
- **Version-specific workflows**: Different business processes require different orchestration versions.

# [C#](#tab/csharp)

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
    
    string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
        "ProcessOrderOrchestrator", orderId, options);
    // ...
}
```

# [JavaScript](#tab/javascript)

```javascript
const HttpStart: HttpHandler = async (request: HttpRequest, context: InvocationContext): Promise<HttpResponse> => {
    const client = df.getClient(context);
    const instanceId = await client.startNew("ProcessOrderOrchestrator", {
        input: orderId,
        version: "1.0"
    });

    // ...
};
```

# [Python](#tab/python)

```python
@myApp.route(route="orchestrators/{functionName}")  
@myApp.durable_client_input(client_name="client")  
async def http_start(req: func.HttpRequest, client):
    instance_id = await client.start_new("ProcessOrderOrchestrator", client_input=order_id, version="1.0")

    # ...
```

# [PowerShell](#tab/powershell)

```powershell
param($Request, $TriggerMetadata)

$instanceId = Start-DurableOrchestration -FunctionName "ProcessOrderOrchestrator" -Input $orderId -Version "1.0"

# ...
```

# [Java](#tab/java)

```java
@FunctionName("HttpStart")
public HttpResponseMessage httpStart(
    @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST},
        authLevel = AuthorizationLevel.ANONYMOUS) 
    HttpRequestMessage<Optional<String>> request,
    @DurableClientInput(name = "durableContext") 
    DurableClientContext durableContext,
    final ExecutionContext context) {
    
    DurableTaskClient client = durableContext.getClient();
    NewOrchestrationInstanceOptions options =
        new NewOrchestrationInstanceOptions().setVersion("1.0");
    String instanceId = client.scheduleNewOrchestrationInstance(
        "ProcessOrderOrchestrator", orderId, options);
    // ...
}
```

---

You can also start sub-orchestrations with specific versions from within an orchestrator function:

# [C#](#tab/csharp)

```csharp
[Function("MainOrchestrator")]
public static async Task<string> RunMainOrchestrator(
    [OrchestrationTrigger] TaskOrchestrationContext context)
{
    var subOptions = new SubOrchestratorOptions
    {
        Version = "1.0"
    };
    
    var result = await context.CallSubOrchestratorAsync<string>(
        "ProcessPaymentOrchestrator", orderId, subOptions);
    // ...
}
```

# [JavaScript](#tab/javascript)

```javascript
const RunMainOrchestrator: OrchestrationHandler = function* (context: OrchestrationContext) {
    const paymentResult = yield context.df.callSubOrchestrator(
        "ProcessPaymentOrchestrator",
        orderId,
        { version: "1.0" }
    );

    // ...
};
```

# [Python](#tab/python)

```python
@myApp.orchestration_trigger(context_name="context")
def run_main_orchestrator(context: df.DurableOrchestrationContext):
    payment_result = yield context.call_sub_orchestrator(
        "ProcessPaymentOrchestrator",
        order_id,
        version="1.0"
    )

    # ...
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$paymentResult = Invoke-SubOrchestrator -FunctionName "ProcessPaymentOrchestrator" -Input $orderId -Version "1.0"

# ...
```

# [Java](#tab/java)

```java
@FunctionName("MainOrchestrator")
public String runMainOrchestrator(
    @DurableOrchestrationTrigger(name = "taskOrchestrationContext") 
    TaskOrchestrationContext context) {

    NewSubOrchestrationInstanceOptions subOptions =
        new NewSubOrchestrationInstanceOptions().setVersion("1.0");
    String result = context.callSubOrchestrator(
        "ProcessPaymentOrchestrator", orderId, String.class, subOptions).await();
    // ...
}
```

---

::: zone-end

## Remove legacy code paths

Over time, you might want to remove legacy code paths from your orchestrator functions to simplify maintenance and reduce technical debt. Remove code carefully to avoid breaking existing orchestration instances.

**When it's safe to remove legacy code**

- All orchestration instances using the old version completed (succeeded, failed, or ended).
- No new orchestration instances will be created with the old version.
- You checked through monitoring or querying that no instances are running with the legacy version.
- A sufficient time period passed since the old version was last deployed.

> [!WARNING]
> Removing legacy code paths while orchestration instances are still running those versions can cause deterministic replay failures. Always check that no instances are using the legacy version before removing the code.

## Best practices

### Version management

- **Use multi-part versioning**: Adopt a consistent versioning scheme, like `major.minor.patch`.
- **Document breaking changes**: Clearly document what changes require a new version.
- **Plan version lifecycle**: Define when to remove legacy code paths.

### Code organization

- **Separate version logic**: Use clear branching or separate methods for different versions.
- **Preserve determinism**: Don't modify existing version logic once deployed. If changes are absolutely necessary, like critical bug fixes, ensure they maintain deterministic behavior and don't alter the sequence of operations.
- **Test thoroughly**: Test all version paths, especially during transitions.

### Monitoring and observability

- **Log version information**: Include the version in your logging for easier debugging.
- **Monitor version distribution**: Track which versions actively run.
- **Set up alerts**: Monitor for any version-related errors.

::: zone pivot="durable-functions"

## Troubleshooting

### Common issues

- **Issue**: Orchestration instances created with version 1.0 are failing after deploying version 2.0
   - **Solution**: Make sure the version 1.0 code path in your orchestrator remains exactly the same. Any changes to the execution sequence can break deterministic replay.

- **Issue**: Workers running older orchestrator versions can't run new orchestrations
   - **Solution**: This behavior is expected. The runtime prevents older workers from running orchestrations with newer versions. Make sure all workers are updated to the latest version and that their `defaultVersion` setting in `host.json` is updated accordingly.

- **Issue**: Version information isn't available in the orchestrator (`context.Version` or `context.getVersion()` is null, regardless of the `defaultVersion` setting)
   - **Solution**: Check the [Prerequisites](#prerequisites) section to make sure your environment meets all the requirements for orchestration versioning.

- **Issue**: Orchestrations of a newer version are making very slow progress or are stuck
   - **Solution**: This problem can have different root causes:
     1. **Insufficient newer workers**: Make sure enough workers that contain an equal or higher version in `defaultVersion` are deployed and active.
     2. **Orchestration routing interference from older workers**: Old workers can interfere with the orchestration routing mechanism, making it harder for new workers to pick up orchestrations. This interference can be especially noticeable with certain storage providers (Azure Storage or MSSQL). Normally, the Azure Functions platform makes sure that old workers are disposed of soon after a deployment, so any delay typically isn't significant. Consider using the [Durable Task Scheduler](./durable-task-scheduler/durable-task-scheduler.md) for an improved routing mechanism.

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Learn about zero-downtime deployment strategies](durable-functions-zero-downtime-deployment.md)

> [!div class="nextstepaction"]
> [Learn about versioning strategies](./durable-functions-versioning.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [See .NET SDK examples](https://github.com/microsoft/durabletask-dotnet/tree/main)

> [!div class="nextstepaction"]
> [See JavaScript SDK examples](https://github.com/microsoft/durabletask-js/tree/main)

> [!div class="nextstepaction"]
> [See Python SDK examples](https://github.com/microsoft/durabletask-python/tree/main)

> [!div class="nextstepaction"]
> [See Java SDK examples](https://github.com/microsoft/durabletask-java/tree/main)

::: zone-end
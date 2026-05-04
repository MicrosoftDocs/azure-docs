---
title: "Troubleshoot Durable Task SDKs: Common Issues and Fixes"
description: Diagnose and resolve common issues with the portable Durable Task SDKs for .NET, Java, JavaScript, and Python. Fix connection errors, orchestration failures, and activity issues.
ms.topic: troubleshooting
ms.date: 02/25/2026
ms.author: azfuncdf
author: torosent
ms.reviewer: hhunter-ms
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.devlang: csharp
---

# Troubleshoot common Durable Task SDK issues

This article helps you diagnose and fix common issues when building applications with the portable Durable Task SDKs. These SDKs connect to the [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) backend and run on any hosting platform, including Azure Container Apps, Kubernetes, and VMs. For issues specific to the Durable Task Scheduler service, see [Troubleshoot the Durable Task Scheduler](../scheduler/troubleshoot-durable-task-scheduler.md). For Durable Functions issues, see [Durable Functions troubleshooting guide](../../azure-functions/durable-functions/durable-functions-troubleshooting-guide.md).

> [!TIP]
> The [Durable Task Scheduler monitoring dashboard](../scheduler/durable-task-scheduler-dashboard.md) is useful for inspecting orchestration status, viewing execution history, and identifying failures. Use it alongside this guide to speed up troubleshooting.

## Find your issue

| Error message or symptom | Section |
| --- | --- |
| `connection refused` or `failed to connect` at startup | [Emulator isn't running or is unreachable](#emulator-isnt-running-or-is-unreachable) |
| Connection string parse errors or authentication errors at startup | [Connection string format is incorrect](#connection-string-format-is-incorrect) |
| Worker connects but orchestrations don't start | [Task hub doesn't exist](#task-hub-doesnt-exist) |
| `401 Unauthorized` or identity/role errors on Azure | [Identity-based authentication failures on Azure](#identity-based-authentication-failures-on-azure) |
| Orchestration stuck in "Pending" | [Orchestration is stuck in the "Pending" state](#orchestration-is-stuck-in-the-pending-state) |
| Orchestration stuck in "Running" | [Orchestration is stuck in the "Running" state](#orchestration-is-stuck-in-the-running-state) |
| Replay failures, infinite loops, or unexpected behavior | [Nondeterministic orchestrator code](#nondeterministic-orchestrator-code) |
| Type mismatch or JSON serialization errors | [Serialization and deserialization errors](#serialization-and-deserialization-errors) |
| `activity not found` | [Activity not found](#activity-not-found) |
| `RESOURCE_EXHAUSTED` or `message too large` | [gRPC message size limit exceeded](#grpc-message-size-limit-exceeded) |
| `CANCELLED: Cancelled on client` during shutdown | [Stream cancellation errors during shutdown](#stream-cancellation-errors-during-shutdown) |
| `CS0419` / `VSTHRD105` warnings break build | [Source generator warnings break builds (C#)](#source-generator-warnings-break-builds) |
| `OrchestratorBlockedException` (Java) | [OrchestratorBlockedException (Java)](#orchestratorblockedexception) |
| Unhelpful error when using `retry_policy` (Python) | [Retry policy requires max_retry_interval (Python)](#retry-policy-requires-max_retry_interval) |

## Connection and setup issues

### Emulator isn't running or is unreachable

If your app fails at startup with a connection error like "connection refused" or "failed to connect," check that the Durable Task Scheduler emulator is running and accessible.

1. Check that the emulator Docker container is running:

   ```bash
   docker ps | grep durabletask
   ```

2. Check the correct port mappings. The emulator exposes two ports:
   - **8080**—gRPC endpoint (used by your app)
   - **8082**—Dashboard UI

   If you're using a custom port mapping, update your connection string to match the host port mapped to container port `8080`.

3. Test connectivity to the gRPC endpoint:

   ```bash
   curl -v http://localhost:8080
   ```

   A connection refusal indicates that the container isn't running or that the port mapping is incorrect.

### Connection string format is incorrect

Connection string errors are a common cause of startup failures. Check that your connection string matches the expected format.

**Local development** (emulator):

```text
Endpoint=http://localhost:8080;Authentication=None
```

**Azure** (managed identity):

```text
Endpoint=https://<scheduler-name>.durabletask.io;Authentication=ManagedIdentity
```

**Azure** (user-assigned managed identity):

```text
Endpoint=https://<scheduler-name>.durabletask.io;Authentication=ManagedIdentity;ClientID=<client-id>
```

Common mistakes:
- Using `https` for the local emulator (the emulator uses `http`)
- Using `http` for Azure endpoints (Azure requires `https`)
- Omitting the `Authentication` parameter
- Using the dashboard port (`8082`) instead of the gRPC port (`8080`)

### Client or worker fails to connect

If your client or worker fails to connect, verify the following:

- **Connection string** matches the expected format shown in [Connection string format is incorrect](#connection-string-format-is-incorrect).
- **Task hub name** is the same for both the client and worker.
- **Endpoint URL** uses `http` for the local emulator and `https` for Azure.

For full setup examples in each language, see [Create an app with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md).

### Task hub doesn't exist

If your orchestrations fail to start or the worker connects but doesn't process work, the task hub might not exist on the scheduler. The emulator typically creates task hubs automatically using the `DTS_TASK_HUB_NAMES` environment variable.

Check that the emulator was started with the correct task hub name:

```bash
docker run -d -p 8080:8080 -p 8082:8082 \
  -e DTS_TASK_HUB_NAMES="my-taskhub" \
  mcr.microsoft.com/dts/dts-emulator:latest
```

For Azure-hosted schedulers, create the task hub using the Azure CLI:

```azurecli
az durabletask taskhub create \
  --resource-group <resource-group> \
  --scheduler-name <scheduler-name> \
  --name <taskhub-name>
```

### Identity-based authentication failures on Azure

If your app runs locally but fails when deployed to Azure, the issue is likely related to authentication:

1. Check that the managed identity is assigned to your app (system-assigned or user-assigned).
1. Check that the identity has the **Durable Task Data Contributor** role on the scheduler resource or specific task hub.
1. Make sure the connection string uses the correct `Authentication` value (`ManagedIdentity`). In Python, pass a `DefaultAzureCredential()` instance as the `token_credential` parameter instead of using a connection string.
1. For user-assigned identities, check that the `ClientID` in the connection string matches the identity's client ID.

For detailed instructions, see [Identity-based access for Durable Task Scheduler](../scheduler/durable-task-scheduler-identity.md).

## Orchestration issues

### Orchestration is stuck in the "Pending" state

An orchestration in "Pending" status indicates it was scheduled but a worker hasn't picked it up. Check the following items:

- **Worker is running.** Ensure your worker process is running and connected to the same task hub where the orchestration was scheduled.
- **Task hub name matches.** Check that the worker and client both reference the same task hub name. A mismatch causes the worker to poll a different task hub.
- **Orchestrator is registered.** The orchestrator function or class referenced when scheduling must be registered with the worker.

# [C#](#tab/csharp)

Check that the orchestrator class is registered with the worker during startup. If you use source generators (`[DurableTask]` attribute), the registration is automatic. Otherwise, register manually:

```csharp
builder.Services.AddDurableTaskWorker(builder =>
{
    builder.AddTasks(tasks =>
    {
        tasks.AddOrchestrator<MyOrchestrator>();
        tasks.AddActivity<MyActivity>();
    });
});
```

# [JavaScript](#tab/javascript)

Check that the orchestrator function is added to the worker builder:

```javascript
const worker = createAzureManagedWorkerBuilder(connectionString)
  .addOrchestrator(myOrchestrator)
  .addActivity(myActivity)
  .build();
```

# [Python](#tab/python)

Check that the orchestrator function is registered with the worker:

```python
worker.add_orchestrator(my_orchestrator)
worker.add_activity(my_activity)
```

# [Java](#tab/java)

Check that the orchestrator is registered with the worker builder:

```java
workerBuilder.addOrchestration(
    new TaskOrchestrationFactory() {
        @Override
        public String getName() { return "MyOrchestrator"; }

        @Override
        public TaskOrchestration create() { return new MyOrchestrator(); }
    }
);
```

---

### Orchestration is stuck in the "Running" state

An orchestration stuck in "Running" typically means it's waiting for a task that isn't complete. To diagnose, open the [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md) and inspect the orchestration's execution history. Look for the last completed event — the next event in the sequence is the one that's blocking.

Common causes:

- **Activity not registered.** The orchestration calls an activity name that isn't registered with the worker. The dashboard shows a `TaskScheduled` event with no corresponding `TaskCompleted`. Check that the activity name matches between your orchestrator code and worker registration (see [Activity not found](#activity-not-found)).
- **Waiting on an external event.** The orchestration calls `waitForExternalEvent` and the event isn't raised yet. The dashboard shows an `EventRaised` event is expected but missing. Verify the event name and that the sender is targeting the correct orchestration instance ID.
- **Waiting on a durable timer.** The orchestration creates a timer that isn't expired yet. The dashboard shows a `TimerCreated` event. Wait for the timer to fire, or check if the timer duration is longer than expected.
- **Activity throws an unhandled exception.** The dashboard shows a `TaskFailed` event. Check the failure details for the exception message and stack trace.

### Nondeterministic orchestrator code

Orchestrator code must be [deterministic](../common/durable-task-code-constraints.md). Nondeterministic code causes replay failures that result in unexpected behavior, infinite loops, or errors. Don't use current time, random numbers, GUIDs, or I/O (like HTTP calls) directly in orchestrator code. Use the context-provided alternatives or delegate to activities.

# [C#](#tab/csharp)

```csharp
// ❌ Wrong - non-deterministic
var now = DateTime.UtcNow;
var id = Guid.NewGuid();
var data = await httpClient.GetAsync("https://example.com/api");

// ✅ Correct - deterministic
var now = context.CurrentUtcDateTime;
var id = context.NewGuid();
var data = await context.CallActivityAsync<string>("FetchData");
```

# [JavaScript](#tab/javascript)

```javascript
// ❌ Wrong - non-deterministic
const now = new Date();
const id = crypto.randomUUID();
const data = await fetch("https://example.com/api");

// ✅ Correct - deterministic
const now = ctx.currentUtcDateTime;
const id = ctx.newGuid();
const data = yield ctx.callActivity(fetchData);
```

# [Python](#tab/python)

```python
# ❌ Wrong - non-deterministic
import datetime, uuid, requests
now = datetime.datetime.utcnow()
id = str(uuid.uuid4())
data = requests.get("https://example.com/api")

# ✅ Correct - deterministic
now = ctx.current_utc_datetime
id = ctx.new_uuid()
data = yield ctx.call_activity(fetch_data)
```

# [Java](#tab/java)

```java
// ❌ Wrong - non-deterministic
Instant now = Instant.now();
String id = UUID.randomUUID().toString();
String data = httpClient.send(request, BodyHandlers.ofString()).body();

// ✅ Correct - deterministic
Instant now = ctx.getCurrentInstant();
String id = ctx.newUUID().toString();
String data = ctx.callActivity("FetchData", null, String.class).await();
```

---

### Serialization and deserialization errors

Serialization errors occur when the types used for orchestration inputs, outputs, or activity results don't match between caller and callee. These errors can appear as unexpected `null` values, `JsonException`, or type cast failures in your orchestration history.

**How to diagnose:**
1. Open the [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md) and inspect the orchestration history. Look at the `Input` and `Result` fields for activities that failed.
1. Verify the type expected by the orchestrator matches the type returned by the activity. For example, if the activity returns a `string` but the orchestrator expects an `int`, the deserialization fails.
1. Check for non-serializable types. Custom types that can't be serialized to JSON (for example, types with circular references or no default constructor) fail silently or throw exceptions.

**Known issue (Java):** Passing a `String` directly to an activity can result in double-quoted strings (for example, `"\"hello\""` instead of `"hello"`). This behavior is a [known issue](https://github.com/microsoft/durabletask-java/issues/235). Cast the result explicitly or use wrapper objects.

> [!TIP]
> Use simple data types (strings, numbers, arrays, and plain objects or POJOs/POCOs/dataclasses) for orchestration and activity inputs and outputs. Avoid complex types with custom serialization logic.

## Activity issues

### Activity not found

If an orchestration fails with an "activity not found" error, the activity name registered with the worker doesn't match the name used in the orchestration code.

# [C#](#tab/csharp)

In .NET, activities can be registered by class name or by using the `[DurableTask]` attribute with source generators. Verify that the activity class is included in the worker registration:

```csharp
builder.Services.AddDurableTaskWorker(builder =>
{
    builder.AddTasks(tasks =>
    {
        tasks.AddActivity<SayHello>();
    });
});
```

When calling the activity from an orchestrator, use the class name:

```csharp
string result = await context.CallActivityAsync<string>(nameof(SayHello), "Tokyo");
```

# [JavaScript](#tab/javascript)

In JavaScript, activities are registered by passing the function reference to the worker builder. The function name must match:

```javascript
const sayHello = async (ctx, name) => {
  return `Hello, ${name}!`;
};

// Register with the worker
const worker = createAzureManagedWorkerBuilder(connectionString)
  .addActivity(sayHello)
  .build();

// Call from orchestrator - use the function reference
const result = yield ctx.callActivity(sayHello, "Tokyo");
```

# [Python](#tab/python)

In Python, activities are registered by using `add_activity` on the worker. The function reference must match:

```python
def say_hello(ctx, name: str) -> str:
    return f"Hello, {name}!"

# Register with the worker
worker.add_activity(say_hello)

# Call from orchestrator - use the function reference
result = yield ctx.call_activity(say_hello, input="Tokyo")
```

# [Java](#tab/java)

In Java, activities are registered with a `TaskActivityFactory` that provides a name. The name in `callActivity` must match exactly:

```java
workerBuilder.addActivity(
    new TaskActivityFactory() {
        @Override
        public String getName() { return "SayHello"; }

        @Override
        public TaskActivity create() {
            return ctx -> "Hello, " + ctx.getInput(String.class) + "!";
        }
    }
);

// Call from orchestrator
ctx.callActivity("SayHello", "Tokyo", String.class).await();
```

---

### Activity failure handling

When an activity throws an exception, the orchestrator receives a `TaskFailedException` (or language equivalent). Catch this exception and inspect the inner error details to find the root cause. In C#, use `ex.FailureDetails` to access the error type and message, and `IsCausedBy<T>()` to check for specific exception types.

For detailed error handling and retry policy examples in each language, see [Error handling and retries](../common/durable-task-error-handling.md).

## gRPC issues

### gRPC message size limit exceeded

If you see a `RESOURCE_EXHAUSTED` or `message too large` error, an orchestration or activity input/output exceeds the gRPC default maximum message size of 4 MB.

**Mitigations:**
- Reduce the size of inputs and outputs. Store large payloads in external storage, like Azure Blob Storage, and pass only references.
- Break large fan-out results into smaller batches processed through sub-orchestrations.

### Stream cancellation errors during shutdown

When stopping a worker, you might see `CANCELLED: Cancelled on client` errors. These errors are typically harmless and occur because the gRPC stream between the worker and the scheduler closes during shutdown. The .NET, Python, and Java SDKs handle these errors internally.

In **JavaScript**, the SDK might throw `Stream error Error: 1 CANCELLED: Cancelled on client` when calling `worker.stop()`. This error is a [known issue](https://github.com/microsoft/durabletask-js/issues/47). Wrap the stop call in a try-catch if the error affects your shutdown logic:

```javascript
try {
  await worker.stop();
} catch (error) {
  // Ignore stream cancellation errors during shutdown
  if (!error.message.includes("CANCELLED")) {
    throw error;
  }
}
```

## Logging and diagnostics

### Verbose logging configuration

Increase log verbosity to get more details about SDK operations, including gRPC communication and orchestration replay events.

# [C#](#tab/csharp)

In your `appsettings.json` or logging configuration file:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.DurableTask": "Debug"
    }
  }
}
```

Use replay-safe loggers to avoid duplicate log entries during orchestration replay:

```csharp
public override async Task<string> RunAsync(
    TaskOrchestrationContext context, string input)
{
    ILogger logger = context.CreateReplaySafeLogger<MyOrchestrator>();
    logger.LogInformation("Processing input: {Input}", input);
    // ...
}
```

# [JavaScript](#tab/javascript)

Set a custom logger when you create the worker. The SDK provides `ConsoleLogger` (default) and `NoOpLogger`, or you can implement the `Logger` interface:

```javascript
import { ConsoleLogger } from "@microsoft/durabletask-js-azuremanaged";

const worker = createAzureManagedWorkerBuilder(connectionString)
  .logger(new ConsoleLogger())
  .addOrchestrator(myOrchestrator)
  .addActivity(myActivity)
  .build();
```

> [!NOTE]
> Orchestrator code runs during replay. To avoid duplicate log entries, check `ctx.isReplaying` before logging:
>
> ```javascript
> if (!ctx.isReplaying) {
>   console.log("Processing work item");
> }
> ```

# [Python](#tab/python)

Configure the Python standard logging module:

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("durabletask")
logger.setLevel(logging.DEBUG)
```

> [!NOTE]
> The `durabletask` logger might not respect `root_logger` configuration in all cases. Set the level directly on the `durabletask` logger as shown above.

To avoid duplicate log entries during orchestration replay, check `ctx.is_replaying`:

```python
if not ctx.is_replaying:
    logger.info("Processing work item")
```

# [Java](#tab/java)

Configure logging by using your SLF4J-compatible logging framework (for example, Logback):

```xml
<!-- logback.xml -->
<configuration>
  <logger name="com.microsoft.durabletask" level="DEBUG" />
</configuration>
```

To avoid duplicate log entries during replay, check `ctx.getIsReplaying()`:

```java
if (!ctx.getIsReplaying()) {
    logger.info("Processing work item");
}
```

---

### Application Insights integration

For production applications, configure [Application Insights](/azure/azure-monitor/app/app-insights-overview) to collect telemetry from your Durable Task SDK application. The integration approach depends on your hosting platform:

| Hosting platform | Setup instructions |
| --- | --- |
| Azure Container Apps | [Monitor logs in Azure Container Apps with Log Analytics](../../container-apps/log-monitoring.md) |
| Azure App Service | [Enable diagnostic logging for apps in Azure App Service](../../app-service/troubleshoot-diagnostic-logs.md) |
| Azure Kubernetes Service | [Monitor Azure Kubernetes Service](/azure/aks/monitor-aks) |

For more information about diagnostics, see [Diagnostics in Durable Task SDKs](./durable-task-diagnostics.md).

## Language-specific issues

### C#

#### Source generator warnings break builds

If you use `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` in your project, the Durable Task source generators might produce warnings (`CS0419`, `VSTHRD105`) that break your build. Suppress these specific warnings:

```xml
<PropertyGroup>
  <NoWarn>$(NoWarn);CS0419;VSTHRD105</NoWarn>
</PropertyGroup>
```

This known issue is [being tracked on GitHub](https://github.com/microsoft/durabletask-dotnet/issues/624) and is addressed in an upcoming release.

#### Roslyn analyzer throws in foreach loops

The Durable Task Roslyn analyzer might throw an `ArgumentNullException` when orchestrator lambda code is inside a `foreach` loop. This behavior is a [known issue](https://github.com/microsoft/durabletask-dotnet/issues/638) that doesn't affect runtime behavior. Update to the latest analyzer package version to get the fix.

### Java

#### Gradle permission denied error

On macOS or Linux, running `./gradlew` might fail with a "permission denied" error. Fix this error by making the file executable:

```bash
chmod +x gradlew
```

#### OrchestratorBlockedException

The `OrchestratorBlockedException` occurs when orchestrator code performs a blocking operation that the SDK detects as potentially nondeterministic. This exception is a safeguard to prevent orchestrator code from violating [orchestrator code constraints](../common/durable-task-code-constraints.md).

Common causes:
- Calling a blocking external API in orchestrator code.
- Using `Thread.sleep()` directly instead of `ctx.createTimer()`.
- Performing file or network I/O in orchestrator code.

Move all blocking or I/O operations into activities.


### Python

#### Retry policy requires max_retry_interval

When you configure a `retry_policy` in Python, omitting the `max_retry_interval` parameter produces an error that doesn't clearly indicate the cause. Always specify `max_retry_interval`:

```python
from datetime import timedelta
from durabletask import task

retry_policy = task.RetryPolicy(
    max_number_of_attempts=3,
    first_retry_interval=timedelta(seconds=5),
    max_retry_interval=timedelta(minutes=1),  # Required
)
```

#### WhenAllTask exception behavior

When you use `when_all` to run multiple tasks in parallel, if one or more tasks fail, the exception behavior might not match expectations. Only the first exception is raised, and the remaining task exceptions might be lost. Inspect individual task results if you need complete error information:

```python
tasks = [ctx.call_activity(process_item, input=item) for item in items]
try:
    results = yield task.when_all(tasks)
except TaskFailedError as e:
    # Only the first failure is raised
    # Check individual tasks for comprehensive error handling
    print(f"At least one task failed: {e}")
```

## Get support

For questions and reporting bugs, open an issue in the GitHub repo for the relevant SDK. When you report a bug, include:

- Affected orchestration instance IDs
- Time range in UTC that shows the problem
- Application name and deployment region (if relevant)
- SDK version and hosting platform
- Relevant logs or error messages

| SDK | GitHub repository |
| --- | --- |
| .NET | [microsoft/durabletask-dotnet](https://github.com/microsoft/durabletask-dotnet/issues) |
| Java | [microsoft/durabletask-java](https://github.com/microsoft/durabletask-java/issues) |
| JavaScript | [microsoft/durabletask-js](https://github.com/microsoft/durabletask-js/issues) |
| Python | [microsoft/durabletask-python](https://github.com/microsoft/durabletask-python/issues) |

## Next steps

> [!div class="nextstepaction"]
> [Learn about diagnostics in Durable Task SDKs](./durable-task-diagnostics.md)

> [!div class="nextstepaction"]
> [Explore the Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md)

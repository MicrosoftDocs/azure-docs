---
title: Handling errors in Durable Functions - Azure
description: Learn how to handle errors in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 02/14/2023
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, javascript, powershell, python, java
ms.custom: devx-track-js
---

# Handling errors in Durable Functions (Azure Functions)

Durable Function orchestrations are implemented in code and can use the programming language's built-in error-handling features. There really aren't any new concepts you need to learn to add error handling and compensation into your orchestrations. However, there are a few behaviors that you should be aware of.

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

## Errors in activity functions and sub-orchestrations

In Durable Functions, unhandled exceptions thrown within activity functions or sub-orchestrations are marshaled back to the orchestrator function using standardized exception types.

For example, consider the following orchestrator function that performs a fund transfer between two accounts:

# [C# (InProc)](#tab/csharp-inproc)
In Durable Functions C# in-process, unhandled exceptions are thrown as [FunctionFailedException](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.functionfailedexception).

The exception message typically identifies which activity functions or sub-orchestrations caused the failure. To access more detailed error information, inspect the `InnerException` property.

```csharp
[FunctionName("TransferFunds")]
public static async Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var transferDetails = context.GetInput<TransferOperation>();

    await context.CallActivityAsync("DebitAccount",
        new
        {
            Account = transferDetails.SourceAccount,
            Amount = transferDetails.Amount
        });

    try
    {
        await context.CallActivityAsync("CreditAccount",
            new
            {
                Account = transferDetails.DestinationAccount,
                Amount = transferDetails.Amount
            });
    }
    catch (FunctionFailedException)
    {
        // Refund the source account.
        // Another try/catch could be used here based on the needs of the application.
        await context.CallActivityAsync("CreditAccount",
            new
            {
                Account = transferDetails.SourceAccount,
                Amount = transferDetails.Amount
            });
    }
}
```

> [!NOTE]
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [C# (Isolated)](#tab/csharp-isolated)

In Durable Functions C# Isolated, unhandled exceptions are surfaced as [TaskFailedException](/dotnet/api/microsoft.durabletask.taskfailedexception).

The exception message typically identifies which activity functions or sub-orchestrations caused the failure. To access more detailed error information, inspect the [FailureDetails](/dotnet/api/microsoft.durabletask.taskfailuredetails) property.

```csharp
[FunctionName("TransferFunds")]
public static async Task Run(
    [OrchestrationTrigger] TaskOrchestrationContext context, TransferOperation transferDetails)
{
    await context.CallActivityAsync("DebitAccount",
        new
        {
            Account = transferDetails.SourceAccount,
            Amount = transferDetails.Amount
        });

    try
    {
        await context.CallActivityAsync("CreditAccount",
            new
            {
                Account = transferDetails.DestinationAccount,
                Amount = transferDetails.Amount
            });
    }
    catch (TaskFailedException)
    {
        // Refund the source account.
        // Another try/catch could be used here based on the needs of the application.
        await context.CallActivityAsync("CreditAccount",
            new
            {
                Account = transferDetails.SourceAccount,
                Amount = transferDetails.Amount
            });
    }
}
```

> [!NOTE]  
> - The exception message typically identifies which activity functions or sub-orchestrations caused the failure. To access more detailed error information, inspect the [`FailureDetails`](/dotnet/api/microsoft.durabletask.taskfailuredetails) property.  
> - By default, `FailureDetails` includes the **error type**, **error message**, **stack trace**, and any **nested inner exceptions** (each represented as a recursive `FailureDetails` object).  If you want to include additional exception properties in the failure output, see [Include Custom Exception Properties for FailureDetails (.NET Isolated)](#include-custom-exception-properties-for-failuredetails-net-isolated).  

# [JavaScript (PM3)](#tab/javascript-v3)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const transferDetails = context.df.getInput();

    yield context.df.callActivity("DebitAccount", {
        account: transferDetails.sourceAccount,
        amount: transferDetails.amount,
    });

    try {
        yield context.df.callActivity("CreditAccount", {
            account: transferDetails.destinationAccount,
            amount: transferDetails.amount,
        });
    } catch (error) {
        // Refund the source account.
        // Another try/catch could be used here based on the needs of the application.
        yield context.df.callActivity("CreditAccount", {
            account: transferDetails.sourceAccount,
            amount: transferDetails.amount,
        });
    }
})
```
# [JavaScript (PM4)](#tab/javascript-v4)

```javascript
const df = require("durable-functions");

df.app.orchestration("transferFunds", function* (context) {
    const transferDetails = context.df.getInput();

    yield context.df.callActivity("debitAccount", {
        account: transferDetails.sourceAccount,
        amount: transferDetails.amount,
    });

    try {
        yield context.df.callActivity("creditAccount", {
            account: transferDetails.destinationAccount,
            amount: transferDetails.amount,
        });
    } catch (error) {
        // Refund the source account.
        // Another try/catch could be used here based on the needs of the application.
        yield context.df.callActivity("creditAccount", {
            account: transferDetails.sourceAccount,
            amount: transferDetails.amount,
        });
    }
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    transfer_details = context.get_input()

    yield context.call_activity('DebitAccount', {
         'account': transfer_details['sourceAccount'],
         'amount' : transfer_details['amount']
    })

    try:
        yield context.call_activity('CreditAccount', {
                'account': transfer_details['destinationAccount'],
                'amount': transfer_details['amount'],
            })
    except:
        yield context.call_activity('CreditAccount', {
            'account': transfer_details['sourceAccount'],
            'amount': transfer_details['amount']
        })

main = df.Orchestrator.create(orchestrator_function)
```
# [PowerShell](#tab/powershell)

By default, cmdlets in PowerShell don't raise exceptions that can be caught using try/catch blocks. You have two options for changing this behavior:

1. Use the `-ErrorAction Stop` flag when invoking cmdlets, such as `Invoke-DurableActivity`.
2. Set the [`$ErrorActionPreference`](/powershell/module/microsoft.powershell.core/about/about_preference_variables#erroractionpreference) preference variable to `"Stop"` in the orchestrator function before invoking cmdlets.

```powershell
param($Context)

$ErrorActionPreference = "Stop"

$transferDetails = $Context.Input

Invoke-DurableActivity -FunctionName 'DebitAccount' -Input @{ account = transferDetails.sourceAccount; amount = transferDetails.amount }

try {
    Invoke-DurableActivity -FunctionName 'CreditAccount' -Input @{ account = transferDetails.destinationAccount; amount = transferDetails.amount }
} catch {
    Invoke-DurableActivity -FunctionName 'CreditAccount' -Input @{ account = transferDetails.sourceAccount; amount = transferDetails.amount }
}
```

For more information on error handling in PowerShell, see the [Try-Catch-Finally](/powershell/module/microsoft.powershell.core/about/about_try_catch_finally) PowerShell documentation.

# [Java](#tab/java)

```java
@FunctionName("TransferFunds")
public void transferFunds(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    TransferOperation transfer = ctx.getInput(TransferOperation.class);
    ctx.callActivity(
        "DebitAccount", 
        new OperationArgs(transfer.sourceAccount, transfer.amount)).await();
    try {
        ctx.callActivity(
            "CreditAccount", 
            new OperationArgs(transfer.destinationAccount, transfer.amount)).await();
    } catch (TaskFailedException ex) {
        // Refund the source account on failure
        ctx.callActivity(
            "CreditAccount", 
            new OperationArgs(transfer.sourceAccount, transfer.amount)).await();
    }
}
```

---

If the first **CreditAccount** function call fails, the orchestrator function compensates by crediting the funds back to the source account.

## Errors in entity functions
Exception handling behavior for entity functions differs based on the Durable Functions hosting model:

# [C# (InProc)](#tab/csharp-inproc)

In Durable Functions using C# in-process, original exception types thrown by entity functions are directly returned to the orchestrator.

```csharp
[FunctionName("Function1")]
public static async Task<string> RunOrchestrator(
    [OrchestrationTrigger] IDurableOrchestrationContext context)
{
    try
    {
        var entityId = new EntityId(nameof(Counter), "myCounter");
        await context.CallEntityAsync(entityId, "Add", 1);
    }
    catch (Exception ex)
    {
        // The exception type will be InvalidOperationException with the message "this is an entity exception".
    }
    return string.Empty;
}

[FunctionName("Counter")]
public static void Counter([EntityTrigger] IDurableEntityContext ctx)
{
    switch (ctx.OperationName.ToLowerInvariant())
    {
        case "add":
            throw new InvalidOperationException("this is an entity exception");
        case "get":
            ctx.Return(ctx.GetState<int>());
            break;
    }
}
```

# [C# (Isolated)](#tab/csharp-isolated)

In Durable Functions C# Isolated, exceptions are surfaced to the orchestrator as an `EntityOperationFailedException`. To access the original exception details, inspect its `FailureDetails` property.

```csharp
[Function(nameof(MyOrchestrator))]
public static async Task<List<string>> MyOrchestrator(
   [Microsoft.Azure.Functions.Worker.OrchestrationTrigger] TaskOrchestrationContext context)
{
    var entityId = new Microsoft.DurableTask.Entities.EntityInstanceId(nameof(Counter), "myCounter");
    try
    {
        await context.Entities.CallEntityAsync(entityId, "Add", 1);
    }
    catch (EntityOperationFailedException ex)
    {
        // Add your error handling
    }

    return new List<string>();
}
```
# [JavaScript (PM3)](#tab/javascript-v3)

```javascript
df.app.orchestration("counterOrchestration", function* (context) {
    const entityId = new df.EntityId(counterEntityName, "myCounter");

    try {
        const currentValue = yield context.df.callEntity(entityId, "get");
        if (currentValue < 10) {
            yield context.df.callEntity(entityId, "add", 1);
        }
    } catch (err) {
        context.log(`Entity call failed: ${err.message ?? err}`);
    }
});
```

# [JavaScript (PM4)](#tab/javascript-v4)

```javascript
df.app.orchestration("counterOrchestration", function* (context) {
    const entityId = new df.EntityId(counterEntityName, "myCounter");

    try {
        const currentValue = yield context.df.callEntity(entityId, "get");
        if (currentValue < 10) {
            yield context.df.callEntity(entityId, "add", 1);
        }
    } catch (err) {
        context.log(`Entity call failed: ${err.message ?? err}`);
    }
});
```

# [Python](#tab/python)

```python
@myApp.orchestration_trigger(context_name="context")
def run_orchestrator(context):
    try:
        entityId = df.EntityId("Counter", "myCounter")
        yield context.call_entity(entityId, "get")
        return "finished"
    except Exception as e:
        # Add your error handling
```
# [PowerShell](#tab/powershell)

Entity functions aren't currently not supported in PowerShell.

# [Java](#tab/java)

Entity functions aren't currently not supported in Java.

---

## Automatic retry on failure

When you call activity functions or sub-orchestration functions, you can specify an automatic retry policy. The following example attempts to call a function up to three times and waits 5 seconds between each retry:

# [C# (InProc)](#tab/csharp-inproc)

```csharp
[FunctionName("TimerOrchestratorWithRetry")]
public static async Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var retryOptions = new RetryOptions(
        firstRetryInterval: TimeSpan.FromSeconds(5),
        maxNumberOfAttempts: 3);

    await context.CallActivityWithRetryAsync("FlakyFunction", retryOptions, null);

    // ...
}
```

> [!NOTE]
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [C# (Isolated)](#tab/csharp-isolated)

```csharp
[FunctionName("TimerOrchestratorWithRetry")]
public static async Task Run([OrchestrationTrigger] TaskOrchestrationContext context)
{
    var options = TaskOptions.FromRetryPolicy(new RetryPolicy(
        maxNumberOfAttempts: 3,
        firstRetryInterval: TimeSpan.FromSeconds(5)));

    await context.CallActivityAsync("FlakyFunction", options: options);

    // ...
}
```

# [JavaScript (PM3)](#tab/javascript-v3)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const firstRetryIntervalInMilliseconds = 5000;
    const maxNumberOfAttempts = 3;

    const retryOptions = 
        new df.RetryOptions(firstRetryIntervalInMilliseconds, maxNumberOfAttempts);

    yield context.df.callActivityWithRetry("FlakyFunction", retryOptions);

    // ...
});
```

# [JavaScript (PM4)](#tab/javascript-v4)

```javascript
const df = require("durable-functions");

df.app.orchestration("callActivityWithRetry", function* (context) {
    const firstRetryIntervalInMilliseconds = 5000;
    const maxNumberOfAttempts = 3;

    const retryOptions = new df.RetryOptions(firstRetryIntervalInMilliseconds, maxNumberOfAttempts);

    yield context.df.callActivityWithRetry("flakyFunction", retryOptions);

    // ...
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df

def orchestrator_function(context: df.DurableOrchestrationContext):
    first_retry_interval_in_milliseconds = 5000
    max_number_of_attempts = 3

    retry_options = df.RetryOptions(first_retry_interval_in_milliseconds, max_number_of_attempts)

    yield context.call_activity_with_retry('FlakyFunction', retry_options)

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$retryOptions = New-DurableRetryOptions `
                    -FirstRetryInterval (New-TimeSpan -Seconds 5) `
                    -MaxNumberOfAttempts 3

Invoke-DurableActivity -FunctionName 'FlakyFunction' -RetryOptions $retryOptions
```

# [Java](#tab/java)

```java
@FunctionName("TimerOrchestratorWithRetry")
public void timerOrchestratorWithRetry(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    final int maxAttempts = 3;
    final Duration firstRetryInterval = Duration.ofSeconds(5);
    RetryPolicy policy = new RetryPolicy(maxAttempts, firstRetryInterval);
    TaskOptions options = new TaskOptions(policy);
    ctx.callActivity("FlakeyFunction", options).await();
    // ...
}
```

---

The activity function call in the previous example takes a parameter for configuring an automatic retry policy. There are several options for customizing the automatic retry policy:

* **Max number of attempts**: The maximum number of attempts. If set to 1, there will be no retry.
* **First retry interval**: The amount of time to wait before the first retry attempt.
* **Backoff coefficient**: The coefficient used to determine rate of increase of backoff. Defaults to 1.
* **Max retry interval**: The maximum amount of time to wait in between retry attempts.
* **Retry timeout**: The maximum amount of time to spend doing retries. The default behavior is to retry indefinitely.

## Custom retry handlers

When using the .NET or Java, you also have the option to implement retry handlers in code. This is useful when declarative retry policies aren't expressive enough. For languages that don't support custom retry handlers, you still have the option of implementing retry policies using loops, exception handling, and timers for injecting delays between retries.

# [C# (InProc)](#tab/csharp-inproc)

```csharp
RetryOptions retryOptions = new RetryOptions(
    firstRetryInterval: TimeSpan.FromSeconds(5),
    maxNumberOfAttempts: int.MaxValue)
    {
        Handle = exception =>
        {
            // True to handle and try again, false to not handle and throw.
            if (exception is TaskFailedException failure)
            {
                // Exceptions from TaskActivities are always this type. Inspect the
                // inner Exception to get more details.
            }

            return false;
        };
    }

await ctx.CallActivityWithRetryAsync("FlakeyActivity", retryOptions, null);
```

# [C# (Isolated)](#tab/csharp-isolated)

```csharp
TaskOptions retryOptions = TaskOptions.FromRetryHandler(retryContext =>
{
    // Don't retry anything that derives from ApplicationException
    if (retryContext.LastFailure.IsCausedBy<ApplicationException>())
    {
        return false;
    }

    // Quit after N attempts
    return retryContext.LastAttemptNumber < 3;
});

try
{
    await ctx.CallActivityAsync("FlakeyActivity", options: retryOptions);
}
catch (TaskFailedException)
{
    // Case when the retry handler returns false...
}
```

# [JavaScript (PM3)](#tab/javascript-v3)

JavaScript doesn't currently support custom retry handlers. However, you still have the option of implementing retry logic directly in the orchestrator function using loops, exception handling, and timers for injecting delays between retries.

# [JavaScript (PM4)](#tab/javascript-v4)

JavaScript doesn't currently support custom retry handlers. However, you still have the option of implementing retry logic directly in the orchestrator function using loops, exception handling, and timers for injecting delays between retries.

# [Python](#tab/python)

Python doesn't currently support custom retry handlers. However, you still have the option of implementing retry logic directly in the orchestrator function using loops, exception handling, and timers for injecting delays between retries.

# [PowerShell](#tab/powershell)

PowerShell doesn't currently support custom retry handlers. However, you still have the option of implementing retry logic directly in the orchestrator function using loops, exception handling, and timers for injecting delays between retries.

# [Java](#tab/java)

```java
RetryHandler retryHandler = retryCtx -> {
    // Don't retry anything that derives from RuntimeException
    if (retryCtx.getLastFailure().isCausedBy(RuntimeException.class)) {
        return false;
    }

    // Quit after N attempts
    return retryCtx.getLastAttemptNumber() < 3;
};

TaskOptions options = new TaskOptions(retryHandler);
try {
    ctx.callActivity("FlakeyActivity", options).await();
} catch (TaskFailedException ex) {
    // Case when the retry handler returns false...
}
```

---

## Function timeouts

You might want to abandon a function call within an orchestrator function if it's taking too long to complete. The proper way to do this today is by creating a [durable timer](durable-functions-timers.md) with an "any" task selector, as in the following example:

# [C# (InProc)](#tab/csharp-inproc)

```csharp
[FunctionName("TimerOrchestrator")]
public static async Task<bool> Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    TimeSpan timeout = TimeSpan.FromSeconds(30);
    DateTime deadline = context.CurrentUtcDateTime.Add(timeout);

    using (var cts = new CancellationTokenSource())
    {
        Task activityTask = context.CallActivityAsync("FlakyFunction");
        Task timeoutTask = context.CreateTimer(deadline, cts.Token);

        Task winner = await Task.WhenAny(activityTask, timeoutTask);
        if (winner == activityTask)
        {
            // success case
            cts.Cancel();
            return true;
        }
        else
        {
            // timeout case
            return false;
        }
    }
}
```

> [!NOTE]
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [C# (Isolated)](#tab/csharp-isolated)

```csharp
[Function("TimerOrchestrator")]
public static async Task<bool> Run([OrchestrationTrigger] TaskOrchestrationContext context)
{
    TimeSpan timeout = TimeSpan.FromSeconds(30);
    DateTime deadline = context.CurrentUtcDateTime.Add(timeout);

    using (var cts = new CancellationTokenSource())
    {
        Task activityTask = context.CallActivityAsync("FlakyFunction");
        Task timeoutTask = context.CreateTimer(deadline, cts.Token);

        Task winner = await Task.WhenAny(activityTask, timeoutTask);
        if (winner == activityTask)
        {
            // success case
            cts.Cancel();
            return true;
        }
        else
        {
            // timeout case
            return false;
        }
    }
}
```

# [JavaScript (PM3)](#tab/javascript-v3)

```javascript
const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    const deadline = moment.utc(context.df.currentUtcDateTime).add(30, "s");

    const activityTask = context.df.callActivity("FlakyFunction");
    const timeoutTask = context.df.createTimer(deadline.toDate());

    const winner = yield context.df.Task.any([activityTask, timeoutTask]);
    if (winner === activityTask) {
        // success case
        timeoutTask.cancel();
        return true;
    } else {
        // timeout case
        return false;
    }
});
```

# [JavaScript (PM4)](#tab/javascript-v4)

```javascript
const df = require("durable-functions");
const { DateTime } = require("luxon");

df.app.orchestration("timerOrchestrator", function* (context) {
    const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime).plus({ seconds: 30 });

    const activityTask = context.df.callActivity("flakyFunction");
    const timeoutTask = context.df.createTimer(deadline.toJSDate());

    const winner = yield context.df.Task.any([activityTask, timeoutTask]);
    if (winner === activityTask) {
        // success case
        timeoutTask.cancel();
        return true;
    } else {
        // timeout case
        return false;
    }
});
```

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import datetime, timedelta

def orchestrator_function(context: df.DurableOrchestrationContext):
    deadline = context.current_utc_datetime + timedelta(seconds = 30)
    
    activity_task = context.call_activity('FlakyFunction')
    timeout_task = context.create_timer(deadline)

    winner = yield context.task_any(activity_task, timeout_task)
    if winner == activity_task:
        timeout_task.cancel()
        return True
    else:
        return False

main = df.Orchestrator.create(orchestrator_function)
```

# [PowerShell](#tab/powershell)

```powershell
param($Context)

$expiryTime = New-TimeSpan -Seconds 30

$activityTask = Invoke-DurableActivity -FunctionName 'FlakyFunction'-NoWait
$timerTask = Start-DurableTimer -Duration $expiryTime -NoWait

$winner = Wait-DurableTask -Task @($activityTask, $timerTask) -NoWait

if ($winner -eq $activityTask) {
    Stop-DurableTimerTask -Task $timerTask
    return $True
}
else {
    return $False
}
```

# [Java](#tab/java)

```java
@FunctionName("TimerOrchestrator")
public boolean timerOrchestrator(
        @DurableOrchestrationTrigger(name = "ctx") TaskOrchestrationContext ctx) {
    Task<Void> activityTask = ctx.callActivity("SlowFunction");
    Task<Void> timeoutTask = ctx.createTimer(Duration.ofMinutes(30));

    Task<?> winner = ctx.anyOf(activityTask, timeoutTask).await();
    if (winner == activityTask) {
        // success case
        return true;
    } else {
        // timeout case
        return false;
    }
}
```

---

> [!NOTE]
> This mechanism doesn't actually terminate in-progress activity function execution. Rather, it simply allows the orchestrator function to ignore the result and move on. For more information, see the [Timers](durable-functions-timers.md#usage-for-timeout) documentation.

## Unhandled exceptions

If an orchestrator function fails with an unhandled exception, the details of the exception are logged and the instance completes with a `Failed` status.

## Include Custom Exception Properties for FailureDetails (.NET Isolated)

When running Durable Task workflows in the .NET Isolated model, task failures are automatically serialized into a FailureDetails object. By default, this object includes standard fields such as:
- ErrorType — the exception type name
- Message — the exception message
- StackTrace — the serialized stack trace
- InnerFailure – a nested FailureDetails object for recursive inner exceptions

Starting with Microsoft.Azure.Functions.Worker.Extensions.DurableTask [v1.9.0](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/1.9.0), You can extend this behavior by implementing an IExceptionPropertiesProvider (defined in the Microsoft.DurableTask.Worker starting from [v1.16.1](https://www.nuget.org/packages/Microsoft.DurableTask.Worker/1.16.1)package). This provider defines which exception types and which of their properties should be included in the FailureDetails.Properties dictionary.

> [!NOTE]  
> - This feature is available in **.NET Isolated** only. Support for Java will be added in a future release.  
> - Make sure you're using **Microsoft.Azure.Functions.Worker.Extensions.DurableTask v1.9.0** or later.  
> - Make sure you're using **Microsoft.DurableTask.Worker v1.16.1** or later.

### Implement an Exception Properties Provider
Implement a custom IExceptionPropertiesProvider to extract and return selected properties for the exceptions you care about. The returned dictionary will be serialized into the Properties field of FailureDetails when a matching exception type is thrown.

```csharp
using Microsoft.DurableTask.Worker;

public class CustomExceptionPropertiesProvider : IExceptionPropertiesProvider
{
    public IDictionary<string, object?>? GetExceptionProperties(Exception exception)
    {
        return exception switch
        {
            ArgumentOutOfRangeException e => new Dictionary<string, object?>
            {
                ["ParamName"] = e.ParamName,
                ["ActualValue"] = e.ActualValue
            },
            InvalidOperationException e => new Dictionary<string, object?>
            {
                ["CustomHint"] = "Invalid operation occurred",
                ["TimestampUtc"] = DateTime.UtcNow
            },
            _ => null // Other exception types not handled
        };
    }
}
```

### Register the Provider
Register your custom IExceptionPropertiesProvider in your .NET Isolated worker host, typically in Program.cs:
```csharp
using Microsoft.DurableTask.Worker;
using Microsoft.Extensions.DependencyInjection;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        // Register custom exception properties provider
        builder.Services.AddSingleton<IExceptionPropertiesProvider, CustomExceptionPropertiesProvider>();
    })
    .Build();

host.Run();
```
Once registered, any exception that matches one of the handled types will automatically include the configured properties in its FailureDetails.

### Sample FailureDetails Output
When an exception occurs that matches your provider’s configuration, the orchestration receives a serialized FailureDetails structure like this:
```json
{
  "errorType": "TaskFailedException",
  "message": "Activity failed with an exception.",
  "stackTrace": "...",
  "innerFailure": {
    "errorType": "ArgumentOutOfRangeException",
    "message": "Specified argument was out of range.",
    "properties": {
      "ParamName": "count",
      "ActualValue": 42
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about eternal orchestrations](durable-functions-eternal-orchestrations.md)

> [!div class="nextstepaction"]
> [Learn how to diagnose problems](durable-functions-diagnostics.md)

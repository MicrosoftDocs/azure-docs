---
title: Handling errors in Durable Functions - Azure
description: Learn how to handle errors in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 02/14/2023
ms.author: azfuncdf
ms.devlang: csharp, javascript, powershell, python, java
---

# Handling errors in Durable Functions (Azure Functions)

Durable Function orchestrations are implemented in code and can use the programming language's built-in error-handling features. There really aren't any new concepts you need to learn to add error handling and compensation into your orchestrations. However, there are a few behaviors that you should be aware of.

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

## Errors in activity functions

Any exception that is thrown in an activity function is marshaled back to the orchestrator function and thrown as a `FunctionFailedException`. You can write error handling and compensation code that suits your needs in the orchestrator function.

For example, consider the following orchestrator function that transfers funds from one account to another:

# [C# (InProc)](#tab/csharp-inproc)

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
    catch (Exception)
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
    catch (Exception)
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

By default, cmdlets in PowerShell do not raise exceptions that can be caught using try/catch blocks. You have two options for changing this behavior:

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

When using the .NET or Java, you also have the option to implement retry handlers in code. This is useful when declarative retry policies are not expressive enough. For languages that don't support custom retry handlers, you still have the option of implementing retry policies using loops, exception handling, and timers for injecting delays between retries.

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
    if (!retryContext.LastFailure.IsCausedBy<ApplicationException>())
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
> This mechanism does not actually terminate in-progress activity function execution. Rather, it simply allows the orchestrator function to ignore the result and move on. For more information, see the [Timers](durable-functions-timers.md#usage-for-timeout) documentation.

## Unhandled exceptions

If an orchestrator function fails with an unhandled exception, the details of the exception are logged and the instance completes with a `Failed` status.

## Next steps

> [!div class="nextstepaction"]
> [Learn about eternal orchestrations](durable-functions-eternal-orchestrations.md)

> [!div class="nextstepaction"]
> [Learn how to diagnose problems](durable-functions-diagnostics.md)

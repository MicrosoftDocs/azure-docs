---
title: "Handle Errors and Retries in Durable Functions"
description: Learn how to handle errors, configure automatic retries, and set timeouts in Durable Functions and Durable Task SDKs. Explore retry policies, custom retry handlers, and compensation patterns to build resilient orchestrations.
ms.topic: how-to
ms.service: durable-task
ms.date: 04/22/2026
ms.author: hannahhunter
author: hhunter-ms
ms.devlang: csharp
# ms.devlang: csharp, javascript, powershell, python, java
ms.custom: devx-track-js
zone_pivot_groups: azure-durable-approach
---

# Handle errors and retries in orchestrations

::: zone pivot="durable-functions"

You implement Durable Functions orchestrations in code, so you use your language's built-in error handling features. Error handling and compensation don't require new concepts, but a few orchestration behaviors are worth knowing about.

[!INCLUDE [functions-nodejs-durable-model-description](../../../includes/functions-nodejs-durable-model-description.md)]

::: zone-end

::: zone pivot="durable-task-sdks"

Apps that use cloud services need to handle failures, and client side retries are an important part of the design. The Durable Task SDKs include support for error handling, retries, and timeouts to help you build robust workflows.

::: zone-end


## Handle errors in activity functions and sub-orchestrations

::: zone pivot="durable-functions"

In Durable Functions, unhandled exceptions thrown within activity functions or sub-orchestrations are marshaled back to the orchestrator function using standardized exception types.

The following orchestrator function transfers funds between two accounts:

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

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
> - By default, `FailureDetails` includes the **error type**, **error message**, **stack trace**, and any **nested inner exceptions** (each represented as a recursive `FailureDetails` object). To include additional exception properties in the failure output, see [Include Custom Exception Properties for FailureDetails (.NET Isolated)](#include-custom-exception-properties-for-failuredetails-net-isolated).  

> [!IMPORTANT]
> **Migration note (in-process to isolated):** In the in-process model, `FunctionFailedException.InnerException` contains the original exception object thrown by the activity, which you can cast and inspect directly. In the isolated worker model, `TaskFailedException` does **not** contain the original exception as an `InnerException`. Instead, error details are available only through the [`FailureDetails`](/dotnet/api/microsoft.durabletask.taskfailuredetails) property, which provides string-based properties (`ErrorType`, `ErrorMessage`, `StackTrace`). You can't cast or access the original exception object directly. Use [`FailureDetails.IsCausedBy<T>()`](/dotnet/api/microsoft.durabletask.taskfailuredetails.iscausedby) to check the original exception type.

</details>
<br>
<details>
<summary><b>In-process model</b></summary>

In Durable Functions C# in-process, unhandled exceptions are thrown as [FunctionFailedException](/dotnet/api/microsoft.azure.webjobs.extensions.durabletask.functionfailedexception).

The exception message usually includes the activity function or sub-orchestration that failed. For details, inspect `InnerException`.

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
> The previous C# examples use Durable Functions 2.x. For Durable Functions 1.x, use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For version differences, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

</details>


# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

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

</details>
<br>
<details>
<summary><b>V4 programming model</b></summary>

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

</details>

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
    except Exception:
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

Invoke-DurableActivity -FunctionName 'DebitAccount' -Input @{ account = $transferDetails.sourceAccount; amount = $transferDetails.amount }

try {
    Invoke-DurableActivity -FunctionName 'CreditAccount' -Input @{ account = $transferDetails.destinationAccount; amount = $transferDetails.amount }
} catch {
    Invoke-DurableActivity -FunctionName 'CreditAccount' -Input @{ account = $transferDetails.sourceAccount; amount = $transferDetails.amount }
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

::: zone-end

::: zone pivot="durable-task-sdks"

In the Durable Task SDKs, unhandled exceptions thrown within activities or sub-orchestrations are marshaled back to the orchestrator using the `TaskFailedException` type. The exception's `FailureDetails` property provides detailed information about the failure.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;

[DurableTask(nameof(TransferFundsOrchestration))]
public class TransferFundsOrchestration : TaskOrchestrator<TransferOperation, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, TransferOperation transfer)
    {
        await context.CallActivityAsync(
            nameof(DebitAccountActivity),
            new AccountOperation { Account = transfer.SourceAccount, Amount = transfer.Amount });

        try
        {
            await context.CallActivityAsync(
                nameof(CreditAccountActivity),
                new AccountOperation { Account = transfer.DestinationAccount, Amount = transfer.Amount });
        }
        catch (TaskFailedException ex)
        {
            // Log the failure details
            var details = ex.FailureDetails;

            // Compensate by refunding the source account
            await context.CallActivityAsync(
                nameof(CreditAccountActivity),
                new AccountOperation { Account = transfer.SourceAccount, Amount = transfer.Amount });

            return $"Transfer failed: {details.ErrorMessage}. Compensation completed.";
        }

        return "Transfer completed successfully";
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import { OrchestrationContext, TOrchestrator } from "@microsoft/durabletask-js";

const transferFundsOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext
): any {
  const transfer = ctx.getInput() as {
    sourceAccount: string;
    destinationAccount: string;
    amount: number;
  };

  yield ctx.callActivity(debitAccount, {
    account: transfer.sourceAccount,
    amount: transfer.amount,
  });

  try {
    yield ctx.callActivity(creditAccount, {
      account: transfer.destinationAccount,
      amount: transfer.amount,
    });
  } catch (error) {
    // Compensate by refunding the source account
    yield ctx.callActivity(creditAccount, {
      account: transfer.sourceAccount,
      amount: transfer.amount,
    });
    return `Transfer failed. Compensation completed.`;
  }

  return "Transfer completed successfully";
};
```

# [Python](#tab/python)

```python
from durabletask import task

def transfer_funds_orchestrator(ctx: task.OrchestrationContext, transfer: dict) -> str:
    """
    Orchestrator that demonstrates error handling with compensation.
    """
    source_account = transfer.get("source_account")
    destination_account = transfer.get("destination_account")
    amount = transfer.get("amount")

    # Debit the source account
    yield ctx.call_activity("debit_account", input={
        "account": source_account,
        "amount": amount
    })

    try:
        # Credit the destination account
        yield ctx.call_activity("credit_account", input={
            "account": destination_account,
            "amount": amount
        })
    except task.TaskFailedError as ex:
        # Compensate by refunding the source account
        yield ctx.call_activity("credit_account", input={
            "account": source_account,
            "amount": amount
        })
        return f"Transfer failed: {ex}. Compensation completed."

    return "Transfer completed successfully"
```

# [PowerShell](#tab/powershell)

No PowerShell sample is available. Use the .NET, JavaScript, Java, or Python sample.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.*;

public TaskOrchestration createTransferOrchestration() {
    return ctx -> {
        TransferOperation transfer = ctx.getInput(TransferOperation.class);

        ctx.callActivity("DebitAccount",
            new AccountOperation(transfer.sourceAccount, transfer.amount)).await();

        try {
            ctx.callActivity("CreditAccount",
                new AccountOperation(transfer.destinationAccount, transfer.amount)).await();
        } catch (TaskFailedException ex) {
            // Compensate by refunding the source account
            ctx.callActivity("CreditAccount",
                new AccountOperation(transfer.sourceAccount, transfer.amount)).await();

            ctx.complete("Transfer failed: " + ex.getMessage() + ". Compensation completed.");
            return;
        }

        ctx.complete("Transfer completed successfully");
    };
}
```

---

If the **CreditAccount** activity fails, the orchestrator catches the exception and compensates by crediting the funds back to the source account.

::: zone-end

::: zone pivot="durable-functions"

## Handle errors with multiple activity calls (fan-out/fan-in)

# [C#](#tab/csharp)

When you use `Task.WhenAll` to run multiple activity calls in parallel (fan-out/fan-in pattern) and one or more activities fail, `await` throws only the first exception. To access all failures, inspect the `Exception` property on the `Task` returned by `Task.WhenAll`.

<details>
<summary><b>Isolated worker model</b></summary>

```csharp
var tasks = new[]
{
    context.CallActivityAsync("Activity1", input1),
    context.CallActivityAsync("Activity2", input2),
    context.CallActivityAsync("Activity3", input3),
};

var allTask = Task.WhenAll(tasks);
try
{
    await allTask;
}
catch (TaskFailedException)
{
    // 'await' rethrows only the first exception. To inspect all failures,
    // check allTask.Exception, which is an AggregateException.
    if (allTask.Exception != null)
    {
        foreach (var inner in allTask.Exception.InnerExceptions)
        {
            if (inner is TaskFailedException taskFailed)
            {
                // Use taskFailed.FailureDetails to inspect error details
                var errorType = taskFailed.FailureDetails.ErrorType;
                var errorMessage = taskFailed.FailureDetails.ErrorMessage;
            }
        }
    }
}
```

</details>
<br>
<details>
<summary><b>In-process model</b></summary>

```csharp
var tasks = new[]
{
    context.CallActivityAsync("Activity1", input1),
    context.CallActivityAsync("Activity2", input2),
    context.CallActivityAsync("Activity3", input3),
};

var allTask = Task.WhenAll(tasks);
try
{
    await allTask;
}
catch (FunctionFailedException)
{
    // 'await' rethrows only the first exception. To inspect all failures,
    // check allTask.Exception, which is an AggregateException.
    if (allTask.Exception != null)
    {
        foreach (var inner in allTask.Exception.InnerExceptions)
        {
            if (inner is FunctionFailedException funcFailed)
            {
                // Use funcFailed.InnerException to access the original exception
            }
        }
    }
}
```

</details>

# [JavaScript](#tab/javascript)

In JavaScript, when you use `context.df.Task.all` to run multiple activity calls in parallel, the first failure causes the task to complete with an error. Wrap the call in a try/catch block to handle the error.

# [Python](#tab/python)

In Python, when you use `context.task_all` to run multiple activity calls in parallel, the first failure causes the task to complete with an error. Wrap the call in a try/except block to handle the error.

# [PowerShell](#tab/powershell)

In PowerShell, use `Wait-DurableTask` with multiple tasks. If any task fails, the error is raised.

# [Java](#tab/java)

In Java, when you use `ctx.allOf` to run multiple activity calls in parallel, the first failure causes the task to complete with an error. Use a try/catch block to handle the error.

---

## Handle errors in entity functions
Exception handling in entity functions depends on the Durable Functions hosting model:

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

In Durable Functions C# isolated, the runtime wraps entity function exceptions in an `EntityOperationFailedException`. To get the original exception details, inspect the `FailureDetails` property.

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

</details>
<br>
<details>
<summary><b>In-process model</b></summary>

In Durable Functions with C# in-process, entity functions return their original exception types to the orchestrator.

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
        // The exception type is InvalidOperationException with the message "this is an entity exception".
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

</details>

# [JavaScript](#tab/javascript)

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

PowerShell doesn't support entity functions.

# [Java](#tab/java)

Java doesn't support entity functions.

---

::: zone-end

## Automatic retry on failure

::: zone pivot="durable-functions"

When you call activity functions or sub-orchestration functions, specify an automatic retry policy. The following example calls a function up to three times and waits five seconds between retries:

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

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

</details>
<br>
<details>
<summary><b>In-process model</b></summary>

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
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

</details>

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

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

</details>
<br>
<details>
<summary><b>V4 programming model</b></summary>

```javascript
const df = require("durable-functions");

df.app.orchestration("callActivityWithRetry", function* (context) {
    const firstRetryIntervalInMilliseconds = 5000;
    const maxNumberOfAttempts = 3;

    const retryOptions = new df.RetryOptions(firstRetryIntervalInMilliseconds, maxNumberOfAttempts);

    yield context.df.callActivityWithRetry("FlakyFunction", retryOptions);

    // ...
});
```

</details>

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
    ctx.callActivity("FlakyFunction", options).await();
    // ...
}
```

---

The activity function call in the previous example uses a parameter to configure an automatic retry policy. Customize the policy with these options:

* **Max number of attempts**: The maximum number of attempts. If set to 1, no retries occur.
* **First retry interval**: The amount of time to wait before the first retry attempt.
* **Backoff coefficient**: The coefficient used to determine rate of increase of backoff. Defaults to 1.
* **Max retry interval**: The maximum amount of time to wait between retry attempts.
* **Retry timeout**: The maximum amount of time to spend retrying. By default, retries continue indefinitely.

::: zone-end

::: zone pivot="durable-task-sdks"

The Durable Task SDKs include alternative scheduling methods that retry failed activities based on a supplied policy. These methods are useful for activities that read data from web services or perform idempotent writes to a database.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;

[DurableTask(nameof(OrchestratorWithRetry))]
public class OrchestratorWithRetry : TaskOrchestrator<string, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, string input)
    {
        // Configure retry policy
        var retryPolicy = new RetryPolicy(
            maxNumberOfAttempts: 3,
            firstRetryInterval: TimeSpan.FromSeconds(5),
            backoffCoefficient: 2.0,
            maxRetryInterval: TimeSpan.FromMinutes(1),
            retryTimeout: TimeSpan.FromMinutes(5));

        var options = TaskOptions.FromRetryPolicy(retryPolicy);

        // Call activity with automatic retry
        string result = await context.CallActivityAsync<string>(
            nameof(UnreliableActivity), input, options);

        return result;
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
  RetryPolicy,
} from "@microsoft/durabletask-js";

const retryPolicyOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext
): any {
  const retryPolicy = new RetryPolicy({
    maxNumberOfAttempts: 3,
    firstRetryIntervalInMilliseconds: 5000,
    backoffCoefficient: 2.0,
    maxRetryIntervalInMilliseconds: 60000,
  });

  const result: string = yield ctx.callActivity(
    unreliableActivity,
    ctx.getInput(),
    { retry: retryPolicy }
  );

  return result;
};
```

# [Python](#tab/python)

```python
from durabletask import task
from durabletask.task import RetryPolicy

def orchestrator_with_retry(ctx: task.OrchestrationContext, input_data: str) -> str:
    """
    Orchestrator that demonstrates automatic retry on activity failure.
    """
    # Configure retry policy
    retry_policy = RetryPolicy(
        first_retry_interval=5,        # seconds
        max_number_of_attempts=3,
        backoff_coefficient=2.0,
        max_retry_interval=60,         # seconds
        retry_timeout=300              # seconds
    )

    # Call activity with automatic retry
    result = yield ctx.call_activity(
        "unreliable_activity",
        input=input_data,
        retry_policy=retry_policy
    )

    return result
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.*;
import java.time.Duration;

public TaskOrchestration createOrchestratorWithRetry() {
    return ctx -> {
        String input = ctx.getInput(String.class);

        // Configure retry policy
        RetryPolicy retryPolicy = new RetryPolicy(
            3,                              // maxNumberOfAttempts
            Duration.ofSeconds(5),          // firstRetryInterval
            2.0,                            // backoffCoefficient
            Duration.ofMinutes(1),          // maxRetryInterval
            Duration.ofMinutes(5)           // retryTimeout
        );

        TaskOptions options = new TaskOptions(retryPolicy);

        // Call activity with automatic retry
        String result = ctx.callActivity(
            "UnreliableActivity", input, options, String.class).await();

        ctx.complete(result);
    };
}
```

---

The retry policy options are:

* **Max number of attempts**: The maximum number of retry attempts. If set to 1, no retries occur.
* **First retry interval**: The amount of time to wait before the first retry attempt.
* **Backoff coefficient**: The coefficient used to determine rate of increase of backoff. Defaults to 1.
* **Max retry interval**: The maximum amount of time to wait between retry attempts.
* **Retry timeout**: The maximum amount of time to spend doing retries.

::: zone-end

::: zone pivot="durable-functions"

## Custom retry handlers

In .NET and Java, implement retry handlers in code when declarative retry policies aren't expressive enough. In other languages, implement retry logic by using loops, exception handling, and timers to delay between retries.

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

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

</details>
<br>
<details>
<summary><b>In-process model</b></summary>

```csharp
RetryOptions retryOptions = new RetryOptions(
    firstRetryInterval: TimeSpan.FromSeconds(5),
    maxNumberOfAttempts: int.MaxValue)
{
    Handle = exception =>
    {
        // Return true to handle and retry, or false to throw.
        if (exception is TaskFailedException failure)
        {
            // Exceptions from task activities are always this type. Inspect the
            // inner exception for more details.
        }

        return false;
    }
};

await ctx.CallActivityWithRetryAsync("FlakeyActivity", retryOptions, null);
```

</details>

# [JavaScript](#tab/javascript)

JavaScript doesn't support custom retry handlers in Durable Functions. Implement retry logic in the orchestrator function by using loops, exception handling, and timers to delay between retries.

# [Python](#tab/python)

Python doesn't support custom retry handlers. Implement retry logic in the orchestrator function by using loops, exception handling, and timers to delay between retries.

# [PowerShell](#tab/powershell)

PowerShell doesn't support custom retry handlers. Implement retry logic in the orchestrator function by using loops, exception handling, and timers to delay between retries.

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

::: zone-end

::: zone pivot="durable-task-sdks"

## Custom retry handlers

In .NET and Java, implement retry handlers in code to control retry logic. This approach is useful when declarative retry policies aren't expressive enough.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;

[DurableTask(nameof(OrchestratorWithCustomRetry))]
public class OrchestratorWithCustomRetry : TaskOrchestrator<string, string>
{
    public override async Task<string> RunAsync(
        TaskOrchestrationContext context, string input)
    {
        // Custom retry handler with conditional logic
        TaskOptions retryOptions = TaskOptions.FromRetryHandler(retryContext =>
        {
            // Don't retry if it's a validation error
            if (retryContext.LastFailure.IsCausedBy<ArgumentException>())
            {
                return false;
            }

            // Retry up to 5 times for transient errors
            return retryContext.LastAttemptNumber < 5;
        });

        try
        {
            return await context.CallActivityAsync<string>(
                nameof(UnreliableActivity), input, retryOptions);
        }
        catch (TaskFailedException)
        {
            // All retries exhausted
            return "Operation failed after all retries";
        }
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
} from "@microsoft/durabletask-js";
import type { RetryHandler, RetryContext } from "@microsoft/durabletask-js";

const customRetryHandlerOrchestrator: TOrchestrator = async function* (
  ctx: OrchestrationContext
): any {
  const maxAttempts = 4;

  const customRetryHandler: RetryHandler = (retryCtx: RetryContext) => {
    if (retryCtx.lastAttemptNumber >= maxAttempts) {
      return false; // give up
    }
    // Only retry transient errors
    if (!retryCtx.lastFailure.message?.includes("TransientError")) {
      return false;
    }
    return true; // retry immediately
  };

  const result: string = yield ctx.callActivity(
    unreliableActivity,
    ctx.getInput(),
    { retry: customRetryHandler }
  );

  return result;
};
```

# [Python](#tab/python)

Custom retry handlers aren't supported in Python. Implement custom retry logic by using loops, exception handling, and timers:

```python
import datetime
from durabletask import task

def orchestrator_with_custom_retry(ctx: task.OrchestrationContext, input_data: str) -> str:
    """
    Orchestrator that demonstrates custom retry logic.
    """
    max_attempts = 5
    retry_interval_seconds = 5

    for attempt in range(1, max_attempts + 1):
        try:
            result = yield ctx.call_activity("unreliable_activity", input=input_data)
            return result
        except task.TaskFailedError as ex:
            if attempt >= max_attempts:
                return f"Operation failed after {max_attempts} attempts"

            # Wait before retrying
            next_retry = ctx.current_utc_datetime + datetime.timedelta(seconds=retry_interval_seconds)
            yield ctx.create_timer(next_retry)

    return "Unexpected error"
```

# [PowerShell](#tab/powershell)

Custom retry handlers aren't supported in PowerShell. Implement custom retry logic by using loops, exception handling, and timers.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.*;

public TaskOrchestration createOrchestratorWithCustomRetry() {
    return ctx -> {
        String input = ctx.getInput(String.class);

        // Custom retry handler with conditional logic
        RetryHandler retryHandler = retryContext -> {
            // Don't retry validation errors
            if (retryContext.getLastFailure().isCausedBy(IllegalArgumentException.class)) {
                return false;
            }

            // Retry up to 5 times for transient errors
            return retryContext.getLastAttemptNumber() < 5;
        };

        TaskOptions options = new TaskOptions(retryHandler);

        try {
            String result = ctx.callActivity("UnreliableActivity", input, options, String.class).await();
            ctx.complete(result);
        } catch (TaskFailedException ex) {
            // All retries exhausted
            ctx.complete("Operation failed after all retries");
        }
    };
}
```

---

::: zone-end

::: zone pivot="durable-functions"

## Function timeouts

If a function call takes too long, time it out in the orchestrator function. Create a [durable timer](durable-task-timers.md) with an `any` task selector, as in the following example:

# [C#](#tab/csharp)

<details>
<summary><b>Isolated worker model</b></summary>

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

</details>
<br>
<details>
<summary><b>In-process model</b></summary>

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
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](../../azure-functions/durable-functions/durable-functions-versions.md) article.

</details>

# [JavaScript](#tab/javascript)

<details>
<summary><b>V3 programming model</b></summary>

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

</details>
<br>
<details>
<summary><b>V4 programming model</b></summary>

```javascript
const df = require("durable-functions");
const { DateTime } = require("luxon");

df.app.orchestration("timerOrchestrator", function* (context) {
    const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime).plus({ seconds: 30 });

    const activityTask = context.df.callActivity("FlakyFunction");
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

</details>

# [Python](#tab/python)

```python
import azure.functions as func
import azure.durable_functions as df
from datetime import datetime, timedelta

def orchestrator_function(context: df.DurableOrchestrationContext):
    deadline = context.current_utc_datetime + timedelta(seconds = 30)
    
    activity_task = context.call_activity('FlakyFunction')
    timeout_task = context.create_timer(deadline)

    winner = yield context.task_any([activity_task, timeout_task])
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

$activityTask = Invoke-DurableActivity -FunctionName 'FlakyFunction' -NoWait
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
    Task<Void> activityTask = ctx.callActivity("FlakyFunction");
    Task<Void> timeoutTask = ctx.createTimer(Duration.ofSeconds(30));

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
> This mechanism doesn't end activity function execution that's already in progress. It lets the orchestrator function ignore the result and move on. For more information, see [Timers](durable-task-timers.md#use-durable-timers-for-timeouts).

::: zone-end

::: zone pivot="durable-task-sdks"

## Activity timeouts

If an activity call takes too long, you can stop waiting for it. Create a durable timer and race it against the activity task.

# [C#](#tab/csharp)

```csharp
using Microsoft.DurableTask;
using System;
using System.Threading;
using System.Threading.Tasks;

[DurableTask(nameof(OrchestratorWithTimeout))]
public class OrchestratorWithTimeout : TaskOrchestrator<string, bool>
{
    public override async Task<bool> RunAsync(
        TaskOrchestrationContext context, string input)
    {
        TimeSpan timeout = TimeSpan.FromSeconds(30);
        DateTime deadline = context.CurrentUtcDateTime.Add(timeout);

        using var cts = new CancellationTokenSource();
        Task activityTask = context.CallActivityAsync(nameof(SlowActivity), input);
        Task timeoutTask = context.CreateTimer(deadline, cts.Token);

        Task winner = await Task.WhenAny(activityTask, timeoutTask);
        if (winner == activityTask)
        {
            // Activity completed in time - cancel the timer
            cts.Cancel();
            return true;
        }
        else
        {
            // Timeout occurred
            return false;
        }
    }
}
```

# [JavaScript](#tab/javascript)

```typescript
import {
  OrchestrationContext,
  TOrchestrator,
} from "@microsoft/durabletask-js";

const orchestratorWithTimeout: TOrchestrator = async function* (
  ctx: OrchestrationContext
): any {
  const timeoutSeconds = 30;

  // Start both the activity and a timeout timer
  const activityTask = ctx.callActivity(slowActivity, ctx.getInput());
  const timeoutTask = ctx.createTimer(timeoutSeconds);

  // Wait for whichever completes first
  const winner = yield ctx.whenAny([activityTask, timeoutTask]);

  if (winner === activityTask) {
    // Activity completed in time
    return true;
  } else {
    // Timeout occurred
    return false;
  }
};
```

# [Python](#tab/python)

```python
import datetime
from durabletask import task

def orchestrator_with_timeout(ctx: task.OrchestrationContext, input_data: str) -> bool:
    """
    Orchestrator that demonstrates activity timeout using a timer.
    """
    timeout_seconds = 30
    deadline = ctx.current_utc_datetime + datetime.timedelta(seconds=timeout_seconds)

    # Create both tasks
    activity_task = ctx.call_activity("slow_activity", input=input_data)
    timeout_task = ctx.create_timer(deadline)

    # Wait for whichever completes first
    winner = yield task.when_any([activity_task, timeout_task])

    if winner == activity_task:
        # Activity completed in time
        return True
    else:
        # Timeout occurred
        return False
```

# [PowerShell](#tab/powershell)

This sample is shown for .NET, JavaScript, Java, and Python.

# [Java](#tab/java)

```java
import com.microsoft.durabletask.*;
import java.time.Duration;

public TaskOrchestration createOrchestratorWithTimeout() {
    return ctx -> {
        String input = ctx.getInput(String.class);

        // Create activity task
        Task<String> activityTask = ctx.callActivity("SlowActivity", input, String.class);

        // Create timeout timer (30 seconds)
        Task<Void> timeoutTask = ctx.createTimer(Duration.ofSeconds(30));

        // Wait for whichever completes first
        Task<?> winner = ctx.anyOf(activityTask, timeoutTask).await();

        if (winner == activityTask) {
            // Activity completed in time
            ctx.complete(true);
        } else {
            // Timeout occurred
            ctx.complete(false);
        }
    };
}
```

---

> [!NOTE]
> This mechanism doesn't end activity execution that's already in progress. It lets the orchestrator ignore the result and move on. For more information, see the [Timers](durable-task-timers.md#use-durable-timers-for-timeouts) documentation.

::: zone-end

::: zone pivot="durable-functions"

## Unhandled exceptions

If an orchestrator function fails with an unhandled exception, the runtime logs the exception details, and the instance completes with a `Failed` status.

## Include custom exception properties for FailureDetails (.NET Isolated)

In Durable Task workflows that use the .NET Isolated model, task failures are serialized to a `FailureDetails` object. By default, the object includes these fields:
- `ErrorType`—Exception type name
- `Message`—Exception message
- `StackTrace`—Serialized stack trace
- `InnerFailure`—Nested `FailureDetails` object for inner exceptions

Starting with Microsoft.Azure.Functions.Worker.Extensions.DurableTask [v1.9.0](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.DurableTask/1.9.0), you can extend this behavior by implementing `IExceptionPropertiesProvider` (defined in the `Microsoft.DurableTask.Worker` package starting in [v1.16.1](https://www.nuget.org/packages/Microsoft.DurableTask.Worker/1.16.1)). This provider defines which exception types and properties to include in the `FailureDetails.Properties` dictionary.

> [!NOTE]  
> - This feature is available in **.NET Isolated** only. Support for Java isn't available yet.  
> - Make sure you're using **Microsoft.Azure.Functions.Worker.Extensions.DurableTask v1.9.0** or later.  
> - Make sure you're using **Microsoft.DurableTask.Worker v1.16.1** or later.

### Implement an exception properties provider
Implement a custom `IExceptionPropertiesProvider` to extract and return selected properties for the exceptions you care about. The returned dictionary is serialized to the `Properties` field of `FailureDetails` when a matching exception type is thrown.

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

### Register the provider
In *Program.cs*, register your custom `IExceptionPropertiesProvider` in your .NET Isolated worker host:
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
After you register the provider, any exception that matches a handled type automatically includes the configured properties in its `FailureDetails`.

### Sample FailureDetails output
When an exception occurs that matches your provider’s configuration, the orchestration receives a serialized `FailureDetails` object like this:
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

::: zone-end

::: zone pivot="durable-task-sdks"

## Unhandled exceptions

If an orchestrator fails because of an unhandled exception, the runtime logs the exception details, and the instance completes with a `Failed` status. The `TaskFailedException` has a `FailureDetails` property that includes the error type, message, and stack trace.

::: zone-end

## Next steps

::: zone pivot="durable-functions"

> [!div class="nextstepaction"]
> [Eternal orchestrations](durable-task-eternal-orchestrations.md)

> [!div class="nextstepaction"]
> [Diagnose problems](../../azure-functions/durable-functions/durable-functions-diagnostics.md)

::: zone-end

::: zone pivot="durable-task-sdks"

> [!div class="nextstepaction"]
> [Get started with Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

- [JavaScript SDK samples on GitHub](https://github.com/microsoft/durabletask-js/tree/main/examples/azure-managed)

::: zone-end

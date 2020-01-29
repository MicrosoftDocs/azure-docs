---
title: Handling errors in Durable Functions - Azure
description: Learn how to handle errors in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 11/02/2019
ms.author: azfuncdf
---

# Handling errors in Durable Functions (Azure Functions)

Durable Function orchestrations are implemented in code and can use the programming language's built-in error-handling features. There really aren't any new concepts you need to learn to add error handling and compensation into your orchestrations. However, there are a few behaviors that you should be aware of.

## Errors in activity functions

Any exception that is thrown in an activity function is marshaled back to the orchestrator function and thrown as a `FunctionFailedException`. You can write error handling and compensation code that suits your needs in the orchestrator function.

For example, consider the following orchestrator function that transfers funds from one account to another:

# [C#](#tab/csharp)

```csharp
[FunctionName("TransferFunds")]
public static async Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var transferDetails = ctx.GetInput<TransferOperation>();

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

# [JavaScript](#tab/javascript)

```javascript
const df = require("durable-functions");

module.exports = df.orchestrator(function*(context) {
    const transferDetails = context.df.getInput();

    yield context.df.callActivity("DebitAccount",
        {
            account = transferDetails.sourceAccount,
            amount = transferDetails.amount,
        }
    );

    try {
        yield context.df.callActivity("CreditAccount",
            {
                account = transferDetails.destinationAccount,
                amount = transferDetails.amount,
            }
        );
    }
    catch (error) {
        // Refund the source account.
        // Another try/catch could be used here based on the needs of the application.
        yield context.df.callActivity("CreditAccount",
            {
                account = transferDetails.sourceAccount,
                amount = transferDetails.amount,
            }
        );
    }
});
```

---

If the first **CreditAccount** function call fails, the orchestrator function compensates by crediting the funds back to the source account.

## Automatic retry on failure

When you call activity functions or sub-orchestration functions, you can specify an automatic retry policy. The following example attempts to call a function up to three times and waits 5 seconds between each retry:

# [C#](#tab/csharp)

```csharp
[FunctionName("TimerOrchestratorWithRetry")]
public static async Task Run([OrchestrationTrigger] IDurableOrchestrationContext context)
{
    var retryOptions = new RetryOptions(
        firstRetryInterval: TimeSpan.FromSeconds(5),
        maxNumberOfAttempts: 3);

    await ctx.CallActivityWithRetryAsync("FlakyFunction", retryOptions, null);

    // ...
}
```

> [!NOTE]
> The previous C# examples are for Durable Functions 2.x. For Durable Functions 1.x, you must use `DurableOrchestrationContext` instead of `IDurableOrchestrationContext`. For more information about the differences between versions, see the [Durable Functions versions](durable-functions-versions.md) article.

# [JavaScript](#tab/javascript)

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

---

The activity function call in the previous example takes a parameter for configuring an automatic retry policy. There are several options for customizing the automatic retry policy:

* **Max number of attempts**: The maximum number of retry attempts.
* **First retry interval**: The amount of time to wait before the first retry attempt.
* **Backoff coefficient**: The coefficient used to determine rate of increase of backoff. Defaults to 1.
* **Max retry interval**: The maximum amount of time to wait in between retry attempts.
* **Retry timeout**: The maximum amount of time to spend doing retries. The default behavior is to retry indefinitely.
* **Handle**: A user-defined callback can be specified to determine whether a function should be retried.

## Function timeouts

You might want to abandon a function call within an orchestrator function if it's taking too long to complete. The proper way to do this today is by creating a [durable timer](durable-functions-timers.md) using `context.CreateTimer` (.NET) or `context.df.createTimer` (JavaScript) in conjunction with `Task.WhenAny` (.NET) or `context.df.Task.any` (JavaScript), as in the following example:

# [C#](#tab/csharp)

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

# [JavaScript](#tab/javascript)

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

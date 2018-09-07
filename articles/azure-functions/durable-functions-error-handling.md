---
title: Handling errors in Durable Functions - Azure
description: Learn how to handle errors in the Durable Functions extension for Azure Functions.
services: functions
author: cgillum
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 09/05/2018
ms.author: azfuncdf
---

# Handling errors in Durable Functions (Azure Functions)

Durable Function orchestrations are implemented in code and can use the error-handling capabilities of the programming language. With this in mind, there really aren't any new concepts you need to learn about when incorporating error handling and compensation into your orchestrations. However, there are a few behaviors that you should be aware of.

## Errors in activity functions

Any exception that is thrown in an activity function is marshalled back to the orchestrator function and thrown as a `FunctionFailedException`. You can write error handling and compensation code that suits your needs in the orchestrator function.

For example, consider the following orchestrator function that transfers funds from one account to another:

```csharp
#r "Microsoft.Azure.WebJobs.Extensions.DurableTask"

public static async Task Run(DurableOrchestrationContext context)
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

If the call to the **CreditAccount** function fails for the destination account, the orchestrator function compensates for this by crediting the funds back to the source account.

## Automatic retry on failure

When you call activity functions or sub-orchestration functions, you can specify an automatic retry policy. The following example attempts to call a function up to three times and waits 5 seconds between each retry:

```csharp
public static async Task Run(DurableOrchestrationContext context)
{
    var retryOptions = new RetryOptions(
        firstRetryInterval: TimeSpan.FromSeconds(5),
        maxNumberOfAttempts: 3);

    await ctx.CallActivityWithRetryAsync("FlakyFunction", retryOptions, null);
    
    // ...
}
```

The `CallActivityWithRetryAsync` API takes a `RetryOptions` parameter. Suborchestration calls using the `CallSubOrchestratorWithRetryAsync` API can use these same retry policies.

There are several options for customizing the automatic retry policy. They include the following:

* **Max number of attempts**: The maximum number of retry attempts.
* **First retry interval**: The amount of time to wait before the first retry attempt.
* **Backoff coefficient**: The coefficient used to determine rate of increase of backoff. Defaults to 1.
* **Max retry interval**: The maximum amount of time to wait in between retry attempts.
* **Retry timeout**: The maximum amount of time to spend doing retries. The default behavior is to retry indefinitely.
* **Handle**: A user-defined callback can be specified which determines whether or not a function call should be retried.

## Function timeouts

You might want to abandon a function call within an orchestrator function if it is taking too long to complete. The proper way to do this today is by creating a [durable timer](durable-functions-timers.md) using `context.CreateTimer` in conjunction with `Task.WhenAny`, as in the following example:

```csharp
public static async Task<bool> Run(DurableOrchestrationContext context)
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
> This mechanism does not actually terminate in-progress activity function execution. Rather, it simply allows the orchestrator function to ignore the result and move on. For more information, see the [Timers](durable-functions-timers.md#usage-for-timeout) documentation.

## Unhandled exceptions

If an orchestrator function fails with an unhandled exception, the details of the exception are logged and the instance completes with a `Failed` status.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to diagnose problems](durable-functions-diagnostics.md)

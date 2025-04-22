---
title: "Quickstart: Set a portable Durable Task SDK in your application to use Azure Functions Durable Task Scheduler (preview)"
description: Learn how to configure an existing app for the Azure Functions Durable Task Scheduler using the portable Durable Task SDKs.
ms.topic: how-to
ms.date: 04/22/2025
zone_pivot_groups: df-languages
---

# Quickstart: Set a portable Durable Task SDK in your application to use Azure Functions Durable Task Scheduler (preview)

The Durable Task SDKs, or "portable SDKs", provide a lightweight client library for the Durable Task Scheduler. In this quickstart, you learn how to create orchestrations that leverage [the fan-out/fan-in application pattern](../durable/durable-functions-overview.md#pattern-2-fan-outfan-in) to perform parallel processing.

::: zone pivot="javascript"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="powershell"

[!INCLUDE [preview-sample-limitations](./includes/preview-sample-limitations.md)]

::: zone-end

::: zone pivot="csharp,python,java"

> [!div class="checklist"]
>
> - Set up and run the Durable Task Scheduler emulator for local development. 
> - Run the worker and client projects.
> - Review orchestration status and history via the Durable Task Scheduler dashboard.

## Prerequisites

Before you begin: 

::: zone-end

::: zone pivot="csharp"

- Make sure you have [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later.
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

::: zone-end


::: zone pivot="python"

- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.
    
::: zone-end

::: zone pivot="java"

::: zone-end

::: zone pivot="csharp,python,java"

## Set up the Durable Task Scheduler emulator

The emulator simulates a scheduler and taskhub in a Docker container, making it ideal for the local development required in this quickstart.

::: zone-end

::: zone pivot="csharp"

1. From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the Python SDK sample dirctory. 

     # [Bash](#tab/bash)
     
     ```bash
     cd samples/portable-sdks/dotnet/FanOutFanIn
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     cd samples/portable-sdks/dotnet/FanOutFanIn
     ```
     
     ---

1. Pull the Docker image for the emulator.

     # [Bash](#tab/bash)
     
     ```bash
     docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     ---

1. Run the emulator. The container may take a few seconds to be ready.

     # [Bash](#tab/bash)
     
     ```bash
     docker run --name dtsemulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     docker run --name dtsemulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:v0.0.6     ```
     
     ---

Since the example code automatically uses the default emulator settings, you don't need to set any environment variables. 
- Endpoint: `http://localhost:8080`
- Task hub: `default`

::: zone-end


::: zone pivot="python"

1. From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the Python SDK sample dirctory. 

     # [Bash](#tab/bash)
     
     ```bash
     cd samples/portable-sdks/python/sub-orchestrations-with-fan-out-fan-in
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     cd samples/portable-sdks/python/sub-orchestrations-with-fan-out-fan-in
     ```
     
     ---

1. Pull the Docker image for the emulator.

     # [Bash](#tab/bash)
     
     ```bash
     docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     docker pull mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     ---

1. Run the emulator. The container may take a few seconds to be ready.

     # [Bash](#tab/bash)
     
     ```bash
     docker run --name dtsemulator -d -p 8080:8080 mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     docker run --name dtsemulator -d -p 8080:8080 mcr.microsoft.com/dts/dts-emulator:v0.0.6
     ```
     
     ---

1. Set the environment variables.

     # [Bash](#tab/bash)
     
     ```bash
     export TASKHUB=<taskhubname>
     export ENDPOINT=<taskhubEndpoint>
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     $env:TASKHUB = "<taskhubname>"
     $env:ENDPOINT = "<taskhubEndpoint>"
     ```
     
     ---

::: zone-end

::: zone pivot="java"

::: zone-end

::: zone pivot="python,java"

## Update the worker and client projects

::: zone-end

::: zone pivot="python"

1. Open the sample in your preferred code editor and select the `worker.py` application.

1. Change the `token_credential` input value for `DurableTaskSchedulerWorker` to `None`.

     ```python
     # ...

     with DurableTaskSchedulerWorker(host_address=endpoint, secure_channel=True,
                                taskhub=taskhub_name, token_credential=None) as w:

     # ...
     ```
     
1. Save `worker.py`.
1. Open the `orchestrator.py` application.
1. Change the `token_credential` input value for `DurableTaskSchedulerClient` to `None`.

     ```python
     # ...

     c = DurableTaskSchedulerClient(host_address=endpoint, secure_channel=True,
                               taskhub=taskhub_name, token_credential=None)

     # ...
     ```

1. Save `orchestrator.py`.

::: zone-end

::: zone pivot="java"

::: zone-end

::: zone pivot="csharp,python,java"

## Run the projects

::: zone-end

::: zone pivot="csharp"

1. From the `FanOutFanIn` directory, navigate to the `Worker` directory to build and run the worker. 

     # [Bash](#tab/bash)
     
     ```bash
     cd Worker
     dotnet build
     dotnet run
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     cd Worker
     dotnet build
     dotnet run
     ```
     
     ---

1. In a separate terminal, from the `FanOutFanIn` directory, navigate to the `Client` directory to build and run the client.

     # [Bash](#tab/bash)
     
     ```bash
     cd Client
     dotnet build
     dotnet run
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     cd Client
     dotnet build
     dotnet run
     ```
     
     ---

### Understanding the output

When you run this sample, you receive output from both the worker and client processes. The worker output shows:

- Registration of the orchestrator and activities
- Log entries when each activity is called
- Parallel processing of multiple work items
- Final aggregation of results

The client output shows: 

- Starting the orchestration with a list of work items
- The unique orchestration instance ID
- The final aggregated results, showing each work item and its corresponding result
- Total count of processed items

**Example output**

```
Starting Fan-Out Fan-In Pattern - Parallel Processing Client
Using local emulator with no authentication
Starting parallel processing orchestration with 5 work items
Work items: ["Task1","Task2","Task3","LongerTask4","VeryLongTask5"]
Started orchestration with ID: 7f8e9a6b-1c2d-3e4f-5a6b-7c8d9e0f1a2b
Waiting for orchestration to complete...
Orchestration completed with status: Completed
Processing results:
Work item: Task1, Result: 5
Work item: Task2, Result: 5
Work item: Task3, Result: 5
Work item: LongerTask4, Result: 11
Work item: VeryLongTask5, Result: 13
Total items processed: 5
```     

::: zone-end

::: zone pivot="python"


1. Start the worker. Ensure the `TASKHUB` and `ENDPOINT` environment variables are set in your shell. 

     # [Bash](#tab/bash)
     
     ```bash
     python3 ./worker.py
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     python3 ./worker.py
     ```
     
     ---

1. Start the orchestrator. Ensure the `TASKHUB` and `ENDPOINT` environment variables are set in your shell. 

     # [Bash](#tab/bash)
     
     ```bash
     python3 ./orchestrator.py
     ```
     
     # [PowerShell](#tab/powershel)
     
     ```powershell
     python3 ./orchestrator.py
     ```
     
     ---

> [!NOTE]
> Python3.exe is not defined in Windows. If you receive an error when running `python3`, try `python` instead.

::: zone-end

::: zone pivot="java"

::: zone-end


::: zone pivot="csharp,python,java"

## View orchestration status and history

You can view the orchestration status and history via the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). By default, the dashboard runs on port 8082. 

1. Navigate to http://localhost:8082 in your web browser.
1. Click the **default** task hub. The orchestration instance you just created is in the list.
1. Click the orchestration instance ID to view the execution details, which include:
   - The parallel execution of multiple activity tasks
   - The fan-in aggregation step
   - The input and output at each step
   - The time taken for each step

:::image type="content" source="media/quickstart-portable-durable-task-sdks/review-dashboard.png" alt-text="Screenshot showing the orchestartion instance's details.":::

::: zone-end

::: zone pivot="csharp,python,java"

## What happened?

::: zone-end

::: zone pivot="csharp"

### The worker project

To demonstrate [the fan-out/fan-in pattern](../durable/durable-functions-overview.md#pattern-2-fan-outfan-in), the worker project orchestration creates parallel activity tasks and waits for all to complete. The orchestrator:

1. Takes a list of work items as input.
1. Fans out by creating a separate task for each work item using `ProcessWorkItemActivity`.
1. Executes all tasks in parallel.
1. Waits for all tasks to complete using `Task.WhenAll`.
1. Fans in by aggregating all individual results using `AggregateResultsActivity`.
1. Returns the final aggregated result to the client.

The worker project contains:

- **ParallelProcessingOrchestration.cs**: Defines the orchestrator and activity functions in a single file.
- **Program.cs**: Sets up the worker host with proper connection string handling.

#### `ParallelProcessingOrchestration.cs`

Using fan-out/fan-in, the orchestration creates parallel activity tasks and waits for all to complete. 

```csharp
public override async Task<Dictionary<string, int>> RunAsync(TaskOrchestrationContext context, List<string> workItems)
{
    // Step 1: Fan-out by creating a task for each work item in parallel
    List<Task<Dictionary<string, int>>> processingTasks = new List<Task<Dictionary<string, int>>>();
    
    foreach (string workItem in workItems)
    {
        // Create a task for each work item (fan-out)
        Task<Dictionary<string, int>> task = context.CallActivityAsync<Dictionary<string, int>>(
            nameof(ProcessWorkItemActivity), workItem);
        processingTasks.Add(task);
    }
    
    // Step 2: Wait for all parallel tasks to complete
    Dictionary<string, int>[] results = await Task.WhenAll(processingTasks);
    
    // Step 3: Fan-in by aggregating all results
    Dictionary<string, int> aggregatedResults = await context.CallActivityAsync<Dictionary<string, int>>(
        nameof(AggregateResultsActivity), results);
    
    return aggregatedResults;
}
```

Each activity is implemented as a separate class decorated with the `[DurableTask]` attribute.

```csharp
[DurableTask]
public class ProcessWorkItemActivity : TaskActivity<string, Dictionary<string, int>>
{
    // Implementation processes a single work item
}

[DurableTask]
public class AggregateResultsActivity : TaskActivity<Dictionary<string, int>[], Dictionary<string, int>>
{
    // Implementation aggregates individual results
}
```

#### `Program.cs`

The worker uses `Microsoft.Extensions.Hosting` for proper lifecycle management.

```csharp
using Microsoft.Extensions.Hosting;
//..

builder.Services.AddDurableTaskWorker()
    .AddTasks(registry =>
    {
        registry.AddOrchestrator<ParallelProcessingOrchestration>();
        registry.AddActivity<ProcessWorkItemActivity>();
        registry.AddActivity<AggregateResultsActivity>();
    })
    .UseDurableTaskScheduler(connectionString);
```

### The client project

The client project:

- Uses the same connection string logic as the worker.
- Creates a list of work items to be processed in parallel.
- Schedules an orchestration instance with the list as input.
- Waits for the orchestration to complete and displays the aggregated results.
- Uses `WaitForInstanceCompletionAsync` for efficient polling.

```csharp
List<string> workItems = new List<string>
{
    "Task1",
    "Task2",
    "Task3",
    "LongerTask4",
    "VeryLongTask5"
};

// Schedule the orchestration with the work items
string instanceId = await client.ScheduleNewOrchestrationInstanceAsync(
    "ParallelProcessingOrchestration", 
    workItems);

// Wait for completion
var instance = await client.WaitForInstanceCompletionAsync(
    instanceId,
    getInputsAndOutputs: true,
    cts.Token);
```

::: zone-end


::: zone pivot="python"

When you started the worker and orchestrator, 
    
::: zone-end

::: zone pivot="java"

::: zone-end





## Next steps
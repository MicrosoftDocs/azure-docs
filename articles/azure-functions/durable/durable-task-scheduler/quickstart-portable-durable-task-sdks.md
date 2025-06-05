---
title: "Quickstart: Create an app with Durable Task SDKs and Durable Task Scheduler (preview)"
description: Learn how to configure an existing app for the Durable Task Scheduler using the Durable Task SDKs.
ms.topic: how-to
ms.date: 05/06/2025
zone_pivot_groups: df-languages
ms.custom:
  - build-2025
---

# Quickstart: Create an app with Durable Task SDKs and Durable Task Scheduler (preview)

The Durable Task SDKs provide a lightweight client library for the Durable Task Scheduler. In this quickstart, you learn how to create orchestrations that use [the fan-out/fan-in application pattern](../durable-functions-overview.md#fan-in-out) to perform parallel processing. 

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

- Make sure you have [Python 3.9+](https://www.python.org/downloads/) or later.
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.
    
::: zone-end

::: zone pivot="java"

- Make sure you have [Java 8 or 11](https://www.java.com/en/download/).
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler) to use the quickstart sample.

::: zone-end

::: zone pivot="csharp,python,java"

## Set up the Durable Task Scheduler emulator

The application code looks for a deployed scheduler and task hub resource. If none is found, the code falls back to the emulator. The emulator simulates a scheduler and task hub in a Docker container, making it ideal for the local development required in this quickstart.

::: zone-end

::: zone pivot="csharp"

1. From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the .NET SDK sample directory. 
    
     ```bash
     cd samples/durable-task-sdks/dotnet/FanOutFanIn
     ```

1. Pull the Docker image for the emulator.
    
     ```bash
     docker pull mcr.microsoft.com/dts/dts-emulator:latest
     ```

1. Run the emulator. The container may take a few seconds to be ready.

     ```bash
     docker run --name dtsemulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
     ```

Since the example code automatically uses the default emulator settings, you don't need to set any environment variables. The default emulator settings for this quickstart are:
- Endpoint: `http://localhost:8080`
- Task hub: `default`

::: zone-end


::: zone pivot="python"

1. From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the Python SDK sample directory. 

     ```bash
     cd samples/durable-task-sdks/python/fan-out-fan-in
     ```

1. Pull the Docker image for the emulator.
    
     ```bash
     docker pull mcr.microsoft.com/dts/dts-emulator:latest
     ```

1. Run the emulator. The container may take a few seconds to be ready.
    
     ```bash
     docker run --name dtsemulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
     ```

Since the example code automatically uses the default emulator settings, you don't need to set any environment variables. The default emulator settings for this quickstart are:
- Endpoint: `http://localhost:8080`
- Task hub: `default`

::: zone-end

::: zone pivot="java"

1. From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the Java SDK sample directory. 

     ```bash
     cd samples/durable-task-sdks/java/fan-out-fan-in
     ```

1. Pull the Docker image for the emulator.
    
     ```bash
     docker pull mcr.microsoft.com/dts/dts-emulator:latest
     ```

1. Run the emulator. The container may take a few seconds to be ready.
    
     ```bash
     docker run --name dtsemulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
     ```

Since the example code automatically uses the default emulator settings, you don't need to set any environment variables. The default emulator settings for this quickstart are:
- Endpoint: `http://localhost:8080`
- Task hub: `default`

::: zone-end

::: zone pivot="csharp,python,java"

## Run the quickstart

::: zone-end

::: zone pivot="csharp"

1. From the `FanOutFanIn` directory, navigate to the `Worker` directory to build and run the worker. 
    
     ```bash
     cd Worker
     dotnet build
     dotnet run
     ```

1. In a separate terminal, from the `FanOutFanIn` directory, navigate to the `Client` directory to build and run the client.
     
     ```bash
     cd Client
     dotnet build
     dotnet run
     ```

### Understanding the output

When you run this sample, you receive output from both the worker and client processes. [Unpack what happened in the code when you ran the project.](#understanding-the-code-structure)

#### Worker output

The worker output shows:

- Registration of the orchestrator and activities
- Log entries when each activity is called
- Parallel processing of multiple work items
- Final aggregation of results

#### Client output

The client output shows: 

- The orchestration starting with a list of work items
- The unique orchestration instance ID
- The final aggregated results, showing each work item and its corresponding result
- Total count of processed items

#### Example output

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


1. Activate a Python virtual environment.

      # [Windows](#tab/windows)

      ```bash
      python -m venv venv
      /venv/Scripts/activate
      ```      

      # [Linux](#tab/linux)

      ```bash
      python -m venv venv
      source ./venv/bin/activate
      ```      

      ---

1. Install the required packages. 
     
     ```bash
     pip install -r requirements.txt
     ```

1. Start the worker. 
     
     ```bash
     python worker.py
     ```

     **Expected output**

     You can see output indicating that the worker started and is waiting for work items.

     ```
     Starting Fan Out/Fan In pattern worker...
     Using taskhub: default
     Using endpoint: http://localhost:8080
     Starting gRPC worker that connects to http://localhost:8080
     Successfully connected to http://localhost:8080. Waiting for work items...
     ```
     
1. In a new terminal, activate the virtual environment and run the client.

      # [Windows](#tab/windows)

      ```bash
      venv/Scripts/activate
      python client.py
      ```      

      # [Linux](#tab/linux)

      ```bash
      source ./venv/bin/activate
      python client.py
      ```      

      ---

     You can provide the number of work items as an argument. If no argument is provided, the example runs 10 items by default.

     ```bash
     python client.py [number_of_items]
     ```

### Understanding the output

When you run this sample, you receive output from both the worker and client processes. [Unpack what happened in the code when you ran the project.](#understanding-the-code-structure)

#### Worker output

The worker output shows:

- Registration of the orchestrator and activities.
- Status messages when processing each work item in parallel, showing that they're executing concurrently.
- Random delays for each work item (between 0.5 and 2 seconds) to simulate varying processing times.
- A final message showing the aggregation of results.

#### Client output

The client output shows: 

- The orchestration starting with the specified number of work items.
- The unique orchestration instance ID.
- The final aggregated result, which includes:
   - The total number of items processed
   - The sum of all results (each item result is the square of its value)
   - The average of all results

#### Example output

```
Starting fan out/fan in orchestration with 10 items
Waiting for 10 parallel tasks to complete
Orchestrator yielded with 10 task(s) and 0 event(s) outstanding.
Processing work item: 1
Processing work item: 2
Processing work item: 10
Processing work item: 9
Processing work item: 8
Processing work item: 7
Processing work item: 6
Processing work item: 5
Processing work item: 4
Processing work item: 3
Orchestrator yielded with 9 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 8 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 7 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 6 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 5 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 4 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 3 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 2 task(s) and 0 event(s) outstanding.
Orchestrator yielded with 1 task(s) and 0 event(s) outstanding.
All parallel tasks completed, aggregating results
Orchestrator yielded with 1 task(s) and 0 event(s) outstanding.
Aggregating results from 10 items
Orchestration completed with status: COMPLETED
```

::: zone-end

::: zone pivot="java"

From the `fan-out-fan-in` directory, build and run the application using Gradle.

```bash
./gradlew runFanOutFanInPattern
```

> [!TIP]
> If you receive the error message `zsh: permission denied: ./gradlew`, try running `chmod +x gradlew` before running the application. 

### Understanding the output

When you run this sample, you receive output that shows: 

- Registration of the orchestrator and activities.
- Status messages when processing each work item in parallel, showing that they're executing concurrently.
- Random delays for each work item (between 0.5 and 2 seconds) to simulate varying processing times.
- A final message showing the aggregation of results.

[Unpack what happened in the code when you ran the project.](#understanding-the-code-structure)

#### Example output

```
Starting a Gradle Daemon (subsequent builds will be faster)

> Task :runFanOutFanInPattern
Durable Task worker is connecting to sidecar at localhost:8080.
Started new orchestration instance
Orchestration completed: [Name: 'FanOutFanIn_WordCount', ID: '<id-number>', RuntimeStatus: COMPLETED, CreatedAt: 2025-04-25T15:24:47.170Z, LastUpdatedAt: 2025-04-25T15:24:47.287Z, Input: '["Hello, world!","The quick brown fox jumps over t...', Output: '60']
Output: 60
```

::: zone-end

::: zone pivot="csharp,python,java"

Now that you ran the project locally, you can now learn how to [deploy to Azure hosted in Azure Container Apps](#next-steps). 

## View orchestration status and history

You can view the orchestration status and history via the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). By default, the dashboard runs on port 8082. 

1. Navigate to http://localhost:8082 in your web browser.
1. Click the **default** task hub. The orchestration instance you created is in the list.
1. Click the orchestration instance ID to view the execution details, which include:
   - The parallel execution of multiple activity tasks
   - The fan-in aggregation step
   - The input and output at each step
   - The time taken for each step

::: zone-end

::: zone pivot="csharp"

:::image type="content" source="./media/quickstart-portable-durable-task-sdks/review-dashboard-dotnet.png" alt-text="Screenshot showing the orchestration instance's details for the .NET sample.":::

::: zone-end

::: zone pivot="python"

:::image type="content" source="./media/quickstart-portable-durable-task-sdks/review-dashboard-python.png" alt-text="Screenshot showing the orchestration instance's details for the Python sample.":::

::: zone-end

::: zone pivot="java"

:::image type="content" source="./media/quickstart-portable-durable-task-sdks/review-dashboard-java.png" alt-text="Screenshot showing the orchestration instance's details for the Java sample.":::

::: zone-end

::: zone pivot="csharp,python,java"

## Understanding the code structure

::: zone-end

::: zone pivot="csharp"

### The worker project

To demonstrate [the fan-out/fan-in pattern](../durable-functions-overview.md#fan-in-out), the worker project orchestration creates parallel activity tasks and waits for all to complete. The orchestrator:

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

### `worker.py`

To demonstrate [the fan-out/fan-in pattern](../durable-functions-overview.md#fan-in-out), the worker project orchestration creates parallel activity tasks and waits for all to complete. The orchestrator:

1. Receives a list of work items as input.
1. It "fans out" by creating parallel tasks for each work item (calling `process_work_item` for each one).
1. It waits for all tasks to complete using `task.when_all`.
1. It then "fans in" by aggregating the results with the `aggregate_results` activity.
1. The final aggregated result is returned to the client.

Using fan-out/fan-in, the orchestration creates parallel activity tasks and waits for all to complete. 

```csharp
# Orchestrator function
def fan_out_fan_in_orchestrator(ctx, work_items: list) -> dict:
    logger.info(f"Starting fan out/fan in orchestration with {len(work_items)} items")
    
    # Fan out: Create a task for each work item
    parallel_tasks = []
    for item in work_items:
        parallel_tasks.append(ctx.call_activity("process_work_item", input=item))
    
    # Wait for all tasks to complete
    logger.info(f"Waiting for {len(parallel_tasks)} parallel tasks to complete")
    results = yield task.when_all(parallel_tasks)
    
    # Fan in: Aggregate all the results
    logger.info("All parallel tasks completed, aggregating results")
    final_result = yield ctx.call_activity("aggregate_results", input=results)
    
    return final_result
```

### `client.py`

The client project:

- Uses the same connection string logic as the worker.
- Creates a list of work items to be processed in parallel.
- Schedules an orchestration instance with the list as input.
- Waits for the orchestration to complete and displays the aggregated results.
- Uses `wait_for_orchestration_completion` for efficient polling.

```python
# Generate work items (default 10 items if not specified)
count = int(sys.argv[1]) if len(sys.argv) > 1 else 10
work_items = list(range(1, count + 1))

logger.info(f"Starting new fan out/fan in orchestration with {count} work items")

# Schedule a new orchestration instance
instance_id = client.schedule_new_orchestration(
    "fan_out_fan_in_orchestrator", 
    input=work_items
)
    
logger.info(f"Started orchestration with ID = {instance_id}")
    
# Wait for orchestration to complete
logger.info("Waiting for orchestration to complete...")
result = client.wait_for_orchestration_completion(
    instance_id,
    timeout=60
)
```
    
::: zone-end

::: zone pivot="java"

To demonstrate [the fan-out/fan-in pattern](../durable-functions-overview.md#fan-in-out), the `FanOutFanInPattern` project orchestration creates parallel activity tasks and waits for all to complete. The orchestrator:

1. Takes a list of work items as input.
1. Fans out by creating a separate task for each work item using ``.
1. Executes all tasks in parallel.
1. Waits for all tasks to complete using ``.
1. Fans in by aggregating all individual results using ``.
1. Returns the final aggregated result to the client.

The project contains:

- **`DurableTaskSchedulerWorkerExtensions` worker**: Defines the orchestrator and activity functions.
- **`DurableTaskSchedulerClientExtension` client**: Sets up the worker host with proper connection string handling.

### Worker

Using fan-out/fan-in, the orchestration creates parallel activity tasks and waits for all to complete. 

```java
DurableTaskGrpcWorker worker = DurableTaskSchedulerWorkerExtensions.createWorkerBuilder(connectionString)
    .addOrchestration(new TaskOrchestrationFactory() {
        @Override
        public String getName() { return "FanOutFanIn_WordCount"; }

        @Override
        public TaskOrchestration create() {
            return ctx -> {
                List<?> inputs = ctx.getInput(List.class);
                List<Task<Integer>> tasks = inputs.stream()
                        .map(input -> ctx.callActivity("CountWords", input.toString(), Integer.class))
                        .collect(Collectors.toList());
                List<Integer> allWordCountResults = ctx.allOf(tasks).await();
                int totalWordCount = allWordCountResults.stream().mapToInt(Integer::intValue).sum();
                ctx.complete(totalWordCount);
            };
        }
    })
    .addActivity(new TaskActivityFactory() {
        @Override
        public String getName() { return "CountWords"; }

        @Override
        public TaskActivity create() {
            return ctx -> {
                String input = ctx.getInput(String.class);
                StringTokenizer tokenizer = new StringTokenizer(input);
                return tokenizer.countTokens();
            };
        }
    })
    .build();

// Start the worker
worker.start();
```

### Client

The client project:

- Uses the same connection string logic as the worker.
- Creates a list of work items to be processed in parallel.
- Schedules an orchestration instance with the list as input.
- Waits for the orchestration to complete and displays the aggregated results.
- Uses `waitForInstanceCompletion` for efficient polling.

```java
DurableTaskClient client = DurableTaskSchedulerClientExtensions.createClientBuilder(connectionString).build();

// The input is an arbitrary list of strings.
List<String> listOfStrings = Arrays.asList(
        "Hello, world!",
        "The quick brown fox jumps over the lazy dog.",
        "If a tree falls in the forest and there is no one there to hear it, does it make a sound?",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "Always remember that you are absolutely unique. Just like everyone else.");

// Schedule an orchestration which will reliably count the number of words in all the given sentences.
String instanceId = client.scheduleNewOrchestrationInstance(
        "FanOutFanIn_WordCount",
        new NewOrchestrationInstanceOptions().setInput(listOfStrings));
logger.info("Started new orchestration instance: {}", instanceId);

// Block until the orchestration completes. Then print the final status, which includes the output.
OrchestrationMetadata completedInstance = client.waitForInstanceCompletion(
        instanceId,
        Duration.ofSeconds(30),
        true);
logger.info("Orchestration completed: {}", completedInstance);
logger.info("Output: {}", completedInstance.readOutputAs(int.class));
```

::: zone-end

## Next steps

Now that you've run the sample locally using the Durable Task Scheduler emulator, try creating a scheduler and task hub resource and deploying to Azure Container Apps.

> [!div class="nextstepaction"]
> [Deploy Durable Task Scheduler hosted on Azure Container Apps to Azure](./quickstart-container-apps-durable-task-sdk.md)
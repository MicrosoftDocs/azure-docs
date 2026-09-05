---
title: "Quickstart: Work Item Filtering With the Durable Task SDKs"
description: Use work item filtering with the Durable Task SDKs to route orchestrations to dedicated workers. Deploy to Azure Container Apps.
ms.subservice: durable-task-scheduler
ms.author: hannahhunter
author: hhunter-ms
ms.service: durable-task
ms.topic: quickstart
ms.date: 09/01/2026
ai-usage: ai-assisted
zone_pivot_groups: df-languages
---

# Quickstart: Use work item filtering with the Durable Task SDKs

In this quickstart, you learn how to run a Durable Task SDK sample that uses work item filtering to route orchestrations and activities to dedicated workers.

Work item filtering is currently available in the .NET, Java, and Python Durable Task SDKs. Select your language by using the tabs at the top of the page. To learn how work item filtering works and how it enables flat networking across heterogeneous compute, see [Work item filtering in the Durable Task Scheduler](./work-item-filtering.md).

::: zone pivot="javascript,powershell"

> [!NOTE]
> Work item filtering isn't available yet for the JavaScript and PowerShell Durable Task SDKs. To try this feature today, select the **C#**, **Java**, or **Python** tab at the top of the page.

::: zone-end

::: zone pivot="csharp"

> [!div class="checklist"]
>
> - Set up and run the Durable Task Scheduler emulator for local development.
> - Run the Orchestrator, Validator, and Shipper workers and the client.
> - Verify that work items are routed only to matching workers.
> - Deploy the sample to Azure Container Apps using Azure Developer CLI.

## Prerequisites

Before you begin:

- Install [.NET 10 SDK](https://dotnet.microsoft.com/download) or later.
- Install [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- Install [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler).

## Prepare the project

From the `Azure-Samples/Durable-Task-Scheduler` root directory, navigate to the sample directory:

```bash
cd samples/scenarios/WorkItemFilteringSplitActivities
```

## Run locally with the emulator

1. Pull the emulator image:

   ```bash
   docker pull mcr.microsoft.com/durable-task/emulator:latest
   ```

1. Run the emulator:

   ```bash
   docker run -d --name dts-emulator -p 8080:8080 -p 8082:8082 mcr.microsoft.com/durable-task/emulator:latest
   ```

1. Build the sample:

   ```bash
   dotnet build
   ```

1. Run each worker in a separate terminal:

   **Terminal 1 - Orchestrator worker**

   ```bash
   dotnet run --project src/OrchestratorWorker
   ```

   **Terminal 2 - Validator worker**

   ```bash
   dotnet run --project src/ValidatorWorker
   ```

   **Terminal 3 - Shipper worker**

   ```bash
   dotnet run --project src/ShipperWorker
   ```

1. In a fourth terminal, run the client:

   ```bash
   dotnet run --project src/Client
   ```

1. Open the emulator dashboard at `http://localhost:8082` to monitor orchestration activity.

> [!TIP]
> As an alternative to opening four terminals manually, you can run the included convenience script:
>
> ```bash
> ./run-local.sh
> ```
>
> It starts the emulator, builds the solution, and launches all workers and the client.

### Expected output from work item filtering

The client schedules a batch of three orchestrations every 30 seconds and keeps looping for about 10 minutes. Across the terminals, you see:

- The client schedules orchestration batches and waits for each batch to complete. A finished batch logs `3 completed, 0 failed`.
- The Orchestrator worker dispatches `ValidateOrder` and `ShipOrder` activity calls.
- The Validator worker handles only `ValidateOrder` activity work items.
- The Shipper worker handles only `ShipOrder` activity work items.

This behavior confirms that work item filtering routes items only to workers that registered matching task types.

When you see at least one batch report `3 completed, 0 failed`, the sample is working as expected. You don't have to wait for the full loop to finish - press Ctrl+C in each terminal to stop the client and workers. If you let the client run to the end, it prints a final results summary and then stays alive until you stop it with Ctrl+C.

### Try it: Strict routing experiment

To see that routing is strict (no fallback to other workers):

1. Stop the Shipper worker (Ctrl+C in Terminal 3).
1. Run the client again to schedule new orchestrations.
1. Observe that:
   - The Orchestrator worker picks up and starts orchestrations.
   - The Validator worker completes `ValidateOrder` for each order.
   - `ShipOrder` work items remain **pending** - the Validator and Orchestrator workers don't receive them.
   - The orchestrations stay in "Running" status, waiting for `ShipOrder` to complete.
1. Restart the Shipper worker - the pending `ShipOrder` work items are delivered immediately and the orchestrations complete.

This experiment demonstrates that work items are routed only to workers with matching filters. There's no fallback.

## Deploy using Azure Developer CLI

1. Authenticate with Azure (if you haven't already):

   ```azdeveloper
   azd auth login
   ```

1. From `samples/scenarios/WorkItemFilteringSplitActivities`, run:

   ```azdeveloper
   azd up
   ```

1. When prompted in the terminal, provide the following parameters:

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

The `azd up` command provisions Azure resources and deploys four containerized services from this sample: client, orchestrator worker, validator worker, and shipper worker.

## Confirm successful deployment

1. In the `azd up` output, copy the resource group name.
1. In the [Azure portal](https://portal.azure.com), open that resource group.
1. For each deployed container app (`client`, `orchestrator-worker`, `validator-worker`, `shipper-worker`), open **Monitoring** > **Log stream**.
1. Verify each app logs only its expected work items:

   - `orchestrator-worker`: orchestration work.
   - `validator-worker`: `ValidateOrder` activity.
   - `shipper-worker`: `ShipOrder` activity.

> [!NOTE]
> Each Container App is configured with a KEDA scale rule (`azure-durabletask-scheduler`) that automatically scales workers from 0 to 10 replicas based on the pending work item backlog. When the client finishes its loop and no work items remain, workers scale back to zero. For more information, see [Durable Task Scheduler autoscale on Azure Container Apps](../sdks/durable-task-scheduler-auto-scaling.md).

## Understand the work item filtering code in C#

The orchestration calls two activities in sequence. The scheduler routes each activity work item to the worker that registered it.

```csharp
public override async Task<string> RunAsync(TaskOrchestrationContext context, string orderId)
{
    string validationResult = await context.CallActivityAsync<string>("ValidateOrder", orderId);
    string shippingResult = await context.CallActivityAsync<string>("ShipOrder", orderId);

    return $"Order '{orderId}' => Validation: [{validationResult}], Shipping: [{shippingResult}]";
}
```

Each worker registers only its local tasks. The SDK automatically generates work item filters from the task registry, so you don't need to explicitly opt in.

```csharp
builder.Services.AddDurableTaskWorker()
    .AddTasks(registry =>
    {
        // Only this worker's tasks are registered.
        // Work item filters are auto-generated from the registry, so this
        // worker only receives matching work items.
        registry.AddAllGeneratedTasks();
    })
    .UseDurableTaskScheduler(connectionString);
```

> [!NOTE]
> In the .NET Durable Task SDK, work item filters are generated automatically from whatever each worker registers. To override the generated filters or opt out of filtering, call `UseWorkItemFilters(customFilters)` or `UseWorkItemFilters(null)`, respectively.

For example:

- `OrchestratorWorker` registers `OrderProcessingOrchestration`.
- `ValidatorWorker` registers `ValidateOrder`.
- `ShipperWorker` registers `ShipOrder`.

When a worker connects to Durable Task Scheduler, the SDK sends its filter list. The scheduler creates per-filter queues and routes each work item to the matching queue. Workers never receive work item types they didn't register.

## Clean up resources

1. Stop the local emulator container.

   ```bash
   docker rm -f dts-emulator
   ```

1. If you deployed to Azure, identify the resource group name:

   - Copy it from the `azd up` output.
   - Or in the [Azure portal](https://portal.azure.com), use the global search box at the top and search for `rg-` or your environment name prefix.

1. Open the resource group from the search results.

1. Select **Delete resource group**, enter the resource group name to confirm, and then select **Delete**.

## Next steps

- Learn more about [Durable Task Scheduler autoscale on Azure Container Apps](../sdks/durable-task-scheduler-auto-scaling.md).
- Review [troubleshooting guidance](./troubleshoot-durable-task-scheduler.md).

::: zone-end

::: zone pivot="java"

> [!div class="checklist"]
>
> - Set up and run the Durable Task Scheduler emulator for local development.
> - Run the Orchestrator, Validator, and Shipper workers and the client.
> - Verify that work items are routed only to matching workers.
> - Deploy the sample to Azure Container Apps using Azure Developer CLI.

## Prerequisites

Before you begin:

- [Java 21](https://adoptium.net/) or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler).

## Prepare the project

From the `Azure-Samples/Durable-Task-Scheduler` root directory, go to the sample directory:

```bash
cd samples/scenarios/WorkItemFilteringSplitActivitiesJava
```

## Run locally with the emulator

1. Pull the emulator image.

   ```bash
   docker pull mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. Run the emulator.

   ```bash
   docker run -d --name dts-emulator -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. Build the sample.

   ```bash
   ./gradlew build
   ```

1. Run each worker in a separate terminal:

   **Terminal 1 - Orchestrator worker**

   ```bash
   ./gradlew :orchestrator-worker:run
   ```

   **Terminal 2 - Validator worker**

   ```bash
   ./gradlew :validator-worker:run
   ```

   **Terminal 3 - Shipper worker**

   ```bash
   ./gradlew :shipper-worker:run
   ```

1. In a fourth terminal, run the client.

   ```bash
   ./gradlew :client:run
   ```

1. Open the emulator dashboard at `http://localhost:8082` to monitor orchestration activity.

### Expected output from work item filtering

The client schedules a batch of three orchestrations every 30 seconds and keeps looping for about 10 minutes. Across the terminals, you see:

- The client schedules orchestration batches and waits for each batch to complete. A finished batch logs `3 completed, 0 failed`.
- The Orchestrator worker dispatches `ValidateOrder` and `ShipOrder` activity calls.
- The Validator worker handles only `ValidateOrder` activity work items.
- The Shipper worker handles only `ShipOrder` activity work items.

This behavior confirms that work item filtering routes items only to workers that registered matching task types.

When you see at least one batch report `3 completed, 0 failed`, the sample is working as expected. You don't have to wait for the full loop to finish - press Ctrl+C in each terminal to stop the client and workers. If you let the client run to the end, it prints a final results summary and then stays alive until you stop it with Ctrl+C.

### Try it: Strict routing experiment

To see that routing is strict (no fallback to other workers):

1. Stop the Shipper worker (Ctrl+C in Terminal 3).
1. Run the client again to schedule new orchestrations.
1. Observe that:
   - The Orchestrator worker picks up and starts orchestrations.
   - The Validator worker completes `ValidateOrder` for each order.
   - `ShipOrder` work items remain **pending** - the Validator and Orchestrator workers don't receive them.
   - The orchestrations stay in "Running" status, waiting for `ShipOrder` to complete.
1. Restart the Shipper worker - the pending `ShipOrder` work items are delivered immediately and the orchestrations complete.

This experiment demonstrates that work items are routed only to workers with matching filters. There's no fallback.

## Deploy using Azure Developer CLI

1. Authenticate with Azure (if you haven't already):

   ```azdeveloper
   azd auth login
   ```

1. From `samples/scenarios/WorkItemFilteringSplitActivitiesJava`, run:

   ```azdeveloper
   azd up
   ```

1. When prompted in the terminal, provide the following parameters:

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

The `azd up` command provisions Azure resources and deploys four containerized services from this sample: client, orchestrator worker, validator worker, and shipper worker.

## Confirm successful deployment

1. In the `azd up` output, copy the resource group name.
1. In the [Azure portal](https://portal.azure.com), open that resource group.
1. For each deployed container app (`client`, `orchestrator-worker`, `validator-worker`, `shipper-worker`), open **Monitoring** > **Log stream**.
1. Verify each app logs only its expected work items:

   - `orchestrator-worker`: orchestration work.
   - `validator-worker`: `ValidateOrder` activity.
   - `shipper-worker`: `ShipOrder` activity.

> [!NOTE]
> Each Container App is configured with a KEDA scale rule (`azure-durabletask-scheduler`) that automatically scales workers from 0 to 10 replicas based on the pending work item backlog. When the client finishes its loop and no work items remain, workers scale back to zero. For more information, see [Durable Task Scheduler autoscale on Azure Container Apps](../sdks/durable-task-scheduler-auto-scaling.md).

## Understand the work item filtering code in Java

The orchestration calls two activities in sequence. The scheduler routes each activity work item to the worker that registered it.

```java
String validationResult = ctx.callActivity("ValidateOrder", orderId, String.class).await();
String shippingResult = ctx.callActivity("ShipOrder", orderId, String.class).await();

String combined = String.format("Order '%s' => Validation: [%s], Shipping: [%s]",
        orderId, validationResult, shippingResult);
ctx.complete(combined);
```

Each worker registers only its local tasks and calls `useWorkItemFilters()` to opt in to filtering. The SDK then generates work item filters from the task registry.

```java
DurableTaskGrpcWorker worker = DurableTaskSchedulerWorkerExtensions
        .createWorkerBuilder(connectionString)
        .addActivity(new TaskActivityFactory() {
            // ...
        })
        .useWorkItemFilters() // auto-generate from registered tasks
        .build();
```

> [!NOTE]
> Each worker must explicitly call `useWorkItemFilters()` to enable filtering. Workers that don't call it receive all work item types.

For example:

- `OrchestratorWorker` registers `OrderProcessingOrchestration`.
- `ValidatorWorker` registers `ValidateOrder`.
- `ShipperWorker` registers `ShipOrder`.

When a worker connects to Durable Task Scheduler, the SDK sends its filter list. The scheduler creates per-filter queues and routes each work item to the matching queue. Workers never receive work item types they didn't register.

To supply explicit filters instead of auto-generating them from the registry, pass a `WorkItemFilter` to `useWorkItemFilters()`:

```java
WorkItemFilter filter = WorkItemFilter.newBuilder()
        .addOrchestration("OrderProcessingOrchestration")
        .addActivity("ValidateOrder")
        .build();

builder.useWorkItemFilters(filter);
```

## Clean up resources

1. Stop the local emulator container.

   ```bash
   docker rm -f dts-emulator
   ```

1. If you deployed to Azure, identify the resource group name:

   - Copy it from the `azd up` output.
   - Or in the [Azure portal](https://portal.azure.com), use the global search box at the top and search for `rg-` or your environment name prefix.

1. Open the resource group from the search results.

1. Select **Delete resource group**, enter the resource group name to confirm, and then select **Delete**.

## Next steps

- Learn more about [Durable Task Scheduler autoscale on Azure Container Apps](../sdks/durable-task-scheduler-auto-scaling.md).
- Review [troubleshooting guidance](./troubleshoot-durable-task-scheduler.md).

::: zone-end

::: zone pivot="python"

> [!div class="checklist"]
>
> - Set up and run the Durable Task Scheduler emulator for local development.
> - Run Worker A, Worker B, and the client.
> - Verify that work items are routed only to matching workers.

## Prerequisites

Before you begin:

- [Python 3.10](https://www.python.org/downloads/) or later.
- [Docker](https://www.docker.com/products/docker-desktop/) for running the emulator.
- [Azure CLI](/cli/azure/install-azure-cli) if you use a deployed Durable Task Scheduler.
- Clone the [Durable Task Scheduler GitHub repository](https://github.com/Azure-Samples/Durable-Task-Scheduler).

## Prepare the project

From the `Azure-Samples/Durable-Task-Scheduler` root directory, go to the sample directory:

```bash
cd samples/durable-task-sdks/python/work-item-filtering
```

## Run locally with the emulator

1. Pull the emulator image.

   ```bash
   docker pull mcr.microsoft.com/dts/dts-emulator:latest
   ```

1. Run the emulator.

   ```bash
   docker run -d --name dts-emulator -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
   ```

   The sample uses the default emulator settings (endpoint `http://localhost:8080` and task hub `default`), so you don't need to set any environment variables.

1. (Optional) Create and activate a Python virtual environment.

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

1. Install the required packages.

   ```bash
   pip install -r requirements.txt
   ```

1. Run each worker in a separate terminal:

   **Terminal 1 - Worker A (greeting)**

   ```bash
   python worker_a.py
   ```

   **Terminal 2 - Worker B (math)**

   ```bash
   python worker_b.py
   ```

1. In a third terminal, run the client.

   ```bash
   python client.py
   ```

1. Open the emulator dashboard at `http://localhost:8082` to monitor orchestration activity.

### Expected output from work item filtering

The client schedules a greeting orchestration and a math orchestration, and then waits for both to complete. Across the terminals, you see:

- Worker A processes only the greeting orchestration and its `say_hello` activity.
- Worker B processes only the math orchestration and its `add_numbers` activity.
- The client prints the result from each orchestration.

This behavior confirms that work item filtering routes items only to workers that registered matching task types.

## Understand the work item filtering code in Python

Each worker registers only its local tasks and calls `use_work_item_filters()` to opt in to filtering. The SDK generates the work item filters from the registered tasks.

```python
worker.add_orchestrator(greeting_orchestrator)
worker.add_activity(say_hello)
worker.use_work_item_filters()  # Auto-generate from the registry
```

> [!NOTE]
> Each worker must explicitly call `use_work_item_filters()` to enable filtering. Workers that don't call it receive all work item types.

For example:

- Worker A registers `greeting_orchestrator` and `say_hello`.
- Worker B registers `math_orchestrator` and `add_numbers`.

When a worker connects to Durable Task Scheduler, the SDK sends its filter list. The scheduler creates per-filter queues and routes each work item to the matching queue. Workers never receive work item types they didn't register.

To supply explicit filters instead of auto-generating them from the registry, pass `WorkItemFilters`:

```python
from durabletask.worker import WorkItemFilters, OrchestrationWorkItemFilter, ActivityWorkItemFilter

worker.use_work_item_filters(WorkItemFilters(
    orchestrations=[
        OrchestrationWorkItemFilter(name="greeting_orchestrator"),
    ],
    activities=[
        ActivityWorkItemFilter(name="say_hello"),
    ],
))
```

## Clean up resources

Stop the local emulator container.

```bash
docker rm -f dts-emulator
```

## Next steps

- Learn more about [Durable Task Scheduler autoscale on Azure Container Apps](../sdks/durable-task-scheduler-auto-scaling.md).
- Review [troubleshooting guidance](./troubleshoot-durable-task-scheduler.md).

::: zone-end

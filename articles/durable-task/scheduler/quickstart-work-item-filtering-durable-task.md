---
title: "Quickstart: Work Item Filtering With .NET Durable Task SDK"
description: Learn how to use work item filtering with the .NET Durable Task SDK to route orchestrations to dedicated workers. Deploy the sample to Azure Container Apps with Azure Developer CLI.
ms.subservice: durable-task-scheduler
ms.author: hannahhunter
author: hhunter-ms
ms.service: durable-task
ms.topic: quickstart
ms.date: 05/04/2026
ms.custom:
  - build-2025
---

# Quickstart: Use work item filtering with the .NET Durable Task SDK

In this quickstart, you learn how to run a .NET Durable Task SDK sample that uses work item filtering to route orchestrations and activities to dedicated workers.

Without work item filtering, Durable Task Scheduler delivers all work items to every connected worker — regardless of what each worker actually implements. This causes errors or silent hangs in multi-service deployments and rolling upgrades. With work item filtering, each worker declares the orchestrations and activities it hosts, and the scheduler routes work items only to matching workers.

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

You should see:

- The client scheduling orchestration batches and waiting for completion.
- The Orchestrator worker dispatching `ValidateOrder` and `ShipOrder` activity calls.
- The Validator worker handling only `ValidateOrder` activity work items.
- The Shipper worker handling only `ShipOrder` activity work items.

This behavior confirms that work item filtering routes items only to workers that registered matching task types.

### Try it: Strict routing experiment

To see that routing is strict (no fallback to other workers):

1. Stop the Shipper worker (Ctrl+C in Terminal 3).
1. Run the client again to schedule new orchestrations.
1. Observe that:
   - The Orchestrator worker picks up and starts orchestrations.
   - The Validator worker completes `ValidateOrder` for each order.
   - `ShipOrder` work items remain **pending** — they aren't delivered to the Validator or Orchestrator worker.
   - The orchestrations stay in "Running" status, waiting for `ShipOrder` to complete.
1. Restart the Shipper worker — the pending `ShipOrder` work items are delivered immediately and the orchestrations complete.

This demonstrates that work items are routed only to workers with matching filters. There is no fallback.

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

## Understand the work item filtering code

The orchestration calls two activities in sequence. The scheduler routes each activity work item to the worker that registered it.

```csharp
public override async Task<string> RunAsync(TaskOrchestrationContext context, string orderId)
{
    string validationResult = await context.CallActivityAsync<string>("ValidateOrder", orderId);
    string shippingResult = await context.CallActivityAsync<string>("ShipOrder", orderId);

    return $"Order '{orderId}' => Validation: [{validationResult}], Shipping: [{shippingResult}]";
}
```

Each worker registers only its local tasks and calls `UseWorkItemFilters()` to opt in to filtering. The SDK then generates work item filters from the task registry.

```csharp
builder.Services.AddDurableTaskWorker()
    .AddTasks(registry =>
    {
        registry.AddAllGeneratedTasks();
    })
    .UseWorkItemFilters()
    .UseDurableTaskScheduler(connectionString);
```

> [!NOTE]
> Starting in version 1.23.0 of the .NET Durable Task SDK, work item filters are no longer enabled by default. You must explicitly call `UseWorkItemFilters()` on each worker to enable filtering. Workers that don't call it receive all work item types as before.

For example:

- `OrchestratorWorker` registers `OrderProcessingOrchestration`.
- `ValidatorWorker` registers `ValidateOrder`.
- `ShipperWorker` registers `ShipOrder`.

When a worker connects to Durable Task Scheduler, the SDK sends its filter list. The scheduler creates per-filter queues and routes each work item to the matching queue. Workers never receive work item types they didn't register.

## Clean up resources

1. Stop the local emulator container:

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

---
title: "Quickstart: Host a .NET Durable Task SDK App on AKS"
description: Deploy a .NET Durable Task SDK app with Durable Task Scheduler to Azure Kubernetes Service (AKS) using Azure Developer CLI. Follow this quickstart to get started.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.service: durable-task
ms.subservice: durable-task-sdks
ms.topic: quickstart
ms.date: 05/05/2026
---

# Quickstart: Host a .NET Durable Task SDK app on Azure Kubernetes Service

In this quickstart, you deploy an existing .NET Durable Task SDK sample to Azure Kubernetes Service (AKS), with Durable Task Scheduler as the orchestration backend. Deployment uses [Azure Developer CLI (`azd`)](/azure/developer/azure-developer-cli/install-azd) and the [document processing sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/scenarios/DocumentProcessingOnAKS).

You learn how to:

> [!div class="checklist"]
>
> - Set up and run the Durable Task Scheduler emulator locally.
> - Run the .NET client and worker projects in the AKS scenario sample.
> - Deploy the sample infrastructure and apps to AKS with `azd up`.
> - Verify orchestration execution in AKS by reviewing pod logs.

## Prerequisites

Before you begin:

- Install:
  - [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0).
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/).
  - [Azure CLI](/cli/azure/install-azure-cli) and [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
  - [kubectl](https://kubernetes.io/docs/tasks/tools/).
- Clone the [Durable Task Scheduler sample repository](https://github.com/Azure-Samples/Durable-Task-Scheduler).
- Sign in to Azure and the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd):

  ```bash
  az login
  azd auth login
  ```

## Prepare and run the Durable Task sample locally

1. From the repository root, go to the AKS scenario sample:

   ```bash
   cd samples/scenarios/DocumentProcessingOnAKS
   ```

1. Start the Durable Task Scheduler emulator:

   ```bash
   docker run --name dts-emulator -d -p 8080:8080 -p 8082:8082 mcr.microsoft.com/dts/dts-emulator:latest
   ```

   The emulator exposes:
   - `8080` for gRPC app connectivity.
   - `8082` for the scheduler dashboard.

1. Build the solution:

   ```bash
   dotnet build DurableTaskOnAKS.sln
   ```

1. In one terminal, run the worker:

   ```bash
   cd Worker
   dotnet run
   ```

1. In a second terminal, run the client:

   ```bash
   cd Client
   dotnet run
   ```

1. Confirm output similar to the following in the client terminal:

   ```output
   Endpoint: http://localhost:8080 | TaskHub: default
   Submitting 3 documents...

     Scheduled [...] 'Cloud Migration Strategy'
     -> Processed 'Cloud Migration Strategy': Sentiment=Positive, Topic=Technology, Priority=Normal

     Scheduled [...] 'Quarterly Incident Report'
     -> Processed 'Quarterly Incident Report': Sentiment=Positive, Topic=Technology, Priority=Normal

     Scheduled [...] 'ML Model Evaluation'
     -> Processed 'ML Model Evaluation': Sentiment=Positive, Topic=Technology, Priority=Normal

   Done.
   ```

1. (Optional) View orchestration details in [the Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md) at `http://localhost:8082`. Click the **default** task hub, then click the orchestration instance ID to see execution history.

    :::image type="content" source="../scheduler/media/quickstart-aks-durable-task-scheduler/orchestration-instance.png" alt-text="Screenshot of the Durable Task Scheduler dashboard showing orchestration instance execution details.":::

## Deploy to AKS with Azure Developer CLI

`azd up` provisions and deploys the following Azure resources:

| Resource | Purpose |
| --- | --- |
| AKS cluster | Hosts the client (1 replica) and worker (2 replicas) pods. |
| Azure Container Registry (ACR) | Stores Docker images built server-side via ACR Tasks. |
| Durable Task Scheduler (Consumption SKU) | Managed orchestration backend for state and execution. |
| VNet | Network isolation for AKS. |
| User-assigned managed identity + federated credentials | Workload Identity auth from pods to Durable Task Scheduler. |

1. From `samples/scenarios/DocumentProcessingOnAKS`, run:

   ```azdeveloper
   azd up
   ```

1. When prompted, provide:

   | Parameter | Description |
   | --- | --- |
   | Environment Name | Prefix used for your deployment resources. |
   | Azure Subscription | Azure subscription for deployment. |
   | Azure Location | Azure region for the resources. |

   Provisioning takes approximately 5-10 minutes.

## Verify the AKS deployment with kubectl

1. Get your resource group and cluster names from the `azd` environment:

   ```bash
   azd env get-values | grep -E "RESOURCE_GROUP|AKS_NAME"
   ```

1. Get AKS credentials:

   ```bash
   az aks get-credentials --resource-group <resource-group-name> --name <aks-cluster-name>
   ```

1. Confirm pods are running:

   ```bash
   kubectl get pods
   ```

1. Check client logs:

   ```bash
   kubectl logs -l app=client --tail=30
   ```

1. Check worker logs:

   ```bash
   kubectl logs -l app=worker --tail=30
   ```

When deployment is working, the client logs show scheduled orchestrations and completed document-processing results.

### Verify using the Durable Task Scheduler dashboard

You can also verify orchestration status using the [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md) in the Azure portal:

1. Open the [Azure portal](https://portal.azure.com) and navigate to your Durable Task Scheduler resource.
1. Select the task hub, then select **Open Dashboard**.
1. Find your orchestration instances and click an instance ID to view execution details, including the parallel classification activities.


## Understand the code

The sample implements a document-processing pipeline with two [Durable Task patterns](../common/durable-task-fan-in-fan-out.md):

1. **Activity chaining** — `ValidateDocument` must pass before classification begins.
1. **Fan-out/fan-in** — Three `ClassifyDocument` activities run in parallel (Sentiment, Topic, Priority), and the orchestration awaits all three before assembling the final result.

```
Client ──▶ DocumentProcessingOrchestration
               │
               ├─ 1. ValidateDocument            (activity chaining)
               │
               ├─ 2. ClassifyDocument × 3         (fan-out / fan-in)
               │      ├─ Sentiment
               │      ├─ Topic
               │      └─ Priority
               │
               └─ 3. Assemble result string ──▶ return to Client
```

### Client app

The client creates a Durable Task client, schedules orchestrations, and waits for completion:

```csharp
foreach (var doc in docs)
{
    string id = await client.ScheduleNewOrchestrationInstanceAsync(
        "DocumentProcessingOrchestration", doc);

    var meta = await client.WaitForInstanceCompletionAsync(id, getInputsAndOutputs: true);
    if (meta.RuntimeStatus == OrchestrationRuntimeStatus.Completed)
        Console.WriteLine($"  -> {meta.ReadOutputAs<string>()}\n");
}
```

The sample builds the connection string from environment variables (`ENDPOINT`, `TASKHUB`, `AZURE_CLIENT_ID`), using local emulator defaults when those variables aren't set.

### Worker app

The worker registers the orchestration and activities, then connects to Durable Task Scheduler:

```csharp
builder.Services.AddDurableTaskWorker()
    .AddTasks(r =>
    {
        r.AddOrchestrator<DocumentProcessingOrchestration>();
        r.AddActivity<ValidateDocument>();
        r.AddActivity<ClassifyDocument>();
    })
    .UseDurableTaskScheduler(connectionString);
```

### Orchestration flow

The `DocumentProcessingOrchestration` demonstrates activity chaining and fan-out/fan-in:

```csharp
bool isValid = await context.CallActivityAsync<bool>(nameof(ValidateDocument), doc);

var tasks = new[]
{
    context.CallActivityAsync<ClassificationResult>(nameof(ClassifyDocument), new ClassifyRequest(doc.Id, doc.Content, "Sentiment")),
    context.CallActivityAsync<ClassificationResult>(nameof(ClassifyDocument), new ClassifyRequest(doc.Id, doc.Content, "Topic")),
    context.CallActivityAsync<ClassificationResult>(nameof(ClassifyDocument), new ClassifyRequest(doc.Id, doc.Content, "Priority")),
};

ClassificationResult[] results = await Task.WhenAll(tasks);
```

## Clean up resources

To avoid charges, delete deployed Azure resources:

```azdeveloper
azd down
```

To stop and remove the local emulator:

```bash
docker stop dts-emulator
docker rm dts-emulator
```

## Next steps

- [Durable Task SDK overview](durable-task-overview.md)
- [Quickstart: Deploy to Azure Container Apps](quickstart-container-apps-durable-task-sdk.md)
- [Durable Task Scheduler dashboard](../scheduler/durable-task-scheduler-dashboard.md)
- [Fan-out/fan-in pattern](../common/durable-task-fan-in-fan-out.md)
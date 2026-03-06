---
title: "Quickstart: Host a .NET Durable Task SDK app on Azure Kubernetes Service"
description: Learn how to deploy a .NET Durable Task SDK sample and Durable Task Scheduler to Azure Kubernetes Service (AKS) using Azure Developer CLI.
author: hhunter-ms
ms.author: hannahhunter
ms.reviewer: azfuncdf
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.topic: quickstart
ms.date: 02/27/2026
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

## Prepare and run the sample locally

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

## Deploy to AKS with Azure Developer CLI

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

`azd up` provisions and deploys the full solution, including:

- AKS cluster for the client and worker workloads.
- Azure Container Registry (ACR) for container images.
- Durable Task Scheduler for orchestration state and execution.
- User-assigned managed identity and federated credentials for AKS workload identity authentication.

## Verify the AKS deployment

1. Get AKS credentials:

   ```bash
   az aks get-credentials --resource-group <resource-group-name> --name <aks-cluster-name>
   ```

   You can get these values from `azd env get-values`.

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

You can also verify your task hub and orchestration status using the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). 

You can view the orchestration status and history via the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md). By default, the dashboard runs on port 8082. 

1. Navigate to http://localhost:8082 in your web browser.
1. Click the **default** task hub. The orchestration instance you created is in the list.
1. Click the orchestration instance ID to view the execution details.

    :::image type="content" source="./media/quickstart-aks-durable-task-scheduler/orchestration-instance.png" alt-text="Screenshot showing the orchestration instance's details.":::


## Understand the code

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

## Next step

- Learn more in [Durable Task SDK overview](./durable-task-overview.md).
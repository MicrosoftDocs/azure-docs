---
ai-usage: ai-assisted
title: Automate financial risk simulation runs with .NET
description: Design a .NET workflow that submits, monitors, and aggregates financial risk simulation tasks in Azure Batch.
ms.devlang: csharp
ms.topic: how-to
ms.date: 09/09/2026
ms.custom: devx-track-csharp, devx-track-dotnet
# Customer intent: As a .NET developer, I want to automate financial simulation runs, so that I can submit repeatable workloads and aggregate their results.
---

# Automate financial risk simulation runs with .NET

After you validate a small run, automate the workflow by using the current Azure SDK libraries. Use [Azure.Compute.Batch](/dotnet/api/overview/azure/batch) for jobs and tasks, [Azure.ResourceManager.Batch](/dotnet/api/overview/azure/resourcemanager.batch-readme) for pools and account resources, [Azure.Storage.Blobs](/dotnet/api/overview/azure/storage.blobs-readme) for input and output data, and [Azure.Identity](/dotnet/api/overview/azure/identity-readme) for authentication.

Use the [Batch .NET quickstart](../../quick-run-dotnet.md) to set up the clients and run a validated sample. Apply the following simulation-specific design to your application.

## Create one traceable job per run

Create a unique job ID and store the run manifest with the job outputs. Add only identifiers to Batch metadata; keep portfolio data and other sensitive values in protected storage.

If a run has many partitions, [submit tasks in collections](../../large-number-tasks.md) of up to 100. Give each task a deterministic partition ID and associate only the resource files that partition needs.

## Persist and aggregate outputs

Configure [task output files](../../batch-task-output-files.md) to upload results and diagnostics to Azure Storage. Use a hierarchy such as `<run-id>/<task-id>/<attempt>` so that retries don't overwrite unrelated results.

Enable [task dependencies](../../batch-task-dependencies.md) on the job if a final task aggregates the partition outputs. The aggregation step should verify the partition count and output schema before it publishes the final result. An external orchestrator can perform the same validation after all tasks complete.

## Design for re-execution

Batch can retry or requeue tasks after application errors, node failures, pool resizing, or Spot node preemption. Make tasks idempotent so that running a partition more than once produces one valid result.

- Use deterministic partition identifiers and seed inputs.
- Write attempts to separate paths and publish only validated results.
- Set finite retry and maximum wall-clock limits.
- Checkpoint long calculations to durable storage when the model supports restart.

For configuration guidance, see [Design for retries and re-execution](../../best-practices.md#design-for-retries-and-re-execution) and [Error handling and detection](../../error-handling.md).

## Authenticate with Microsoft Entra ID

Use Microsoft Entra ID credentials such as `DefaultAzureCredential` for the submitting application. Assign a user-assigned managed identity to the pool when compute nodes need access to Azure Storage or Azure Container Registry. Grant only the required data-plane roles. For more information, see [Configure managed identities in Batch pools](../../managed-identity-pools.md).

Use a [job schedule](../../batch-job-schedule.md) or an external workflow orchestrator for recurring runs after the submission and validation logic is reliable.

## Next step

> [!div class="nextstepaction"]
> [Evaluate GPU acceleration for financial models](evaluate-gpu-acceleration.md)
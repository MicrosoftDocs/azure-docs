---
author: hhunter-ms
title: "Export Orchestration History with Durable Task Scheduler (Preview)"
titleSuffix: Durable Task
description: Learn how to export orchestration execution history from Durable Task Scheduler to Azure Blob Storage using the Durable Task .NET SDK. Set up batch or continuous export jobs for auditing and compliance.
ms.topic: feature-guide
ms.date: 05/04/2026
ms.author: torosent
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.devlang: csharp
---

# Export orchestration history with Durable Task Scheduler (preview)

The orchestration history export feature lets your app extract execution histories for terminal orchestration instances (completed, failed, or terminated status) from [Durable Task Scheduler](durable-task-scheduler.md) and write them to Azure Blob Storage. Use this feature for auditing, compliance, analytics, and long-term archival of orchestration data outside of the scheduler.

> [!NOTE]
> The orchestration history export feature is currently in preview and available for the [Durable Task .NET SDK](../sdks/durable-task-overview.md). It requires the `Microsoft.DurableTask.ExportHistory` package.

> [!TIP]
> A complete, runnable reference sample is available at [ExportHistoryWebApp](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet/ExportHistoryWebApp). We recommend using it as a reference as you follow this guide.

## How exporting orchestration history works

Export history uses durable entities and orchestrations internally to manage export jobs reliably with the following process.

1. You create an export job through the `ExportHistoryClient`, specifying a time window and export mode.
1. The SDK creates a durable entity (`ExportJob`) that tracks the job's state and progress.
1. An internal orchestration lists terminal orchestration instances that match the specified time window and status filters.
1. For each matching instance, an activity fetches the full execution history from Durable Task Scheduler.
1. The history is serialized (JSONL with gzip compression by default) and written to Azure Blob Storage.
1. The job checkpoints its progress, so it can resume if interrupted.

## Export modes for batch and continuous jobs

Export history supports two modes:

| Mode | Behavior |
| --- | --- |
| **Batch** | Exports instances that reached a terminal state within a fixed time window (`completedTimeFrom` to `completedTimeTo`), then marks the job as completed. |
| **Continuous** | Tails terminal instances continuously from `completedTimeFrom` onward, with no end time. The job stays active until you delete it. |

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- A [Durable Task Scheduler](durable-task-scheduler.md) task hub (or the local emulator)
- An Azure Storage account (or [Azurite](../../storage/common/storage-use-azurite.md) for local development)
- The following NuGet packages:
  - `Microsoft.DurableTask.ExportHistory`
  - `Microsoft.DurableTask.Client.AzureManaged`
  - `Microsoft.DurableTask.Worker.AzureManaged`

## Enable orchestration history export

1. Install the export history package.

   ```bash
   dotnet add package Microsoft.DurableTask.ExportHistory
   ```

1. Install the Azure Managed client and worker packages for Durable Task Scheduler.

   ```bash
   dotnet add package Microsoft.DurableTask.Client.AzureManaged
   dotnet add package Microsoft.DurableTask.Worker.AzureManaged
   ```

1. Register export history on both the worker and client.

   ```csharp
   using Microsoft.DurableTask.Client;
   using Microsoft.DurableTask.Client.AzureManaged;
   using Microsoft.DurableTask.ExportHistory;
   using Microsoft.DurableTask.Worker;
   using Microsoft.DurableTask.Worker.AzureManaged;

   string connectionString = builder.Configuration.GetValue<string>("DURABLE_TASK_CONNECTION_STRING")
       ?? throw new InvalidOperationException("Missing DURABLE_TASK_CONNECTION_STRING");

   string storageConnectionString = builder.Configuration.GetValue<string>("EXPORT_HISTORY_STORAGE_CONNECTION_STRING")
       ?? throw new InvalidOperationException("Missing EXPORT_HISTORY_STORAGE_CONNECTION_STRING");

   string containerName = builder.Configuration.GetValue<string>("EXPORT_HISTORY_CONTAINER_NAME")
       ?? throw new InvalidOperationException("Missing EXPORT_HISTORY_CONTAINER_NAME");

   // Register the worker with export history support.
   // This registers internal entities, orchestrations, and activities that manage export jobs.
   builder.Services.AddDurableTaskWorker(worker =>
   {
       worker.UseDurableTaskScheduler(connectionString);
       worker.UseExportHistory();
   });

   // Register the client with export history support.
   // This configures the Azure Blob Storage destination and registers the ExportHistoryClient.
   builder.Services.AddDurableTaskClient(client =>
   {
       client.UseDurableTaskScheduler(connectionString);
       client.UseExportHistory(options =>
       {
           options.ConnectionString = storageConnectionString;
           options.ContainerName = containerName;

           // Optional: set a virtual folder path prefix for blob names (for example, "exports/daily").
           // When set, blobs are written to "{prefix}/{hash}.{ext}" instead of "{hash}.{ext}".
           options.Prefix = builder.Configuration.GetValue<string>("EXPORT_HISTORY_PREFIX");
       });
   });
   ```

## Create and manage export jobs

After you enable export history, use the `ExportHistoryClient` to create and manage jobs.

### Create a batch export job

In the following example, a batch export job exports all orchestration instances that reached a terminal state within a fixed time window.

```csharp
ExportHistoryClient exportClient = app.Services.GetRequiredService<ExportHistoryClient>();

ExportJobCreationOptions options = new(
    mode: ExportMode.Batch,
    completedTimeFrom: DateTimeOffset.UtcNow.AddHours(-24),
    completedTimeTo: DateTimeOffset.UtcNow,
    destination: new ExportDestination("my-export-container")
    {
        // Virtual folder path prefix applied to all blob names for this job
        Prefix = "exports/daily",
    });

ExportHistoryJobClient jobClient = await exportClient.CreateJobAsync(options);
ExportJobDescription description = await jobClient.DescribeAsync();
```

### Create a continuous export job

In the following example, a continuous export job tails terminal instances indefinitely from a start time.

```csharp
ExportJobCreationOptions options = new(
    mode: ExportMode.Continuous,
    completedTimeFrom: DateTimeOffset.UtcNow,
    completedTimeTo: null,
    destination: null);

ExportHistoryJobClient jobClient = await exportClient.CreateJobAsync(options);
```

When `destination` is null, the job uses the default container and prefix configured in `ExportHistoryStorageOptions`.

### Get export job details

Use the following code to retrieve a job's full description, including its status, progress counters, and any errors.

```csharp
ExportJobDescription? job = await exportClient.GetJobAsync("my-job-id");
```

> [!NOTE]
> `GetJobAsync` throws `ExportJobNotFoundException` if the specified job ID doesn't exist. Handle this exception when querying for jobs that may have been deleted.

The `ExportJobDescription` includes:

| Property | Description |
| --- | --- |
| `JobId` | The unique job identifier. |
| `Status` | Current status: `Pending`, `Active`, `Failed`, or `Completed`. |
| `CreatedAt` | When the job was created. |
| `LastModifiedAt` | When the job was last updated. |
| `ScannedInstances` | Total number of instances scanned so far. |
| `ExportedInstances` | Total number of instances exported so far. |
| `LastError` | Last error message, if any. |

### List jobs

Export a list of active jobs using code similar to the following example.

```csharp
ExportJobQuery query = new()
{
    Status = ExportJobStatus.Active,
    CreatedFrom = DateTimeOffset.UtcNow.AddDays(-7),
    PageSize = 50,
};

AsyncPageable<ExportJobDescription> jobs = exportClient.ListJobsAsync(query);

await foreach (ExportJobDescription job in jobs)
{
    Console.WriteLine($"{job.JobId}: {job.Status} ({job.ExportedInstances} exported)");
}
```

The `ExportJobQuery` supports the following filter properties:

| Property | Description |
| --- | --- |
| `Status` | Filter by job status: `Pending`, `Active`, `Failed`, or `Completed`. |
| `JobIdPrefix` | Filter jobs whose ID starts with this prefix. |
| `CreatedFrom` | Only return jobs created at or after this time. |
| `CreatedTo` | Only return jobs created at or before this time. |
| `PageSize` | Maximum number of results per page. |
| `ContinuationToken` | Token for retrieving the next page of results. |

### Delete a job

Use the following code to delete a job.

```csharp
ExportHistoryJobClient jobClient = exportClient.GetJobClient("my-job-id");
await jobClient.DeleteAsync();
```

> [!NOTE]
> `DeleteAsync` throws `ExportJobNotFoundException` if the job doesn't exist. Deleting a job does **not** remove already-exported blobs from Azure Blob Storage.

## Export job creation options

The `ExportJobCreationOptions` class controls export job behavior and includes the following parameters.

| Parameter | Required | Description | Default |
| --- | --- | --- | --- |
| `mode` | Yes | `Batch` for a fixed window or `Continuous` for ongoing export. | — |
| `completedTimeFrom` | Yes (Batch) | Start of the time window (inclusive), based on when instances reached a terminal state. For Continuous mode, defaults to `UtcNow` if not provided. | — |
| `completedTimeTo` | Yes (Batch) | End of the time window (inclusive). Must be omitted for Continuous mode. Cannot be in the future. | — |
| `destination` | No | Override the default blob container and prefix for this job. | Uses default from `ExportHistoryStorageOptions` |
| `jobId` | No | Custom job identifier. | Auto-generated GUID |
| `format` | No | Export format: JSONL (gzip-compressed) or JSON (uncompressed). | JSONL with gzip |
| `runtimeStatus` | No | Filter by terminal statuses: `Completed`, `Failed`, `Terminated`. | All terminal statuses |
| `maxInstancesPerBatch` | No | Number of instances to process per batch (1–1000). | `100` |

## Where exported data is stored in Azure Blob Storage

Exported history is written to Azure Blob Storage with the following parameters.

- **Container**: default from `EXPORT_HISTORY_CONTAINER_NAME`, or the per-job `destination` override.
- **Blob name**: derived from a SHA-256 hash of `(completedTimestamp, instanceId)`.
- **File format**:
  - Default: `.jsonl.gz` (JSON Lines, gzip-compressed — one history event per line)
  - Optional: `.json` (uncompressed JSON array of history events)
- **Blob path with prefix**: when a prefix is configured (for example, `exports/daily`), the blob path becomes `exports/daily/{hash}.{ext}`. Without a prefix, the blob is written directly to the container root as `{hash}.{ext}`.

Each blob includes an `instanceId` metadata tag for traceability.

## Environment variables for export history configuration

Use these environment variables with the Durable Task .NET SDK export history sample.

| Variable | Description | Sample default |
| --- | --- | --- |
| `DURABLE_TASK_CONNECTION_STRING` | Durable Task Scheduler connection string | `Endpoint=http://localhost:8080;TaskHub=default;Authentication=None` |
| `EXPORT_HISTORY_STORAGE_CONNECTION_STRING` | Azure Storage connection string for exported history blobs | `UseDevelopmentStorage=true` |
| `EXPORT_HISTORY_CONTAINER_NAME` | Blob container for exported history | `export-history` |
| `EXPORT_HISTORY_PREFIX` | Optional virtual folder path prefix for blob names | unset |
| `ASPNETCORE_URLS` | Listen URLs for the sample's HTTP host | framework default |

## Azure permissions for export history

When you use Azure resources instead of local emulators, the app identity needs access to Durable Task Scheduler and Blob Storage:

1. Grant `Durable Task Data Contributor` on the app's task hub.
1. Grant `Storage Blob Data Contributor` on the storage account that stores exported history blobs.

## Important considerations for export jobs

- **Concurrent purge operations**:   
   If you purge orchestration instances while an export job is running, the export can be impacted. Instances that are purged before the export reads them will be missing from the exported data. Avoid running purge operations concurrently with active export jobs that cover the same time window.

- **Blob cleanup**:   
   Deleting an export job doesn't remove the exported blobs from Azure Blob Storage. If you need to remove exported data, delete the blobs from the storage account separately.

## Verify that export works

After you create an export job, verify it works by checking for both signals:

- The job status transitions from `Pending` to `Active` and eventually to `Completed` (for Batch mode).
- Blob entries appear in your configured export container.

You can poll the job status programmatically:

```csharp
ExportJobDescription? job;
do
{
    await Task.Delay(TimeSpan.FromSeconds(5));
    job = await exportClient.GetJobAsync(jobId);
    Console.WriteLine($"Status: {job?.Status}, Exported: {job?.ExportedInstances}");
}
while (job?.Status is ExportJobStatus.Pending or ExportJobStatus.Active);
```

For local development, run this Azure CLI command to inspect the container:

```azurecli
az storage blob list \
  --connection-string "UseDevelopmentStorage=true" \
  --container-name export-history \
  --output table
```

> [!TIP]
> The [ExportHistoryWebApp sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet/ExportHistoryWebApp) includes an `ExportHistoryWebApp.http` file with ready-made REST Client requests for VS Code. Open it and click **Send Request** to quickly test create, get, list, and delete operations.

## Next steps

- [Durable Task .NET SDK export history sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet/ExportHistoryWebApp)
- [Create an app with the Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

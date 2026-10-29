---
author: hhunter-ms
title: "Export Orchestration History with Durable Task Scheduler (Preview)"
titleSuffix: Durable Task
description: Learn about exporting Durable Task Scheduler orchestration histories to Azure Blob Storage with the .NET SDK, Java SDK, and Go SDK beta.
ms.topic: feature-guide
ms.date: 10/28/2026
ms.author: torosent
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.devlang: csharp
---

# Export orchestration history with Durable Task Scheduler (preview)

The orchestration history export feature lets your app extract execution histories for terminal orchestration instances (completed, failed, or terminated status) from [Durable Task Scheduler](durable-task-scheduler.md) and write them to Azure Blob Storage. Use this feature for auditing, compliance, analytics, and long-term archival of orchestration data outside of the scheduler.

> [!NOTE]
> Orchestration history export is in preview. This article includes examples for the [Durable Task .NET SDK](../sdks/durable-task-overview.md) and its `Microsoft.DurableTask.ExportHistory` package, and the [standalone Java SDK starting with version 1.10.0](#use-export-history-with-java) and its `durabletask-exporthistory` package (`1.10.0-preview.1`). The [Go SDK beta](../sdks/durable-task-go.md) also supports history export with its own Go APIs. Java support doesn't apply to Durable Functions Java apps.

For Go, see the [Go SDK export history sample](https://github.com/microsoft/durabletask-go/tree/main/samples/exporthistory), which creates export jobs and downloads the exported JSON and JSONL histories. Use an isolated, Go-only task hub and export destination. The .NET registration and environment variables in this article don't apply to Go.

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

The following prerequisites and setup examples apply to .NET. For Java packages and setup, see [Use export history with Java](#use-export-history-with-java).

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

After you enable export history in .NET, use the `ExportHistoryClient` to create and manage jobs.

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

The .NET `ExportJobCreationOptions` class controls export job behavior and includes the following parameters.

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

The .NET SDK writes exported history to Azure Blob Storage with the following parameters.

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

## Use export history with Java

Starting with Java SDK version 1.10.0, use the `durabletask-exporthistory` extension to export terminal orchestration histories to Azure Blob Storage. The extension released with this version is `1.10.0-preview.1`.

You need Java 8 or later, a Durable Task Scheduler task hub, and an Azure Storage account or Azurite. For local development, use Durable Task Scheduler emulator version 0.4.22 or later. Export relies on the `ListInstanceIds` and `StreamInstanceHistory` backend operations; older emulators return a gRPC `UNIMPLEMENTED` error.

### Install the Java packages

Add these Maven dependencies:

```xml
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-client</artifactId>
    <version>1.10.0</version>
</dependency>
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-azure-managed</artifactId>
    <version>1.10.0</version>
</dependency>
<dependency>
    <groupId>com.microsoft</groupId>
    <artifactId>durabletask-exporthistory</artifactId>
    <version>1.10.0-preview.1</version>
</dependency>
```

### Register the Java worker and client

Configure the storage destination and register the internal export entities, orchestrations, and activities on a worker. The export activities need a client connected to the same task hub.

```java
import com.microsoft.durabletask.DurableTaskClient;
import com.microsoft.durabletask.DurableTaskGrpcClientBuilder;
import com.microsoft.durabletask.DurableTaskGrpcWorker;
import com.microsoft.durabletask.DurableTaskGrpcWorkerBuilder;
import com.microsoft.durabletask.azuremanaged.DurableTaskSchedulerClientExtensions;
import com.microsoft.durabletask.azuremanaged.DurableTaskSchedulerWorkerExtensions;
import com.microsoft.durabletask.exporthistory.ExportHistoryClient;
import com.microsoft.durabletask.exporthistory.ExportHistoryClientExtensions;
import com.microsoft.durabletask.exporthistory.ExportHistoryJobClient;
import com.microsoft.durabletask.exporthistory.ExportHistoryStorageOptions;
import com.microsoft.durabletask.exporthistory.ExportHistoryWorkerExtensions;
import com.microsoft.durabletask.exporthistory.ExportJobCreationOptions;
import com.microsoft.durabletask.exporthistory.ExportJobDescription;
import com.microsoft.durabletask.exporthistory.ExportMode;
import java.time.Instant;

String schedulerConnectionString = System.getenv("DURABLE_TASK_SCHEDULER_CONNECTION_STRING");
ExportHistoryStorageOptions storage = new ExportHistoryStorageOptions()
    .setConnectionString(System.getenv("EXPORT_HISTORY_STORAGE_CONNECTION_STRING"))
    .setContainerName("orchestration-history")
    .setPrefix("exports/");

DurableTaskGrpcClientBuilder clientBuilder = new DurableTaskGrpcClientBuilder();
DurableTaskSchedulerClientExtensions.useDurableTaskScheduler(clientBuilder, schedulerConnectionString);
DurableTaskClient client = clientBuilder.build();

DurableTaskGrpcWorkerBuilder workerBuilder = new DurableTaskGrpcWorkerBuilder();
DurableTaskSchedulerWorkerExtensions.useDurableTaskScheduler(workerBuilder, schedulerConnectionString);
ExportHistoryWorkerExtensions.useExportHistory(workerBuilder, storage, client);
DurableTaskGrpcWorker worker = workerBuilder.build();
worker.start();

ExportHistoryClient exportClient = ExportHistoryClientExtensions.useExportHistory(client, storage);
```

Keep the worker running while export jobs are active. Close the worker and client when your application shuts down. Storage credentials are used by the worker and aren't persisted in task hub state.

For Microsoft Entra ID authentication, add `com.azure:azure-identity` and configure `setAccountUri(URI.create("https://<account>.blob.core.windows.net"))` and `setCredential(new DefaultAzureCredentialBuilder().build())` instead of `setConnectionString`. Import `java.net.URI` and `com.azure.identity.DefaultAzureCredentialBuilder`.

### Create and manage Java export jobs

Create a batch export job for instances that reached a terminal state in the previous 24 hours:

```java
Instant windowEnd = Instant.now();
ExportHistoryJobClient jobClient = exportClient.createJob(
    new ExportJobCreationOptions("daily-archive")
        .setMode(ExportMode.BATCH)
        .setCompletedTimeFrom(windowEnd.minusSeconds(24 * 60 * 60))
        .setCompletedTimeTo(windowEnd));

ExportJobDescription description = jobClient.describe();
System.out.println(description.getStatus() + " exported=" + description.getExportedInstances());
```

Call `describe()` again to check progress until the batch job reaches `COMPLETED` or `FAILED`. The worker exports all terminal statuses (`COMPLETED`, `FAILED`, and `TERMINATED`) by default. Use `setRuntimeStatus` to filter these statuses and `setMaxInstancesPerBatch` to choose a batch size from 1 to 1,000 (default 100).

For continuous export, omit the end time:

```java
ExportHistoryJobClient continuousJob = exportClient.createJob(
    new ExportJobCreationOptions("continuous-archive")
        .setMode(ExportMode.CONTINUOUS)
        .setCompletedTimeFrom(Instant.now()));
```

Use `exportClient.getJob(jobId)` to retrieve a job description, `exportClient.listJobs(new ExportJobQuery())` to list a page of jobs, and `exportClient.getJobClient(jobId).delete()` to stop and delete a job. Import `com.microsoft.durabletask.exporthistory.ExportJobQuery` when listing jobs.

The query result provides `getJobs()` and `getContinuationToken()`; pass the token to `ExportJobQuery.setContinuationToken` to read subsequent pages, even if a filtered page is empty. Deleting a job doesn't delete exported blobs.

Java exports gzip-compressed JSONL by default and also supports JSON. The worker creates the destination container if needed. With the prefix in this example, blobs are written under `exports/` using a SHA-256-based name.

For a complete example that runs orchestrations, creates an export job, and waits for completion, see the [Java SDK history export sample](https://github.com/microsoft/durabletask-java/blob/v1.10.0/samples/src/main/java/io/durabletask/samples/HistoryExportSample.java).

### Java sample environment variables

The Java sample uses different variable names from the .NET sample:

| Variable | Description | Sample default |
| --- | --- | --- |
| `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` | Durable Task Scheduler connection string | `Endpoint=http://localhost:8080;TaskHub=default;Authentication=None` |
| `EXPORT_HISTORY_STORAGE_CONNECTION_STRING` | Azure Storage connection string for exported history blobs | `UseDevelopmentStorage=true` |
| `EXPORT_HISTORY_CONTAINER` | Blob container for exported history | `orchestration-history` |

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

For .NET, you can poll the job status programmatically:

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

For local development, run this Azure CLI command to inspect the .NET sample's container. For the Java sample, replace `export-history` with `orchestration-history`:

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
- [Durable Task Java SDK history export sample](https://github.com/microsoft/durabletask-java/blob/v1.10.0/samples/src/main/java/io/durabletask/samples/HistoryExportSample.java)
- [Create an app with the Durable Task SDKs](../sdks/quickstart-portable-durable-task-sdks.md)

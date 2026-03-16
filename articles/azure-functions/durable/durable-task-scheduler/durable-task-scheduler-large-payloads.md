---
title: Large payload support with Durable Task Scheduler (Preview)
description: Learn how to use preview large payload support in Durable Functions and the Durable Task SDKs with Durable Task Scheduler and Azure Blob Storage.
ms.topic: conceptual
ms.date: 03/14/2026
ms.author: torosent
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.devlang: csharp
zone_pivot_groups: azure-durable-approach
---

# Large payload support with Durable Task Scheduler (Preview)

Large payload support lets your app pass orchestration inputs and activity outputs that exceed the [Durable Task Scheduler](durable-task-scheduler.md) message size limit. When a payload goes over the configured threshold, the framework stores the serialized payload in Azure Blob Storage and sends a small reference through Durable Task Scheduler.

This feature is available only for C# apps:

- [Durable Functions](../durable-functions-overview.md) with the .NET isolated worker
- [.NET Durable Task SDK](durable-task-overview.md)

If your workflow stores data in Blob Storage and passes only a URI or identifier, keep using that pattern. Use large payload support when your orchestration logic must pass the payload between durable operations. For general guidance, see [Data persistence and serialization in Durable Functions](../durable-functions-serialization-and-persistence.md#keep-inputs-and-outputs-small).

## Supported frameworks

This table shows large payload support by framework.

| Framework | Support status | What you need |
| --- | --- | --- |
| Durable Functions | Supported in .NET isolated C# | Use Durable Task Scheduler as the storage provider and use `AzureWebJobsStorage` for payload blobs |
| Durable Task SDKs | Supported in .NET | Use `Microsoft.DurableTask.Extensions.AzureBlobPayloads` with Azure Blob Storage |
| JavaScript, Python, PowerShell, and Java | Not available | Use external storage and pass references between durable operations |

## How it works

When you enable large payload support, the runtime follows the same high level flow in both hosting models:

1. It serializes the orchestration input or activity output.
1. If the payload size exceeds your configured threshold, the runtime compresses the payload with gzip.
1. It writes the compressed payload to Azure Blob Storage.
1. It sends a blob reference through Durable Task Scheduler instead of the full payload.
1. The runtime automatically resolves the reference before your orchestrator or activity code reads the value.

The current .NET samples use deterministic, low-compressibility 1.5 MiB payloads. That keeps the stored blob size representative, even though the runtime writes blobs with gzip content encoding.

Large payload support changes how payloads move through the runtime. It doesn't change the recommendation to keep durable state as small as practical.

## Choose the right pattern

Use the simplest pattern for your scenario.

| Use this pattern | When to use it |
| --- | --- |
| Large payload support | Your orchestration passes the payload between durable operations, and the payload exceeds the scheduler message limit |
| External storage plus references | Your activities load data directly from storage, and you want the smallest possible orchestration state |

## Enable large payload support

::: zone pivot="durable-functions"

Large payload support in Durable Functions is available only for .NET isolated C# apps that use Durable Task Scheduler as the storage provider.

# [C#](#tab/csharp)

Before you enable the feature, make sure your app:

- Uses the .NET isolated worker.
- References `Microsoft.Azure.Functions.Worker.Extensions.DurableTask` and `Microsoft.Azure.Functions.Worker.Extensions.DurableTask.AzureManaged`.
- Sets `AzureWebJobsStorage` to the storage account that holds externalized payloads.
- Sets `DTS_CONNECTION_STRING` and `TASKHUB_NAME` for the target scheduler and task hub.

Then enable large payload storage in [host.json](../durable-functions-bindings.md#host-json):

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DTS_CONNECTION_STRING",
        "largePayloadStorageEnabled": true,
        "largePayloadStorageThresholdBytes": 900000
      },
      "hubName": "%TASKHUB_NAME%"
    }
  }
}
```

Set `largePayloadStorageThresholdBytes` below the Durable Task Scheduler message size boundary so the runtime externalizes payloads before they approach the limit.

Use the standard Durable Functions APIs in your orchestrator and activity code. The runtime automatically resolves blob references before `context.GetInput<T>()` and `context.CallActivityAsync<T>()` return data.

By default, the extension writes externalized payloads to the `durabletask-payloads` container in the storage account configured by `AzureWebJobsStorage`.

For end-to-end examples, see these samples:

- [Durable Functions large payload sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-functions/dotnet/LargePayload)
- [Durable Functions large payload fan-out/fan-in sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-functions/dotnet/LargePayloadFanOutFanIn)

# [JavaScript](#tab/javascript)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

# [Python](#tab/python)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

# [PowerShell](#tab/powershell)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

# [Java](#tab/java)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

---

::: zone-end

::: zone pivot="durable-task-sdks"

Large payload support in the Durable Task SDKs is available only for .NET apps.

# [C#](#tab/csharp)

Install the Azure Blob payload extension package:

```bash
dotnet add package Microsoft.DurableTask.Extensions.AzureBlobPayloads
```

Install the Azure Managed client and worker packages for Durable Task Scheduler:

```bash
dotnet add package Microsoft.DurableTask.Client.AzureManaged
dotnet add package Microsoft.DurableTask.Worker.AzureManaged
```

Register an externalized payload store, choose a threshold, and enable payload resolution on both the client and the worker:

```csharp
builder.Services.AddExternalizedPayloadStore(options =>
{
    options.ExternalizeThresholdBytes = 900_000;
    options.ConnectionString = builder.Configuration["PAYLOAD_STORAGE_CONNECTION_STRING"]
        ?? "UseDevelopmentStorage=true";
    options.ContainerName = "durabletask-payloads";
});

builder.Services.AddDurableTaskClient(client =>
{
    client.UseDurableTaskScheduler(schedulerConnectionString);
    client.UseExternalizedPayloads();
});

builder.Services.AddDurableTaskWorker(worker =>
{
    worker.UseDurableTaskScheduler(schedulerConnectionString);
    worker.UseExternalizedPayloads();
});
```

If you use Microsoft Entra ID instead of a storage connection string, set `options.AccountUri` and `options.Credential`. The sample uses `DefaultAzureCredential` and can optionally target a user-assigned managed identity.

Keep `ExternalizeThresholdBytes` at or below `1,048,576` bytes. The sample uses `900,000` bytes so payloads are offloaded before they approach the 1 MiB scheduler message boundary.

For an end-to-end .NET example, see the [Durable Task SDK large payload sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/durable-task-sdks/dotnet/LargePayload).

# [JavaScript](#tab/javascript)

Large payload support with Durable Task Scheduler is available only for the .NET Durable Task SDK.

# [PowerShell](#tab/powershell)

Large payload support with Durable Task Scheduler is available only for the .NET Durable Task SDK.

# [Python](#tab/python)

Large payload support with Durable Task Scheduler is available only for the .NET Durable Task SDK.

# [Java](#tab/java)

Large payload support with Durable Task Scheduler is available only for the .NET Durable Task SDK.

---

::: zone-end

## Environment variable configuration

::: zone pivot="durable-functions"

Use these local settings or app settings with the current Durable Functions samples.

# [C#](#tab/csharp)

| Setting | Description | Sample default |
| --- | --- | --- |
| `FUNCTIONS_WORKER_RUNTIME` | Azure Functions isolated worker runtime | `dotnet-isolated` |
| `AzureWebJobsStorage` | Storage for Functions host state and payload blobs | `UseDevelopmentStorage=true` locally |
| `DTS_CONNECTION_STRING` | Durable Task Scheduler connection string | `Endpoint=http://localhost:8080;Authentication=None` |
| `TASKHUB_NAME` | Target task hub | `default` |
| `PAYLOAD_SIZE_BYTES` | Payload size used by the starter or generated by each activity | `1572864` |
| `ACTIVITY_COUNT` | Number of parallel activities in the fan-out/fan-in sample only | `3` |

The `ACTIVITY_COUNT` setting is used only by the `LargePayloadFanOutFanIn` sample. The `LargePayload` round-trip sample doesn't read it.

# [JavaScript](#tab/javascript)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

# [Python](#tab/python)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

# [PowerShell](#tab/powershell)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

# [Java](#tab/java)

Large payload support with Durable Task Scheduler is available only for .NET isolated C# Durable Functions apps.

---

::: zone-end

::: zone pivot="durable-task-sdks"

Use these environment variables with the current .NET Durable Task SDK sample.

# [C#](#tab/csharp)

| Variable | Description | Sample default |
| --- | --- | --- |
| `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` | Durable Task Scheduler connection string | `Endpoint=http://localhost:8080;TaskHub=default;Authentication=None` |
| `PAYLOAD_STORAGE_CONNECTION_STRING` | Blob storage connection string for externalized payloads | `UseDevelopmentStorage=true` |
| `PAYLOAD_STORAGE_ACCOUNT_URI` | Blob account URI for identity-based payload storage access | unset |
| `PAYLOAD_CONTAINER_NAME` | Blob container for externalized payloads | `durabletask-payloads` |
| `PAYLOAD_SIZE_BYTES` | Default payload size used by the run endpoint | `1572864` |
| `EXTERNALIZE_THRESHOLD_BYTES` | Blob offload threshold | `900000` |
| `PAYLOAD_STORAGE_MANAGED_IDENTITY_CLIENT_ID` | Optional user-assigned managed identity client ID for storage access | unset |
| `AZURE_CLIENT_ID` | Alternate way to select a user-assigned managed identity | unset |
| `ASPNETCORE_URLS` | Listen URLs for the sample's HTTP host | framework default |

If `PAYLOAD_STORAGE_CONNECTION_STRING` isn't set and `PAYLOAD_STORAGE_ACCOUNT_URI` is provided, the sample uses `DefaultAzureCredential`. If you need a specific user-assigned identity, set `PAYLOAD_STORAGE_MANAGED_IDENTITY_CLIENT_ID` or `AZURE_CLIENT_ID`.

# [JavaScript](#tab/javascript)

This sample is shown for .NET, Java, and Python.

# [PowerShell](#tab/powershell)

This sample is shown for .NET, Java, and Python.

# [Python](#tab/python)

This sample is shown for .NET, Java, and Python.

# [Java](#tab/java)

This sample is shown for .NET, Java, and Python.

---

::: zone-end

## Azure permissions

When you use Azure resources instead of local emulators, the app identity needs access to Durable Task Scheduler and Blob Storage:

- Grant `Durable Task Data Contributor` on the app's task hub.
- Grant `Storage Blob Data Contributor` on the storage account that stores payload blobs.

These permissions apply to Durable Functions apps and Durable Task SDK apps that use a managed identity.

## Check that payload offload works

After you enable payload offload, run an orchestration with an input or output larger than your configured threshold. Then check for both signals:

- The orchestration completes successfully even though the payload exceeds 1 MiB.
- Blob entries appear in the `durabletask-payloads` container.

For local development, run this Azure CLI command to inspect the container:

```azurecli
az storage blob list \
  --connection-string "UseDevelopmentStorage=true" \
  --container-name durabletask-payloads \
  --output table
```

The sample apps also validate the round trip:

- The Durable Functions samples return a small summary object that confirms the input and output sizes.
- The .NET Durable Task SDK sample prints whether the run creates new payload blobs.

Because the runtime stores externalized payloads with gzip content encoding, Azure reports the compressed on-disk blob size. With the current low-compressibility sample payloads, those blob sizes should stay reasonably close to the logical payload size.

> [!NOTE]
> Purging orchestration instances doesn't currently delete the corresponding externalized payload blobs from Azure Blob Storage. If you need to remove those payloads, delete the blobs from the storage account separately.

## Next steps

> [!div class="nextstepaction"]
> [Configure Durable Functions with Durable Task Scheduler](quickstart-durable-task-scheduler.md)

> [!div class="nextstepaction"]
> [Create an app with the Durable Task SDKs](quickstart-portable-durable-task-sdks.md)

---
title: "Data Persistence and Serialization in Durable Functions - Azure"
description: "Learn how Durable Functions persists and serializes data in Azure Functions. Discover best practices for handling large payloads, sensitive data, and custom serialization to optimize performance."
author: cgillum
ms.topic: concept-article
ms.service: durable-task
ms.subservice: durable-functions
ms.date: 07/27/2026
ms.author: azfuncdf
ms.devlang: csharp
# ms.devlang: csharp, java, javascript, powershell, python
ms.custom: devx-track-dotnet
#Customer intent: As a developer, I want to understand what data is persisted to durable storage, how that data is serialized, and how I can customize it when it doesn't work the way my app needs it to.
---

# Data persistence and serialization in Durable Functions for Azure Functions

[!INCLUDE [functions-in-process-model-retirement-note](../includes/functions-in-process-model-retirement-note.md)]

The Durable Functions runtime automatically persists function parameters, return values, and other state to the [task hub](../common/durable-task-hubs.md) to provide reliable execution. However, the amount and frequency of data persisted to durable storage can impact application performance and storage transaction costs. Depending on the type of data your application stores, data retention and privacy policies may also need to be considered.

This article explains what data gets persisted, how to handle large payloads and sensitive data, and how to customize serialization for each supported language.

In this article:

- [Task hub contents](#task-hub-contents) - What data is stored and how
- [Keep inputs and outputs small](#keep-durable-functions-inputs-and-outputs-small) - Strategies for managing payload size
- [Work with sensitive data](#work-with-sensitive-data) - Protect secrets and personally identifiable information
- [Secure your task hub storage](#secure-your-task-hub-storage) - Protect your storage backend from unauthorized access
- [Customize serialization and deserialization](#customize-serialization-and-deserialization) - Language-specific serialization options

## Task hub contents

Task hubs store the current state of instances, and any pending messages:

* *Instance states* store the current status and history of an instance. For orchestration instances, this state includes the runtime state, the orchestration history, inputs, outputs, and custom status. For entity instances, it includes the entity state.
* *Messages* store function inputs or outputs, event payloads, and metadata that is used for internal purposes, like routing and end-to-end correlation.

Messages are deleted after being processed, but instance states persist unless they're explicitly deleted by the application or an operator. In particular, an orchestration history remains in storage even after the orchestration completes.

For an example of how states and messages represent the progress of an orchestration, see the [task hub execution example](../common/durable-task-hubs.md#execution-example).

Where and how states and messages are represented in storage [depends on the storage provider](../common/durable-task-hubs.md#representation-in-storage). Use [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) because it provides a managed backend for task hubs and handles the underlying state store for you. However, Azure Storage remains a solid option for existing workloads and for apps that want to manage their own storage resources.

| Storage provider | How state is stored | Recommended use |
| --- | --- | --- |
| Durable Task Scheduler | Orchestration and entity state are stored in the managed scheduler backend behind a task hub resource. | Preferred option for new Durable Functions apps and managed deployments. |
| Azure Storage | State and messages are represented in queues, tables, and blobs in an Azure Storage account. | Good fit for existing apps or deployments that already rely on Azure Storage. |

### Types of data that are serialized and persisted
The following list shows the different types of data that will be serialized and persisted when using features of Durable Functions:

- All inputs and outputs of orchestrator, activity, and entity functions, including any IDs and unhandled exceptions
- Orchestrator, activity, and entity function names
- External event names and payloads
- Custom orchestration status payloads
- Orchestration termination messages
- Durable timer payloads
- Durable HTTP request and response URLs, headers, and payloads
- Entity call and signal payloads
- Entity state payloads

For guidance on managing payload size and protecting sensitive items in this list, see the following sections.

### Keep Durable Functions inputs and outputs small

You can run into memory issues if you provide large inputs and outputs to and from Durable Functions APIs. Inputs and outputs are serialized into the orchestration history, which means that large payloads can, over time, greatly contribute to unbounded history growth. This growth risks causing memory exceptions during [replay](../common/durable-task-orchestrations.md#reliability).

To mitigate the impact of large inputs and outputs, you can:

- Delegate work to sub-orchestrators to load balance the history memory burden across multiple orchestrators, keeping the memory footprint of individual histories small.
- Store large data in external storage (such as Azure Blob Storage) and pass lightweight identifiers that allow you to retrieve that data inside activity functions when needed.

For the Durable Task Scheduler, use [large payload support](../scheduler/durable-task-scheduler-large-payloads.md) to offload larger payloads to Azure Blob Storage. For new apps, this pattern is recommended when an orchestration must pass large payloads between durable operations. If you use the Azure Storage provider, you can still apply the claim-check pattern shown in the following section and pass lightweight references between operations.

> [!TIP]
> The best practice for dealing with large data is to keep it in external storage and materialize that data only inside activities, when needed.

#### Pass references to large payloads

Choose the pattern that fits your storage provider.

##### Durable Task Scheduler

If you use Durable Task Scheduler, enable [large payload support](../scheduler/durable-task-scheduler-large-payloads.md) so the runtime writes larger payloads to Azure Blob Storage and sends a small reference through the scheduler. A typical configuration is shown in the scheduler docs:

```json
{
  "version": "2.0",
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type": "azureManaged",
        "connectionStringName": "DTS_CONNECTION_STRING",
        "payloadStorageEnabled": true,
        "payloadStorageThresholdBytes": 262144
      },
      "hubName": "%TASKHUB_NAME%"
    }
  }
}
```

##### Azure Storage

With the Azure Storage provider, you can use the [Claim Check pattern](/azure/architecture/patterns/claim-check) to keep orchestration history small while still processing large payloads. The orchestrator passes a lightweight reference that contains the blob container and blob name, and the activity reads or writes the payload from Azure Blob Storage as needed.

The following examples assume that you already have a blob in your storage account. Start the orchestration with a reference such as `{"container":"large-payloads","blobName":"input/job-123.json"}`. The activity creates the `processed-payloads` output container if necessary. The sample processing step copies the input bytes unchanged; replace it with your application logic.

> [!IMPORTANT]
> Never include storage credentials or a shared access signature (SAS) in the reference. The system persists the reference in orchestration history. These examples use an app setting named `PAYLOAD_STORAGE_CONNECTION_STRING` to keep the storage code concise. For production workloads, use Microsoft Entra ID to [authorize access to blob data](/azure/storage/blobs/authorize-access-azure-active-directory).

# [C# (Isolated)](#tab/csharp-isolated-large-payload)

This example requires the [Azure.Storage.Blobs](https://www.nuget.org/packages/Azure.Storage.Blobs) NuGet package.

```csharp
using System;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Azure.Functions.Worker;
using Microsoft.DurableTask;

public record BlobReference(string Container, string BlobName);

public static class LargePayloadFunctions
{
    [Function("ProcessLargePayload")]
    public static async Task<BlobReference> RunOrchestrator(
        [OrchestrationTrigger] TaskOrchestrationContext context)
    {
        BlobReference inputReference = context.GetInput<BlobReference>()
            ?? throw new InvalidOperationException("A blob reference is required.");

        return await context.CallActivityAsync<BlobReference>(
            nameof(ProcessLargePayloadActivity), inputReference);
    }

    [Function(nameof(ProcessLargePayloadActivity))]
    public static async Task<BlobReference> ProcessLargePayloadActivity(
        [ActivityTrigger] BlobReference inputReference)
    {
        string connectionString =
            Environment.GetEnvironmentVariable("PAYLOAD_STORAGE_CONNECTION_STRING")
            ?? throw new InvalidOperationException("Payload storage is not configured.");
        BlobServiceClient service = new BlobServiceClient(connectionString);

        BlobClient inputBlob = service
            .GetBlobContainerClient(inputReference.Container)
            .GetBlobClient(inputReference.BlobName);
        BinaryData inputData = (await inputBlob.DownloadContentAsync()).Value.Content;

        BlobContainerClient outputContainer =
            service.GetBlobContainerClient("processed-payloads");
        await outputContainer.CreateIfNotExistsAsync();

        string outputName = $"processed/{Guid.NewGuid():N}.json";
        await outputContainer.GetBlobClient(outputName)
            .UploadAsync(inputData, overwrite: true);

        return new BlobReference(outputContainer.Name, outputName);
    }
}
```

# [C# (InProc)](#tab/csharp-inproc-large-payload)

This example requires the [Azure.Storage.Blobs](https://www.nuget.org/packages/Azure.Storage.Blobs) NuGet package.

```csharp
using System;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;

public class BlobReference
{
    public string Container { get; set; } = string.Empty;
    public string BlobName { get; set; } = string.Empty;
}

public static class LargePayloadFunctions
{
    [FunctionName("ProcessLargePayload")]
    public static async Task<BlobReference> RunOrchestrator(
        [OrchestrationTrigger] IDurableOrchestrationContext context)
    {
        BlobReference inputReference = context.GetInput<BlobReference>()
            ?? throw new InvalidOperationException("A blob reference is required.");

        return await context.CallActivityAsync<BlobReference>(
            "ProcessLargePayloadActivity", inputReference);
    }

    [FunctionName("ProcessLargePayloadActivity")]
    public static async Task<BlobReference> RunActivity(
        [ActivityTrigger] BlobReference inputReference)
    {
        string connectionString =
            Environment.GetEnvironmentVariable("PAYLOAD_STORAGE_CONNECTION_STRING")
            ?? throw new InvalidOperationException("Payload storage is not configured.");
        BlobServiceClient service = new BlobServiceClient(connectionString);

        BlobClient inputBlob = service
            .GetBlobContainerClient(inputReference.Container)
            .GetBlobClient(inputReference.BlobName);
        BinaryData inputData = (await inputBlob.DownloadContentAsync()).Value.Content;

        BlobContainerClient outputContainer =
            service.GetBlobContainerClient("processed-payloads");
        await outputContainer.CreateIfNotExistsAsync();

        string outputName = $"processed/{Guid.NewGuid():N}.json";
        await outputContainer.GetBlobClient(outputName)
            .UploadAsync(inputData, overwrite: true);

        return new BlobReference
        {
            Container = outputContainer.Name,
            BlobName = outputName,
        };
    }
}
```

# [JavaScript](#tab/javascript-large-payload)

This example requires the [@azure/storage-blob](https://www.npmjs.com/package/@azure/storage-blob) npm package.

```javascript
const { randomUUID } = require("crypto");
const { BlobServiceClient } = require("@azure/storage-blob");
const df = require("durable-functions");

df.app.orchestration("processLargePayload", function* (context) {
    const inputReference = context.df.getInput();
    return yield context.df.callActivity(
        "processLargePayloadActivity", inputReference);
});

df.app.activity("processLargePayloadActivity", {
    handler: async (inputReference) => {
        const connectionString =
            process.env.PAYLOAD_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error(
                "PAYLOAD_STORAGE_CONNECTION_STRING is not set.");
        }

        const service = BlobServiceClient.fromConnectionString(
            connectionString);

        const inputBlob = service
            .getContainerClient(inputReference.container)
            .getBlockBlobClient(inputReference.blobName);
        const inputData = await inputBlob.downloadToBuffer();

        const outputContainer =
            service.getContainerClient("processed-payloads");
        await outputContainer.createIfNotExists();

        const outputName = `processed/${randomUUID()}.json`;
        await outputContainer.getBlockBlobClient(outputName)
            .uploadData(inputData);

        return {
            container: outputContainer.containerName,
            blobName: outputName,
        };
    },
});
```

# [Python](#tab/python-large-payload)

This example requires the [azure-storage-blob](https://pypi.org/project/azure-storage-blob/) package. Add it to *requirements.txt*.

```python
import os
import uuid

import azure.functions as func
import azure.durable_functions as df
from azure.core.exceptions import ResourceExistsError
from azure.storage.blob import BlobServiceClient

app = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)


@app.orchestration_trigger(context_name="context")
def process_large_payload(context: df.DurableOrchestrationContext):
    input_reference: dict = context.get_input()
    return (yield context.call_activity(
        "process_large_payload_activity", input_reference))


@app.activity_trigger(input_name="input_reference")
def process_large_payload_activity(input_reference: dict) -> dict:
    connection_string = os.getenv("PAYLOAD_STORAGE_CONNECTION_STRING")
    if not connection_string:
        raise ValueError(
            "PAYLOAD_STORAGE_CONNECTION_STRING is not set.")

    service = BlobServiceClient.from_connection_string(connection_string)

    input_blob = service.get_blob_client(
        container=input_reference["container"],
        blob=input_reference["blobName"])
    input_data = input_blob.download_blob().readall()

    output_container = service.get_container_client("processed-payloads")
    try:
        output_container.create_container()
    except ResourceExistsError:
        pass

    output_name = f"processed/{uuid.uuid4()}.json"
    output_container.upload_blob(
        name=output_name, data=input_data, overwrite=True)

    return {
        "container": output_container.container_name,
        "blobName": output_name,
    }
```

# [PowerShell](#tab/powershell-large-payload)

This example requires the [Az.Storage](https://www.powershellgallery.com/packages/Az.Storage) module. Add it to *requirements.psd1* and make sure managed dependencies are enabled in *host.json*.

**Orchestrator `run.ps1`:**

```powershell
param($Context)

$OutputReference = Invoke-DurableActivity `
    -FunctionName 'ProcessLargePayloadActivity' `
    -Input $Context.Input

return $OutputReference
```

**Activity `run.ps1`:**

```powershell
param($InputReference)

if ([string]::IsNullOrEmpty(
        $env:PAYLOAD_STORAGE_CONNECTION_STRING)) {
    throw 'The PAYLOAD_STORAGE_CONNECTION_STRING app setting is not configured.'
}

$StorageContext = New-AzStorageContext `
    -ConnectionString $env:PAYLOAD_STORAGE_CONNECTION_STRING
$InputFile = New-TemporaryFile

try {
    Get-AzStorageBlobContent `
        -Container $InputReference.container `
        -Blob $InputReference.blobName `
        -Destination $InputFile.FullName `
        -Context $StorageContext `
        -Force | Out-Null

    # Process $InputFile here. This example uploads it unchanged.
    $OutputContainer = 'processed-payloads'
    New-AzStorageContainer `
        -Name $OutputContainer `
        -Context $StorageContext `
        -ErrorAction SilentlyContinue | Out-Null

    $OutputName = "processed/$([guid]::NewGuid()).json"
    Set-AzStorageBlobContent `
        -File $InputFile.FullName `
        -Container $OutputContainer `
        -Blob $OutputName `
        -Context $StorageContext `
        -Force | Out-Null

    return @{
        container = $OutputContainer
        blobName = $OutputName
    }
}
finally {
    Remove-Item $InputFile.FullName -Force
}
```

Use the standard `orchestrationTrigger` and `activityTrigger` bindings described in [Durable Functions bindings](durable-functions-bindings.md).

# [Java](#tab/java-large-payload)

This example requires the `com.azure:azure-storage-blob` and `com.microsoft:durabletask-azure-functions` Maven packages.

```java
import com.azure.core.util.BinaryData;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.durabletask.TaskOrchestrationContext;
import com.microsoft.durabletask.azurefunctions.DurableActivityTrigger;
import com.microsoft.durabletask.azurefunctions.DurableOrchestrationTrigger;

import java.util.Objects;
import java.util.UUID;

public class LargePayloadFunctions {
    public static class BlobReference {
        public String container;
        public String blobName;

        public BlobReference() {
        }

        public BlobReference(String container, String blobName) {
            this.container = container;
            this.blobName = blobName;
        }
    }

    @FunctionName("ProcessLargePayload")
    public BlobReference runOrchestrator(
            @DurableOrchestrationTrigger(name = "ctx")
            TaskOrchestrationContext ctx) {
        BlobReference inputReference = Objects.requireNonNull(
            ctx.getInput(BlobReference.class),
            "A blob reference is required.");
        return ctx.callActivity(
            "ProcessLargePayloadActivity",
            inputReference,
            BlobReference.class).await();
    }

    @FunctionName("ProcessLargePayloadActivity")
    public BlobReference runActivity(
            @DurableActivityTrigger(name = "inputReference")
            BlobReference inputReference) {
        String connectionString = Objects.requireNonNull(
            System.getenv("PAYLOAD_STORAGE_CONNECTION_STRING"),
            "PAYLOAD_STORAGE_CONNECTION_STRING is not configured.");
        BlobServiceClient service = new BlobServiceClientBuilder()
            .connectionString(connectionString)
            .buildClient();

        BinaryData inputData = service
            .getBlobContainerClient(inputReference.container)
            .getBlobClient(inputReference.blobName)
            .downloadContent();

        BlobContainerClient outputContainer =
            service.getBlobContainerClient("processed-payloads");
        outputContainer.createIfNotExists();

        String outputName =
            "processed/" + UUID.randomUUID() + ".json";
        outputContainer.getBlobClient(outputName)
            .upload(inputData, true);

        return new BlobReference(
            outputContainer.getBlobContainerName(), outputName);
    }
}
```

---

If parallel activities produce multiple large results, return a list of references and pass that list to a final aggregation activity. The aggregation activity should load and combine the payloads and then write one final output blob. Don't load or concatenate the large results in the orchestrator.

### Work with sensitive data

Inputs and outputs (including exceptions) to and from Durable Functions APIs are durably persisted in your [storage provider of choice](../common/durable-task-storage-providers.md). If those inputs, outputs, or exceptions contain sensitive data (such as secrets, connection strings, or personally identifiable information), anyone with read access to your storage provider's resources could obtain them.

To safely handle sensitive data, fetch that data within activity functions from either Azure Key Vault or environment variables, and never communicate that data directly to or from orchestrators or entities. This approach helps prevent sensitive data from leaking into your storage resources.

Similarly, write access to storage resources must be tightly controlled, as tampered data in storage could alter orchestration behavior. For more information about securing task hub storage, see [Secure your task hub storage](#secure-your-task-hub-storage).

> [!TIP]
> This guidance also applies to the `CallHttp` orchestrator API, which persists its request and response payloads in storage. If your target HTTP endpoints require authentication, implement the HTTP call inside an activity, or use the [built-in managed identity support offered by CallHttp](./durable-functions-http-features.md#managed-identities), which doesn't persist credentials to storage.

> [!NOTE]
> Avoid logging data containing secrets as anyone with read access to your logs (for example in Application Insights) could obtain those secrets.

#### Encryption at rest

When using the Azure Storage provider, all data is automatically encrypted at rest. However, anyone with access to the storage account can read the data in its unencrypted form. If you need stronger protection for sensitive data, consider first encrypting the data using your own encryption keys so that the data is persisted in its pre-encrypted form.

Alternatively, .NET users have the option of implementing custom serialization providers that provide automatic encryption. An example of custom serialization with encryption can be found in [this GitHub sample](https://github.com/charleszipp/azure-durable-entities-encryption).

> [!NOTE]
> If you decide to implement application-level encryption, be aware that orchestrations and entities can exist for indefinite amounts of time. This matters when it comes time to rotate your encryption keys because an orchestration or entities may run longer than your key rotation policy. If a key rotation happens, the key used to encrypt your data may no longer be available to decrypt it the next time your orchestration or entity executes. Custom encryption is therefore recommended only when orchestrations and entities are expected to run for relatively short periods of time.

## Secure your task hub storage

The storage backend that hosts your task hub is a critical trust boundary. The Durable Task Framework trusts data it reads from storage during orchestration replay and message processing. Anyone with write access to the task hub storage can tamper with orchestration state, pending messages, or stored payloads. This may alter application behavior, trigger unintended actions, or achieve remote code execution within the context of your function app.

> [!IMPORTANT]
> Don't expose your task hub storage credentials or grant write access to untrusted parties. Write access to task hub storage can be used to alter application behavior, including triggering arbitrary code execution.

### Shared responsibility

Securing the storage backend is your responsibility, the same as securing any database that stores application state or code. The Durable Task Framework doesn't perform integrity verification on stored data, so it relies on the storage layer's access controls to prevent unauthorized modifications.

| Backend | Security responsibility | Guidance |
| --- | --- | --- |
| Durable Task Scheduler | Microsoft manages the underlying storage backend. You manage identities, task hub access, and app-level security. | Preferred default for new Durable Functions apps. |
| Azure Storage and other BYO providers | You manage the storage account or database and its security controls. | Good fit for existing workloads or deployments that already rely on Azure Storage. |

> [!NOTE]
> Don't share a single task hub between untrusted tenants. A task hub doesn't enforce access boundaries between its users, so any tenant that can read or write to the task hub can affect all orchestrations and entities within it. Similarly, don't rely on separate task hubs within the same backend as a security boundary. While [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) supports [RBAC scoped to individual task hubs](../scheduler/durable-task-scheduler-identity.md), network controls such as IP allow lists and private endpoints apply only at the scheduler level, so task hubs within a scheduler aren't a security isolation boundary. The same is true for BYO storage providers—any tenant with access to the storage account or database can reach all task hubs on that backend. When you need security isolation between tenants, provision separate infrastructure for each tenant: separate storage accounts or databases for BYO providers, or separate Durable Task Scheduler instances.

### Storage hardening checklist

Apply the following best practices to protect your task hub storage:

- **Use identity-based connections** for the backend you choose. 
  - With Durable Task Scheduler, rely on managed identities and RBAC for the scheduler and task hubs. 
  - With Azure Storage and other BYO providers, prefer managed identity over connection strings where possible. 
  
  See [Configure a managed identity for Durable Functions](durable-functions-configure-managed-identity.md).  
- **Apply least-privilege RBAC roles**. Grant only the minimum permissions required. Avoid granting broad storage access to users or services that don't need it.
- **Restrict network access** to your storage account or scheduler deployment by using [private endpoints or service endpoints](../../azure-functions/configure-networking-how-to.md). This restriction helps prevent unauthorized network-level access to task hub data.
- **Monitor storage access** by enabling Azure Monitor resource logs for your storage account, especially the `StorageWrite` log category. Route these logs to a destination outside of the monitored storage account, such as Log Analytics, so they can't be tampered with. See [Storage logs](../../azure-functions/storage-considerations.md#storage-logs).
- **Rotate credentials regularly** if you use connection strings. Treat storage account keys with the same care as any other high-privilege credential.
- **Consider a managed storage backend**. [Durable Task Scheduler](../scheduler/durable-task-scheduler.md) handles storage security automatically, including authentication, RBAC, and network isolation, while Azure Storage offers explicit storage control.

## Customize serialization and deserialization

Serialization customization options vary by language. Select your language tab to see the available options.

# [C# (Isolated)](#tab/csharp-isolated)
### .NET Isolated and System.Text.Json

Durable Functions running in the [.NET Isolated worker process](../../azure-functions/dotnet-isolated-process-guide.md) use the same object serializer configured globally for your Azure Functions app (see [`WorkerOptions`](/dotnet/api/microsoft.azure.functions.worker.workeroptions)). This serializer is [`System.Text.Json`](/dotnet/api/system.text.json) by default rather than `Newtonsoft.Json`. Any changes to `WorkerOptions.Serializer` transitively apply to Durable Functions.

For more information on the built-in support for JSON serialization in .NET, see the [JSON serialization and deserialization in .NET overview documentation](/dotnet/standard/serialization/system-text-json-overview).

# [C# (InProc)](#tab/csharp-inproc)

### Default serialization logic

Durable Functions for .NET in-process internally uses [Json.NET](https://www.newtonsoft.com/json/help/html/Introduction.htm) to serialize orchestration and entity data to JSON. The default Json.NET settings used are:

**Inputs, Outputs, and State:**

```csharp
JsonSerializerSettings
{
    TypeNameHandling = TypeNameHandling.None,
    DateParseHandling = DateParseHandling.None,
}
```

**Exceptions:**

```csharp
JsonSerializerSettings
{
    ContractResolver = new ExceptionResolver(),
    TypeNameHandling = TypeNameHandling.Objects,
    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
}
```

Read more detailed documentation about `JsonSerializerSettings` [here](https://www.newtonsoft.com/json/help/html/SerializationSettings.htm).

### Customize serialization with .NET attributes

During serialization, Json.NET looks for [various attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm) on classes and properties that control how the data is serialized and deserialized from JSON. If you own the source code for data type passed to Durable Functions APIs, consider adding these attributes to the type to customize serialization and deserialization.

### Customize serialization with Dependency Injection

Function apps that target .NET and run on the Functions V3 runtime can use [Dependency Injection (DI)](../../azure-functions/functions-dotnet-dependency-injection.md) to customize how data and exceptions are serialized. The following sample code demonstrates how to use DI to override the default Json.NET serialization settings using custom implementations of the `IMessageSerializerSettingsFactory` and `IErrorSerializerSettingsFactory` service interfaces.

```csharp
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs.Extensions.DurableTask;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Collections.Generic;

[assembly: FunctionsStartup(typeof(MyApplication.Startup))]
namespace MyApplication
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IMessageSerializerSettingsFactory, CustomMessageSerializerSettingsFactory>();
            builder.Services.AddSingleton<IErrorSerializerSettingsFactory, CustomErrorSerializerSettingsFactory>();
        }

        /// <summary>
        /// A factory that provides the serialization for all inputs and outputs for activities and
        /// orchestrations, as well as entity state.
        /// </summary>
        internal class CustomMessageSerializerSettingsFactory : IMessageSerializerSettingsFactory
        {
            public JsonSerializerSettings CreateJsonSerializerSettings()
            {
                // Return your custom JsonSerializerSettings here
            }
        }

        /// <summary>
        /// A factory that provides the serialization for all exceptions thrown by activities
        /// and orchestrations
        /// </summary>
        internal class CustomErrorSerializerSettingsFactory : IErrorSerializerSettingsFactory
        {
            public JsonSerializerSettings CreateJsonSerializerSettings()
            {
                // Return your custom JsonSerializerSettings here
            }
        }
    }
}
```

# [JavaScript](#tab/javascript)

### Serialization and deserialization logic

Azure Functions Node applications use [`JSON.stringify()` for serialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`JSON.Parse()` for deserialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). Most types should serialize and deserialize seamlessly. In cases where the default logic is insufficient, defining a `toJSON()` method on the object will override the serialization logic. However, no analog exists for object deserialization.

For full customization of the serialization/deserialization pipeline, consider handling the serialization and deserialization with your own code and passing around data as strings.

# [PowerShell](#tab/powershell)

### Serialization and deserialization logic

Durable Functions PowerShell apps use the default PowerShell JSON handling for orchestration and activity payloads. In most cases, plain JSON-compatible objects serialize and deserialize correctly without extra configuration.

If you need custom behavior for a payload shape, serialize or deserialize the data yourself inside your functions and pass the resulting JSON-compatible values between orchestrators, activities, and entities. This approach keeps the data format explicit and avoids depending on a serializer customization API that isn't exposed for PowerShell.

For more complex scenarios, consider representing your data as simple strings, arrays, or hashtables and converting between formats inside your function code.

# [Python](#tab/python)

### Serialization and deserialization logic

It's recommended to use type annotations to ensure Durable Functions serializes and deserializes your data correctly. While many built-in types are handled automatically, some built-in data types require type annotations to preserve the type during deserialization.

For custom data types, you make JSON serialization and deserialization possible by defining class methods `to_json` and `from_json` on your data type class. Note that these methods are not called on the return value from the orchestrator function, meaning the return value has to be natively JSON-serializable. For more information, see [Bindings](durable-functions-bindings.md#python-trigger-usage).

To validate deserialized payloads against an expected type and optionally opt in to a hardened strict mode, see [Migrate to type-safe serialization in Durable Functions for Python](durable-functions-python-type-safe-serialization-migrate.md).

# [Java](#tab/java)

Java uses the [Jackson v2.x](https://github.com/FasterXML/jackson#jackson-project-home-github) libraries for serialization and deserialization of data payloads. You can use [Jackson annotations](https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations) on your POJO types to customize the serialization behavior.

---

## Next steps

- [Task hubs in Durable Functions](../common/durable-task-hubs.md)
- [Durable Functions storage providers](../common/durable-task-storage-providers.md)
- [Durable Functions bindings](durable-functions-bindings.md)

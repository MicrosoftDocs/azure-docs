---
title: Data persistence and serialization in Durable Functions - Azure
description: Learn how the Durable Functions extension for Azure Functions persists data
author: ConnorMcMahon
ms.topic: conceptual
ms.date: 02/11/2021
ms.author: azfuncdf
#Customer intent: As a developer, I want to understand what data is persisted to durable storage, how that data is serialized, and how
#I can customize it when it doesn't work the way my app needs it to.
---

# Data persistence and serialization in Durable Functions (Azure Functions)

Durable Functions automatically persists function parameters, return values, and other state to a durable backend in order to provide reliable execution. However, the amount and frequency of data persisted to durable storage can impact application performance and storage transaction costs. Depending on the type of data your application stores, data retention and privacy policies may also need to be considered.

## Azure Storage

By default, Durable Functions persists data to queues, tables, and blobs in an [Azure Storage](https://azure.microsoft.com/services/storage/) account that you specify.

### Queues

Durable Functions uses Azure Storage queues to reliably schedule all function executions. These queue messages contain function inputs or outputs, depending on whether the message is being used to schedule an execution or return a value back to a calling function. These queue messages also include additional metadata that Durable Functions uses for internal purposes, like routing and end-to-end correlation. After a function has finished executing in response to a received message, that message is deleted and the result of the execution may also be persisted to either Azure Storage Tables or Azure Storage Blobs.

Within a single [task hub](durable-functions-task-hubs.md), Durable Functions creates and adds messages to a *work-item* queue named `<taskhub>-workitem` for scheduling activity functions and one or more *control queues* named `<taskhub>-control-##` to schedule or resume orchestrator and entity functions. The number of control queues is equal to the number of partitions configured for your application. For more information about queues and partitions, see the [Performance and Scalability documentation](durable-functions-perf-and-scale.md).

### Tables

Once orchestrations process messages successfully, records of their resulting actions are persisted to the *History* table named `<taskhub>History`. Orchestration inputs, outputs, and custom status data is also persisted to the *Instances* table named `<taskhub>Instances`.

### Blobs

In most cases, Durable Functions doesn't use Azure Storage Blobs to persist data. However, queues and tables have [size limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#azure-queue-storage-limits) that can prevent Durable Functions from persisting all of the required data into a storage row or queue message. For example, when a piece of data that needs to be persisted to a queue is greater than 45 KB when serialized, Durable Functions will compress the data and store it in a blob instead. When persisting data to blob storage in this way, Durable Function stores a reference to that blob in the table row or queue message. When Durable Functions needs to retrieve the data it will automatically fetch it from the blob. These blobs are stored in the blob container `<taskhub>-largemessages`.

> [!NOTE]
> The extra compression and blob operation steps for large messages can be expensive in terms of CPU and I/O latency costs. Additionally, Durable Functions needs to load persisted data in memory, and may do so for many different function executions at the same time. As a result, persisting large data payloads can cause high memory usage as well. To minimize memory overhead, consider persisting large data payloads manually (for example, in blob storage) and instead pass around references to this data. This way your code can load the data only when needed to avoid redundant loads during [orchestrator function replays](durable-functions-orchestrations.md#reliability). However, storing payloads to disk is *not* recommended since on-disk state is not guaranteed to be available since functions may execute on different VMs throughout their lifetimes.

### Types of data that is serialized and persisted
The following is a list of the different types of data that will be serialized and persisted when using features of Durable Functions:

- All inputs and outputs of orchestrator, activity, and entity functions, including any IDs and unhandled exceptions
- Orchestrator, activity, and entity function names
- External event names and payloads
- Custom orchestration status payloads
- Orchestration termination messages
- Durable timer payloads
- Durable HTTP request and response URLs, headers, and payloads
- Entity call and signal payloads
- Entity state payloads

### Working with sensitive data
When using Azure Storage, all data is automatically encrypted at rest. However, anyone with access to the storage account can read the data in its unencrypted form. If you need stronger protection for sensitive data, consider first encrypting the data using your own encryption keys so that Durable Functions persists the data in a pre-encrypted form.

Alternatively, .NET users have the option of implementing custom serialization providers that provide automatic encryption. An example of custom serialization with encryption can be found in [this GitHub sample](https://github.com/charleszipp/azure-durable-entities-encryption).

> [!NOTE]
> If you decide to implement application-level encryption, be aware that orchestrations and entities can exist for indefinite amounts of time. This matters when it comes time to rotate your encryption keys because an orchestration or entities may run longer than your key rotation policy. If a key rotation happens, the key used to encrypt your data may no longer be available to decrypt it the next time your orchestration or entity executes. Customer encryption is therefore recommended only when orchestrations and entities are expected to run for relatively short periods of time.

## Customizing serialization and deserialization

# [C#](#tab/csharp)

### Default serialization logic

Durable Functions internally uses [Json.NET](https://www.newtonsoft.com/json/help/html/Introduction.htm) to serialize orchestration and entity data to JSON. The default settings Durable Functions uses for Json.NET are:

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

## Customizing serialization with .NET attributes

When serializing data, Json.NET looks for [various attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm) on classes and properties that control how the data is serialized and deserialized from JSON. If you own the source code for data type passed to Durable Functions APIs, consider adding these attributes to the type to customize serialization and deserialization.

## Customizing serialization with Dependency Injection

Function apps that target .NET and run on the Functions V3 runtime can use [Dependency Injection (DI)](../functions-dotnet-dependency-injection.md) to customize how data and exceptions are serialized. The sample code below demonstrates how to use DI to override the default Json.NET serialization settings using custom implementations of the `IMessageSerializerSettingsFactory` and `IErrorSerializerSettingsFactory` service interfaces.

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

Azure Functions Node applications use [`JSON.stringify()` for serialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`JSON.Parse()` for deserialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). Most types should serialize and deserialize seamlessly. In cases where the default logic is insufficient, defining a `toJSON()` method on the object will hijack the serialization logic. However, no analog exists for object deserialization.

For full customization of the serialization/deserialization pipeline, consider handling the serialization and deserialization with your own code and passing around data as strings.


# [Python](#tab/python)

### Serialization and deserialization logic

It is strongly recommended to use type annotations to ensure Durable Functions serializes and deserializes your data correctly. While many built-in types are handled automatically, some built-in data types require type annotations to preserve the type during deserialization.

For custom data types, you must define the JSON serialization and deserialization of a data type by exporting a static `to_json` and `from_json` method from your class.

---

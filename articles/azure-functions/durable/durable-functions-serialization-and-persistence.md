---
title: Data persistence and serialization in Durable Functions - Azure
description: Learn how the Durable Functions extension for Azure Functions persists data
author: cgillum
ms.topic: conceptual
ms.date: 07/18/2022
ms.author: azfuncdf
ms.devlang: csharp, java, javascript, python
ms.custom: devx-track-dotnet
#Customer intent: As a developer, I want to understand what data is persisted to durable storage, how that data is serialized, and how I can customize it when it doesn't work the way my app needs it to.
---

# Data persistence and serialization in Durable Functions (Azure Functions)

The Durable Functions runtime automatically persists function parameters, return values, and other state to the [task hub](durable-functions-task-hubs.md) in order to provide reliable execution. However, the amount and frequency of data persisted to durable storage can impact application performance and storage transaction costs. Depending on the type of data your application stores, data retention and privacy policies may also need to be considered.

## Task Hub Contents

Task hubs store the current state of instances, and any pending messages:

* *Instance states* store the current status and history of an instance. For orchestration instances, this state includes the runtime state, the orchestration history, inputs, outputs, and custom status. For entity instances, it includes the entity state.
* *Messages* store function inputs or outputs, event payloads, and metadata that is used for internal purposes, like routing and end-to-end correlation.

Messages are deleted after being processed, but instance states persist unless they're explicitly deleted by the application or an operator. In particular, an orchestration history remains in storage even after the orchestration completes.

For an example of how states and messages represent the progress of an orchestration, see the [task hub execution example](durable-functions-task-hubs.md#execution-example).

Where and how states and messages are represented in storage [depends on the storage provider](durable-functions-task-hubs.md#representation-in-storage). Durable Functions' default provider is [Azure Storage](durable-functions-azure-storage-provider.md), which persists data to queues, tables, and blobs in an [Azure Storage](https://azure.microsoft.com/services/storage/) account that you specify.

### Types of data that is serialized and persisted
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

### Working with sensitive data
When using the Azure Storage provider, all data is automatically encrypted at rest. However, anyone with access to the storage account can read the data in its unencrypted form. If you need stronger protection for sensitive data, consider first encrypting the data using your own encryption keys so that the data is persisted in its pre-encrypted form.

Alternatively, .NET users have the option of implementing custom serialization providers that provide automatic encryption. An example of custom serialization with encryption can be found in [this GitHub sample](https://github.com/charleszipp/azure-durable-entities-encryption).

> [!NOTE]
> If you decide to implement application-level encryption, be aware that orchestrations and entities can exist for indefinite amounts of time. This matters when it comes time to rotate your encryption keys because an orchestration or entities may run longer than your key rotation policy. If a key rotation happens, the key used to encrypt your data may no longer be available to decrypt it the next time your orchestration or entity executes. Customer encryption is therefore recommended only when orchestrations and entities are expected to run for relatively short periods of time.

## Customizing serialization and deserialization

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

## Customizing serialization with .NET attributes

During serialization, Json.NET looks for [various attributes](https://www.newtonsoft.com/json/help/html/SerializationAttributes.htm) on classes and properties that control how the data is serialized and deserialized from JSON. If you own the source code for data type passed to Durable Functions APIs, consider adding these attributes to the type to customize serialization and deserialization.

## Customizing serialization with Dependency Injection

Function apps that target .NET and run on the Functions V3 runtime can use [Dependency Injection (DI)](../functions-dotnet-dependency-injection.md) to customize how data and exceptions are serialized. The following sample code demonstrates how to use DI to override the default Json.NET serialization settings using custom implementations of the `IMessageSerializerSettingsFactory` and `IErrorSerializerSettingsFactory` service interfaces.

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

# [C# (Isolated)](#tab/csharp-isolated)
### .NET Isolated and System.Text.Json

Durable Functions running in the [.NET Isolated worker process](../dotnet-isolated-process-guide.md) uses the same object-serializer configured globally for your Azure Functions app (see [WorkerOptions](/dotnet/api/microsoft.azure.functions.worker.workeroptions)). This serializer happens to be [System.Text.Json](/dotnet/api/system.text.json) by default rather than Newtonsoft.Json. Any changes to `WorkerOptions.Serializer` will transitively apply to Durable Functions.

For more information on the built-in support for JSON serialization in .NET, see the [JSON serialization and deserialization in .NET overview documentation](/dotnet/standard/serialization/system-text-json-overview).

# [JavaScript](#tab/javascript)

### Serialization and deserialization logic

Azure Functions Node applications use [`JSON.stringify()` for serialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`JSON.Parse()` for deserialization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse). Most types should serialize and deserialize seamlessly. In cases where the default logic is insufficient, defining a `toJSON()` method on the object will hijack the serialization logic. However, no analog exists for object deserialization.

For full customization of the serialization/deserialization pipeline, consider handling the serialization and deserialization with your own code and passing around data as strings.


# [Python](#tab/python)

### Serialization and deserialization logic

It's recommended to use type annotations to ensure Durable Functions serializes and deserializes your data correctly. While many built-in types are handled automatically, some built-in data types require type annotations to preserve the type during deserialization.

For custom data types, you must define the JSON serialization and deserialization of a data type by exporting a static `to_json` and `from_json` method from your class.

# [Java](#tab/java)

Java uses the [Jackson v2.x](https://github.com/FasterXML/jackson#jackson-project-home-github) libraries for serialization and deserialization of data payloads. You can use [Jackson annotations](https://github.com/FasterXML/jackson-annotations/wiki/Jackson-Annotations) on your POJO types to customize the serialization behavior.

---

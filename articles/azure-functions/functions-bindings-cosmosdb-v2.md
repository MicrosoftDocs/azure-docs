---
title: Azure Cosmos DB bindings for Functions 2.x and higher
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
ms.topic: reference
ms.custom: ignite-2022, devx-track-extended-java, devx-track-js, devx-track-python
ms.date: 11/29/2022
zone_pivot_groups: programming-languages-set-functions
---

# Azure Cosmos DB trigger and bindings for Azure Functions 2.x and higher overview

> [!div class="op_single_selector" title1="Select the version of the Azure Functions runtime you are using: "]
> * [Version 1](functions-bindings-cosmosdb.md)
> * [Version 2 and higher](functions-bindings-cosmosdb-v2.md)

This set of articles explains how to work with [Azure Cosmos DB](../cosmos-db/serverless-computing-database.md) bindings in Azure Functions 2.x and higher. Azure Functions supports trigger, input, and output bindings for Azure Cosmos DB.

| Action | Type |
|---------|---------|
| Run a function when an Azure Cosmos DB document is created or modified | [Trigger](./functions-bindings-cosmosdb-v2-trigger.md) |
| Read an Azure Cosmos DB document | [Input binding](./functions-bindings-cosmosdb-v2-input.md) |
| Save changes to an Azure Cosmos DB document  |[Output binding](./functions-bindings-cosmosdb-v2-output.md) |

> [!NOTE]
> This reference is for [Azure Functions version 2.x and higher](functions-versions.md).  For information about how to use these bindings in Functions 1.x, see [Azure Cosmos DB bindings for Azure Functions 1.x](functions-bindings-cosmosdb.md).
>
> This binding was originally named DocumentDB. In Azure Functions version 2.x and higher, the trigger, bindings, and package are all named Azure Cosmos DB.

## Supported APIs

[!INCLUDE [SQL API support only](../../includes/functions-cosmosdb-sqlapi-note.md)]

::: zone pivot="programming-language-csharp"
## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [Isolated worker model](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [In-process model](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

In a variation of this model, Functions can be run using [C# scripting], which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The process for installing the extension varies depending on the extension version:

# [Extension 4.x+](#tab/extensionv4/in-process)

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 4.x._

This version of the Azure Cosmos DB bindings extension introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md). 

This version also changes the types that you can bind to, replacing the types from the v2 SDK `Microsoft.Azure.DocumentDB` with newer types from the v3 SDK [Microsoft.Azure.Cosmos](../cosmos-db/sql/sql-api-sdk-dotnet-standard.md). Learn more about how these new types are different and how to migrate to them from the [SDK migration guide](../cosmos-db/sql/migrate-dotnet-v3.md), [trigger](./functions-bindings-cosmosdb-v2-trigger.md), [input binding](./functions-bindings-cosmosdb-v2-input.md), and [output binding](./functions-bindings-cosmosdb-v2-output.md) examples.

This extension version is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB), version 4.x.

# [Functions 2.x+](#tab/functionsv2/in-process)

_This section describes using a [class library](./functions-dotnet-class-library.md). For [C# scripting], you would need to instead [install the extension bundle][Update your extensions], version 2.x or 3.x._

Working with the trigger and bindings requires that you reference the appropriate NuGet package. Install the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB/3.0.10), version 3.x.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

This version of the Azure Cosmos DB bindings extension introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md). 

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB/), version 4.x.

If you're writing your application using F#, you must also configure this extension as part of the app's [startup configuration](./dotnet-isolated-process-guide.md#start-up-and-configuration). In the call to `ConfigureFunctionsWorkerDefaults()` or `ConfigureFunctionsWebApplication()`, add a delegate that takes an `IFunctionsWorkerApplication` parameter. Then within the body of that delegate, call `ConfigureCosmosDBExtension()` on the object:

```fsharp
let hostBuilder = new HostBuilder()
hostBuilder.ConfigureFunctionsWorkerDefaults(fun (context: HostBuilderContext) (appBuilder: IFunctionsWorkerApplicationBuilder) ->
    appBuilder.ConfigureCosmosDBExtension() |> ignore
) |> ignore
```

# [Functions 2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB/), version 3.x.

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Azure Cosmos DB bindings extension is part of an [extension bundle], which is specified in your *host.json* project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

::: zone-end  
::: zone pivot="programming-language-java"   
[!INCLUDE [functions-cosmosdb-extension-java-note](../../includes/functions-cosmosdb-extension-java-note.md)]
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-java,programming-language-powershell"   

# [Bundle v4.x](#tab/extensionv4)

This version of the bundle contains version 4.x of the Azure Cosmos DB bindings extension that introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md).

You can add this version of the extension from the preview extension bundle v4 by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle.Preview",
    "version": "[4.0.0, 5.0.0)"
  }
}
```

To learn more, see [Update your extensions].

# [Bundle v2.x and v3.x](#tab/functionsv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x or 3.x.

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [Isolated worker model](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  

# [In-process model](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
---

Choose a version to see binding type details for the mode and version. 

# [Extension 4.x+](#tab/extensionv4/in-process)

The Azure Cosmos DB extension supports parameter types according to the table below.

| Binding scenario | Parameter types |
|-|-|-| 
| Cosmos DB trigger (single document) | JSON serializable types<sup>1</sup> |
| Cosmos DB trigger (batch of documents) | `IEnumerable<T>`where `T` is a JSON serializable type<sup>1</sup> |
| Cosmos DB input (single document) | JSON serializable types<sup>1</sup><br/> | 
| Cosmos DB input (query returning multiple documents) | [CosmosClient]<br/>`IEnumerable<T>` where `T` is a JSON serializable type<sup>1</sup> |
| Cosmos DB output (single document) | JSON serializable types<sup>1</sup> |
| Cosmos DB output (multiple documents) | `ICollector<T>` or `IAsyncCollector<T>` where `T` is a JSON serializable type<sup>1</sup> |

<sup>1</sup> Documents containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

# [Functions 2.x+](#tab/functionsv2/in-process)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.Documents] namespace. Newer types from [Microsoft.Azure.Cosmos] are exclusive to **extension 4.x and higher**.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

The isolated worker process supports parameter types according to the tables below. Support for binding to types from [Microsoft.Azure.Cosmos]is in preview.

**Cosmos DB trigger**

[!INCLUDE [functions-bindings-cosmosdb-v2-trigger-dotnet-isolated-types](../../includes/functions-bindings-cosmosdb-v2-trigger-dotnet-isolated-types.md)]

**Cosmos DB input binding**

[!INCLUDE [functions-bindings-cosmosdb-v2-input-dotnet-isolated-types](../../includes/functions-bindings-cosmosdb-v2-input-dotnet-isolated-types.md)]

**Cosmos DB output binding**

[!INCLUDE [functions-bindings-cosmosdb-v2-output-dotnet-isolated-types](../../includes/functions-bindings-cosmosdb-v2-output-dotnet-isolated-types.md)]

# [Functions 2.x+](#tab/functionsv2/isolated-process)

Earlier versions of extensions in the isolated worker process only support binding to JSON serializable types. Additional options are available to **extension 4.x and higher**.

---

[Microsoft.Azure.Cosmos]: /dotnet/api/microsoft.azure.cosmos
[CosmosClient]: /dotnet/api/microsoft.azure.cosmos.cosmosclient
[Database]: /dotnet/api/microsoft.azure.cosmos.database
[Container]: /dotnet/api/microsoft.azure.cosmos.container

[Microsoft.Azure.Documents]: /dotnet/api/microsoft.azure.documents
[DocumentClient]: /dotnet/api/microsoft.azure.documents.client.documentclient

:::zone-end

## Exceptions and return codes

| Binding | Reference |
|---|---|
| Azure Cosmos DB | [HTTP status codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

<a name="host-json"></a>

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

# [Extension 4.x+](#tab/extensionv4)

```json
{
    "version": "2.0",
    "extensions": {
        "cosmosDB": {
            "connectionMode": "Gateway",
            "userAgentSuffix": "MyDesiredUserAgentStamp"
        }
    }
}
```

|Property  |Default |Description |
|----------|--------|------------|
|**connectionMode**|`Gateway`|The connection mode used by the function when connecting to the Azure Cosmos DB service. Options are `Direct` and `Gateway`|
|**userAgentSuffix**| n/a | Adds the specified string value to all requests made by the trigger or binding to the service. This makes it easier for you to track the activity in Azure Monitor, based on a specific function app and filtering by `User Agent`.


# [Functions 2.x+](#tab/functionsv2)

```json
{
    "version": "2.0",
    "extensions": {
        "cosmosDB": {
            "connectionMode": "Gateway",
            "protocol": "Https",
            "leaseOptions": {
                "leasePrefix": "prefix1"
            }
        }
    }
}
```

|Property  |Default |Description |
|----------|--------|------------|
|**connectionMode**|`Gateway`|The connection mode used by the function when connecting to the Azure Cosmos DB service. Options are `Direct` and `Gateway`|
|**protocol**|`Https`|The connection protocol used by the function when connection to the Azure Cosmos DB service. Read [here for an explanation of both modes](../cosmos-db/performance-tips.md#networking). |
|**leasePrefix**|n/a|Lease prefix to use across all functions in an app. |


---

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md

[C# scripting]: ./functions-reference-csharp.md

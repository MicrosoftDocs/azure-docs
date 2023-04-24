---
title: Azure Cosmos DB bindings for Functions 2.x and higher
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
ms.topic: reference
ms.custom: ignite-2022
ms.date: 11/29/2022
zone_pivot_groups: programming-languages-set-functions-lang-workers
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

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated worker process](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The process for installing the extension varies depending on the extension version:

# [Functions 2.x+](#tab/functionsv2/in-process)

Working with the trigger and bindings requires that you reference the appropriate NuGet package. Install the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB/3.0.10), version 3.x.

# [Extension 4.x+](#tab/extensionv4/in-process)

This version of the Azure Cosmos DB bindings extension introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md). 

This version also changes the types that you can bind to, replacing the types from the v2 SDK `Microsoft.Azure.DocumentDB` with newer types from the v3 SDK [Microsoft.Azure.Cosmos](../cosmos-db/sql/sql-api-sdk-dotnet-standard.md). Learn more about how these new types are different and how to migrate to them from the [SDK migration guide](../cosmos-db/sql/migrate-dotnet-v3.md), [trigger](./functions-bindings-cosmosdb-v2-trigger.md), [input binding](./functions-bindings-cosmosdb-v2-input.md), and [output binding](./functions-bindings-cosmosdb-v2-output.md) examples.

This extension version is available as a [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB), version 4.x.

# [Functions 2.x+](#tab/functionsv2/isolated-process)

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB/), version 3.x.

# [Extension 4.x+](#tab/extensionv4/isolated-process)

This version of the Azure Cosmos DB bindings extension introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md). 

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB/), version 4.x.

# [Functions 2.x+](#tab/functionsv2/csharp-script)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Extension 4.x+](#tab/extensionv4/csharp-script)

This extension version is available from the extension bundle v4 by adding the following lines in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.0.0, 5.0.0)"
  }
}
```

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle

The Azure Cosmos DB bindings extension is part of an [extension bundle], which is specified in your *host.json* project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v2.x and v3.x](#tab/functionsv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x or 3.x.

[!INCLUDE [functions-extension-bundles-json-v3](../../includes/functions-extension-bundles-json-v3.md)]

# [Bundle v4.x](#tab/extensionv4)

This version of the bundle contains version 4.x of the Azure Cosmos DB bindings extension that introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md).

::: zone-end  
::: zone pivot="programming-language-java"   
[!INCLUDE [functions-cosmosdb-extension-java-note](../../includes/functions-cosmosdb-extension-java-note.md)]
::: zone-end  
::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"   

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

---

::: zone-end

::: zone pivot="programming-language-csharp"

## Binding types

The binding types supported for .NET depend on both the extension version and C# execution mode, which can be one of the following: 
   
# [In-process class library](#tab/in-process)

An in-process class library is a compiled C# function runs in the same process as the Functions runtime.
 
# [Isolated process](#tab/isolated-process)

An isolated worker process class library compiled C# function runs in a process isolated from the runtime.  
   
# [C# script](#tab/csharp-script)

C# script is used primarily when creating C# functions in the Azure portal.

---

Choose a version to see binding type details for the mode and version. 

# [Extension 4.x and higher](#tab/extensionv4/in-process)

The Azure Cosmos DB extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Cosmos DB trigger | JSON serializable types<sup>1</sup><br/>`IEnumerable<T>`<sup>2</sup> |
| Cosmos DB input | JSON serializable types<sup>1</sup><br/>`IEnumerable<T>`<sup>2</sup><br/>[CosmosClient] | 
| Cosmos DB output | JSON serializable types<sup>1</sup> |

<sup>1</sup> Documents containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

<sup>2</sup> `IEnumerable<T>` provides a collection of documents. Here, `T` is a JSON serializable type. When specified for a trigger, it allows a single invocation to process a batch of documents. When used for an input binding, this allows multiple documents to be returned by the query.

# [Functions 2.x and higher](#tab/functionsv2/in-process)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.Documents] namespace. Newer types from [Microsoft.Azure.Cosmos] are exclusive to **extension 4.x and higher**.

# [Extension 4.x and higher](#tab/extensionv4/isolated-process)

The isolated worker process supports parameter types according to the table below. Binding to JSON serializeable types is currently the only option that is generally available. Support for binding to types from [Microsoft.Azure.Cosmos] is in preview.

| Binding | Parameter types | Preview parameter types<sup>1</sup> |
|-|-|-| 
| Cosmos DB trigger | JSON serializable types<sup>2</sup><br/>`IEnumerable<T>`<sup>3</sup> | *No preview types* |
| Cosmos DB input | JSON serializable types<sup>2</sup><br/>`IEnumerable<T>`<sup>3</sup> | [CosmosClient]<br/>[Database]<br/>[Container] |
| Cosmos DB output | JSON serializable types<sup>2</sup> | *No preview types*<sup>4</sup> |

<sup>1</sup> Preview types require use of [Microsoft.Azure.Functions.Worker.Extensions.CosmosDB 4.1.0-preview1 or later][sdk-types-extension-version], [Microsoft.Azure.Functions.Worker 1.12.1-preview1 or later][sdk-types-worker-version], and [Microsoft.Azure.Functions.Worker.Sdk 1.9.0-preview1 or later][sdk-types-worker-sdk-version]. When developing on your local machine, you will need [Azure Functions Core Tools version 4.0.5000 or later](./functions-run-local.md). When using a preview type, [binding expressions](./functions-bindings-expressions-patterns.md) that rely on trigger data are not supported.

[sdk-types-extension-version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.CosmosDB/4.1.0-preview1
[sdk-types-worker-version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker/1.12.1-preview1
[sdk-types-worker-sdk-version]: https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Sdk/1.9.0-preview1

<sup>2</sup> Documents containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

<sup>3</sup> `IEnumerable<T>` provides a collection of documents. Here, `T` is a JSON serializable type. When specified for a trigger, it allows a single invocation to process a batch of documents. When used for an input binding, this allows multiple documents to be returned by the query.

<sup>4</sup> Support for SDK type bindings does not presently extend to output bindings.

# [Functions 2.x and higher](#tab/functionsv2/isolated-process)

Earlier versions of extensions in the isolated worker process only support binding to JSON serializable types. Additional options are available to **extension 4.x and higher**.

# [Extension 4.x and higher](#tab/extensionv4/csharp-script)

The Azure Cosmos DB extension supports parameter types according to the table below.

| Binding | Parameter types |
|-|-|-| 
| Cosmos DB trigger | JSON serializable types<sup>1</sup><br/>`IEnumerable<T>`<sup>2</sup> |
| Cosmos DB input | JSON serializable types<sup>1</sup><br/>`IEnumerable<T>`<sup>2</sup><br/>[CosmosClient] | 
| Cosmos DB output | JSON serializable types<sup>1</sup> |

<sup>1</sup> Documents containing JSON data can be deserialized into known plain-old CLR object (POCO) types.

<sup>2</sup> `IEnumerable<T>` provides a collection of documents. Here, `T` is a JSON serializable type. When specified for a trigger, it allows a single invocation to process a batch of documents. When used for an input binding, this allows multiple documents to be returned by the query.

# [Functions 2.x and higher](#tab/functionsv2/csharp-script)

Earlier versions of the extension exposed types from the now deprecated [Microsoft.Azure.Documents] namespace. Newer types from [Microsoft.Azure.Cosmos] are exclusive to **extension 4.x and higher**.

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

---

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)

[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md

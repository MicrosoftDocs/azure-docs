---
title: Azure Cosmos DB bindings for Functions 2.x and higher
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
author: craigshoemaker
ms.topic: reference
ms.date: 09/01/2021
ms.author: cshoe
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
> This binding was originally named DocumentDB. In Functions version 2.x and higher, the trigger, bindings, and package are all named Cosmos DB.

## Supported APIs

[!INCLUDE [SQL API support only](../../includes/functions-cosmosdb-sqlapi-note.md)]

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB
[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Cosmos DB extension 4.x and higher

A new version of the Cosmos DB bindings extension is available as a [preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB/4.0.0-preview1). This preview introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For .NET applications, it also changes the types that you can bind to, replacing the types from the v2 SDK `Microsoft.Azure.DocumentDB` with newer types from the v3 SDK [Microsoft.Azure.Cosmos](../cosmos-db/sql/sql-api-sdk-dotnet-standard.md). Learn more about how these new types are different and how to migrate to them from the [SDK migration guide](../cosmos-db/sql/migrate-dotnet-v3.md), [trigger](./functions-bindings-cosmosdb-v2-trigger.md), [input binding](./functions-bindings-cosmosdb-v2-input.md), and [output binding](./functions-bindings-cosmosdb-v2-output.md) examples.

> [!NOTE]
> Currently, authentication with an identity instead of a secret using the 4.x preview extension is only available for Elastic Premium plans. 

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

## Exceptions and return codes

| Binding | Reference |
|---|---|
| CosmosDB | [CosmosDB Error Codes](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

<a name="host-json"></a>

## host.json settings

This section describes the global configuration settings available for this binding in Azure Functions version 2.x. For more information about global configuration settings in Azure Functions version 2.x, see [host.json reference for Azure Functions version 2.x](functions-host-json.md).

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
|GatewayMode|Gateway|The connection mode used by the function when connecting to the Azure Cosmos DB service. Options are `Direct` and `Gateway`|
|Protocol|Https|The connection protocol used by the function when connection to the Azure Cosmos DB service. Read [here for an explanation of both modes](../cosmos-db/performance-tips.md#networking). <br><br> This setting is not available in [version 4.x of the extension](#cosmos-db-extension-4x-and-higher). |
|leasePrefix|n/a|Lease prefix to use across all functions in an app. <br><br> This setting is not available in [version 4.x of the extension](#cosmos-db-extension-4x-and-higher).|

## Next steps

- [Run a function when an Azure Cosmos DB document is created or modified (Trigger)](./functions-bindings-cosmosdb-v2-trigger.md)
- [Read an Azure Cosmos DB document (Input binding)](./functions-bindings-cosmosdb-v2-input.md)
- [Save changes to an Azure Cosmos DB document (Output binding)](./functions-bindings-cosmosdb-v2-output.md)
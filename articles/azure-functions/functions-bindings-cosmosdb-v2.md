---
title: Azure Cosmos DB bindings for Functions 2.x and higher
description: Understand how to use Azure Cosmos DB triggers and bindings in Azure Functions.
author: craigshoemaker
ms.topic: reference
ms.date: 09/01/2021
ms.author: cshoe
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

A new version of the Cosmos DB bindings extension is available in preview. It introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For a tutorial on configuring your function apps with managed identities, see the [creating a function app with identity-based connections tutorial](./functions-identity-based-connections-tutorial.md). For .NET applications, the new extension version also changes the types that you can bind to, replacing the types from the v2 SDK `Microsoft.Azure.DocumentDB` with newer types from the v3 SDK [Microsoft.Azure.Cosmos](../cosmos-db/sql/sql-api-sdk-dotnet-standard.md). Learn more about how these new types are different and how to migrate to them from the [SDK migration guide](../cosmos-db/sql/migrate-dotnet-v3.md), [trigger](./functions-bindings-cosmosdb-v2-trigger.md), [input binding](./functions-bindings-cosmosdb-v2-input.md), and [output binding](./functions-bindings-cosmosdb-v2-output.md) examples.

This extension version is available as a [preview NuGet package]. To learn more, see [Update your extensions].

[preview NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB/4.0.0-preview2

> [!NOTE]
> Currently, authentication with an identity instead of a secret using the 4.x preview extension is only available for Elastic Premium plans.

::: zone pivot="programming-language-csharp"

## Install extension

The extension NuGet package you install depends on the C# mode you're using in your function app: 

# [In-process](#tab/in-process)

Functions execute in the same process as the Functions host. To learn more, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md).

# [Isolated process](#tab/isolated-process)

Functions execute in an isolated C# worker process. To learn more, see [Guide for running C# Azure Functions in an isolated process](dotnet-isolated-process-guide.md).

# [C# script](#tab/csharp-script)

Functions run as C# script, which is supported primarily for C# portal editing. To update existing binding extensions for C# script apps running in the portal without having to republish your function app, see [Update your extensions].

---

The functionality of the extension varies depending on the extension version:

<!-- Update the Extension version tabs to reflect on the extension versions supported for the particular bindings. 
The first set of 2-way tabs are displayed when the In-process tab is selected (in the include above), otherwise the second set for isolated-process are displayed. If you have questions, ping glenga.-->

# [Extension v3.x](#tab/extensionv3/in-process)

<!-- An example of a preview NuGet package for WebJobs might look like the following: 

Preview version of the extension that supports new Event Grid binding parameter types of [Azure.Messaging.CloudEvent](/dotnet/api/azure.messaging.cloudevent) and [Azure.Messaging.EventGrid.EventGridEvent](/dotnet/api/azure.messaging.eventgrid.eventgridevent).

Add the preview extension to your project by installing the [NuGet package], version 3.x. 
-->
Preview version of the extension that supports the new Cosmos DB binding extension [NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB.

Add the preview extension to your project by installing the [NuGet package], version 3.x.

# [Extension v2.x](#tab/extensionv2/in-process)

This extension version is available by installing the [NuGet package], version 2.x.

# [Functions 1.x](#tab/functionsv1/in-process)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x. 

# [Extension v3.x](#tab/extensionv3/isolated-process)

<!-- Must link to the specific version package under www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.*. An example for a preview package version might look like the following:

Add the extension to your project by installing the [NuGet package](https://www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.EventGrid), version 3.x.
-->
Add the extension to your project by installing [NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB, version 3.x.


# [Extension v2.x](#tab/extensionv2/isolated-process)

<!-- Must include at least the NuGet package link under www.nuget.org/packages/Microsoft.Azure.Functions.Worker.Extensions.* and specific major version.-->
Add the extension to your project by installing [NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB, version 2.x.


# [Functions 1.x](#tab/functionsv1/isolated-process)

Functions version 1.x doesn't support isolated process.

# [Extension v3.x](#tab/extensionv3/csharp-script)

<!-- Should contain the same intro content as the #tab/extensionv3/in-process tab.-->

You can install this version of the extension in your function app by registering the [NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB, version 3.x.

# [Extension v2.x](#tab/extensionv2/csharp-script)

<!-- Should contain the same intro content as the #tab/extensionv3/in-process tab.-->

You can install this version of the extension in your function app by registering the [NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.CosmosDB, version 3.x.

# [Functions 1.x](#tab/functionsv1/csharp-script)

Functions 1.x apps automatically have a reference to the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

---

::: zone-end  

::: zone pivot="programming-language-javascript,programming-language-python,programming-language-java,programming-language-powershell"  

## Install bundle    

The Cosmos DB is part of an [extension bundle], which is specified in your host.json project file. You may need to modify this bundle to change the version of the binding, or if bundles aren't already installed. To learn more, see [extension bundle].

# [Bundle v3.x](#tab/extensionv3)

You can add this version of the extension from the preview extension bundle v3 by adding or replacing the following code in your `host.json` file:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[3.3.0, 4.0.0)"
  }
}
```

To learn more, see [Update your extensions].

# [Bundle v2.x](#tab/extensionv2)

You can install this version of the extension in your function app by registering the [extension bundle], version 2.x.

# [Functions 1.x](#tab/functionsv1)

Functions 1.x apps automatically have a reference to the extension.

---

::: zone-end

## Exceptions and return codes

| Binding | Reference |
|---|---|
| CosmosDB | [CosmosDB Error Codes](/rest/api/cosmos-db/http-status-codes-for-cosmosdb) |

<a name="host-json"></a>

## host.json settings

[!INCLUDE [functions-host-json-section-intro](../../includes/functions-host-json-section-intro.md)]

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

[extension bundle]: ./functions-bindings-register.md#extension-bundles

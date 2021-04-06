---
title: Azure Blob storage trigger and bindings for Azure Functions
description: Learn to use the Azure Blob storage trigger and bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/13/2020
ms.author: cshoe
---

# Azure Blob storage bindings for Azure Functions overview

Azure Functions integrates with [Azure Storage](../storage/index.yml) via [triggers and bindings](./functions-triggers-bindings.md). Integrating with Blob storage allows you to build functions that react to changes in blob data as well as read and write values.

| Action | Type |
|---------|---------|
| Run a function as blob storage data changes | [Trigger](./functions-bindings-storage-blob-trigger.md) |
| Read blob storage data in a function | [Input binding](./functions-bindings-storage-blob-input.md) |
| Allow a function to write blob storage data |[Output binding](./functions-bindings-storage-blob-output.md) |

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

#### Storage extension 5.x and higher

A new version of the Storage bindings extension is available as a [preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage/5.0.0-beta.2). This preview introduces the ability to [connect using an identity instead of a secret](./functions-reference.md#configure-an-identity-based-connection). For .NET applications, it also changes the types that you can bind to, replacing the types from `WindowsAzure.Storage` and `Microsoft.Azure.Storage` with newer types from [Azure.Storage.Blobs](/dotnet/api/azure.storage.blobs).

> [!NOTE]
> The preview package is not included in an extension bundle and must be installed manually. For .NET apps, add a reference to the package. For all other app types, see [Update your extensions].

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Storage
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

[!INCLUDE [functions-storage-sdk-version](../../includes/functions-storage-sdk-version.md)]

## host.json settings

> [!NOTE]
> This section does not apply when using extension versions prior to 5.0.0. For those versions, there are no global configuration settings for blobs.

This section describes the global configuration settings available for this binding when using [extension version 5.0.0 and higher](#storage-extension-5x-and-higher). The example *host.json* file below contains only the version 2.x+ settings for this binding. For more information about global configuration settings in Functions versions 2.x and beyond, see [host.json reference for Azure Functions](functions-host-json.md).

```json
{
    "version": "2.0",
    "extensions": {
        "blobs": {
            "maxDegreeOfParallelism": "4"
        }
    }
}
```

|Property  |Default | Description |
|---------|---------|---------|
|maxDegreeOfParallelism|8 * (the number of available cores)|The integer number of concurrent invocations allowed for each blob-triggered function. The minimum allowed value is 1.|

## Next steps

- [Run a function when blob storage data changes](./functions-bindings-storage-blob-trigger.md)
- [Read blob storage data when a function runs](./functions-bindings-storage-blob-input.md)
- [Write blob storage data from a function](./functions-bindings-storage-blob-output.md)

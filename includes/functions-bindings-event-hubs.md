---
author: craigshoemaker
ms.service: azure-functions
ms.topic: include
ms.date: 02/21/2020
ms.author: cshoe
---

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension] is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs
[core tools]: ../articles/azure-functions/functions-run-local.md
[extension bundle]: ../articles/azure-functions/functions-bindings-register.md#extension-bundles
[Update your extensions]: ../articles/azure-functions/functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Event Hubs extension 5.x and higher

A new version of the Event Hubs bindings extension is available as a [preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs/5.0.0-beta.4). This preview introduces the ability to [connect using an identity instead of a secret](../articles/azure-functions/functions-reference.md#configure-an-identity-based-connection). For .NET applications, it also changes the types that you can bind to, replacing the types from `Microsoft.Azure.EventHubs` with newer types from [Azure.Messaging.EventHubs](/dotnet/api/azure.messaging.eventhubs).

> [!NOTE]
> The preview package is not included in an extension bundle and must be installed manually. For .NET apps, add a reference to the package. For all other app types, see [Update your extensions].

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.EventHubs/
[Update your extensions]: ./functions-bindings-register.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

## host.json settings
<a name="host-json"></a>

The [host.json](../articles/azure-functions/functions-host-json.md#eventhub) file contains settings that control Event Hubs trigger behavior. The configuration is different depending on the Azure Functions version.

[!INCLUDE [functions-host-json-event-hubs](../articles/azure-functions/../../includes/functions-host-json-event-hubs.md)]
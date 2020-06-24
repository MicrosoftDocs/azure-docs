---
title: Azure Functions HTTP triggers and bindings
description: Learn to use HTTP triggers and bindings in Azure Functions.
author: craigshoemaker

ms.topic: reference
ms.date: 02/14/2020
ms.author: cshoe
---

# Azure Functions HTTP triggers and bindings overview

Azure Functions may be invoked via HTTP requests to build serverless APIs and respond to [webhooks](https://en.wikipedia.org/wiki/Webhook).

| Action | Type |
|---------|---------|
| Run a function from an HTTP request | [Trigger](./functions-bindings-http-webhook-trigger.md) |
| Return an HTTP response from a function |[Output binding](./functions-bindings-http-webhook-output.md) |

The code in this article defaults to .NET Core syntax, used in Functions version 2.x and higher. For information on the 1.x syntax, see the [1.x functions templates](https://github.com/Azure/azure-functions-templates/tree/v1.x/Functions.Templates/Templates).

## Add to your Functions app

### Functions 2.x and higher

Working with the trigger and bindings requires that you reference the appropriate package. The NuGet package is used for .NET class libraries while the extension bundle is used for all other application types.

| Language                                        | Add by...                                   | Remarks 
|-------------------------------------------------|---------------------------------------------|-------------|
| C#                                              | Installing the [NuGet package], version 3.x | |
| C# Script, Java, JavaScript, Python, PowerShell | Registering the [extension bundle]          | The [Azure Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) is recommended to use with Visual Studio Code. |
| C# Script (online-only in Azure portal)         | Adding a binding                            | To update existing binding extensions without having to republish your function app, see [Update your extensions]. |

[core tools]: ./functions-run-local.md
[extension bundle]: ./functions-bindings-register.md#extension-bundles
[NuGet package]: https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.Http
[Update your extensions]: ./install-update-binding-extensions-manual.md
[Azure Tools extension]: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack

### Functions 1.x

Functions 1.x apps automatically have a reference the [Microsoft.Azure.WebJobs](https://www.nuget.org/packages/Microsoft.Azure.WebJobs) NuGet package, version 2.x.

## Next steps

- [Run a function from an HTTP request](./functions-bindings-http-webhook-trigger.md)
- [Return an HTTP response from a function](./functions-bindings-http-webhook-output.md)

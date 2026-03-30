---
title: Azure DocumentDB Bindings
titleSuffix: Azure Functions
description: Learn how to use Azure DocumentDB bindings including triggers, input, and output bindings in Azure Functions. Get started with code examples.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 11/19/2025
ms.custom:
  - sfi-ropc-nochange
---

# Azure DocumentDB bindings for Azure Functions

[!INCLUDE [functions-bindings-documentdb-preview](../../includes/functions-bindings-documentdb-preview.md)]

The Azure DocumentDB bindings for Azure Functions enable you to integrate your serverless applications with Azure DocumentDB collections. The [Azure DocumentDB](/azure/documentdb/overview) extension supports trigger, input, and output bindings for Azure DocumentDB.

Using the Azure DocumentDB extension, you can build functions that can:

| Action | Trigger/binding type |
| --- | --- |
| Execute on changes to a collection | [Azure DocumentDB trigger](functions-bindings-documentdb-trigger.md) |
| Write documents to the database | [Azure DocumentDB output binding](functions-bindings-documentdb-output.md)| 
| Query the database | [Azure DocumentDB input binding](functions-bindings-documentdb-input.md) |

Here are things you should consider when using the Azure DocumentDB extension:

- Only [.NET/C# apps that use the legacy in-process model](functions-dotnet-class-library.md) are currently supported in preview.

- The Azure DocumentDB binding extension doesn't currently support Microsoft Entra ID authentication and managed identities. 

- Your app must be using version `4.x` of the Azure Functions runtime.

[!INCLUDE [functions-in-process-model-retirement-note](../../includes/functions-in-process-model-retirement-note.md)]

## Install the extension 

Add the extension to your .NET project for an in-process app by installing [the `Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo` preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo).

> [!IMPORTANT]
> While this extension has `AzureCosmosDb` in the name, the specified extension is the correct one for integrating with Azure DocumentDB.

> [!WARNING]  
> Don't try to install this package in a .NET isolated worker process app. Errors occur and the app project can't build. To learn how to create a .NET app that uses the legacy in-process model, see [Develop legacy C# class library functions using Azure Functions](functions-dotnet-class-library.md#develop-legacy-c-class-library-functions-using-azure-functions).

## Related articles
 
- [What is Azure DocumentDB?](/azure/documentdb/overview)
- [Azure DocumentDB trigger for Azure Functions](functions-bindings-documentdb-trigger.md)
- [Azure DocumentDB input binding for Azure Functions](functions-bindings-documentdb-input.md)
- [Azure DocumentDB output binding for Azure Functions](functions-bindings-documentdb-output.md)

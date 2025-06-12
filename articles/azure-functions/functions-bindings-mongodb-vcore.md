---
title: Azure Cosmos DB for MongoDB (vCore) bindings for Azure Functions
description:  Learn to use the Azure Cosmos DB for MongoDB (vCore) trigger in Azure Functions.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 5/8/2025
ms.custom: 
  - build-2025
---

# Azure Cosmos DB for MongoDB (vCore) bindings for Azure Functions

The Azure Cosmos DB for MongoDB (vCore) extension supports trigger, input, and output bindings for Azure Cosmos DB for MongoDB (vCore). 

[!INCLUDE [functions-bindings-mongodb-vcore-preview](../../includes/functions-bindings-mongodb-vcore-preview.md)]

Using the Azure Cosmos DB for MongoDB (vCore) extension, you can build functions that can:

| Action  | Trigger/binding type |
|---------|-----------|
| Execute on changes to a collection | [Azure Cosmos DB for MongoDB (vCore) trigger](functions-bindings-mongodb-vcore-trigger.md) |
| Write documents to the database | [Azure Cosmos DB for MongoDB (vCore) output binding](functions-bindings-mongodb-vcore-output.md)| 
| Query the database | [Azure Cosmos DB for MongoDB (vCore) input binding](functions-bindings-mongodb-vcore-input.md) |

Considerations for the Azure Cosmos DB for MongoDB (vCore) extension:
+ Only [C# apps that run in-proces with the host](./functions-dotnet-class-library.md) are currently supported in preview.
+ The Azure Cosmos DB for MongoDB (vCore) binding extension doesn't currently support Microsoft Entra authentication and managed identities. 
+ Your app must be using version 4.x of the Azure Functions runtime.

## Install extension 

Add the extension to your .NET project for an in-process app by installing [this preview NuGet package](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo/1.1.0-preview):

`Microsoft.Azure.WebJobs.Extensions.AzureCosmosDb.Mongo`

>[!NOTE]  
>Don't try to install this package in a .NET isolated worker process app. There will be errors and the app project won't build. To learn how to create a .NET app that uses the in-process model, see [Develop C# class library functions using Azure Functions](functions-dotnet-class-library.md#develop-c-class-library-functions-using-azure-functions). 

## Related articles
 
- [What is Azure Cosmos DB for MongoDB (vCore architecture)?](/azure/cosmos-db/mongodb/vcore/introduction)
- [Change streams in Azure Cosmos DB’s API for MongoDB](/azure/cosmos-db/mongodb/change-streams)
- [Azure Cosmos DB for MongoDB (vCore) trigger for Azure Functions](functions-bindings-mongodb-vcore-trigger.md)
- [Azure Cosmos DB for MongoDB (vCore) input binding for Azure Functions](functions-bindings-mongodb-vcore-input.md)
- [Azure Cosmos DB for MongoDB (vCore) output binding for Azure Functions](functions-bindings-mongodb-vcore-output.md)
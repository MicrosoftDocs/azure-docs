---
title: Azure Cosmos DB for MongoDB (vCore) Trigger for Azure Functions
description: Understand how to use Azure Cosmos DB for MongoDB (vCore) trigger to monitor change streams for inserts and updates in collections.
author: sajeetharan
ms.author: sasinnat
ms.topic: reference
ms.date: 5/8/2025
ms.custom: 
  - build-2025
---

# Azure Cosmos DB for MongoDB (vCore) trigger for Azure Functions

This article explains how to work with the [Azure Cosmos DB for MongoDB vCore](/azure/cosmos-db/mongodb/vcore/introduction) trigger in Azure Functions. The bindings use [change streams in Azure Cosmos DB’s API for MongoDB](/azure/cosmos-db/mongodb/change-streams) to listen for inserts and updates. 

The change feed publishes only new and updated items. Watching for delete operations using change streams is currently not supported.

[!INCLUDE [functions-bindings-mongodb-vcore-preview](../../includes/functions-bindings-mongodb-vcore-preview.md)]

## Example

This example shows a function that returns a single document that is inserted or updated:

:::code language="csharp" source="~/azure-functions-mongodb-extension/Sample/Sample.cs" range="49-57" ::: 

For the complete example, see [Sample.cs](https://github.com/Azure/Azure-functions-mongodb-extension/blob/main/Sample/Sample.cs) in the extension repository.

## Attributes

This table describes the binding configuration properties of the `CosmosDBMongoTrigger` attribute.

|Parameter | Description|
|---------|----------------------|
|**FunctionId** | (Optional) The ID of the trigger function. |
|**DatabaseName** | The name of the database being monitored by the trigger for changes. Required unless `TriggerLevel` is set to `MonitorLevel.Cluser`. |
|**CollectionName** | The name of the collection in the database being monitored by the trigger for changes. Required when `TriggerLevel` is set to `MonitorLevel.Collection`.|
|**ConnectionStringSetting** | The name of an app setting or setting collection that specifies how to connect to the Azure Cosmos DB account being monitored. |
|**TriggerLevel** | Indicates the level at which changes are being monitored. Valid values of `MonitorLevel` are: `Collection`, `Database`, and `Cluster`. |

## Usage

Use the `TriggerLevel` parameter to set the scope of changes being monitored. 

You can use the `CosmosDBMongo` attribute to obtain and work directly with the [MongoDB client](https://mongodb.github.io/mongo-csharp-driver/2.8/apidocs/html/T_MongoDB_Driver_IMongoClient.htm) in your function code:

:::code language="csharp" source="~/azure-functions-mongodb-extension/Sample/Sample.cs" range="17-29" ::: 

## Related articles
 
- [Azure Cosmos DB for MongoDB (vCore)](/azure/cosmos-db/mongodb/vcore/introduction)
- [Azure Cosmos DB for MongoDB (vCore) bindings for Azure Functions](functions-bindings-mongodb-vcore.md)
- [Azure Cosmos DB for MongoDB (vCore) input binding for Azure Functions](functions-bindings-mongodb-vcore-input.md)
- [Azure Cosmos DB for MongoDB (vCore) output binding for Azure Functions](functions-bindings-mongodb-vcore-output.md)

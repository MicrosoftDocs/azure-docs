---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/21/2024
ms.author: glenga
ms.custom:
  - include file
  - sfi-ropc-nochange
---

# [Functions 2.x+](#tab/functionsv2)
```json
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseCollectionName": "leases",
    "connectionStringSetting": "<connection-app-setting>",
    "databaseName": "Tasks",
    "collectionName": "Items",
    "createLeaseCollectionIfNotExists": true
}
```
# [Functions 4.x+](#tab/extensionv4)
```json
{
    "type": "cosmosDBTrigger",
    "name": "documents",
    "direction": "in",
    "leaseContainerName": "leases",
    "connection": "<connection-app-setting>",
    "databaseName": "Tasks",
    "containerName": "Items",
    "createLeaseContainerIfNotExists": true
}
```
---

Note that some of the binding attribute names changed in version 4.x of the Azure Cosmos DB extension.
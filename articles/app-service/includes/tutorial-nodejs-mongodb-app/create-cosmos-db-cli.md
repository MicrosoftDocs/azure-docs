---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.custom: ignite-2022
ms.date: 01/30/2022
---
A new Azure Cosmos DB account is created by using the [az cosmosdb create](/cli/azure/cosmosdb#az-cosmosdb-create) command.

* The name of the Azure Cosmos DB account must be unique across Azure. The name can only contain lowercase letters, numbers, and the hyphen (-) character and must be between 3 and 50 characters long.
* The `--kind MongoDB` flag tells Azure to create an Azure Cosmos DB instance that's compatible with the MongoDB API. This flag must be included for your Azure Cosmos DB instance to work as a MongoDB database.

#### [bash](#tab/terminal-bash)

```azurecli
# Replace 123 with any three characters to form a unique name
COSMOS_DB_NAME='msdocs-expressjs-mongodb-database-123'

az cosmosdb create \
    --name $COSMOS_DB_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --kind MongoDB
```

#### [PowerShell terminal](#tab/terminal-powershell)

```azurecli
# Replace 123 with any three characters to form a unique name
$cosmosDbName='msdocs-expressjs-mongodb-database-123'

az cosmosdb create `
    --name $cosmosDbName `
    --resource-group $resourceGroupName `
    --kind MongoDB
```

---

Creating a new Azure Cosmos DB typically takes about 5 minutes.

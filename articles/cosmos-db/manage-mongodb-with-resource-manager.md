---
title: Resource Manager templates for Azure Cosmos DB API for MongoDB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB API for MongoDB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: mjbrown
---

# Manage Azure Cosmos DB MongoDB API resources using Azure Resource Manager templates

This article describes how to perform different operations to automate management of your Azure Cosmos DB accounts, databases and containers using Azure Resource Manager templates. This article has examples for Azure Cosmos DB's API for MongoDB only, to find examples for other API type accounts see: use Azure Resource Manager templates with Azure Cosmos DB's API for [Cassandra](manage-cassandra-with-resource-manager.md), [Gremlin](manage-gremlin-with-resource-manager.md), [SQL](manage-sql-with-resource-manager.md), [Table](manage-table-with-resource-manager.md) articles.

## Create Azure Cosmos DB API for MongoDB account, database and collection <a id="create-resource"></a>

Create Azure Cosmos DB resources using an Azure Resource Manager template. This template will create an Azure Cosmos account for MongoDB API with two collections that share 400 RU/s throughput at the database level. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-mongodb/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

> [!NOTE]
> Account names must be lowercase and 44 or fewer characters.
> To update RU/s, redeploy the template with updated throughput property values.

```json
{
"$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
"contentVersion": "1.0.0.0",
"parameters": {
   "accountName": {
      "type": "string",
      "defaultValue": "",
      "metadata": {
         "description": "Cosmos DB account name"
      }
   },
   "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
         "description": "Location for the Cosmos DB account."
      }
   },
   "primaryRegion":{
      "type":"string",
      "metadata": {
         "description": "The primary replica region for the Cosmos DB account."
      }
   },
   "secondaryRegion":{
      "type":"string",
      "metadata": {
        "description": "The secondary replica region for the Cosmos DB account."
     }
   },
   "defaultConsistencyLevel": {
      "type": "string",
      "defaultValue": "Session",
      "allowedValues": [ "Eventual", "ConsistentPrefix", "Session", "BoundedStaleness", "Strong" ],
      "metadata": {
         "description": "The default consistency level of the Cosmos DB account."
      }
   },
   "serverVersion": {
      "defaultValue": "3.6",
      "allowedValues": [
         "3.2",
         "3.6"
      ],
      "type": "String",
      "metadata": {
         "description": "Specifies the MongoDB server version to use."
      }
   },
   "maxStalenessPrefix": {
      "type": "int",
      "defaultValue": 100000,
      "minValue": 10,
      "maxValue": 1000000,
      "metadata": {
         "description": "Max stale requests. Required for BoundedStaleness. Valid ranges, Single Region: 10 to 1000000. Multi Region: 100000 to 1000000."
      }
   },
   "maxIntervalInSeconds": {
      "type": "int",
      "defaultValue": 300,
      "minValue": 5,
      "maxValue": 86400,
      "metadata": {
         "description": "Max lag time (seconds). Required for BoundedStaleness. Valid ranges, Single Region: 5 to 84600. Multi Region: 300 to 86400."
      }
   },
   "databaseName": {
      "type": "string",
      "defaultValue": "Database1",
      "metadata": {
         "description": "The name for the Mongo DB database"
      }
   },
   "throughput": {
      "type": "int",
      "defaultValue": 400,
      "minValue": 400,
      "maxValue": 1000000,
      "metadata": {
         "description": "The shared throughput for the Mongo DB database"
      }
   },
   "collection1Name": {
      "type": "string",
      "defaultValue": "Collection1",
      "metadata": {
         "description": "The name for the first Mongo DB collection"
      }
   },
   "collection2Name": {
      "type": "string",
      "defaultValue": "Collection2",
      "metadata": {
         "description": "The name for the second Mongo DB collection"
      }
   }
},
"variables": {
   "accountName": "[toLower(parameters('accountName'))]",
   "consistencyPolicy": {
      "Eventual": {
         "defaultConsistencyLevel": "Eventual"
      },
      "ConsistentPrefix": {
         "defaultConsistencyLevel": "ConsistentPrefix"
      },
      "Session": {
         "defaultConsistencyLevel": "Session"
      },
      "BoundedStaleness": {
         "defaultConsistencyLevel": "BoundedStaleness",
         "maxStalenessPrefix": "[parameters('maxStalenessPrefix')]",
         "maxIntervalInSeconds": "[parameters('maxIntervalInSeconds')]"
      },
      "Strong": {
         "defaultConsistencyLevel": "Strong"
      }
   },
   "locations":
   [
      {
         "locationName": "[parameters('primaryRegion')]",
         "failoverPriority": 0,
         "isZoneRedundant": false
      },
      {
         "locationName": "[parameters('secondaryRegion')]",
         "failoverPriority": 1,
         "isZoneRedundant": false
      }
   ]
},
"resources":
[
   {
      "type": "Microsoft.DocumentDB/databaseAccounts",
      "name": "[variables('accountName')]",
      "apiVersion": "2020-03-01",
      "location": "[parameters('location')]",
      "kind": "MongoDB",
      "properties": {
         "consistencyPolicy": "[variables('consistencyPolicy')[parameters('defaultConsistencyLevel')]]",
         "locations": "[variables('locations')]",
         "databaseAccountOfferType": "Standard",
         "apiProperties": {
            "serverVersion": "[parameters('serverVersion')]"
         }
      }
   },
   {
      "type": "Microsoft.DocumentDB/databaseAccounts/mongodbDatabases",
      "name": "[concat(variables('accountName'), '/', parameters('databaseName'))]",
      "apiVersion": "2020-03-01",
      "dependsOn": [ "[resourceId('Microsoft.DocumentDB/databaseAccounts/', variables('accountName'))]" ],
      "properties":{
         "resource":{
            "id": "[parameters('databaseName')]"
         },
         "options": { "throughput": "[parameters('throughput')]" }
      }
   },
   {
      "type": "Microsoft.DocumentDb/databaseAccounts/mongodbDatabases/collections",
      "name": "[concat(variables('accountName'), '/', parameters('databaseName'), '/', parameters('collection1Name'))]",
      "apiVersion": "2020-03-01",
      "dependsOn": [ "[resourceId('Microsoft.DocumentDB/databaseAccounts/mongodbDatabases', variables('accountName'), parameters('databaseName'))]" ],
      "properties":
      {
         "resource":{
            "id":  "[parameters('collection1Name')]",
            "shardKey": { "user_id": "Hash" },
            "indexes": [
               {
                  "key": { "keys":["user_id", "user_address"] },
                  "options": { "unique": "true" }
               },
               {
                  "key": { "keys":["_ts"] },
                  "options": { "expireAfterSeconds": "2629746" }
               }
            ],
            "options": {
               "If-Match": "<ETag>"
            }
         }
      }
   },
   {
      "type": "Microsoft.DocumentDb/databaseAccounts/mongodbDatabases/collections",
      "name": "[concat(variables('accountName'), '/', parameters('databaseName'), '/', parameters('collection2Name'))]",
      "apiVersion": "2020-03-01",
      "dependsOn": [ "[resourceId('Microsoft.DocumentDB/databaseAccounts/mongodbDatabases', variables('accountName'),  parameters('databaseName'))]" ],
      "properties":
      {
         "resource":{
            "id":  "[parameters('collection2Name')]",
            "shardKey": { "company_id": "Hash" },
            "indexes": [
               {
                  "key": { "keys":["company_id", "company_address"] },
                  "options": { "unique": "true" }
               },
               {
                  "key": { "keys":["_ts"] },
                  "options": { "expireAfterSeconds": "2629746" }
               }
            ],
            "options": {
               "If-Match": "<ETag>"
            }
         }
      }
   }
]
}
```

### Deploy via the Azure CLI

To deploy the Azure Resource Manager template using the Azure CLI, **Copy** the script and select **Try it** to open Azure Cloud Shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive

read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the database name: ' databaseName
read -p 'Enter the database throughput: ' throughput
read -p 'Enter the first collection name: ' collection1Name
read -p 'Enter the second collection name: ' collection2Name

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
  --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-mongodb/azuredeploy.json \
  --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion \
  databaseName=$databaseName throughput=$throughput collection1Name=$collection1Name collection2Name=$collection2Name

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of the Azure CLI instead of using Cloud Shell, see the [Azure CLI](/cli/azure/) article.

## Next steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)

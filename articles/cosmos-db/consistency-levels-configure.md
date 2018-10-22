---
title: Configure default consistency levels in Azure Cosmos DB | Microsoft Docs
description: How to configure the default consistency level in Azure Cosmos DB.
keywords: consistency, azure cosmos db, azure, Microsoft azure
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.devlang: na
ms.topic: conceptual
ms.date: 10/20/2018
ms.author: mjbrown

---

# <a id="default"/>Configuring the consistency level in Azure Cosmos DB

Azure Cosmos DB supports setting a default consistency level for a Cosmos DB account to be used by all connected client applications. Cosmos DB also supports the ability to override the default from within your application either for the duration of the client connection or per-request.

## Configuring the default consistency level in Azure Cosmos DB

The default consistency level in Cosmos DB can be configured for a Cosmos DB account in the Azure portal, Powershell or CLI.

## Portal

1. In the [Azure portal](https://portal.azure.com/), in the Jumpbar, click **Azure Cosmos DB**.
2. In the **Azure Cosmos DB** page, select the database account to modify.
3. In the account page, click **Default consistency**.
4. In the **Default Consistency** page, select the new consistency level and click **Save**.
  
    ![Screen shot highlighting the Settings icon and Default Consistency entry](./media/consistency-levels/database-consistency-level-1.png)

## Powershell

This example below creates a new Cosmos DB account with multi-master enabled in East US and West US regions setting the default consistency policy as Bounded Staleness with a max staleness interval of 10 seconds and maximum number of stale requests tolerated at 200.

```azurepowershell-interactive
$locations = @(@{"locationName"="East US"; "failoverPriority"=0},
             @{"locationName"="West US"; "failoverPriority"=1})

$iprangefilter = ""

$consistencyPolicy = @{"defaultConsistencyLevel"="BoundedStaleness";
                       "maxIntervalInSeconds"= "10";
                       "maxStalenessPrefix"="200"}

$CosmosDBProperties = @{"databaseAccountOfferType"="Standard";
                        "locations"=$locations;
                        "consistencyPolicy"=$consistencyPolicy;
                        "ipRangeFilter"=$iprangefilter;
                        "enableMultipleWriteLocations"="true"}

New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
  -ApiVersion "2015-04-08" `
  -ResourceGroupName "myResourceGroup" `
  -Location "East US" `
  -Name "myCosmosDbAccount" `
  -Properties $CosmosDBProperties
```

## CLI

This example below creates a new Cosmos DB account with multi-master enabled in East US and West US regions and sets a default consistency policy of session.

```azurecli-interactive
az cosmosdb create \
   –-name "myCosmosDbAccount" \
   --resource-group "myResourceGroup" \
   --default-consistency-level "Session" \
   --enable-automatic-failover "true" \
   --locations "EastUS=0" "WestUS=1" \
   --enable-multiple-write-locations true \
```

## Enable multi-master using Resource Manager template

The following JSON code is an example Resource Manager template that you can use to deploy an Azure Cosmos DB account with a consistency policy as Bounded Staleness with a max staleness interval of 5 seconds and maximum number of stale requests tolerated at 100. To learn about Resource Manager template format, and the syntax, see [Resource Manager](../azure-resource-manager/resource-group-authoring-templates.md) documentation.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "name": {
            "type": "String"
        },
        "location": {
            "type": "String"
        },
        "locationName": {
            "type": "String"
        },
        "defaultExperience": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.DocumentDb/databaseAccounts",
            "kind": "GlobalDocumentDB",
            "name": "[parameters('name')]",
            "apiVersion": "2015-04-08",
            "location": "[parameters('location')]",
            "tags": {
                "defaultExperience": "[parameters('defaultExperience')]"
            },
            "properties": {
                "databaseAccountOfferType": "Standard",
                "consistencyPolicy": {
                    "defaultConsistencyLevel": "BoundedStaleness",
                    "maxIntervalInSeconds": 5,
                    "maxStalenessPrefix": 100
                },
                "locations": [
                    {
                        "id": "[concat(parameters('name'), '-', parameters('location'))]",
                        "failoverPriority": 0,
                        "locationName": "[parameters('locationName')]"
                    }
                ],
                "isVirtualNetworkFilterEnabled": false,
                "enableMultipleWriteLocations": true,
                "virtualNetworkRules": [],
                "dependsOn": []
            }
        }
    ]
}
```

## <a id="override"/>Override the default consistency level in Azure Cosmos DB

The default consistency level in Cosmos DB can be overridden for a Cosmos DB account within your application using the Cosmos DB SDK or REST API. This can be done in your application for both the life of your application or on a per-request basis. Below is an example of each.

**Override default consistency level for the application**

```csharp
ConsistencyPolicy consistencyPolicy = new ConsistencyPolicy
    {
        DefaultConsistencyLevel = ConsistencyLevel.BoundedStaleness,
        MaxStalenessIntervalInSeconds = 5,
        MaxStalenessPrefix = 100
    };
documentClient = new DocumentClient(new Uri(endpoint), authKey, connectionPolicy, consistencyPolicy);
```

**Override default consistency level for a request**

```csharp
RequestOptions requestOptions = new RequestOptions { ConsistencyLevel = ConsistencyLevel.Strong };

var response = await client.CreateDocumentAsync(collectionUri, document, requestOptions);
```

## Next Steps

To learn more about consistency in Cosmos DB, read the following articles:

- [Availability and Performance Tradeoffs for various Consistency Levels](consistency-levels-tradeoffs.md)
- [Choosing the Right Consistency Level](consistency-levels-choosing.md)
- [Consistency Level across Cosmos DB model APIs](consistency-levels-across-apis.md)

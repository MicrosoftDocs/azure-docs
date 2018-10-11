---
title: Enable multi-master for Azure Cosmos DB accounts 
description: This article describes how to enable multi-master support while creating an Azure Cosmos DB account with Azure portal, PowerShell, CLI or an Azure Resource Manager template.
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: mjbrown
ms.reviewer: sngun

---

# Enable multi-master for Azure Cosmos DB accounts

Multi-master support is enabled while creating an Azure Cosmos DB account. An Azure Cosmos DB account can be created using the Azure portal, PowerShell, CLI, or an Azure Resource Manager template.

> [!IMPORTANT]
> Currently, multi-master support can be enabled for new Azure Cosmos DB accounts only. Existing Azure Cosmos DB accounts cannot use feature. We are working to provide support for existing accounts and will announce this support when it's available.

After you create an Azure Cosmos DB account with multi-master support, you can create databases, containers, upload documents, and assign conflict resolution policies. For conflict resolution in multi-master and code samples, see [multi-master code samples](multi-master-conflict-resolution.md#code-samples) article.

## Enable multi-master using Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/)

2. Click Select **Create a resource > Databases > Azure Cosmos DB**.

3. In the **New Account** pane, enter the following settings for a new Azure Cosmos DB account:

   |**Setting**  |**Suggested value** |**Description**|
   |---------|---------|---------|
   |Subscription   | {Your subscription}  |Select the Azure subscription to use for this Azure Cosmos DB account.  |
   |Resource Group  |   {Your resource group name}    |  Select an existing resource group or select **Create New**, then enter a new resource-group name for your account. |
   |Account Name | {your account name}   |  Enter a unique name to identify your Azure Cosmos DB account.        |
   |API	 |   Any   |  Select an API type.   |
   |Location  | Select any region   | Select geographic location in which to host your Azure Cosmos DB account. You can choose any region since this account will be in multiple regions.  |
   |Enable geo-redundancy   |  Enable  |  Select to enable multi master to be selected below.   |
   |Enable Multi Master | Enable  | Select to enable multi master for this account. |


## Using multi-master in SDKs

With a multi-master enabled account, within your applications, you can take advantage of multi-mastering by leveraging the ConnectionPolicy as shown below.

```csharp
ConnectionPolicy policy = new ConnectionPolicy
{
   ConnectionMode = ConnectionMode.Direct,
   ConnectionProtocol = Protocol.Tcp,
   UseMultipleWriteLocations = true,
};
policy.PreferredLocations.Add(LocationNames.WestUS);
policy.PreferredLocations.Add(LocationNames.NorthEurope);
policy.PreferredLocations.Add(LocationNames.SoutheastAsia);
```

## Enable multi-master using PowerShell

You can also create a multi-master enabled Cosmos DB account by setting the `enableMultipleWriteLocations` parameter to "true". To create an Azure Cosmos DB account with multi-master enabled, open a PowerShell window, and run the following script:

```azurepowershell-interactive
$locations = @(@{"locationName"="East US"; "failoverPriority"=0},
             @{"locationName"="West US"; "failoverPriority"=1})

$iprangefilter = "<ip-range-filter>"

$consistencyPolicy = @{"defaultConsistencyLevel"="Session";
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

## Enable multi-master using CLI

You can enable multi-master by setting the enable-multiple-write-locations parameter to "true". To create an Azure Cosmos DB account with multi-master enabled, open Azure CLI or cloud shell and run the following command:

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

The following JSON code is an example Resource Manager template that you can use to deploy an Azure Cosmos DB account. To learn about Resource Manager template format, and the syntax, see [Resource Manager](../azure-resource-manager/resource-group-authoring-templates.md) documentation. The key parameter to notice in this template is "enableMultipleWriteLocations": true.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
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

## Next steps

In this article, you learned how to enable multi-master support for Azure Cosmos DB accounts. Next, look at the following resources:

* [Using multi-master with open source NoSQL databases](multi-master-oss-nosql.md)

* [Understanding conflict resolution in Azure Cosmos DB](multi-master-conflict-resolution.md)

---
title: Enable multi-master for Azure Cosmos DB accounts | Microsoft Docs
description: This article describes how to enable multi-master support while creating an Azure Cosmos DB account with Azure portal, PowerShell, CLI or an Azure Resource Manager template.
services: cosmos-db
author: markjbrown

ms.service: cosmos-db
ms.topic: conceptual
ms.date: 09/18/2018
ms.author: mjbrown

---

# Enable multi-master for Azure Cosmos DB accounts

You can enable multi-master support while creating an Azure Cosmos DB account with Azure portal, PowerShell, CLI, or an Azure Resource Manager template.
 
> [!IMPORTANT]
> Currently, multi-master support can be enabled for new Azure Cosmos DB accounts only. Existing Azure Cosmos DB accounts cannot use feature. We are working to provide support for existing accounts and will announce this support when it's available.

After you create an Azure Cosmos DB account with multi-master support, you can create databases, containers, upload documents and assign conflict resolution policies. See, Azure Cosmos DB [multi-master conflict resolution](multi-master-conflict-resolution.md) article for conflict types and conflict resolution policies.  

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

## Enable multi-master using PowerShell

You can enable multi-master by setting the `enableMultipleWriteLocations` parameter to “true”. Open Windows PowerShell, update the region name, consistency level, account name, and other parameters as required and run the following script:

```powershell
$locations = @(@{"locationName"="<write-region-location>"; "failoverPriority"=0},
             @{"locationName"="<read-region-location>"; "failoverPriority"=1})

$iprangefilter = "<ip-range-filter>"

$consistencyPolicy = @{"defaultConsistencyLevel"="<default-consistency-level>"; "maxIntervalInSeconds"="<max-interval>"; "maxStalenessPrefix"="<max-staleness-prefix>"}

$CosmosDBProperties = @{"databaseAccountOfferType"="Standard"; 
                        "locations"=$locations; 
                        "consistencyPolicy"=$consistencyPolicy; 
                        "ipRangeFilter"=$iprangefilter; 
                        "enableMultipleWriteLocations"="true"}

New-AzureRmResource -ResourceType "Microsoft.DocumentDb/databaseAccounts" `
  -ApiVersion "2015-04-08" `
  -ResourceGroupName <resource-group-name> `
  -Location "<resource-group-location>" `
  -Name <database-account-name> `
  -Properties $CosmosDBProperties 
```

## Enable multi-master using CLI

You can enable multi-master by setting the enable-multiple-write-locations parameter to “true”. Open Azure CLI or cloud shell and run the following command to create an Azure Cosmos DB account with multi-master enabled:

```azurecli-interactive
az cosmosdb create \
   –-name "myCosmosDbAccount" \
   --resource-group "myResourceGroup" \
   --default-consistency-level Session \
   --enable-automatic-failover true \
   --locations eastus=0 westus=1 \
   --enable-multiple-write-locations true \
```

## Enable multi-master using Resource Manager template

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

* [Conflict resolution for Azure Cosmos DB multi-master](multi-master-conflict-resolution.md) 




---
title: Resource Manager templates for Azure Cosmos DB Table API
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB Table API. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 04/27/2020
ms.author: mjbrown
---

# Manage Azure Cosmos DB Table API resources using Azure Resource Manager templates

This article describes how to perform different operations to automate management of your Azure Cosmos DB accounts, databases and containers using Azure Resource Manager templates. This article has examples for Table API accounts only, to find examples for other API type accounts see: use Azure Resource Manager templates with Azure Cosmos DB's API for [Cassandra](manage-cassandra-with-resource-manager.md), [Gremlin](manage-gremlin-with-resource-manager.md), [MongoDB](manage-mongodb-with-resource-manager.md), [SQL](manage-sql-with-resource-manager.md) articles.

## Create Azure Cosmos account and table <a id="create-resource"></a>

Create Azure Cosmos DB resources using an Azure Resource Manager template. This template will create an Azure Cosmos account for Table API with one table at 400 RU/s throughput. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-table/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

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
   "automaticFailover": {
      "type": "bool",
      "defaultValue": true,
      "allowedValues": [ true, false ],
      "metadata": {
         "description": "Enable automatic failover for regions. Ignored when Multi-Master is enabled"
      }
   },
   "tableName": {
      "type": "string",
      "metadata": {
         "description": "The name for the table"
      }
   },
   "throughput": {
      "type": "int",
      "defaultValue": 400,
      "minValue": 400,
      "maxValue": 1000000,
      "metadata": {
         "description": "The throughput for the table"
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
      "kind": "GlobalDocumentDB",
      "properties": {
         "capabilities": [{ "name": "EnableTable" }],
         "consistencyPolicy": "[variables('consistencyPolicy')[parameters('defaultConsistencyLevel')]]",
         "locations": "[variables('locations')]",
         "databaseAccountOfferType": "Standard",
         "enableAutomaticFailover": "[parameters('automaticFailover')]"
      }
   },
   {
      "type": "Microsoft.DocumentDB/databaseAccounts/tables",
      "name": "[concat(variables('accountName'), '/', parameters('tableName'))]",
      "apiVersion": "2020-03-01",
      "dependsOn": [ "[resourceId('Microsoft.DocumentDB/databaseAccounts/', variables('accountName'))]" ],
      "properties":{
         "resource":{
            "id": "[parameters('tableName')]"
         },
         "options": { "throughput": "[parameters('throughput')]" }
      }
   }
]
}
```

### Deploy via PowerShell

To deploy the Resource Manager template using PowerShell, **Copy** the script and select **Try it** to open Azure Cloud Shell. To paste the script, right-click the shell, and then select **Paste**:

```azurepowershell-interactive

$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$accountName = Read-Host -Prompt "Enter the account name"
$location = Read-Host -Prompt "Enter the location (i.e. westus2)"
$primaryRegion = Read-Host -Prompt "Enter the primary region (i.e. westus2)"
$secondaryRegion = Read-Host -Prompt "Enter the secondary region (i.e. eastus2)"
$tableName = Read-Host -Prompt "Enter the table name"
$throughput = Read-Host -Prompt "Enter the throughput"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateUri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-table/azuredeploy.json" `
    -primaryRegion $primaryRegion `
    -secondaryRegion $secondaryRegion `
    -tableName $tableName `
    -throughput $throughput

 (Get-AzResource --ResourceType "Microsoft.DocumentDb/databaseAccounts" --ApiVersion "2020-03-01" --ResourceGroupName $resourceGroupName).name
```

If you choose to use a locally installed version of PowerShell instead of from the Azure Cloud shell, you have to [install](/powershell/azure/install-az-ps) the Azure PowerShell module. Run `Get-Module -ListAvailable Az` to find the version.

### Deploy via the Azure CLI

To deploy the Azure Resource Manager template using the Azure CLI, **Copy** the script and select **Try it** to open Azure Cloud Shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the table name: ' tableName
read -p 'Enter the throughput: ' throughput

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-table/azuredeploy.json \
   --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion \
     tableName=$tableName throughput=$throughput

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of the Azure CLI instead of using Cloud Shell, see the [Azure CLI](/cli/azure/) article.

## Next steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/templates/common-deployment-errors.md)
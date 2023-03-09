---
title: |
  Quickstart: Deploy a cluster by using a Bicep template
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: In this quickstart, create a new Azure Cosmos DB for MongoDB vCore cluster to store databases, collections, and documents by using a Bicep template.
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: quickstart
author: gahl-levy
ms.author: gahllevy
ms.reviewer: nayakshweta
ms.date: 03/07/2023
---

# Quickstart: Create an Azure Cosmos DB for MongoDB vCore cluster by using a Bicep template

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

In this quickstart, you create a new Azure Cosmos DB for MongoDB vCore cluster. This cluster contains all of your MongoDB resources: databases, collections, and documents. The cluster provides a unique endpoint for various tools and SDKs to connect to Azure Cosmos DB and perform everyday operations.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/cosmosdb-free/).

```bicep
@description('Azure Cosmos DB MongoDB vCore cluster name')
@maxLength(44)
param clusterName string = 'msdocs-${uniqueString(resourceGroup().id)}'

@description('Location for the cluster.')
param location string = resourceGroup().location

@description('Username for admin user')
param adminUsername string

@secure()
@description('Password for admin user')
@minLength(8)
@maxLength(128)
param adminPassword string

resource cluster 'Microsoft.DocumentDB/mongoClusters@2022-10-15-preview' = {
  name: clusterName
  location: location
  properties: {
    administratorLogin: adminUsername
    administratorLoginPassword: adminPassword
    nodeGroupSpecs: [
        {
            kind: 'Shard'
            nodeCount: 1
            sku: 'M40'
            diskSizeGB: 128
            enableHa: false
        }
    ]
  }
}

resource firewallRules 'Microsoft.DocumentDB/mongoClusters/firewallRules@2022-10-15-preview' = {
  parent: cluster
  name: 'AllowAllAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}
```

Two Azure resources are defined in the Bicep file:

- [`Microsoft.DocumentDB/databaseAccounts`](/azure/templates/microsoft.documentdb/databaseAccounts?pivots=deployment-language-bicep): Creates an Azure Cosmos DB for MongoDB vCore cluster.
  - [`Microsoft.DocumentDB/databaseAccounts/sqlDatabases`](/azure/templates/microsoft.documentdb/databaseAccounts?pivots=deployment-language-bicep): Creates firewall rules for the Azure Cosmos DB for MongoDB vCore cluster.

## Deploy the Bicep file

Create an Azure Cosmos DB for MongoDB vCore cluster by using the Bicep template.

### [Azure CLI](#tab/azure-cli)

1. Create shell variables for *resourceGroupName*, and *location*

    ```azurecli
    # Variable for resource group name and location
    resourceGroupName="msdocs-cosmos-quickstart-rg"
    location="eastus"
    ```

1. If you haven't already, sign in to the Azure CLI using the [`az login`](/cli/azure/reference-index#az-login) command.

1. Use the [`az group create`](/cli/azure/group#az-group-create) command to create a new resource group in your subscription.

    ```azurecli
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Use [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create) to deploy the bicep template. You're then prompted to enter a value for the `adminUsername` and `adminPassword` parameters.

    ```azurecli
    az deployment group create \
        --resource-group $resourceGroupName \
        --template-file 'main.bicep'
    ```

    > [!TIP]
    > Alternatively, use the ``--parameters`` option to pass in a parameters file with pre-defined values.
    >
    > ```azurecli
    > az deployment group create \
    >     --resource-group $resourceGroupName \
    >     --template-file 'main.bicep' \
    >     --parameters @main.parameters.json
    > ```
    >
    > This example JSON file injects `clusteradmin` and `P@ssw.rd` values for the `adminUsername` and `adminPassword` parameters respectively.
    >
    > ```json
    > {
    >   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    >   "contentVersion": "1.0.0.0",
    >   "parameters": {
    >     "adminUsername": {
    >       "value": "clusteradmin"
    >     },
    >     "adminPassword": {
    >       "value": "P@ssw.rd"
    >     }
    >   }
    > }
    > ```
    >

1. Wait for the deployment operation to complete before moving on.

### [Azure PowerShell](#tab/azure-powershell)

1. Create shell variables for *RESOURCE_GROUP_NAME*, and *LOCATION*

    ```azurepowershell
    # Variable for resource group name and location
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-quickstart-rg"
    $LOCATION = "East US"
    ```

1. If you haven't already, sign in to Azure PowerShell using the [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount) cmdlet.

1. Use the [`New-AzResourceGroup`](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group in your subscription.

    ```azurepowershell
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
        Location = $LOCATION
    }
    New-AzResourceGroup @parameters
    ```

1. Use [`New-AzResourceGroupDeployment`](/powershell/module/az.resources/new-azresourcegroupdeployment) to deploy the bicep template. You're then prompted to enter a value for the `adminUsername` and `adminPassword` parameters.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        TemplateFile = "main.bicep"
    }
    New-AzResourceGroupDeployment @parameters
    ```

    > [!TIP]
    > Alternatively, use the ``-TemplateParameterFile`` option to pass in a parameters file with pre-defined values.
    >
    > ```azurepowershell
    > $parameters = @{
    >     ResourceGroupName = $RESOURCE_GROUP_NAME
    >     TemplateFile = "main.bicep"
    >     TemplateParameterFile = "main.parameters.json"
    > }
    > New-AzResourceGroupDeployment @parameters
    > ```
    >
    > This example JSON file injects `clusteradmin` and `P@ssw.rd` values for the `adminUsername` and `adminPassword` parameters respectively.
    >
    > ```json
    > {
    >   "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    >   "contentVersion": "1.0.0.0",
    >   "parameters": {
    >     "adminUsername": {
    >       "value": "clusteradmin"
    >     },
    >     "adminPassword": {
    >       "value": "P@ssw.rd"
    >     }
    >   }
    > }
    > ```
    >

1. Wait for the deployment operation to complete before moving on.

---

## Review deployed resources

List the resources deployed by the Bicep template to your target resource group.

### [Azure CLI](#tab/azure-cli)

1. Use [`az resource list`](/cli/azure/resource#az-resource-list) to get a list of resources in your resource group.

    ```azurecli
    az resource list \
        --resource-group $resourceGroupName \
        --location $location \
        --output tsv
    ```

1. In the example output, look for resources that have a type of `Microsoft.DocumentDB/mongoClusters`. Here's an example of the type of output to expect:

    ```output
    Name                  ResourceGroup                Location    Type                                Status
    --------------------  ---------------------------  ----------  ----------------------------------  --------
    msdocs-sz2dac3xtwzzu  msdocs-cosmos-quickstart-rg  eastus      Microsoft.DocumentDB/mongoClusters
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Use [`Get-AzResource`](/powershell/module/az.resources/get-azresource) to get a list of resources in your resource group.

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
    }
    Get-AzResource @parameters
    ```

1. In the example output, look for resources that have a type of `Microsoft.DocumentDB/mongoClusters`. Here's an example of the type of output to expect:

    ```output
    Name              : msdocs-sz2dac3xtwzzu
    ResourceGroupName : msdocs-cosmos-quickstart-rg
    ResourceType      : Microsoft.DocumentDB/mongoClusters
    Location          : eastus
    ResourceId        : /subscriptions/abcdef01-2345-6789-0abc-def012345678/resourceGroups/msdocs-cosmos-quickstart-rg/providers/Microsoft.DocumentDB/mongoClusters/msdocs-sz2dac3xtwzzu
    Tags              : 
    ```
    
---

## Clean up resources

When you're done with your Azure Cosmos DB for MongoDB vCore cluster, you can delete the Azure resources you created so you don't incur more charges.

### [Azure CLI](#tab/azure-cli)

1. Use [`az group delete`](/cli/azure/group#az-group-delete) to remove the resource group from your subscription.

    ```azurecli
    az group delete \
        --name $resourceGroupName
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Use [`Remove-AzResourceGroup`](/powershell/module/az.resources/remove-azresourcegroup) to remove the resource group from your subscription.

    ```azurepowershell
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
    }
    Remove-AzResourceGroup @parameters
    ```

---

## Next steps

In this guide, you learned how to create an Azure Cosmos DB for MongoDB vCore cluster. You can now migrate data to your cluster.

> [!div class="nextstepaction"]
> [Migrate data to Azure Cosmos DB for MongoDB vCore](migration-options.md)

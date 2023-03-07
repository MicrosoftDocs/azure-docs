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

1. TODO

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

## Deploy the Bicep file

Create an Azure Cosmos DB for MongoDB vCore cluster by using the Bicep template.

### [Azure CLI](#tab/azure-cli)

1. TODO

    ```azurecli
    # Variable for resource group name and location
    resourceGroupName="msdocs-cosmos-quickstart-rg"
    location="eastus"
    ```

1. TODO

    ```azurecli
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. TODO

    ```azurecli
    az deployment group create \
        --resource-group $resourceGroupName \
        --template-file 'main.bicep'
    ```

1. TODO

    > [!TIP]
    > Alternatively, TODO
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

### [Azure PowerShell](#tab/azure-powershell)

1. TODO

    ```azurepowershell
    # Variable for resource group name and location
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-quickstart-rg"
    $LOCATION = "East US"
    ```

1. TODO

    ```azurepowershell
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
        Location = $LOCATION
    }
    New-AzResourceGroup @parameters
    ```

1. TODO

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        TemplateFile = "main.bicep"
    }
    New-AzResourceGroupDeployment @parameters
    ```

1. TODO

    > [!TIP]
    > Alternatively, TODO
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

---

## Review deployed resources

List the resources deployed by the Bicep template to your target resource group.

### [Azure CLI](#tab/azure-cli)

1. TODO

    ```azurecli
    az resource list
        --resource-group $resourceGroupName \
        --location $location    
    ```

1. TODO `Microsoft.DocumentDB/mongoClusters`

### [Azure PowerShell](#tab/azure-powershell)

1. TODO

    ```azurepowershell
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
    }
    Get-AzResource @parameters
    ```

1. TODO `Microsoft.DocumentDB/mongoClusters`

---

## Clean up resources

When you're done with your Azure Cosmos DB for MongoDB vCore cluster, you can delete the Azure resources you created so you don't incur more charges.

### [Azure CLI](#tab/azure-cli)

1. TODO

    ```azurecli
    az group delete \
        --name $resourceGroupName
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. TODO

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
> [Migrate data to Azure Cosmos DB for MongoDB vCore](how-to-migrate-data.md)

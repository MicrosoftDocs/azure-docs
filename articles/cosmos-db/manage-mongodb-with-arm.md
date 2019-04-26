---
title: Azure Resource Manager templates for Azure Cosmos DB API for MongoDB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB API for MongoDB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mjbrown
---

# Create Azure Cosmos DB API for MongoDB resources from a Resource Manager template

Learn how to create an Azure Cosmos DB API for MongoDB resources using an Azure Resource Manager template. The following example creates an Azure Cosmos DB account for MongoDB API from an [Azure Quickstart template](https://aka.ms/mongodb-arm-qs). This template will create an Azure Cosmos account for MongoDB API with two collections that share 400 RU/s throughput at the database level.

Here is a copy of the template:

[!code-json[create-cosmos-mongo](~/quickstart-templates/101-cosmosdb-create-account/azuredeploy.json)]

## Deploy via Azure CLI

To deploy the Resource Manager template using Azure CLI, **Copy** the script and select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive

read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the database name: ' databaseName
read -p 'Enter the first collection name: ' collection1Name
read -p 'Enter the second collection name: ' collection2Name

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
  --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-mongodb/azuredeploy.json \
  --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion \
  databaseName=$databaseName collection1Name=$collection1Name collection2Name=$collection2Name

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of Azure CLI instead of using CloudShell, see [Azure Command-Line Interface (CLI)](/cli/azure/) article.

In the previous example, you have referenced a template that is stored in GitHub. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

## Next Steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshooting common ARM deployment errors](../azure-resource-manager/resource-manager-common-deployment-errors.md)
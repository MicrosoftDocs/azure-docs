---
title: Azure Resource Manager templates for Azure Cosmos DB Gremlin API
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB Gremlin API. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mjbrown
---

# Create Azure Cosmos DB Gremlin API resources from a Resource Manager template

Learn how to create Azure Cosmos DB Gremlin API resources using an Azure Resource Manager template. The following example creates an Azure Cosmos DB Gremlin API from an [Azure Quickstart template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-gremlin/azuredeploy.json). This template will create an Azure Cosmos account for Gremlin API with two graphs which share 400 RU/s throughput at the database level.

Here is a copy of the template:

[!code-json[create-cosmos-gremlin](~/quickstart-templates/101-cosmosdb-gremlin/azuredeploy.json)]

## Deploy with Azure CLI

To deploy the Resource Manager template using Azure CLI, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive

read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the database name: ' databaseName
read -p 'Enter the first graph name: ' graph1Name
read -p 'Enter the second graph name: ' graph2Name

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-gremlin/azuredeploy.json \
   --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion databaseName=$databaseName \
   graph1Name=$graph1Name graph2Name=$graph2Name

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The 'az cosmosdb show' command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of Azure CLI instead of using CloudShell, see [Azure Command-Line Interface (CLI)](/cli/azure/) .

In the previous example, you have referenced a template that is stored in GitHub. You can also download it to your local computer or create a new template and specify the local path with the `--template-file` parameter.

## Next Steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshooting common ARM deployment errors](../azure-resource-manager/resource-manager-common-deployment-errors.md)
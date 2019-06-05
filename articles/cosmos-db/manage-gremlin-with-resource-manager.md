---
title: Azure Resource Manager templates for Azure Cosmos DB Gremlin API
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB Gremlin API. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: mjbrown
---

# Manage Azure Cosmos DB Gremlin API resources using Azure Resource Manager Templates

## Create Azure Cosmos DB API for MongoDB account, database and collection <a id="create-resource"></a>

Create Azure Cosmos DB resources using an Azure Resource Manager template. This template will create an Azure Cosmos account for Gremlin API with two graphs that share 400 RU/s throughput at the database level. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-gremlin/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[create-cosmos-gremlin](~/quickstart-templates/101-cosmosdb-gremlin/azuredeploy.json)]

## Deploy with Azure CLI

To deploy the Resource Manager template using Azure CLI, **Copy** the script and select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

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

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of Azure CLI instead of using CloudShell, see [Azure Command-Line Interface (CLI)](/cli/azure/) article.

## Update throughput (RU/s) on a database <a id="database-ru-update"></a>

The following template will update the throughput of a database. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-gremlin-database-ru-update/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[cosmosdb-gremlin-database-ru-update](~/quickstart-templates/101-cosmosdb-gremlin-database-ru-update/azuredeploy.json)]

### Deploy database template via Azure CLI

To deploy the Resource Manager template using Azure CLI, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the account name: ' accountName
read -p 'Enter the database name: ' databaseName
read -p 'Enter the new throughput: ' throughput

az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-gremlin-database-ru-update/azuredeploy.json \
   --parameters accountName=$accountName databaseName=$databaseName throughput=$throughput
```

## Update throughput (RU/s) on a graph <a id="graph-ru-update"></a>

The following template will update the throughput of a graph. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-gremlin-graph-ru-update/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[cosmosdb-gremlin-graph-ru-update](~/quickstart-templates/101-cosmosdb-gremlin-graph-ru-update/azuredeploy.json)]

### Deploy graph template via Azure CLI

To deploy the Resource Manager template using Azure CLI, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the account name: ' accountName
read -p 'Enter the database name: ' databaseName
read -p 'Enter the graph name: ' graphName
read -p 'Enter the new throughput: ' throughput

az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-gremlin-graph-ru-update/azuredeploy.json \
   --parameters accountName=$accountName databaseName=$databaseName graphName=$graphName throughput=$throughput
```

## Next Steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/resource-manager-common-deployment-errors.md)
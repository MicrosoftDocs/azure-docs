---
title: Azure Resource Manager templates for Azure Cosmos DB Cassandra API
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB Cassandra API. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mjbrown
---

# Manage Azure Cosmos DB Cassandra API resources using Azure Resource Manager Templates

## Create Azure Cosmos account, keyspace and table <a id="create-resource"></a>

Create Azure Cosmos DB resources using an Azure Resource Manager template. This template will create an Azure Cosmos account for Cassandra API with two tables that share 400 RU/s throughput at the keyspace-level. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-cassandra/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[create-cosmos-Cassandra](~/quickstart-templates/101-cosmosdb-cassandra/azuredeploy.json)]

## Deploy with Azure CLI

To deploy the Resource Manager template using Azure CLI, **Copy** the script and select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive

read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the keyset name: ' keysetName
read -p 'Enter the first table name: ' table1Name
read -p 'Enter the second table name: ' table2Name

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-cassandra/azuredeploy.json \
   --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion keysetName=$keysetName \
   table1Name=$table1Name table2Name=$table2Name

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```

The `az cosmosdb show` command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of Azure CLI instead of using CloudShell, see [Azure Command-Line Interface (CLI)](/cli/azure/) article.

## Update throughput (RU/s) on a keyspace <a id="keyspace-ru-update"></a>

The following template will update the throughput of a keyspace. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-cassandra-keyspace-ru-update/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[cosmosdb-cassandra-keyspace-ru-update](~/quickstart-templates/101-cosmosdb-cassandra-keyspace-ru-update/azuredeploy.json)]

### Deploy keyspace template via Azure CLI

To deploy the Resource Manager template using Azure CLI, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the account name: ' accountName
read -p 'Enter the keyspace name: ' keyspaceName
read -p 'Enter the new throughput: ' throughput

az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-cassandra-keyspace-ru-update/azuredeploy.json \
   --parameters accountName=$accountName keyspaceName=$keyspaceName throughput=$throughput
```

## Update throughput (RU/s) on a table <a id="table-ru-update"></a>

The following template will update the throughput of a table. Copy the template and deploy as shown below or visit [Azure Quickstart Gallery](https://azure.microsoft.com/resources/templates/101-cosmosdb-cassandra-table-ru-update/) and deploy from the Azure portal. You can also download the template to your local computer or create a new template and specify the local path with the `--template-file` parameter.

[!code-json[cosmosdb-cassandra-table-ru-update](~/quickstart-templates/101-cosmosdb-cassandra-table-ru-update/azuredeploy.json)]

### Deploy table template via Azure CLI

To deploy the Resource Manager template using Azure CLI, select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

```azurecli-interactive
read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the account name: ' accountName
read -p 'Enter the keyspace name: ' keyspaceName
read -p 'Enter the table name: ' tableName
read -p 'Enter the new throughput: ' throughput

az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-cassandra-table-ru-update/azuredeploy.json \
   --parameters accountName=$accountName keyspaceName=$keyspaceName tableName=$tableName throughput=$throughput
```

## Next Steps

Here are some additional resources:

- [Azure Resource Manager documentation](/azure/azure-resource-manager/)
- [Azure Cosmos DB resource provider schema](/azure/templates/microsoft.documentdb/allversions)
- [Azure Cosmos DB Quickstart templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.DocumentDB&pageNumber=1&sort=Popular)
- [Troubleshoot common Azure Resource Manager deployment errors](../azure-resource-manager/resource-manager-common-deployment-errors.md)
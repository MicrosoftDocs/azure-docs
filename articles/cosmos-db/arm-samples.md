---
title: Azure Resource Manager templates for Azure Cosmos DB
description: Use Azure Resource Manager templates to create and configure Azure Cosmos DB. 
author: markjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: mjbrown
---

# Azure Resource Manager templates for Azure Cosmos DB

The following table includes links to Azure Resource Manager templates for Azure Cosmos DB:

|**API type** | **link to sample**| **Description** |
|---|---| ---|
|Core (SQL) API| [Create an Azure Cosmos DB account](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-sql) | This template creates a SQL API account in two regions with multi-master enabled. The Azure Cosmos account will have two containers that share database-level throughput. |
|Core (SQL) API | [Create an account with VNet Service endpoint integration](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-sql-shared-ru) | This template creates an Azure Cosmos DB account with Virtual Network service endpoint integration. |
| MongoDB API | [Create an Azure Cosmos DB account](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-mongodb) | This template creates a MongoDB API account in two regions with multi-master enabled. The Azure Cosmos account will have two containers that share database-level throughput. |
| Cassandra API | [Create an Azure Cosmos DB account](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-cassandra) | This template creates a Cassandra API account in two regions with multi-master enabled. The Azure Cosmos account will have two tables that share keyspace-level throughput. |
| Gremlin API| [Create an Azure Cosmos DB account](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-gremlin) | This template creates a Gremlin API account in two regions with multi-master enabled. The Azure Cosmos account will have two graphs sharing database-level throughput. |
| Table API | [Create an Azure Cosmos DB account](https://github.com/Azure/azure-quickstart-templates/tree/master/101-cosmosdb-table) | This template  creates a Table API account in two regions with multi-master enabled. The Azure Cosmos account will have a single table. |

> [!TIP]
> To enabled shared throughput when using Table API, enable account-level throughput in the Azure Portal.

## Deploy templates with Azure CLI

### Azure Cosmos DB Cassandra API account and two tables with keyspace-level throughput

The following example creates an Azure Cosmos DB Cassandra API account from the [Azure Quickstart template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-cassandra/azuredeploy.json). This template will create an Azure Cosmos account for Cassandra API with two tables which share 400 RU/s throughput at the keyspace-level. 

To deploy the Resource Manager template using Azure CLI. Select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

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

The 'az cosmosdb show' command shows the newly created Azure Cosmos account after it has been provisioned. If you choose to use a locally installed version of Azure CLI instead of using CloudShell, see [Azure Command-Line Interface (CLI)](/cli/azure/) .

In the previous example, you have referenced a template that is stored in GitHub. You can also download it to your local computer or create a new template and specify the local path with the `--template-file` parameter.

### Create an Azure Cosmos DB Gremlin API account and two graphs with database-level throughput

The following example creates an Azure Cosmos DB Gremlin API account from an [Azure Quickstart template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-gremlin/azuredeploy.json). This template will create an Azure Cosmos account for Gremlin API with two graphs which share 400 RU/s throughput at the database level,

To deploy the Resource Manager template using Azure CLI. Select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

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

### Create an Azure Cosmos DB account for MongoDB API and two collections with database-level throughput

The following example creates an Azure Cosmos DB account for MongoDB API from an [Azure Quickstart template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-mongodb/azuredeploy.json). This template will create an Azure Cosmos account for MongoDB API with two collections which share 400 RU/s throughput at the database level.

To deploy the Resource Manager template using Azure CLI. Select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

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

## Create an Azure Cosmos DB Table API account and a table

The following example creates an Azure Cosmos DB Table API account from an [Azure Quickstart template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-cosmosdb-table/azuredeploy.json). This template will create an Azure Cosmos account for Table API and one table with 400 RU/s throughput.

To deploy the Resource Manager template using Azure CLI. Select **Try it** to open the Azure Cloud shell. To paste the script, right-click the shell, and then select **Paste**:

[!code-json[test](~/quickstart-templates/101-cosmosdb-create-account/azuredeploy.json)]

```azurecli-interactive

read -p 'Enter the Resource Group name: ' resourceGroupName
read -p 'Enter the location (i.e. westus2): ' location
read -p 'Enter the account name: ' accountName
read -p 'Enter the primary region (i.e. westus2): ' primaryRegion
read -p 'Enter the secondary region (i.e. eastus2): ' secondaryRegion
read -p 'Enter the table name: ' tableName

az group create --name $resourceGroupName --location $location
az group deployment create --resource-group $resourceGroupName \
   --template-uri https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-cosmosdb-table/azuredeploy.json \
   --parameters accountName=$accountName primaryRegion=$primaryRegion secondaryRegion=$secondaryRegion tableName=$tableName

az cosmosdb show --resource-group $resourceGroupName --name accountName --output tsv
```


See [ARM reference for Azure Cosmos DB](azure/templates/microsoft.documentdb/allversions) page for the reference documentation.
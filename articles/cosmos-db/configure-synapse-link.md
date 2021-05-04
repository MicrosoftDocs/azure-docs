---
title: Configure and use Azure Synapse Link for Azure Cosmos DB
description: Learn how to enable Synapse link for Azure Cosmos DB accounts, create a container with analytical store enabled, connect the Azure Cosmos database to Synapse workspace, and run queries. 
author: Rodrigossz
ms.service: cosmos-db
ms.topic: how-to
ms.date: 11/30/2020
ms.author: rosouz
ms.custom: references_regions, synapse-cosmos-db
---

# Configure and use Azure Synapse Link for Azure Cosmos DB
[!INCLUDE[appliesto-sql-mongodb-api](includes/appliesto-sql-mongodb-api.md)]

[Azure Synapse Link for Azure Cosmos DB](synapse-link.md) is a cloud-native hybrid transactional and analytical processing (HTAP) capability that enables you to run near real-time analytics over operational data in Azure Cosmos DB. Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

Azure Synapse Link is available for Azure Cosmos DB SQL API containers or for Azure Cosmos DB API for Mongo DB collections. Use the following steps to run analytical queries with the Azure Synapse Link for Azure Cosmos DB:

* [Enable Synapse Link for your Azure Cosmos DB accounts](#enable-synapse-link)
* [Create an analytical store enabled Azure Cosmos DB container](#create-analytical-ttl)
* [Optional - Update analytical store ttl for an Azure Cosmos DB container](#update-analytical-ttl)
* [Connect your Azure Cosmos DB database to a Synapse workspace](#connect-to-cosmos-database)
* [Query the analytical store using Synapse Spark](#query-analytical-store-spark)
* [Query the analytical store using serverless SQL pool](#query-analytical-store-sql-on-demand)
* [Use serverless SQL pool to analyze and visualize data in Power BI](#analyze-with-powerbi)

## <a id="enable-synapse-link"></a>Enable Azure Synapse Link for Azure Cosmos DB accounts

### Azure portal

1. Sign into the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure account](create-sql-api-dotnet.md#create-account), or select an existing Azure Cosmos DB account.

1. Navigate to your Azure Cosmos DB account and open the **Features** pane.

1. Select **Synapse Link** from the features list.

   :::image type="content" source="./media/configure-synapse-link/find-synapse-link-feature.png" alt-text="Find Synapse Link feature":::

1. Next it prompts you to enable synapse link on your account. Select **Enable**. This process can take 1 to 5 minutes to complete.

   :::image type="content" source="./media/configure-synapse-link/enable-synapse-link-feature.png" alt-text="Enable Synapse Link feature":::

1. Your account is now enabled to use Synapse Link. Next see how to create analytical store enabled containers to automatically start replicating your operational data from the transactional store to the analytical store.

> [!NOTE]
> Turning on Synapse Link does not turn on the analytical store automatically. Once you enable Synapse Link on the Cosmos DB account, enable analytical store on containers when you create them, to start replicating your operation data to analytical store. 

### Azure CLI

The following links shows how to enabled Synapse Link by using Azure CLI:

* [Create a new Azure Cosmos DB account with Synapse Link enabled](/cli/azure/cosmosdb#az_cosmosdb_create-optional-parameters)
* [Update an existing Azure Cosmos DB account to enable Synapse Link](/cli/azure/cosmosdb#az_cosmosdb_update-optional-parameters)

### PowerShell

* [Create a new Azure Cosmos DB account with Synapse Link enabled](/powershell/module/az.cosmosdb/new-azcosmosdbaccount#description)
* [Update an existing Azure Cosmos DB account to enable Synapse Link](/powershell/module/az.cosmosdb/update-azcosmosdbaccount)


The following links shows how to enabled Synapse Link by using PowerShell:

## <a id="create-analytical-ttl"></a> Create an Azure Cosmos container with analytical store

You can turn on analytical store on an Azure Cosmos container while creating the container. You can use the Azure portal or configure the `analyticalTTL` property during container creation by using the Azure Cosmos DB SDKs.

> [!NOTE]
> Currently you can enable analytical store for **new** containers (both in new and existing accounts). You can migrate data from your exisitng containers to new containers using [Azure Cosmos DB migration tools.](cosmosdb-migrationchoices.md)

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/) or the [Azure Cosmos DB Explorer](https://cosmos.azure.com/).

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **New Container** and enter a name for your database, container, partition key and throughput details. Turn on the **Analytical store** option. After you enable the analytical store, it creates a container with `AnalyicalTTL` property set to the default value of  -1 (infinite retention). This analytical store that retains all the historical versions of records.

   :::image type="content" source="./media/configure-synapse-link/create-container-analytical-store.png" alt-text="Turn on analytical store for Azure Cosmos container":::

1. If you have previously not enabled Synapse Link on this account, it will prompt you to do so because it's a pre-requisite to create an analytical store enabled container. If prompted, select **Enable Synapse Link**. This process can take 1 to 5 minutes to complete.

1. Select **OK**, to create an analytical store enabled Azure Cosmos container.

1. After the container is created, verify that analytical store has been enabled by clicking **Settings**, right below Documents in Data Explorer, and check if the **Analytical Store Time to Live** option is turned on.

### .NET SDK

The following code creates a container with analytical store by using the .NET SDK. Set the analytical TTL property to the required value. For the list of allowed values, see the [analytical TTL supported values](analytical-store-introduction.md#analytical-ttl) article:

```csharp
// Create a container with a partition key, and analytical TTL configured to -1 (infinite retention)
ContainerProperties properties = new ContainerProperties()
{
    Id = "myContainerId",
    PartitionKeyPath = "/id",
    AnalyticalStoreTimeToLiveInSeconds = -1,
};
CosmosClient cosmosClient = new CosmosClient("myConnectionString");
await cosmosClient.GetDatabase("myDatabase").CreateContainerAsync(properties);
```

### Java V4 SDK

The following code creates a container with analytical store by using the Java V4 SDK. Set the `AnalyticalStoreTimeToLiveInSeconds` property to the required value:

```java
// Create a container with a partition key and  analytical TTL configured to  -1 (infinite retention) 
CosmosContainerProperties containerProperties = new CosmosContainerProperties("myContainer", "/myPartitionKey");

containerProperties.setAnalyticalStoreTimeToLiveInSeconds(-1);

container = database.createContainerIfNotExists(containerProperties, 400).block().getContainer();
```

### Python V4 SDK

Python 2.7 and Azure Cosmos DB SDK 4.1.0 are the minimum versions required, and the SDK is only compatible with the SQL API.

The first step is to make sure that you are using at least version 4.1.0 of the [Azure Cosmos DB Python SDK](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cosmos/azure-cosmos):

```python
import azure.cosmos as cosmos

print (cosmos.__version__)
```
The next step creates a container with analytical store by using the Azure Cosmos DB Python SDK:

```python
# Azure Cosmos DB Python SDK, for SQL API only.
# Creating an analytical store enabled container.

import azure.cosmos.cosmos_client as cosmos_client
import azure.cosmos.exceptions as exceptions
from azure.cosmos.partition_key import PartitionKey

HOST = 'your-cosmos-db-account-URI'
KEY = 'your-cosmos-db-account-key'
DATABASE = 'your-cosmos-db-database-name'
CONTAINER = 'your-cosmos-db-container-name'

client = cosmos_client.CosmosClient(HOST,  KEY )
# setup database for this sample. 
# If doesn't exist, creates a new one with the name informed above.
try:
    db = client.create_database(DATABASE)

except exceptions.CosmosResourceExistsError:
    db = client.get_database_client(DATABASE)

# Creating the container with analytical store enabled, using the name informed above.
# If a container with the same name exists, an error is returned.
#
# The 3 options for the analytical_storage_ttl parameter are:
# 1) 0 or Null or not informed (Not enabled).
# 2) -1 (The data will be stored in analytical store infinitely).
# 3) Any other number is the actual ttl, in seconds.

try:
    container = db.create_container(
        id=CONTAINER,
        partition_key=PartitionKey(path='/id', kind='Hash'),analytical_storage_ttl=-1
    )
    properties = container.read()
    print('Container with id \'{0}\' created'.format(container.id))
    print('Partition Key - \'{0}\''.format(properties['partitionKey']))

except exceptions.CosmosResourceExistsError:
    print('A container with already exists')
```

### Azure CLI

The following links show how to create an analytical store enabled containers by using Azure CLI:

* [Azure Cosmos DB API for Mongo DB](/cli/azure/cosmosdb/mongodb/collection#az_cosmosdb_mongodb_collection_create-examples)
* [Azure Cosmos DB SQL API](/cli/azure/cosmosdb/sql/container#az_cosmosdb_sql_container_create)

### PowerShell

The following links show how to create an analytical store enabled containers by using PowerShell:

* [Azure Cosmos DB API for Mongo DB](/powershell/module/az.cosmosdb/new-azcosmosdbmongodbcollection#description)
* [Azure Cosmos DB SQL API](/cli/azure/cosmosdb/sql/container#az_cosmosdb_sql_container_create)


## <a id="update-analytical-ttl"></a> Optional - Update the analytical store time to live

After the analytical store is enabled with a particular TTL value, you may want to update it to a different valid value later. You can update the value by using the Azure portal, Azure CLI, PowerShell, or Cosmos DB SDKs. For information on the various Analytical TTL config options, see the [analytical TTL supported values](analytical-store-introduction.md#analytical-ttl) article.


### Azure portal

If you created an analytical store enabled container through the Azure portal, it contains a default analytical TTL of -1. Use the following steps to update this value:

1. Sign in to the [Azure portal](https://portal.azure.com/) or the [Azure Cosmos DB Explorer](https://cosmos.azure.com/).

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select an existing container that has analytical store enabled. Expand it and modify the following values:

  * Open the **Scale & Settings** window.
  * Under **Setting** find,** Analytical Storage Time to Live**.
  * Select **On (no default)** or select **On** and set a TTL value
  * Click **Save** to save the changes.

### .NET SDK

The following code shows how to update the TTL for analytical store by using the .NET SDK:

```csharp
// Get the container, update AnalyticalStorageTimeToLiveInSeconds 
ContainerResponse containerResponse = await client.GetContainer("database", "container").ReadContainerAsync();
// Update analytical store TTL
containerResponse.Resource. AnalyticalStorageTimeToLiveInSeconds = 60 * 60 * 24 * 180  // Expire analytical store data in 6 months;
await client.GetContainer("database", "container").ReplaceContainerAsync(containerResponse.Resource);
```

### Java V4 SDK

The following code shows how to update the TTL for analytical store by using the Java V4 SDK:

```java
CosmosContainerProperties containerProperties = new CosmosContainerProperties("myContainer", "/myPartitionKey");

// Update analytical store TTL to expire analytical store data in 6 months;
containerProperties.setAnalyticalStoreTimeToLiveInSeconds (60 * 60 * 24 * 180 );  
 
// Update container settings
container.replace(containerProperties).block();
```

### Python V4 SDK

Currently not supported.


### Azure CLI

The following links show how to update containers analytical TTL by using Azure CLI:

* [Azure Cosmos DB API for Mongo DB](/cli/azure/cosmosdb/mongodb/collection#az_cosmosdb_mongodb_collection_update)
* [Azure Cosmos DB SQL API](/cli/azure/cosmosdb/sql/container#az_cosmosdb_sql_container_update)

### PowerShell

The following links show how to update containers analytical TTL by using PowerShell:

* [Azure Cosmos DB API for Mongo DB](/powershell/module/az.cosmosdb/update-azcosmosdbmongodbcollection)
* [Azure Cosmos DB SQL API](/powershell/module/az.cosmosdb/update-azcosmosdbsqlcontainer)


## <a id="connect-to-cosmos-database"></a> Connect to a Synapse workspace

Use the instructions in [Connect to Azure Synapse Link](../synapse-analytics/synapse-link/how-to-connect-synapse-link-cosmos-db.md) on how to access an Azure Cosmos DB database from Azure Synapse Analytics Studio with Azure Synapse Link.

## <a id="query-analytical-store-spark"></a> Query analytical store using Apache Spark for Azure Synapse Analytics

Use the instructions in the [Query Azure Cosmos DB analytical store](../synapse-analytics/synapse-link/how-to-query-analytical-store-spark.md) article on how to query with Synapse Spark. That article gives some examples on how you can interact with the analytical store from Synapse gestures. Those gestures are visible when you right-click on a container. With gestures, you can quickly generate code and tweak it to your needs. They are also perfect for discovering data with a single click.

## <a id="query-analytical-store-sql-on-demand"></a> Query the analytical store using serverless SQL pool in Azure Synapse Analytics

Serverless SQL pool allows you to query and analyze data in your Azure Cosmos DB containers that are enabled with Azure Synapse Link. You can analyze data in near real-time without impacting the performance of your transactional workloads. It offers a familiar T-SQL syntax to query data from the analytical store and integrated connectivity to a wide range of BI and ad-hoc querying tools via the T-SQL interface. To learn more, see the [Query analytical store using serverless SQL pool](../synapse-analytics/sql/query-cosmos-db-analytical-store.md) article.

## <a id="analyze-with-powerbi"></a>Use serverless SQL pool to analyze and visualize data in Power BI

You can build a serverless SQL pool database and views over Synapse Link for Azure Cosmos DB. Later you can query the Azure Cosmos containers and then build a model with Power BI over those views to reflect that query. To learn more, see how to use [Serverless SQL pool to analyze Azure Cosmos DB data with Synapse Link](synapse-link-power-bi.md) article.

## Azure Resource Manager template

The [Azure Resource Manager template](./manage-with-templates.md#azure-cosmos-account-with-analytical-store) creates a Synapse Link enabled Azure Cosmos DB account for SQL API. This template creates a Core (SQL) API account in one region with a container configured with analytical TTL enabled, and an option to use manual or autoscale throughput. To deploy this template, click on **Deploy to Azure** on the readme page.

## <a id="cosmosdb-synapse-link-samples"></a> Getting started with Azure Synapse Link - Samples

You can find samples to get started with Azure Synapse Link on [GitHub](https://aka.ms/cosmosdb-synapselink-samples). These showcase end-to-end solutions with IoT and retail scenarios. You can also find the samples corresponding to Azure Cosmos DB API for MongoDB in the same repo under the [MongoDB](https://github.com/Azure-Samples/Synapse/tree/main/Notebooks/PySpark/Synapse%20Link%20for%20Cosmos%20DB%20samples) folder. 

## Next steps

To learn more, see the following docs:

* [Azure Synapse Link for Azure Cosmos DB.](synapse-link.md)

* [Azure Cosmos DB analytical store overview.](analytical-store-introduction.md)

* [Frequently asked questions about Synapse Link for Azure Cosmos DB.](synapse-link-frequently-asked-questions.yml)

* [Apache Spark in Azure Synapse Analytics](../synapse-analytics/spark/apache-spark-concepts.md).

* [Serverless SQL pool runtime support in Azure Synapse Analytics](../synapse-analytics/sql/on-demand-workspace-overview.md).

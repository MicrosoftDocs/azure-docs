---
title: Configure and use Azure Synapse Link for Azure Cosmos DB
description: Learn how to enable Synapse Link for Azure Cosmos DB accounts, create a container with analytical store enabled, connect the Azure Cosmos DB database to Synapse workspace, and run queries. 
author: Rodrigossz
ms.service: cosmos-db
ms.topic: how-to
ms.date: 09/26/2022
ms.author: rosouz
ms.custom: references_regions, synapse-cosmos-db, ignite-2022
---

# Configure and use Azure Synapse Link for Azure Cosmos DB
[!INCLUDE[NoSQL, MongoDB, Gremlin](includes/appliesto-nosql-mongodb-gremlin.md)]

[Azure Synapse Link for Azure Cosmos DB](synapse-link.md) is a cloud-native hybrid transactional and analytical processing (HTAP) capability that enables you to run near real-time analytics over operational data in Azure Cosmos DB. Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

Azure Synapse Link is available for Azure Cosmos DB SQL API or for Azure Cosmos DB API for Mongo DB accounts. And it is in preview for Gremlin API, with activation via CLI commands. Use the following steps to run analytical queries with the Azure Synapse Link for Azure Cosmos DB:

* [Enable Azure Synapse Link for your Azure Cosmos DB accounts](#enable-synapse-link)
* [Enable Azure Synapse Link for your containers](#update-analytical-ttl)
* [Connect your Azure Cosmos DB database to an Azure Synapse workspace](#connect-to-cosmos-database)
* [Query analytical store using Azure Synapse Analytics](#query)
* [Improve performance with Best Practices](#best)
* [Use Azure Synapse serverless SQL pool to analyze and visualize data in Power BI](#analyze-with-powerbi)

You can also check the training module on how to [configure Azure Synapse Link for Azure Cosmos DB](/training/modules/configure-azure-synapse-link-with-azure-cosmos-db/).

## <a id="enable-synapse-link"></a>Enable Azure Synapse Link for Azure Cosmos DB accounts

The first step to use Synapse Link is to enable it for your Azure Cosmos DB database account.

> [!NOTE]
> If you want to use customer-managed keys with Azure Synapse Link, you must configure your account's managed identity in your Azure Key Vault access policy before enabling Synapse Link on your account. To learn more, see how to [Configure customer-managed keys using Azure Cosmos DB accounts' managed identities](how-to-setup-cmk.md#using-managed-identity) article.

> [!NOTE]
> If you want to use Full Fidelity Schema for API for NoSQL accounts, you can't use the Azure portal to enable Synapse Link. This option can't be changed after Synapse Link is enabled in your account and to set it you must use Azure CLI or PowerShell. For more information, check [analytical store schema representation documentation](analytical-store-introduction.md#schema-representation). 

> [!NOTE]
> You need [Contributor role](role-based-access-control.md) to enable Synapse Link at account level. And you need at least [Operator role](role-based-access-control.md) to enable Synapse Link in your containers or collections.

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. [Create a new Azure account](create-sql-api-dotnet.md#create-account), or select an existing Azure Cosmos DB account.

1. Navigate to your Azure Cosmos DB account and open the **Azure Synapse Link** under Intergrations in the left pane.

1. Select **Enable**. This process can take 1 to 5 minutes to complete.

   :::image type="content" source="./media/configure-synapse-link/enable-synapse-link.png" alt-text="Screenshot showing how to enable Synapse Link feature.":::

1. Your account is now enabled to use Synapse Link. Next see how to create analytical store enabled containers to automatically start replicating your operational data from the transactional store to the analytical store.

> [!NOTE]
> Turning on Synapse Link does not turn on the analytical store automatically. Once you enable Synapse Link on the Cosmos DB account, enable analytical store on containers to start using Synapse Link. 

> [!NOTE]
> You can also enable Synapse Link for your account using the **Power BI** and the **Synapse Link** pane, in the **Integrations** section of the left navigation menu.

### Command-Line Tools

Enable Synapse Link in your Azure Cosmos DB API for NoSQL or MongoDB account using Azure CLI or PowerShell.

#### Azure CLI

Use `--enable-analytical-storage true` for both **create** or **update** operations. You also need to choose the representation schema type. For API for NoSQL accounts you can use `--analytical-storage-schema-type` with the values `FullFidelity` or `WellDefined`. For API for MongoDB accounts, always use `--analytical-storage-schema-type FullFidelity`.

* [Create a new Azure Cosmos DB account with Synapse Link enabled](/cli/azure/cosmosdb#az-cosmosdb-create-optional-parameters)
* [Update an existing Azure Cosmos DB account to enable Synapse Link](/cli/azure/cosmosdb#az-cosmosdb-update-optional-parameters)

##### Use Azure CLI to enable Synapse Link for Azure Synapse Link for Gremlin API account. 
Synapse Link for Gremlin API is now in preview. You can enable Synapse Link in your new or existing graphs using Azure CLI. Use the CLI command below to enable Synapse Link for your Gremlin API account:

```cli
az cosmosdb create --capabilities EnableGremlin --name MyCosmosDBGremlinDatabaseAccount --resource-group MyResourceGroup --enable-analytical-storage true
```

For existing Gremlin API accounts, replace `create` with `update`.

#### PowerShell

Use `EnableAnalyticalStorage true` for both **create** or **update** operations. You also need to choose the representation schema type. For API for NoSQL accounts you can use `--analytical-storage-schema-type` with the values `FullFidelity` or `WellDefined`. For API for MongoDB accounts, always use `-AnalyticalStorageSchemaType FullFidelity`.

* [Create a new Azure Cosmos DB account with Synapse Link enabled](/powershell/module/az.cosmosdb/new-azcosmosdbaccount#description)
* [Update an existing Azure Cosmos DB account to enable Synapse Link](/powershell/module/az.cosmosdb/update-azcosmosdbaccount)

#### Azure Resource Manager template

This [Azure Resource Manager template](./manage-with-templates.md#azure-cosmos-account-with-analytical-store) creates a Synapse Link enabled Azure Cosmos DB account for SQL API. This template creates a Core (SQL) API account in one region with a container configured with analytical TTL enabled, and an option to use manual or autoscale throughput. To deploy this template, click on **Deploy to Azure** on the readme page.

## <a id="update-analytical-ttl"></a> Enable Azure Synapse Link for your containers

The second step is to enable Synapse Link for your containers or collections. This is accomplished by setting the `analytical TTL` property to `-1` for infinite retention, or to a positive integer, that is the number of seconds that you want to keep in analytical store. This setting can be changed later. For more information, see the [analytical TTL supported values](analytical-store-introduction.md#analytical-ttl) article.

Please note the following details when enabling Azure Synapse Link on your existing SQL API containers:

* The same performance isolation of the analytical store auto-sync process applies to the initial sync and there is no performance impact on your OLTP workload.
* A container's initial sync with analytical store total time will vary depending on the data volume and on the documents complexity. This process can take anywhere from a few seconds to multiple days. Please use the Azure portal to monitor the migration progress.
* The throughput of your container, or database account, also influences the total initial sync time. Although RU/s are not used in this migration, the total RU/s available influences the performance of the process. You can temporarily increase your environment's available RUs to speed up the process.
* You won't be able to query analytical store of an existing container while Synapse Link is being enabled on that container. Your OLTP workload isn't impacted and you can keep on reading data normally. Data ingested after the start of the initial sync will be merged into analytical store by the regular analytical store auto-sync process.

> [!NOTE]
> Now you can enable Synapse Link on your existing MongoDB API collections, using Azure CLI or PowerShell.


### Azure portal

#### New container 
1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB Explorer](https://cosmos.azure.com).

1. Navigate to your Azure Cosmos DB account and open the **Data Explorer** tab.

1. Select **New Container** and enter a name for your database, container, partition key and throughput details. Turn on the **Analytical store** option. After you enable the analytical store, it creates a container with `analytical TTL` property set to the default value of  -1 (infinite retention). This analytical store that retains all the historical versions of records and can be changed later.

   :::image type="content" source="./media/configure-synapse-link/create-container-analytical-store.png" alt-text="Turn on analytical store for Azure Cosmos DB container":::

1. If you have previously not enabled Synapse Link on this account, it will prompt you to do so because it's a pre-requisite to create an analytical store enabled container. If prompted, select **Enable Synapse Link**. This process can take 1 to 5 minutes to complete.

1. Select **OK**, to create an analytical store enabled Azure Cosmos DB container.

1. After the container is created, verify that analytical store has been enabled by clicking **Settings**, right below Documents in Data Explorer, and check if the **Analytical Store Time to Live** option is turned on.

#### Existing container

1. Sign in to the [Azure portal](https://portal.azure.com) or the [Azure Cosmos DB Explorer](https://cosmos.azure.com).

1. Navigate to your Azure Cosmos DB account and open the **Azure Synapse Link** tab.

1. Under the **Enable Azure Synapse Link for your containers** section select the container. 

   :::image type="content" source="./media/configure-synapse-link/enable-synapse-link-existing-container.png" alt-text="Screenshot showing how to turn on analytical store for an Azure Cosmos DB existing container.":::

1. After the container enablement, verify that analytical store has been enabled by clicking **Settings**, right below Documents in Data Explorer, and check if the **Analytical Store Time to Live** option is turned on.

> [!NOTE]
> You can also enable Synapse Link for your account using the **Power BI** and the **Synapse Link** pane, in the **Integrations** section of the left navigation menu.

### Command-Line Tools

#### Azure CLI

The following options enable Synapse Link in a container by using Azure CLI by setting the `--analytical-storage-ttl` property. 

* [Create or update an Azure Cosmos DB MongoDB collection](/cli/azure/cosmosdb/mongodb/collection#az-cosmosdb-mongodb-collection-create-examples)
* [Create or update an Azure Cosmos DB SQL API container](/cli/azure/cosmosdb/sql/container#az-cosmosdb-sql-container-create)

##### Use Azure CLI to enable Synapse Link for Azure Synapse Link for Gremlin API Graphs

Synapse Link for Gremlin API is now in preview. You can enable Synapse Link in your new or existing Graphs using Azure CLI. Use the CLI command below to enable Synapse Link for your Gremlin API graphs:

```cli
az cosmosdb gremlin graph create --g MyResourceGroup --a MyCosmosDBGremlinDatabaseAccount --d MyGremlinDB --n MyGraph --analytical-storage-ttl –1
```

For existing graphs, replace `create` with `update`.

#### PowerShell

The following options enable Synapse Link in a container by using Azure CLI by setting the `-AnalyticalStorageTtl` property. 

* [Create or update an Azure Cosmos DB MongoDB collection](/powershell/module/az.cosmosdb/new-azcosmosdbmongodbcollection#description)
* [Create or update an Azure Cosmos DB SQL API container](/powershell/module/az.cosmosdb/new-azcosmosdbsqlcontainer)


### Azure Cosmos DB SDKs - SQL API only

#### .NET SDK

The following .NET code creates a Synapse Link enabled container by setting the `AnalyticalStoreTimeToLiveInSeconds` property. To update an existing container, use the `Container.ReplaceContainerAsync` method.

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

#### Java V4 SDK

The following Java code creates a Synapse Link enabled container by setting the `setAnalyticalStoreTimeToLiveInSeconds` property. To update an existing container, use the `container.replace` class.

```java
// Create a container with a partition key and  analytical TTL configured to  -1 (infinite retention) 
CosmosContainerProperties containerProperties = new CosmosContainerProperties("myContainer", "/myPartitionKey");

containerProperties.setAnalyticalStoreTimeToLiveInSeconds(-1);

container = database.createContainerIfNotExists(containerProperties, 400).block().getContainer();
```

#### Python V4 SDK

The following Python code creates a Synapse Link enabled container by setting the `analytical_storage_ttl` property. To update an existing container, use the `replace_container` method.

```python
# Client
client = cosmos_client.CosmosClient(HOST,  KEY )

# Database client
try:
    db = client.create_database(DATABASE)

except exceptions.CosmosResourceExistsError:
    db = client.get_database_client(DATABASE)

# Creating the container with analytical store enabled
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

## Optional - Disable analytical store

Analytical store can be disabled in SQL API containers or in MongoDB API collections, using Azure CLI or PowerShell. It is done by setting `analytical TTL` to `0`.

> [!NOTE]
> Please note that currently this action can't be undone. If analytical store is disabled in a container, it can never be re-enabled.

> [!NOTE]
> Please note that currently it is not possible to disable Synapse Link from a database account.

## <a id="connect-to-cosmos-database"></a> Connect to a Synapse workspace

Use the instructions in [Connect to Azure Synapse Link](../synapse-analytics/synapse-link/how-to-connect-synapse-link-cosmos-db.md) on how to access an Azure Cosmos DB database from Azure Synapse Analytics Studio with Azure Synapse Link.

## <a id="query"></a> Query analytical store using Azure Synapse Analytics

### Query analytical store using Apache Spark for Azure Synapse Analytics

Use the instructions in the [Query Azure Cosmos DB analytical store using Spark 3](../synapse-analytics/synapse-link/how-to-query-analytical-store-spark-3.md) article on how to query with Synapse Spark 3. That article gives some examples on how you can interact with the analytical store from Synapse gestures. Those gestures are visible when you right-click on a container. With gestures, you can quickly generate code and tweak it to your needs. They are also perfect for discovering data with a single click.

For Spark 2 integration use the instruction in the [Query Azure Cosmos DB analytical store using Spark 2](../synapse-analytics/synapse-link/how-to-query-analytical-store-spark.md) article.

### Query the analytical store using serverless SQL pool in Azure Synapse Analytics

Serverless SQL pool allows you to query and analyze data in your Azure Cosmos DB containers that are enabled with Azure Synapse Link. You can analyze data in near real-time without impacting the performance of your transactional workloads. It offers a familiar T-SQL syntax to query data from the analytical store and integrated connectivity to a wide range of BI and ad-hoc querying tools via the T-SQL interface. To learn more, see the [Query analytical store using serverless SQL pool](../synapse-analytics/sql/query-cosmos-db-analytical-store.md) article.

## <a id="analyze-with-powerbi"></a>Use serverless SQL pool to analyze and visualize data in Power BI

You can use the integrated BI experience in the Azure Cosmos DB portal, to build BI dashboards using Synapse Link with just a few clicks. To learn more, see [how to build BI dashboards using Synapse Link](integrated-power-bi-synapse-link.md). This integrated experience will create simple T-SQL views in Synapse serverless SQL pools, for your Azure Cosmos DB containers. You can build BI dashboards over these views, which will query your Azure Cosmos DB containers in real-time, using [Direct Query](/power-bi/connect-data/service-dataset-modes-understand#directquery-mode), reflecting latest changes to your data. There is no performance or cost impact to your transactional workloads, and no complexity of managing ETL pipelines.

If you want to use advanced T-SQL views with joins across your containers or build Power BI dashboards in [Import mode](/power-bi/connect-data/service-dataset-modes-understand#import-mode), see [Use serverless SQL pool to analyze Azure Cosmos DB data with Synapse Link](synapse-link-power-bi.md).

## <a id="best"></a> Improve Performance with Best Practices

### Custom Partitioning

Custom partitioning enables you to partition analytical store data on fields that are commonly used as filters in analytical queries, resulting in improved query performance. To learn more, see the [introduction to custom partitioning](custom-partitioning-analytical-store.md) and [how to configure custom partitioning](configure-custom-partitioning.md) articles.

### Synapse SQL Serverless best practices for Azure Synapse Link for Cosmos DB

Use [this](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/best-practices-for-integrating-serverless-sql-pool-with-cosmos/ba-p/3257975) mandatory best practices for your SQL serverless queries.


## <a id="cosmosdb-synapse-link-samples"></a> Getting started with Azure Synapse Link - Samples

You can find samples to get started with Azure Synapse Link on [GitHub](https://aka.ms/cosmosdb-synapselink-samples). These showcase end-to-end solutions with IoT and retail scenarios. You can also find the samples corresponding to Azure Cosmos DB for MongoDB in the same repo under the [MongoDB](https://github.com/Azure-Samples/Synapse/tree/main/Notebooks/PySpark/Synapse%20Link%20for%20Cosmos%20DB%20samples) folder. 

## Next steps

To learn more, see the following docs:

* Check the training module on how to [configure Azure Synapse Link for Azure Cosmos DB.](/training/modules/configure-azure-synapse-link-with-azure-cosmos-db/)
* [Azure Cosmos DB analytical store overview.](analytical-store-introduction.md)
* [Frequently asked questions about Synapse Link for Azure Cosmos DB.](synapse-link-frequently-asked-questions.yml)
* [Apache Spark in Azure Synapse Analytics](../synapse-analytics/spark/apache-spark-concepts.md).
* [Serverless SQL pool runtime support in Azure Synapse Analytics](../synapse-analytics/sql/on-demand-workspace-overview.md).

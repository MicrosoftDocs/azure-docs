---
title: Configure and use Azure Synapse Link for Azure Cosmos DB (preview)
description: Learn how to enable synapse link for Azure Cosmos accounts, create a container with analytical store enabled, connect the Azure Cosmos database to synapse workspace, and run queries. 
author: AnithaAdusumilli
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: anithaa
---

# Configure and use Azure Synapse Link for Azure Cosmos DB (preview)

Synapse Link for Azure Cosmos DB is a cloud native hybrid transactional and analytical processing (HTAP) capability that enables you to run near real-time analytics over operational data in Azure Cosmos DB. Synapse Link creates a tight seamless integration between Azure Cosmos DB and Azure Synapse Analytics.

> [!IMPORTANT]
> Synapse Link for Azure Cosmos DB is currently available in specific regions only, see the [available regions](synapse-link.md#supported-regions) list for more details. To use Azure Synapse Link, ensure you provision your Azure Cosmos  account & Azure Synapse Analytics workspace in one of the above supported regions.

Use the following steps to run analytical queries with the Synapse Link for Azure Cosmos DB:

* [Enable Synapse Link for your Azure Cosmos accounts]()
* [Create an analytical store enabled Azure Cosmos container]()
* [Connect your Azure Cosmos database to a Synapse workspace]()
* [Query analytical store using Synapse Spark]()


## Enable Azure Synapse Link for Azure Cosmos DB accounts

### Azure portal

1. Sign into the [Azure portal](https://portal.azure.com/).

1. [Create a new Azure Cosmos account](create-sql-api-dotnet#create-account.md), or select an existing Azure Cosmos account.

1. Navigate to your Azure Cosmos account and open the **Features** pane.

1. Select **Synapse Link** from the features list.

  ![Find Synapse Link preview feature](./media/configure-synapse-link/find-synapse-link-feature.png)

1. Next it prompts you to enable synapse link on your account. Select Enable.

  ![Enable Synapse Link feature](./media/configure-synapse-link/enable-synapse-link-feature.png)

1. Your account is now enabled to use Synapse Link. Next see how to create analytical store enabled containers to automatically start replicating your operational data from the transactional store to the analytical store.

### Azure Resource Manager template

The [Azure Resource Manager template]() creates a Synapse Link enabled Azure Cosmos account for SQL API. The account is configured with two regions and options to select consistency level, automatic failover, and multi-master. To deploy this template, click on Deploy to Azure on the readme page, Create Azure Cosmos account.

## Create an Azure Cosmos container with analytical store

You can turn on analytical store on an Azure Cosmos container while creating the container. You can use the Azure portal or configure the `analyticalTTL` property during container creation by using the Azure Cosmos DB SDKs.

> [!NOTE]
> Currently you can enable analytical store for **new** containers (both in new and existing accounts).

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com/) or the [Azure Cosmos explorer](https://cosmos.azure.com/).

1. Navigate to your Azure Cosmos account and open the **Data Explorer** tab.

1. Select **New Container** and enter a name for your database, container, partition key and throughput details. Turn on the **Analytical store** option. After you enable the analytical store, it creates a container with `AnalyicalTTL` property set to the default value of  -1 (infinite retention). This analytical store that retains all the historical versions of records.

  ![Turn on analytical store for Azure Cosmos container](./media/configure-synapse-link/create-container-analytical-store.png)

1. If you have previously not enabled Synapse Link on this account, it will prompt you to do so as this a pre-requisite to create an analytical store enabled container. If prompted, please select **Enable Synapse Link**.

1. Select **OK**, to create an analytical store enabled Azure Cosmos container.


### .NET SDK

The following code creates a container with analytical store by using the .Net SDK. Set the analyticalTTL property to the required value. For the list of allowed values, see the analytical TTL supported values article.

```csharp
// Create a container with a partition key and  analytical TTL configured to  -1 (infinite retention)
string containerId = “myContainerName”;
int analyticalTtlInSec = -1;
ContainerProperties cpInput = new ContainerProperties()
            {
Id = containerId,
PartitionKeyPath = "/id",
AnalyticalStorageTimeToLiveInSeconds = analyticalTtlInSec,
};
 await this. cosmosClient.GetDatabase("myDatabase").CreateContainerAsync(cpInput);
```

Python V3 SDK

The following code creates a container with analytical store by using the Python SDK:

```python
import azure.cosmos.cosmos_client as cosmos_client
def create_collection_if_not_exists(cosmosEndpoint, cosmosKey, databaseName, collectionName):
    client = cosmos_client.CosmosClient(url_connection=cosmosEndpoint, auth={'masterKey': cosmosKey})

db = client.QueryDatabases("select * from c where c.id = '" + databaseName + "'").fetch_next_block()[0]
options = {
    'offerThroughput': 1000
}

container_definition = {
    'id': collectionName,
    "partitionKey": {  
        "paths": [  
        "/id"  
        ],  
        "kind": "Hash" 
    },
    "indexingPolicy": {  
    "indexingMode": "consistent",  
    "automatic": True,  
    "includedPaths": [],  
    "excludedPaths": [{
        "path": "/*"
    }]  
    },
    "defaultTtl": -1,
    "analyticalStorageTtl": -1
}

container = client.CreateContainer(db['_self'], container_definition, options)
```

## Update the analytical store time to live

After the analytical store is enabled with a particular TTL value, you can update it to a different valid value later. You can update the value by using the Azure Portal or SDK’s. For information on the various Analytical TTL config options, see the [analytical TTL]() article.

### Azure portal

If you created an analytical store enabled container through the Azure portal, it contains a default analytical TTL of -1. Use the following steps to update this value:

1. Sign in to the [Azure portal](https://portal.azure.com/) or the [Azure Cosmos explorer](https://cosmos.azure.com/).

1. Navigate to your Azure Cosmos account and open the **Data Explorer** tab.

1. Select an existing container which has analytical store enabled. Expand it and modify the following values:

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

## Connect a Cosmos DB database to a Synapse workspace

## Query analytical store using Synapse Spark

## Next steps


---
title: Priority-based execution
titleSuffix: Azure Cosmos DB
description: Learn how to use Priority-based execution in Azure Cosmos DB.
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.custom: ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
---

# Priority-based execution in Azure Cosmos DB

[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

Priority based execution allows users to specify priority of requests sent to Azure Cosmos DB. In cases where the number of requests exceeds the capacity that can be processed within the configured Request Units per second (RU/s), then Azure Cosmos DB throttles low priority requests to prioritize the execution of high priority requests.

This feature enables users to execute critical tasks while delaying less important tasks when the total consumption of container exceeds the configured RU/s in high load scenarios by implementing throttling measures for low priority requests first. Any client application using SDK retries low priority requests in accordance with the [retry policy](../../articles/cosmos-db/nosql/conceptual-resilient-sdk-applications.md) configured.


> [!NOTE]
> Priority-based execution feature doesn't guarantee always throttling low priority requests in favor of high priority ones. This operates on best-effort basis and there are no SLA's linked to the performance of the feature.

## Use-cases

You can use priority-based execution when your application has different priorities for workloads running on the same container. For example, 

- Prioritizing read, write, or query operations.  
- Prioritizing user actions vs background operations like  
    - Stored procedures 
    - Data ingestion/migration 

## Getting started

To get started using priority-based execution, navigate to the **Features** page in you're in Azure Cosmos DB account. Select and enable the **Priority-based execution (preview)** feature.

:::image type="content" source="media/priority-based-execution/priority-based-execution-enable-feature.png" alt-text="Screenshot of Priority-based execution feature in the Features page in an Azure Cosmos DB account.":::

## SDK requirements 

- .NET v3: [v3.33.0-preview](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.33.0-preview) or later
- Java v4: [v4.45.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.45.0) or later
- Spark 3.2: [v4.19.0](https://central.sonatype.com/artifact/com.azure.cosmos.spark/azure-cosmos-spark_3-2_2-12/4.19.0) or later
- JavaScript v4: [v4.0.0](https://www.npmjs.com/package/@azure/cosmos) or later

## Code samples

#### [.NET SDK v3](#tab/net-v3)

```csharp
using Microsoft.Azure.Cosmos.PartitionKey;
using Microsoft.Azure.Cosmos.PriorityLevel;

Using Mircosoft.Azure.Cosmos.PartitionKey; 
Using Mircosoft.Azure.Cosmos.PriorityLevel; 

//update products catalog with low priority
RequestOptions catalogRequestOptions = new ItemRequestOptions{PriorityLevel = PriorityLevel.Low}; 

PartitionKey pk = new PartitionKey(“productId1”); 
ItemResponse<Product> catalogResponse = await this.container.CreateItemAsync<Product>(product1, pk, requestOptions); 

//Display product information to user with high priority
RequestOptions getProductRequestOptions = new ItemRequestOptions{PriorityLevel = PriorityLevel.High}; 

string id = “productId2”; 
PartitionKey pk = new PartitionKey(id); 

ItemResponse<Product> productResponse = await this.container.ReadItemAsync< Product>(id, pk, getProductRequestOptions); 
```

#### [Java SDK v4](#tab/java-v4)

```java
import com.azure.cosmos.ThroughputControlGroupConfig;
import com.azure.cosmos.ThroughputControlGroupConfigBuilder;
import com.azure.cosmos.models.CosmosItemRequestOptions;
import com.azure.cosmos.models.PriorityLevel;

class Family{
   String id;
   String lastName;
}

//define throughput control group with low priority
ThroughputControlGroupConfig groupConfig = new ThroughputControlGroupConfigBuilder()
                .groupName("low-priority-group")
                .priorityLevel(PriorityLevel.LOW)
                .build();
container.enableLocalThroughputControlGroup(groupConfig);

CosmosItemRequestOptions requestOptions = new CosmosItemRequestOptions();
        requestOptions.setThroughputControlGroupName(groupConfig.getGroupName());

Family family = new Family();
family.setLastName("Anderson");


// Insert this item with low priority in the container using request options.
container.createItem(family, new PartitionKey(family.getLastName()), requestOptions)
    .doOnSuccess((response) -> {
        logger.info("inserted doc with id: {}", response.getItem().getId());
    }).doOnError((exception) -> {
        logger.error("Exception. e: {}", exception.getLocalizedMessage(), exception);
    }).subscribe();
    
```
---

## Monitoring Priority-based execution

You can monitor the behavior of requests with low and high priority using Azure monitor metrics in Azure portal.

- Monitor **Total Requests (preview)** metric to observe the HTTP status codes and volume of low and high priority requests.
- Monitor the RU/s consumption of low and high priority requests using **Total Request Units (preview)** metric in Azure portal.


## Change default priority level of a Cosmos DB account

If Priority-based execution is enabled and priority level isn't specified for a request by the user, then all such requests are executed with **high** priority. You can change the default priority level of requests in a Cosmos DB account using Azure CLI. 

#### Azure CLI
```azurecli-interactive
# install preview Azure CLI version 0.26.0 or later
az extension add --name cosmosdb-preview --version 0.26.0

# set subscription context
az account set -s $SubscriptionId

# Enable priority-based execution
az cosmosdb update  --resource-group $ResourceGroup --name $AccountName --enable-priority-based-execution true

# change default priority level
az cosmosdb update  --resource-group $ResourceGroup --name $AccountName --default-priority-level low
```

## Data explorer priority

When Priority-based execution is enabled for a Cosmos DB account, all requests in the Azure portal's Data Explorer are executed with **low** priority. You can adjust this by changing the priority setting in the Data Explorer's **Settings** menu.

> [!NOTE]
>This client-side configuration is specific to the concerned user's Data explorer view only and won't affect other users' Data explorer priority level or the default priority level of the Cosmos DB account.

:::image type="content" source="media/priority-based-execution/priority-based-execution-data-explorer-config.png" alt-text="Screenshot of priority levels in Data explorer of an Azure Cosmos DB account.":::


## Limitations

Priority-based execution is currently not supported with following features:

- Serverless accounts
- Bulk execution API

The behavior of priority-based execution feature is nondeterministic for shared throughput database containers.

## Next steps

- See the FAQ on [Priority-based execution](priority-based-execution-faq.yml)
- Learn more about [Burst capacity](burst-capacity.md)

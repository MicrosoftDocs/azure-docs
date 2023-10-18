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

Priority based execution allows users to specify priority of requests sent to Azure Cosmos DB. In cases where the number of requests exceeds the capacity that can be processed within the configured Request Units per second (RU/s), then Azure Cosmos DB will throttle low priority requests to prioritize the execution of high priority requests.

This feature enables users to execute critical tasks while delaying less important tasks when the total consumption of container exceeds the configured RU/s in high load scenarios by implementing throttling measures for low priority requests first. Low priority requests will be retried by any client using an SDK based on the [retry policy](https://learn.microsoft.com/azure/cosmos-db/nosql/conceptual-resilient-sdk-applications#should-my-application-retry-on-errors) configured.


> [!NOTE]
> This feature is not guaranteed to always throttle low priority requests in favor of high priority ones. This operates on best-effort basis and there are no SLA's linked to the performance of the feature.

## Getting started

To get started using priority-based execution, navigate to the **Features** page in your in Azure Cosmos DB account. Select and enable the **Priority-based execution (preview)** feature.

:::image type="content" source="media/priority-based-execution/priority-based-execution-enable-feature.png" alt-text="Screenshot of Priority-based execution feature in the Features page in an Azure Cosmos DB account.":::

## SDK Requirements 

Below are the minimum SDK version requirement for priority-based execution.

- .NET v3: [v3.33.0-preview](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/3.33.0-preview) 
- Java v4: [v4.45.0](https://mvnrepository.com/artifact/com.azure/azure-cosmos/4.45.0) 
- Spark 3.2: [v4.19.0](https://central.sonatype.com/artifact/com.azure.cosmos.spark/azure-cosmos-spark_3-2_2-12/4.19.0) or later
- Javascript v4: [v4.0.0](https://www.npmjs.com/package/@azure/cosmos) or later

## Code Samples

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

## Limitations

Priority-based execution is currently not supported with following features:

- Shared throughput database
- Serverless accounts
- Bulk execution API

## Next Steps

- See the FAQ on [Priority-based execution](priority-based-execution-faq.md)
- Learn more about [Burst capacity](burst-capacity.md)

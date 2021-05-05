---
title: How to configure the Azure Cosmos DB integrated cache
description: Learn how to configure the Azure Cosmos DB integrated cache
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/25/2021
ms.author: tisande
---

# How to configure the Azure Cosmos DB integrated cache
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

Follow the steps in this tutorial to provision a dedicated gateway, configure the integrated cache, and connect your application. 

Prerequisites:

- Azure subscription
- An existing application that uses Azure Cosmos DB. If you don't have one, [here are some examples](https://github.com/AzureCosmosDB/labs).
- An existing Azure Cosmos DB SQL (core) API account

1. Navigate to an Azure Cosmos DB account in the Azure Portal and select the **Dedicated Gateway** tab.

:::image type="content" source="./media/how-to-configure-integrated-cache/dedicated-gateway-tab.png" alt-text="An image that shows how to navigate to the dedicated gateway tab" border="false":::

2. Switch the **Dedicated Gateway** toggle to **Provisioned**. Select a size and number of nodes. For development, we recommend starting with 1 node of the D4 size. Based on the amount of data you need to cache, you can consider increasing the node size after initial testing.

:::image type="content" source="./media/how-to-configure-integrated-cache/dedicated-gateway-input.png" alt-text="An image that shows how to navigate to the dedicated gateway tab" border="false":::

3. Click **Save** and wait about 5-10 minutes for the dedicated gateway provisioning to complete. When the provisioning is done, you'll see the below notification:

:::image type="content" source="./media/how-to-configure-integrated-cache/dedicated-gateway-notification.png" alt-text="An image that shows how to check if dedicated gateway provisioning is complete" border="false":::

4. When you create a dedicated gateway, an integrated cache is automatically provisioned. The integrated cache will use approximately 70% of the memory in the dedicated gateway. The remaining 30% of memory in the dedicated gateway is used for routing requests to the backend partitions.

5.	Modify your application's connection string to use the new dedicated gateway endpoint. If you are using the .NET or Java SDK, set the connection mode to [gateway mode](sql-sdk-connection-modes.md#available-connectivity-modes). Since the Python and Node.js SDK's only support gateway mode, you will only need to modify the connection string for these SDK's.

The updated dedicated gateway connection string is in the **Keys** blade:

:::image type="content" source="./media/how-to-configure-integrated-cache/dedicated-gateway-connection-string.png" alt-text="An image that shows the dedicated gateway connection string" border="false":::

All dedicated gateway connection strings follow the same pattern. Remove `documents.azure.com` from you original connection string and replace it with `sqlx.cosmos.azure.com`. A dedicated gateway will always have the same connection string, even if you remove and re-provision it.

You don’t need to modify the connection string in all applications using the same Azure Cosmos DB account. For example, you could have one `CosmosClient` connect using gateway mode and the dedicated gateway endpoint while another `CosmosClient` uses direct mode. In other words, adding a dedicated gateway doesn't impact the existing ways of connecting to Azure Cosmos DB.

6. Adjust request consistency. The easiest way to configure eventual consistency for all reads is to [set it at the account-level](consistency-levels.md#configure-the-default-consistency-level). You can also configure consistency at the [request-level](how-to-manage-consistency.md#override-the-default-consistency-level), which is recommend if you only want a subset of your reads to utilize the integrated cache.

7. Configure `MaxCacheStaleness`, which is the maximum time in which you are willing to tolerate stale cached data. We recommend setting the `MaxCacheStaleness` as high as possible because it will increase the likelihood that repeated point reads and queries can be cache hits. If you set `MaxCacheStaleness` to 0, your read request will **never** use the integrated cache, regardless of the consistency level. When not configured, the default `MaxCacheStaleness` is 5 minutes.

**.NET**

```csharp

FeedIterator<Food> queryA = container.GetItemQueryIterator<Food>(new QueryDefinition(sqlA), requestOptions: new QueryRequestOptions
        {
            ConsistencyLevel = ConsistencyLevel.Eventual,
            DedicatedGatewayRequestOptions = new DedicatedGatewayRequestOptions 
            { 
                MaxIntegratedCacheStaleness = TimeSpan.FromMinutes(30) 
            }
        }
);
```

**Java**

```java

```

> [!NOTE]
> You can only adjust the MaxCacheStaleness using the latest .NET and Java preview SDK's

8. Finally, you can restart your application and verify cache hits for repeated point reads or queries. Once you’ve modified your `CosmosClient` to use the dedicated gateway endpoint, all requests will be routed through the dedicated gateway.

For a read request (point read or query) to utilize the integrated cache, **all** of the following must be true:

-	You must connect to the dedicated gateway endpoint
-   You must use gateway mode (Python and Node.js SDK's always use gateway mode)
-	The consistency for the request must be set to eventual consistency.

Next steps:

- [Integrated cache FAQ](integrated-cache-faq.md)
- [Integrated cache overview](integrated-cache.md)
- [Dedicated gateway](dedicated-gateway.md)

---
title: Azure Cosmos DB Dedicated gateway
description: Learn about the dedicated gateway in Azure Cosmos DB
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/25/2021
ms.author: tisande
---

# Azure Cosmos DB dedicated gateway - Overview
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

A dedicated gateway is compute that is a front-end to your Azure Cosmos DB account. When you connect to the dedicated gateway, it routes requests as well as caches data. Like provisioned throughput, the dedicated gateway is billed hourly.

There are three ways to connect to an Azure Cosmos DB account:

- Direct mode
- Gateway mode using the standard gateway
- Gateway mode using the dedicated gateway (only available for SQL API accounts)

### Connect to Cosmos DB using direct mode:

When you connect to Cosmos DB using direct mode, your application connects directly to the Cosmos DB backend. Even if you have many physical partitions, request routing is handled entirely client-side. Direct mode offers low latency because your application can communicate directly with the Cosmos DB backend.

Diagram of direct mode connection:

:::image type="content" source="./media/dedicated-gateway/direct-mode.png" alt-text="An image that shows how Cosmos DB direct mode works" border="false":::

### Connect to Cosmos DB using gateway mode:

If you connect to Cosmos DB using gateway mode, your application will connect to a front-end node first, which handles routing the request to the appropriate backend nodes. Because gateway mode involves an additional network hop, you may observe slightly higher latency for gateway mode than direct mode. 

When connecting to Cosmos DB with gateway mode, you can connect with either the standard gateway or the dedicated gateway. While the Cosmos DB backend (your provisioned throughput and stored data) has dedicated capacity per container, the standard gateway is shared among many customers. It is practical for many customers to share a standard gateway since the compute resources consumed by each individual customer is minimal. The integrated cache requires a dedicated gateway because it is specific to your Azure Cosmos DB account and requires significant CPU and memory.

### Connect to Cosmos DB using the dedicated gateway:

You must connect to Cosmos DB using the dedicated gateway to use the integrated cache. The dedicated gateway has a different endpoint from the standard one provided with your Cosmos DB account. When you connect to your dedicated gateway endpoint, your application sends a request to the dedicated gateway which then routes the request to different backend nodes or, if possible, the integrated cache.

Diagram of gateway mode connection with a dedicated gateway:

:::image type="content" source="./media/dedicated-gateway/dedicated-gateway-mode.png" alt-text="An image that shows how the Cosmos DB dedicated gateway works" border="false":::
 
## Provisioning the dedicated gateway

A dedicated gateway cluster can be provisioned in any Core (SQL) API accounts. A dedicated gateway cluster can have up to 5 nodes and you can add or remove nodes at any time. All dedicated gateway nodes within your Cosmos DB account share the same connection string.

Dedicated gateway nodes are independent from one another. When you provision multiple dedicated gateway nodes, any single node can route any given request. In addition, each node has a separate cache from the others. The cached data within each node depends on the the data that was recently [written or read](LINK to cache) through that specific node. In other words, if an item or query is cached on one node, it isn't necessarily cached on the others.

For development, we recommend starting with 1 node but for production, you should provision 3 or more nodes for high availability. [Learn how to provision a dedicated gateway cluster](how-to). Provisioning multiple dedicated gateway allows the dedicated gateway cluster to continue to routes requests and serve cached data, even when one of the dedicated gateway nodes is unavailable. Because it is in public preview, the dedicated gateway does not have an availability SLA. However, you should generally expect comparable availability to the rest of your Cosmos DB account.

The dedicated gateway is available in the following sizes:

| **Sku Name** | **vCPU** | **Memory**  |
| ------------ | -------- | ----------- |
| **D4s**      | **4**    | **16 GB** |
| **D8s**      | **8**    | **32 GB** |
| **D16s**     | **16**   | **64 GB** |

> [!NOTE]
> Once created, you can't modify the size of the dedicated gateway nodes.

## Dedicated gateway in multi-region accounts

When you provision a dedicated gateway cluster in multi-region Cosmos DB accounts, identical gateway clusters are provisioned in each region. For example, consider a Cosmos DB account in East US and North Europe. If you provision a dedicated gateway cluster with 2 D8 nodes in this Cosmos DB account, you'd have 4 D8 nodes in total - 2 in East US and 2 in North Europe. You don't need to explicitly configure dedicated gateways in each region and your connection string won't change. There are also no changes to best practices for performing failovers. 

> [!NOTE]
> You cannot provision a dedicated gateway cluster in Cosmos DB accounts with availability zones enabled

Like nodes within a cluster, dedicated gateway nodes across regions are independent. It's possible that the cached data in each region will be different, depending on the recent reads or writes to that region. The best way to manage consistency for cached requests is to customize the [MaxCacheStalenes](LINK to MaxCacheStaleness) for each request.

## Next steps

Read more about dedicated gateway usage in the following articles:

- [Integrated cache](integrated-cache.md)
- [Configure the integrated cache](how-to-configure-integrated-cache.md)
- [Integrated cache FAQ](integrated-cache-faq.md)
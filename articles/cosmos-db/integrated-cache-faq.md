---
title: Azure Cosmos DB integrated cache frequently asked questions
description: Frequently asked questions about the Azure Cosmos DB integrated cache.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/29/2022
ms.author: sidandrews
ms.reviewer: jucocchi
---

# Azure Cosmos DB integrated cache frequently asked questions
[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

The Azure Cosmos DB integrated cache is an in-memory cache that is built in to Azure Cosmos DB. This article answers commonly asked questions about the Azure Cosmos DB integrated cache.

## Frequently asked questions

### Why does the integrated cache require a dedicated gateway?

If you’ve connected to Azure Cosmos DB using gateway mode, you’ve used the standard gateway. While the Azure Cosmos DB backend (your provisioned throughput and storage) has dedicated capacity per container, the standard gateway is shared among many customers. It is practical for many customers to share a standard gateway since the compute resources consumed by each individual customer are minimal. Because the integrated cache is specific to your Azure Cosmos DB account and requires significant CPU and memory, it requires dedicated gateway nodes. 

### What is a dedicated gateway?

A [dedicated gateway](dedicated-gateway.md) is server-side compute that is a front-end to data in an Azure Cosmos DB account. When you connect to your dedicated gateway endpoint [using gateway mode](nosql/sdk-connection-modes.md), your application sends a request to the dedicated gateway, which then routes the request to different backend partitions. Using direct mode with the dedicated gateway is supported, but these requests will not use the integrated cache.

### Does using the dedicated gateway offer any other performance benefits over using the standard gateway?

In general, requests routed by the dedicated gateway will have a slightly lower and more consistent latency than requests routed by the standard gateway. Even requests that don't use the integrated cache will still have a slightly lower latency than the standard gateway.

### What kind of latency should I expect from the integrated cache?

A request served by the integrated cache is fast because the cached data is stored in-memory on the dedicated gateway, rather than on the backend.

For cached point reads, you should expect a median latency of 2-4 ms. For cached queries, latency depends on the query. The query cache works by caching the query engine’s response for a particular query. This response is then sent back client-side to the SDK for processing. For simple queries, minimal work in the SDK is required and median latencies of 2-4 ms are typical. More complex queries with `GROUP BY` or `DISTINCT` require more processing in the SDK so latency may be higher, even with the query cache. 

If you were previously connecting to Azure Cosmos DB with direct mode and switch to connecting with the dedicated gateway, you may observe a slight latency increase for some requests. Using gateway mode requires a request to be sent to the gateway (in this case the dedicated gateway) and then routed appropriately to the backend. Direct mode, as the name suggests, allows the client to communicate directly with the backend, removing an extra hop. There is no latency SLA for requests using the dedicated gateway.

If your app previously used direct mode, the latency advantages of the integrated cache will be significant in only the following scenarios:

- Point read latency for large items (> 16 KB)
- High RU or complex queries

If your app previously used gateway mode with the standard gateway, the integrated cache will offer reductions in latency in nearly all scenarios. 

### Does the Azure Cosmos DB availability SLA extend to the dedicated gateway and integrated cache?

For scenarios that require high availability and in order to be covered by the Azure Cosmos DB availability SLA, you should provision at least 3 dedicated gateway nodes. For example, if one dedicated gateway node is needed in production, you should provision two additional dedicated gateway nodes to account for possible downtime, outages and upgrades. If only one dedicated gateway node is provisioned, you will temporarily lose availability in these scenarios. Additionally, [ensure your dedicated gateway has enough nodes](./integrated-cache.md#i-want-to-understand-if-i-need-to-add-more-dedicated-gateway-nodes) to serve your workload.

### The integrated cache is only available for API for NoSQL right now. Are you planning on releasing it for other APIs as well?

Expanding the integrated cache beyond API for NoSQL is planned on the long-term roadmap but is beyond the initial scope of the integrated cache.

### What consistency does the integrated cache support?

The integrated cache supports both session and eventual consistency. You can also configure the optional [MaxIntegratedCacheStaleness](integrated-cache.md#maxintegratedcachestaleness), which places an upper bound on cached data.

## Next steps

- [Integrated cache](integrated-cache.md)
- [Configure the integrated cache](how-to-configure-integrated-cache.md)
- [Dedicated gateway](dedicated-gateway.md)
- Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
    - If all you know is the number of vCores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](convert-vcore-to-request-unit.md) 
    - If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

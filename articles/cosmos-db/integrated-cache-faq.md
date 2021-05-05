---
title: Azure Cosmos DB integrated cache frequently asked questions
description: Frequently asked questions about the Azure Cosmos DB integrated cache
author: timsander1
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: conceptual
ms.date: 05/25/2021
ms.author: tisande
---

# Azure Cosmos DB integrated cache frequently asked questions
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

## Why does the integrated cache require a dedicated gateway?

If you’ve connected to Azure Cosmos DB using Gateway mode, you’ve used the standard gateway. While the Cosmos DB backend (your provisioned throughput and stored data) has dedicated capacity per container, the standard gateway is shared among many customers. It is practical for many customers to share a standard gateway since the compute resources consumed by individual customer is typically minimal. Because the integrate cache is specific to your Cosmos DB account and requires significant CPU and memory, it requires a dedicate gateway instance.

## What is a dedicated gateway?

A [dedicated gateway](dedicated-gateway.md) is compute that is a front-end to data in an Azure Cosmos DB account. When you connect to your dedicated gateway endpoint, your application sends a request to the dedicated gateway which then routes the request to different backend nodes.

## Does using the dedicated gateway offer any other performance benefits over the standard gateway?

In general, requests routed by the dedicated gateway will have a slightly lower and more consistent latency than requests routed by the standard gateway.

## What kind of latency should I expect from the integrated cache?

A request served with the cache is faster because the cached data is stored in-memory on the dedicated gateway, rather than on the backend. When a request is served by the item cache, latency of 2-3 ms is typical. 

When a request is served by the query cache, latency depends on the query. The query cache works by caching the query engine’s response for a particular query. This response is then sent back client-side to the SDK for processing. For simple queries, minimal work in the SDK is required and latencies of 2-3 ms are typical. However, more complex queries with GROUP BY or DISTINCT require more processing in the SDK so latency may be higher, even with the query cache. In the future, we aim to reduce this latency.

If you were previously connecting to Cosmos DB with direct mode, you may observe a latency increase for some requests. Using gateway mode requires a request to be send to the gateway and then routed appropriately to the backend. Direct mode, as the name suggests, allows the client to communicate directly with the backend, removing an extra hop. 

If your app previously used direct mode, the latency advantages of the integrated cache will be most significant in the following scenarios:
•	Point read latency for large items (> 16 KB)
•	Queries with range filters, inequality filters, or system functions

If your app previously used gateway mode, the integrated cache will offer reductions in latency in nearly all scenarios. 

## Does the Azure Cosmos DB availability SLA extend to the dedicated gateway and integrated cache?

We will have an availability SLA/SLO on the dedicated gateway (and therefore the integrated cache) once the feature is generally available. For scenarios that require high availability, you should provision 3x dedicated gateway instances needed. For example, if 1 dedicated gateway node is needed in production, you should provision 2 additional dedicated gateway nodes to account for regularly scheduled downtime or outages.

## The integrated cache is only available for SQL (Core) API right now. Are you planning on releasing it for other APIs as well?

This is planned on the long-term roadmap but beyond the initial public preview of the integrated cache for core (SQL) API.

Next steps:

- [Integrated cache](integrated-cache.md)
- [Configure the integrated cache](how-to-configure-integrated-cache.md)
- [Dedicated gateway](dedicated-gateway.md)
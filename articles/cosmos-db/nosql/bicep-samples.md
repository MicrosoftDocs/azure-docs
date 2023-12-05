---
title: Bicep samples for Azure Cosmos DB for NoSQL
description: Use Bicep to create and configure Azure Cosmos DB. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: ignite-2022, devx-track-bicep
ms.topic: conceptual
ms.date: 09/13/2021
ms.author: sidandrews
ms.reviewer: mjbrown
---

# Bicep for Azure Cosmos DB

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article shows Bicep samples for API for NoSQL accounts. You can also find Bicep samples for [Cassandra](../cassandra/manage-with-bicep.md), [Gremlin](../graph/manage-with-bicep.md), [MongoDB](../mongodb/manage-with-bicep.md), and [Table](../table/manage-with-bicep.md) APIs.

## API for NoSQL

|**Sample**|**Description**|
|---|---|
|[Create an Azure Cosmos DB account, database, container with autoscale throughput](manage-with-bicep.md#create-autoscale) | Create a API for NoSQL account in two regions, a database and container with autoscale throughput. |
|[Create an Azure Cosmos DB account, database, container with analytical store](manage-with-bicep.md#create-analytical-store) | Create a API for NoSQL account in one region with a container configured with Analytical TTL enabled and option to use manual or autoscale throughput. |
|[Create an Azure Cosmos DB account, database, container with standard (manual) throughput](manage-with-bicep.md#create-manual) | Create a API for NoSQL account in two regions, a database and container with standard throughput. |
|[Create an Azure Cosmos DB account, database and container with a stored procedure, trigger and UDF](manage-with-bicep.md#create-sproc) | Create a API for NoSQL account in two regions with a stored procedure, trigger and UDF for a container. |
|[Create an Azure Cosmos DB account with Microsoft Entra identity, Role Definitions and Role Assignment](manage-with-bicep.md#create-rbac) | Create a API for NoSQL account with Microsoft Entra identity, Role Definitions and Role Assignment on a Service Principal. |
|[Create a free-tier Azure Cosmos DB account](manage-with-bicep.md#free-tier) |  Create an Azure Cosmos DB for NoSQL account on free-tier. |

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.

* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md)
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md)

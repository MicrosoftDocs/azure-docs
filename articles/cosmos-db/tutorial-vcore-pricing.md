---
title: 'Convert the number of vCores or vCPUs in your nonrelational database to Azure Cosmos DB RU/s'
description: 'Convert the number of vCores or vCPUs in your nonrelational database to Azure Cosmos DB RU/s'
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: tutorial
ms.date: 08/18/2021
---
# How to convert the number of vcores-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

This article, explains how to estimate the Azure Cosmos DB RU/s in scenarios where you need to compare total cost of ownership (TCO) between your nonrelational database solution and Azure Cosmos DB.  This analysis is helpful if you are considering to migrate an app or data to Azure Cosmos DB. This guide helps you to generate a ballpark TCO comparison regardless of which non-relational database solution you currently use and whether your status-quo database solution is self-managed on-premise, self-managed in the cloud, or managed by a PaaS database service.

Currently, only the Azure Cosmos DB SQL API and the Azure Cosmos DB API for MongoDB v4.0 are in-scope for this discussiion. We are working on a similar mapping for Cassandra and Gremlin.

## 1. Identify the number of vCores or vCPUs

There are differing definitions of what exactly qualifies as a 'vcore' versus a 'vCPU'. Regardless of the respective definitions, many virtualization or cloud services use one or the other term to describe their unit of discrete CPU allocation. Here, we assume that performance and TCO generally scale linearly with respect to both of these, and that insofar as the precise definitions impact the outcome, the impact is only to within a factor of two (owing to hyperthreading which may enable two "vcores" per "vCPU" under some interpretations of those words.) So all of the formulas here assume that vcore and vCPU are equivalent, and vcore is used to refer to both. If you know that vCPU and vcore have different meanings in your application, we recommend that you please adjust the formulae below accordingly.

Start by understanding your status quo cluster configuration
* In the most general case, we asssume that your status-quo solution is a sharded and replicated nonrelational database
* Here, *replication* refers to duplicating some or all of your data over multiple servers with independent compute and storage
* *Replication factor* refers to the number of replicas
* *Sharding* refers to subdividing your dataset over multiple replica sets with independent compute and storage, for the purpose of scaling *out* your storage or throughput
* A *shard* is one replica sets containing a subset of your data
* *Sharding and replication* refers to a sharding arrangement in which each shard is itself replicated according to the replication factor, i.e. each shard consists of multiple servers at the physical level
* Commonly, all shards exist in the same region and have the same configuration (especially, the same number of replicas per shard replica set.) This is a *homogenous* replica set configuration.
    * However, some users employ *zoned sharding* strategies where one or more shards may be allocated to specific regions, with a customized replication factor in that geography according to the capacity demand. These are *heterogenous* replica set configurations.
    * The formulas and guidance in this document assume homogenous configurations.
    * However, you may apply the provided guidance and formulae to your heterogenous configuration: wherever a formula relies on replication factor, simply plug in the *average* replication factor across your heterogenous configuration, such that the formula makes sense for your use-case.
    
Before continuing, please identify
* vCores or vCPU per server for your cluster
* The replication factor of your cluster
* Whether or not sharding is employed in your cluster
* If sharding is used, how many shards exist?
* If sharding is not used, you can treat "Number of shards" as being 1 (one) for the purposes of the below calculations

## 2. Convert vcores-per-server or vCPU-per-server to RU/s


Roughly speaking, throughput scales as the product of vcores-per-server and shards:

`

f(N, M) [provisioned RU/s] = (R [provisioned RU/s per vcore]) 
                                * N [# of vcores-per-server]
                                * M [# of replica sets]

`

For the Azure Cosmos DB SQL API, a rule of thumb is that the provisioned RU/s per vcore *R* is about 580.

For the Azure Cosmos DB API for MongoDB v4.0, a rule of thumb is that the provisioned RU/s per vcore *R* is about 1000. The API for Mongo runs on top of the SQL API and implements a different architecture; thus the provisioned RU/s per vcore is different from that of SQL API.

You can use the table below to help you estimate throughput:


| vCores/vCPU | RU/s (SQL API) | RU/s (API for MongoDB v4.0) |
|-------------|----------------|------------------|
| 1           | 600            |            1000  |
| 2           | 1200            |            2000  |
| 4           | 2400            |            4000  |
| 8           | 4800            |            8000  |
| 16           | 9600            |            16000  |
| 32           | 19200            |            32000  |
| 64           | 38400            |            64000  |
| 128           | 76800            |            128000  |

Following the above process, you should end up with an estimate of your equivalent Cosmos DB RU/s

## 3. Compare TCO

*Estimating the cost of Azure Cosmos DB* The cost of Cosmos DB can be estimated based on throughput and storage. To estimate the configuration-dependent cost of using Azure Cosmos DB, please visit our [pricing page](https://azure.microsoft.com/pricing/details/cosmos-db/). Additionally, we recommend [reviewing the guide to planning and managing Azure Cosmos DB costs](https://docs.microsoft.com/azure/cosmos-db/plan-manage-costs) and modeling your costs using [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/). Finally, if you are working with an account manager, please speak with them to clarify any additional pricing concerns which you may have.

*Estimating the cost of your status quo database solution* Ideally, you already know the cost of your status quo database solution. If you do not already have cost information - 
* Usually you can estimate the cost of your status quo solution from the cost of an individual server
* Generally, a good rule of thumb is that the *cost* of your status-quo database solution scales as the product of shards and replication factor, or else as the product of vcores-per-server, shards, and replication factor:

`

Number of servers = Number of shards * Number of replicas

Cost = Cost per server * Number of servers

-or-

Cost = Cost per vcore * vcores per server * Number of servers

`

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the SQL APIs

You can now proceed to the next tutorial to learn how to develop locally using the Azure Cosmos DB local emulator.

> [!div class="nextstepaction"]
> [Develop locally with the emulator](local-emulator.md)

[regions]: https://azure.microsoft.com/regions/
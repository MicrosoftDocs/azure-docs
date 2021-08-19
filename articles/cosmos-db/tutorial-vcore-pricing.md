---
title: 'Convert the number of vCores or vCPUs in your nonrelational database to Azure Cosmos DB RU/s'
description: 'Convert the number of vCores or vCPUs in your nonrelational database to Azure Cosmos DB RU/s'
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: tutorial
ms.date: 08/19/2021
---
# How to convert the number of vcores-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]
[!INCLUDE[appliesto-mongodb-api](includes/appliesto-mongodb-api.md)]

This article explains how to estimate Azure Cosmos DB request units (RU/s) when you are considering data migration but all you know is the total vcore or vCPU count in your existing database replica set(s). When you migrate one or more replica sets to Azure Cosmos DB, each collection held in those replica sets will be stored as an Azure Cosmos DB collection consisting of a sharded cluster with a 4x replication factor. You can read more about our architecture in this [partitioning and scaling guide](partitioning-overview.md). Request units are how throughput capacity is provisioned on a collection; you can [read the request units guide](request-units.md) and the RU/s [provisioning guide]() to learn more. When you migrate a collection, Azure Cosmos DB provisions enough shards to serve your provisioned request units and store your data. Therefore estimating RU/s for collections is an important step in scoping out the scale of your planned Azure Cosmos DB data estate prior to migration. Based on our experience with thousands of customers, we have found this formula helps us arrive at a rough starting-point RU/s estimate from vcores or vCPU: 

$Provisioned\_RU/s = \frac{C*T}{R}$

* $T$: Total vcores and/or vCPUs in your existing database replica set(s). 
* $R$: Replication factor of your existing replica set(s). 
* $C$: Recommended provisioned RU/s per vcore or vCPU. This is a property of Azure Cosmos DB:
    * $C = ~600 RU/s/vcore$ for Azure Cosmos DB SQL API
    * $C = 1000 RU/s/vcore$ for Azure Cosmos DB API for MongoDB v4.0
    * $C$ estimates for Cassandra API, Gremlin API or other APIs are not currently available

**$T$ must be determined by examining the number of vcores or vCPU in each server of your existing database**; if you cannot estimate $T$ then consider following our [guide to estimating RU/s using Azure Cosmos DB capacity planner](estimate-ru-with-capacity-planner.md) instead of this guide. For $R$ we recommend plugging in the average replication factor of your database replica sets; if this information is not available then $R=3$ is a good rule of thumb. Values for $C$ are provided above. **If you currently use another cloud managed database, be aware that these services often appear to be provisioned in units of $vcores$ or $vCPU$ (in other words, $T$), but in fact the core-count you provision sets the $vcores/replica$ or $vCPU/replica$ value ($\frac{T}{R}$) for an $R$-node replica set**; the true number of cores is $R$ times more that what you provisioned explicitly. We recommend determining whether this is the case for your current cloud managed database, and if so you must multiply the number of provisioned $vcores$ or $vCPU$ by $R$ in order to get an accurate estimate of $T$.

Azure Cosmos DB interop APIs run on top of the SQL API and implement their own unique architectures; thus Azure Cosmos DB API for MongoDB v4.0 has a different $C$-value than Azure Cosmos DB SQL API.

In this article we treat "vcore" and "vCPU" as synonymous, thus $C$ has units of $RU/s/vcore$ or $RU/s/vCPU$, with no distinction. However in practice this may not be true; these terms may have different meanings i.e. if your physical CPUs support hyperthreading, it is possible that $1 vCPU = 2 vcores$ or something else. In general the $vcore$/$vCPU$ relationship is hardware-dependent and we recommend investigating what is the relationship on your existing cluster hardware, and whether your cluster compute is provisioned in terms of $vcores$ or $vCPU$. If $vCPU$ and $vcore$ have differing meanings on your hardware, then we recommend treating the above estimates of $C$ as having units of $RU/s/vcore$, and if necessary converting $T$ from vCPU to vcore using the conversion factor appropriate to your hardware.

## Worked example: request unit estimation for migration from a single replica set

## Worked example: request unit estimation for migration from a cluster of homogeneous replica sets

## Worked example: request unit estimation for miigration from a cluster of hetergeneous replica sets

## Summary

Estimating RU/s from $vcores$ or $vCPU$ requires collecting information about total $vcores$/$vCPU$ and replication factor from your existing database replica set(s). Then you can use known relationships between $vcores$/$vCPU$ and throughput to estimate Azure Cosmos DB request units (RU/s). This will be an important step in anticipating the scale of your Azure Cosmos DB data estate after migration.

The table below summarizes the relationship between $vCores$ and $vCPU$ for Azure Cosmos DB SQL API and API for MongoDB v4.0:


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

Learn how to estimate costs for Azure Cosmos DB
Learn how to migrate 

> [!div class="nextstepaction"]
> [Develop locally with the emulator](local-emulator.md)

[regions]: https://azure.microsoft.com/regions/
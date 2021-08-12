---
title: 'Tutorial: Convert the number of vcores-per-server or vCPU-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration'
description: 'Tutorial: Convert the number of vcores-per-server or vCPU-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration'
author: anfeldma-ms
ms.author: anfeldma
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: tutorial
ms.date: 08/12/2021
---
# Tutorial: Convert the number of vcores-per-server in your existing nonrelational database to Azure Cosmos DB RU/s as an aid in planning migration
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

In this article, we show you how to estimate Azure Cosmos DB RU/s in the scenario where you need to compare total cost of ownership (TCO) between your status-quo nonrelational database solution and Azure Cosmos DB, i.e. if you are considering planning an app migration or data migration to Azure Cosmos DB. This tutorial helps you to generate a ballpark TCO comparison regardless of what nonrelational database solution you currently employ, and regardless of whether your status-quo database solution is self-managed on-premise, self-managed in the cloud, or managed by a PaaS database service.

1. Identify the number of vcores-per-server or vCPU-per-server in your status quo solution

    * Start by understanding your status quo cluster configuration
        * In the most general case, we asssume that your status-quo solution is a sharded and replicated nonrelational database
        * Here, *replication* refers to duplicating some or all of your data over multiple servers with independent compute and storage
        * *Replication factor* refers to the number of replicas
        * *Sharding* refers to subdividing your dataset over multiple logical servers with independent compute and storage, for the purpose of scaling *out* your storage or throughput
        * A *shard* is one logical server containing a subset of your data
        * *Sharding and replication* refers to a sharding arrangement in which each shard is itself replicated according to the replication factor, i.e. each shard consists of multiple servers at the physical level
    * Before continuing, please identify
        * vCores or vCPU per server for your cluster
        * The replication factor of your cluster
        * Whether or not sharding is employed in your cluster, and
        * If sharding is employed, how many shards exist?\
        * If sharding is not employed, you can treat "Number of shards" as being 1 (one) for the purposes of the below calculations

2. Convert vcores-per-server or vCPU-per-server to RU/s


    * In general, a good rule of thumb is that throughput scales as the product of vcores-per-server and shards:

    ```

    Number of RU/s = (~1000 RU/s per vcore) * Number of vcores-per-server * Number of shards

    ```

    For greater clarity, you can use the table below to help you estimate throughput:


    | vCores/vCPU | RU/s (SQL API) | RU/s (Mongo API) | RU/s (Cassandra API) | RU/s (Gremlin API) |
    |-------------|----------------|------------------|----------------------|--------------------|
    | 1           | 615            |            1000  | -                    | -                  |
    | 2           | 1230            |            2000  | -                    | -                  |
    | 4           | 2460            |            4000  | -                    | -                  |
    | 8           | 4920            |            8000  | -                    | -                  |
    | 16           | 9840            |            16000  | -                    | -                  |
    | 32           | 19680            |            32000  | -                    | -                  |
    | 64           | 39360            |            64000  | -                    | -                  |
    | 128           | 78720            |            128000  | -                    | -                  |

    * Following the above process, you should end up with an estimate of your equivalent Cosmos DB RU/s

3. Compare TCO

    * The cost of Cosmos DB can be estimated based on throughput and storage
        * Manual/standard throughput cost: $0.008/hr per 100 RU/s * Number of single-master regions
            * Autoscale: +50% premium on RU cost
            * Multi-master: 2x RU cost
            * Multi-master + autoscale: 2x RU cost
        * Storage cost: $0.25/mo per GB * Number of regions
    * Estimating the cost of your status quo database solution
        * Ideally, you already know the cost of your status quo database solution
        * If you do not already have cost information - usually you can estimate the cost of your status quo solution from the cost of an individual server
        * Generally, a good rule of thumb is that the *cost* of your status-quo database solution scales as the product of shards and replication factor, or else as the product of vcores-per-server, shards, and replication factor:

        ```

        Number of servers = Number of shards * Number of replicas

        Cost = Cost per server * Number of servers

        -or-

        Cost = Cost per vcore * vcores per server * Number of servers

        ```

## Next steps

In this tutorial, you've done the following:

> [!div class="checklist"]
> * Configure global distribution using the Azure portal
> * Configure global distribution using the SQL APIs

You can now proceed to the next tutorial to learn how to develop locally using the Azure Cosmos DB local emulator.

> [!div class="nextstepaction"]
> [Develop locally with the emulator](local-emulator.md)

[regions]: https://azure.microsoft.com/regions/
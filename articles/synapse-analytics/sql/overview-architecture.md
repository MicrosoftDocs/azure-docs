---
title: Synapse SQL architecture 
description: Learn how Azure Synapse SQL combines distributed query processing capabilities with Azure Storage to achieve high performance and scalability. 
author: WilliamDAssafMSFT 
manager: rothja
ms.service: synapse-analytics
ms.topic: conceptual
ms.subservice: sql
ms.date: 11/01/2022
ms.author: wiassaf
ms.custom: engagement-fy23
---

# Azure Synapse SQL architecture

This article describes the architecture components of Synapse SQL. It also explains how Azure Synapse SQL combines distributed query processing capabilities with Azure Storage to achieve high performance and scalability.

## Synapse SQL architecture components

Synapse SQL uses a scale-out architecture to distribute computational processing of data across multiple nodes. Compute is separate from storage, which enables you to scale compute independently of the data in your system.

For dedicated SQL pool, the unit of scale is an abstraction of compute power that is known as a [data warehouse unit](resource-consumption-models.md).

For serverless SQL pool, being serverless, scaling is done automatically to accommodate query resource requirements. As topology changes over time by adding, removing nodes or failovers, it adapts to changes and makes sure your query has enough resources and finishes successfully. For example, the following image shows serverless SQL pool using four compute nodes to execute a query.

:::image type="content" source="./media/overview-architecture/sql-architecture.png" alt-text="Screenshot of Synapse SQL architecture." lightbox="./media/overview-architecture/sql-architecture.png" :::

Synapse SQL uses a node-based architecture. Applications connect and issue T-SQL commands to a Control node, which is the single point of entry for Synapse SQL.

The Azure Synapse SQL Control node utilizes a distributed query engine to optimize queries for parallel processing, and then passes operations to Compute nodes to do their work in parallel.

The serverless SQL pool Control node utilizes Distributed Query Processing (DQP) engine to optimize and orchestrate distributed execution of user query by splitting it into smaller queries that will be executed on Compute nodes. Each small query is called task and represents distributed execution unit. It reads file(s) from storage, joins results from other tasks, groups, or orders data retrieved from other tasks. 

The Compute nodes store all user data in Azure Storage and run the parallel queries. The Data Movement Service (DMS) is a system-level internal service that moves data across the nodes as necessary to run queries in parallel and return accurate results. 

With decoupled storage and compute, when using Synapse SQL one can benefit from independent sizing of compute power irrespective of your storage needs. For serverless SQL pool scaling is done automatically, while for dedicated SQL pool one can:

* Grow or shrink compute power, within a dedicated SQL pool, without moving data.
* Pause compute capacity while leaving data intact, so you only pay for storage.
* Resume compute capacity during operational hours.

## Azure Storage

Synapse SQL uses Azure Storage to keep your user data safe. Since your data is stored and managed by Azure Storage, there's a separate charge for your storage consumption.

Serverless SQL pool allows you to query your data lake files, while dedicated SQL pool allows you to query and ingest data from your data lake files. When data is ingested into dedicated SQL pool, the data is sharded into **distributions** to optimize the performance of the system. You can choose which sharding pattern to use to distribute the data when you define the table. These sharding patterns are supported:

* Hash
* Round Robin
* Replicate

## Control node

The Control node is the brain of the architecture. It's the front end that interacts with all applications and connections.

In Synapse SQL, the distributed query engine runs on the Control node to optimize and coordinate parallel queries. When you submit a T-SQL query to dedicated SQL pool, the Control node transforms it into queries that run against each distribution in parallel.

In serverless SQL pool, the DQP engine runs on Control node to optimize and coordinate distributed execution of user query by splitting it into smaller queries that will be executed on Compute nodes. It also assigns sets of files to be processed by each node.

## Compute nodes

The Compute nodes provide the computational power.

In dedicated SQL pool, distributions map to Compute nodes for processing. As you pay for more compute resources, pool remaps the distributions to the available Compute nodes. The number of compute nodes ranges from 1 to 60, and is determined by the service level for the dedicated SQL pool. Each Compute node has a node ID that is visible in system views. You can see the Compute node ID by looking for the node_id column in system views whose names begin with sys.pdw_nodes. For a list of these system views, see [Synapse SQL system views](/sql/relational-databases/system-catalog-views/sql-data-warehouse-and-parallel-data-warehouse-catalog-views?view=azure-sqldw-latest&preserve-view=true).

In serverless SQL pool, each Compute node is assigned task and set of files to execute task on. Task is distributed query execution unit, which is actually part of query user submitted. Automatic scaling is in effect to make sure enough Compute nodes are utilized to execute user query.

## Data Movement Service

Data Movement Service (DMS) is the data transport technology in dedicated SQL pool that coordinates data movement between the Compute nodes. Some queries require data movement to ensure the parallel queries return accurate results. When data movement is required, DMS ensures the right data gets to the right location.

> [!VIDEO https://www.youtube.com/embed/PlyQ8yOb8kc]

## Distributions

A distribution is the basic unit of storage and processing for parallel queries that run on distributed data in dedicated SQL pool. When dedicated SQL pool runs a query, the work is divided into 60 smaller queries that run in parallel.

Each of the 60 smaller queries runs on one of the data distributions. Each Compute node manages one or more of the 60 distributions. A dedicated SQL pool with maximum compute resources has one distribution per Compute node. A dedicated SQL pool with minimum compute resources has all the distributions on one compute node.

## Hash-distributed tables

A hash distributed table can deliver the highest query performance for joins and aggregations on large tables.

To shard data into a hash-distributed table, dedicated SQL pool uses a hash function to deterministically assign each row to one distribution. In the table definition, one of the columns is designated as the distribution column. The hash function uses the values in the distribution column to assign each row to a distribution.

The following diagram illustrates how a full (non-distributed table) gets stored as a hash-distributed table.

:::image type="content" source="./media/overview-architecture/hash-distributed-table.png" alt-text="Screenshot of a table stored as a hash-distribution." lightbox="./media/overview-architecture/hash-distributed-table.png" :::

* Each row belongs to one distribution.
* A deterministic hash algorithm assigns each row to one distribution.
* The number of table rows per distribution varies as shown by the different sizes of tables.

There are performance considerations for the selection of a distribution column, such as distinctness, data skew, and the types of queries that run on the system.

## Round-robin distributed tables

A round-robin table is the simplest table to create and delivers fast performance when used as a staging table for loads.

A round-robin distributed table distributes data evenly across the table but without any further optimization. A distribution is first chosen at random and then buffers of rows are assigned to distributions sequentially. It's quick to load data into a round-robin table, but query performance can often be better with hash distributed tables. Joins on round-robin tables require reshuffling data, which takes extra time.

## Replicated tables

A replicated table provides the fastest query performance for small tables.

A table that is replicated caches a full copy of the table on each compute node. So, replicating a table removes the need to transfer data among compute nodes before a join or aggregation. Replicated tables are best utilized with small tables. Extra storage is required and there's extra overhead that is incurred when writing data, which make large tables impractical.

The diagram below shows a replicated table that is cached on the first distribution on each compute node.

:::image type="content" source="./media/overview-architecture/replicated-table.png" alt-text="Screenshot of the replicated table cached on the first distribution on each compute node." lightbox="./media/overview-architecture/replicated-table.png" :::

## Next steps

Now that you know a bit about Synapse SQL, learn how to quickly [create a dedicated SQL pool](../quickstart-create-sql-pool-portal.md) and [load sample data](../sql-data-warehouse/sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md). Or start [using serverless SQL pool](../quickstart-sql-on-demand.md). If you're new to Azure, you may find the [Azure glossary](../../azure-glossary-cloud-terminology.md) helpful as you encounter new terminology.

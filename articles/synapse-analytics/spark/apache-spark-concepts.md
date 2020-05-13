---
title: Apache Spark in Azure Synapse Analytics - Core Concepts
description: This article provides an introduction to Apache Spark in Azure Synapse Analytics and the different concepts.
services: synapse-analytics 
author: euangMS 
ms.service:  synapse-analytics 
ms.topic: overview
ms.subservice: 
ms.date: 04/15/2020 
ms.author: euang 
ms.reviewer: euang
---

# Apache Spark in Azure Synapse Analytics Core Concepts

Apache Spark is a parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Apache Spark in Azure Synapse Analytics is one of Microsoft's implementations of Apache Spark in the cloud. 

Azure Synapse makes it easy to create and configure Spark capabilities in Azure. Azure Synapse provides a different implementation of these Spark capabilities that are documented here.

## Spark pools (preview)

A Spark pool (preview) is created in the Azure portal. It is the definition of a Spark pool that, when instantiated, is used to create a Spark instance that processes data. When a Spark pool is created, it exists only as metadata; no resources are consumed, running, or charged for. A Spark pool has a series of properties that control the characteristics of a Spark instance; these characteristics include but are not limited to name, size, scaling behavior, time to live.

As there is no dollar or resource cost associated with creating Spark pools, any number can be created with any number of different configurations. Permissions can also be applied to Spark pools allowing users only to have access to some and not others.

A best practice is to create smaller Spark pools that may be used for development and debugging and then larger ones for running production workloads.

You can read how to create a Spark pool and see all their properties here [Get started with Spark pools in Synapse Analytics](../quickstart-create-apache-spark-pool-portal.md)

## Spark instances

Spark instances are created when you connect to a Spark pool, create a session, and run a job. As multiple users may have access to a single Spark pool, a new Spark instance is created for each user that connects. 

When you submit a second job, then if there is capacity in the pool, the existing Spark instance also has capacity then the existing instance will process the job; if not and there is capacity at the pool level, then a new Spark instance will be created.

## Examples

### Example 1

- You create a Spark pool called SP1; it has a fixed cluster size of 20 nodes.
- You submit a notebook job, J1 that uses 10 nodes, a Spark instance, SI1 is created to process the job.
- You now submit another job, J2, that uses 10 nodes because there is still capacity in the pool and the instance, the J2, is processed by SI1.
- If J2 had asked for 11 nodes, there would not have been capacity in SP1 or SI1. In this case, if J2 comes from a notebook, then the job will be rejected; if J2 comes from a batch job, then it will be queued.

### Example 2

- You create a Spark pool call SP2; it has an autoscale enabled 10 – 20 nodes
- You submit a notebook job, J1 that uses 10 nodes, a Spark instance, SI1, is created to process the job.
- You now submit another job, J2, that uses 10 nodes, because there is still capacity in the pool the instance auto grows to 20 nodes and processes J2.

### Example 3

- You create a Spark pool called SP1; it has a fixed cluster size of 20 nodes.
- You submit a notebook job, J1 that uses 10 nodes, a Spark instance, SI1 is created to process the job.
- Another user, U2, submits a Job, J3, that uses 10 nodes, a new Spark instance, SI2, is created to process the job.
- You now submit another job, J2, that uses 10 nodes because there is still capacity in the pool and the instance, J2, is processed by SI1.

## Next steps

- [Azure Synapse Analytics](https://docs.microsoft.com/azure/synapse-analytics)
- [Apache Spark Documentation](https://spark.apache.org/docs/2.4.4/)

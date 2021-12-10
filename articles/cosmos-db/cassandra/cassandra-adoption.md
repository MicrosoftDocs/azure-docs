---
title: From Apache Cassandra to Cassandra API
description: Learn best practices and ways to adopt Azure Cosmos DB Cassandra API successfully.
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: how-to
ms.date: 11/30/2021

---

# From Apache Cassandra to Cassandra API
[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

Azure Cosmos DB Cassandra API provides wire protocol level compatibility with existing Cassandra SDKs and tools. This compatibility makes it possible to run applications designed to connect to Apache Cassandra with Cassandra API, with minimal changes. However, there are some important differences between Apache Cassandra and Azure Cosmos DB. 

This article is aimed at users who are familiar with native [Apache Cassandra](https://cassandra.apache.org/), and are considering moving to Azure Cosmos DB Cassandra API. Consider this article a checklist to help you adopt Cassandra API successfully.  


## Feature support

While Cassandra API supports a large surface area of Apache Cassandra features, there are some features which are not supported (or have limitations). Review our article [features supported by Azure Cosmos DB Cassandra API](cassandra-support.md) to ensure the features you need are supported. 

## Replication (migration)

Although you can communicate with Cassandra API through the CQL Binary Protocol v4 wire protocol, Cosmos DB implements its own internal replication protocol. This means that live migration/replication cannot be achieved through the Cassandra gossip protocol. Review our article on how to [live migrate from Apache Cassandra to Cassandra API using dual-writes](migrate-data-dual-write-proxy.md). For offline migration, review our article: [Migrate data from Cassandra to an Azure Cosmos DB Cassandra API account by using Azure Databricks](migrate-data-databricks.md).

## Replication (consistency)

 Although there are many similarities between Apache Cassandra's approach to replication consistency, there are also important differences. We have provided a [mapping document](apache-cassandra-consistency-mapping.md), which attempts to draw analogs between the two. However, we highly recommend that you take time to review and understand Azure Cosmos DB consistency settings in our [documentation](../consistency-levels.md) from scratch, or watch this short [video](https://www.youtube.com/watch?v=t1--kZjrG-o) guide to understanding consistency settings in the Azure Cosmos DB platform.


## Recommended client configurations

While you should not need to make any substantial code changes to existing apps using Apache Cassandra, there are some approaches and configuration settings that we recommend for Cassandra API in Cosmos DB that may improve the experience. We highly recommend reviewing our blog post [Cassandra API Recommendations for Java](https://devblogs.microsoft.com/cosmosdb/cassandra-api-java/) for more details. 

## Code samples

Your existing application code should work with Cassandra API. However, if you encounter any connectivity related errors, we highly recommend referring to our [Quick Start samples](manage-data-java-v4-sdk.md) as a starting point to determine any minor differences in setup with your existing code. In addition, we have more in-depth samples for [Java v3](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample) and [Java v4](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4) drivers. These code samples implement custom [extensions](https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.0), which in turn implement the recommended client configurations mentioned above. We also have samples for Java [Spring Boot (v3 driver)](https://github.com/Azure-Samples/spring-data-cassandra-on-azure-extension-v3) and [Spring Boot (v4 driver)](https://github.com/Azure-Samples/spring-data-cassandra-on-azure-extension-v4.git).  


## Storage

Cassandra API is ultimately backed by Azure Cosmos DB, which is a document-oriented NoSQL engine. Cosmos DB maintains metadata, which may result in a difference between the amount of physical storage for a given workload between native Apache Cassandra and Cassandra API. The difference is most noticeable in the case of small row sizes. In some cases, this may be offset by the fact that Cosmos DB does not implement compaction or tombstones. However, this will depend significantly on the workload. We recommend carrying out a POC if you are uncertain about storage requirements. 

## Multi-region deployments

Native Apache Cassandra is a multi-master system by default, and does not provide an option for single-master with multi-region replication for reads only. The concept of application-level failover to another region for writes is therefore redundant in Apache Cassandra as all nodes are independent and there is no single point of failure. However, Azure Cosmos DB provides the out-of-box ability to configure either single master, or multi-master regions for writes. One of the advantages of having a single master region for writes is the avoidance of cross-region conflict scenarios, and the option of maintaining strong consistency across multiple regions, while still maintaining a level of high availability. 

> [!NOTE]
> Strong consistency across regions (RPO of zero) is not possible for native Apache Cassandra as all nodes are capable of serving writes. Cosmos DB can be configured for strong consistency across regions in *single write region* configuration. However, as with native Apache Cassandra, Cosmos DB accounts configured with multiple write regions cannot be configured for strong consistency as it is not possible for a distributed system to provide an RPO of zero and an RTO of zero.

We recommend reviewing the [Load balancing policy section](https://devblogs.microsoft.com/cosmosdb/cassandra-api-java/#load-balancing-policy) from our blog [Cassandra API Recommendations for Java](https://devblogs.microsoft.com/cosmosdb/cassandra-api-java), and [failover scenarios](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4#failover-scenarios) in our official [code sample for the Cassandra Java v4 driver](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4), for more detail. 



## Request Units

One of the major differences between running a native Apache Cassandra cluster, and provisioning an Azure Cosmos DB account, is the way in which database capacity is provisioned. In traditional databases, capacity is expressed in terms of CPU cores, RAM, and IOPs. However, Azure Cosmos DB is a multi-tenant platform-as-a-service database. Capacity is expressed using a single normalized metric known as [request units](../request-units.md) (RU/s). Every request sent to the database has an "RU cost", and each request can be profiled to determine its cost. 

The benefit of this is that database capacity can be provisioned deterministically for highly predictable performance and efficiency. Request units make it possible to associate the capacity you need to provision directly with the number of requests sent to the database (once you have profiled the cost of each request). The challenge with this way of provisioning capacity is that, in order to maximize the extent to which you can benefit from it, you need to have a more solid understanding of the throughput characteristics of your workload than you may have been used to. 

We highly recommend profiling your requests and using this information to help you to accurately estimate the number of request units you will need to provision. Here are some useful articles to help:

- [Request Units in Azure Cosmos DB](../request-units.md)
- [Find the request unit charge for operations executed in Azure Cosmos DB Cassandra API](find-request-unit-charge-cassandra.md). 
- [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)


## Capacity provisioning models

Traditional database provisioning is based on a fixed capacity that has to be provisioned up front in order to cope with the anticipated throughput. Cosmos DB offers a capacity-based model known as [provisioned throughput](../set-throughput.md). However, as a multi-tenant service, it is also able to offer *consumption-based* models, in the form of [autoscale](../provision-throughput-autoscale.md) and [serverless](../serverless.md). The extent to which your workload will benefit from each type depends on the predictability of throughput. 

Generally speaking, workloads with large periods of dormancy will benefit from serverless. Steady state workloads with predictable throughput benefit most from provisioned throughput. Workloads, which have a continuous level of minimal throughput, but with unpredictable spikes, will benefit most from autoscale. We recommend reviewing the links below to help you understand the best capacity model for your throughput needs:

- [Introduction to provisioned throughput in Azure Cosmos DB](../set-throughput.md)
- [Create Azure Cosmos containers and databases with autoscale throughput](../provision-throughput-autoscale.md)
- [Azure Cosmos DB serverless](../serverless.md)

## Partitioning

Partitioning in Cosmos DB functions in a very similar way to Apache Cassandra. One of the main differences is that Cosmos DB is more optimized for *horizontal scale*. As such, there are limits placed on the amount of *vertical throughput* capacity available in any given *physical partition*. The effect of this is most noticeable where there is significant throughput skew in an existing data model. 

Take steps to ensure that your partition key design will result in a relatively uniform distribution of requests. We also recommend that you review our article on [Partitioning in Azure Cosmos DB Cassandra API](cassandra-partitioning.md) for more information on how logical and physical partitioning works, and limits on throughput capacity (request units) per partition.

## Scaling

In native Apache Cassandra, increasing capacity and scale involves adding new nodes to a cluster and ensuring they are properly added to the Cassandra ring. In Cosmos DB, this is completely transparent and automatic, and scaling is a function of how many [request units](../request-units.md) are provisioned for your keyspace or table. As implied in partitioning above, the scaling of physical machines occurs when either physical storage or required throughput reaches the limits allowed for a logical/physical partition. Review our article on [Partitioning in Azure Cosmos DB Cassandra API](cassandra-partitioning.md) for more information.

## Rate limiting

One of the challenges of provisioning [request units](../request-units.md), particularly if [provisioned throughput](../set-throughput.md) is chosen, can be rate limiting. Azure Cosmos DB will return rate-limited (429) errors if clients consume more resources (RU/s) than the amount that you have provisioned. The Cassandra API in Azure Cosmos DB translates these exceptions to overloaded errors on the Cassandra native protocol. Review our article [Prevent rate-limiting errors for Azure Cosmos DB API for Cassandra operations](prevent-rate-limiting-errors.md) for information on how to avoid rate limiting in your application. 

## Using Apache Spark

Many Apache Cassandra users also use the Apache Spark Cassandra connector to query their data for analytical and data movement needs. You can connect to Cassandra API in the same way, using the same connector. However, we highly recommend reviewing our article on how to [Connect to Azure Cosmos DB Cassandra API from Spark](connect-spark-configuration.md), and in particular the section for [Optimizing Spark connector throughput configuration](connect-spark-configuration.md#optimizing-spark-connector-throughput-configuration), before doing so.  

## Troubleshooting common issues

Review our [trouble shooting](troubleshoot-common-issues.md) article, which documents solutions to common problems faced with the service. 


## Next steps

* Learn about [partitioning and horizontal scaling in Azure Cosmos DB](../partitioning-overview.md).
* Learn about [provisioned throughput in Azure Cosmos DB](../request-units.md).
* Learn about [global distribution in Azure Cosmos DB](../distribute-data-globally.md).

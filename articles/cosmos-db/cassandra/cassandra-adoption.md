---
title: From Apache Cassandra to Cassandra API
description: Learn best practices and ways to successfully use the Azure Cosmos DB Cassandra API to use with Apache Cassandra applications.
author: TheovanKraay
ms.author: thvankra
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: how-to
ms.date: 11/30/2021

---

# From Apache Cassandra to Cassandra API

[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

The Azure Cosmos DB Cassandra API provides wire protocol compatibility with existing Cassandra SDKs and tools. You can run applications that are designed to connect to Apache Cassandra by using the Cassandra API with minimal changes.

When you use the Cassandra API, it's important to be aware of differences between Apache Cassandra and Azure Cosmos DB. This article is a checklist to help users who are familiar with native [Apache Cassandra](https://cassandra.apache.org/) successfully begin to use the Azure Cosmos DB Cassandra API.

## Feature support

The Cassandra API supports a large number of Apache Cassandra features, but some features aren't supported, or they have limitations. Before you migrate, be sure that the [Azure Cosmos DB Cassandra API features](cassandra-support.md) you need are supported.

## Replication

When you plan for replication, it's important to look at both migration and consistency.

### Migration

Although you can communicate with the Cassandra API through the Cassandra Query Language (CQL) binary protocol v4 wire protocol, Azure Cosmos DB implements its own internal replication protocol. You can't use the Cassandra gossip protocol for live migration or replication. For more information, see [Live-migrate from Apache Cassandra to the Cassandra API by using dual writes](migrate-data-dual-write-proxy.md). 

For information about offline migration, see [Migrate data from Cassandra to an Azure Cosmos DB Cassandra API account by using Azure Databricks](migrate-data-databricks.md).

### Consistency

Although the approaches to replication consistency in Apache Cassandra and Azure Cosmos DB are similar, it's important to understand how they are different. A [mapping document](apache-cassandra-consistency-mapping.md) compares Apache Cassandra and Azure Cosmos DB approaches to replication consistency. However, we highly recommend that you specifically review [Azure Cosmos DB consistency settings](../consistency-levels.md) or watch a brief [video guide to understanding consistency settings in the Azure Cosmos DB platform](https://www.youtube.com/watch?v=t1--kZjrG-o).

## Recommended client configurations

When you use the Cassandra API, you don't need to make substantial code changes to existing applications that run Apache Cassandra. For the best experience, we recommend some approaches and configuration settings for the Cassandra API in Azure Cosmos DB. For details, review the blog post [Cassandra API recommendations for Java](https://devblogs.microsoft.com/cosmosdb/cassandra-api-java/).

## Code samples

The Cassandra API is designed to work with your existing application code. However, if you encounter any connectivity-related errors, use the [quickstart samples](manage-data-java-v4-sdk.md) as a starting point to discover any minor setup changes you might need to make in your existing code. We also have more in-depth samples for [Java v3](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample) and [Java v4](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4) drivers. These code samples implement custom [extensions](https://github.com/Azure/azure-cosmos-cassandra-extensions/tree/release/java-driver-4/1.0.0), which in turn implement recommended client configurations. 

You also can use samples for [Java Spring Boot (v3 driver)](https://github.com/Azure-Samples/spring-data-cassandra-on-azure-extension-v3) and [Java Spring Boot (v4 driver)](https://github.com/Azure-Samples/spring-data-cassandra-on-azure-extension-v4.git).  

## Storage

The Cassandra API ultimately is backed by Azure Cosmos DB, which is a document-oriented NoSQL database engine. Azure Cosmos DB maintains metadata, which might result in a change in the amount of physical storage required for a specific workload. 

The difference in storage requirements between native Apache Cassandra and Azure Cosmos DB is most noticeable in small row sizes. In some cases, the difference might be offset because Azure Cosmos DB doesn't implement compaction or tombstones. However, this factor depends significantly on the workload. If you're uncertain about storage requirements, we recommend that you first create a proof of concept.

## Multi-region deployments

Native Apache Cassandra is a multi-master system by default. Apache Cassandra doesn't have an option for single-master with multi-region replication for reads only. The concept of application-level failover to another region for writes is redundant in Apache Cassandra. All nodes are independent, and there is no single point of failure. However, Azure Cosmos DB provides the out-of-box ability to configure either single-master or multi-master regions for writes. 

An advantage of having a single-master region for writes is avoiding cross-region conflict scenarios. It gives you the option to maintain strong consistency across multiple regions while maintaining a level of high availability.

> [!NOTE]
> Strong consistency across regions and a Recovery Point Objective (RPO) of zero isn't possible for native Apache Cassandra because all nodes are capable of serving writes. You can configure Azure Cosmos DB for strong consistency across regions in a *single write region* configuration. However, like with native Apache Cassandra, you can't configure an Azure Cosmos DB account that's configured with multiple write regions for strong consistency. A distributed system can't provide an RPO of zero *and* a Recovery Time Objective (RTO) of zero.

For more information, we recommend that you review [Load balancing policy](https://devblogs.microsoft.com/cosmosdb/cassandra-api-java/#load-balancing-policy) in our [Cassandra API recommendations for Java blog](https://devblogs.microsoft.com/cosmosdb/cassandra-api-java) and [Failover scenarios](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4#failover-scenarios) in our official [code sample for the Cassandra Java v4 driver](https://github.com/Azure-Samples/azure-cosmos-cassandra-extensions-java-sample-v4).

## Request units

One of the major differences between running a native Apache Cassandra cluster and provisioning an Azure Cosmos DB account is how database capacity is provisioned. In traditional databases, capacity is expressed in terms of CPU cores, RAM, and IOPS. However, Azure Cosmos DB is a multi-tenant platform-as-a-service database. Capacity is expressed by using a single normalized metric called [request units](../request-units.md). Every request sent to the database has a request unit cost (RU cost), and each request can be profiled to determine its cost.

The benefit of using request units as a metric is that database capacity can be provisioned deterministically for highly predictable performance and efficiency. After you profile the cost of each request, you can use request units to directly associate the number of requests sent to the database with the capacity you need to provision. The challenge with this way of provisioning capacity is that, to maximize the benefit, you need to have a solid understanding of the throughput characteristics of your workload, maybe more than you have been used to.

We highly recommend that you profile your requests and use the information you gain to help you accurately estimate the number of request units you'll need to provision. Here are some articles that might help you make the estimate:

- [Request units in Azure Cosmos DB](../request-units.md)
- [Find the request unit charge for operations executed in the Azure Cosmos DB Cassandra API](find-request-unit-charge-cassandra.md)
- [Optimize provisioned throughput cost in Azure Cosmos DB](../optimize-cost-throughput.md)

## Capacity provisioning models

In traditional database provisioning, a fixed capacity is provisioned up front to handle the anticipated throughput. Azure Cosmos DB offers a capacity-based model called [provisioned throughput](../set-throughput.md). As a multi-tenant service, Azure Cosmos DB also offers *consumption-based* models in [autoscale](../provision-throughput-autoscale.md) mode and [serverless](../serverless.md) mode. The extent to which a workload might benefit from either of these consumption-based provisioning models depends on the predictability of throughput for the workload.

In general, steady-state workloads that have predictable throughput benefit most from provisioned throughput. Workloads that have large periods of dormancy benefit from serverless mode. Workloads that have a continuous level of minimal throughput, but with unpredictable spikes, benefit most from autoscale mode. We recommend that you review the following articles for a clear understanding of the best capacity model for your throughput needs:

- [Introduction to provisioned throughput in Azure Cosmos DB](../set-throughput.md)
- [Create Azure Cosmos containers and databases with autoscale throughput](../provision-throughput-autoscale.md)
- [Azure Cosmos DB serverless](../serverless.md)

## Partitioning

Partitioning in Azure Cosmos DB is similar to partitioning in Apache Cassandra. One of the main differences is that Azure Cosmos DB is more optimized for *horizontal scale*. In Azure Cosmos DB, limits are placed on the amount of *vertical throughput* capacity that's available in any physical partition. The effect of this optimization is most noticeable when an existing data model has significant throughput skew.

Take steps to ensure that your partition key design will result in a relatively uniform distribution of requests. For more information about how logical and physical partitioning work and limits on throughput capacity (request units per second, measured as *RU/s*) per partition, see [Partitioning in the Azure Cosmos DB Cassandra API](cassandra-partitioning.md).

## Scaling

In native Apache Cassandra, increasing capacity and scale involves adding new nodes to a cluster and ensuring that the nodes are properly added to the Cassandra ring. In Azure Cosmos DB, adding nodes is transparent and automatic. Scaling is a function of how many [request units](../request-units.md) are provisioned for your keyspace or table. Scaling in physical machines occurs when either physical storage or required throughput reaches limits allowed for a logical or a physical partition. For more information, see [Partitioning in the Azure Cosmos DB Cassandra API](cassandra-partitioning.md).

## Rate limiting

A challenge of provisioning [request units](../request-units.md), particularly if you're using [provisioned throughput](../set-throughput.md), is rate limiting. Azure Cosmos DB returns rate-limited (429) errors if clients consume more resources (RU/s) than the amount you provisioned. The Cassandra API in Azure Cosmos DB translates these exceptions to overloaded errors on the Cassandra native protocol. For information about how to avoid rate limiting in your application, see [Prevent rate-limiting errors for Azure Cosmos DB API for Cassandra operations](prevent-rate-limiting-errors.md).

## Apache Spark connector

Many Apache Cassandra users use the Apache Spark Cassandra connector to query their data for analytical and data movement needs. You can connect to the Cassandra API the same way and by using the same connector. Before you connect to the Cassandra API, we recommend that you review [Connect to the Azure Cosmos DB Cassandra API from Spark](connect-spark-configuration.md). In particular, see the section [Optimize Spark connector throughput configuration](connect-spark-configuration.md#optimizing-spark-connector-throughput-configuration).  

## Troubleshoot common issues

For solutions to common issues, see [Troubleshoot common issues in the Azure Cosmos DB Cassandra API](troubleshoot-common-issues.md).

## Next steps

- Learn about [partitioning and horizontal scaling in Azure Cosmos DB](../partitioning-overview.md).
- Learn about [provisioned throughput in Azure Cosmos DB](../request-units.md).
- Learn about [global distribution in Azure Cosmos DB](../distribute-data-globally.md).

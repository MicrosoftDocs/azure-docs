---
title: Introduction to Azure Cosmos DB Spark API 
description: Learn how you can use Azure Cosmos DB Spark API to run operational analytics and AI
ms.service: cosmos-db
ms.topic: overview 
ms.date: 05/06/2019
author: rimman
ms.author: rimman
---

# Introduction to Azure Cosmos DB Spark API (preview) 

Spark API in Azure Cosmos DB allows you to run operational analytics directly against the petabytes of data stored in an Azure Cosmos account, using the popular OSS analytical engines like Apache Spark.

Azure Cosmos DB Spark API provides the native support for Apache Spark jobs to execute directly on your globally distributed Cosmos databases. With these capabilities, developers, data engineers, and data scientists can use Azure Cosmos DB as a flexible, scalable, and performant data platform to run both **OLTP and OLAP/HTAP** workloads. 

> [!NOTE]
> Azure Cosmos DB Spark API is currently in limited preview. To sign-up for the preview, navigate to [sign-up for the preview](https://aka.ms/cosmos-spark-preview) page. 

Spark API in Azure Cosmos DB offers the following benefits:

* You can get the fastest time to insight for the geographically distributed users and data.

* You can simplify the architecture of your solution and lower the [Total Cost of Ownership](total-cost-ownership.md) (TCO). The system will have the least number of data processing components and avoids any unnecessary data movement among them.

* Creates a [security](secure-access-to-data.md), [compliance, and auditing boundary that encompasses all the data under management.

* Provides "always on"/ [highly available](high-availability.md) end-user analytics that are backed by stringent SLAs.

[Azure Cosmos DB Spark API visualization](./media/spark-api-introduction/spark-api-visualization.png)
 
With Azure Cosmos DB Spark API, you can easily build and deploy AI and deep learning models, predictive analytics, recommendations, IoT, customer 360, fraud detection, text sentiment, clickstream, analysis, etc. workloads directly on your Azure Cosmos DB data. 

You can set up batch and streaming ETL job in Azure Cosmos DB, without having to go outside the database service or add additional compute services. You can elastically scale the compute environment when you need to perform ETL job and scale it back down when the job is done.

The Azure Cosmos DB Spark API supports built-in Machine Learning support in the Apache Spark runtimes, for example, Spark MLLib and native support for Microsoft Machine Learning for Spark, Azure Machine Learning, and Cognitive Services. With these features, data scientists, data engineers, and data analysts can build and operationalize ML models directly within Azure Cosmos DB, in a fraction of time and with the low cost.


## Key benefits

### Globally distributed, low latency operational analytics and AI

With the Apache Spark on the globally distributed Azure Cosmos database, you can now get quick time-to-insight all around the world. Azure Cosmos DB enables **globally distributed, low latency operational analytics** at elastic scale with three key techniques:

1. Since your Azure Cosmos database is globally distributed, all the data is ingested locally where the producers of the data (for example, users) are located. The queries are served against the local replicas closest to both the producers and the consumers of data regardless of where they are located in the world. 

1. All your analytical queries are executed directly on the indexed data stored inside the data partitions without requiring any unnecessary data movement. 

1. Because Spark is colocated with Azure Cosmos DB, fewer intermediate translations and data movements take place, resulting in a better performance and scalability.

### Unified serverless experience for Apache Spark

As a multi-model database, Azure Cosmos DB now expands its support for OSS APIs by providing a 
**unified serverless experience for Apache Spark** with key-value, document, graph, column family data models. Different data models are supported using MongoDB, Cassandra, Gremlin, Etcd, and SQL APIs - all operating on the same underlying data. 

With Spark API, you can natively support applications written in Scala, Python, Java, and use several tightly integrated libraries for SQL. These libraries include ([Spark SQL](https://spark.apache.org/sql/)), machine learning (Spark [MLlib](https://spark.apache.org/mllib/)), stream processing ([Spark Structured Streaming](https://spark.apache.org/streaming/)), and graph processing (Spark [GraphFrames]( https://docs.databricks.com/spark/latest/graph-analysis/graphframes/user-guide-python.html)). These tools make it easier to leverage the Spark API for a variety of use cases. You don’t have to deal with managing Spark or Spark clusters. You can use the familiar Apache Spark APIs and **Jupyter notebooks** for analytics and SQL API or any of the OSS NoSQL APIs like Cassandra for transactional processing on the same underlying data at the same time.

### No schema or index management

Unlike traditional analytical databases, with Azure Cosmos DB, data engineers, and data scientists no longer need to deal with cumbersome schema and index management. The database engine in Azure Cosmos DB does not require any explicit schema or index management and it is capable of automatically indexing all the data it ingests to serve the Apache Spark queries quickly. 

### Consistency choices

Since the Apache Spark jobs are executed in the data partitions of your Azure Cosmos database, the queries will get the [five well-defined consistency choices](consistency-levels.md). These consistency models give the flexibility to choose strict consistency to provide the most accurate results for machine learning algorithms without compromising the latency and high availability. 

### SLAs

The Apache Spark jobs will have the Azure Cosmos DB benefits such as industry leading comprehensive [SLAs](https://azure.microsoft.com/en-us/support/legal/sla/documentdb/v1_1/) (99.999) without any overhead of managing separate Apache Spark clusters.. These SLAs encompass throughput, latency at the 99th percentile, consistency, and high availability. 

### Mixed workloads

The integration of Apache Spark into Azure Cosmos DB bridges the transactional and analytic separation, which has been one of the major customer pain points when building cloud-native applications at global scale. 

## Next Steps

* To learn about the benefits of Azure Cosmos DB, see the [overview](introduction.md) article.
* [Get started with Azure Cosmos DB's API for MongoDB](mongodb-introduction.md)
* [Get started with Azure Cosmos DB Cassandra API](cassandra-introduction.md)
* [Get started with Azure Cosmos DB Gremlin API](graph-introduction.md)
* [Get started with Azure Cosmos DB Table API](table-introduction.md)





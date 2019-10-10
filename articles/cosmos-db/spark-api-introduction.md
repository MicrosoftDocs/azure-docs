---
title: Introduction to the built-in operational analytics in Azure Cosmos DB with Apache Spark
description: Learn how you can use the built-in support for Apache Spark in Azure Cosmos DB to run operational analytics and AI
ms.service: cosmos-db
ms.topic: overview 
ms.date: 09/26/2019
author: rimman
ms.author: rimman
---

# Built-in operational analytics in Azure Cosmos DB with Apache Spark

With Azure Cosmos DB, you can run globally distributed, low-latency analytics and AI on transactional data. With native support for Apache Spark and Jupyter notebooks, Azure Cosmos DB helps reduce time to insights. Because the data is ingested, served, and analytics are run against the local database replica in an Azure region. You can directly execute Apache Spark queries on indexed multi-model data stored within your data partitions.

The built-in support for Apache Spark in Azure Cosmos DB allows you to run analytics from Apache Spark against your data stored in an Azure Cosmos account. It provides the native support for Apache Spark jobs to execute directly on your globally distributed Cosmos databases. With these capabilities, developers, data engineers, and data scientists can use Azure Cosmos DB as a flexible, scalable, and performant data platform to run both **OLTP and OLAP/HTAP** workloads.

The Apache Spark support in Azure Cosmos DB offers the following benefits:

* You can get the fastest time to insight for the geographically distributed users and data.

* You can simplify the architecture of your solution and lower the [Total Cost of Ownership](total-cost-ownership.md) (TCO). The system will have the least number of data processing components and avoids any unnecessary data movement among them.

* Creates a [security](secure-access-to-data.md), [compliance](compliance.md), and auditing boundary that encompasses all the data under management.

* Provides "always on" or [highly available](high-availability.md) end-user analytics that are backed by stringent SLAs.

![Apache Spark support in Azure Cosmos DB visualization](./media/spark-api-introduction/spark-api-visualization.png)
 
Using the Apache Spark support in Azure Cosmos DB, you can build and deploy solutions such as AI and deep learning models, predictive analytics, recommendations, IoT, customer 360, fraud detection, text sentiment, clickstream analysis. These solutions work directly against your Azure Cosmos DB data.

You can set up batch and streaming ETL job in Azure Cosmos DB, without having to go outside the database service or add additional compute services. You can elastically scale the compute environment when you need to perform ETL job and scale it back down when the job is done.

The Apache Spark support in Azure Cosmos DB offers built-in Machine Learning support in the Apache Spark runtimes. The runtimes include Spark MLLib, Microsoft Machine Learning for Spark, Azure Machine Learning, and Cognitive Services. With these features, data scientists, data engineers, and data analysts can build and operationalize machine learning models directly within Azure Cosmos DB, in a fraction of time and with the low cost.


## Key benefits

### Low latency operational analytics and AI

With Apache Spark on the globally distributed Azure Cosmos database, you can now get quick time-to-insight all around the world. Azure Cosmos DB enables **globally distributed, low latency operational analytics** at elastic scale with three key techniques:

* Since your Azure Cosmos database is globally distributed, all the data is ingested locally where the producers of the data (for example, users) are located. The queries are served against the local replicas closest to both the producers and the consumers of data regardless of where they are located in the world.

* All your analytical queries are executed directly on the indexed data stored inside the data partitions without requiring any unnecessary data movement.

* Because Spark is colocated with Azure Cosmos DB, fewer intermediate translations and data movements take place, resulting in a better performance and scalability.

* All the Azure Cosmos DB core features such as multi-master, automatic failover, Availability Zones, etc. are available to built-in Apache Spark in Azure Cosmos DB.

### Unified serverless experience for Apache Spark

As a multi-model database, Azure Cosmos DB now expands its support for OSS APIs by providing a **unified serverless experience for Apache Spark** with key-value, document, graph, column family data models. Different data models are supported using MongoDB, Cassandra, Gremlin, Etcd, and SQL APIs - all operating on the same underlying data. 

With the Apache Spark support in Azure Cosmos DB, you can natively support applications written in Scala, Python, Java, and use several tightly integrated libraries for SQL. These libraries include ([Spark SQL](https://spark.apache.org/sql/)), machine learning (Spark [MLlib](https://spark.apache.org/mllib/)), stream processing ([Spark Structured Streaming](https://spark.apache.org/streaming/)), and graph processing (Spark [GraphFrames]( https://docs.databricks.com/spark/latest/graph-analysis/graphframes/user-guide-python.html)). These tools make it easier to use the Apache Spark for a variety of use cases. You don’t have to deal with managing Spark or Spark clusters. You can use the familiar Apache Spark APIs and **Jupyter notebooks** for analytics and SQL API or any of the OSS NoSQL APIs like Cassandra for transactional processing on the same underlying data at the same time.

### No schema or index management

Unlike traditional analytical databases, with Azure Cosmos DB, data engineers, and data scientists no longer need to deal with cumbersome schema and index management. The database engine in Azure Cosmos DB does not require any explicit schema or index management and it is capable of automatically indexing all the data it ingests to serve the Apache Spark queries quickly.

### Consistency choices

Since the Apache Spark jobs are executed in the data partitions of your Azure Cosmos database, the queries will get the [five well-defined consistency choices](consistency-levels.md). These consistency models give the flexibility to choose strict consistency to provide the most accurate results for machine learning algorithms without compromising the latency and high availability.

### Comprehensive SLAs

The Apache Spark jobs will have the Azure Cosmos DB benefits such as industry leading comprehensive [SLAs](https://azure.microsoft.com/support/legal/sla/documentdb/v1_1/) (99.999) without any overhead of managing separate Apache Spark clusters. These SLAs encompass throughput, latency at the 99th percentile, consistency, and high availability. 

### Mixed operational and analytical workloads with complete isolation

The integration of Apache Spark into Azure Cosmos DB bridges the transactional and analytic separation, which has been one of the major customer pain points when building cloud-native applications at global scale. The OLTP and OLAP workloads run side-by-side and do not interfere with each other.

### Low-latency analytical and transactional storage

Azure Cosmos DB natively stores data in two distinct storage tiers: transactional (row-oriented) and analytical storage (column-oriented, in Apache Parquet file format). It replicates the data in each tier globally and allows users to independently manage data in these tiers based on the retention policies.

This storage architecture enables both mission-critical transactional and analytical workloads on the same globally distributed data. With Cosmos DB, you do not need any ETL operations or perform any unnecessary data movement. You can simply run both transactional and analytical workloads on the same underlying data. The transactional workloads can use the familiar transactional access APIs, including SQL, Cassandra, MongoDB, Gremlin and Etcd. Whereas the analytics and AI workloads can use the built-in Apache Spark SQL, ML frameworks and the entire Apache Spark toolchain.

### Snapshots and historical analytical queries

You can create on-demand or on-schedule snapshots of the columnar compressed data stored in the analytical tier to perform analytical queries directly against a specific snapshot. This feature enables flashback or time-travel analytical queries, rollbacks, full historical audit trails, and reproducible machine learning and AI experiments.

## Next steps

* To learn about the benefits of Azure Cosmos DB, see the [overview](introduction.md) article.
* [Get started with the Azure Cosmos DB API for MongoDB](mongodb-introduction.md)
* [Get started with the Azure Cosmos DB Cassandra API](cassandra-introduction.md)
* [Get started with the Azure Cosmos DB Gremlin API](graph-introduction.md)
* [Get started with the Azure Cosmos DB Table API](table-introduction.md)
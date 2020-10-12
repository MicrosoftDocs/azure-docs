---
title: 'Cosmos DB Apache Spark Connector for SQL API release notes and resources'
description: Learn about the Azure Cosmos DB Apache Spark Connector for SQL API, including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/12/2020
ms.author: anfeldma
ms.custom: devx-track-java
---

# Azure Cosmos DB Apache Spark Connector for Core (SQL) API: Release notes and resources
> [!div class="op_single_selector"]
> * [.NET SDK v3](sql-api-sdk-dotnet-standard.md)
> * [.NET SDK v2](sql-api-sdk-dotnet.md)
> * [.NET Core SDK v2](sql-api-sdk-dotnet-core.md)
> * [.NET Change Feed SDK v2](sql-api-sdk-dotnet-changefeed.md)
> * [Node.js](sql-api-sdk-node.md)
> * [Java SDK v4](sql-api-sdk-java-v4.md)
> * [Async Java SDK v2](sql-api-sdk-async-java.md)
> * [Sync Java SDK v2](sql-api-sdk-java.md)
> * [Spring Data v2](sql-api-sdk-java-spring-v2.md)
> * [Spring Data v3](sql-api-sdk-java-spring-v3.md)
> * [Spark Connector](sql-api-sdk-java-spark.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](sql-api-query-reference.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

You can accelerate big data analytics by using the Azure Cosmos DB Apache Spark Connector for Core (SQL). The Spark Connector allows you to run [Spark](https://spark.apache.org/) jobs on data stored in Azure Cosmos DB. Batch and stream processing are supported.

You can use the connector with [Azure Databricks](https://azure.microsoft.com/services/databricks) or [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/), which provide managed Spark clusters on Azure. The following table shows supported versions:

| Component | Version |
|---------|-------|
| Apache Spark | 2.4.*x*, 2.3.*x*, 2.2.*x*, and 2.1.*x* |
| Scala | 2.11 |
| Azure Databricks (runtime version) | Later than 3.4 |

> [!WARNING]
> This connector supports the core (SQL) API of Azure Cosmos DB.
> For the Cosmos DB API for MongoDB, use the [MongoDB Connector for Spark](https://docs.mongodb.com/spark-connector/master/).
> For the Cosmos DB Cassandra API, use the [Cassandra Spark connector](https://github.com/datastax/spark-cassandra-connector).
>

## Resources

| Resource | Link |
|---|---|
| **SDK download** | [Download latest .jar](https://aka.ms/CosmosDB_OLTP_Spark_2.4_LKG), [Maven](https://search.maven.org/search?q=a:azure-cosmosdb-spark_2.4.0_2.11) |
|**API documentation** | [Spark Connector reference]() |
|**Contribute to the SDK** | [Azure Cosmos DB Connector for Apache Spark on GitHub](https://github.com/Azure/azure-cosmosdb-spark) | 
|**Get started** | [Accelerate big data analytics by using the Apache Spark to Azure Cosmos DB connector](https://docs.microsoft.com/azure/cosmos-db/spark-connector#bk_working_with_connector) <br> [Use Apache Spark Structured Streaming with Apache Kafka and Azure Cosmos DB](https://docs.microsoft.com/azure/hdinsight/apache-kafka-spark-structured-streaming-cosmosdb?toc=/azure/cosmos-db/toc.json&bc=/azure/cosmos-db/breadcrumb/toc.json) | 

## Release history

### 3.3.0
#### New features
- Adds a new config option, `changefeedstartfromdatetime`, which can be used to specify the start time for when the changefeed should be processed. For more information, see [Config options](https://github.com/Azure/azure-cosmosdb-spark/wiki/Configuration-references).

### 3.2.0
#### Key bug fixes
- Fixes a regression that caused excessive memory consumption on the executors for large result sets (for example, with millions of rows), ultimately resulting in the error `java.lang.OutOfMemoryError: GC overhead limit exceeded`.

### 3.1.1
#### Key bug fixes
* Fixes a streaming checkpoint edge case in which the `ID` contains the pipe character (|) with the `ChangeFeedMaxPagesPerBatch` config applied.

### 3.1.0
#### New features
* Adds support for bulk updates when nested partition keys are used.
* Adds support for Decimal and Float data types during writes to Azure Cosmos DB.
* Adds support for Timestamp types when they're using Long (Unix epoch) as a value.

### 3.0.8
#### Key bug fixes
* Fixes typecast exception that occurs when the `WriteThroughputBudget` config is used.

### 3.0.7
#### New features
* Adds error information for bulk failures to exception and log.

### 3.0.6
#### Key bug fixes
* Fixes streaming checkpoint issues.

### 3.0.5
#### Key bug fixes
* To reduce noise, fixes log level of a message left unintentionally with level ERROR.

### 3.0.4
#### Key bug fixes
* Fixes a bug in structured streaming during partition splits. The bug could result in some missing change feed records or Null exceptions for checkpoint writes.

### 3.0.3
#### Key bug fixes
* Fixes a bug that causes a custom schema provided for readStream to be ignored.

### 3.0.2
#### Key bug fixes
* Fixes a regression (unshaded JAR includes all shaded dependencies) that increases build time by 50 percent.

### 3.0.1
#### Key bug fixes
* Fixes a dependency problem that causes Direct Transport over TCP to fail with RequestTimeoutException.

### 3.0.0
#### New features
* Improves connection management and connection pooling to reduce the number of metadata calls.

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps

Learn more about [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/).

Learn more about [Apache Spark](https://spark.apache.org/).

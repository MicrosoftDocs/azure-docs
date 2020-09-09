---
title: 'Azure Cosmos DB Apache Spark Connector for SQL API release notes and resources'
description: Learn all about the Azure Cosmos DB Apache Spark Connector for SQL API including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 08/12/2020
ms.author: anfeldma
ms.custom: devx-track-java
---

# Azure Cosmos DB Apache Spark Connector for Core (SQL) API: release notes and resources
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

Accelerate big data analytics by using the Azure Cosmos DB Apache Spark Connector for Core (SQL). The Spark Connector allows you to run [Spark ](https://spark.apache.org/) jobs on data stored in Azure Cosmos DB. Batch and stream processing are supported.

You can use the connector with [Azure Databricks](https://azure.microsoft.com/services/databricks) or [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/), which provide managed Spark clusters on Azure. The following table shows supported Spark versions.

| Component | Version |
|---------|-------|
| Apache Spark | 2.4.x, 2.3.x, 2.2.x, and 2.1.x |
| Scala | 2.11 |
| Azure Databricks runtime version | > 3.4 |

> [!WARNING]
> This connector supports the core (SQL) API of Azure Cosmos DB.
> For Cosmos DB for MongoDB API, use the [MongoDB Spark connector](https://docs.mongodb.com/spark-connector/master/).
> For Cosmos DB Cassandra API, use the [Cassandra Spark connector](https://github.com/datastax/spark-cassandra-connector).
>

## Helpful content

| Content | Link |
|---|---|
| **SDK download** | [Download from Apache Spark](https://aka.ms/CosmosDB_OLTP_Spark_2.4_LKG) |
|**API documentation** | [Spark Connector reference]() |
|**Contribute to SDK** | [Azure Cosmos DB Connector for Apache Spark on GitHub](https://github.com/Azure/azure-cosmosdb-spark) | 
|**Get started** | [Accelerate big data analytics by using the Apache Spark to Azure Cosmos DB connector](https://docs.microsoft.com/azure/cosmos-db/spark-connector#bk_working_with_connector) <br> [Use Apache Spark Structured Streaming with Apache Kafka and Azure Cosmos DB](https://docs.microsoft.com/azure/hdinsight/apache-kafka-spark-structured-streaming-cosmosdb?toc=/azure/cosmos-db/toc.json&bc=/azure/cosmos-db/breadcrumb/toc.json) | 

## Release history

### 3.1.1
#### New features
#### Key bug fixes
* Fixes a streaming checkpoint edge case where in the "id" contains "|" character with the "ChangeFeedMaxPagesPerBatch" config applied

### 3.1.0
#### New features
* Adds support for bulk updates when using nested partition keys
* Adds support for Decimal and Float data types during writes to Cosmos DB.
* Adds support for Timestamp types when they are using Long (unix Epoch) as a value
#### Key bug fixes

### 3.0.8
#### New features
#### Key bug fixes
* Fixes type cast exception when using "WriteThroughputBudget" config.

### 3.0.7
#### New features
* Adds error information for bulk failures to exception and log.
#### Key bug fixes

### 3.0.6
#### New features
#### Key bug fixes
* Fixes streaming checkpoint issues.

### 3.0.5
#### New features
#### Key bug fixes
* Fixes log level of a message left unintentionally with level ERROR to reduce noise

### 3.0.4
#### New features
#### Key bug fixes
* Fixes a bug in structured streaming during partition splits - possibly resulting in missing some change feed records or seeing Null exceptions for checkpoint writes

### 3.0.3
#### New features
#### Key bug fixes
* Fixes a bug where a custom schema provided for readStream is ignored

### 3.0.2
#### New features
#### Key bug fixes
* Fixes regression (unshaded JAR includes all shaded dependencies) which increased build time by 50%

### 3.0.1
#### New features
#### Key bug fixes
* Fixes a dependency issue causing Direct Transport over TCP to fail with RequestTimeoutException

### 3.0.0
#### New features
* Improves connection management and connection pooling to reduce number of metadata calls
#### Key bug fixes

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../../includes/cosmos-db-sdk-faq.md)]

## Next steps

To learn more about Cosmos DB, see [Microsoft Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/) service page.

To learn more about Apache Spark, see [the homepage](https://spark.apache.org/).
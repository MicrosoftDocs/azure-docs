---
title: 'Azure Cosmos DB Apache Spark 2 OLTP Connector for API for NoSQL release notes and resources'
description: Learn about the Azure Cosmos DB Apache Spark 2 OLTP Connector for API for NoSQL, including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Async Java SDK.
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: java
ms.topic: reference
ms.date: 04/06/2021
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: devx-track-java, ignite-2022, devx-track-extended-java
---

# Azure Cosmos DB Apache Spark 2 OLTP Connector for API for NoSQL: Release notes and resources
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[SDK selector](../includes/cosmos-db-sdk-list.md)]

You can accelerate big data analytics by using the Azure Cosmos DB Apache Spark 2 OLTP Connector for NoSQL. The Spark Connector allows you to run [Spark](https://spark.apache.org/) jobs on data stored in Azure Cosmos DB. Batch and stream processing are supported.

You can use the connector with [Azure Databricks](https://azure.microsoft.com/services/databricks) or [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/), which provide managed Spark clusters on Azure. The following table shows supported versions:

| Component | Version |
|---------|-------|
| Apache Spark | 2.4.*x*, 2.3.*x*, 2.2.*x*, and 2.1.*x* |
| Scala | 2.11 |
| Azure Databricks (runtime version) | Later than 3.4 |

> [!WARNING]
> This connector supports the API for NoSQL of Azure Cosmos DB.
> For the Azure Cosmos DB for MongoDB, use the [MongoDB Connector for Spark](https://docs.mongodb.com/spark-connector/master/).
> For the Azure Cosmos DB for Apache Cassandra, use the [Cassandra Spark connector](https://github.com/datastax/spark-cassandra-connector).
>

## Resources

| Resource | Link |
|---|---|
| **SDK download** | [Download latest .jar](https://aka.ms/CosmosDB_OLTP_Spark_2.4_LKG), [Maven](https://search.maven.org/search?q=a:azure-cosmosdb-spark_2.4.0_2.11) |
|**API documentation** | [Spark Connector reference]() |
|**Contribute to the SDK** | [Azure Cosmos DB Connector for Apache Spark on GitHub](https://github.com/Azure/azure-cosmosdb-spark) | 
|**Get started** | [Accelerate big data analytics by using the Apache Spark to Azure Cosmos DB connector](./quickstart-spark.md) <br> [Use Apache Spark Structured Streaming with Apache Kafka and Azure Cosmos DB](../../hdinsight/apache-kafka-spark-structured-streaming-cosmosdb.md?toc=/azure/cosmos-db/toc.json&bc=/azure/cosmos-db/breadcrumb/toc.json) | 

## Release history
* [Release notes](https://github.com/Azure/azure-cosmosdb-spark/blob/2.4/CHANGELOG.md)]

## FAQ
[!INCLUDE [cosmos-db-sdk-faq](../includes/cosmos-db-sdk-faq.md)]

## Next steps

Learn more about [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/).

Learn more about [Apache Spark](https://spark.apache.org/).

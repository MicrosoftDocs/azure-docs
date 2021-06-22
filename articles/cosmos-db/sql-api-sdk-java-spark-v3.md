---
title: 'Azure Cosmos DB Apache Spark 3 OLTP Connector for SQL API (Preview) release notes and resources'
description: Learn about the Azure Cosmos DB Apache Spark 3 OLTP Connector for SQL API, including release dates, retirement dates, and changes made between each version of the Azure Cosmos DB SQL Java SDK.
author: anfeldma-ms
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: java
ms.topic: reference
ms.date: 06/21/2021
ms.author: anfeldma
ms.custom: devx-track-java
---

# Azure Cosmos DB Apache Spark 3 OLTP Connector for Core (SQL) API: Release notes and resources
[!INCLUDE[appliesto-sql-api](includes/appliesto-sql-api.md)]

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
> * [Spark 3 OLTP Connector](sql-api-sdk-java-spark-v3.md)
> * [Spark 2 OLTP Connector](sql-api-sdk-java-spark.md)
> * [Python](sql-api-sdk-python.md)
> * [REST](/rest/api/cosmos-db/)
> * [REST Resource Provider](/rest/api/cosmos-db-resource-provider/)
> * [SQL](./sql-query-getting-started.md)
> * [Bulk executor - .NET v2](sql-api-sdk-bulk-executor-dot-net.md)
> * [Bulk executor - Java](sql-api-sdk-bulk-executor-java.md)

**Azure Cosmos DB Spark 3 OLTP connector** provides Apache Spark v3 support for Azure Cosmos DB using 
the SQL API.
[Azure Cosmos DB](introduction.md) is a globally-distributed database service which allows 
developers to work with data using a variety of standard APIs, such as SQL, MongoDB, Cassandra, Graph, and Table.

## Documentation

- [Getting started](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/quick-start.md)
- [Catalog API](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/catalog-api.md)
- [Configuration Parameter Reference](https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/cosmos/azure-cosmos-spark_3-1_2-12/docs/configuration-reference.md)


## Version compatibility

| Connector     | Spark         | Minimum Java version | Supported Scala versions |
| ------------- | ------------- | -------------------- | -----------------------  |
| 4.0.0         | 3.1.1         |        8             | 2.12                     |

## Download 

You can use the maven coordinate of the jar to auto install the Spark Connector to your Databricks Runtime 8 from Maven:
`com.azure.cosmos.spark:azure-cosmos-spark_3-1_2-12:4.1.0`

You can also integrate against Cosmos DB Spark Connector in your SBT project:
```scala
libraryDependencies += "com.azure.cosmos.spark" % "azure-cosmos-spark_3-1_2-12" % "4.1.0"
```

Cosmos DB Spark Connector is available on [Maven Central Repo](https://search.maven.org/artifact/com.azure.cosmos.spark/azure-cosmos-spark_3-1_2-12/).

### General

If you encounter any bug, please file an issue [here](https://github.com/Azure/azure-sdk-for-java/issues/new).

To suggest a new feature or changes that could be made, file an issue the same way you would for a bug.

[!INCLUDE[Changelog](~/azure-sdk-for-java-cosmos-db/sdk/cosmos/azure-cosmos-spark_3-1_2-12/CHANGELOG.md)]

## Next steps

Review our [quickstart guide for working with Azure Cosmos DB Spark 3 OLTP connector](create-sql-api-spark.md).
